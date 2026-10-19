import { useState } from "react";

export default function App() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function callBackend() {
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/hello");

      if (!res.ok) {
        throw new Error(`Request failed: HTTP ${res.status}`);
      }

      const data = await res.text();
      setResponse(data);
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <p className="tag">DEVOPS LEARNING PROJECT</p>
      <h1>React CSR Frontend</h1>
      <p>
        This interface is rendered in the browser using React.
      </p>
      <p>
        Rendering mode: <strong>Client-Side Rendering (CSR)</strong>
      </p>

      <button onClick={callBackend} disabled={loading}>
        {loading ? "Loading..." : "Call Go Backend"}
      </button>

      <pre aria-live="polite">{response || "Backend response will appear here."}</pre>
    </main>
  );
}
