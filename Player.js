/**
 * This class extends to Living class, due the "living" sprites could be
 * players or enemies. Furthermore, this class implements all the movement controlers for the player/s.
 */

class Player extends Living{
    /**
    * The constructor of Player Class.
    * @param {scene} scene The current scene of the game to place the sprite.
    * @param {number[]} playerOriginInfo  A list with the initial positioning information for the sprite.
    * @param {string} playerImgStr An str of the image name given in the preload method of the main class.
    * @param {number} size The size of the sprite in pixels.
    * @param {number} depth The depth of rendering of the sprite.
    * @param {number} defaultVelocity The default velocity for the living sprite.
    * @param {number} playerAngleOperator The player angle operator in order to rotate the sprite arround.
    * 
    */
    constructor(scene, playerOriginInfo, playerImgStr, size, depth, defaultVelocity, playerAngleOperator){
        super(scene, playerOriginInfo, playerImgStr, size, depth, defaultVelocity);

        this.playerAngleOperator = playerAngleOperator;

        this.setRotation = this.originInfo.ang;

        this.setXcomponent();
        this.setYcomponent();

        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.keySpace = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.playerRaycaster = new Raycaster()
    }

    /**
     * This method allows the player to have the basic controls of movement according to the stablished parameters.
     * The movemente only works through the key arrows.
     */
    move(){
        this.setVelocity = 0;
        
        if(this.cursors.up.isDown ^ this.cursors.down.isDown){
    
            if (this.cursors.up.isDown){
                //Here we use the velocity calculated, and we change its sign accordingly to the direction of movement.
                this.setVelocityX = this.getXcomponent;
                this.setVelocityY = this.getYcomponent;

                // for(let ray of rays){
                //     ray.body.setVelocityX(velocityX);
                //     ray.body.setVelocityY(velocityY);
                // }
                
            }else if(this.cursors.down.isDown){    
                this.setVelocityX = -this.getXcomponent;
                this.setVelocityY = -this.getYcomponent;
                
                // for(let ray of rays){
                //     ray.body.setVelocityX(-velocityX);
                //     ray.body.setVelocityY(-velocityY);
                // }
            }
        }
    
        if(this.cursors.left.isDown ^ this.cursors.right.isDown){

            //Here we use trigonometrics to calculate the x and y component of the velocity.
            this.setXcomponent();
            this.setYcomponent();    
    
            if (this.cursors.left.isDown){
                this.setRotation =  this.getRotation - this.playerAngleOperator;
    
                this.adjustAngleValue();
            }else if(this.cursors.right.isDown){
                this.setRotation = this.getRotation + this.playerAngleOperator;
    
                this.adjustAngleValue();
            }
        }
    }
}