var navButton = document.getElementById("nav_button");

//var arrowButton = document.getElementById("arrowNav");

var movement = false;
var initial_width = navButton.style.width;
function move() {
  movement == false ? rightMove() : leftMove();
  movement = !movement;
}

document.addEventListener("mousemove", (event) => {
  if (event.clientX < window.innerWidth - 160) {
    leftMove();
  }
});

function rightMove() {
  navButton.style.right = 150 + "px";
  //arrowButton.style.right = navButton.style.right;
  for (var i = 180; i >= 0; i--) {
    navButton.style.transform = "rotate(" + i + "deg)";
  }
  navButton.style.width = 0;
  navButton.style.height = 0;
  openNav();
}

function leftMove() {
  navButton.style.right = 20 + "px";
  //arrowButton.style.right = navButton.style.right;
  for (var i = 0; i <= 90; i++) {
    navButton.style.transform = "rotate(" + i + "deg)";
  }

  navButton.style.width = initial_width;
  navButton.style.height = initial_width;
  closeNav();
}

function openNav() {
  document.getElementById("mySidenav").style.width = "140px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

function menu_click() {
  movement == false ? leftMove() : rightMove();
}
