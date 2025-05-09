let squares = [];
let center;
let gravityStrength = 2;

function setup() {
  createCanvas(800, 800);
  center = createVector(width / 2, height / 2);

  // Create random squares
  for (let i = 0; i < 10; i++) {
    let x = random(width);
    let y = random(height);
    let square = new Square(x, y);
    squares.push(square);
  }
}

function draw() {
  background(220);

  // Draw the central circle
  fill(100, 100, 255);
  noStroke();
  ellipse(center.x, center.y, 50, 50);

  // Update and draw squares
  for (let square of squares) {
    square.applyGravity(center);
    square.update();
    square.display();
  }
}

// Square class
class Square {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.mass = random(1, 3); // Mass affects gravity
    this.size = 20;
  }

  applyGravity(target) {
    let force = p5.Vector.sub(target, this.position); // Direction vector
    let distance = constrain(force.mag(), 5, 25); // Distance between square and circle
    force.normalize();
    let strength = (gravityStrength * this.mass) / (distance * distance); // Gravitational force
    force.mult(strength);
    this.acceleration.add(force);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0); // Reset acceleration
  }

  display() {
    fill(255, 100, 100);
    rectMode(CENTER);
    rect(this.position.x, this.position.y, this.size, this.size);
  }
}

function mousePressed() {
  // Add a new square where the mouse is clicked
  let square = new Square(mouseX, mouseY);
  squares.push(square);
}
