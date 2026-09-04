# 🏠 GharStay

**GharStay** is a full-stack web application designed to help users discover, explore, and manage accommodation and rental properties through an easy-to-use platform.

The project provides a complete flow for property listings, user authentication, property management, and image-based accommodation details.

---

## 🚀 Features

* 🔐 User Registration & Login
* 👤 User Authentication & Authorization
* 🏠 Create and Manage Property Listings
* 🔎 Browse Available Properties
* 📍 View Property Details
* 🖼️ Property Image Upload
* ✏️ Edit Existing Listings
* 🗑️ Delete Listings
* ⭐ Reviews & Ratings
* 📱 Responsive User Interface
* 🔒 Protected Routes
* ⚡ Server-side validation and error handling

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* EJS
* Bootstrap

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication & Other Tools

* Passport.js
* Express Session
* Cloudinary
* Multer
* Method-Override
* Connect-Flash
* REST APIs
* Git & GitHub

---

## 🏗️ Project Architecture

```text
GharStay
│
├── controllers/
├── models/
├── routes/
├── views/
│   ├── layouts/
│   ├── listings/
│   ├── users/
│   └── reviews/
│
├── public/
│   ├── css/
│   ├── js/
│   └── images/
│
├── utils/
├── middleware/
├── app.js
├── package.json
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/GharStay.git
```

### 2. Navigate to the project

```bash
cd GharStay
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create environment variables

Create a `.env` file in the root directory:



> Never upload your `.env` file or API credentials to GitHub.

### 5. Start the application

```bash
node app.js
```

For development:

```bash
nodemon app.js
```

Open your browser and visit:

```text
http://localhost:8080
```

---

## 🔑 Authentication

GharStay uses authentication and authorization to protect user-specific functionality.

Users can:

* Register an account
* Log in and log out
* Create their own listings
* Edit their listings
* Delete their listings
* Add reviews where permitted

Protected routes ensure that users can only perform authorized operations.

---

## 🗄️ Database

The application uses **MongoDB** with **Mongoose** for database management.

Main data entities include:

```text
User
Listing
Review
```

Mongoose schemas are used to structure and validate application data.

---

## ☁️ Image Upload

Property images are uploaded using **Multer** and stored using **Cloudinary**.

The general flow is:

```text
User
  ↓
Image Upload
  ↓
Multer
  ↓
Cloudinary
  ↓
Image URL
  ↓
MongoDB
```





## 📌 Future Improvements

Some planned improvements include:

* 💳 Online payment integration
* 📅 Booking and reservation system
* 🗺️ Interactive maps and location search
* 🔔 Notifications
* ❤️ Wishlist / Favorites
* 🔍 Advanced property filtering
* 📊 Owner dashboard
* 📱 Progressive Web App support

---

## 📚 What I Learned

While developing GharStay, I gained practical experience in:

* Building RESTful web applications
* MVC architecture
* Node.js and Express.js
* MongoDB database design
* Authentication and authorization
* Session management
* Image upload and cloud storage
* Middleware development
* CRUD operations
* Server-side validation
* Git and GitHub
* Deployment and environment configuration

---

## 👨‍💻 Author

**Ajay Gawande**

Full Stack Developer

GitHub: `https://github.com/ajay-gawande`

---

## 📄 License

This project is developed for educational and portfolio purposes.

