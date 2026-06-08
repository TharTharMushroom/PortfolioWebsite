//Global variables
let bg;
let bubbles;
let totalHeight;
let frame;
let creatures;

function setup() {
  //Initialize canvas and variables
  initCanvas();
  bg = new BackgroundFade('#468faf', '#2c7da0', '#2a6f97', '#01497c', '#012a4a', '#0f1117');
  bubbles = [];
  creatures = [];
  //Create bubbles
  for(let i = 0; i<80; i++){
    bubbles.push(new Bubble(randomNum(0, windowWidth), randomNum(0, totalHeight), randomNum(5, 20), randomNum(0.5,1.4)));
  }
  //Create sea creatures
  for(let i = 0; i<10; i++){
    creatures.push(new SmallFish(randomNum(0, windowWidth), randomNum(0, totalHeight), 
    randomNum(20, 45), randomNum(0.3,0.6), randomNum(0.015, 0.04), randomNum(0.5, 1)));
  }
  frame=0;
}

//Initialize canvas
function initCanvas() {
  totalHeight = Math.max(
    document.body.scrollHeight, 
    document.documentElement.scrollHeight,
    document.body.offsetHeight, 
    document.documentElement.offsetHeight
  );

  
  createCanvas(windowWidth, totalHeight);
}

//Preload images
function preload(){
  bubbleImg = loadImage('assets/bubble.png');
  smallFishImg = loadImage('assets/smallFish.png');
}

function draw() {
  background(15, 17, 23);
  frame++;
  
  //Update and draw background
  bg.updateVars();
  bg.drawBackground();

  //Update bubbles
  for(let i = bubbles.length-1; i>=0; i--){
    bubbles[i].updateVars();
    bubbles[i].drawBubble();
    if(bubbles[i].y<-20){
      bubbles.splice(i, 1); 
    }
  }

  //Update sea creatures
  for(let i = creatures.length-1; i>=0; i--){
    creatures[i].updateVars();
    creatures[i].drawCreature();
    if(creatures[i].x<-40 || creatures[i].x>windowWidth+40){
      creatures.splice(i, 1); 
    }
  }

  //Create new bubbles
  if(frame%30==0&&bubbles.length<100){
    bubbles.push(new Bubble(randomNum(0, windowWidth), randomNum(totalHeight/1.3, totalHeight), randomNum(5, 20), randomNum(0.5,1.4)));
  }

  //Create new sea creatures from the left or right
  if(frame%250==0&&creatures.length<15){
    if(randomNum(0,1)>0.5){
      creatures.push(new SmallFish(-20, randomNum(0, totalHeight), 
    randomNum(20, 45), randomNum(0.3,0.6), randomNum(0.015, 0.04), randomNum(0.5, 1)));
    }else{
      creatures.push(new SmallFish(windowWidth+20, randomNum(0, totalHeight), 
    randomNum(20, 45), randomNum(0.3,0.6), randomNum(0.015, 0.04), randomNum(0.5, 1)));
    }
    
  }
}

//Resizes canvas with window
function windowResized() {
  resizeCanvas(windowWidth, 1); 
  let actualContentHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  );
  resizeCanvas(windowWidth, actualContentHeight);
}

function randomNum(lower, upper){
  return Math.random() * (upper-lower) + lower;
}

//Background gradient class
class BackgroundFade {
  //Gets all the colors
  constructor(c1, c2, c3, c4, c5, c6){
    this.colors = [c1, c2, c3, c4, c5, c6];
    this.heights = []; 
    this.updateVars();
  }

  //Gets heights for each gradient
  updateVars(){
    this.heights = [
      document.querySelector('.hero').offsetHeight,
      document.getElementById('about').offsetHeight,
      document.getElementById('skills').offsetHeight,
      document.getElementById('projects').offsetHeight,
      document.getElementById('contact').offsetHeight
    ];
  }

  //Creates gradient for each height
  drawBackground() {
    let currentY = 0;
    for(let i = 0; i < this.heights.length; i++){
      let sectionHeight = this.heights[i];
      if (sectionHeight > 0) {
        let startColor = this.colors[i];
        let endColor = this.colors[i+1]; 
        this.setNativeGradient(0, currentY, windowWidth, sectionHeight, startColor, endColor);
        
        currentY += sectionHeight; 
      }
    }
  }

  // Uses the browser's built-in gradient to draw gradient
  setNativeGradient(x, y, w, h, c1, c2) {
    let gradient = drawingContext.createLinearGradient(x, y, x, y + h);
    
    gradient.addColorStop(0, c1);
    gradient.addColorStop(1, c2);
    
    drawingContext.fillStyle = gradient;
    noStroke();
    rect(x, y, w, h);
  }
}

//Bubble class
class Bubble {
  constructor(x, y, size, speed){
    this.x = x;
    this.y = y;
    this.maxSize = size;
    this.currSize = 0;
    this.speed = speed;
  }

  //Updates position and size
  updateVars(){
    if(this.currSize<this.maxSize){
      this.currSize += this.maxSize/30;
    }else{
      this.y -= this.speed;

    } 
  }

  //Draws bubble using image
  drawBubble(){
    push();
    translate(this.x + this.currSize / 2, this.y + this.currSize / 2);
    imageMode(CENTER);
    tint(255, 128); 
    image(bubbleImg, 0, 0, this.currSize, this.currSize);
    pop();
  }

}

//Sea creature superclass
class SeaCreature{
  constructor(x, y, size, xSpeed, ySpeed, yOffset){
    this.x = x;
    this.y = y;
    this.size = size;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.yOffset = yOffset;
    //Sets direction based on spawning position
    if(x<windowWidth/2){
      this.direction = 1;
    }else{
      this.direction = -1;
    }
    this.counter = randomNum(0, 360);
  }

  //Updates position
  updateVars(){
    this.counter += this.ySpeed;
    this.x += this.xSpeed*this.direction;
    this.y += sin(this.counter)*this.yOffset;
  }

  //Draws placeholder creature with rect
  drawCreature(){
    rectMode(CENTER);
    fill(240);
    rect(this.x, this.y, this.size, this.size);
    rectMode(CORNER);
  }
}

//Small fish subclass
class SmallFish extends SeaCreature{
  constructor(x, y, size, xSpeed, ySpeed, yOffset){
    super(x, y, size, xSpeed, ySpeed, yOffset);
  }

  //Draws small fish using image
  drawCreature(){
    push();
    translate(this.x + this.size / 2, this.y + this.size / 2);
    imageMode(CENTER);
    tint(255, 128); 
    //Changes direction of sprite
    scale(this.direction*-1, 1); 
    image(smallFishImg, 0, 0, this.size, this.size);
    pop();
  }
}