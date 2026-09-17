// --- 1. THREE.JS SCENE SETUP ---
const canvas = document.querySelector('#webgl');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050508, 0.02);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 15;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const light = new THREE.PointLight(0x00ffff, 2, 50);
light.position.set(0, 0, 10);
scene.add(light);

// 3D Visualizer Mesh
const geometry = new THREE.IcosahedronGeometry(4, 30);
const material = new THREE.MeshStandardMaterial({
  color: 0x4488ff,
  wireframe: true,
  roughness: 0.3,
  metalness: 0.8
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const originalPositions = new Float32Array(geometry.attributes.position.array);

// --- 2. AUDIO & SPEECH STATE VARIABLES ---
let audioContext, analyser, dataArray, mediaStream;
let isAudioActive = false;
let recognition = null;

const toggleBtn = document.getElementById('toggle-mic-btn');
const statusText = document.getElementById('status');
const transcriptText = document.getElementById('transcript-text');

// --- 3. SPEECH RECOGNITION SETUP ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    let currentTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      currentTranscript += event.results[i][0].transcript;
    }
    transcriptText.innerText = currentTranscript || '...';
  };

  recognition.onerror = (event) => {
    console.warn('Speech recognition error:', event.error);
  };

  recognition.onend = () => {
    // Restart recognition automatically if microphone is still toggled ON
    if (isAudioActive) {
      try { recognition.start(); } catch (e) {}
    }
  };
} else {
  transcriptText.innerText = 'Speech Recognition API is not supported in this browser.';
}

// --- 4. START / STOP MICROPHONE LOGIC ---
async function startMicrophone() {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const source = audioContext.createMediaStreamSource(mediaStream);
    analyser = audioContext.createAnalyser();
    
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    
    source.connect(analyser);
    
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    
    isAudioActive = true;
    toggleBtn.innerText = 'Turn Mic OFF';
    statusText.innerText = 'Microphone active! Speak to see transcription and 3D reactions.';

    if (recognition) {
      recognition.start();
    }
  } catch (err) {
    console.error('Microphone access error:', err);
    statusText.innerText = 'Microphone access denied or error occurred.';
  }
}

function stopMicrophone() {
  isAudioActive = false;

  // Stop Media Stream tracks
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
  }

  // Close Audio Context
  if (audioContext && audioContext.state !== 'closed') {
    audioContext.close();
  }

  // Stop Speech Recognition
  if (recognition) {
    recognition.stop();
  }

  toggleBtn.innerText = 'Turn Mic ON';
  statusText.innerText = 'Microphone is turned OFF.';
}

// Toggle button click listener
toggleBtn.addEventListener('click', () => {
  if (isAudioActive) {
    stopMicrophone();
  } else {
    startMicrophone();
  }
});

// --- 5. ANIMATION LOOP ---
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();
  let volume = 0;

  if (isAudioActive && analyser) {
    analyser.getByteFrequencyData(dataArray);
    
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    volume = sum / dataArray.length;
  }

  const positionAttribute = geometry.attributes.position;
  const normalizedVolume = volume / 255;

  for (let i = 0; i < positionAttribute.count; i++) {
    const x = originalPositions[i * 3];
    const y = originalPositions[i * 3 + 1];
    const z = originalPositions[i * 3 + 2];

    const displacement = Math.sin(x * 0.5 + elapsedTime * 3) * 
                          Math.cos(y * 0.5 + elapsedTime * 3) * 
                          (normalizedVolume * 3 + 0.2);

    positionAttribute.setXYZ(
      i,
      x + (x / 4) * displacement,
      y + (y / 4) * displacement,
      z + (z / 4) * displacement
    );
  }

  positionAttribute.needsUpdate = true;

  sphere.rotation.y = elapsedTime * 0.2;
  sphere.rotation.x = elapsedTime * 0.1;

  material.color.setHSL(0.6 - normalizedVolume * 0.5, 0.8, 0.5);

  renderer.render(scene, camera);
}

animate();

// Window Resize Handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});