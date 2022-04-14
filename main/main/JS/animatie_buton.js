var o = document.getElementById("nav_button");
var movement = false;

function move() { movement==false?rightMove():leftMove(); movement=!movement;}

function rightMove() {
  o.style.right = 150 + 'px';
  for(var i=90;i>=0;i--)
  {
      o.style.transform = "rotate(" + i + "deg)";
      o.style.width = i;
  }
  openNav();
}

function leftMove() {
  o.style.right = 20+"px";
  for(var i=0;i<=90;i++)
  {
      o.style.transform = "rotate(" + i + "deg)";
      o.style.width = i;
  }
  closeNav();
}

function openNav() {
    document.getElementById("mySidenav").style.width = "140px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function menu_click(){movement==false?leftMove():rightMove();}