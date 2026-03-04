# 🚀 FreelanceHub - Mini Fiverr Clone

A full-stack freelance job bidding platform built with the MERN stack.

![FreelanceHub](https://img.shields.io/badge/MERN-Stack-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Features

- 👤 **User Authentication** — Register/Login with JWT
- 💼 **Dual Roles** — Client & Freelancer
- 📋 **Project Posting** — Clients post jobs with budget & deadline
- 💰 **Bidding System** — Freelancers place bids with cover letters
- ✅ **Contract Management** — Accept bids, create contracts
- 💬 **Messaging** — In-app messaging between client & freelancer
- 📊 **Dashboard** — Track projects, bids & contracts
- 🔒 **Protected Routes** — Role-based access control

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

### Frontend
- React.js + Vite
- React Router DOM
- Axios
- React Hot Toast

## 📁 Project Structure
```
freelance-platform/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── bidController.js
│   │   ├── messageController.js
│   │   └── contractController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Bid.js
│   │   ├── Message.js
│   │   └── Contract.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── bids.js
│   │   ├── messages.js
│   │   └── contracts.js
│   ├── .env
│   └── server.js
│
└── frontend/
    └── src/
        ├── api/
        ├── components/
        ├── context/
        └── pages/
```

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/pankajtakmoge2110/freelance-platform.git
cd freelance-platform
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend folder:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/projects | Get all open projects |
| POST | /api/projects | Create project (client) |
| GET | /api/projects/:id | Get single project |
| PUT | /api/projects/:id | Update project (client) |
| DELETE | /api/projects/:id | Delete project (client) |
| GET | /api/projects/my | Get my projects |

### Bids
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/bids/:projectId | Place a bid (freelancer) |
| GET | /api/bids/:projectId | Get bids for project (client) |
| GET | /api/bids/my | Get my bids (freelancer) |
| PUT | /api/bids/:bidId/accept | Accept a bid (client) |
| DELETE | /api/bids/:bidId | Withdraw bid (freelancer) |

### Contracts
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/contracts | Create contract (client) |
| GET | /api/contracts | Get my contracts |
| GET | /api/contracts/:id | Get single contract |
| PUT | /api/contracts/:id/complete | Mark complete (freelancer) |
| PUT | /api/contracts/:id/approve | Approve completion (client) |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/messages | Send message |
| GET | /api/messages/:projectId | Get project messages |
| GET | /api/messages/unread | Get unread count |
| GET | /api/messages/conversations | Get all conversations |

## 🚀 Future Improvements

- [ ] Stripe payment integration
- [ ] Real-time chat with Socket.io
- [ ] Email notifications
- [ ] Profile pictures with Cloudinary
- [ ] Reviews & ratings system
- [ ] Search & filter projects

## 👨‍💻 Author

**Pankaj Takmoge**
- GitHub: [@pankajtakmoge2110](https://github.com/pankajtakmoge2110)

## 📄 License

This project is licensed under the MIT License.
