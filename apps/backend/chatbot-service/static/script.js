

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const loadingIndicator = document.getElementById("loading-indicator");
const chatMeta = document.getElementById("chat-meta");
const chatError = document.getElementById("chat-error");

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") sendMessage();
});

function showLoading(show) {
    loadingIndicator.style.display = show ? "block" : "none";
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage("user", message);
    userInput.value = "";
    showLoading(true);
    chatError.style.display = "none";
    chatMeta.textContent = "";

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-User-Id": "demo-user"
            },
            body: JSON.stringify({
                sessionId: "demo-session",
                message: message
            })
        });
        const data = await response.json();

        // Show meta info if available
        if (data.meta && data.meta.timestamp) {
            chatMeta.textContent = `Timestamp: ${data.meta.timestamp}`;
        } else {
            chatMeta.textContent = "";
        }

        // Show error if not success
        if (data.success === false) {
            chatError.textContent = data.message || "An error occurred.";
            chatError.style.display = "block";
        } else {
            chatError.style.display = "none";
        }

        // Show main reply
        appendMessage("bot", (data.data && data.data.reply) || "No response");
    } catch (e) {
        chatError.textContent = "Sorry, something went wrong.";
        chatError.style.display = "block";
        appendMessage("bot", "Sorry, something went wrong.");
    } finally {
        showLoading(false);
    }
}


function appendMessage(role, message) {
    // Try to detect and render product cards if present in message (simple JSON or markdown block)
    if (role === "bot" && typeof message === "string" && message.includes("img_url")) {
        // Try to extract product info from the message string
        // Look for lines like: ProductName: { ... }
        const productRegex = /([\w\- ]+): (\{[^}]+\})/g;
        let match;
        let found = false;
        while ((match = productRegex.exec(message)) !== null) {
            found = true;
            const name = match[1].trim();
            let details;
            try {
                details = JSON.parse(match[2].replace(/'/g, '"'));
            } catch (e) {
                continue;
            }
            renderProductCard(name, details);
        }
        if (found) {
            // Also show the original message above the cards (optional)
            const msgDiv = document.createElement("div");
            msgDiv.classList.add("message", role);
            msgDiv.textContent = message.split("\n")[0];
            chatBox.appendChild(msgDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
            return;
        }
    }
    // If bot and Markdown is present, render as HTML
    if (role === "bot" && typeof message === "string") {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message", role);
        msgDiv.innerHTML = window.marked ? window.marked.parse(message) : message;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        return;
    }
    // Default: plain text message
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", role);
    msgDiv.textContent = message;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function renderProductCard(name, details) {
    const card = document.createElement("div");
    card.className = "product-card";

    // Image
    const img = document.createElement("img");
    img.className = "product-img";
    img.src = details.img_url || "https://via.placeholder.com/80x80?text=No+Image";
    img.alt = name;
    card.appendChild(img);

    // Details
    const detailsDiv = document.createElement("div");
    detailsDiv.className = "product-details";
    const title = document.createElement("div");
    title.className = "product-title";
    title.textContent = name;
    detailsDiv.appendChild(title);

    // Add meta fields
    for (const key of Object.keys(details)) {
        if (["img_url", "eligibility"].includes(key)) continue;
        const meta = document.createElement("div");
        meta.className = "product-meta";
        meta.textContent = `${key}: ${typeof details[key] === "object" ? JSON.stringify(details[key]) : details[key]}`;
        detailsDiv.appendChild(meta);
    }
    // Eligibility
    if (details.eligibility) {
        const elig = document.createElement("div");
        elig.className = "product-eligibility";
        elig.textContent = `Eligibility: ${typeof details.eligibility === "object" ? JSON.stringify(details.eligibility) : details.eligibility}`;
        detailsDiv.appendChild(elig);
    }
    card.appendChild(detailsDiv);
    chatBox.appendChild(card);
    chatBox.scrollTop = chatBox.scrollHeight;
}
