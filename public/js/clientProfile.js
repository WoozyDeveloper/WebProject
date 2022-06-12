let title = document.getElementById('welcome_message');
let sharedInfo = localStorage.getItem("sharedusername");

console.log("am iesit");
console.log(sharedInfo);
title.innerHTML = title.innerHTML + sharedInfo;