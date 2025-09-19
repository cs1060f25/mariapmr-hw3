// Application data
const appData = {
    "potential_matches": [
      {"id": 1, "name": "Alex Thompson", "handle": "@alex.thompson", "status": "pending"},
      {"id": 2, "name": "Jordan Smith", "handle": "@jordansmith", "status": "available"},
      {"id": 3, "name": "Casey Liu", "handle": "@casey.liu", "status": "available"},
      {"id": 4, "name": "Taylor Brown", "handle": "@taylorbrown", "status": "available"}
    ],
    "bot_responses": [
      "It's completely normal to feel nervous about expressing interest in someone. Your feelings are valid.",
      "Take your time to process these emotions. There's no rush to make any decisions.",
      "It sounds like you really care about this person. What draws you to them?",
      "Remember, using WhisperCrush means you're protected by complete anonymity until both of you are ready.",
      "How are you feeling about the possibility of them being interested too?",
      "It's beautiful that you're open to genuine connection. That takes courage.",
      "What would it mean to you if you discovered mutual interest?",
      "Your privacy and emotional safety are the most important things right now."
    ],
    "anonymous_chat_messages": [
      {"sender": "them", "message": "Hi there! I'm so curious who you are, but also nervous 😊", "timestamp": "2:14 PM"},
      {"sender": "them", "message": "I've been thinking about someone in my psychology class for months", "timestamp": "2:15 PM"},
      {"sender": "me", "message": "Really? That's exactly my situation too! Psychology class?", "timestamp": "2:16 PM"},
      {"sender": "them", "message": "Yes! Professor Martinez's class. This is such a coincidence...", "timestamp": "2:17 PM"},
      {"sender": "me", "message": "This is amazing. I sit in the third row, usually on the left side", "timestamp": "2:18 PM"},
      {"sender": "them", "message": "No way! I think I might know who you are... should we reveal?", "timestamp": "2:19 PM"}
    ],
    "user_interests": [
      {"id": 1, "name": "Alex Thompson", "status": "mutual_match", "date_added": "3 weeks ago"}
    ]
  };
  
  // Application state
  let currentScreen = 'welcome-screen';
  
  let biometricSetup = false;

  let botConversation = [];

  let anonymousConversation = [];

  let userInterests = [...appData.user_interests];
  
  // Screen navigation
  function goToScreen(screenId) {
    console.log(`Navigating from ${currentScreen} to ${screenId}`);
    
    const currentScreenEl = document.getElementById(currentScreen);

    const newScreenEl = document.getElementById(screenId);
    
    if (!newScreenEl) {
      console.error(`Screen ${screenId} not found`);
      return;
    }
    
    // Remove active class from current screen
    if (currentScreenEl) {
      currentScreenEl.classList.remove('active');
    }
    
    // Add active class to new screen immediately
    newScreenEl.classList.add('active');

    currentScreen = screenId;
    
    // Initialize screen-specific content
    setTimeout(() => {
      initializeScreen(screenId);
    }, 100);
  }
  
  // Initialize screen-specific content
  function initializeScreen(screenId) {
    console.log(`Initializing screen: ${screenId}`);
    
    switch(screenId) {
      case 'express-interest':
        populateSuggestedPeople();
        
        break;
      
        case 'bot-confidant':
        if (botConversation.length === 0) {
          initializeBotConversation();
        }

        break;
      
        case 'anonymous-chat':
        if (anonymousConversation.length === 0) {
          initializeAnonymousChat();
        }

        break;
    }
  }
  
  // Biometric authentication simulation
  function startBiometricScan() {
    console.log('Starting biometric scan');
    
    const scanner = document.getElementById('fingerprint-scanner');

    const status = document.getElementById('setup-status');

    const button = document.getElementById('start-scan');
    
    if (!scanner || !status || !button) {
      console.error('Biometric elements not found');

      return;
    }
    
    button.disabled = true;

    button.textContent = 'Scanning...';

    scanner.classList.add('scanning');

    status.textContent = 'Scanning fingerprint...';
    
    // Simulate scan process
    setTimeout(() => {
      status.textContent = 'Fingerprint recognized!';
      setTimeout(() => {
        scanner.classList.remove('scanning');

        biometricSetup = true;

        console.log('Biometric setup complete, showing success modal');
        
        showSuccess('Biometric Setup Complete', 'Your identity is now secured with biometric authentication.', () => {
          console.log('Success modal confirmed, navigating to dashboard');

          goToScreen('dashboard');
        });
      }, 1000);
    }, 3000);
  }
  
  // Express interest functionality
  function populateSuggestedPeople() {
    const peopleList = document.getElementById('people-list');

    if (!peopleList) {
      console.error('People list element not found');

      return;
    }
    
    peopleList.innerHTML = '';
    
    appData.potential_matches.forEach(person => {
      const personCard = createPersonCard(person);

      peopleList.appendChild(personCard);
    });
  }
  
  function createPersonCard(person) {
    const card = document.createElement('div');

    card.className = 'person-card';

    card.innerHTML = `
      <div class="person-info">
        <div class="person-name">${person.name}</div>

        <div class="person-handle">${person.handle}</div>
      </div>

      <button class="btn btn--primary btn--sm" onclick="expressInterest('${person.name}', ${person.id})" ${person.status === 'pending' ? 'disabled' : ''}>
        ${person.status === 'pending' ? 'Pending' : 'Express Interest'}
      </button>
    `;
    return card;
  }
  
  function searchPerson() {
    const searchInput = document.getElementById('person-search');

    const searchResults = document.getElementById('search-results');
    
    if (!searchInput || !searchResults) {
      console.error('Search elements not found');

      return;
    }
    
    const query = searchInput.value.trim().toLowerCase();
    
    if (!query) {
      searchResults.innerHTML = '';

      return;
    }
    
    const matches = appData.potential_matches.filter(person => 
      person.name.toLowerCase().includes(query) || 
      person.handle.toLowerCase().includes(query)
    );
    
    searchResults.innerHTML = '';
    
    if (matches.length === 0) {
      searchResults.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary); padding: var(--space-16);">No matches found. Try a different name or handle.</p>';
      
      return;
    }
    
    matches.forEach(person => {
      const personCard = createPersonCard(person);

      searchResults.appendChild(personCard);
    });
  }
  
  function expressInterest(personName, personId) {
    console.log(`Expressing interest in ${personName} (${personId})`);
    
    showConfirmation(
      'Express Interest',
      `Are you sure you want to express interest in ${personName}? They will be notified anonymously only if they're also interested in you.`,
      () => {
        showLoading('Sending anonymous interest...');
        
        setTimeout(() => {
          // Update person status to pending
          const person = appData.potential_matches.find(p => p.id === personId);

          if (person) {
            person.status = 'pending';
          }
          
          hideLoading();
          showSuccess(
            'Interest Expressed!', 
            `Your interest in ${personName} has been recorded anonymously. You'll be notified if there's mutual interest.`,
            () => {
              populateSuggestedPeople(); // Refresh the list
              
              // Simulate mutual match after a delay
              if (personName === 'Alex Thompson') {
                setTimeout(() => {
                  simulateMutualMatch(personName);
                }, 3000);
              }
            }
          );
        }, 2000);
      }
    );
  }
  
  function simulateMutualMatch(personName) {
    console.log(`Simulating mutual match with ${personName}`);
    
    // Show notification badge
    const badge = document.getElementById('match-badge');
    if (badge) {
      badge.style.display = 'flex';
    }
    
    // Show success notification
    showSuccess(
      '✨ Mutual Match!',
      `Great news! ${personName} is also interested in you. You can now start an anonymous chat.`,
      () => {
        // Optional: Auto-navigate to matches
      }
    );
  }
  
  // Bot confidant functionality
  function initializeBotConversation() {
    console.log('Initializing bot conversation');
    
    const messagesContainer = document.getElementById('bot-messages');
    if (!messagesContainer) {
      console.error('Bot messages container not found');
      
      return;
    }
    
    // Initial message is already in HTML
    botConversation.push({
      sender: 'bot',
      message: "Hi there! I'm here to listen and support you through any feelings or concerns you might have. How are you feeling today?"
    });
  }
  
  function sendBotMessage() {
    const input = document.getElementById('bot-input');
    
    if (!input) {
      console.error('Bot input not found');
      
      return;
    }
    
    const message = input.value.trim();
    
    if (!message) return;
    
    console.log(`Sending bot message: ${message}`);
    
    // Add user message
    addBotMessage('user', message);
    input.value = '';
    
    // Simulate bot typing and response
    setTimeout(() => {
      const randomResponse = appData.bot_responses[Math.floor(Math.random() * appData.bot_responses.length)];
      
      addBotMessage('bot', randomResponse);
    }, 1000 + Math.random() * 2000);
  }
  
  function addBotMessage(sender, message) {
    const messagesContainer = document.getElementById('bot-messages');
    
    if (!messagesContainer) {
      console.error('Bot messages container not found');

      return;
    }
    
    const messageEl = document.createElement('div');

    messageEl.className = `message ${sender === 'bot' ? 'bot-message' : 'user-message'}`;
    
    messageEl.innerHTML = `
      <div class="message-avatar">${sender === 'bot' ? '🤖' : '👤'}</div>

      <div class="message-content">
        <p>${message}</p>
      </div>
    `;
    
    messagesContainer.appendChild(messageEl);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    botConversation.push({ sender, message });
  }
  
  // Anonymous chat functionality
  function initializeAnonymousChat() {
    console.log('Initializing anonymous chat');
    
    const messagesContainer = document.getElementById('anonymous-messages');
    
    if (!messagesContainer) {
      console.error('Anonymous messages container not found');

      return;
    }
    
    messagesContainer.innerHTML = ''; // Clear any existing content
    
    appData.anonymous_chat_messages.forEach(msg => {
      const messageEl = createAnonymousMessage(msg.sender, msg.message, msg.timestamp);

      messagesContainer.appendChild(messageEl);
    });
    
    anonymousConversation = [...appData.anonymous_chat_messages];

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  function createAnonymousMessage(sender, message, timestamp) {
    const messageEl = document.createElement('div');

    messageEl.className = `message ${sender === 'me' ? 'user-message' : 'bot-message'} anonymous-message`;
    
    messageEl.innerHTML = `
      <div class="message-avatar">${sender === 'me' ? '👤' : '💜'}</div>

      <div class="message-content">
        <p>${message}</p>

        <div class="message-timestamp">${timestamp}</div>
      </div>
    `;
    
    return messageEl;
  }
  
  function sendAnonymousMessage() {
    const input = document.getElementById('anonymous-input');
    
    if (!input) {
      console.error('Anonymous input not found');

      return;
    }
    
    const message = input.value.trim();
    
    if (!message) return;
    
    console.log(`Sending anonymous message: ${message}`);
    
    const messagesContainer = document.getElementById('anonymous-messages');

    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    // Add user message
    const messageEl = createAnonymousMessage('me', message, timestamp);

    messagesContainer.appendChild(messageEl);
    
    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    anonymousConversation.push({ sender: 'me', message, timestamp });
    
    // Simulate response from match
    setTimeout(() => {
      const responses = [
        "That's so interesting! I never thought about it that way.",
        "I can't believe how much we have in common!",
        "This conversation is making me even more curious about you 😊",
        "I'm starting to think we might actually know each other...",
        "Should we reveal our identities? I'm getting really excited!"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const responseTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

      const responseEl = createAnonymousMessage('them', randomResponse, responseTime);

      messagesContainer.appendChild(responseEl);

      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      anonymousConversation.push({ sender: 'them', message: randomResponse, timestamp: responseTime });
    }, 1500 + Math.random() * 3000);
  }
  
  // Identity revelation
  function showRevealDialog() {
    console.log('Showing reveal dialog');
    
    showConfirmation(
      'Reveal Your Identity',
      'Are you ready to reveal who you are? This action cannot be undone, and your match will see your full profile.',
      () => {
        showLoading('Revealing identity...');
        
        setTimeout(() => {
          hideLoading();

          showSuccess(
            'Identity Revealed!',
            'You have successfully revealed your identity. Your match has been notified and can now see who you are.',
            () => {
              showNotImplemented('Full identity reveal flow');
            }
          );
        }, 2000);
      }
    );
  }
  
  // Modal management
  function showConfirmation(title, message, onConfirm) {
    console.log(`Showing confirmation modal: ${title}`);
    
    const modal = document.getElementById('confirmation-modal');

    const titleEl = document.getElementById('modal-title');

    const messageEl = document.getElementById('modal-message');

    const confirmBtn = document.getElementById('modal-confirm');
    
    if (!modal || !titleEl || !messageEl || !confirmBtn) {
      console.error('Confirmation modal elements not found');

      return;
    }
    
    titleEl.textContent = title;

    messageEl.textContent = message;
    
    // Remove any existing click handlers
    confirmBtn.onclick = null;
    
    confirmBtn.onclick = (e) => {
      e.preventDefault();

      console.log('Confirmation modal confirmed');

      closeModal();

      if (onConfirm) {
        setTimeout(onConfirm, 100);
      }
    };
    
    modal.classList.remove('hidden');
  }
  
  function showSuccess(title, message, onContinue) {
    console.log(`Showing success modal: ${title}`);
    
    const modal = document.getElementById('success-modal');

    const titleEl = document.getElementById('success-title');

    const messageEl = document.getElementById('success-message');

    const continueBtn = modal.querySelector('.btn--primary');
    
    if (!modal || !titleEl || !messageEl || !continueBtn) {
      console.error('Success modal elements not found');

      return;
    }
    
    titleEl.textContent = title;

    messageEl.textContent = message;
    
    // Remove any existing click handlers
    continueBtn.onclick = null;
    
    continueBtn.onclick = (e) => {
      e.preventDefault();

      console.log('Success modal continued');

      closeModal();

      if (onContinue) {
        setTimeout(onContinue, 100);
      }
    };
    
    modal.classList.remove('hidden');
  }
  
  function closeModal() {
    console.log('Closing modals');
    
    const modals = document.querySelectorAll('.modal');

    modals.forEach(modal => modal.classList.add('hidden'));
  }
  
  function showLoading(text = 'Processing...') {
    console.log(`Showing loading: ${text}`);
    
    const overlay = document.getElementById('loading-overlay');

    const textEl = document.getElementById('loading-text');
    
    if (!overlay || !textEl) {
      console.error('Loading overlay elements not found');

      return;
    }
    
    textEl.textContent = text;

    overlay.classList.remove('hidden');
  }
  
  function hideLoading() {
    console.log('Hiding loading');
    
    const overlay = document.getElementById('loading-overlay');

    if (overlay) {
      overlay.classList.add('hidden');
    }
  }
  
  function showNotImplemented(feature = 'This feature') {
    showSuccess(
      'Coming Soon!',
      `${feature} is not implemented in this prototype yet, but would be available in the full application.`
    );
  }
  
  // Event listeners
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing event listeners');
    
    // Initialize person search
    const searchInput = document.getElementById('person-search');

    if (searchInput) {
      searchInput.addEventListener('input', searchPerson);

      searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          searchPerson();
        }
      });
    }
    
    // Initialize bot chat input
    const botInput = document.getElementById('bot-input');
    if (botInput) {
      botInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();

          sendBotMessage();
        }
      });
    }
    
    // Initialize anonymous chat input
    const anonymousInput = document.getElementById('anonymous-input');
    if (anonymousInput) {
      anonymousInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();

          sendAnonymousMessage();
        }
      });
    }
    
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('modal-overlay')) {
        closeModal();
      }
    });
    
    // Handle escape key for modals
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeModal();

        hideLoading();
      }
    });
    
    console.log('Event listeners initialized successfully');
  });
  
  // Utility functions
  function formatTime(date) {
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }
  
  function debounce(func, wait) {
    let timeout;

    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);

        func(...args);
      };

      clearTimeout(timeout);

      timeout = setTimeout(later, wait);
    };
  }
  
  // Debug function to check if elements exist
  function debugElements() {
    console.log('=== Element Debug ===');

    const elements = [
      'welcome-screen',
      'biometric-setup', 
      'dashboard',
      'express-interest',
      'bot-confidant',
      'matches',
      'anonymous-chat'
    ];
    
    elements.forEach(id => {
      const el = document.getElementById(id);

      console.log(`${id}: ${el ? 'Found' : 'Missing'}`);
    });
  }