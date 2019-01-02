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

window.onload = () =>{
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  colorPicker = document.getElementById("colorPicker"); 
  widthRange = document.getElementById("lineWidth");

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

  colorPicker.addEventListener('change', colorPicked);

  widthRange.addEventListener('change', selectWidth);

}

socket.on("initDraw", (location)=>{
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
});

socket.on("setEraser", () =>{
  ctx.strokeStyle = "#fff";
});

socket.on("selectWidth", (e) =>{
  lineWidth = e;
  ctx.lineWidth = lineWidth;
})



function initDraw(location){
  ctx.beginPath();
  drawable = true;
  let position  = getPosition(location);
  posX = position.X;
  posY = position.Y;   
  ctx.moveTo(posX, posY);
  ctx.lineWidth = lineW;
} 


function Draw(location){
    let position = getPosition(location);
    ctx.lineTo(position.X, position.Y);
    posX = position.X;
    posY = position.Y;
    ctx.stroke();
}

function getPosition(location){
  let x = location.pageX - canvas.offsetLeft;
  let y = location.pageY - canvas.offsetTop;
  return {X : x, Y : y};
}

function finishDraw(e){
  drawable = false;
  posX = -1;
  posY = -1;
}

function colorPicked(e){
  ctx.strokeStyle = e.target.value; 
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

