let username = "";
let currentContact = "";
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
        // Simulate a 10-second delay before adding the contact
        setTimeout(() => {
            contacts[contactName] = [];
            const contactList = document.getElementById('contact-list');
            const contactItem = document.createElement('li');
            contactItem.textContent = contactName;
            contactItem.onclick = () => selectContact(contactName);
            contactList.appendChild(contactItem);
            document.getElementById('new-contact').value = '';

            // Notify the user that the friend request has been accepted
            const notification = `${contactName} accepted your friend request`;
            addMessageToWindow(notification, 'received');
        }, 10000); // 10 seconds delay
    } else {
        alert("Already friends or invalid input.");
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
    const messageText = messageInput.value.trim();
    if (messageText && currentContact) {
        const message = { text: messageText, type: 'sent' };
        contacts[currentContact].push(message);
        addMessageToWindow(messageText, 'sent');
        messageInput.value = '';

        const command = messageText.toLowerCase();

        if (command === "help") {
            showGeneralHelp();
        } else if (command.startsWith("help")) {
            const commandHelp = command.substring(5).trim();
            showCommandHelp(commandHelp);
        } else if (command.startsWith("teach")) {
            handleTeachCommand(messageText);
        } else if (command === "randomquotes") {
            sendRandomQuote();
        } else if (command === "shoti") {
            fetchShotiVideo();
        } else {
            setTimeout(() => {
                const replyText = generateAutoReply(messageText);
                const reply = { text: replyText, type: 'received' };
                contacts[currentContact].push(reply);
                addMessageToWindow(reply.text, 'received');
            }, 1000);
        }
    } else {
        alert("Please enter a message and select a contact.");
    }
}

function handleTeachCommand(messageText) {
    const [trigger, response] = messageText.substring(6).split(" | ");
    if (trigger && response) {
        if (!customReplies[trigger.toLowerCase()]) {
            customReplies[trigger.toLowerCase()] = [];
        }
        customReplies[trigger.toLowerCase()].push(response);
        addMessageToWindow(`Learned new response for: "${trigger}"`, 'received');
    } else {
        addMessageToWindow("Invalid teach command format. Use: teach [trigger] | [response]", 'received');
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
    const lowerText = messageText.toLowerCase();
    if (customReplies[lowerText] && customReplies[lowerText].length > 0) {
        const responses = customReplies[lowerText];
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
        if (lowerText.includes(keyword)) {
            const randomIndex = Math.floor(Math.random() * replies.length);
            return replies[randomIndex];
        }
    }

    return "I'm sorry, I don't understand that.";
}

function showGeneralHelp() {
    let helpMessage = "Available commands:\n";
    helpMessage += "- teach [trigger] | [response]: Teach the bot to respond to a specific trigger.\n";
    helpMessage += "- help [command]: Display help for a specific command.\n";
    helpMessage += "- randomquotes: Get a random quote.\n";
    helpMessage += "- shoti: Get a random Shoti girl video.";
    addMessageToWindow(helpMessage, 'received');
}

function showCommandHelp(command) {
    let helpMessage = "";

    switch (command) {
        case "teach":
            helpMessage = "To teach the bot a new response, use:\n";
            helpMessage += "teach [trigger] | [response]\n";
            helpMessage += "Example: teach hello | Hi there!";
            break;
        case "help":
            helpMessage = "To get help for a specific command, use:\n";
            helpMessage += "help [command]\n";
            helpMessage += "Example: help teach";
            break;
        case "randomquotes":
            helpMessage = "To get a random quote, use:\n";
            helpMessage += "randomquotes";
            break;
        case "shoti":
            helpMessage = "To get a random Shoti girl video, use:\n";
            helpMessage += "shoti";
            break;
        default:
            helpMessage = `Unknown command "${command}". Type "help" to see available commands.`;
            break;
    }

    addMessageToWindow(helpMessage, 'received');
}

function sendRandomQuote() {
    const quotes = [
        "The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt",
        "The purpose of our lives is to be happy. - Dalai Lama",
        "Life is what happens when you're busy making other plans. - John Lennon",
        "Get busy living or get busy dying. - Stephen King",
        "You have within you right now, everything you need to deal with whatever the world can throw at you. - Brian Tracy"
    ];
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    addMessageToWindow(randomQuote, 'received');
}

function fetchShotiVideo() {
    // Simulate an API call to fetch a random Shoti girl video
    const shotiVideos = [
        "https://example.com/shoti1.mp4",
        "https://example.com/shoti2.mp4",
        "https://example.com/shoti3.mp4"
    ];
    const randomIndex = Math.floor(Math.random() * shotiVideos.length);
    const shotiVideo = shotiVideos[randomIndex];
    addMessageToWindow(`Here is a Shoti girl video: ${shotiVideo}`, 'received');
}

// Initial call to display the date and time immediately
updateDateTime();

// Update the date and time every second (1000 milliseconds)
setInterval(updateDateTime, 1000);
