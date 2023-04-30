class Player extends Living{
    constructor(scene, playerOriginInfo, playerVelocity, playerImgStr, size, playerAngleOperator){
        super(scene, playerOriginInfo, playerVelocity, playerImgStr, size);

        this.playerAngleOperator = playerAngleOperator;

        this.Xcomponent = Math.cos(this.originInfo.ang + Math.PI/2) * -this.velocity;
        this.Ycomponent = Math.sin(this.originInfo.ang + Math.PI/2) * -this.velocity;

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
        this.Xcomponent = Math.cos(this.originInfo.ang + Math.PI/2) * -this.playerVelocity;
    }

    get getYcomponent(){
        return this.Ycomponent;
    }

    setYcomponent(){
        this.Ycomponent = Math.sin(this.originInfo.ang + Math.PI/2) * -this.playerVelocity;
    }

    get getXcomponent(){
        return this.Xcomponent;
    }

    move(){
        this.setVelocity(0);
        this.setRotation = this.originInfo.ang;

        // console.log(this.getPositionX);
        // console.log(this.getPositionY);

        if(this.cursors.up.isDown ^ this.cursors.down.isDown){
            console.log("Rotation ", this.getRotation);
            console.log("VelocityX ", this.getVelocityX, "VelocityY ", this.getVelocityY);

            this.currentVelocityX = this.getVelocityX + this.getXcomponent;
            this.currentVelocityY = this.getVelocityY + this.getYcomponent;
    
            if (this.cursors.up.isDown){
                //Here we use the velocity calculated, and we change its sign accordingly to the direction of movement.
                this.setVelocityX(this.currentVelocityX);
                this.setVelocityY(this.currentVelocityY);

                // for(let ray of rays){
                //     ray.body.setVelocityX(velocityX);
                //     ray.body.setVelocityY(velocityY);
                // }
                
            }else if(this.cursors.down.isDown){    
                this.setVelocityX(-this.currentVelocityX);
                this.setVelocityY(-this.currentVelocityY);
                
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
                this.originInfo.ang -= this.playerAngleOperator;
    
                //If the angle ends being less than zero then we add 2pi to make it rotate one lap.
                if(this.originInfo.ang < 0){
                    this.originInfo.ang += 2*Math.PI;
                }
            }else if(this.cursors.right.isDown){
                this.originInfo.ang += this.playerAngleOperator;
    
                //If the angle ends being more than 2Pi then we substract 2pi to make it rotate one lap.
                if(this.originInfo.ang > 2*Math.PI){
                    this.originInfo.ang -= 2*Math.PI;
                }
            }
        }

        if(this.keySpace.isDown){
            
        }
    }
}