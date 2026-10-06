// Chatbot Widget - Floating Chat Window
class ChatbotWidget {
  constructor() {
    this.isOpen = false;
    this.conversationHistory = [];
    this.init();
  }

  init() {
    // Create widget HTML
    this.createWidget();
    this.bindEvents();
  }

  createWidget() {
    const widget = document.createElement('div');
    widget.className = 'chatbot-widget';
    widget.innerHTML = `
      <button class="chatbot-toggle" id="chatbot-toggle" aria-label="فتح الشات">
        <svg class="chat-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h9.5"/><path d="M12 9a2 2 0 0 0 0 4a2 2 0 0 0 0-4z"/><path d="M12 12h.01"/><path d="M12 16h.01"/></svg>
        <svg class="close-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="chatbot-window" id="chatbot-window">
        <div class="chatbot-header">
          <div>
            <h3>مساعد الدعم الذكي</h3>
            <span class="status">متصل الآن ⚡</span>
          </div>
          <button class="chatbot-close" id="chatbot-close" aria-label="إغلاق">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="chatbot-messages" id="chatbot-messages">
          <div class="chatbot-message bot">
            مرحباً! 👋 أنا مساعد الدعم الذكي. كيف يمكنني مساعدتك اليوم؟
            <div class="time">الآن</div>
          </div>
        </div>
        <div class="chatbot-input-area">
          <input type="text" class="chatbot-input" id="chatbot-input" placeholder="اكتب رسالتك هنا..." maxlength="500">
          <button class="chatbot-send" id="chatbot-send" aria-label="إرسال">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 22 2"/></svg>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(widget);
  }

  bindEvents() {
    const toggle = document.getElementById('chatbot-toggle');
    const close = document.getElementById('chatbot-close');
    const input = document.getElementById('chatbot-input');
    const send = document.getElementById('chatbot-send');
    const window = document.getElementById('chatbot-window');

    toggle.addEventListener('click', () => this.toggle());
    close.addEventListener('click', () => this.toggle());

    send.addEventListener('click', () => this.sendMessage());

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
    const toggle = document.getElementById('chatbot-toggle');
    const window = document.getElementById('chatbot-window');

    toggle.classList.toggle('open', this.isOpen);
    window.classList.toggle('open', this.isOpen);

    if (this.isOpen) {
      document.getElementById('chatbot-input').focus();
    }
  }

  async sendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    this.addMessage(message, 'user');
    input.value = '';

    // Show typing indicator
    this.showTyping();

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          conversationHistory: this.conversationHistory
        })
      });

      const data = await response.json();

      // Hide typing indicator
      this.hideTyping();

      if (data.success) {
        // Add bot response
        this.addMessage(data.message, 'bot');
        
        // Update conversation history
        this.conversationHistory.push({ role: 'user', content: message });
        this.conversationHistory.push({ role: 'assistant', content: data.message });
        
        // Keep only last 10 messages to save tokens
        if (this.conversationHistory.length > 10) {
          this.conversationHistory = this.conversationHistory.slice(-10);
        }
      } else {
        this.addMessage('عذراً، حدث خطأ في المعالجة. حاول مرة أخرى.', 'bot');
      }
    } catch (error) {
      console.error('[Chatbot] Error:', error);
      this.hideTyping();
      this.addMessage('عذراً، حدث خطأ في الاتصال. حاول مرة أخرى.', 'bot');
    }
  }

  addMessage(text, type) {
    const container = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${type}`;
    
    const time = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
      ${text}
      <div class="time">${time}</div>
    `;
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
  }

  showTyping() {
    const container = document.getElementById('chatbot-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-typing';
    typingDiv.id = 'chatbot-typing';
    typingDiv.innerHTML = `
      <div class="chatbot-typing-dot"></div>
      <div class="chatbot-typing-dot"></div>
      <div class="chatbot-typing-dot"></div>
    `;
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;
  }

  hideTyping() {
    const typing = document.getElementById('chatbot-typing');
    if (typing) {
      typing.remove();
    }
  }
}

// Initialize chatbot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ChatbotWidget();
  });
} else {
  new ChatbotWidget();
}
