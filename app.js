let express = require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let room_id = 0;

let clients = [];
let chats = [];

app.use(express.static('public'));
http.listen(3000, function(){
  console.log('server on!');
});

io.on('connection', (socket) =>{

  socket.on('join', (nickname) =>{
    let client = new Object();
    client.id = socket.id;
    client.name = nickname;
    clients.push(client);
    socket.emit('getId', client);
    io.emit('users', clients);
  });

  socket.on('disconnect', () =>{
    clients.forEach((client, i) => {
      if(client.id === socket.id){
        clients.splice(i, 1);
      } 
    });
    io.emit('users', clients);
  });

  socket.on('createRoom', (roomName, my_id) =>{
    socket.join(roomName);
    room_id ++;
    var room_list = {};
    var rooms = io.sockets.adapter.rooms;
    Object.keys(rooms).map((key, index) => {
      var value = rooms[key];
      if(key != Object.keys(value.sockets)[0]){
        value.room_id = room_id;
        value.room_master = findName(my_id);
        room_list[key] = value;
      }
    });
    io.emit("roomlist", room_list);
  });

  socket.on('chat', (chatObject) =>{
    let chatData = new Object();
    clients.forEach(client => {
      if(client.id === chatObject.id){
        chatData.name = client.name;
        chatData.value = chatObject.value;
        return;
      }
    });
    chats.push(chatData);
    io.emit('chat', chats)
  });

  socket.on('initDraw', (location) =>{
    io.emit('initDraw', location);
  });

  socket.on('Draw', (location) =>{
    io.emit('Draw', location);
  });

  socket.on('finishDraw', ()=>{
    io.emit("finishDraw");
  });

  socket.on('setColor', (el) =>{
    io.emit('setColor', el);
  });

  socket.on('setEraser', ()=>{
    io.emit('setEraser');
  });

  socket.on('selectWidth', (e)=>{
    io.emit('selectWidth', e);
  });

  socket.on('canvasClear', () =>{
    io.emit('canvasClear');
  });
})

function findName(id){
  let name;
  clients.forEach(client => {
    if(client.id === id){
      name = client.name;
    }
  });
  return name;
}