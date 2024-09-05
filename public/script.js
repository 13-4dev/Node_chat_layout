const socket = io();


let username = '';

function promptUsername() {
    username = prompt("Enter your username:");
    if (!username) {
        promptUsername(); 
    } else {
        socket.emit('set username', username); 
    }
}

promptUsername(); 


socket.on('user connected', function(users) {
    const userList = document.querySelector('.user-list');
    userList.innerHTML = ''; 

    users.forEach(user => {
        let userElement = document.createElement('div');
        userElement.className = 'user';
        userElement.textContent = `> ${user}`;
        userList.appendChild(userElement);
    });
});


socket.on('user disconnected', function(users) {
    const userList = document.querySelector('.user-list');
    userList.innerHTML = ''; 

    users.forEach(user => {
        let userElement = document.createElement('div');
        userElement.className = 'user';
        userElement.textContent = `> ${user}`;
        userList.appendChild(userElement);
    });
});


document.querySelector('input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});


document.getElementById('send-button').addEventListener('click', function () {
    sendMessage();
});


function sendMessage() {
    let input = document.querySelector('input');
    let message = input.value.trim();
    if (message !== "") {
        socket.emit('chat message', message);
        input.value = "";
    }
}


socket.on('chat message', function(data) {
    let chatWindow = document.querySelector('.chat-window');
    let newMessage = document.createElement('div');
    newMessage.className = 'message';
    newMessage.textContent = `${data.user}: ${data.message}`;
    chatWindow.appendChild(newMessage);
    chatWindow.scrollTop = chatWindow.scrollHeight;
});
