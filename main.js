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
        delay: 1,
        critical: 2.2
    },
    distanceLimits:{
        min: 180,
        max: 1000
    },
    soundDir: "./assets/weapons/shotgun/Sounds/shotgun_sound.mp3",
    spriteDir: "./assets/weapons/shotgun/SpriteSheet/shotgun.png",
    animationJsonDir: "assets/weapons/shotgun/SpriteSheet/shotgun.json"
}

const weapons = {shotgun: shotgun};

let game = new Phaser.Game(config);