var o = document.getElementById("nav_button");
var movement = false;

function move() { movement==false?rightMove():leftMove(); movement=!movement;}

function rightMove() {
  o.style.right = 220 + 'px';
  for(var i=90;i>=0;i--)
  {
      o.style.transform = "rotate(" + i + "deg)";
  }
  openNav();
}

function leftMove() {
  o.style.right = 20+"px";
  for(var i=1;i<=90;i++)
  {
      o.style.transform = "rotate(" + i + "deg)";
  }
  closeNav();
}

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function menu_click(){movement==false?leftMove():rightMove();}