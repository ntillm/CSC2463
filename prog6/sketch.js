let synth1, filt, rev, polySynth, noise1, ampEnv1, distortion;
let distortionSlider;

let activeKey = null;

let keyNotes = {
  'a': 'A4',
  's': 'B4',
  'd': 'C5',
  'f': 'D5'
}

let keyNotes1 = {
  'q': 'D4',
  'w': 'F4',
  'e': 'A4',
  'r': 'C5',
  't': 'D5',
  'y': 'E5',
  'u': 'F5',
  'i': 'G5',
  'o': 'A5',
  'p': 'B5',
  '[': 'C6',
  ']': 'D6'
}

function setup() {
  createCanvas(400, 400);
  filt = new Tone.Filter(1000, "lowpass").toDestination();
  rev = new Tone.Reverb(2).connect(filt);
  distortion = new Tone.Distortion(0.4).connect(rev); // Add distortion effect
  synth1 = new Tone.Synth({
    Envelope: {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.9,
      release: 0.3
    }
  }).connect(distortion); // Connect synth to distortion
  synth1.portamento.value = 0.5;
  polySynth = new Tone.PolySynth(Tone.FMSynth).connect(distortion); // Connect polySynth to distortion
  polySynth.set({
    Envelope: {
      attack: 0.1,
      decay: 0.5,
      sustain: 1,
      release: 0.5
    },
    oscillator: {
      type: 'sawtooth'
    }
  });
  ampEnv1 = new Tone.AmplitudeEnvelope({
    attack: 0.1,
    decay: 0.5,
    sustain: 0,
    release: 0.2
  }).toDestination();
  noise1 = new Tone.Noise('brown').start().connect(ampEnv1);

  // Create a slider for controlling distortion
  distortionSlider = createSlider(0, 1, 0.4, 0.01);
  distortionSlider.position(10, 50);
  distortionSlider.style('width', '380px');
}

function draw() {
  background(220);
  textSize(16);
  fill(0);
  text('Distortion Amount: ' + distortion.distortion.toFixed(2), 10, 20);
  text('Press z to trigger noise', 10, 100);
  text('Press q, w, e, r, t, y, u, i, o, p, [, ] to trigger polySynth', 10, 150);
  // Update distortion amount based on slider value
  distortion.distortion = distortionSlider.value();
}

function keyPressed() {
  let pitch = keyNotes[key];
  let pitch1 = keyNotes1[key];
  if (pitch && key !== activeKey) {
    synth1.triggerRelease();
    activeKey = key;
    synth1.triggerAttack(pitch);
  } else if (pitch1) {
    polySynth.triggerAttack(pitch1);
  } else if (key === 'z') {
    ampEnv1.triggerAttackRelease(1);
  }
}

function keyReleased() {
  let pitch1 = keyNotes1[key];
  if (key === activeKey) {
    synth1.triggerRelease();
    activeKey = null;
  } else if (pitch1) {
    polySynth.triggerRelease(pitch1);
  }
}