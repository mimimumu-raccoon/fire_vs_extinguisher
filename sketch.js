let font;
let fireMove = { x: 0, y: 0 };
let extMove = { x: 0, y: 0 };
let squeeze = null;
let boxes = [];
let emitters = [];
let bubbles = [];
let firePlayer;
let extinguisher;
let margin = 60;
let gameState = 'start'; // 'start', 'playing', 'end'
let timeLeft = 30; // 30 seconds
let lastSecond = 0;
let colors = [
  "rgb(0, 81, 219)",
  "rgb(0, 128,10)",
  "rgb(255, 255, 255)",
  "rgb(233, 184, 36)",
  "rgb(238, 147, 34)",
  "rgb(220, 0, 0)",
];

let redColor;
let yellowColor;
let fireBaseX = 23;
let fireBaseY = 20;

function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER);
    
    redColor = color(255, 0, 0);
    yellowColor = color(255, 195, 0);
}

function draw() {
    background(235, 233, 226);

    if (gameState === 'start') {
        drawStartScreen();
    } else if (gameState === 'playing') {
        drawGame();
        updateTimer();
    } else if (gameState === 'end') {
        drawEndScreen();
    }
}

function drawStartScreen() {
    fill(0, 0, 0, 217);
    rect(0, 0, width, height);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(48);
    textFont("Josefin Sans")
    textStyle(BOLD);
    textLeading(60);
    text(' 🔥 V. S. 🧯 ', width / 2, height / 2 - 200);
    textSize(25);
    textStyle(NORMAL);
    textLeading(40);
    text(
        '🔥: W A S D to move, F to start fire\n' +
        '🧯: I J K L to move, H to extinguish the flames',
        width / 2,
        height / 2 - 40
    );

    // Start button
    fill(219, 0, 0);
    noStroke();
    rectMode(CENTER);
    rect(width / 2, height / 2 + 140, 200, 60, 8);
    fill(255);
    textSize(24);
    textStyle(BOLD);
    text('START', width / 2, height / 2 + 140);
    rectMode(CORNER);
}

function drawGame() {
    rectMode(CENTER);
    noStroke();
    
    // Background Moving Boxes
    boxes.forEach((box) => {
        box.show();
        if (random(100) > 99) {
            box.newX = random(width);
            box.newY = random(height);
            box.newW = random(10, 100);
            box.newL = random(10, 100);
            box.newC = color(colors[floor(random(colors.length))]);
            box.newA = random(150, 200);
        }
        box.x = lerp(box.x, box.newX, 0.1);
        box.y = lerp(box.y, box.newY, 0.1);
        box.w = lerp(box.w, box.newW, 0.1);
        box.l = lerp(box.l, box.newL, 0.1);
        box.c = lerpColor(box.c, box.newC, 0.1);
        box.a = lerp(box.a, box.newA, 0.1);
    });

    // Show Players
    firePlayer.update();
    firePlayer.show();
    extinguisher.update();
    extinguisher.show();

    // Show Emitters (Fire)
    for (let emitter of emitters) {
        emitter.update();
    }

    // Show Bubbles and Collisions
    for (let i = bubbles.length - 1; i >= 0; i--) {
        let bubble = bubbles[i];
        bubble.update();
        bubble.show();

        if (bubble.pos.y < 0) {
            bubbles.splice(i, 1);
            continue;
        }

        for (let j = emitters.length - 1; j >= 0; j--) {
            if (bubble.hits(emitters[j])) {
                emitters.splice(j, 1);
                bubbles.splice(i, 1);
                break;
            }
        }
    }

    if (squeeze) squeeze.update();

    // Timer display
    fill(0, 0, 0, 80);
    noStroke();
    rectMode(CENTER);
    rect(width / 2, 38, 200, 50, 8);
    fill(255);
    textFont('Figtree')
    textSize(24);
    textStyle(BOLD);
    let mins = floor(timeLeft / 60);
    let secs = timeLeft % 60;
    text(`Time: ${mins}:${secs < 0 ? '0' : ''}${secs}`, width / 2, 40);
    rectMode(CORNER);
}

function drawEndScreen() {
    fill(0, 0, 0, 234);
    rect(0, 0, width, height);

    fill(219, 0, 0);
    textSize(52);
    textFont('Figtree')
    textStyle(BOLD);
    text("TIME IS UP", width / 2, 120);
    fill(255);
    textSize(22);
    textStyle(NORMAL);
    textAlign(LEFT, TOP);
    textLeading(30);

    let leftMargin = max(width/5, width / 2 - 350);
    let topMargin = 200;
    text(
        'Hey! Did this little game make you nervous?',
        leftMargin, topMargin
    );
    text(
      'Actually, you should!\n'+ 'Because this game is a metaphor for the endless war against misinformation. \n', leftMargin+30, topMargin + 40);
  
  fill('#FFEB3B')
    textSize(18);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    textLeading(30);
    text('🔥 set fire, and it spreads, representing rumors, false information even conspiracy theories.\n' +
        '🧯 desperately to extinguish them with truth and verification.', leftMargin, topMargin + 120
    )
  
  fill(255);
    textSize(22);
    textStyle(NORMAL);
    textAlign(LEFT, TOP);
    textLeading(30);
    text(
        'But here is the reality: Creating misinformation takes seconds.\n' +
        'Debunking it takes forever and it won’t “spread”!',
        leftMargin, topMargin + 200
    );
    text(
        'Online disinformation poses a significant threat by destroying public trust,\n' + 'polarizing societies, and undermining democratic processes through fake news.\n' +
        'extinguished. New fires ignite while you are still fighting the old ones.',
        leftMargin, topMargin + 280
    );
    text(
        'As digital citizens, we must be vigilant about every message \n' + 'and take responsibility for verifying every information we spread.\n' +
        leftMargin, topMargin + 390
    );

  

    textAlign(CENTER, CENTER);
    // Play Again button
    fill('rgba(255,255,255,0.41)');
    noStroke();
    rectMode(CENTER);
    rect(width / 2, height - 80, 220, 55, 8);
    fill(255);
    textSize(20);
    textStyle(BOLD);
    text('Play Again', width / 2, height - 80);
    rectMode(CORNER);
}

function updateTimer() {
    if (floor(millis() / 1000) > lastSecond) {
        lastSecond = floor(millis() / 1000);
        timeLeft--;
        if (timeLeft <= 0) {
            timeLeft = 0;
            gameState = 'end';
        }
    }
}

function startGame() {
    gameState = 'playing';
    timeLeft = 30;
    lastSecond = floor(millis() / 1000);
    
    boxes = [];
    emitters = [];
    bubbles = [];
    fireMove = { x: 0, y: 0 };
    extMove = { x: 0, y: 0 };
    squeeze = null;

    firePlayer = new FirePlayer(margin, height / 2);
    extinguisher = new Extinguisher(width - margin, height / 2);

    for (let i = 0; i < 50; i++) {
        boxes.push(new Box());
    }
}

function mousePressed() {
    if (gameState === 'start') {
        if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
            mouseY > height / 2 + 110 && mouseY < height / 2 + 170) {
            startGame();
        }
    } else if (gameState === 'end') {
        if (mouseX > width / 2 - 110 && mouseX < width / 2 + 110 &&
            mouseY > height - 107 && mouseY < height - 52) {
            gameState = 'start';
        }
    }
}

function keyPressed() {
    if (gameState !== 'playing') return;

    let k = key.toLowerCase();

    if (k === 'a') fireMove.x = -1;
    if (k === 'd') fireMove.x = 1;
    if (k === 'w') fireMove.y = -1;
    if (k === 's') fireMove.y = 1;

    if (k === 'f') {
        emitters.push(new Emitter(firePlayer.x, firePlayer.y));
    }

    if (k === 'j') extMove.x = -1;
    if (k === 'l') extMove.x = 1;
    if (k === 'i') extMove.y = -1;
    if (k === 'k') extMove.y = 1;

    if (k === 'h') {
        if (!squeeze) {
            squeeze = new Squeeze(extinguisher);
        }
        squeeze.squeezing = true;
    }
}

function keyReleased() {
  if (gameState !== 'playing') return;
  let k = key.toLowerCase();

  fireMove.x = 0;
  fireMove.y = 0;
  extMove.x = 0;
  extMove.y = 0;

  if (k === 'h') {
    if (squeeze) squeeze.squeezing = false;
  }

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

class Box {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.w = random(10, 100);
        this.l = random(10, 100);
        this.c = color(colors[floor(random(colors.length))]);
        this.a = random(150, 200);
        this.newX = random(width);
        this.newY = random(height);
        this.newW = random(10, 100);
        this.newL = random(10, 100);
        this.newC = color(colors[floor(random(colors.length))]);
        this.newA = random(150, 200);
    }

    show() {
        let r = red(this.c);
        let g = green(this.c);
        let b = blue(this.c);
        fill(r, g, b, this.a);
        rect(this.x, this.y, this.w, this.l, 1);
    }
}

class FirePlayer {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 4;
    }

    update() {
        let vx = fireMove.x;
        let vy = fireMove.y;

        if (vx !== 0 || vy !== 0) {
            let m = Math.sqrt(vx * vx + vy * vy);
            vx /= m;
            vy /= m;
        }

        this.x += vx * this.speed;
        this.y += vy * this.speed;
        this.x = constrain(this.x, 0, width);
        this.y = constrain(this.y, 0, height);
    }

    show() {
        textSize(64);
        fill(255);
        text('🔥', this.x, this.y);
    }
}

class Extinguisher {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 5;
    }

    update() {
        let vx = extMove.x;
        let vy = extMove.y;

        if (vx !== 0 || vy !== 0) {
            let m = Math.sqrt(vx * vx + vy * vy);
            vx /= m;
            vy /= m;
        }

        this.x += vx * this.speed;
        this.y += vy * this.speed;
        this.x = constrain(this.x, 0, width);
        this.y = constrain(this.y, 0, height);
    }

    show() {
        textSize(64);
        fill(255);
        text('🧯', this.x, this.y);
    }
}

class Squeeze {
    constructor(extinguisher) {
        this.ext = extinguisher;
        this.squeezing = false;
        this.cooldown = 0;
    }

    update() {
        if (!this.squeezing) return;

        if (frameCount % 3 === 0) {
            for (let i = 0; i < 6; i++) {
                bubbles.push(new Bubble(this.ext.x, this.ext.y));
            }
        }
    }
}

class Bubble {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(random(-2, 2), random(-6, -4));
        this.r = random(20, 25);
    }

    update() {
        this.pos.add(this.vel);
    }

    show() {
        noStroke();
        fill(255, 255, 255, 220);
        circle(this.pos.x, this.pos.y, this.r);
    }

    hits(emitter) {
        let d = dist(this.pos.x, this.pos.y, emitter.position.x, emitter.position.y);
        return d < this.r;
    }
}

class Emitter {
    constructor(x, y) {
        this.position = createVector(x, y);
        this.fire = [];

        this.canSpread = random(1) < 0.5; // 50% 機率蔓延
        this.spreadCount = 0;
        this.maxSpread = 2;
        this.spreadCooldown = 60; // 第一次延遲一點
    }

    update() {
        for (let i = 0; i < 5; i++) {
            let p = new FireParticle(this.position.x, this.position.y, 1.0);
            if (frameCount % 2 === 0) {
                this.fire.push(p);
            }
        }
                // 更新粒子
        for (let i = this.fire.length - 1; i >= 0; i--) {
            this.fire[i].update();
            this.fire[i].show();
            if (this.fire[i].finished()) this.fire.splice(i, 1);
        }

        // ------------------------
        //   子火蔓延邏輯
        // ------------------------
        if (this.canSpread && this.spreadCount < this.maxSpread) {

            this.spreadCooldown--;

            if (this.spreadCooldown <= 0) {
                this.spreadCooldown = 90; // 下一次更慢

                emitters.push(new Emitter02(
                    this.position.x + random(-80, 80),
                    this.position.y + random(-80, 80),
                    0.5   // 子火更小
                ));

                this.spreadCount++;
            }
        }
    }
}

class Emitter02 {
    constructor(x, y, scale) {
        this.position = createVector(x, y);
        this.fire = [];
        this.scale = scale;
      
    }

    update() {
        for (let i = 0; i < 5; i++) {
            if (frameCount % 3 === 0) { // 比原火更慢
                this.fire.push(new FireParticle(
                    this.position.x,
                    this.position.y,
                    this.scale
                ));
            }
        }

        for (let i = this.fire.length - 1; i >= 0; i--) {
            this.fire[i].update();
            this.fire[i].show();
            if (this.fire[i].finished()) this.fire.splice(i, 1);
        }
    }
}

class FireParticle {
    constructor(x, y, scale = 1) {
        this.pos = createVector(x + random(fireBaseX / 2), y + random( fireBaseY / 2));
        this.vol = createVector(random(-1, 1), random(-5, -1));
        this.r = 30 * scale;      // 根據 scale 變小
        this.scale = scale;
        this.color = lerpColor(redColor, yellowColor, random(1));
        this.lifetime = 255;
        this.scale = scale;
    }

    finished() {
        return this.lifetime < 0;
    }

    show() {
        noStroke();
        fill(red(this.color), green(this.color), blue(this.color), this.lifetime);
        circle(this.pos.x, this.pos.y, this.r);
      
    }

    update() {
        this.pos.add(this.vol);
        this.lifetime -= 11;
        this.r += 2 * this.scale;
    }
}
    