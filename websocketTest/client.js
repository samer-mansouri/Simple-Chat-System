const notyf = new Notyf();

document.getElementById('userIdForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const userId = document.getElementById('userIdInput').value.trim();
    if (userId) {
        localStorage.setItem('userId', userId);
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('chatPage').style.display = 'block';
        initSocket();
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

    socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server.');
    });

    document.getElementById('messageForm').addEventListener('submit', function(event) {
        event.preventDefault();
        sendMessage(socket);
    });
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
            receiverId: userId,
            isRoom: false
        }
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


function addMessageToList(message) {
    const messagesList = document.getElementById('messages');
    const newMessageItem = document.createElement('li');
    newMessageItem.textContent = `${message.sender.username}: ${message.messageContent}`;
    messagesList.appendChild(newMessageItem);
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
