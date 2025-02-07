let x = 200, y = 200;
let dragging = false;
let selectedColor = 'white';

function setup() {
  createCanvas(10000, 10000);
  strokeWeight(10);
}

function draw() {
  drawColorBoxes();
}

function drawColorBoxes() {
  noStroke();
  const colors = [
    'red', 'orange', 'yellow', 'green', 'cyan',
    'blue', 'magenta', 'saddlebrown', 'white', 'black'
  ];
  const boxSize = 30;
  const startX = 8;
  let startY = 10;

  for (let i = 0; i < colors.length; i++) {
    fill(colors[i]);
    square(startX, startY, boxSize);
    startY += boxSize + 2;// Add spacing between boxes
  }
}

function mousePressed() {
  const boxSize = 30;
  const startX = 8;
  let startY = 10;

  const colors = [
    'red', 'orange', 'yellow', 'green', 'cyan',
    'blue', 'magenta', 'saddlebrown', 'white', 'black'
  ];

  // Check which color box was clicked
  for (let i = 0; i < colors.length; i++) {
    if (
      mouseX >= startX &&
      mouseX <= startX + boxSize &&
      mouseY >= startY &&
      mouseY <= startY + boxSize
    ) {
      selectedColor = colors[i];// Update the selected color
      console.log(" " + selectedColor);
      break;
    }
    startY += boxSize + 2; // Move to the next box
  }
}

function mouseDragged(){
  stroke(selectedColor);
  line(pmouseX, pmouseY, mouseX, mouseY);
}
