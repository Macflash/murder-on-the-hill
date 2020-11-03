let leftPressed = false;
let upPressed = false;
let rightPressed = false;
let downPressed = false;
let mPressed = false;
let showMap = false;
let changed = false;

export function GetKeyStates() {
  const result = {
    leftPressed,
    rightPressed,
    upPressed,
    downPressed,
    mPressed,
    showMap,
    changed,
  };
  changed = false;
  return result;
}

document.addEventListener('keydown', e => {
  changed = false;
  if (e.key === "m" || e.key === "M") {
    if (!mPressed) { showMap = !showMap; }
    changed = true;
    mPressed = true;
  }

  if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
    if (leftPressed === true && rightPressed === false) { return; }
    changed = true;
    leftPressed = true;
    rightPressed = false;
  }
  if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
    if (leftPressed === false && rightPressed === true) { return; }
    changed = true;
    rightPressed = true;
    leftPressed = false;
  }
  if (e.key === "w" || e.key === "W" || e.key === "ArrowUp") {
    if (upPressed === true && downPressed === false) { return; }
    changed = true;
    upPressed = true;
    downPressed = false;
  }
  if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") {
    if (upPressed === false && downPressed === true) { return; }
    changed = true;
    downPressed = true;
    upPressed = false;
  }
});
document.addEventListener('keyup', e => {
  changed = false;
  if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
    changed = true;
    leftPressed = false;
  }
  if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
    changed = true;
    rightPressed = false;
  }
  if (e.key === "w" || e.key === "W" || e.key === "ArrowUp") {
    changed = true;
    upPressed = false;
  }
  if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") {
    changed = true;
    downPressed = false;
  }
  if (e.key === "m" || e.key === "M") {
    changed = true;
    mPressed = false;
  }
});
