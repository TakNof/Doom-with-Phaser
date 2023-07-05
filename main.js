const canvasSize = {width: 1024, height: 768};

let config = {
    type: Phaser.AUTO,
    physics:{
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    width: canvasSize.width,
    height: canvasSize.height,
    scene: [MainMenuScene, Game2D, Game3D]
}

let sharedScenes= {};

const colors = {
    limeGreen: "0x00ff00",
    DarkGreen : "0x004200",
    black: "0x000000",
    crimsonRed: "0xDC143C",
    sapphireBlue: "0x0F52BA"
};

const shotgun = {
    name: "shotgun",
    bulletProperties:{
        damage: 80,
        velocity: 1000,
        delay: 1000,
        critical: 2.2
    },
    distanceLimits:{
        min: 180,
        max: 1000
    },
    animationParams:{
        end: 8,
        framerate: 10,
    },
    soundDir: "./assets/weapons/shotgun/Sounds/shotgun_sound.wav",
    spriteDir: "./assets/weapons/shotgun/SpriteSheet/shotgun.png",
    animationJsonDir: "assets/weapons/shotgun/SpriteSheet/shotgun.json"
}

const pistol = {
    name: "pistol",
    bulletProperties:{
        damage: 40,
        velocity: 800,
        delay: 300,
        critical: 1.3
    },
    distanceLimits:{
        min: 250,
        max: 600
    },    
    animationParams:{
        end: 8,
        framerate: 15,
    },
    soundDir: "./assets/weapons/pistol/Sounds/pistol_sound.wav",
    spriteDir: "./assets/weapons/pistol/SpriteSheet/pistol.png",
    animationJsonDir: "assets/weapons/pistol/SpriteSheet/pistol.json"
}

const weapons = [pistol, shotgun];

let game = new Phaser.Game(config);

/**
     * This method allows us to get a number between the specified range.
     * @param {number} min 
     * @param {number} max 
     * @returns {randomNumber}
     */
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}