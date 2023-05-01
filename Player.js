/**
 * This class extends to @param Living class, due the "ilving" sprites could be
 * players or enemies. Furthermore, this class implements all the movemente controlers for the player/s.
 */

class Player extends Living{
    /**
    * The constructor of Player Class.
    * @param scene The current scene of the game to place the sprite.
    * @param originInfo  A list with the intial positioning information for the sprite.
    * @param spriteImgStr An str of the image name given in the preload method of the main class.
    * @param size The size of the sprite in pixels.
    * @param defaultVelocity The default velocity for the sprite.
    * @param playerAngleOperator The player angle operator in order to rotate the sprite arround.
    * 
    */
    constructor(scene, playerOriginInfo, playerImgStr, size, defaultVelocity, playerAngleOperator){
        super(scene, playerOriginInfo, playerImgStr, size, defaultVelocity);

        this.playerAngleOperator = playerAngleOperator;

        this.setRotation = this.originInfo.ang;

        this.setXcomponent();
        this.setYcomponent();

        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.keySpace = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // this.playerRaycaster = Raycaster()
    }

    /**
     * Sets the velocity in the X component of the player.
     * @param {number} value
     */
    set setVelocityX(value){
        this.sprite.body.setVelocityX(value);
    }

    /**
     * Gets the velocity in the X component of the player.
     * @returns {number}
     */
    get getVelocityX(){
        return this.sprite.body.velocity.x;
    }

    /**
     * Sets the velocity in the Y component of the player.
     * @param {number} value
     */
    set setVelocityY(value){
        this.sprite.body.setVelocityY(value);
    }

    /**
     * Gets the velocity in the Y component of the player.
     * @returns {number}
     */
    get getVelocityY(){
        return this.sprite.body.velocity.y;
    }

    /**
     * Sets the velocity in both axis of the player.
     * @param {number} value
     */
    set setVelocity(value){
        this.setVelocityX = value;
        this.setVelocityY = value;
    }

    /**
     * Sets the X component of the velocity according to the rotation stablished of the player.
     */
    setXcomponent(){
        this.Xcomponent = Math.cos(this.sprite.rotation + Math.PI/2) * -this.defaultVelocity;
    }

    /**
     * Gets the X component of the velocity according to the rotation stablished of the player.
     * @returns {number}
     */
    get getXcomponent(){
        return this.Xcomponent;
    }

    /**
     * Sets the Y component of the velocity according to the rotation stablished of the player.
     */
    setYcomponent(){
        this.Ycomponent = Math.sin(this.sprite.rotation + Math.PI/2) * -this.defaultVelocity;
    }

    /**
     * Gets the Y component of the velocity according to the rotation stablished of the player.
     * @returns {number}
     */
    get getYcomponent(){
        return this.Ycomponent;
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