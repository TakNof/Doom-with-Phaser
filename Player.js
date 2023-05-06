/**
 * This class extends to Living class, due the "living" sprites could be
 * players or enemies. Furthermore, this class implements all the movement controlers for the player/s.
 */

class Player extends Living{
    /**
    * The constructor of Player Class.
    * @constructor
    * @param {Scene} scene The current scene of the game to place the sprite.
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
    }
    
    setGraphicator(canvasSize){
        this.playerGraphicator = new Graphicator(this.scene, this.size, canvasSize, this.raysAmount);
    }

    get getGraphicator(){
        return this.playerGraphicator;
    }

    setCamera(canvasSize, fov, enemies2D){
        this.playerCamera = new Camera(this.scene, canvasSize, fov, this, enemies2D);
    }

    get getCamera(){
        return this.playerCamera;
    }

    /**
     * This method allows the player to have the basic controls of movement according to the stablished parameters.
     * The movement only works through the key arrows.
     */
    move(){
        this.setVelocity = 0;
        this.spriteRays.setVelocity(0);

        this.setRayData();

        this.spriteRays.redrawRay2D(this.getPosition, this.rayData);
        this.raycaster.setSpritePosition = this.getPosition;


        if(this.cursors.up.isDown ^ this.cursors.down.isDown){
            
            if (this.cursors.up.isDown){
                //Here we use the velocity calculated, and we change its sign accordingly to the direction of movement.
                this.setVelocityX = this.getXcomponent;
                this.setVelocityY = this.getYcomponent;  

            }else if(this.cursors.down.isDown){    
                this.setVelocityX = -this.getXcomponent;
                this.setVelocityY = -this.getYcomponent;
            }

            for(let ray of this.spriteRays.rays){
                ray.body.setVelocityX(this.getVelocityX);
                ray.body.setVelocityY(this.getVelocityY);
            }
        }
    
        if(this.cursors.left.isDown ^ this.cursors.right.isDown){

            //Here we use trigonometrics to calculate the x and y component of the velocity.
            this.setXcomponent();
            this.setYcomponent();    
    
            if (this.cursors.left.isDown){
                this.setRotation =  this.adjustAngleValue(this.getRotation - this.playerAngleOperator);
                
            }else if(this.cursors.right.isDown){
                this.setRotation = this.adjustAngleValue(this.getRotation + this.playerAngleOperator);
            }
        }

        this.raycaster.setRayAngle = this.getRotation + this.spriteRays.getInitialRayAngleOffset;
        this.spriteRays.setInitialRayAngleOffset = this.angleOffset;
    }
}