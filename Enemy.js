/**
 * This class extends to Living class, due the "living" sprites could be
 * players or enemies. Furthermore, this class implements all the movement controlers for the enemy/s.
 */

class Enemy extends Living{
    /**
    * The constructor of Enemy Class.
    * @constructor
    * @param {Scene} scene The current scene of the game to place the sprite.
    * @param {Object} enemyOriginInfo  A list with the initial positioning information for the sprite.
    * @param {string} enemyImgStr An str of the image name given in the preload method of the main class.
    * @param {number} size The size of the sprite in pixels.
    * @param {number} depth The depth of rendering of the sprite.
    * @param {number} defaultVelocity The default velocity for the living sprite.
    */
    constructor(scene, enemyOriginInfo, enemyImgStr, size, depth, defaultVelocity, chaseDistance, allowChase){
        super(scene, enemyOriginInfo, enemyImgStr, size, depth, defaultVelocity/2);

        this.setRotation = this.originInfo.ang;
        this.setAngle = this.originInfo.ang;

        this.setXcomponent();
        this.setYcomponent();

        this.setProjectiles2D();
        this.setProjectiles3D();

        this.chaseDistance = chaseDistance;
        this.allowChase = allowChase;

        this.inSight = false;
    }

    /**
     * Sets the distance between the player and the enemy using the player's position.
     * @param {Object} player 
     */
    set setDistanceToPlayer(player){
        this.distanceToPlayer = this.hypoCalc(this.getPositionX, player.x, this.getPositionY, player.y);
    }

    /**
     * Gets the distance between the player and the enemy.
     * @return {number}
     */
    get getDistanceToPlayer(){
        return this.distanceToPlayer;
    }

    /**
     * Sets the sprite of the enemy which will be its representation in 3D camera.
     * @param {number} positionX 
     * @param {number} positionY 
     * @param {String} enemyImgStr 
     * @param {boolean} visible 
     */
    setEnemy3D(positionX, positionY, enemyImgStr, visible = false){
        this.sprite3D = new Sprite(this.scene, {x: positionX, y: positionY}, enemyImgStr, this.getSize, 3)
        this.sprite3D.setVisible = visible;
        this.setAttackSoundEffect();
    }


    set setNewEnemy3D(newEnemy3D){
        this.sprite3D.sprite = newEnemy3D;
    }

    /**
     * Gets the sprite of the enemy which will be its representation in 3D camera.
     */
    get getEnemy3D(){
        return this.sprite3D;
    }

    /**
     * Sets the group of projectiles of the enemy.
     */
    setProjectiles2D(){
        this.enemyProjectiles = this.scene.physics.add.group();
    }

    /**
     * Gets the enemy projectiles.
     */
    get getProjectiles2D(){
        return this.enemyProjectiles;
    }

    /**
     * Sets the projectile 3D of the enemy.
     */
    setProjectiles3D(){
        this.enemyProjectiles3D = this.scene.physics.add.group();
    }

    /**
     * Gets the projectile 3D of the enemy.
     * @returns {Projectile}
     */
    get getProjectiles3D(){
        return this.enemyProjectiles3D;
    }

    /**
     * Sets the sound effect of the enemy.
     */
    setAttackSoundEffect(){
        this.attackSoundEffectName = this.scene.sound.add(this.getEnemy3D.getSpriteImgStr + "_attack_sound");
    }

    /**
     * Plays the sound effect of the enemy.
     */
    playAttackSoundEffect(){
        this.attackSoundEffectName.play();
    }

    /**
     * Sets the panning effect to the attack sound effect of the enemy.
     * @param {Number} canvasWidth
     * @param {Number} playerAngle
     */
    setAttackSoundEffectPanning(canvasWidth, playerAngle){
        let anglePlayerToEnemy = this.adjustAngleValue(this.getAngleToElement + Math.PI);

        let angleAdjustedFromPlayer = this.adjustAngleValue(anglePlayerToEnemy - playerAngle);
        
        let x = Math.cos(angleAdjustedFromPlayer) * this.distanceToPlayer;

        if(x == 0){
            x = canvasWidth/2;
        }else{
            x += canvasWidth/2;
        }

        this.attackSoundEffectName.setPan(Phaser.Math.Linear(-1, 1, x / canvasWidth));
    }

    /**
     * This method allows the enemy to have the basic controls of movement according to the stablished parameters.
     */
    move(playerPosition){
        this.setVelocity = 0;
        this.setRayData();

        if(this.getDebug === true){
            this.spriteRays.setVelocity = 0;
            this.spriteRays.redrawRay2D(this.getPosition, this.getRayData);
        }   

        this.raycaster.setSpritePosition = this.getPosition;

        this.setAngleToElement = playerPosition;
        this.getRaycaster.setRayAngle = this.getAngleToElement;
        this.setDistanceToPlayer = playerPosition;

        //We want the enemy to follow us if we are in range of sight and if the distance with the player is less than the distance
        //with the wall.
        if (this.allowChase && this.getDistanceToPlayer <= this.chaseDistance &&  this.getDistanceToPlayer > 200 && (this.getDistanceToPlayer <this.getRayData.distance[0] || this.getRayData.distance[0] == undefined)) {           
            this.setXcomponent();
            this.setYcomponent();

            this.setVelocityX = this.getXcomponent;
            this.setVelocityY = this.getYcomponent;

            //We want the enemy to react when we are 

            if(this.getDebug === true){
                for(let ray of this.spriteRays.rays){
                    ray.body.setVelocityX(this.getVelocityX);
                    ray.body.setVelocityY(this.getVelocityY);
                }
            }
        }

        if(this.getDistanceToPlayer <= this.chaseDistance && this.getDistanceToPlayer <this.getRayData.distance[0] || this.getRayData.distance[0] == undefined){
            this.inSight = true;
        }else{
            this.inSight = false;
        }
        
        this.setAngle = this.getAngleToElement + this.angleOffset
        this.setRotation = this.getAngle;
    }

    shoot(properties, randNumber, playerAngle){
        this.setAttackSoundEffectPanning(1024, playerAngle);
        if(this.inSight){
            let time = this.scene.time.now;
            if (time - this.lastShotTimer > properties.delay + randNumber*100) {
                let projectile = new Projectile(this.scene, this.getPosition, "small_energy_bomb", 32, 80, 100);
                this.getProjectiles2D.add(projectile.getSprite);

                projectile.setProjectile3D(canvasSize.width/2, canvasSize.width/2, "energy_bomb");            
                this.getProjectiles3D.add(projectile.getProjectile3D.getSprite);

                projectile.shootProjectile(this);
                this.playAttackSoundEffect();

                this.lastShotTimer = time;
            }
        }
    }
}