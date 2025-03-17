let img;
let synth, noise, filter, reverb, lfo;
let audioReady = false;

function preload() {
  img = loadImage("media/westbrook_dunking.webp");
}

function setup() {
  createCanvas(400, 400);
  
  // Create a button to start audio context
  let startButton = createButton('Click to Start Audio');
  startButton.position(10, 410);
  startButton.mousePressed(() => {
    // Initialize Tone.js properly first
    Tone.start().then(() => {
      console.log('Audio context started');
      // Create synth only after audio context is started
      synth = new Tone.Synth({
        oscillator: {
          type: 'square'
        },
        envelope: {
          attack: 0.1,
          decay: 0.2,
          sustain: 0.5,
          release: 1
        }
      }).toDestination();
      
      noise = new Tone.Noise('white').start();
      filter = new Tone.Filter(800, 'lowpass');
      reverb = new Tone.Reverb({
        decay: 2,
        preDelay: 0.1,
      }).toDestination();
      
      // Create an LFO to modulate the filter frequency
      lfo = new Tone.LFO("4n", 400, 1200);
      lfo.connect(filter.frequency);
      lfo.start();
      
      synth.connect(filter);
      noise.connect(filter);
      filter.connect(reverb);
      
      audioReady = true;
      console.log("Audio components initialized");
    }).catch(err => {
      console.error('Could not start audio context', err);
    });
  });
  
  textAlign(CENTER, CENTER);
}

function draw() {
  background(220);
  
  // Draw some instruction text
  fill(0);
  text("Click to see Westbrook dunking", width/2, 30);
  
  if (mouseIsPressed && img) {
    image(img, 0, 0, width, height);
    
    // Only trigger sound if synth exists and not too frequently
    if (audioReady && frameCount % 15 === 0) {
      synth.triggerAttackRelease("C4", "8n");
    }
  }
}

function mousePressed() {
  // Trigger the synth and noise when the mouse is pressed
  if (audioReady) {
    console.log("Triggering sound");
    synth.triggerAttack('C4');
    noise.volume.value = -10; // Adjust the volume of the noise
  }
}

function mouseReleased() {
  // Release the synth and stop the noise when the mouse is released
  if (audioReady) {
    console.log("Releasing sound");
    synth.triggerRelease();
    noise.volume.value = -Infinity; // Mute the noise
  }
}