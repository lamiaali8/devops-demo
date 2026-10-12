async function getBackendResponse() {
    const result = document.getElementById("result");

    result.textContent = "Loading...";

    try {
        const response = await fetch("/api/hello");

        if (!response.ok) {
            throw new Error("Backend request failed");
        }

        const data = await response.text();

        result.textContent = data;
    } catch (error) {
        result.textContent = "Error: " + error.message;
    }
}
