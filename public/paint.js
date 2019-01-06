const socket = io();
let canvas;
let ctx;
let btn;
let colorPicker;
let widthRange;
let posX = -1;
let posY = -1;
let drawable = false;
let lineWidth = 1;
let lineWidthNum;
let chat;
let my_id;
let users;
let chatting;

window.onload = () =>{

  let nickname = prompt('이름을 입력해주세요.');
  socket.emit("join", nickname);

  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  colorPicker = document.getElementById("colorPicker"); 
  widthRange = document.getElementById("selectWidth");
  lineWidthNum = document.getElementById("lineWidthNum");
  chat = document.getElementById("chat");
  users = document.getElementById("users");
  chatting = document.getElementById("chatting");

  canvas.addEventListener("mousedown", (e) =>{
    let pageLocation = {
      pageX : e.pageX,
      pageY : e.pageY
    };
    let location  = getPosition(pageLocation);
    socket.emit("initDraw", location);
  });

  canvas.addEventListener("mousemove", (e) =>{
    if(drawable){
      let pageLocation = {
        pageX : e.pageX,
        pageY : e.pageY
      };
      let location  = getPosition(pageLocation);
      socket.emit('Draw', location);
    }
  });

  canvas.addEventListener("mouseup", ()=>{
    socket.emit('finishDraw');
  });

  canvas.addEventListener("mouseout", ()=>{
    socket.emit('finishDraw');
  });

  widthRange.addEventListener('input', selectWidth);

}

socket.on('users', (clients)=>{
  while (users.hasChildNodes()) {             // user remove
    users.removeChild(users.lastChild);
  };

  clients.forEach(client => {                 // user add
    let parentDiv = document.createElement("li");
    parentDiv.style.display = "inline-block";
    let childDiv = document.createElement("div");
    childDiv.innerHTML = client.name;
    childDiv.style.textAlign = "center";
    childDiv.style.color = "#fff";
    childDiv.style.fontSize = "1.25rem";
    let img = document.createElement("img");
    img.width = 150;
    img.src = './icon/boy.png';
    parentDiv.appendChild(img);
    parentDiv.appendChild(childDiv);
    users.appendChild(parentDiv);
  });
});

socket.on("getId", (client) =>{
  my_id = client.id;
});

socket.on('chat', (chats) =>{
  while (chatting.hasChildNodes()) {             // chatting remove
    chatting.removeChild(chatting.lastChild);
  };
  chats.forEach(chat => {
    let li = document.createElement("li");
    li.innerHTML = `${chat.name} : ${chat.value}`;
    chatting.appendChild(li);  
  });
})

socket.on("initDraw", (location)=>{
  ctx.beginPath();
  initDraw(location);
});

socket.on("Draw", (location) =>{
    Draw(location);
});

socket.on("finishDraw", ()=>{
  finishDraw();
});

socket.on("setColor", (el) =>{
  ctx.strokeStyle = el.backgroundColor;
});

socket.on("setEraser", () =>{
  ctx.strokeStyle = "#fff";
});

socket.on("selectWidth", (e) =>{
  lineWidth = e;
  ctx.lineWidth = lineWidth;
  widthRange.value = lineWidth;
  lineWidthNum.innerHTML = lineWidth;
});

socket.on('canvasClear', () =>{
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
});

function initDraw(location){
  drawable = true;
  ctx.moveTo(location.X, location.Y);
  ctx.lineWidth = lineWidth;
} 


function Draw(location){
    ctx.lineTo(location.X, location.Y);
    ctx.stroke();
}

function getPosition(location){
  var rect = canvas.getBoundingClientRect();
  let x = location.pageX - rect.left
  let y = location.pageY - rect.top
  return {X : x, Y : y};
}

function finishDraw(e){
  drawable = false;
  posX = -1;
  posY = -1;
}

function setColor(el){
  socket.emit("setColor", el);
}

function erase(){
  socket.emit('setEraser');
}

function selectWidth(e){
  socket.emit('selectWidth', e.target.value);
}

function canvasClear(){
  socket.emit('canvasClear');
}

function submit(){
  let chatObject = new Object();
  chatObject.id = my_id;
  chatObject.value = chat.value
  socket.emit('chat', chatObject);
}