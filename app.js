let express = require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

let clients = [];

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
    console.log(client);
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
  })

  socket.on('chat', (chatObject) =>{
    let chatData = new Object();
    clients.forEach(client => {
      if(client.id === chatObject.id){
        chatData.name = client.name;
        chatData.value = chatObject.value;
        return;
      }
    });
    io.emit('chat', chatData)
  });

  // socket.on('setName', (nickname) =>{
  //   console.log(socket.id);
  //   socket.nickname = nickname;
  //   socket.join('room');
    
  //   console.log(io.sockets.adapter.rooms['room']);

  //   // roster.forEach(function(client) {
  //   //     console.log('Username: ' + client.nickname);
  //   // });
  // })

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