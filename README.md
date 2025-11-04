🛍️ Fashion Tee – MERN Full Stack eCommerce Website
🚀 Full Stack Project built with React, Node.js, Express.js, and MongoDB

This is a responsive eCommerce web application that allows users to view products, and an admin panel to manage product CRUD operations.
The project demonstrates end-to-end full stack development — from REST APIs to dynamic frontend integration.

🌟 Features
🧑‍💻 User Side

Browse products with responsive UI

Product details page

Add to cart (optional)

Dynamic product fetching from backend API

🛠️ Admin Side

Admin Dashboard for CRUD operations

Add, edit, and delete products and banners

Secure API calls (ready for JWT integration)

🧩 Tech Stack
Layer	Technology
Frontend	React (Vite) + Axios + Tailwind CSS
Backend	Node.js + Express.js
Database	MongoDB (Mongoose)
Hosting (optional)	Netlify (frontend) / Render / Vercel (backend)
📁 Folder Structure
my-website/
│
├── server/                # Backend (Express + MongoDB)
│   ├── models/            # Mongoose models
│   ├── routes/            # API route files
│   ├── controllers/       # Request handlers
│   ├── index.js           # Entry point
│   └── .env.example       # Environment variable sample
│
├── src/                   # Frontend (React)
│   ├── components/        # UI Components
│   ├── pages/             # React Pages
│   ├── App.jsx            # Main App component
│   └── main.jsx           # Entry point
│
├── package.json
└── README.md

⚙️ Installation & Setup
🔹 Prerequisites

Make sure you have installed:

Node.js (v18 or later)

MongoDB (local or Atlas)

npm or yarn

🖥️ Backend Setup
# Navigate to backend folder
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

🧾 Example .env file:
PORT=5001
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/fashiontee
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=mysecret


Run the backend:

npm run dev


Server will start at 👉 http://localhost:5001

💻 Frontend Setup
# Go back to project root
cd ..

# Install dependencies
npm install

# Create .env file
echo "VITE_API_BASE=http://localhost:5001" > .env


Run the frontend:

npm run dev


Frontend will start at 👉 http://localhost:5173

🌐 API Endpoints
Method	Endpoint	Description
GET	/api/products	Fetch all products
POST	/api/products	Add new product
PUT	/api/products/:id	Update product
DELETE	/api/products/:id	Delete product
GET	/api/banner	Fetch homepage banners
🧠 Key Learnings

Building REST APIs using Express.js

Integrating React frontend with backend APIs

Using MongoDB & Mongoose for data modeling

Environment configuration using .env

Deploying full stack applications

🛡️ Security & Best Practices

All secrets stored in .env (never commit credentials)

Cross-Origin requests handled via CORS

Code modularized for scalability

Ready for JWT-based authentication

📸 Screenshots (optional)

Add your app screenshots here to make it visually appealing.

🧑‍💼 Author

👨‍💻 Saiteja Govikar
📍 Hyderabad, India
🔗 Portfolio

🔗 LinkedIn

🔗 GitHub
