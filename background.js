function setup() {
    // Wait until everything on the page is fully parsed to get the real height
    window.addEventListener('DOMContentLoaded', () => {
      initCanvas();
    });
    bg = new BackgroundFade(0, 50, 100, 150, 200);
  }
  
  function initCanvas() {
    // Grabs the true, total scrollable height of your webpage
    let totalHeight = Math.max(
      document.body.scrollHeight, 
      document.documentElement.scrollHeight,
      document.body.offsetHeight, 
      document.documentElement.offsetHeight
    );
  
    // Create the canvas and explicitly inject it into the top left
    let canvas = createCanvas(windowWidth, totalHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');
  }
  
  function draw() {
    background(15, 17, 23);
    stroke(255); 
    strokeWeight(5);
    line(0, 0, mouseX, heroHeight);
    line(0, heroHeight, mouseX, heroHeight+aboutHeight);
    bg.updateVars();
    bg.drawBackground();
  }
  
  function windowResized() {
    // 1. Temporarily shrink canvas to 1px so it doesn't artificially bloat the page height
    resizeCanvas(windowWidth, 1); 
    
    // 2. Measure what the actual portfolio content height is without canvas interference
    let actualContentHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    
    // 3. Snap the canvas back to the perfect content height
    resizeCanvas(windowWidth, actualContentHeight);
  }


  class BackgroundFade {
    // The constructor runs automatically when you type 'new User()'
    constructor(color1, color2, color3, color4, color5){
        let heroHeight = document.querySelector('.hero').offsetHeight;
        let aboutHeight = document.getElementById('about').offsetHeight;
        let skillsHeight = document.getElementById('skills').offsetHeight;
        let projectsHeight = document.getElementById('projects').offsetHeight;
        let contactHeight = document.getElementById('contact').offsetHeight;
        let colors = {color1, color2, color3, color4, color5};
        let heights = {heroHeight, aboutHeight, skillsHeight, projectsHeight, contactHeight};
    }
  
    updateVars(){
        heroHeight = document.querySelector('.hero').offsetHeight;
        aboutHeight = document.getElementById('about').offsetHeight;
        skillsHeight = document.getElementById('skills').offsetHeight;
        projectsHeight = document.getElementById('projects').offsetHeight;
        contactHeight = document.getElementById('contact').offsetHeight;
        heights = {heroHeight, aboutHeight, skillsHeight, projectsHeight, contactHeight};
    }

    drawBackground() {
        let totalHeight = 0;
        for(let i = 0; i < heights.length; i++){
            fill(colors[i]);
            rect(0, totalHeight, windowWidth, heights[i]);
        }
    }
  }