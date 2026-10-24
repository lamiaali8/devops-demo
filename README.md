# 🚀 DevOps Demo — Go Backend, SSR & CSR Frontends

> 🛠️ A hands-on DevOps project demonstrating application integration, Docker containerization, multi-stage builds, environment-based configuration, and automated CI pipelines using GitHub Actions.

## 🌟 Project Overview

Welcome to my DevOps demo project! 👋

This project demonstrates how to build, integrate, containerize, and test a multi-component application using practical DevOps concepts.

The application consists of a **Go Backend**, a **Server-Side Rendering (SSR) Frontend**, and a **Client-Side Rendering (CSR) Frontend**.

The project focuses on making the application easy to build, run, test, and maintain through automation and containerization.

### ✨ Key Features

- 🐹 Go REST API with health-check and greeting endpoints.
- 🖥️ SSR frontend built with Node.js, Express, and EJS.
- ⚛️ CSR frontend built with React and Vite.
- 🔗 Frontend-to-backend API communication.
- 🌍 Environment variables for runtime configuration.
- 🐳 Docker images and multi-stage Docker builds.
- 🌐 Docker networking and service-name-based communication.
- ⚙️ Six GitHub Actions CI workflows.
- 🧪 Automated build, startup, and HTTP smoke tests.

---

## 🏗️ Application Architecture

```text
                         👩‍💻 Developer
                               |
                               v
                       GitHub Repository
                               |
                               v
                       GitHub Actions CI
                               |
             +-----------------+-----------------+
             |                 |                 |
             v                 v                 v
       🐹 Go Backend     🖥️ SSR Frontend    ⚛️ CSR Frontend
             |           Express + EJS        React + Vite
             |                 |                 |
             |           Server renders      Browser renders
             |              HTML                 UI
             |                 |                 |
             +<----------------+-----------------+
                    HTTP API Communication
```

### 🔄 How the Components Work Together

1. 🐹 The Go backend exposes REST API endpoints.
2. 🖥️ The SSR frontend uses Express and EJS to generate HTML on the server.
3. ⚛️ The CSR frontend uses React to render the interface in the browser.
4. 🔗 Both frontends can communicate with the Go backend through HTTP API requests.
5. 🐳 Docker runs the components in containers, while Docker networking allows services to communicate using service names.
6. ⚙️ GitHub Actions automatically builds and tests the applications.

---

## 🐹 Go Backend

The backend is written in Go and provides HTTP endpoints used to verify application health and frontend-to-backend communication.

### 📡 API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/health` | GET | Checks whether the backend is responding. |
| `/api/hello` | GET | Returns a greeting and backend hostname. |

### 💡 Example Responses

Health check:

```text
OK
```

Greeting endpoint:

```text
Hello from Go Backend!
Hostname: <backend-hostname>
```

The hostname helps demonstrate which backend instance handled the request.

### ⚙️ Backend Configuration

The backend reads its listening port from the `PORT` environment variable. If no value is provided, it uses port `8080`.

Example:

```bash
PORT=8080 go run .
```

### 🧪 Run the Backend Locally

Requirements: Go installed.

```bash
cd backend

go mod download
go build -o backend-app .
./backend-app
```

Test the endpoints in another terminal:

```bash
curl http://127.0.0.1:8080/health
curl http://127.0.0.1:8080/api/hello
```

---

## 🖥️ SSR Frontend — Server-Side Rendering

The SSR frontend uses **Node.js, Express, and EJS**.

Unlike a purely client-rendered application, the Express server renders the initial HTML page using an EJS template and sends the generated HTML to the browser.

### 🔄 SSR Request Flow

```text
🌐 Browser
    |
    | GET /
    v
🖥️ Express Server
    |
    | Reads frontend hostname
    | Renders EJS template
    v
📄 HTML Response
    |
    v
🌐 Browser displays the page
    |
    | User clicks the API button
    | GET /api/hello
    v
🖥️ Express API Proxy
    |
    | BACKEND_URL + /api/hello
    v
🐹 Go Backend
    |
    | Returns greeting and hostname
    v
🖥️ Express forwards response
    |
    v
🌐 Browser displays backend response
```

### 🔗 How SSR Connects to the Go Backend

The SSR frontend does not need to expose the backend's internal address directly to browser JavaScript.

Instead, the browser sends a request to the SSR server:

```text
GET /api/hello
```

The Express server forwards that request to the Go backend using the `BACKEND_URL` environment variable.

For example, inside Docker Compose:

```text
BACKEND_URL=http://backend:8080
```

Here, `backend` is the Docker Compose service name. Docker's internal DNS resolves that name to the appropriate container address.

This approach avoids hardcoding a container IP address, which may change when containers are recreated.

### ⚙️ SSR Environment Variables

| Variable | Purpose | Example |
|---|---|---|
| `PORT` | Port used by the SSR server | `3000` |
| `BACKEND_URL` | Base URL of the Go backend | `http://backend:8080` |

The correct `BACKEND_URL` depends on where the frontend runs.

- 🖥️ **Local development:** `http://127.0.0.1:8080`
- 🐳 **Inside the Docker Compose network:** `http://backend:8080`

**Important:** `127.0.0.1` inside a container refers to that same container, not the separate backend container.

### 🧪 Run the SSR Frontend Locally

Start the backend first, then open another terminal:

```bash
cd frontend

npm ci
BACKEND_URL=http://127.0.0.1:8080 npm start
```

Open:

```text
http://127.0.0.1:3000
```

The page displays the frontend hostname. Clicking the API button sends a request through Express to the Go backend and displays the returned response.

---

## ⚛️ CSR Frontend — Client-Side Rendering

The CSR frontend uses **React and Vite**.

The browser downloads the application assets, and React renders the user interface on the client side.

### 🔄 CSR Request Flow

```text
🌐 Browser
    |
    | Loads HTML, CSS and JavaScript
    v
🌐 React Application
    |
    | User triggers API request
    v
GET /api/hello
    |
    v
🌐 Nginx Reverse Proxy
    |
    | Forwards request to backend
    v
🐹 Go Backend
    |
    | Returns JSON or text response
    v
🌐 Browser displays the result
```

### ⚙️ CSR Configuration

During development, Vite can proxy API requests to the backend.

In the production Docker image, Nginx serves the built frontend assets and forwards API requests to the backend service.

For Docker networking, the backend can be addressed using its service name:

```text
http://backend:8080
```

This keeps the configuration independent of changing container IP addresses.

### 🧪 Build and Run CSR Locally

Start the backend first.

Then run:

```bash
cd frontend-csr

npm ci
npm run build
npm run dev
```

Open the local URL displayed by Vite in the terminal.

The development proxy configuration determines where `/api` requests are forwarded. Check `vite.config.js` for the configured target and environment-variable behavior.

---

## 🐳 Docker & Containerization

Docker packages each application component with its runtime dependencies so it can be executed in a consistent environment.

### 📦 Main Docker Components

| Component | Technology | Responsibility |
|---|---|---|
| Backend | Go | Serves the REST API |
| SSR Frontend | Node.js + Express + EJS | Renders HTML and proxies API requests |
| CSR Frontend | Nginx | Serves static React assets and proxies API requests |

### 🌐 Docker Networking

Containers connected to the same Docker network can communicate using their service names.

For example:

```text
SSR Container
    |
    | BACKEND_URL=http://backend:8080
    v
Docker Network
    |
    v
Backend Container
```

The frontend uses the hostname `backend` rather than a hardcoded container IP address.

This is useful because container IP addresses can change when containers are recreated, while the Compose service name remains the intended discovery name.

### 🧱 Multi-stage Docker Builds

A multi-stage Dockerfile uses multiple `FROM` instructions to separate build-time work from the final runtime image.

#### 🖥️ SSR Multi-stage Build

The SSR application uses Node.js at runtime, so its final stage still needs Node.js.

- **Stage 1 — Build:** Installs dependencies and prepares the Express application.
- **Stage 2 — Runtime:** Copies the application and production dependencies into a clean Node.js image.

The goal is to keep development dependencies and unnecessary build-time files out of the final image.

#### ⚛️ CSR Multi-stage Build

The CSR frontend follows a different approach:

- **Stage 1 — Build:** Uses Node.js and Vite to generate production assets.
- **Stage 2 — Runtime:** Uses Nginx to serve the generated static files.

The final CSR image does not need the Node.js build environment.

### 🚀 Run with Docker Compose

From the repository root:

```bash
docker compose config
docker compose up --build -d
docker compose ps
docker compose logs
```

To follow the logs:

```bash
docker compose logs -f
```

To stop the application:

```bash
docker compose down
```

To inspect the current Compose configuration:

```bash
cat docker-compose.yml
```

Check this file for the actual service names, ports, image names, and environment variables used by the local setup.

---

## ⚙️ GitHub Actions — Six CI Workflows

This project includes six GitHub Actions workflows covering native and Docker-based validation for the backend and both frontends.

| Workflow | What It Does |
|---|---|
| `backend-native.yml` | Builds and runs the Go backend on the GitHub-hosted runner and tests its endpoints. |
| `backend-docker.yml` | Builds the backend Docker image, runs the container, and tests its endpoints. |
| `frontend-ssr-native.yml` | Installs SSR dependencies, starts the application and backend, and tests the page and API communication. |
| `frontend-ssr-docker.yml` | Builds and runs the SSR and backend containers, then tests the frontend and API proxy. |
| `frontend-csr-native.yml` | Builds the React application, runs the development setup, and checks the frontend and API proxy. |
| `frontend-csr-docker.yml` | Builds and runs the CSR and backend containers, then tests the served assets and API communication. |

### 🔄 Native CI vs. Docker CI

**🧪 Native CI**

Builds and runs the application directly on the GitHub-hosted runner. This validates the application independently of Docker packaging.

**🐳 Docker CI**

Builds container images, starts containers, validates networking, and runs HTTP smoke tests against the containerized application.

These workflows provide **Continuous Integration (CI)** validation. They do not, by themselves, deploy the application to production.

### 🔍 What Is Tested?

- ✅ Application builds successfully.
- ✅ Backend endpoints respond correctly.
- ✅ Frontend pages and assets are served.
- ✅ Frontend API requests reach the backend.
- ✅ Docker images build successfully.
- ✅ Containers start and run.
- ✅ HTTP smoke tests pass.
- ✅ Temporary test resources are cleaned up.

---

## 🧰 Technology Stack

| Category | Technologies |
|---|---|
| Backend | Go |
| SSR | Node.js, Express, EJS |
| CSR | React, Vite |
| Web Server / Reverse Proxy | Nginx |
| Containerization | Docker, Docker Compose |
| CI/CD Automation | GitHub Actions |
| Testing | Go tests, curl, HTTP smoke tests |
| Version Control | Git, GitHub |

---

## 🎯 DevOps Concepts Demonstrated

- 🔄 Continuous Integration with GitHub Actions.
- 🐳 Docker image building and container lifecycle management.
- 🧱 Multi-stage Docker builds.
- 🌐 Docker networking and service-name-based discovery.
- 🔧 Environment-variable-based configuration.
- 🔗 Frontend-to-backend integration.
- ❤️ Health checks and HTTP smoke testing.
- 🖥️ Server-Side Rendering (SSR) vs. Client-Side Rendering (CSR).
- 🧹 Automated cleanup in CI workflows.
- 📝 Technical documentation and version control.

---

## 🛣️ Future Improvements

- 🧪 Add browser-based end-to-end testing with Playwright.
- 🔐 Add Docker image vulnerability scanning.
- 📦 Publish versioned images to a container registry.
- 🚀 Add a dedicated deployment workflow.
- 📊 Add application monitoring and metrics.
- 🧹 Add linting and automated code-quality checks.

---

## 👩‍💻 About This Project

This project was built as a practical DevOps learning exercise to understand how applications are developed, integrated, containerized, and tested through automation.

The main focus is on repeatable builds, environment-based configuration, container networking, multi-stage Docker builds, and automated CI validation.

If you find this project useful, feel free to ⭐ star the repository!

**Thanks for visiting! 🚀🐳**

