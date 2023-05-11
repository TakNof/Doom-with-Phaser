/**
 * This class extends to Living class, due the "living" sprites could be
 * players or enemies. Furthermore, this class implements all the movement controlers for the player/s.
 */

class Player extends Living{
    /**
    * The constructor of Player Class.
    * @constructor
    * @param {Scene} scene The current scene of the game to place the sprite.
    * @param {Object} playerOriginInfo  A list with the initial positioning information for the sprite.
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

        this.setRotation = 0;
        this.setAngle = 0;

        this.setXcomponent();
        this.setYcomponent();

        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.keySpace = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keySpace.emitOnRepeat = true;

        this.setMaxHealth = 100;
        this.setHealth = this.getMaxHealth;
    }
    
    /**
     * Sets the graphicator object of the player.
     * @param {String} canvasSize 
     */
    set setGraphicator(canvasSize){
        this.playerGraphicator = new Graphicator(this.scene, canvasSize, this.size, this.raysAmount);
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
     * Sets the HUD object of the player.
     * @param {Object} canvasSize
     */
    setHUD(canvasSize, enemies = undefined){
        this.playerHUD = new HUD(this.scene, canvasSize, enemies);
        this.playerHUD.setHealthValue = player.getHealth;
    }

    /**
     * Gets the HUD object of the player.
     * @returns {HUD}
     */
    get getHUD(){
        return this.playerHUD;
    }

    /**
     * Gets the camera of the player.
     * @returns {Camera}
     */
    get getCamera(){
        return this.playerCamera;
    }

    /**
     * Sets the list of weapons of the player.
     * @param {Object} canvasSize
     * @param {Array<Object>} properties
     */
    setWeapons(canvasSize, properties){
        let length;

        if(typeof(properties) == Array){
            length = properties.length;
        }else{
            length = 1;
        }

        this.playerWeapons = Array(length);

        for(let i = 0; i < length; i++){
            this.playerWeapons[i] = new Weapon(
                this.scene,
                {x: canvasSize.width/2, y: canvasSize.height*1.8},
                properties[i].name,
                512,
                80,
                properties[i].bulletProperties,
                properties[i].distanceLimits,
            );
        }

        for(let i = 1; i < length; i++){
            this.playerWeapons[i].setVisible = false;
        }
        this.playerCurrentWeapon = this.playerWeapons[0];
    }

    /**
     * Gets the list of weapons of the player.
     * @returns {Array<Weapon>}
     */
    get getWeapons(){
        return this.playerWeapons;
    }

    /**
     * Sets the current weapon of the player.
     * @param {Number} index
     */
    set setPlayerCurrentWeapon(index){
        this.playerCurrentWeapon.setVisible = false;

        this.playerCurrentWeapon = this.playerWeapons[index].setVisible = true;
    }

    /**
     * Gets the current weapon of the player.
     * @return {Weapon}
     */
    get getPlayerCurrentWeapon(){
        return this.playerCurrentWeapon;
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

    shoot(){
        if(this.keySpace.isDown){
            let time = this.scene.time.now;
            if (time - this.lastShotTimer > this.playerCurrentWeapon.getDelayBetweenShots) {
                this.getPlayerCurrentWeapon.getSprite.play(this.getPlayerCurrentWeapon.getAnimationName);
                let projectile = new Projectile(this.scene, this.getPosition, "bullet", 32, 80, this.playerCurrentWeapon.getBulletVelocity);
                this.getPlayerCurrentWeapon.getProjectiles.add(projectile.getSprite);
                projectile.shootProjectile(this);
                this.getPlayerCurrentWeapon.playSoundEffect();

                this.lastShotTimer = time;
            }
        }
    }


}