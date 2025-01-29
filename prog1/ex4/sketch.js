function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(0, 0, 255); // Blue background

  // Draw green circle with white outline
  fill(0, 255, 0); // Green
  stroke(255); // White outline
  strokeWeight(5); // Thicker outline
  ellipse(width / 2, height / 2, 300, 300); // Circle

  // Draw red star with white outline (flipped)
  fill(255, 0, 0); // Red
  stroke(255); // White outline
  strokeWeight(5); // Thicker outline
  drawStar(width / 2, height / 2, 100, 200); // Star

  noLoop(); // Stop draw() from looping
}

// Function to draw a flipped star
function drawStar(x, y, radius1, radius2) {
  let angle = TWO_PI / 10; // 10 points for a 5-pointed star
  beginShape();
  for (let i = 0; i < 10; i++) {
    let r = i % 2 === 0 ? radius1 : radius2; // Alternate between inner and outer radius
    // Flip the star by adding PI to the angle
    let px = x + cos(i * angle - HALF_PI + PI) * r; // Calculate x position
    let py = y + sin(i * angle - HALF_PI + PI) * r; // Calculate y position
    vertex(px, py); // Add point to the star
  }
  endShape(CLOSE);
}