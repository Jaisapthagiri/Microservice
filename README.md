# Quick Chat

A real-time chat application built with **Django**,**Node.js**, **Express**, **Socket.IO**, **MongoDB**,**MySQL**, and a responsive **React** frontend. Quick Chat provides seamless real-time messaging, user authentication and persistent chat history.

---

## 🚀 Features

### **Real-Time Communication**

* Instant messaging using **Socket.IO**.
* Live message delivery for both sender and receiver.

### **User Authentication**

* Secure login and registration using **JWT-based authentication**.
* Protected routes and token validation middleware.

### **Chat Functionality**

* One-to-one messaging system.
* Persistent chat storage using **MongoDB**.
* Auto-scroll and instant UI updates for smooth UX.
* Fetch previous conversations between two users.

### **User Interface**

* Responsive layout built with React.
* Sidebar showing all registered users.

### **Backend Architecture**

* REST APIs for authentication and fetching chat data.
* Socket.IO layered on top for real-time communication.
* Modular controllers and routes for clean maintainable code.

### **Database (MongoDB)**

* User collection with secure hashed passwords.
* Chat collection storing sender, receiver, timestamps, and message content.

---

## 🛠️ Tech Stack

### **Frontend**

* React.js
* Axios
* Context API for state handling

### **Backend**

* Node.js
* Express.js
* Rest_Framework
* Django
* JWT Authentication
* Socket.IO for real-time messaging

### **Database**

* MongoDB with Mongoose ODM
* MySQL with ORM

---

## 🔧 Installation & Setup

### **1. Clone the Repository**

```bash
git clone https://github.com/yourusername/quick-chat.git
cd quick-chat
```

### **2. Backend Django Setup**

```bash
cd chatServer
npm install
```

### **. Backend Django Setup**
```bash
cd userServer
pip install
```

#### Create a `.env` file:

```
MONGO_URI=your_mongo_connection
JWT_SECRET=your_secret_key
PORT=5000
```

Run the backend:

```bash
npm run dev
```

```bash
python manage.py runserver
```

### **3. Frontend Setup**

```bash
cd frontend
npm install
npm start
```

---

## 📡 API Endpoints

### **Auth Routes**

* `POST /register` – Create a new user
* `POST /login` – User login with JWT return

### **Chat Routes**

* `POST /chat/send` – Send a message
* `GET /chat/messages/:userId` – Get messages between two users

---

## 🔌 Socket.IO Events

### **Server → Client**

* `receiveMessage` – Delivers message in real time
* `onlineUsers` – Sends list of currently active users

### **Client → Server**

* `join` – Attach user to their socket
* `sendMessage` – Emit new message to backend

---

## 📝 Future Improvements

* Group chat support
* Message reactions & typing indicators
* File and image sharing
* Push notifications

---