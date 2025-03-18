let x = 200, y = 200;
let dragging = false;
let selectedColor = 'white';
let noise, noiseFilter, noiseEnv, synth;
let isPlaying = false;
let lastDrawTime = 0;
let audioInitialized = false;
let colorClickSynth;
let backgroundSeq, backgroundSynth;
let clearSound;
let eraserSound;
let saveSound;
let drawingDensity = 0;
let lastClearTime = 0;
const drawingSoundTimeout = 100;
const maxDensity = 1000; // Maximum number of lines to consider for density
const maxVolume = -15; // Maximum volume in dB
const minVolume = -25; // Minimum volume in dB

// Array to store recent drawing positions for density calculation
let recentDrawings = [];

function setup() {
  createCanvas(10000, 10000);
  strokeWeight(10);
  // Don't start Tone.js here - wait for user interaction
}

function draw() {
  drawColorBoxes();
  drawSaveButton();
}

function drawColorBoxes() {
  noStroke();
  const colors = [
    'red', 'orange', 'yellow', 'green', 'cyan',
    'blue', 'magenta', 'saddlebrown', 'white', 'black',
    'eraser' // Removed save from colors
  ];
  const boxSize = 30;
  const startX = 8;
  let startY = 10;
  for (let i = 0; i < colors.length; i++) {
    if (colors[i] === 'eraser') {
      // Draw eraser icon
      fill('white');
      square(startX, startY, boxSize);
      stroke('black');
      strokeWeight(2);
      line(startX + 5, startY + 5, startX + boxSize - 5, startY + boxSize - 5);
      noStroke();
    } else {
      fill(colors[i]);
      square(startX, startY, boxSize);
    }
    startY += boxSize + 2;
  }
}

function drawSaveButton() {
  const boxSize = 30;
  const startX = 8;
  const startY = 10 + (boxSize + 2) * 11; // Position below color palette
  
  // Draw save button background
  fill('white');
  stroke('black');
  strokeWeight(2);
  rect(startX, startY, boxSize * 2, boxSize);
  
  // Draw floppy disk icon
  fill('black');
  rect(startX + 5, startY + 5, boxSize * 2 - 10, boxSize - 10);
  fill('white');
  rect(startX + 8, startY + 8, 6, 6);
  rect(startX + 16, startY + 8, 6, 6);
  rect(startX + 8, startY + 16, 14, 6);
  
  // Draw "SAVE" text
  fill('black');
  noStroke();
  textSize(12);
  textAlign(CENTER, CENTER);
  text('SAVE', startX + boxSize, startY + boxSize/2);
}

function mousePressed() {
  // Initialize audio on first user interaction
  if (!audioInitialized) {
    initializeAudio();
    audioInitialized = true;
  }
  
  const boxSize = 30;
  const startX = 8;
  const colors = [
    'red', 'orange', 'yellow', 'green', 'cyan',
    'blue', 'magenta', 'saddlebrown', 'white', 'black',
    'eraser'
  ];
  
  // Check if save button was clicked
  const saveButtonY = 10 + (boxSize + 2) * 11;
  if (
    mouseX >= startX &&
    mouseX <= startX + boxSize * 2 &&
    mouseY >= saveButtonY &&
    mouseY <= saveButtonY + boxSize
  ) {
    saveDrawing();
    return;
  }
  
  // Check which color box was clicked
  let startY = 10;
  for (let i = 0; i < colors.length; i++) {
    if (
      mouseX >= startX &&
      mouseX <= startX + boxSize &&
      mouseY >= startY &&
      mouseY <= startY + boxSize
    ) {
      const oldColor = selectedColor;
      selectedColor = colors[i];
      if (audioInitialized && oldColor !== selectedColor) {
        playColorSelectSound(i);
      }
      break;
    }
    startY += boxSize + 2;
  }
}

function playColorSelectSound(colorIndex) {
  if (!colorClickSynth) return;
  
  // Special sound for eraser
  if (colorIndex === 10) { // eraser is at index 10
    const notes = ['C4', 'E4', 'G4'];
    notes.forEach((note, i) => {
      eraserSound.triggerAttackRelease(note, '8n', Tone.now() + i * 0.05);
    });
    return;
  }
  
  // Regular color selection sound
  const notes = ['C5', 'D5', 'E5', 'G5', 'A5', 'C6', 'D6', 'E6', 'G6', 'A6'];
  const note = notes[colorIndex % notes.length];
  const chord = [note, Tone.Frequency(note).transpose(4)];
  colorClickSynth.triggerAttackRelease(chord, '8n');
}

function initializeAudio() {
  Tone.start().then(() => {
    // Drawing synth with shorter envelope
    synth = new Tone.Synth({
      oscillator: {
        type: 'triangle',
      },
      envelope: {
        attack: 0.01,
        decay: 0.05,
        sustain: 0.1,
        release: 0.05
      }
    }).toDestination();
    
    synth.volume.value = -15;

    // Rest of the audio setup...
    noise = new Tone.Noise("white").start();
    noiseFilter = new Tone.Filter({
      type: "bandpass",
      frequency: 2000,
      Q: 1.5
    }).toDestination();
    
    noiseEnv = new Tone.AmplitudeEnvelope({
      attack: 0.005,
      decay: 0.1,
      sustain: 0.3,
      release: 0.1
    }).connect(noiseFilter);
    
    noise.connect(noiseEnv);
    noise.volume.value = -100;

    // Enhanced color selection synth
    colorClickSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0,
        release: 0.5
      }
    }).toDestination();
    
    colorClickSynth.volume.value = -10;

    // Eraser sound synth
    eraserSound = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0,
        release: 0.3
      }
    }).toDestination();
    
    eraserSound.volume.value = -12;

    // Save sound synth
    saveSound = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.3,
        release: 0.5
      }
    }).toDestination();
    
    saveSound.volume.value = -8;

    // Background sequence synth with more musical characteristics
    backgroundSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0.3,
        release: 0.4
      }
    }).toDestination();
    
    backgroundSynth.volume.value = minVolume;

    // Create initial background sequence
    backgroundSeq = new Tone.Sequence((time, note) => {
      const randomDelay = Math.random() * 0.1;
      backgroundSynth.triggerAttackRelease(note, '4n', time + randomDelay);
    }, ['C4', 'E4', 'G4', 'C5'], '4n').start(0);

    // Clear sound effect
    clearSound = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0,
        release: 1
      }
    }).toDestination();

    clearSound.volume.value = -10;

    // Start the background sequence
    Tone.Transport.start();
  });
}

function mouseDragged() {
  if (!audioInitialized) return;
  
  if (selectedColor === 'eraser') {
    // Eraser mode
    stroke(255); // White color for erasing
    strokeWeight(20); // Thicker stroke for eraser
    line(pmouseX, pmouseY, mouseX, mouseY);
    
    // Play eraser sound
    if (!isPlaying) {
      isPlaying = true;
      const speed = dist(pmouseX, pmouseY, mouseX, mouseY);
      const constrainedSpeed = constrain(speed, 0.1, 20);
      const frequency = map(constrainedSpeed, 0.1, 20, 440, 880);
      eraserSound.triggerAttackRelease(frequency, '32n');
    }
  } else {
    // Regular drawing mode
    stroke(selectedColor);
    strokeWeight(10);
    line(pmouseX, pmouseY, mouseX, mouseY);
    
    // Track drawing density
    recentDrawings.push({x: mouseX, y: mouseY});
    if (recentDrawings.length > maxDensity) {
      recentDrawings.shift();
    }
    updateDrawingDensity();
    
    // Play drawing sound
    const speed = dist(pmouseX, pmouseY, mouseX, mouseY);
    const constrainedSpeed = constrain(speed, 0.1, 20);
    const frequency = map(constrainedSpeed, 0.1, 20, 220, 440);
    synth.triggerAttackRelease(frequency, '32n');
  }
  
  lastDrawTime = millis();
}

function updateDrawingDensity() {
  if (recentDrawings.length < 2) return;
  
  // Calculate average distance between points
  let totalDist = 0;
  for (let i = 1; i < recentDrawings.length; i++) {
    totalDist += dist(
      recentDrawings[i-1].x, recentDrawings[i-1].y,
      recentDrawings[i].x, recentDrawings[i].y
    );
  }
  
  // Normalize density (closer points = higher density)
  drawingDensity = map(totalDist / recentDrawings.length, 0, 100, 1, 0);
  
  // Update background sequence based on density
  if (backgroundSeq) {
    // More musical scales based on density
    const baseNotes = ['C4', 'E4', 'G4', 'C5'];
    const denseNotes = ['C4', 'E4', 'G4', 'C5', 'E5', 'G5', 'C6'];
    const sparseNotes = ['C4', 'G4', 'C5'];
    
    const notes = drawingDensity > 0.5 ? denseNotes : sparseNotes;
    
    // Create a new sequence with the updated notes
    backgroundSeq.stop();
    backgroundSeq = new Tone.Sequence((time, note) => {
      const randomDelay = Math.random() * 0.1;
      backgroundSynth.triggerAttackRelease(note, '4n', time + randomDelay);
    }, notes, '4n').start(0);

    // Calculate volume based on drawing density and recent drawings count
    const fillFactor = Math.min(recentDrawings.length / maxDensity, 1);
    const targetVolume = map(fillFactor, 0, 1, minVolume, maxVolume);
    
    // Smoothly ramp the volume
    backgroundSynth.volume.rampTo(targetVolume, 0.5);
  }
}

function keyPressed() {
  if (key === 'c' || key === 'C') {
    clear();
    playClearSound();
    recentDrawings = [];
    drawingDensity = 0;
  }
}

function playClearSound() {
  if (!clearSound) return;
  
  // Create a more musical descending arpeggio for clearing
  const notes = ['C5', 'G4', 'E4', 'C4'];
  notes.forEach((note, i) => {
    const randomDelay = Math.random() * 0.05;
    clearSound.triggerAttackRelease(note, '8n', Tone.now() + i * 0.1 + randomDelay);
  });
  
  // Reset volume to minimum when clearing
  if (backgroundSynth) {
    backgroundSynth.volume.rampTo(minVolume, 0.5);
  }
}

function saveDrawing() {
  if (!saveSound) return;
  
  // Play save sound - ascending arpeggio with a satisfying resolution
  const notes = ['C4', 'E4', 'G4', 'C5'];
  notes.forEach((note, i) => {
    saveSound.triggerAttackRelease(note, '8n', Tone.now() + i * 0.1);
  });
  
  // Save the canvas
  save('myDrawing.png');
}