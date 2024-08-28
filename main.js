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
    scene: [MainMenu, SelectDifficulty, HowToPlay, Game2D, Game3D, PauseMenu, OptionsMenu, EndGameMenu, EndGameChoiseMenu]
}

let sharedScenes = {};

const colors = {
    limeGreen: "0x00ff00",
    DarkGreen : "0x004200",
    black: "0x000000",
    crimsonRed: "0xDC143C",
    sapphireBlue: "0x0F52BA"
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
        setting: 1,
        value: 64
    },
    renderDistance: {
        setting: 1,
        value: 40
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