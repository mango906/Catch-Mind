let canvas;
let ctx;
let colorPicker;
let widthRange;
let lineWidthNum;
let posX = -1;
let posY = -1;
let drawable = false;
let lineWidth = 1;


window.onload = () =>{
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  colorPicker = document.getElementById("colorPicker"); 
  widthRange = document.getElementById("selectWidth");
  lineWidthNum = document.getElementById("lineWidthNum");
  widthRange.addEventListener('input', selectWidth);

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

}