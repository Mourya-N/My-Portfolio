# Mourya N | Software Development Engineer Portfolio

Welcome to my portfolio! This project has been redesigned to use a modern full-stack architecture suitable for a Software Development Engineer:
- **Frontend**: React.js built with Vite, styled with custom Vanilla CSS variables, responsive designs, mouse-trail particle canvas, 3D card tilt effects, and scroll reveals.
- **Backend**: Spring Boot 3 (Java 17) REST API with MongoDB Atlas integration, validation framework, and CORS support.

---

## Repository Structure

```
├── backend/                  # Spring Boot REST API
│   ├── src/                  # Java source files and configurations
│   │   ├── main/resources/static/resume.pdf # serving PDF
│   └── pom.xml               # Maven configuration
│
├── frontend/                 # React.js SPA Application
│   ├── src/                  # React components and styling
│   ├── public/resume.pdf     # serving PDF directly
│   └── package.json          # Node dependencies and scripts
│
└── README.md                 # Project instructions
```

---

## Getting Started

### 1. Prerequisite Setup

Make sure you have the following installed on your machine:
- **Java 17** or higher
- **Maven** (optional, you can use the maven wrapper or local maven)
- **Node.js** (v18 or higher) and **npm**
- A **MongoDB** instance (local, or a MongoDB Atlas cloud URI)

Configure your MongoDB URI in your system environment variable:
```bash
export MONGO_URI="your-mongodb-connection-string"
```
*Note: If no env var is found, the backend defaults to `mongodb://localhost:27017/portfolio`.*

---

### 2. Run the Spring Boot Backend

Navigate to the `backend/` folder and boot the server:
```bash
cd backend
mvn spring-boot:run
```
The backend server will spin up on **`http://localhost:8080`**.

Endpoints exposed:
- `POST /api/contact`: Accepts and validates name, email, and message. Saves to MongoDB.
- `GET /api/messages`: Retrieves all sent messages sorted by date descending.
- `GET /resume`: Serves the PDF resume inline.
- `GET /download-resume`: Triggers downloading of the PDF resume.

---

### 3. Run the React Frontend

Navigate to the `frontend/` folder, install packages, and spin up the developer server:
```bash
cd frontend
npm install
npm run dev
```
The React frontend will spin up on **`http://localhost:5173`**.

Open your browser to `http://localhost:5173` and view the updated, high-end SDE portfolio!

---

## Redesign Highlights

1. **SDE Professional Identity**: Integrated detailed projects like **MouCodeBrain** (AI RAG platform, Spring Boot, FastAPI, LangChain, FAISS, Docker) and detailed Skyllx internship modules (Certificate Service, LMS frontend/backend).
2. **High-Performance Visuals**: Interactive Canvas mouse-trail particles, smooth 3D tilt effects on elements, sticky navigation, and scroll reveals using React hooks.
3. **Robust Backend API**: Transitioned from Node.js to a typed Spring Boot backend including standard exception handling, schema validation, and configurable database routing.
