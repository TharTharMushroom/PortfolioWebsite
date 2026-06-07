// 1. Declare global variables
let bg;
let bubbles;
let totalHeight;
let frame;

function setup() {
  // p5.js already waits for the DOM, so you don't need the event listener
  initCanvas();
  bg = new BackgroundFade('#468faf', '#2c7da0', '#2a6f97', '#01497c', '#012a4a', '#0f1117');
  bubbles = [];
  for(let i = 0; i<80; i++){
    bubbles.push(new Bubble(randomNum(0, windowWidth), randomNum(0, totalHeight), randomNum(5, 20), randomNum(0.5,2)));
  }
  frame=0;
}

// Inside background.js
function initCanvas() {
  totalHeight = Math.max(
    document.body.scrollHeight, 
    document.documentElement.scrollHeight,
    document.body.offsetHeight, 
    document.documentElement.offsetHeight
  );

  // Just create the canvas. Your style.css will handle the rest!
  createCanvas(windowWidth, totalHeight);
}

function draw() {
  background(15, 17, 23);
  frame++;
  
  // Update and draw the background first
  bg.updateVars();
  bg.drawBackground();

  for(let i = bubbles.length-1; i>=0; i--){
    bubbles[i].updateVars();
    bubbles[i].drawBubble();
    if(bubbles[i].y<-20){
      console.log(bubbles.length)
      bubbles.splice(i, 1); 
      console.log(bubbles.length)
    }
  }
  if(frame%30==0&&bubbles.length<100){
    bubbles.push(new Bubble(randomNum(0, windowWidth), randomNum(totalHeight/1.3, totalHeight), randomNum(5, 20), randomNum(0.5,2)));
  }
}

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

class BackgroundFade {
  constructor(c1, c2, c3, c4, c5, c6){
    // 3. Store colors in an Array using 'this'
    this.colors = [c1, c2, c3, c4, c5, c6];
    // Initialize an empty array for heights
    this.heights = []; 
    // Run the update immediately to grab initial values
    this.updateVars();
  }

  updateVars(){
    // 4. Update the heights Array directly
    this.heights = [
      document.querySelector('.hero').offsetHeight,
      document.getElementById('about').offsetHeight,
      document.getElementById('skills').offsetHeight,
      document.getElementById('projects').offsetHeight,
      document.getElementById('contact').offsetHeight
    ];
  }

  drawBackground() {
    let currentY = 0;
    
    for(let i = 0; i < this.heights.length; i++){
      let sectionHeight = this.heights[i];
      
      if (sectionHeight > 0) {
        // Grab the color for the current section and the next section
        let startColor = this.colors[i];
        // Loops back to the first color at the very bottom, or change to this.colors[i] if you want it solid at the end
        let endColor = this.colors[i+1]; 

        // Call the high-performance gradient system directly per section!
        this.setNativeGradient(0, currentY, windowWidth, sectionHeight, startColor, endColor);
        
        currentY += sectionHeight; 
      }
    }
  }

  // Uses the browser's hardware-accelerated canvas engine for a perfect blend
  setNativeGradient(x, y, w, h, c1, c2) {
    let gradient = drawingContext.createLinearGradient(x, y, x, y + h);
    
    gradient.addColorStop(0, c1);
    gradient.addColorStop(1, c2);
    
    drawingContext.fillStyle = gradient;
    noStroke();
    rect(x, y, w, h);
  }
}

class Bubble {
  constructor(x, y, size, speed){
    this.x = x;
    this.y = y;
    this.maxSize = size;
    this.currSize = 0;
    this.speed = speed;
  }

  updateVars(){
    if(this.currSize<this.maxSize){
      this.currSize += this.maxSize/30;
    }else{
      this.y -= this.speed;

    } 
  }

  drawBubble(){
    rectMode(CENTER);
    fill(240);
    rect(this.x, this.y, this.currSize, this.currSize);
    rectMode(CORNER);
  }

}
