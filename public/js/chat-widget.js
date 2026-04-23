// AI Chat Widget
class AIChatWidget {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.suggestions = [
            "Find luxury beachfront homes",
            "Show me mountain cabins",
            "Trending vacation spots",
            "Budget-friendly stays",
            "Pet-friendly accommodations",
            "Urban loft apartments"
        ];
        this.init();
    }

    init() {
        this.createWidget();
        this.attachEventListeners();
        this.addWelcomeMessage();
    }

    createWidget() {
        const existingWidget = document.querySelector('.ai-chat-widget');
        if (existingWidget) existingWidget.remove();

        const widget = document.createElement('div');
        widget.className = 'ai-chat-widget';
        widget.innerHTML = `
            <div class="ai-chat-header">
                <h5>
                    <i class="fa-solid fa-sparkles"></i>
                    AI Assistant
                </h5>
                <button class="close-btn">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            <div class="ai-chat-messages"></div>
            <div class="ai-chat-input">
                <input type="text" placeholder="Ask me anything..." class="ai-input-field">
                <button>
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        `;
        document.body.appendChild(widget);
    }

    createToggleButton() {
        const existingToggle = document.querySelector('.ai-chat-toggle');
        if (existingToggle) existingToggle.remove();

        const toggle = document.createElement('button');
        toggle.className = 'ai-chat-toggle';
        toggle.innerHTML = '<i class="fa-solid fa-comments"></i>';
        toggle.title = 'Chat with AI Assistant';
        document.body.appendChild(toggle);
    }

    addWelcomeMessage() {
        const messagesContainer = document.querySelector('.ai-chat-messages');
        messagesContainer.innerHTML = '';
        this.messages = [];
        
        this.addMessage('ai', `👋 Hey there! I'm your StayNest AI Assistant. I can help you:\n\n📍 Find perfect stays\n💡 Get travel suggestions\n🏠 Explore categories\n❓ Answer questions\n\nWhat are you looking for today?`);
        
        this.showSuggestions();
    }

    showSuggestions() {
        const messagesContainer = document.querySelector('.ai-chat-messages');
        const suggestionsHtml = this.suggestions.map(suggestion => 
            `<button class="suggestion-btn" style="
                display: block;
                width: 100%;
                padding: 0.5rem;
                margin: 0.25rem 0;
                background: #e2e8f0;
                border: 1px solid #cbd5e1;
                border-radius: 0.5rem;
                cursor: pointer;
                font-size: 0.85rem;
                text-align: left;
                transition: all 0.3s ease;
            ">${suggestion}</button>`
        ).join('');

        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'suggestions-container';
        suggestionsContainer.innerHTML = suggestionsHtml;
        messagesContainer.appendChild(suggestionsContainer);

        // Add event listeners to suggestions
        suggestionsContainer.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.addMessage('user', btn.textContent);
                this.processUserMessage(btn.textContent);
            });
            btn.addEventListener('mouseover', () => {
                btn.style.background = '#cbd5e1';
                btn.style.transform = 'translateX(5px)';
            });
            btn.addEventListener('mouseout', () => {
                btn.style.background = '#e2e8f0';
                btn.style.transform = 'translateX(0)';
            });
        });
    }

    attachEventListeners() {
        const widget = document.querySelector('.ai-chat-widget');
        const closeBtn = widget.querySelector('.close-btn');
        const sendBtn = widget.querySelector('.ai-chat-input button');
        const input = widget.querySelector('.ai-input-field');

        closeBtn.addEventListener('click', () => this.toggleWidget());
        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    toggleWidget() {
        const widget = document.querySelector('.ai-chat-widget');
        this.isOpen = !this.isOpen;
        widget.style.display = this.isOpen ? 'flex' : 'none';
        if (this.isOpen && document.querySelector('.ai-chat-toggle')) {
            document.querySelector('.ai-chat-toggle').remove();
        }
    }

    sendMessage() {
        const input = document.querySelector('.ai-input-field');
        const message = input.value.trim();
        
        if (!message) return;

        this.addMessage('user', message);
        input.value = '';
        
        // Show typing indicator
        this.addMessage('ai', 'Typing...');
        
        // Call backend API for AI response
        fetch('/api/ai-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        })
        .then(res => res.json())
        .then(data => {
            // Remove typing indicator
            const messages = document.querySelector('.ai-chat-messages');
            const lastMessage = messages.lastElementChild;
            if (lastMessage && lastMessage.textContent.includes('Typing')) {
                lastMessage.remove();
            }
            // Add AI response
            this.addMessage('ai', data.response);
        })
        .catch(err => {
            console.error('Chat error:', err);
            const messages = document.querySelector('.ai-chat-messages');
            const lastMessage = messages.lastElementChild;
            if (lastMessage && lastMessage.textContent.includes('Typing')) {
                lastMessage.remove();
            }
            this.addMessage('ai', 'Sorry, I had trouble processing that. Try asking about listings, categories, or how to create a listing!');
        });
    }

    processUserMessage(message) {
        const lowerMessage = message.toLowerCase();
        let response = '';

        // Smart responses based on user input
        if (lowerMessage.includes('beach') || lowerMessage.includes('ocean')) {
            response = '🏖️ Looking for beachfront paradise? Check out our Beachfront category! You\'ll find stunning ocean-view properties perfect for a relaxing getaway.';
        } else if (lowerMessage.includes('mountain') || lowerMessage.includes('cabin')) {
            response = '⛰️ Mountain lovers unite! Explore our Cabins, Arctic, and Countryside categories for cozy retreats surrounded by nature.';
        } else if (lowerMessage.includes('luxury') || lowerMessage.includes('expensive')) {
            response = '✨ Ready for the finer things? Our Luxury category features premium stays with world-class amenities and stunning views.';
        } else if (lowerMessage.includes('budget') || lowerMessage.includes('cheap') || lowerMessage.includes('affordable')) {
            response = '💰 Smart shopping! Filter by price to find amazing stays that won\'t break the bank. Quality experiences at great prices!';
        } else if (lowerMessage.includes('pet') || lowerMessage.includes('dog') || lowerMessage.includes('cat')) {
            response = '🐕 Traveling with furry friends? You can add pet policies in listing descriptions. Check individual property details for pet-friendly options!';
        } else if (lowerMessage.includes('how to') || lowerMessage.includes('create') || lowerMessage.includes('list')) {
            response = '📝 Ready to list your property? Click "New Home" in the navigation to create your first listing. Add photos, description, and pricing!';
        } else if (lowerMessage.includes('review') || lowerMessage.includes('rating')) {
            response = '⭐ Reviews help travelers make great decisions! Leave detailed reviews to help the community find amazing stays. You can rate 1-5 stars.';
        } else if (lowerMessage.includes('help') || lowerMessage.includes('how') || lowerMessage.includes('guide')) {
            response = '📚 Here\'s how to use StayNest:\n\n1️⃣ Browse listings by category\n2️⃣ Click on a property to see details\n3️⃣ Sign up and leave reviews\n4️⃣ Create your own listings!\n\nWhat else can I help with?';
        } else if (lowerMessage.includes('trending') || lowerMessage.includes('popular')) {
            response = '🔥 Check out our Trending category to see what\'s hot right now! Updated regularly with the most popular stays.';
        } else if (lowerMessage.includes('city') || lowerMessage.includes('urban')) {
            response = '🏙️ Urban explorer? Our City category has stylish apartments and modern lofts in vibrant downtown locations!';
        } else {
            // Default response with suggestions
            const responses = [
                '💡 That\'s an interesting question! Try filtering by category to find exactly what you\'re looking for. Would you like suggestions?',
                '🤔 I can help with finding stays, explaining categories, or answering questions about StayNest. What\'s your next adventure?',
                '✨ Interesting! Check out our different categories or filter by price range. Need help with anything specific?',
                '🎯 Great query! Browse our listings or let me know if you\'d like recommendations based on your preferences!'
            ];
            response = responses[Math.floor(Math.random() * responses.length)];
        }

        // Simulate typing delay
        setTimeout(() => {
            this.addMessage('ai', response);
        }, 500);
    }

    addMessage(sender, text) {
        const messagesContainer = document.querySelector('.ai-chat-messages');
        
        if (sender === 'ai') {
            // Remove suggestions when AI responds
            const suggestions = messagesContainer.querySelector('.suggestions-container');
            if (suggestions) suggestions.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        messageDiv.innerHTML = `<div class="chat-bubble">${text}</div>`;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.messages.push({ sender, text });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const chatWidget = new AIChatWidget();
    
    // Create toggle button
    chatWidget.createToggleButton();
    
    // Toggle button event
    const toggleBtn = document.querySelector('.ai-chat-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            chatWidget.toggleWidget();
        });
    }
    
    // Hide widget initially and show toggle button
    const widget = document.querySelector('.ai-chat-widget');
    widget.style.display = 'none';
});
