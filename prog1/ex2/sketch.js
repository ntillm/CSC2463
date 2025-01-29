function setup() {
  createCanvas(600, 600);
  noStroke();
}
function draw() {
  background(255); 
  
  
  fill(255, 0, 0, 150); 
  ellipse(width / 2, height / 2 - 50, 200, 200);
  
 
  fill(0, 0, 255, 150); 
  ellipse(width / 2 - 75, height / 2 + 100, 200, 200);
  
  fill(0, 255, 0, 150);
  ellipse(width / 2 + 75, height / 2 + 100, 200, 200);
}