# Mo Shui (墨水) - Interactive Fiction Game Editor

> Built for spatial narrative games

[![React](https://img.shields.io/badge/React-18.2.0-00D8FF?style=plastic&logo=react&logoColor=00D8FF&labelColor=282c34)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178C6?style=plastic&logo=typescript&logoColor=white&labelColor=0F1419)](https://www.typescriptlang.org/)
[![React Flow](https://img.shields.io/badge/React_Flow-11.10.4-FF6B6B?style=plastic&logoColor=white&labelColor=2D2D2D)](https://reactflow.dev/)
[![Blockly](https://img.shields.io/badge/Blockly-11.1.1-4AB8FF?style=plastic&logoColor=white&labelColor=1A1A1A)](https://developers.google.com/blockly)
[![Express](https://img.shields.io/badge/Express-4.18.2-FFFFFF?style=plastic&logo=express&logoColor=white&labelColor=000000)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-68A063?style=plastic&logo=node.js&logoColor=white&labelColor=1F1F1F)](https://nodejs.org/)
[![JWT](https://img.shields.io/badge/JWT-Auth-FFA000?style=plastic&logo=jsonwebtokens&logoColor=FFA000&labelColor=1C1C1C)](https://jwt.io/)
![License](https://img.shields.io/badge/License-Open_Source-00C853?style=plastic&logoColor=white&labelColor=1B5E20)
![Version](https://img.shields.io/badge/Version-2.0.0-2196F3?style=plastic&logoColor=white&labelColor=0D47A1)

[English](./README.en.md) | [简体中文](./README.zh.md)

---

## What is this

Mo Shui is an interactive fiction game editor. Create simple games without writing any code—just drag nodes, connect choices, and watch your branching story structure unfold like a map before your eyes.

## Core Features

**Node Flow Editor** - Drag nodes, connect choices, visualize your entire story structure

**Hotspot Interaction** - Use image hotspots for spatial exploration, clicking different areas to jump to corresponding scenes

**World Map** - Automatically records visited scenes for quick navigation

**Variable System** - Track player choices and drive multiple endings through accumulated state

**Conditional Branching** - Use Blockly visual programming to set conditions without writing code

**Visual Novel Player** - Immersive reading experience with backgrounds, character sprites, and dialogue boxes

**Single-File Export** - Generate standalone HTML files that run without a server—just double-click to play

## What to Create

If your game is about:
- Exploring unknown spaces
- Making difficult choices under pressure
- Creating emotions through text and atmosphere

Then Mo Shui is made for you.

**Suitable game types**:
- Exploration games (Backrooms, SCP containment breach)
- Survival choice games (Nuclear shelter, wasteland survival)
- Mystery puzzle games (Detective investigation, truth puzzles)
- Multi-ending branching narratives (Timeline splits, diamond-shaped narratives)

**Not suitable for**: Real-time combat, complex stat progression, competitive gameplay

## Technical Architecture

```
frontend/           Editor & online player (React + Vite + Engine + Plugin system)
backend/            User authentication & data persistence (Express + JWT)
player-standalone/  Standalone player builder (visual-novel)
packager-win/       Windows desktop packaging tool (Portable Node.js + Launcher)
```

## Quick Start

### Development Mode

```bash
# Frontend development
dev-start-frontend.cmd

# Backend development
dev-start-backend.cmd
```

### Production Deployment

```bash
# Online deployment
production-start.cmd

# Windows desktop packaging
cd packager-win
npm run build
```

**Technical Documentation**: The `docs/` folder contains core design documents (save logic, game mod design, variable system, etc.)

**Desktop Packaging**: See `packager-win/README-win.md`

## Your First Story

1. Create a start node and write "You stand at a crossroads"
2. Add two choices: "Go left" and "Go right"
3. Create two new nodes and connect the choices
4. Click preview to experience your first branching story

And so the story begins.

## License

Completely open source and free, including for commercial use.


