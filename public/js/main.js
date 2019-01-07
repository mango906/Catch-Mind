const socket = io();
let userlist;
let createRoomBtn;
let my_id;
let rooms;

userlist = document.getElementById("users");
createRoomBtn = document.getElementById("createRoomBtn");
rooms = document.getElementById("rooms");

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

socket.on("roomlist", (room_list) =>{

  for(let key in room_list){
    let tr = document.createElement("tr");
    let room_num = document.createElement("td");
    let room_name = document.createElement("td");
    let room_master = document.createElement("td");
    let room_member = document.createElement("td");
    room_num.innerHTML = "1";
    room_name.innerHTML = key;
    room_master.innerHTML = "나다";
    room_member.innerHTML = `${room_list[key].length} / 4`;
    tr.append(room_num);
    tr.append(room_name);
    tr.append(room_master);
    tr.append(room_member);
    rooms.append(tr);
  }
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
