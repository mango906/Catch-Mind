const socket = io()
let userlist
let createRoomBtn
let my_id
let rooms
let roomList
let chatlist
let chatBtn

userlist = document.getElementById("users")
createRoomBtn = document.getElementById("createRoomBtn")
rooms = document.getElementById("rooms")
chatlist = document.getElementById("chat-list")
chatBtn = document.getElementsByName("chatBtn")

let nickname = prompt("이름을 입력해주세요.")
socket.emit("join", nickname)

createRoomBtn.onclick = () => {
  let roomName = prompt("방 이름을 입력해주세요.")
  socket.emit("createRoom", roomName, my_id)
}

socket.on("createRoomSuccess", room_id => {
  console.log(123123)
  location.href = `./../loading.html?room_id=${room_id}`
})

chatBtn[0].addEventListener("click", () => {
  let chatContent = document.getElementsByName("chatContent")[0]
  if (chatContent.value !== "") {
    let chatObject = {
      content: chatContent.value,
      id: my_id
    }
    socket.emit("main_chat", chatObject)
    chatContent.value = ""
  }
})

socket.on("main_chat", chatData => {
  let li = document.createElement("li")
  li.style.padding = "12px"
  li.style.fontSize = "1.25rem"
  li.innerHTML = `${chatData.name} : ${chatData.content}`
  chatlist.appendChild(li)
  chatlist.scrollTo(0, chatlist.scrollHeight)
})

rooms.addEventListener("click", e => {
  console.log(roomList)
  let array = Array.prototype.slice.call(rooms.children)
  let idx = array.indexOf(e.target.parentElement)
  let room_id = Object.keys(roomList)[idx]
  socket.emit("joinRoom", room_id)
})

socket.on("getId", client => {
  my_id = client.id
  console.log(my_id)
})

socket.on("roomlist", room_list => {
  console.log(room_list)

  roomList = room_list

  while (rooms.hasChildNodes()) {
    // user remove
    rooms.removeChild(rooms.lastChild)
  }

  room_list.forEach(room => {
    let tr = document.createElement("tr")
    let room_num = document.createElement("td")
    let room_name = document.createElement("td")
    let room_master = document.createElement("td")
    let room_member = document.createElement("td")
    room_num.innerHTML = room.room_id
    room_name.innerHTML = room.room_name
    room_master.innerHTML = room.room_master
    room_member.innerHTML = `${room.detail.length} / 4`
    tr.append(room_num)
    tr.append(room_name)
    tr.append(room_master)
    tr.append(room_member)
    rooms.append(tr)
  })

  // for(let key in room_list){
  //   let tr = document.createElement("tr");
  //   let room_num = document.createElement("td");
  //   let room_name = document.createElement("td");
  //   let room_master = document.createElement("td");
  //   let room_member = document.createElement("td");
  //   room_num.innerHTML = key;
  //   room_name.innerHTML = room_list[key].room_name;
  //   room_master.innerHTML = room_list[key].room_master;
  //   room_member.innerHTML = `${room_list[key].length} / 4`;
  //   tr.append(room_num);
  //   tr.append(room_name);
  //   tr.append(room_master);
  //   tr.append(room_member);
  //   rooms.append(tr);
  // }
})

socket.on("users", users => {
  console.log(userlist)

  while (userlist.hasChildNodes()) {
    // user remove
    userlist.removeChild(userlist.lastChild)
  }

  users.forEach(user => {
    let li = document.createElement("li")
    li.style.color = "white"
    li.style.fontSize = "1.15rem"
    li.innerHTML = user.name
    userlist.appendChild(li)
  })
})
