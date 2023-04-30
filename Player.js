/**
 * This class extends to @param Living class, due the "ilving" sprites could be
 * players or enemies. Furthermore, this class implements all the movemente controlers for the player/s.
 */

class Player extends Living{
    /**
    * The constructor ofLiving Class.
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

        this.currentVelocityX = 0;
        this.currentVelocityY = 0;
    }

    set setPositionX(value){
        this.sprite.x = value;
    }

    get getPositionX(){
        return this.sprite.x;
    }

    set setPositionY(value){
        this.sprite.y = value;
    }

    get getPositionY(){
        return this.sprite.y;
    }

    set setRotation(value){
        this.sprite.rotation = value;
    }

    get getRotation(){
        return this.sprite.rotation;
    }

    setVelocityX(value){
        this.sprite.body.setVelocityX(value);
    }

    get getVelocityX(){
        return this.sprite.body.velocity.x;
    }

    setVelocityY(value){
        this.sprite.body.setVelocityY(value);
    }

    get getVelocityY(){
        return this.sprite.body.velocity.y;
    }

    setVelocity(value){
        this.setVelocityX(value);
        this.setVelocityY(value);
    }

    setXcomponent(){
        this.Xcomponent = Math.cos(this.sprite.rotation + Math.PI/2) * -this.defaultVelocity;
    }

    get getYcomponent(){
        return this.Ycomponent;
    }

    setYcomponent(){
        this.Ycomponent = Math.sin(this.sprite.rotation + Math.PI/2) * -this.defaultVelocity;
    }

    get getXcomponent(){
        return this.Xcomponent;
    }

    move(){
        this.setVelocity(0);
        
        // console.log(this.getPositionX);
        // console.log(this.getPositionY);

        if(this.cursors.up.isDown ^ this.cursors.down.isDown){

            this.currentVelocityX = this.getXcomponent;
            this.currentVelocityY = this.getYcomponent;
    
            if (this.cursors.up.isDown){
                //Here we use the velocity calculated, and we change its sign accordingly to the direction of movement.
                this.setVelocityX(this.getXcomponent);
                this.setVelocityY(this.getYcomponent);

                // for(let ray of rays){
                //     ray.body.setVelocityX(velocityX);
                //     ray.body.setVelocityY(velocityY);
                // }
                
            }else if(this.cursors.down.isDown){    
                this.setVelocityX(-this.getXcomponent);
                this.setVelocityY(-this.getYcomponent);
                
                // for(let ray of rays){
                //     ray.body.setVelocityX(-velocityX);
                //     ray.body.setVelocityY(-velocityY);
                // }
            }
        }
    
        if(this.cursors.left.isDown ^ this.cursors.right.isDown){
            console.log("Rotation ", this.getRotation);

            //Here we use trigonometrics to calculate the x and y component of the velocity.
            this.setXcomponent();
            this.setYcomponent();    
    
            if (this.cursors.left.isDown){
                this.setRotation =  this.getRotation - this.playerAngleOperator;
    
                //If the angle ends being less than zero then we add 2pi to make it rotate one lap.
                if(this.setRotation < 0){
                    this.setRotation = this.getRotation + 2*Math.PI;
                }
            }else if(this.cursors.right.isDown){
                this.setRotation = this.getRotation +this.playerAngleOperator;
    
                //If the angle ends being more than 2Pi then we substract 2pi to make it rotate one lap.
                if(this.setRotation > 2*Math.PI){
                    this.setRotation = this.getRotation - 2*Math.PI;
                }
            }
        }

        if(this.keySpace.isDown){
            
        }
    }
}