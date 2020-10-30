let leftPressed = false;
let upPressed = false;
let rightPressed = false;
let downPressed = false;
let mPressed = false;
let showMap = false;

export function GetKeyStates(){
    return {
        leftPressed,
        rightPressed,
        upPressed,
        downPressed,
        mPressed,
        showMap,
    };
}

document.addEventListener('keydown', e => {
  if (e.key === "m" || e.key === "M") {
    if (!mPressed) { showMap = !showMap; }
    mPressed = true;
  }

  if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
    leftPressed = true;
    rightPressed = false;
  }
  if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
    rightPressed = true;
    leftPressed = false;
  }
  if (e.key === "w" || e.key === "W" || e.key === "ArrowUp") {
    upPressed = true;
    downPressed = false;
  }
  if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") {
    downPressed = true;
    upPressed = false;
  }
});
document.addEventListener('keyup', e => {
  //console.log(e.key);
  if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
  if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
    rightPressed = false;
  }
  if (e.key === "w" || e.key === "W" || e.key === "ArrowUp") {
    upPressed = false;
  }
  if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") {
    downPressed = false;
  }
  if (e.key === "m" || e.key === "M") {
    mPressed = false;
  }
});
