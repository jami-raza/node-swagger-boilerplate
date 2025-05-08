# 🔐 Node.js API – User & Admin System with WebSockets, Swagger, JWT, and Email Verification

This is a robust and scalable Node.js API project with the following key features:

- User and Admin roles
- Swagger documentation for both roles
- WebSocket messaging (user-to-user & group)
- Email verification using Nodemailer
- JWT-based authentication
- Server-side validation
- Logging with log rotation
- Rate limiting for all endpoints

---

## 🚀 Features

### 👥 Authentication & Roles
- Users can sign up using:
  - First Name
  - Last Name
  - Email
  - Password
  - Country
- Email verification is handled via Nodemailer.
- Admins **cannot sign up**. A default admin is seeded, and new admins can only be created by other admins.

### 📄 Swagger API Documentation
- Separate documentation per role:
  - `/api/docs/user`
  - `/api/docs/admin`

### 📬 Messaging System (via WebSockets)
- Users can:
  - Send messages to other users
  - Join groups
  - Send messages in groups
  - Leave groups

### ✅ Server-side Validation
- All API endpoints are protected with proper validation using middleware.

### 🔐 Authentication
- JWT is used for access control and secure endpoint access.

### 🔒 Security & Rate Limiting
- Rate limits are enforced across all endpoints to prevent abuse.

### 📑 Logging
- Server logs are maintained with **log rotation** using `winston` or similar library.

---

## 🛠️ Tech Stack

- **Node.js** + **Express**
- **Socket.IO** – Real-time communication
- **MongoDB** – Primary database
- **Mongoose** – ODM for MongoDB
- **JWT** – Authentication
- **Nodemailer** – Email verification
- **Swagger** – API Documentation
- **Express-validator** – Server-side validation
- **Winston / Morgan** – Logging with rotation
- **Express-rate-limit** – Rate limiting

---

## 📂 Project Structure

├── src/
│ ├── config/
│ ├── controllers/
│ ├── middlewares/
│ ├── models/
│ ├── routes/
│ ├── services/
│ ├── sockets/
│ ├── utils/
│ └── app.js
├── public/
├── .env
├── server.js
├── README.md

---

## 🚧 Getting Started

### 1. Clone the repo
```bash

git clone https://github.com/jami-raza/node-swagger-boilerplate.git
cd node-swagger-boilerplate
npm install

