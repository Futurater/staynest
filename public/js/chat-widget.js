/**
 * STAYNEST — AI ARCHITECTURAL CONCIERGE WIDGET
 * Aesthetic: Blueprint Terminal / Editorial AI Consultant
 */

class AIChatWidget {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.suggestions = [
            "Find secluded minimalist cabins",
            "Browse beachfront architectural villas",
            "What stays are trending right now?",
            "How do I commission a new listing?",
            "Show budget-friendly design lofts"
        ];
        this.init();
    }

    init() {
        this.createWidget();
        this.createToggleButton();
        this.attachEventListeners();
        this.addWelcomeMessage();
    }

    createWidget() {
        const existingWidget = document.querySelector('.ai-chat-widget');
        if (existingWidget) existingWidget.remove();

        const widget = document.createElement('div');
        widget.className = 'ai-chat-widget';
        widget.style.display = 'none';
        widget.innerHTML = `
            <div class="ai-chat-header">
                <div>
                    <h5>
                        <i class="fa-solid fa-compass-drafting" style="color: var(--brand-cobalt);"></i>
                        Architectural Concierge
                    </h5>
                    <div class="mono-stamp" style="font-size: 0.65rem; color: #94A3B8; margin-top: 0.15rem;">
                        STAYNEST AI // SYS-QUERY V2.6
                    </div>
                </div>
                <button class="close-btn" aria-label="Close Concierge">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="ai-chat-messages"></div>
            <div class="ai-chat-input">
                <input type="text" placeholder="Inquire about coordinates, styles, or stays..." class="ai-input-field" autocomplete="off">
                <button aria-label="Send Inquiry">
                    <i class="fa-solid fa-arrow-right"></i>
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
        toggle.innerHTML = '<i class="fa-solid fa-compass-drafting"></i>';
        toggle.title = 'Consult StayNest AI Concierge';
        toggle.setAttribute('aria-label', 'Open AI Concierge');
        document.body.appendChild(toggle);
    }

    addWelcomeMessage() {
        const messagesContainer = document.querySelector('.ai-chat-messages');
        messagesContainer.innerHTML = '';
        this.messages = [];

        this.addMessage('bot', `Greetings. I am your StayNest Architectural Concierge. How may I guide your journey today?\n\n• Curated retreats by geography or topology\n• Materiality & spatial design recommendations\n• Commissioning a sanctuary to the archive`);
        this.showSuggestions();
    }

    showSuggestions() {
        const messagesContainer = document.querySelector('.ai-chat-messages');
        const container = document.createElement('div');
        container.className = 'suggestions-container';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '0.4rem';
        container.style.marginTop = '0.5rem';

        this.suggestions.forEach(suggestion => {
            const btn = document.createElement('button');
            btn.className = 'category-pill';
            btn.style.width = '100%';
            btn.style.textAlign = 'left';
            btn.style.justifyContent = 'flex-start';
            btn.style.fontSize = '0.78rem';
            btn.style.background = '#1E232D';
            btn.style.color = '#E2E8F0';
            btn.style.borderColor = 'rgba(255,255,255,0.1)';
            btn.innerHTML = `<i class="fa-solid fa-arrow-turn-down" style="color: var(--brand-cobalt); font-size: 0.7rem; transform: rotate(-90deg);"></i> ${suggestion}`;

            btn.addEventListener('click', () => {
                this.addMessage('user', suggestion);
                this.queryBackend(suggestion);
            });

            container.appendChild(btn);
        });

        messagesContainer.appendChild(container);
    }

    attachEventListeners() {
        const widget = document.querySelector('.ai-chat-widget');
        const toggleBtn = document.querySelector('.ai-chat-toggle');
        const closeBtn = widget.querySelector('.close-btn');
        const sendBtn = widget.querySelector('.ai-chat-input button');
        const input = widget.querySelector('.ai-input-field');

        if (toggleBtn) toggleBtn.addEventListener('click', () => this.toggleWidget());
        if (closeBtn) closeBtn.addEventListener('click', () => this.toggleWidget());
        if (sendBtn) sendBtn.addEventListener('click', () => this.sendMessage());
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }
    }

    toggleWidget() {
        const widget = document.querySelector('.ai-chat-widget');
        const toggle = document.querySelector('.ai-chat-toggle');
        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            widget.style.display = 'flex';
            if (toggle) toggle.style.transform = 'scale(0.85) rotate(45deg)';
            widget.querySelector('.ai-input-field')?.focus();
        } else {
            widget.style.display = 'none';
            if (toggle) toggle.style.transform = '';
        }
    }

    sendMessage() {
        const input = document.querySelector('.ai-input-field');
        const message = input.value.trim();
        if (!message) return;

        this.addMessage('user', message);
        input.value = '';
        this.queryBackend(message);
    }

    queryBackend(message) {
        // Add typing indicator
        this.addMessage('bot', 'Analyzing architectural archive...');

        fetch('/api/ai-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        })
        .then(res => res.json())
        .then(data => {
            this.removeTypingIndicator();
            this.addMessage('bot', data.response || "Our architectural custodians are currently updating this category. Please explore our curated collections.");
        })
        .catch(err => {
            console.error('Chat error:', err);
            this.removeTypingIndicator();
            this.addMessage('bot', 'Inquiry processed. Explore our Trending, Minimalist Cabins, or Coastal Pavilions collections for immediate options.');
        });
    }

    removeTypingIndicator() {
        const messages = document.querySelectorAll('.ai-message.bot');
        if (messages.length) {
            const last = messages[messages.length - 1];
            if (last.textContent.includes('Analyzing architectural archive')) {
                last.remove();
            }
        }
    }

    addMessage(sender, text) {
        const messagesContainer = document.querySelector('.ai-chat-messages');
        const suggestions = messagesContainer.querySelector('.suggestions-container');
        if (suggestions && sender === 'user') {
            suggestions.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}`;
        messageDiv.textContent = text;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        this.messages.push({ sender, text });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AIChatWidget();
});
