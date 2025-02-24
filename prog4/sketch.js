let gameStates = Object.freeze({
  START: "start",
  PLAY: "play",
  END: "end"
});

let gameState = gameStates.START;
let score = 0;
let highScore = 0;
let time = 30;
let textPadding = 15;
let bugSpritesheet;
let bugs = [];
let bugCount = 10;

let frameWidth = 64;  // Width of a single bug frame
let frameHeight = 64; // Height of a single bug frame
let normalFrames = [0, 1, 2, 3, 4]; // Indices of normal bug frames
let squishedFrame = 5; // Index of squished bug
let animationSpeed = 0.1; // Speed of animation (frame rate)

function preload() {
  bugSpritesheet = loadImage("media/bugs.png");
}

function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);
  
  for (let i = 0; i < bugCount; i++) {
    bugs.push(new Bug(random(width), random(height), random(1, 3)));
  }
}

function draw() {
  background(220);

  switch (gameState) {
    case gameStates.START:
      textAlign(CENTER, CENTER);
      textSize(18);
      text("Press ENTER to Start!", width / 2, height / 2);
      break;

    case gameStates.PLAY:
      textAlign(LEFT, TOP);
      textSize(16);
      text("Score: " + score, textPadding, textPadding);
      textAlign(RIGHT, TOP);
      text("Time: " + Math.ceil(time), width - textPadding, textPadding);

      time -= deltaTime / 1000;

      for (let i = bugs.length - 1; i >= 0; i--) {
        bugs[i].move();
        bugs[i].animate(); // Update animation
        bugs[i].draw();

        // Remove squished bugs after a delay
        if (bugs[i].squished && millis() - bugs[i].squishTime > 500) {
          bugs.splice(i, 1);
          spawnBug();
        }
      }

      if (time <= 0) {
        gameState = gameStates.END;
      }
      break;

    case gameStates.END:
      textAlign(CENTER, CENTER);
      textSize(18);
      text("GAME OVER!", width / 2, height / 2 - 20);
      text("Score: " + score, width / 2, height / 2);
      if (score > highScore) {
        highScore = score;
      }
      text("High Score: " + highScore, width / 2, height / 2 + 20);
      text("Press ENTER to Restart", width / 2, height / 2 + 40);
      break;
  }
}

function keyPressed() {
  if (gameState === gameStates.START && keyCode === ENTER) {
    gameState = gameStates.PLAY;
    score = 0;
    time = 30;
    bugs = [];
    for (let i = 0; i < bugCount; i++) {
      bugs.push(new Bug(random(width), random(height), random(1, 3)));
    }
  } else if (gameState === gameStates.END && keyCode === ENTER) {
    gameState = gameStates.START;
  }
}

function mousePressed() {
  if (gameState === gameStates.PLAY) {
    for (let bug of bugs) {
      if (bug.isClicked(mouseX, mouseY)) {
        bug.squish();
        score += 1;
      }
    }
  }
}

function spawnBug() {
  let speed = random(1, 3) + score * 0.1; // Increase speed based on score
  bugs.push(new Bug(random(width), random(height), speed));
}

class Bug {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.squished = false;
    this.direction = random(TWO_PI); // Random direction in radians
    this.squishTime = 0;
    this.currentFrame = 0; // Current animation frame
    this.frameCounter = 0; // Counter to control animation speed
  }

  move() {
    if (!this.squished) {
      // Move in the current direction
      this.x += cos(this.direction) * this.speed;
      this.y += sin(this.direction) * this.speed;

      // Bounce off edges with a random new direction
      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.direction = random(TWO_PI); // Random new direction
      }

      // Ensure bugs stay within the canvas
      this.x = constrain(this.x, 0, width);
      this.y = constrain(this.y, 0, height);
    }
  }

  animate() {
    if (!this.squished) {
      // Update animation frame
      this.frameCounter += animationSpeed;
      if (this.frameCounter >= 1) {
        this.currentFrame = (this.currentFrame + 1) % normalFrames.length;
        this.frameCounter = 0;
      }
    }
  }

  draw() {
    let frameIndex;
    if (this.squished) {
      frameIndex = squishedFrame; // Use squished frame
    } else {
      frameIndex = normalFrames[this.currentFrame]; // Use current animation frame
    }

    // Draw the correct frame from the spritesheet
    image(
      bugSpritesheet,
      this.x,
      this.y,
      40, // Display width
      40, // Display height
      frameIndex * frameWidth, // Source x (crop position)
      0, // Source y (crop position)
      frameWidth, // Source width (crop size)
      frameHeight // Source height (crop size)
    );
  }

  isClicked(px, py) {
    return dist(px, py, this.x, this.y) < 20;
  }

  squish() {
    this.squished = true;
    this.squishTime = millis();
  }
}