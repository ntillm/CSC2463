let yang;
let esk;
let vik;
let round;
let characters = [];

function preload() {
  yang = loadImage("media/sprite_sheet.png");
  esk = loadImage("media/esk.png");
  vik = loadImage("media/vik.png");
  round = loadImage("media/round_boy.png");
}

function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);

  // Create multiple characters
  characters.push(new Character(random(80, width - 80), random(80, height - 80), yang));
  characters.push(new Character(random(80, width - 80), random(80, height - 80), esk));
  characters.push(new Character(random(80, width - 80), random(80, height - 80), vik));
  characters.push(new Character(random(80, width - 80), random(80, height - 80), round));

  // Initialize animations for each character
  for (let character of characters) {
    character.addAnimation("down", new SpriteAnimation(character.spritesheet, 6, 5, 6));
    character.addAnimation("up", new SpriteAnimation(character.spritesheet, 0, 5, 6));
    character.addAnimation("stand", new SpriteAnimation(character.spritesheet, 0, 0, 1));
    character.addAnimation("right", new SpriteAnimation(character.spritesheet, 1, 0, 6));
    character.addAnimation("left", new SpriteAnimation(character.spritesheet, 1, 0, 6));
    character.currentAnimation = "stand";
  }
}

function draw() {
  background(220);

  // Draw each character
  for (let character of characters) {
    character.draw();
  }
}

function keyPressed() {
  for (let character of characters) {
    character.keyPressed();
  }
}

function keyReleased() {
  for (let character of characters) {
    character.keyReleased();
  }
}

class Character {
  constructor(x, y, spritesheet) {
    this.x = x;
    this.y = y;
    this.spritesheet = spritesheet;
    this.currentAnimation = null;
    this.animations = {};
  }

  addAnimation(key, animation) {
    this.animations[key] = animation;
  }

  draw() {
    let animation = this.animations[this.currentAnimation];
    if (animation) {
      switch (this.currentAnimation) {
        case "up":
          this.y -= 2;
          break;
        case "down":
          this.y += 2;
          break;
        case "right":
          this.x += 2;
          break;
        case "left":
          this.x -= 2;
          break;
      }
      push();
      translate(this.x, this.y);
      animation.draw();
      pop();
    }
  }

  keyPressed() {
    switch (keyCode) {
      case UP_ARROW:
        this.currentAnimation = "up";
        break;
      case DOWN_ARROW:
        this.currentAnimation = "down";
        break;
      case RIGHT_ARROW:
        this.currentAnimation = "right";
        this.animations["left"].flipped = false;
        break;
      case LEFT_ARROW:
        this.currentAnimation = "left";
        this.animations["left"].flipped = true;
        break;
    }
  }

  keyReleased() {
    this.currentAnimation = "stand";
  }
}

class SpriteAnimation {
  constructor(spritesheet, startU, startV, duration) {
    this.spritesheet = spritesheet;
    this.u = startU;
    this.v = startV;
    this.duration = duration;
    this.startU = startU;
    this.frameCount = 0;
    this.flipped = false;
  }

  draw() {
    let s = this.flipped ? -1 : 1;
    scale(s, 1);
    image(this.spritesheet, 0, 0, 80, 80, this.u * 80, this.v * 80, 80, 80);

    this.frameCount++;
    if (this.frameCount % 10 === 0) {
      this.u++;
    }
    if (this.u === this.startU + this.duration) {
      this.u = this.startU;
    }
  }
}