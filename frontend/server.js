const express = require("express");
const os = require("os");
const path = require("path");
const http = require("http");

const app = express();

const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
    throw new Error("BACKEND_URL environment variable is required");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

// Forward API requests to the Go backend
app.use("/api", (req, res) => {
    const backendUrl = new URL(req.originalUrl, BACKEND_URL);

    const options = {
        hostname: backendUrl.hostname,
        port: backendUrl.port || 80,
        path: backendUrl.pathname + backendUrl.search,
        method: req.method,
        headers: {
            ...req.headers,
            host: backendUrl.host
        }
    };

    const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });

    proxyReq.on("error", (error) => {
        console.error("Backend connection failed:", error.message);
        res.status(502).send("Could not connect to backend");
    });

    req.pipe(proxyReq);
});

app.get("/", (req, res) => {
    res.render("index", {
        frontendHostname: os.hostname()
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Frontend server listening on port ${PORT}`);
    console.log(`Backend URL: ${BACKEND_URL}`);
});

