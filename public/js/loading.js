const socket = io();
let temp = location.href.split("?");
let room_id = temp[1].split("=")[0];

socket.emit("getRoomInfo", room_id);

