# 🎙️ Voice Reactive 3D World

An interactive browser-based **3D audio-visual experience** that reacts to your voice in real time.

The project combines **Three.js**, the **Web Audio API**, and the **Web Speech API** to create a 3D geometric world that changes its shape and color based on microphone input while displaying your spoken words as live text.

---

## 🌐 Project Overview

**Voice Reactive 3D World** is a real-time voice-controlled visualizer.

When the user speaks:

- 🎤 Microphone captures the voice.
- 🔊 Audio volume is analyzed in real time.
- 🌀 A 3D geometric object reacts to the voice intensity.
- 🎨 The object's appearance changes according to audio levels.
- 🗣️ Speech is converted into text.
- 📝 Live transcription appears on the screen.

The entire experience runs directly inside a modern web browser.

---

## ✨ Features

### 🎤 Real-Time Microphone Input
Uses the browser microphone to capture live audio.

### 🔊 Voice-Reactive 3D Object
The 3D object dynamically deforms according to the detected voice volume.

### 🌀 Three.js 3D Graphics
Uses Three.js and WebGL to render an interactive 3D environment.

### 🎨 Dynamic Visual Effects
Voice intensity controls the visual behavior of the 3D object.

### 🗣️ Live Speech Recognition
Converts spoken words into text using the Web Speech API.

### 📝 Live Transcript
Displays recognized speech directly on the screen.

### 🔘 Microphone Control
Users can turn microphone processing ON or OFF.

### 📱 Responsive Interface
The interface is designed to work across desktop and mobile screen sizes.

### 🪟 Glassmorphism UI
Uses a modern glass-style overlay for the controls and transcript.

---

## 🧠 Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Web page structure |
| CSS3 | UI design and animations |
| JavaScript | Application logic |
| Three.js | 3D rendering |
| Web Audio API | Audio analysis |
| Web Speech API | Speech-to-text |
| WebGL | Hardware-accelerated graphics |
| MediaDevices API | Microphone access |

---

## 📁 Project Structure

```text
Voice-Reactive-3D-World/
│
├── index.html
├── style.css
├── script.js
├── app.js
├── README.md
│
├── assets/
│   ├── models/
│   ├── textures/
│   └── audio/
│
└── libraries/
    └── three.min.js
