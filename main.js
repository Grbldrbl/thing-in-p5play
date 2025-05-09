let squares = [];
let center;
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
  ellipse(center.x, center.y, 50, 50);

  // Update and draw squares
  for (let square of squares) {
    if (!square.isDragging) {
      square.applyGravity(center);
    }
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
    this.size = 40; // Increased size
    this.isDragging = false; // Dragging state
    this.offsetX = 0; // Offset for dragging
    this.offsetY = 0;
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
