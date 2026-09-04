class Zombie extends RangeEnemy{
    /**
    * The constructor of Zombie Class.
    * @constructor
    * @param {Phaser.Scene} scene2D The scene to place the sprite in the game.
    * @param {Phaser.Scene} scene3D The scene to place the 3D sprite in the game.
    * @param {{x: Number, y: Number}} worldOriginInfo A literal Object with the initial positioning information for the sprite.
    * @param {Object} config The configuration object for the Enemy.
    */
    constructor(scene2D, scene3D, worldOriginInfo, config){
        super(scene2D, scene3D, worldOriginInfo, config);
    }

    update(frameFactor = 1){
        super.update(frameFactor);
        // this.on("animationupdate", (anim, frame) =>{
        //     console.log(anim.key);
        // })
    }
} 