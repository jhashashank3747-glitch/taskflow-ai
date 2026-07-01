# TaskFlow AI 

A real-time collaborative task management board with AI-powered task breakdown — built with the MERN stack.

> Built as a portfolio project to demonstrate real-time architecture, AI integration, and full-stack development skills.

---

## ✨ Features

- **Real-time collaboration** — Multiple users can work on the same board simultaneously. Cards and lists sync instantly across all connected clients via Socket.io
- **AI task breakdown** — Click "✨ AI Breakdown" on any card to automatically generate actionable subtasks using the Groq LLaMA API
- **Drag and drop** — Reorder cards within a list or move them across lists with smooth drag-and-drop powered by dnd-kit
- **Workspaces & boards** — Organize work into workspaces (teams) and boards (projects), each with multiple lists and cards
- **Activity log** — Every board maintains a live activity feed showing who did what and when
- **JWT authentication** — Secure signup/login with access tokens (15min expiry) and refresh tokens (7 days) stored in httpOnly cookies
- **Role-based access** — Workspace members can be assigned admin, member, or viewer roles
- **Full CRUD** — Create, edit, and delete workspaces, boards, lists, and cards

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework and build tool |
| Tailwind CSS | Styling |
| React Router v7 | Client-side routing |
| dnd-kit | Drag and drop |
| Socket.io Client | Real-time updates |
| Axios | HTTP requests |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database and ODM |
| Socket.io | WebSocket server for real-time sync |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |
| Groq SDK (LLaMA 3.1) | AI task breakdown |

---

## 🏗 Architecture

```
taskflow-ai/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── components/     # SortableCard, SortableList
│       ├── context/        # AuthContext (global auth state)
│       ├── pages/          # Login, Signup, Dashboard, Workspace, Board
│       └── services/       # api.js (axios), socket.js (Socket.io)
│
└── server/                 # Express backend
    ├── config/             # DB connection, token generation
    ├── controllers/        # Auth, Workspace, Board, List, Card, AI, Activity
    ├── middleware/         # JWT auth middleware
    ├── models/             # Mongoose schemas
    └── routes/             # Express route definitions
```

### Database Schema
```
User
 └── Workspace (owner, members[])
      └── Board
           └── List (position)
                └── Card (position, parentCard for AI subtasks)
                     └── Activity (board, user, action)
```

---

## ⚡ Key Technical Decisions

**Why Socket.io over plain WebSockets?**
Socket.io provides rooms (scoped broadcasts per board), automatic reconnection, and fallback to long-polling — none of which plain WebSockets give out of the box.

**Why references over embedding in MongoDB?**
Lists and cards are updated independently and frequently (reordering, moving). Embedding would require rewriting the entire parent document on every small update. References let us update a single card document without touching its parent.

**Why short-lived access tokens + refresh tokens?**
Access tokens expire in 15 minutes, limiting the damage window if stolen. Refresh tokens are stored in httpOnly cookies (inaccessible to JavaScript), protecting against XSS attacks.

**Why Groq (LLaMA) for AI?**
Groq's inference API is free for development, extremely fast, and LLaMA 3.1 produces well-structured JSON output reliably — ideal for generating subtask arrays.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)
- Groq API key (free at console.groq.com)

### 1. Clone the repository
```bash
git clone https://github.com/jhashashank3747-glitch/taskflow-ai.git
cd taskflow-ai
```

### 2. Set up the backend
```bash
cd server
npm install
```

Create a `.env` file inside `server/`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:5173
GROQ_API_KEY=your_groq_api_key
```

Start the backend:
```bash
npm run dev
```

### 3. Set up the frontend
```bash
cd ../client
npm install
npm run dev
```

### 4. Open the app
Go to `http://localhost:5173` in your browser.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login and get tokens |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Get current user |

### Workspaces
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/workspaces` | Create workspace |
| GET | `/api/workspaces` | Get all user workspaces |
| GET | `/api/workspaces/:id` | Get workspace by ID |
| DELETE | `/api/workspaces/:id` | Delete workspace |

### Boards
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/boards` | Create board |
| GET | `/api/boards/workspace/:id` | Get boards by workspace |
| PUT | `/api/boards/:id` | Update board |
| DELETE | `/api/boards/:id` | Delete board |

### Lists
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/lists` | Create list |
| GET | `/api/lists/board/:id` | Get lists by board |
| PUT | `/api/lists/:id` | Update list |
| DELETE | `/api/lists/:id` | Delete list |

### Cards
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/cards` | Create card |
| GET | `/api/cards/list/:id` | Get cards by list |
| PUT | `/api/cards/:id` | Update card |
| DELETE | `/api/cards/:id` | Delete card |

### AI
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai/breakdown/:cardId` | AI subtask generation |

---

## 🔄 Real-time Events (Socket.io)

| Event | Direction | Description |
|---|---|---|
| `join_board` | Client → Server | Join a board's room |
| `leave_board` | Client → Server | Leave a board's room |
| `card_created` | Client ↔ Server | Broadcast new card to board members |
| `card_moved` | Client ↔ Server | Broadcast card position change |
| `list_created` | Client ↔ Server | Broadcast new list to board members |

---

## 🛣 Roadmap

- [ ] Deployment (Vercel + Render)
- [ ] File attachments (Cloudinary)
- [ ] Email notifications (Nodemailer)
- [ ] Card due dates and labels
- [ ] Board member invites via email

---

## 👨‍💻 Author

**Shashank** — [GitHub](https://github.com/jhashashank3747-glitch/taskflow-ai)

---