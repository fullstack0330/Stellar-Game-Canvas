// DOM Elements needed

const chooseSoundButton = document.getElementById("change-sound-btn").addEventListener("click", openSoundMenu)
const dropdown = document.getElementById("dropdown")
let soundOptions = Array.from(dropdown.children)
soundOptions.forEach(element => {
  element.addEventListener("click",selectSound)
  
});

//set the default sound, the sound that should play
let selectedSound;
selectedSound = document.getElementById("track1")


//Open Sound Option
function openSoundMenu(){
  console.log("clicked")
  dropdown.classList.toggle("dropdown-display-none")
} 

//Change the Selected Sound

function selectSound(e){
selectedSound?.pause()
soundOptions.forEach(element => {
  element.classList.remove("active")
  
});
e.target.classList.add("active")
  
let clickedSound = e.target.classList[0]
let sound;
switch (clickedSound) {
  case "track1":
      sound = 'track1'
      break;
  case "track2":
    sound  = 'track2'
      break;
  case "track3":
    sound = 'music'
      break;
  default:
    sound = 'music'
}
console.log(sound)
selectedSound = document.getElementById(sound)

//Close Sound Menu after change
openSoundMenu()

}







// Hides the crash screen so it can be unhidden later
document.getElementById("crash-panel").classList.toggle("hidden");
// Hides the completed screen so it can be unhidden later
document.getElementById("completed-panel").classList.toggle("hidden");
// Hides bottom banner containing direction buttons
document.getElementById("bottom-banner").classList.toggle("hidden");
// Reloads the page on resize to ensure game works correctrly using screen dimensions
window.addEventListener("resize", reload, false);
// Creates mute button event listener
document.getElementById("mute").addEventListener("click", toggleMute);
// Reloads page when game restarted / reset button pressed
document.getElementById("reset").addEventListener("click", reload);
// Launches animations when Start Game button pressed
document.getElementById("start-btn").addEventListener("click", initialiseGame);

// -- Global Variables --

// References HTML canvas element
const canvas = document.getElementById("canvas");
// Gets the context CanvasRenderingContext2D interface for canvas
const ctx = canvas.getContext("2d", { alpha: false });
// Sets the sizes to inner window sizes
const cnvsWidth = window.innerWidth;
// -4 removes the overflow scrollbar
const cnvsHeight = window.innerHeight - 4;
// Sets dimensions to these variables
ctx.canvas.width = cnvsWidth;
ctx.canvas.height = cnvsHeight;
// Length of canvas
const cnvsLength = canvas.width;
// Center of axis points on canvas
const centreOfX = canvas.width / 2;
const centreOfY = canvas.height / 2;
// Position of player ship on y axis
var shipFromCenter = centreOfY / 2;
// Unit of size for shapes
var size = 1;
// Initial angle of canvas rotation for player ship object
var angle = 0;
// Initial score - The score is -100 to allow for countdown timer, game starts when score increases to 0
var score = -100;
// Arrays to store object instances
var starsArray = [];
var spritesArray = [];
// Used for ship direction functionality
var time = null;
// Used to detect whether game has ended or not
var endGame = false;
// Responsive variables - number of objects generated on screen at one time & speed of generated objects based on screen width
if (cnvsWidth < 360) {
  var numberOfStars = 650;
  var numberOfSprites = 6;
  var speed = 2;
} else if (cnvsWidth < 768) {
  var numberOfStars = 900;
  var numberOfSprites = 8;
  var speed = 4;
} else if (cnvsWidth < 1200) {
  var numberOfStars = 1200;
  var numberOfSprites = 9;
  var speed = 6;
} else {
  var numberOfStars = 1500;
  var numberOfSprites = 10;
  var speed = 10;
}

// -- Class Definitions --

// Background Stars (Inspired by Sharad Choudhary's formula - https://www.youtube.com/watch?v=CSoZPdhNwjY)
class Star {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  // Called on the Star object each frame to create movement
  moveStar() {
    // Each frame minuses the z position based on speed
    this.z = this.z - speed;
    // If object reaches the top of canvas z index (0) this resets z value to the very back of canvas
    if (this.z <= 0) {
      this.z = cnvsWidth;
      // Ensures Stars generate in a different position each time they are rerendered
      this.x = Math.random() * cnvsWidth;
      this.y = Math.random() * cnvsHeight;
    }
  }

  // Creates and renders the Star object to the canvas when called on the object each frame
  showStar() {
    // Algorythm creates movement when called each frame
    let xPos = (this.x - centreOfX) * (cnvsLength / this.z);
    let yPos = (this.y - centreOfY) * (cnvsLength / this.z);
    // Relocates zero to centre of screen and ensures objects move away from this centre including object positions decreasing in value
    xPos = xPos + centreOfX;
    yPos = yPos + centreOfY;
    // Changes size of the Star object in relation to the centre of canvas and Z value, size is smallest when in the centre
    let s = size * (cnvsLength / this.z);
    // Renders circular star shapes, changing colour as points increase
    ctx.beginPath();

if (score <= 250) {
  ctx.fillStyle = "#4CAF50"; // Green
} else if (score <= 500) {
  ctx.fillStyle = "#2196F3"; // Blue
} else if (score <= 750) {
  ctx.fillStyle = "#FFC107"; // Yellow
} else if (score <= 1000) {
  ctx.fillStyle = "#FF5722"; // Orange
} else if (score <= 1250) {
  ctx.fillStyle = "#E91E63"; // Pink
} else if (score <= 1500) {
  ctx.fillStyle = "#9C27B0"; // Purple
} else if (score <= 1750) {
  ctx.fillStyle = "#673AB7"; // Deep Purple
} else if (score <= 2000) {
  ctx.fillStyle = "#03A9F4"; // Light Blue
} else if (score <= 2250) {
  ctx.fillStyle = "#009688"; // Teal
} else if (score <= 2500) {
  ctx.fillStyle = "#FF5722"; // Orange
} else if (score <= 2750) {
  ctx.fillStyle = "#4CAF50"; // Green
} else if (score <= 3000) {
  ctx.fillStyle = "#9E9E9E"; // Grey
} else if (score <= 3250) {
  ctx.fillStyle = "#FF9800"; // Amber
}

    ctx.arc(xPos, yPos, s, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Asteroid Sprites
class Sprite {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    // Sprites can only render in small ring around centre between -10 and -1.75, and 1.75 - 10 avoding 0 centre of screen issue
    this.randomX = notZeroRange(-10, 10);
    this.randomY = notZeroRange(-10, 10);
  }

  // Called on the Sprite object each frame to create movement
  moveSprite() {
    // Each frame minuses the z position based on speed
    this.z = this.z - speed / 2;
    // If object reaches the top of canvas z index (0) this resets z value to the very back of canvas
    if (this.z <= 0) {
      this.z = cnvsWidth;
      // Enables Sprite to travel towards player ship initial start position to prevent bug
      if (Math.random() < 0.02) {
        this.randomX = 0;
        this.randomY = 9;
      } else {
        // Ensures positions stay random each time a new array object is instanciated
        this.randomX = notZeroRange(-10, 10);
        this.randomY = notZeroRange(-10, 10);
      }
    }
  }
// Creates and renders the Sprite object to the canvas when called on the object each frame
// Creates and renders the Sprite object to the canvas when called on the object each frame
  showSprite() {
    if (score >= 0) {
      let xPos = this.x;
      let yPos = this.y;
      // Changes size of the Star object in relation to the centre of canvas and Z value, size is smallest when in the centre
      let s = (size / 2) * (cnvsLength / this.z);
      // Ensures sprites generate randomly within close proximity to the centre of screen but not the direct centre.
      xPos = xPos + s * this.randomX;
      yPos = yPos + s * this.randomY;
      // Renders circular Sprite shapes, changing colour as points increase
      ctx.beginPath();

      if (score <= 2400) {
        ctx.fillStyle = "red";
      } else if (score <= 2425) {
        ctx.fillStyle = "#d1d1d1";
      } else if (score <= 2450) {
        ctx.fillStyle = "red";
      } else if (score <= 2475) {
        ctx.fillStyle = "#d1d1d1";
      } else if (score <= 2500) {
        ctx.fillStyle = "red";
      } else if (score <= 2525) {
        ctx.fillStyle = "#d1d1d1";
      } else if (score <= 6300) {
        ctx.fillStyle = "#e5e4e2";
      } else if (score <= 7500) {
        ctx.fillStyle = "#d1d1d1";
      } else if (score <= 7525) {
        ctx.fillStyle = "red";
      } else if (score <= 7550) {
        ctx.fillStyle = "#d1d1d1";
      } else if (score <= 7575) {
        ctx.fillStyle = "red";
      } else if (score <= 7600) {
        ctx.fillStyle = "#d1d1d1";
      } else if (score <= 7625) {
        ctx.fillStyle = "red";
      } else if (score <= 7650) {
        ctx.fillStyle = "#d1d1d1";
      } else if (score <= 10000) {
        ctx.fillStyle = "red";
      }


      ctx.arc(xPos, yPos, s, 0, Math.PI * 2);

      ctx.fill();

      // Passes the X and Y values into function used for collision detection
      collisionDetection(xPos, yPos);
    }
  }
}

// -- Functions --

// Converts angle degree to radians
function convertToRadians(degree) {
  return degree * (Math.PI / 180);
}

// Generates random number between two values ensuring the value is atleast min argument input
function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

// Returns a number between two values avoiding zero by never being between -1.75 and 1.75
function notZeroRange(min, max) {
  if (getRandom(0, 1) > 0.5) {
    return getRandom(min, -1.75);
  } else {
    return getRandom(1.75, max);
  }
}

// Mute button functionality
function toggleMute() {
  selectedSound.muted = !selectedSound.muted;
  // music.muted = !music.muted;
  explosion.muted = !explosion.muted;
  start.muted = !start.muted;
  completed.muted = !completed.muted;
  document.getElementById("i-muted").classList.toggle("hidden");
  document.getElementById("i-not-muted").classList.toggle("hidden");
}

// Clears canvas then draws Star objects when called each frame within update()
function drawStars() {
  if (!endGame) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, cnvsWidth, cnvsHeight);
  } else {
    // Creates trail and spins canvas on end game screens
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(-1000, -1000, canvas.width + 3000, canvas.height + 3000);
    ctx.translate(centreOfX, centreOfY);
    ctx.rotate(Math.PI * -0.0009);
    ctx.translate(-centreOfX, -centreOfY);
  }

  // Calls methods on Star objects array each frame
  for (var i = 0; i < numberOfStars; i++) {
    starsArray[i].showStar(); // Updates the z value
    starsArray[i].moveStar(); // Paints new object
  }
}

// Calls methods on Star objects array each frame
function drawSprites() {
  for (var i = 0; i < numberOfSprites; i++) {
    spritesArray[i].showSprite(); // Updates the z value
    spritesArray[i].moveSprite(); // Paints new object
  }
}

// Draws player spaceship
function playerShip() {

  const shipImage = document.getElementById("shipImage");

  x1 = 0;
  y1 = 0 + centreOfY / 2;
  x2 = 80;
  y2 = 40 + centreOfY / 2 + 20;
  x3 = -230;
  y3 = 0 + centreOfY / 2 + 20;
  s = 9;

  // Save and transform canvas to centre of screen for ship rotation
  ctx.save();
  ctx.translate(centreOfX, centreOfY);
  ctx.rotate(convertToRadians(angle));

  const shipX = -((x2 - x1) / 2) + x1;
  const shipY = -((y2 - y1) / 2) + y1;
  
  ctx.drawImage(shipImage, shipX, shipY, x2 - x1, y2 - y1);
  // Shapes used to draw ship
  // Under Glow
  ctx.beginPath();

  // Restore canvas to saved state before transformation
  ctx.restore();
}

// Move left functionality
function moveLeft() {
  // Removes the delay in movement after initial keydown
  time = setInterval(function () {
    // Appends angle value to ships angle of position
    angle += 2;
    if (angle > 360) {
      angle = 0;
    }
  }, 10);
}

// Move right functionality
function moveRight() {
  // Fires movement rapidly - Removes the delay in movement after initial keydown and increases speed
  time = setInterval(function () {
    // Appends angle value to ships angle of position
    angle -= 2;
    if (angle < -360) {
      angle = 0;
    }
  }, 10);
}

// Stops movement when user stops touching screen
function unTouch() {
  // Clears setInterval timer
  clearInterval(time);
}

// Key down functionality
function keyDown(e) {
  // Removes key event repeat on key hold
  if (e.repeat) {
    return;
  }
  // Prevents bug caused when multiple keys are pressed
  document.removeEventListener("keydown", keyDown);
  // Key event listeners
  if (e.key === "ArrowLeft" || e.key === "Left") {
    moveLeft();
  } else if (e.key === "ArrowRight" || e.key === "Right") {
    moveRight();
  } else if (e.key === "Enter" && score < -99) {
    initialiseGame();
  } else if (e.key === "Enter" && endGame) {
    reload();
  }
}

// Key up functionality
function keyUp(e) {
  if (
    e.key === "ArrowLeft" ||
    e.key === "Left" ||
    e.key === "ArrowRight" ||
    e.key === "Right" ||
    e.key === "Enter"
  ) {
    // Clears setInterval timer
    clearInterval(time);
    // Adds event listener back in - Prevents bug caused when multiple keys are pressed
    document.addEventListener("keydown", keyDown);
  }
}

// Directional contols event listeners
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
document
  .getElementById("left-direction-btn")
  .addEventListener("touchstart", moveLeft, { passive: true });
document
  .getElementById("left-direction-btn")
  .addEventListener("touchend", unTouch);
document
  .getElementById("right-direction-btn")
  .addEventListener("touchstart", moveRight, { passive: true });
document
  .getElementById("right-direction-btn")
  .addEventListener("touchend", unTouch);

// Reloads page
function reload() {
  window.location.reload(true);
}

// Functions to convert angle into X and Y positions of the Ship object on canvas - Used to create an array for collision detection
// Returns positive angle value
function getActualAngle(angle) {
  if (angle >= 0 && angle < 270) {
    // rotates the 0 point to where player craft renders
    return angle + 90;
  } else if (angle >= 270) {
    return angle - 270;
  } else if (angle >= -90 && angle < 0) {
    return 360 + angle - 270;
  } else {
    return 360 + angle;
  }
}

// Get the cosine values associated with angle
function getAngleNumber(angle) {
  const angleInRadians = (angle * Math.PI) / 180;
  return [Math.cos(angleInRadians), Math.sin(angleInRadians)];
}

// Creates array with all possible X and Y coordinates associated with angle
function getAllPossibleShipLocations() {
  // Creates object to store array
  let shipLocations = {};
  // Takes the angle and returns correct Math.cos() value for X
  function getXShipValue(angle) {
    let actualAngle = getActualAngle(angle);
    if (actualAngle >= 0 && actualAngle <= 360) {
      return getAngleNumber(angle)[0];
    } else {
      return -getAngleNumber(angle)[0];
    }
  }
  // Takes the angle and returns correct Math.sin() value for Y
  function getYShipValue(angle) {
    let actualAngle = getActualAngle(angle);
    if (actualAngle >= 0 && actualAngle <= 360) {
      return getAngleNumber(angle)[1];
    } else {
      return -getAngleNumber(angle)[1];
    }
  }
  // Performs operations to generate correct X position value
  function generateX(angle) {
    let shipValue = getXShipValue(angle) * shipFromCenter;
    return centreOfX + shipValue;
  }
  // Performs operations to generate correct Y position value
  function generateY(angle) {
    let shipValue = getYShipValue(angle) * shipFromCenter;
    return centreOfY + shipValue;
  }
  // Assigns final X and Y values correlating with the angle to array indexes
  for (i = 0; i < 360; i++) {
    let angleKey = i.toString();
    shipLocations[angleKey] = [generateX(i), generateY(i)];
  }
  // Returns an array - Needs index key to be called
  return shipLocations;
}

// Takes angle and calls associated index key from shipLocations array
function getShipLocation(angle) {
  // Returns positive angle value
  function getActualAngle(angle) {
    if (angle >= 0 && angle < 270) {
      // rotates the 0 point to where player craft renders
      return angle + 90;
    } else if (angle >= 270) {
      return angle - 270;
    } else if (angle >= -90 && angle < 0) {
      return 360 + angle - 270;
    } else {
      return 360 + angle + 90;
    }
  }
  // Creates string used for index key
  let actualAngle = getActualAngle(angle).toString();
  // Calls the array with associated index key
  return getAllPossibleShipLocations()[actualAngle];
}

// Collision detection between the X and Y of the sprites with the shipLocations array X and Y values generated in getShipLocations()
function collisionDetection(x, y) {
  if (
    // The range of the detection is 35 each side enabling high incrimentation sprite values to be caught
    x - getShipLocation(angle)[0] <= 35 &&
    x - getShipLocation(angle)[0] >= -35 &&
    y - getShipLocation(angle)[1] <= 35 &&
    y - getShipLocation(angle)[1] >= -35
  ) {
    // Calls crash screen when a collision is detected
    crashScreen();
  }
}

// Draws current score to the screen in bottom left
function drawScore() {
  if (cnvsWidth <= 600) {
    ctx.font = "4vw Orbitron, sans-serif";
  } else {
    ctx.font = "2vw Orbitron, sans-serif";
  }
  ctx.strokeText("SCORE:" + score, 10, cnvsHeight - 10);
  ctx.strokeStyle = "rgba(252, 252, 252, 0.486)";
}

// Increases the value of score per frame
function scoreIncrease() {
  score += 1;
  // When player wins the game
  if (score == 10000) {
    completedScreen();
  }
}

// Creates initial countdown timer when Start Game is pressed
function countdown() {
  if (score < -66) {
    document.getElementById("countdowntimer").innerHTML = "3";
  } else if (score < -33) {
    document.getElementById("countdowntimer").innerHTML = "2";
  } else if (score < 0) {
    document.getElementById("countdowntimer").innerHTML = "1";
  } else {
    document.getElementById("countdowntimer").innerHTML = null;
  }
}

// Increases the speed per frame
function speedIncrease() {
  if (score < 2500 && cnvsWidth < 600) {
    speed += 0.002;
  } else if (score < 2500 && cnvsWidth < 1200) {
    speed += 0.005;
  } else if (score < 2500) {
    speed += 0.007;
  } else if (score < 5000 && cnvsWidth < 600) {
    speed += 0.001;
  } else if (score < 5000 && cnvsWidth < 1200) {
    speed += 0.002;
  } else if (score < 5000) {
    speed += 0.002;
  } else if (score < 7500 && cnvsWidth < 600) {
    speed += 0.0005;
  } else if (score < 7500 && cnvsWidth < 1200) {
    speed += 0.0002;
  } else if (score < 7500) {
    speed += 0.001;
  }
}

// Crash screen functionality
function crashScreen() {
  document.getElementById("bottom-banner").classList.toggle("hidden");
  document.getElementById("crash-panel").classList.toggle("hidden");
  document.getElementById("github").classList.toggle("hidden");
  document.getElementById("restart-btn").addEventListener("click", reload);
  document.getElementById("explosion").play();
  endGame = true;
}

// Completed screen functionality
function completedScreen() {
  document.getElementById("bottom-banner").classList.toggle("hidden");
  document.getElementById("completed-panel").classList.toggle("hidden");
  document.getElementById("github").classList.toggle("hidden");
  document.getElementById("restart-btn").addEventListener("click", reload);
  document.getElementById("completed").play();
  endGame = true;
}

// Called each frame to create main loop animation
function update() {
  // Checks if the game has ended each frame
  if (!endGame) {
    // Callback method used to create main loop
    window.requestAnimationFrame(update);
    drawStars();
    drawSprites();
    playerShip();
    drawScore();
    speedIncrease();
    scoreIncrease();
    countdown();
  } else {
    window.requestAnimationFrame(update);
    drawStars();
    document.getElementById("score-output").innerHTML = score;
  }
}

// -- Code functionality --

// Generates new Star object per array iteration and maintains Star numbers to numberOfStars
for (var i = 0; i < numberOfStars; i++) {
  starsArray[i] = new Star(
    Math.random() * cnvsWidth,
    Math.random() * cnvsHeight,
    Math.random() * cnvsWidth
  );
}

// Calls function once to initially allow one frame of stars to be rendered before game starts so that they are visible behind the start panel
drawStars();

// Called when Start Game button is pressed - Starts game rendering Sprite objects and triggering main loop
function initialiseGame() {
  // Hides start panel and GitHub icon, shows direction buttons, plays audio
  document.getElementById("start-panel").classList.toggle("hidden");
  document.getElementById("bottom-banner").classList.toggle("hidden");
  document.getElementById("github").classList.toggle("hidden");
  document.getElementById("start").play();
  selectedSound.play();

  // Generates new Sprite object per array iteration and maintains Sprite numbers to numberOfSprites
  for (var i = 0; i < numberOfSprites; i++) {
    spritesArray[i] = new Sprite(
      centreOfX,
      centreOfY,
      Math.random() * cnvsWidth
    );
  }

  // Triggers main loop animations
  update();
}
