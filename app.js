let clickSound;

let numBalls = 13;
let spring = 0.05;
let gravity = 0.03;
let friction = -0.9;
let balls = [];

let selectedBall = null; //drag and drop variable

let bg;  //<<--this is the background court img variable
let basketball;  //<--basketball img for balls
let players = []; //<-- an array variable for random player imgs to appear

function preload(){
    basketball = loadImage('img/basketball.png'); //<-- img for the basketballs
    //gpt help below
    players = [
        loadImage('img/player0.png'),
        loadImage('img/player1.png'),
        loadImage('img/player2.png'),
        loadImage('img/player3.png'),
        loadImage('img/player4.png'),
        loadImage('img/player5.png'),
        loadImage('img/player6.png'),
        loadImage('img/player7.png'),
        loadImage('img/player8.png'),
        // Add more player images here...
    ];
    
    // Load the basketball sound effect
    clickSound = loadSound('path/to/levelup.mp3');
    // Rest of your code...
  
}

function setup() {
  let cnv =createCanvas(800, 413);
  bg = loadImage('img/wolves.jpg'); //image of the court //
 

  for (let i = 0; i < numBalls; i++) {
    let player = random(players); // Randomly select a player image 
    balls[i] = new Ball(
      random(width),
      random(height),
      random(50, 75),
      i,
      balls,
      player  
    );
  }
  noStroke();
  fill(255, 204);

}


function draw() {
  background(bg); 
  balls.forEach(ball => {
    ball.collide();
    ball.move();
    ball.display();
  });

    // Draw the left hoop area
fill(255,255,0); // Set color to yellow
rect(75, height - 247, 101, 80); // Adjust the values as needed

// Draw the right hoop area
fill(255, 255, 0); // Set color to yellow
rect(width - 175, height - 247, 101, 80); // Adjust the values as needed


}

function mousePressed() {
    balls.forEach(ball => {
      if(ball.checkClicked()) {
        selectedBall = ball;
      };
    });
  }

  function mouseDragged() {
    if (selectedBall !== null) {
      selectedBall.x = mouseX;
      selectedBall.y = mouseY;
    }
  }

function mouseReleased() {
  if (selectedBall !== null) {
    // Check if the ball is dropped inside the left hoop area
    if (
      selectedBall.x > 75 &&
      selectedBall.x < 247 &&
      selectedBall.y > height - 247 &&
      selectedBall.y < height - 80
    ) {
      // Ball is dropped inside the left hoop area
      // Perform desired actions
      // ...
    }

    // Check if the ball is dropped inside the right hoop area
    if (
      selectedBall.x > width - 175 &&
      selectedBall.x < width - 75 &&
      selectedBall.y > height - 247 &&
      selectedBall.y < height - 80
    ) {
      // Ball is dropped inside the right hoop area
      // Perform desired actions
      // ...
    }

    selectedBall = null;
  }
}

  
  
  

class Ball {
  constructor(xin, yin, din, idin, oin, img) {
    this.x = xin;
    this.y = yin;
    this.vx = 0;
    this.vy = 0;
    this.diameter = din;
    this.id = idin;
    this.others = oin;
    this.clicked = false; // tracks if the ball is clicked --gpt
    this.player = img;   
    
  }

  collide() {
    for (let i = this.id + 1; i < numBalls; i++) {
      // console.log(others[i]);
      let dx = this.others[i].x - this.x;
      let dy = this.others[i].y - this.y;
      let distance = sqrt(dx * dx + dy * dy);
      let minDist = this.others[i].diameter / 2 + this.diameter / 2;
      //console.log(distance);
      //console.log(minDist);
      if (distance < minDist) {
        //console.log("2");
        let angle = atan2(dy, dx);
        let targetX = this.x + cos(angle) * minDist;
        let targetY = this.y + sin(angle) * minDist;
        let ax = (targetX - this.others[i].x) * spring;
        let ay = (targetY - this.others[i].y) * spring;
        this.vx -= ax;
        this.vy -= ay;
        this.others[i].vx += ax;
        this.others[i].vy += ay;
      }
    }
  }
 

  move() {
    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;
    if (this.x + this.diameter / 2 > width) {
      this.x = width - this.diameter / 2;
      this.vx *= friction;
    } else if (this.x - this.diameter / 2 < 0) {
      this.x = this.diameter / 2;
      this.vx *= friction;
    }
    if (this.y + this.diameter / 2 > height) {
      this.y = height - this.diameter / 2;
      this.vy *= friction;
    } else if (this.y - this.diameter / 2 < 0) {
      this.y = this.diameter / 2;
      this.vy *= friction;
    }
  }

  display() {
    if (this.clicked) {
      image(this.player, this.x, this.y, this.diameter, this.diameter);
    } else {
      if (
        (this.x > 75 && this.x < 175 && this.y > height - 247 && this.y < height - 80) ||
        (this.x > width - 175 && this.x < width - 75 && this.y > height - 247 && this.y < height - 80)
      ) {
        // Ball is inside a hoop area, display visual feedback
        fill(0, 255, 0); // Set color to green
        ellipse(this.x, this.y, this.diameter, this.diameter);
      } else {
        // Ball is outside a hoop area
        image(basketball, this.x, this.y, this.diameter, this.diameter);
      }
    }
  }
  

  checkClicked(){
    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d < this.diameter / 1){
        this.clicked = !this.clicked; //toggle the clicked state **gpt
        clickSound.play(); // Play the sound effect
        return true;
    }
    return false;
  }


}
