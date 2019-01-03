let express = require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

app.use(express.static('public'));
http.listen(3000, function(){
  console.log('server on!');
});

io.on('connection', (socket) =>{
  console.log('연결 됬어요');

  socket.on('initDraw', (location) =>{
    io.emit('initDraw', location);
  });

  socket.on('Draw', (location) =>{
    io.emit('Draw', location);
    console.log(location);
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