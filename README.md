# 🚀 DevOps Demo — Containerized Full-Stack App

A beginner-friendly DevOps project demonstrating how to containerize a **Go backend** and a **server-side rendered (SSR) frontend** using Docker and Docker Compose.

Built to practice containerization, service-to-service communication, environment-based configuration, and application deployment. 🐳

<p align="center">

  <img src="https://img.shields.io/badge/Go-Backend-00ADD8?style=for-the-badge&logo=go&logoColor=white" alt="Go Backend" />
  <img src="https://img.shields.io/badge/Node.js-Frontend-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-SSR-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express SSR" />
  <img src="https://img.shields.io/badge/Docker-Containers-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Docker_Compose-Orchestration-1D63ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Compose" />

</p>

## ✨ Project Highlights

- 🖥️ **Server-Side Rendering (SSR):** Express and EJS render the frontend HTML on the server.
- 🐹 **Go Backend:** A lightweight HTTP API with a health-check endpoint.
- 🔌 **Dynamic Configuration:** Application ports and the backend URL are configured through environment variables.
- 🌐 **Docker Networking:** The frontend reaches the backend using the Compose service name `backend` instead of a hardcoded IP address.
- 🐳 **Containerization:** Separate Docker images and containers for the frontend and backend.
- 🔗 **API Integration:** A frontend button sends a request to the backend and displays its response.
- 🏷️ **Hostname Visibility:** The rendered page displays the frontend container hostname.

## 🏗️ Architecture

```text
                 Browser
                    |
                    | http://localhost:8081
                    v
        +---------------------------+
        |       Frontend            |
        |  Node.js + Express + EJS  |
        |  Container Port: 3000     |
        +---------------------------+
                    |
                    | BACKEND_URL
                    | http://backend:8080
                    v
        +---------------------------+
        |        Backend            |
        |          Go API           |
        |  Container Port: 8080     |
        +---------------------------+
```

Docker Compose creates a network for the services, allowing the frontend to resolve the backend by its service name.

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| Go | Backend API |
| Node.js | Frontend server runtime |
| Express.js | HTTP server and API proxy |
| EJS | Server-side HTML rendering |
| Docker | Application containerization |
| Docker Compose | Multi-container orchestration |
| Git & GitHub | Version control and source hosting |

## 📁 Project Structure

```text
devops-demp/
├── backend/
│   ├── Dockerfile
│   ├── go.mod
│   └── main.go
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   ├── public/
│   │   ├── app.js
│   │   └── style.css
│   └── views/
│       └── index.ejs
├── docker-compose.yml
├── .dockerignore
├── .gitignore
└── README.md
```

## ⚙️ Prerequisites

Make sure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/)

Check your installation:

```bash
docker --version
docker compose version
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/lamiaali8/devops-demo.git
cd devops-demp
```

> If you clone the repository into a differently named folder, `cd` into that folder instead.

### 2. Build and start the application

```bash
docker compose up -d --build
```

This command builds the images and starts the frontend and backend containers in the background.

### 3. Check container status

```bash
docker compose ps
```

View application logs:

```bash
docker compose logs --tail=50 backend frontend
```

### 4. Open the application

- 🌐 Frontend: [http://localhost:8081](http://localhost:8081)
- ❤️ Backend health check: [http://localhost:8080/health](http://localhost:8080/health)

Use the **Call Backend** button on the frontend to test the API integration.

## 🔌 API Endpoints

| Endpoint | Description | Expected response |
|---|---|---|
| `GET /` | Renders the frontend using EJS | HTML page |
| `GET /api/hello` | Returns a greeting from the Go backend | Greeting and backend hostname |
| `GET /health` | Checks backend health | `OK` |

The frontend forwards `/api` requests to the Go backend using the configured backend URL.

## 🔧 Environment Variables

| Variable | Service | Example | Purpose |
|---|---|---|---|
| `PORT` | Backend | `8080` | Port used by the Go HTTP server |
| `PORT` | Frontend | `3000` | Port used by the Express server |
| `BACKEND_URL` | Frontend | `http://backend:8080` | Address used to reach the backend service |

The backend uses `8080` as its default port when `PORT` is not provided.

The frontend requires `BACKEND_URL` to be configured.

### Why use `http://backend:8080`?

Inside the Compose network, `backend` is a DNS name provided by Docker Compose. It lets the frontend reach the backend without depending on a container IP address that could change.

**Note:** `localhost` inside a container refers to that same container, not another service.

## 🧪 Testing

Check the backend health:

```bash
curl -i http://localhost:8080/health
```

Expected body:

```text
OK
```

Test the SSR page:

```bash
curl -s http://localhost:8081/
```

Check the backend API through the frontend:

```bash
curl -i http://localhost:8081/api/hello
```

The API response should contain a greeting and the backend hostname.

## 🛠️ Useful Docker Compose Commands

```bash
# Build images and start services
docker compose up -d --build

# List services and their status
docker compose ps

# Follow logs
docker compose logs -f

# View logs for one service
docker compose logs -f backend
docker compose logs -f frontend

# Restart services
docker compose restart

# Stop and remove the Compose containers and network
docker compose down
```

## 📚 What I Learned

- Building Docker images for different application runtimes.
- Running multiple services with Docker Compose.
- Passing configuration through environment variables.
- Connecting containers through Docker's internal DNS.
- Implementing server-side rendering with Express and EJS.
- Proxying frontend API requests to a backend service.
- Testing endpoints and troubleshooting containers using logs.

## 🔮 Possible Next Steps

- Add health checks and service readiness handling.
- Use multi-stage Docker builds.
- Add automated tests and a CI/CD pipeline with GitHub Actions.
- Add monitoring with Prometheus and Grafana.
- Deploy the application to a cloud environment.

## 👩‍💻 Author

**Lamiaa Abdallah**

🔗 [GitHub Profile](https://github.com/lamiaali8)

---

⭐ *A hands-on project to build practical DevOps skills, one step at a time.*
