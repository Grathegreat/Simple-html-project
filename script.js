let username = "Mot";
let currentContact = "Chat Bot";
let contacts = {};
let customReplies = {};

function updateDateTime() {
    const now = new Date();
    const dateTimeString = now.toLocaleString();
    document.getElementById('datetime').textContent = dateTimeString;
}

function login() {
    username = document.getElementById('username').value;
    if (username) {
        document.getElementById('login-section').style.display = "none";
        document.getElementById('chat-section').style.display = "flex";
    } else {
        alert("Please enter a username.");
    }
}

function addContact() {
    const contactName = document.getElementById('new-contact').value;
    if (contactName && !contacts[contactName]) {
        contacts[contactName] = [];
        const contactList = document.getElementById('contact-list');
        const contactItem = document.createElement('li');
        contactItem.textContent = contactName;
        contactItem.onclick = () => selectContact(contactName);
        contactList.appendChild(contactItem);
        document.getElementById('new-contact').value = '';
    }
}

function selectContact(name) {
    currentContact = name;
    document.getElementById('chat-window').innerHTML = "";
    const messages = contacts[name];
    messages.forEach(message => {
        addMessageToWindow(message.text, message.type);
    });
}

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value;
    if (messageText && currentContact) {
        const message = { text: messageText, type: 'sent' };
        contacts[currentContact].push(message);
        addMessageToWindow(messageText, 'sent');
        messageInput.value = '';

        // Check for help command
        if (messageText.toLowerCase() === "help") {
            showGeneralHelp();
            return;
        }

        // Check for specific help command
        if (messageText.toLowerCase().startsWith("help")) {
            const command = messageText.substring(5).trim();
            showCommandHelp(command);
            return;
        }

        // Check if the message is a teaching command
        if (messageText.startsWith("teach")){
            const [trigger, response] = messageText.substring(6).split(" | ");
            if (trigger && response) {
                if (!customReplies[trigger.toLowerCase()]) {
                    customReplies[trigger.toLowerCase()] = [];
                }
                customReplies[trigger.toLowerCase()].push(response);
                addMessageToWindow(`Learned "${trigger}"\nresponse "${response}"`, 'received');
            } else {
                addMessageToWindow("Use: teach [trigger] | [response]", 'received');
            }
        } else {
            // Simulate receiving an auto-generated message
            setTimeout(() => {
                const replyText = generateAutoReply(messageText);
                const reply = { text: replyText, type: 'received' };
                contacts[currentContact].push(reply);
                addMessageToWindow(reply.text, 'received');
            }, 1000);
        }
    }
}

function addMessageToWindow(text, type) {
    const chatWindow = document.getElementById('chat-window');
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    chatWindow.appendChild(message);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function generateAutoReply(messageText) {
    messageText = messageText.toLowerCase();
    if (customReplies[messageText] && customReplies[messageText].length > 0) {
        // Randomly select a response if there are multiple
        const responses = customReplies[messageText];
        const randomIndex = Math.floor(Math.random() * responses.length);
        return responses[randomIndex];
    }

    const keywordReplies = {
        "hello": ["Hi there!", "Hello!"],
        "how are you": ["I'm just a bot, but I'm doing great! How about you?"],
        "what is your name": ["I'm your friendly chat bot!"],
        "bye": ["Goodbye! Have a great day!"]
    };

    for (const [keyword, replies] of Object.entries(keywordReplies)) {
        if (messageText.includes(keyword)) {
            const randomIndex = Math.floor(Math.random() * replies.length);
            return replies[randomIndex];
        }
    }

    return "I'm sorry, I don't understand that.";
}

function showGeneralHelp() {
    let helpMessage = "Available commands:\n";
    helpMessage += "- teach\n";
    helpMessage += "- help\n";
    helpMessage += "> Use help [command] to get more information about a specific command."
    addMessageToWindow(helpMessage, 'received');
}

function showCommandHelp(command) {
    let helpMessage = "";

    switch(command) {
        case "teach":
            helpMessage = "To teach the bot, use:\n";
            helpMessage += "teach [trigger] | [response]\n";
            helpMessage += "Example: teach hello | Hi there!";
            break;
        case "help":
            helpMessage = "To get help for a specific command, use:\n";
            helpMessage += "help [command]\n";
            helpMessage += "Example: help teach";
            break;
        default:
            helpMessage = `Unknown command "${command}". Type "help" to see available commands.`;
            break;
    }

    addMessageToWindow(helpMessage, 'received');
}

// Initial call to display the date and time immediately
updateDateTime();

// Update the date and time every second (1000 milliseconds)
setInterval(updateDateTime, 1000);