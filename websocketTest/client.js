const notyf = new Notyf();

let globalSocket = null;

document.getElementById('userIdForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const userId = document.getElementById('userIdInput').value.trim();
    if (userId) {
        localStorage.setItem('userId', userId);
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('chatPage').style.display = 'block';
        globalSocket = initSocket();
        fetchAndDisplayUsers();
    } else {
        alert('Please enter a user ID.');
    }
});



function initSocket() {
    const userId = localStorage.getItem('userId');
    const socket = io('http://localhost:3000', {
        query: { userId }
    }); 
    socket.on('connect', () => {
        console.log('Connected to WebSocket server!');
    });

    socket.on('new-message', message => {

        console.log('New message received:', message);
    
        const currentUser = localStorage.getItem('userId');
        const selectedUser = localStorage.getItem('selectedUserId');
    

        if (message.senderId == currentUser || message.senderId == selectedUser) {
            addMessageToList(message);
        } else {
            notyf.success('New message received from ' + message.sender.username);
        }
        // console.log('New message received:', message);
        // addMessageToList(message);
    });

    socket.on('new-emoji', message => {
        console.log('New emoji received:', message);
      
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server.');
    });

    document.getElementById('messageForm').addEventListener('submit', function(event) {
        event.preventDefault();
        sendMessage(socket);
    });

    return socket;

    
}

function fetchAndDisplayUsers() {
    axios.get('http://localhost:3000/users')
    .then(response => {
        const users = response.data;
        const currentUser = localStorage.getItem('userId');
        const userList = document.getElementById('userList');
        userList.innerHTML = ''; // Clear the list first
        users.forEach(user => {
            if (user.id.toString() !== currentUser) {
                const li = document.createElement('li');
                li.textContent = `${user.firstname} ${user.lastname} (${user.username})`;
                li.onclick = () => selectUser(user.id);
                userList.appendChild(li);
            }
        });
    })
    .catch(error => {
        console.log('Error fetching users:', error);
    });
}

async function selectUser(userId) {
    console.log('User selected:', userId);
    localStorage.setItem('selectedUserId', userId);
    const messagesList = document.getElementById('messages');
        messagesList.innerHTML = ''; // Clear previous messages
    await fetchMessages(userId);
}

async function fetchMessages(userId) {
    const senderId = localStorage.getItem('userId');
    if (!senderId) return;

    await axios.get(`http://localhost:3000/messages`, {
        params: {
            senderId: senderId,
            receiverId: userId        }
    })
    .then(response => {
        const messages = response.data;
        

        // displayMessages(messages);
        messages.forEach(message => {
            addMessageToList(message);
        });
    })
    .catch(error => {
        console.error('Error fetching messages:', error);
    });
}

const emojisList = ['😀', '😂', '😍', '😎', '😜', '😡'];

function addMessageToList(message) {
    const messagesList = document.getElementById('messages');
    const newMessageItem = document.createElement('div');
    newMessageItem.classList.add('message');
    newMessageItem.style.padding = '10px';
    newMessageItem.style.margin = '10px';
    newMessageItem.style.position = 'relative';
    //set id to message id for future reference
    newMessageItem.id = message.id + 'message';
    //add on mouse enter event to show delete button
    newMessageItem.onmouseenter = () => {
        //display a list of emojis to choose from
        const emojis = document.createElement('div');
        emojis.id = message.id + 'emojis';
        emojis.style.display = 'flex';
        emojis.style.flexWrap = 'wrap';
        emojis.style.justifyContent = 'center';
        emojis.style.alignItems = 'center';
        emojis.style.position = 'absolute';
        emojis.style.top = '0';
        emojis.style.right = '0';
        emojis.style.backgroundColor = 'white';
        emojis.style.border = '1px solid black';
        emojis.style.borderRadius = '5px';
        emojis.style.padding = '5px';
        emojis.style.zIndex = '1';
        emojis.style.cursor = 'pointer';
        emojis.style.boxShadow = '0 0 5px rgba(0,0,0,0.5)';
        emojis.style.display = 'none';
        emojisList.forEach((emoji, index) => {
            const emojiItem = document.createElement('div');
            emojiItem.id = index;
            emojiItem.textContent = emoji;
            emojiItem.style.fontSize = '20px';
            emojiItem.style.margin = '5px';
            emojiItem.onclick = () => {
                document.getElementById('messageInput').value += emoji;
            };
            emojiItem.addEventListener('click', function() {
                let messageId = message.id;
                let emoji = index;
                let userId = localStorage.getItem('userId');
                addEmoji(messageId, emoji, userId);
            });
            console.log(emojiItem);
            emojis.appendChild(emojiItem);
        });
        newMessageItem.appendChild(emojis);
        emojis.style.display = 'flex';
    };
    newMessageItem.onmouseleave = () => {
        document.getElementById(message.id + 'emojis').remove();
    };
    //display the emojis 
    // console.log(message.emojis);
    // if (message.emojis) {
    //     message.emojis.forEach(emoji => {
    //         const emojiSpan = document.createElement('span');
    //         emojiSpan.textContent = emojisList[emoji.emoji];
    //         console.log(emojiSpan);
    //         newMessageItem.appendChild(emojiSpan);
    //     });
    // }
    const emojisDisplay = document.createElement('div');
    emojisDisplay.style.display = 'flex';
    emojisDisplay.style.flexWrap = 'wrap';
    emojisDisplay.style.justifyContent = 'center';
    emojisDisplay.style.alignItems = 'center';
    emojisDisplay.style.position = 'absolute';
    emojisDisplay.style.bottom = '5px';
    emojisDisplay.style.right = '10px';
    emojisDisplay.style.right = '0';
    emojisDisplay.style.borderRadius = '5px';
    emojisDisplay.style.marginRight = '10px';
    emojisDisplay.style.border = '1px solid black';
    emojisDisplay.style.backgroundColor = 'white';
    console.log("message emojis",message.emojis);

    if (message.emojis) {
        message.emojis.forEach(emoji => {
            const emojiSpan = document.createElement('div');
            emojiSpan.textContent = emojisList[emoji.emoji];
            emojiSpan.style.fontSize = '10px';
            emojiSpan.style.margin = '5px';
            emojisDisplay.appendChild(emojiSpan);
        });
    }


    console.log('New message:', newMessageItem);



    
    newMessageItem.textContent = `${message.sender.username}: ${message.messageContent}`;
    newMessageItem.appendChild(emojisDisplay);
    messagesList.appendChild(newMessageItem);
}



function addEmoji(messageId, emoji, userId) {
    console.log('Adding emoji:', messageId, emoji, userId);
   if(messageId && emoji && userId) {
    globalSocket.emit('addEmoji', { messageId, emoji, userId });
   }
}

function sendMessage(socket) {
    const messageContent = document.getElementById('messageInput').value.trim();
    const senderId = localStorage.getItem('userId');
    const receiverId = localStorage.getItem('selectedUserId');
    if (senderId && receiverId && messageContent) {
        const message = { senderId, receiverId, messageContent };
        socket.emit('addMessage', message);
        document.getElementById('messageInput').value = '';
    } else {
        alert('Please select a user and enter a message.');
    }
}
