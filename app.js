let express = require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let room_id = -1;

let rooms = [];
let clients = [];
let chats = [];

app.use(express.static('public'));
http.listen(4000, function () {
  console.log('server on!');
});

io.on('connection', (socket) => {

  console.log("connection : " + socket.id);

  io.emit('roomlist', rooms);

  socket.on('join', (nickname) => {
    let client = new Object();
    console.log("join : " + socket.id);
    client.id = socket.id;
    client.name = nickname;
    client.room_id = null;
    clients.push(client);
    socket.emit('getId', client.id);
    io.emit('users', clients);
  });

  socket.on('disconnect', () => {

    let room_id;

    clients.forEach(client =>{
      if(client.id === socket.id){
        room_id = client.room_id;
      }
    })

    clients.forEach((client, i) => {
      if (client.id === socket.id) {
        clients.splice(i, 1);
      }
    });

    rooms.forEach((room, i) => {

      let room_master = Object.keys(room.detail.sockets)[0];

      room.room_master = findName(room_master);

      
      
      if(room.room_id === room_id){
        io.in(room_id).emit('getRoomInfo', room.detail, clients);
      }

      if(room.detail.length === 0){
        rooms.splice(i, 1);
      }
    });

    io.emit('roomlist', rooms);
    io.emit('users', clients);

  });

  socket.on('main_chat', (chatObject)=>{
    let chatData = {
      name : findName(chatObject.id),
      content : chatObject.content
    };
    io.emit('main_chat', chatData);
  })


  socket.on('createRoom', (roomName, my_id) => {
    room_id++;
    socket.join(room_id);
    clients.forEach(client => {
      if(client.id === socket.id){
        client.room_id = room_id;
      };
    });
    let room_list = {};
    let socketRooms = io.sockets.adapter.rooms;
    Object.keys(socketRooms).map((key, index) => {
      var value = socketRooms[key];
      if (key != Object.keys(value.sockets)[0]) {
        room_list[key] = value;
      }
    });


    let lastKey = Object.keys(room_list)[Object.keys(room_list).length -1];

    let roomMaster = findName(Object.keys(socketRooms[lastKey].sockets)[0]);

    let newRoom = new Object();
    newRoom.room_id = lastKey;
    newRoom.room_name = roomName;
    newRoom.room_master = roomMaster;
    newRoom.detail = room_list[lastKey];
    rooms.push(newRoom);

    console.log(rooms[0].detail.sockets);

    socket.emit("joinRoomSuccess", room_id);
    io.emit("roomlist", rooms);

  });

  socket.on('joinRoom', (room_id) => {
    console.log("joinRoom Socket " + socket.id);
    // let socketRooms = io.sockets.adapter.rooms;
    socket.join(room_id);
    console.log(rooms[0].detail.sockets);
    clients.forEach(client => {
      if(client.id === socket.id){
        client.room_id = room_id;
      };
    });
    socket.emit("joinRoomSuccess", room_id);
    io.emit("roomlist", rooms);
  });

  socket.on('chat', (chatObject) => {
    let chatData = new Object();
    clients.forEach(client => {
      if (client.id === chatObject.id) {
        chatData.name = client.name;
        chatData.value = chatObject.value;
        return;
      }
    });
    chats.push(chatData);
    io.emit('chat', chats)
  });

  socket.on("getRoomInfo", (room_id) => {
    console.log("getRoomInfo Socket " + socket.id);
    socket.leave(room_id);
    socket.join(room_id);
    rooms.forEach(room => {
      if(room.room_id === room_id){
        io.in(room_id).emit('getRoomInfo', room.detail, clients);
      }
    });
    // let room_list = {};
    // let socketRooms = io.sockets.adapter.rooms;
    // Object.keys(socketRooms).map((key, index) => {
    //   var value = socketRooms[key];
    //   if (key != Object.keys(value.sockets)[0]) {
    //     room_list[key] = value;
    //   }
    // });

    // let lastKey = Object.keys(room_list)[Object.keys(room_list).length -1];

    // let roomMaster = findName(Object.keys(socketRooms[lastKey].sockets)[0]);

    // let newRoom = new Object();
    // newRoom.room_id = lastKey;
    // // newRoom.room_name = roomName;
    // newRoom.room_master = roomMaster;
    // newRoom.detail = room_list[lastKey];

  });

  socket.on('initDraw', (location) => {
    io.emit('initDraw', location);
  });

  socket.on('Draw', (location) => {
    io.emit('Draw', location);
  });

  socket.on('finishDraw', () => {
    io.emit("finishDraw");
  });

  socket.on('setColor', (el) => {
    io.emit('setColor', el);
  });

  socket.on('setEraser', () => {
    io.emit('setEraser');
  });

  socket.on('selectWidth', (e) => {
    io.emit('selectWidth', e);
  });

  socket.on('canvasClear', () => {
    io.emit('canvasClear');
  });
})

function findName(id) {
  // let name = clients.filter(client =>{
  //   Object.values(client.id) === id 
  // });
  let name;
  clients.forEach(client => {
    if (client.id === id) {
      name = client.name;
    }
  });
  return name;
}
