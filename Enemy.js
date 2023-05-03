/**
 * This class extends to Living class, due the "living" sprites could be
 * players or enemies. Furthermore, this class implements all the movement controlers for the enemy/s.
 */

class Enemy extends Living{
    /**
    * The constructor of Enemy Class.
    * @param {scene} scene The current scene of the game to place the sprite.
    * @param {number[]} enemyOriginInfo  A list with the initial positioning information for the sprite.
    * @param {string} enemyImgStr An str of the image name given in the preload method of the main class.
    * @param {number} size The size of the sprite in pixels.
    * @param {number} depth The depth of rendering of the sprite.
    * @param {number} defaultVelocity The default velocity for the living sprite.
    * @param enemyAngleOperator The enemy angle operator in order to rotate the sprite arround.
    * 
    */
    constructor(scene, enemyOriginInfo, enemyImgStr, size, depth, defaultVelocity, chaseDistance, allowChase){
        super(scene, enemyOriginInfo, enemyImgStr, size, depth, defaultVelocity);

        this.setRotation = this.originInfo.ang;

        this.setXcomponent();
        this.setYcomponent();

        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.keySpace = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        this.chaseDistance = chaseDistance;
        this.allowChase = allowChase;
        
        // this.enemyRaycaster = Raycaster()
    }

    /**
     * This method allows the enemy to have the basic controls of movement according to the stablished parameters.
     * The movemente only works through the key arrows.
     */
    move(){
        this.setVelocity = 0;
        

    }
}