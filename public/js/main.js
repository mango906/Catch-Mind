const socket = io();
let userlist;
let createRoomBtn;
let my_id;

userlist = document.getElementById("users");
createRoomBtn = document.getElementById("createRoomBtn");

let nickname = prompt('이름을 입력해주세요.');
socket.emit("join", nickname);

createRoomBtn.onclick = () =>{
  let roomName = prompt('방 이름을 입력해주세요.');
  socket.emit('createRoom', roomName);
};


socket.on("getId", (client) =>{
  my_id = client.id;
  console.log(my_id);
});

socket.on('users', (users)=>{
  
  while (userlist.hasChildNodes()) {             // user remove
    userlist.removeChild(userlist.lastChild);
  };

  users.forEach(user => {
    let li = document.createElement("li");
    li.style.listStyleType = 'none';
    li.style.color= 'white';
    li.style.fontSize = '1.15rem';
    li.innerHTML = user.name;
    userlist.appendChild(li);
  });
});
