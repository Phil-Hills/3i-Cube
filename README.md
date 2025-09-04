# 3i-CUBE: Revolutionizing Microscopy

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/philhills/3i-Cube)
[![Version](https://img.shields.io/badge/version-2.0-blue)](https://github.com/philhills/3i-Cube)

**[Live Demo & Simulator](https://service-3i-cube-intelligent-imaging-control-768405504263.us-west1.run.app)**

*An advanced AI-powered protocol from **3i (Intelligent Imaging Innovations)**, with core algorithms and UI/UX created by **EasyAI Chatbots**.*

```cube
3i|UNCOMPLICATE[Imaging_and_ML]→EMPOWER[Scientists]→ACCELERATE[Discovery]|REVOLUTION
```
3i-CUBE is an AI-powered simulator and development environment for a universal microscopy protocol. It's designed to solve the complexity crisis in modern microscopy by replacing brittle scripts and complex UIs with a simple, shareable, and reproducible command language.

## Table of Contents

- [The Core Concept](#the-core-concept)
  - [The Challenge](#the-challenge-the-complexity-crisis-in-modern-microscopy)
  - [The Solution](#the-solution-the-ultimate-remote-control)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
- [License](#license)

## The Core Concept

### The Challenge: The Complexity Crisis in Modern Microscopy

3i systems are the most powerful in the world, but with great power comes great complexity. Scientists face three major hurdles that slow down discovery:

1.  **Software Overload**: Modern microscope software is like a TV remote with 500 buttons. While powerful, it requires extensive training, and critical features often go unused.
2.  **Brittle, Unshareable Workflows**: Experiments are defined by a series of manual clicks or long, complex Python scripts that are difficult to share, version, and reproduce.
3.  **The AI/ML Barrier**: Groundbreaking AI models for image analysis are often trapped in complex codebases, inaccessible to the biologists who need them most.

### The Solution: The Ultimate Remote Control

3i-CUBE is the modern extension of 3i's software ecosystem. It solves the complexity crisis by acting as a universal remote control for your microscope. Instead of hundreds of buttons, CUBE uses a simple, intuitive language based on the `DOMAIN|SEQUENCE|OUTCOME` pattern. You tell the system *what* you want, and it handles the complex "button presses" for you.

| **The Old Way** | **The 3i-CUBE Way** |
| :--- | :--- |
| `Click... Set Exposure... Adjust Gain... Run Z-Stack...` | `ACQUIRE|ZSTACK[100]→CHANNELS[GFP,DAPI]|COMPLETE` |
| Hours of setup and potential for human error. | A single, readable, shareable, and perfect command. |

This is how **3i Intelligent Imaging is revolutionizing microscopy**: by un-complicating the entire imaging and machine learning process.

## Key Features

- **🔬 CUBE Executor**: A full-featured environment for writing, running, and visualizing CUBE scripts with a simulated microscope log and AI-generated image previews.
- **🤖 AI-Powered Converter**: Seamlessly convert legacy code, natural language descriptions, or raw data into compact, efficient CUBE commands using the Gemini API.
- **🧠 Synthetic Data ML Builder**: Generate unlimited, scientifically-plausible training data with zero API cost, then build the CUBE script to train your model.
- **🎬 VEO Video Builder**: Generate synthetic video clips from simple text prompts and create the corresponding CUBE script for simulation and training.
- **📚 Scientific Data Hub**: Instantly load benchmark datasets from public repositories like Zenodo and Kaggle with a single CUBE command.
- **🖼️ Media Gallery**: Automatically save, browse, and filter all your AI-generated media, with persistent storage in your browser.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have Node.js and npm installed on your system.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/philhills/3i-Cube.git
   ```
2. Navigate to the project directory
   ```sh
   cd 3i-Cube
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Create a `.env` file in the root directory and add your Gemini API key:
   ```
   API_KEY='YOUR_GEMINI_API_KEY'
   ```
5. Run the development server
   ```sh
   npm run dev
   ```

## License

Distributed under the MIT License.

---

> This is a project by [EasyAI Chatbots](https://github.com/philhills) for [3i (Intelligent Imaging Innovations)](https://www.intelligent-imaging.com/).