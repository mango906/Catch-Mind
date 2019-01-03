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

window.onload = () =>{
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  colorPicker = document.getElementById("colorPicker"); 
  widthRange = document.getElementById("selectWidth");
  lineWidthNum = document.getElementById("lineWidthNum");

  canvas.addEventListener("mousedown", (e) =>{
    let location = {
      pageX : e.pageX,
      pageY : e.pageY
    }
    socket.emit("initDraw", location);
  });

  canvas.addEventListener("mousemove", (e) =>{
    let location = {
      pageX : e.pageX,
      pageY : e.pageY
    }
    socket.emit('Draw', location);
  });

  canvas.addEventListener("mouseup", ()=>{
    socket.emit('finishDraw');
  });

  canvas.addEventListener("mouseout", ()=>{
    socket.emit('finishDraw');
  });

  // colorPicker.addEventListener('change', colorPicked);

  widthRange.addEventListener('input', selectWidth);

}

socket.on("initDraw", (location)=>{
  ctx.beginPath();
  console.log("initDraw");
  initDraw(location);
});

socket.on("Draw", (e) =>{
  if(drawable){
    console.log("Draw");
    Draw(e);
  }
});

socket.on("finishDraw", ()=>{
  finishDraw();
});

socket.on("setColor", (el) =>{
  ctx.strokeStyle = el.backgroundColor;
  console.log(s)
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
  let position  = getPosition(location);
  posX = position.X;
  posY = position.Y;   
  ctx.moveTo(posX, posY);
  ctx.lineWidth = lineWidth;
} 


function Draw(location){
    let position = getPosition(location);
    ctx.lineTo(position.X, position.Y);
    posX = position.X;
    posY = position.Y;
    console.log(posX, posY);
    ctx.stroke();
}

function getPosition(location){
  var rect = canvas.getBoundingClientRect();
  let x = location.pageX - rect.left
  let y = location.pageY - rect.top
  console.log(x, y);
  return {X : x, Y : y};
}

function finishDraw(e){
  drawable = false;
  posX = -1;
  posY = -1;
}

// function colorPicked(e){
//   ctx.strokeStyle = e.target.value; 
// }

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

