let squares = [];
let center;
let centerRadius = 25; // Radius of the central circle
let gravityStrength = 2;
let draggedSquare = null; // To track the square being dragged

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
  ellipse(center.x, center.y, centerRadius * 2, centerRadius * 2);

  // Update and draw squares
  for (let i = 0; i < squares.length; i++) {
    let square = squares[i];

    if (!square.isDragging) {
      square.applyGravity(center);
      square.checkCollisionWithCircle(center, centerRadius); // Check collision with the circle
    }

    // Check for collisions with other squares
    for (let j = i + 1; j < squares.length; j++) {
      let other = squares[j];
      square.checkCollision(other);
    }

    square.update();
    square.display();
  }
}

// Square class
class Square {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-2, 2), random(-2, 2));
    this.acceleration = createVector(0, 0);
    this.mass = random(1, 3); // Mass affects gravity
    this.size = 40; // Size of the square
    this.isDragging = false; // Dragging state
    this.offsetX = 0; // Offset for dragging
    this.offsetY = 0;
  }

  applyGravity(target) {
    let force = p5.Vector.sub(target, this.position);
    let distance = constrain(force.mag(), 5, 25);
    force.normalize();
    let strength = (gravityStrength * this.mass) / (distance * distance);
    force.mult(strength);
    this.acceleration.add(force);
  }

  update() {
    if (!this.isDragging) {
      this.velocity.add(this.acceleration);
      this.position.add(this.velocity);
      this.acceleration.mult(0); // Reset acceleration
    }
  }

  display() {
    stroke(0); // Outline color
    strokeWeight(2); // Outline thickness
    fill(255, 100, 100);
    rectMode(CENTER);
    rect(this.position.x, this.position.y, this.size, this.size);
  }

  // Check if the mouse is over the square
  isMouseOver() {
    return (
      mouseX > this.position.x - this.size / 2 &&
      mouseX < this.position.x + this.size / 2 &&
      mouseY > this.position.y - this.size / 2 &&
      mouseY < this.position.y + this.size / 2
    );
  }

  // Start dragging
  startDragging() {
    this.isDragging = true;
    this.offsetX = this.position.x - mouseX;
    this.offsetY = this.position.y - mouseY;
  }

  // Stop dragging
  stopDragging() {
    this.isDragging = false;
  }

  // Dragging logic
  drag() {
    if (this.isDragging) {
      this.position.x = mouseX + this.offsetX;
      this.position.y = mouseY + this.offsetY;
    }
  }

  // Check for collision with another square
  checkCollision(other) {
    let dx = abs(this.position.x - other.position.x);
    let dy = abs(this.position.y - other.position.y);
    let combinedHalfSize = this.size / 2 + other.size / 2;

    // Check if the squares overlap
    if (dx < combinedHalfSize && dy < combinedHalfSize) {
      // Resolve collision by swapping velocities
      let temp = this.velocity.copy();
      this.velocity = other.velocity;
      other.velocity = temp;
    }
  }

  // Check for collision with the central circle
  checkCollisionWithCircle(circleCenter, circleRadius) {
    let distance = dist(this.position.x, this.position.y, circleCenter.x, circleCenter.y);
    let combinedRadius = circleRadius + this.size / 2;

    if (distance < combinedRadius) {
      // Resolve collision by reversing the velocity
      let collisionNormal = p5.Vector.sub(this.position, circleCenter).normalize();
      this.velocity = p5.Vector.mult(collisionNormal, this.velocity.mag());
    }
  }
}

// Mouse events
function mousePressed() {
  for (let square of squares) {
    if (square.isMouseOver()) {
      square.startDragging();
      draggedSquare = square;
      break;
    }
  }
}

function mouseReleased() {
  if (draggedSquare) {
    draggedSquare.stopDragging();
    draggedSquare = null;
  }
}

function mouseDragged() {
  if (draggedSquare) {
    draggedSquare.drag();
  }
}
