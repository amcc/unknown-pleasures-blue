// colours
let r = 115
let g = 186
let b = 219

let bgColour;
let lineColour;

// microphone
let mic;

let spread;
let inc;
let margin;
let vertOffset;
// extra flat line at either end
let extraLine = 70;
// steps between vertexes
let step = 3;
// spacing between lines
let ySpacing = 2.6
let lineNumber = 50;

// noise settings
let offset = 0;
let offsetInc = 0.09
let rowOffset = 40
let lineMultiplier = 27

// fuzz settings
let fuzzOffset = 1000;
let fuzzInc = offsetInc
let fuzzMultiplier = 3.5

function setup() {
  createCanvas(600, 600);

  // audio input
  mic = new p5.AudioIn();
  mic.start();
  console.log(mic.getLevel())

  margin = width / 3;
  vertOffset = width / 4.6;
  spread = width - margin * 2
  inc = TWO_PI * step / spread;
  
  bgColour = color(115,186,219)
  lineColour = color(255,255,255)
  stroke(lineColour)
  strokeWeight(1.2)
  fill(bgColour)
  // noFill()
  frameRate(24)
}

function draw() {
  background(bgColour)

  // sound

  // make rows
  let level = mic.getLevel();
  for (let y = 0; y <= lineNumber * ySpacing; y += ySpacing) {
    let volume = (level * 200 / abs(y - lineNumber)) + 1;
    fuzzMultiplier = (level * 200) + 1;
    let a = 0.0;
    // begin the line
    beginShape();
    for (let x = -extraLine; x <= spread + extraLine; x += step) {
      // perlin noise
      let n = noise(offset + x / rowOffset + y) * lineMultiplier;
      // flatten the line if not in the 'spread' area
      if (x < 0 || x > spread) a = 0;
      // use a sine wave to multiply the noise
      let vert = ((1 - sin(a + PI / 2)) * n * volume)
      // add some extra fuzz to the line
      let fuzz = noise(fuzzOffset + x / rowOffset + y) * fuzzMultiplier;
      // draw the line
      vertex(x + margin, height - vert - (height - y * ySpacing) + vertOffset + fuzz);
      //increment the angle for the sine wave.
      a = a + inc;
    }
    endShape()
  }
  // increment the noise and fuzz
  offset += offsetInc;
  fuzzOffset += fuzzInc
}