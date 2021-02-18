// 引入模块
const express = require("express");
const path = require("path");
const socket = require("socket.io");
const http = require("http");

// 初始化
const app = express();
const server = http.createServer(app);
// io开启一个连接
const io = socket(server);

// 引入静态文件
app.use(express.static(path.join(__dirname, "public")));

// 引入formatMsg对象
const bootM = require("./utils/fomatMsg");
const { userJoin, getCurrentUser } = require("./utils/user");

// 服务器监听客户端是否出发连接事件
io.on("connection", socket => {
  // console.log("socket.io 已连接")
  // 加入房间事件
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    // 消息一对一触发
    socket.emit("message", bootM("小助手", "欢迎加入聊天室")); // 触发message
    // 消息的广播 -> 其他窗口的chat可看到当前用户加入的消息
    socket.broadcast.to(user.room).emit("message", bootM(`小助手`, `欢迎${user.username}加入${user.room}聊天室`));
  });

  // 监听客户端发送来的信息
  socket.on("chatMessage", msg => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", bootM(user.username, msg));
  });
  // 断开连接
  socket.on("disconnect", socket => {
    // 所有人接收
    io.emit("message", "xxx已经下线");
  });
});
// 设置监听端口号
const PORT = process.env.PORT || 9090;

// 监听端口号
server.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
