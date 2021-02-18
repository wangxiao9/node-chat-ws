const socket = io();
const chatForm = document.querySelector('#chat-form');
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name');
const userlist = document.getElementById('users');

// 根据url获取用户名和用户房间
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// 用户加入房间
socket.emit('joinRoom', {username, room});

// 监听获得到服务器发送的内容
socket.on('message', (message) => {
    console.log(message); // 打印服务端的message
    outputMessage(message);

    // 添加滚动条
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// 监听客户端消息提交
chatForm.addEventListener('submit', e => {
    e.preventDefault();
    // 获取提交消息
    const msg = e.target.elements.msg.value;
    socket.emit('chatMessage', msg);
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// 添加聊天室的内容
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;
    chatMessages.appendChild(div);
};
