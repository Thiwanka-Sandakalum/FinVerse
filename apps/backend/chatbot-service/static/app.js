document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-btn');
    let conversationId = `user_${Date.now()}`;

    // Configure marked.js for markdown parsing with enhanced options
    marked.use({
        gfm: true,                // GitHub Flavored Markdown
        breaks: true,             // Render line breaks as <br>
        headerIds: true,          // Generate IDs for headings
        mangle: false,            // Don't mangle header IDs
        pedantic: false,          // Don't be pedantic about markdown spec
        smartLists: true,         // Use smarter list behavior
        smartypants: true,        // Use "smart" typographic punctuation
        highlight: function (code, language) {
            if (language && hljs.getLanguage(language)) {
                return hljs.highlight(code, { language }).value;
            }
            return hljs.highlightAuto(code).value;
        }
    });

    // Function to create a loading message
    function createLoadingMessage() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message bot loading';
        loadingDiv.innerHTML = `
            <div class="loading-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        return loadingDiv;
    }

    // Function to create a message element
    function createMessageElement(text, isUser, sources = [], queryType = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;

        // If it's a user message, just use text content
        if (isUser) {
            messageDiv.textContent = text;
        } else {
            // For bot messages, parse markdown
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.innerHTML = marked.parse(text);
            messageDiv.appendChild(contentDiv);
        }

        // Show query type badge if provided
        if (queryType) {
            const queryTypeBadge = document.createElement('div');
            queryTypeBadge.className = `query-type ${queryType}`;
            queryTypeBadge.textContent = queryType.toUpperCase();

            // Add tooltip description based on query type
            let tooltipText = "";
            switch (queryType) {
                case "sql":
                    tooltipText = "SQL Query: Structured data from the database";
                    break;
                case "vector":
                    tooltipText = "Vector Search: General knowledge from documents";
                    break;
                case "hybrid":
                    tooltipText = "Hybrid Query: Combined SQL and vector search";
                    break;
                case "unsupported":
                    tooltipText = "Unsupported: Outside the system's knowledge domain";
                    break;
                default:
                    tooltipText = "Query classification";
            }
            queryTypeBadge.setAttribute('data-tooltip', tooltipText);
            messageDiv.appendChild(queryTypeBadge);
        }

        if (sources && sources.length > 0) {
            const sourcesDiv = document.createElement('div');
            sourcesDiv.className = 'sources';
            sourcesDiv.innerHTML = '<strong>Sources:</strong><br>' +
                sources.map(source => `${source.name} (${source.institution})`).join('<br>');
            messageDiv.appendChild(sourcesDiv);
        }

        return messageDiv;
    }

    // Function to handle sending messages
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Disable input and button while processing
        userInput.value = '';
        userInput.disabled = true;
        sendButton.disabled = true;

        // Add user message to chat
        chatMessages.appendChild(createMessageElement(message, true));
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Add loading message
        const loadingMessage = createLoadingMessage();
        chatMessages.appendChild(loadingMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            // Send message to API
            const response = await fetch('http://localhost:8085/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: message,
                    conversation_id: conversationId
                })
            });

            const data = await response.json();

            // Remove loading message
            loadingMessage.remove();

            // Add bot response to chat
            chatMessages.appendChild(createMessageElement(data.answer, false, data.sources, data.query_type));
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } catch (error) {
            // Remove loading message
            loadingMessage.remove();

            // Add error message
            chatMessages.appendChild(createMessageElement(
                'Sorry, I encountered an error. Please try again.',
                false
            ));
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Re-enable input and button
        userInput.disabled = false;
        sendButton.disabled = false;
        userInput.focus();
    }

    // Stats functionality
    const statsToggle = document.getElementById('stats-toggle');
    const statsContent = document.getElementById('stats-content');

    statsToggle.addEventListener('click', () => {
        if (statsContent.classList.contains('show')) {
            statsContent.classList.remove('show');
            statsToggle.textContent = 'Show Stats';
        } else {
            fetchStats();
            statsContent.classList.add('show');
            statsToggle.textContent = 'Hide Stats';
        }
    });

    async function fetchStats() {
        try {
            statsContent.innerHTML = '<div class="stats-loading">Loading statistics...</div>';

            const response = await fetch('http://localhost:8085/stats');
            const data = await response.json();

            if (data.status === 'success') {
                const stats = data.stats;

                // Create stats display
                const statsGrid = document.createElement('div');
                statsGrid.className = 'stats-grid';

                // Add each stat to the grid
                const statCards = [
                    { label: 'Total Queries', value: stats.total_queries },
                    { label: 'SQL Queries', value: stats.sql_queries },
                    { label: 'Vector Queries', value: stats.vector_queries },
                    { label: 'Hybrid Queries', value: stats.hybrid_queries },
                    { label: 'Unsupported', value: stats.unsupported_queries },
                    { label: 'Errors', value: stats.errors }
                ];

                statCards.forEach(stat => {
                    const card = document.createElement('div');
                    card.className = 'stat-card';
                    card.innerHTML = `
                        <div class="stat-value">${stat.value}</div>
                        <div class="stat-label">${stat.label}</div>
                    `;
                    statsGrid.appendChild(card);
                });

                statsContent.innerHTML = '';
                statsContent.appendChild(statsGrid);
            } else {
                statsContent.innerHTML = '<div class="stats-error">Failed to load statistics</div>';
            }
        } catch (error) {
            statsContent.innerHTML = '<div class="stats-error">Error: Could not load statistics</div>';
        }
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Focus input on load
    userInput.focus();
});
