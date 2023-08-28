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
    scene: [MainMenu, Game2D, Game3D, PauseMenu, OptionsMenu]
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
        velocity: 2000,
        delay: 1000,
        critical: 2.2,
        maxCriticalDamage: 320
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
        velocity: 1600,
        delay: 350,
        critical: 1.3
    },
    distanceLimits:{
        min: 250,
        max: 600
    },    
    animationParams:{
        end: 7,
        framerate: 15,
    },
    soundDir: "./assets/weapons/pistol/Sounds/pistol_sound.wav",
    spriteDir: "./assets/weapons/pistol/SpriteSheet/pistol.png",
    animationJsonDir: "assets/weapons/pistol/SpriteSheet/pistol.json"
}

const weapons = [pistol, shotgun];

const cacodemon = {
    name: "small_cacodemon",
    defaultVelocity: 150,
    angleOffset: 3*Math.PI/2,
    chaseDistance: 400,
    maxHealth: 250,
    bulletProperties:{
        damage: 12,
        velocity: 200,
        delay: 3000,
        critical: 1.5
    },
    distanceLimits:{
        min: 250,
        max: 1000
    },    
    animationsToSet: [
        {
            name: "attack",
            animationParams:{
                end: 9,
                framerate: 15,
            }
        },
        {
            name: "hurt",
            animationParams:{
                end: 7,
                framerate: 15
            }
        },
    ],
    spriteSounds: ["hurt", "death", "attack"]
}

let options = {
    quality: {
        setting: 1,
        value: 64
    },
    renderDistance: {
        setting: 1,
        value: 40
    },
    dificulty: {
        setting: 4
    }
}

const game = new Phaser.Game(config);

/**
 * This method allows us to get a number between the specified range.
 * @param {number} min 
 * @param {number} max 
 * @returns {randomNumber}
 */
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}


/**
 * Allows to adjust the angle value of the rotation to be within the range of 0 and 2PI.
 * @param {Number} angle The angle to be within the range of 0 and 2PI.
 * @returns {Number}
 */
function adjustAngleValue(angle){
    if(angle < 0){
        angle += 2*Math.PI;
    }else if(angle > 2*Math.PI){
        angle -= 2*Math.PI;
    }

    return angle;
}

/**
 * This method calculates the distance between 2 coordinates.
 * @param {number} x1 The x coordinate of the first sprite.  
 * @param {number} x2 The x coordinate of the second sprite. 
 * @param {number} y1 The y coordinate of the first sprite. 
 * @param {number} y2 The y coordinate of the second sprite. 
 * @returns {number} The hyphypotenuse according to the specified coordinates.
 */
function hypoCalc(x1, x2, y1, y2){
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}