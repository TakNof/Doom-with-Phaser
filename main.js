const canvasSize = {width: 1024, height: 768};

/**
 * The frame duration (in ms) the game was originally tuned for (60 FPS).
 * Per-frame values that aren't handled by Arcade Physics (which already scales
 * velocities by delta) are multiplied by `delta / TARGET_FRAME_MS` so they behave
 * identically regardless of the monitor's refresh rate.
 */
const TARGET_FRAME_MS = 1000 / 60;

let config = {
    type: Phaser.AUTO,
    physics:{
        default: "arcade",
        arcade: {
            debug: true
        }
    },
    width: canvasSize.width,
    height: canvasSize.height,
    scene: [MainMenu, SelectDifficulty, HowToPlay, Game2D, Game3D, PauseMenu, OptionsMenu, EndGameMenu, EndGameChoiseMenu]
}

let sharedScenes = {};

const colors = {
    limeGreen: "0x00ff00",
    DarkGreen : "0x004200",
    black: "0x000000",
    crimsonRed: "0xDC143C",
    sapphireBlue: "0x0F52BA",

    // Numeric hex values (not the "0x..." strings above) - these feed Phaser
    // fill-color APIs (Grid, Rectangle) directly, which expect plain numbers.
    brick: 0x9c4a2e,
    mortar: 0xcfc4b4,
    floor: 0x4a4a4a,
    floorAlt: 0x3a3a3a,
    ceiling: 0x1c2b3a,
    ceilingAlt: 0x16212c
};

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
        setting: 3,
        value: 32
    },
    renderDistance: {
        setting: 3,
        value: 100
    },
    difficulty: {
        setting: 1
    }
}

const game = new Phaser.Game(config);

if(game.config.physics.arcade.debug){
    game.config.height *= 2;
}

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
    while(true){
        if(angle < 0){
            angle += 2*Math.PI;
        }else if(angle > 2*Math.PI){
            angle -= 2*Math.PI;
        }else{
            break;
        }
    }

    return angle;
}