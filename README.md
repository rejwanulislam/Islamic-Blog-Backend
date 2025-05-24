# 🕌 Islamick Blog (Backend)

The backend API for **Islamick Blog**, built with **Node.js**, **Express**, and **MongoDB**. It provides secure RESTful endpoints for blog management, user authentication via JWT, commenting, and wishlist features.

🔗 **Frontend Repo:** https://github.com/RejwanulIslam/Islamic-Blog-Fontend  
🌐 **Frontend Live Site:** [https://islamic-blog.netlify.app](https://islamic-blog.netlify.app)

---

## 📦 Features

- Blog CRUD operations
- Firebase-based login (JWT generated in backend)
- JWT-based protected routes using cookies
- Blog comments
- Wishlist system
- Word count analytics (top 10 blogs)
- CORS and secure cookie setup
- MongoDB Atlas for cloud database
- Ready for deployment on **Vercel**

---

## ⚙️ Tech Stack

- **Node.js** – JavaScript runtime
- **Express.js** – Backend framework
- **MongoDB** – NoSQL database
- **jsonwebtoken** – JWT token handling
- **cookie-parser** – For HTTP-only cookies
- **dotenv** – Environment variable handling
- **CORS** – Cross-origin requests
- **Vercel** – Deployment

---

## 📁 Project Structure
backend/
├── index.js # Main server file
├── .env # Environment variables
├── package.json # NPM dependencies
├── vercel.json # Vercel deployment config
└── ...

yaml
Copy
Edit

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
JWT_SECRET=your_secret_key_here
🚀 Getting Started
1. Install dependencies
bash
Copy
Edit
npm install
2. Start the server
bash
Copy
Edit
node index.js
The server will run on http://localhost:5000 by default.

📡 API Endpoints
🔑 Authentication
Method	Route	Description
POST	/jwt	Generate JWT and set cookie
GET	/logout	Clear authentication cookie

📖 Blog
Method	Route	Description
GET	/allblog	Get all blog posts
GET	/allblog/:id	Get a single blog by ID
POST	/allblog	Add a new blog (JWT required)
PATCH	/allblog/:id	Update a blog

💬 Comments
Method	Route	Description
POST	/comment	Add a comment to a blog
GET	/comment/:Id	Get comments for a blog by ID

📌 Wishlist
Method	Route	Description
POST	/wishlist	Add blog to user's wishlist
GET	/wishlist/:email	Get user's wishlist (JWT req.)

📊 Analytics
Method	Route	Description
GET	/wordcount	Get top 10 blogs by word count

🧰 Middleware
JWT-protected routes use the following middleware:

js
Copy
Edit
const veryfiToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(403).send({ message: 'unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send({ message: 'unauthorized' });
    req.user = decoded;
    next();
  });
};
🚀 Deployment (Vercel)
This backend is configured to be deployed on Vercel using the vercel.json config:

json
Copy
Edit
{
  "version": 2,
  "builds": [{ "src": "./index.js", "use": "@vercel/node" }],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/",
      "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    }
  ]
}

🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request for suggestions and improvements.
