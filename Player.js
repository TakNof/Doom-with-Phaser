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
        this.setAngle = this.originInfo.ang;

        this.setXcomponent();
        this.setYcomponent();

        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.keySpace = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    
    /**
     * Sets the graphicator object of the player.
     * @param {String} canvasSize 
     */
    setGraphicator(canvasSize){
        this.playerGraphicator = new Graphicator(this.scene, this.size, canvasSize, this.raysAmount);
    }

    /**
     * Gets the graphicator object of the player.
     * @returns {Graphicator}
     */
    get getGraphicator(){
        return this.playerGraphicator;
    }

    /**
     * Sets the camera of the player.
     * @param {String} canvasSize 
     * @param {number} fov in radians.
     * @param {Array<Enemy>} enemies2D 
     */
    setCamera(canvasSize, fov, enemies2D){
        this.playerCamera = new Camera(this.scene, canvasSize, fov, this, enemies2D);
    }

    /**
     * Gets the camera of the player.
     * @returns {Camera}
     */
    get getCamera(){
        return this.playerCamera;
    }

    /**
     * This method allows the player to have the basic controls of movement according to the stablished parameters.
     * The movement only works through the key arrows.
     */
    move(){
        this.setVelocity = 0;
        this.setRayData();

        if(this.getDebug === true){
            this.spriteRays.setVelocity = 0;
            this.spriteRays.redrawRay2D(this.getPosition, this.getRayData);
        }     
        
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

            if(this.getDebug === true){
                for(let ray of this.spriteRays.rays){
                    ray.body.setVelocityX(this.getVelocityX);
                    ray.body.setVelocityY(this.getVelocityY);
                }
            }
        }
    
        if(this.cursors.left.isDown ^ this.cursors.right.isDown){

            //Here we use trigonometrics to calculate the x and y component of the velocity.
            this.setXcomponent();
            this.setYcomponent();    
    
            if (this.cursors.left.isDown){
                this.setAngle =  this.adjustAngleValue(this.getAngle - this.playerAngleOperator);
                this.setRotation = this.getAngle;

            }else if(this.cursors.right.isDown){
                this.setAngle = this.adjustAngleValue(this.getAngle + this.playerAngleOperator);
                this.setRotation = this.getAngle;
            }
        }

        if(this.getDebug === true){
            this.spriteRays.setInitialRayAngleOffset = this.getAngleOffset;
        }
        
        this.raycaster.setRayAngle = this.getAngle + this.getAngleOffset;
    }
}