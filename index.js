// Islamick-Blog
//3KlE5jV2dnAa0I8S
// require('crypto').randomBytes(64)
// require('crypto').randomBytes(64).toString('hex')

const express = require('express')
const cors = require('cors')
const app = express()
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 5000

require('dotenv').config();
app.use(express.json())
app.use(cookieParser())
app.use(cors(
  {
    origin: [
      'http://localhost:5173',
      'https://islamic-blog.netlify.app'
    ],
    credentials: true
  }
))



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://Islamick-Blog:3KlE5jV2dnAa0I8S@cluster0.0xslwlb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const allblogCollection = client.db("Islamick-Blog").collection("allblog");
    const blogCommentCollection = client.db("Islamick-Blog").collection("blogComment");
    const blogWishlistCollection = client.db("Islamick-Blog").collection("blogWishlist");




    //jwt
    app.post('/jwt', async (req, res) => {
      const email = req.body
      const token = jwt.sign(email, process.env.JWT_SECRET, { expiresIn: '365d' })
      console.log(token)
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      })
        .send({ success: true })

    })

    //clear cookis
    app.get('/logout', async (req, res) => {
      res.clearCookie('token', {
        maxAge: 0,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      }).send({ success: true, message: 'clear cookie successfull' })
    })


    //mildile ware and verufi token
    const veryfiToken = (req, res, next) => {
      const token = req.cookies.token
      if (!token) {
        res.status(403).send({ message: 'unauthroize' })
      }
      jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
          return res.status(403).send({ message: 'unauthroize' })
        }
        req.user = decoded
        next()
      })



    }







    app.post('/allblog', veryfiToken, async (req, res) => {
      const blog = req.body
      const blogemail = req.body.email
      const decodedemail = req.user.email
      if (blogemail == decodedemail) return res.status(403).send({ message: 'unauthroize' })

      const result = await allblogCollection.insertOne(blog)
      res.send(result)

    })

    app.get('/wordcount', async (req, res) => {
      const result = await allblogCollection.find().toArray()
      const blogwordcount = result.map(blog => ({ ...blog, wordCount: blog?.longdescription.split(/\s+/).length }))
      console.log(blogwordcount)

      const sortblog = blogwordcount.sort((a, b) => b.wordCount - a.wordCount).slice(0, 10)
      res.send(sortblog)

    })

    app.get('/allblog', async (req, res) => {
      const serch = req.query.serch || ''
      const category = req.query.category || ''
      let quary = {
        title: {
          $regex: serch,
          $options: 'i'
        }
      }
      if (category) quary.category = category
      const result = await allblogCollection.find(quary).toArray()
      res.send(result)
    })
    //single data get
    app.get('/allblog/:id', async (req, res) => {
      const id = req.params.id
      const quary = { _id: new ObjectId(id) }
      const result = await allblogCollection.findOne(quary)
      res.send(result)
    })
    //update blog
    app.patch('/allblog/:id', async (req, res) => {
      const id = req.params.id
      const data = req.body
      const quary = { _id: new ObjectId(id) }
      const update = {
        $set: {
          title: data?.title,
          image: data?.image,
          shortdescription: data?.shortdescription,
          longdescription: data?.longdescription,
          category: data?.category
        }
      }

      const result = await allblogCollection.updateOne(quary, update)
      res.send(result)
    })

    // post blog comment 
    app.post('/comment', async (req, res) => {

      const comment = req.body
      const result = await blogCommentCollection.insertOne(comment)
      res.send(result)
    })

    app.get('/comment/:Id', async (req, res) => {
      const blogid = req.params.Id
      const blogComment = { blogId: blogid }
      const result = await blogCommentCollection.find(blogComment).toArray()
      res.send(result)
    })

    //wishlist
    app.post('/wishlist', async (req, res) => {
      const blog = req.body
      const result = await blogWishlistCollection.insertOne(blog)
      res.send(result)

    })
    app.get('/wishlist/:email', veryfiToken, async (req, res) => {
      const decodeEmail = req.user?.email
      const email = req.params.email
      if (decodeEmail !== email) {
        return res.status(403).send({ message: 'unauthroize' })

      }
      const quary = { userEmail: email }
      const result = await blogWishlistCollection.find(quary).toArray()
      res.send(result)
    })


    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();
    // Send a ping to confirm a successful connection
   // await client.db("admin").command({ ping: 1 });
   // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('server is ok!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})