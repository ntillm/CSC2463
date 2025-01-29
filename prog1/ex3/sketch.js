function setup() {
  createCanvas(600, 300);
  noStroke(); // Remove outlines for smoother shapes
}

function draw() {
  background(0); // Black background

  // Draw Pac-Man
  fill(255, 255, 0); // Yellow
  arc(200, 150, 150, 150, QUARTER_PI, TWO_PI - QUARTER_PI, PIE); // Pac-Man shape

  // Draw Red Ghost
  fill(255, 0, 0); // Red
  rect(350, 100, 150, 100, 20); // Ghost body (rounded rectangle)
  ellipse(425, 100, 150, 150); // Ghost head

  // Ghost eyes
  fill(255); // White
  ellipse(400, 100, 40, 40); // Left eye
  ellipse(450, 100, 40, 40); // Right eye

  // Ghost pupils
  fill(0, 0, 255); // Blue
  ellipse(400, 100, 20, 20); // Left pupil
  ellipse(450, 100, 20, 20); // Right pupil
}