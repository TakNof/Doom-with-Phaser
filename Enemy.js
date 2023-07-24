/**
 * This class extends to Living class, due the "living" sprites could be
 * players or enemies. Furthermore, this class implements all the movement controlers for the enemy/s.
 */

class Enemy extends Living{
    /**
    * The constructor of Enemy Class.
    * @constructor
    * @param {Phaser.Scene} scene2D The scene to place the 2D sprites in the game.
    * @param {Phaser.Scene} scene3D The scene to place the 3D sprites in the game.
    * @param {{x: Number, y: Number, ang: Number}} originInfo A literal Object with the initial positioning information for the sprite.
    * @param {String} spriteImgStr An str of the image name given in the preload method of the main class.
    * @param {Number} depth The depth of rendering of the sprite.
    * @param {Number} size The size of the sprite in pixels.
    * @param {Number} defaultVelocity The default velocity for the living sprite.
    * @param {Number} chaseDistance The distance where the player can be detect the player.
    * @param {Boolean} allowChase Whether the enemy is allowed to chase the player or not. 
    */
    constructor(scene, scene3D, enemyOriginInfo, enemyImgStr, depth, size, defaultVelocity, chaseDistance, allowChase){
        super(scene, enemyOriginInfo, enemyImgStr, depth, size, defaultVelocity);

        this.scene3D = scene3D;

        this.setEnemy3D(canvasSize.width/2, canvasSize.height/2, enemyImgStr.replace("small_", ""));

        this.setXcomponent();
        this.setYcomponent();

        this.setProjectiles();

        this.setChaseDistance(chaseDistance);
        this.allowChase = allowChase;

        this.inSight = false;

        this.creationTime = this.getScene().time.now;
        
        let animationsToSet = [
            {
                name: "attack",
                animationParams:{
                    end: 9,
                    framerate: 15,
                }
            },
            {
                name: "hurt",
                animationParams:{
                    end: 7,
                    framerate: 15
                }
            }
        ];   

        this.setAnimations(animationsToSet);

        this.setSpriteSounds(enemyImgStr.replace("small_", ""), ["hurt", "death", "attack"]);
    }

    /**
     * Sets the chase distance of the enemy
     * @param {Number} chaseDistance
     */
    setChaseDistance(chaseDistance){
        this.chaseDistance = chaseDistance;
    }

    /**
     * Gets the chase distance of the enemy.
     * @return {Number} chaseDistance
     */
    getChaseDistance(){
        return this.chaseDistance
    }

    /**
     * Sets the distance between the player and the enemy using the player's position.
     * @param {Object} playerPosition 
     */
    setDistanceToPlayer(playerPosition){
        this.distanceToPlayer = hypoCalc(this.getPositionX(), playerPosition.x, this.getPositionY(), playerPosition.y);
    }

    /**
     * Gets the distance between the player and the enemy.
     * @return {number}
     */
    getDistanceToPlayer(){
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
        this.enemy3D = new Sprite(this.getScene3D(), {x: positionX, y: positionY, angleOffset: 0}, enemyImgStr, 3);
        this.enemy3D.setVisible(visible);
    }


    setNewEnemy3D(newEnemy3D){
        this.enemy3D = newEnemy3D;
    }

    /**
     * Gets the sprite of the enemy which will be its representation in 3D camera.
     */
    getEnemy3D(){
        return this.enemy3D;
    }

    /**
     * Sets the group of projectiles of the enemy.
     */
    setProjectiles(){
        let amount = 5;
        this.enemyProjectiles = new ProjectileGroup(this.getScene(), "small_energy_bomb", amount);
        this.enemyProjectiles3D = new ProjectileGroup(this.getScene(), "energy_bomb", amount);
    }

    /**
     * Gets the enemy projectiles.
     */
    getProjectiles2D(){
        return this.enemyProjectiles;
    }

    /**
     * Sets the projectile 3D of the enemy.
     */
    setProjectiles3D(){
        this.enemyProjectiles3D = this.getScene.physics.add.group();
    }

    /**
     * Gets the projectile 3D of the enemy.
     * @returns {Projectile}
     */
    getProjectiles3D(){
        return this.enemyProjectiles3D;
    }

    /**
     * Sets the projectile properties of the enemy.
     * @param {{damage: Number, velocity: Number, delay: Number, critical: Number}} bulletProperties
     */
    setBulletProperties(bulletProperties){
        this.bulletProperties = bulletProperties;
    }

    /**
     * Gets the projectile properties of the enemy.
     * @return {{damage: Number, velocity: Number, delay: Number, critical: Number}}
     */
    getBulletProperties(){
        return this.bulletProperties;
    }

    /**
     * Sets the projectile effective distances of the enemy.
     * @param {{min: Number, max: Number}} distanceLimits
     */
    setDistanceLimits(distanceLimits){
        this.distanceLimits = distanceLimits;
    }

    /**
     * Gets the projectile effective distances of the enemy.
     * @return {{min: Number, max: Number}}
     */
    getDistanceLimits(){
        return this.distanceLimits;
    }

    /**
     * Checks if the living sprite have been impacted by a projectile or not.
     * @param {Living} shooter The living object which has shot THIS living object.
     */
    evalProjectileCollision(shooter){
        let thisObject = this;

        this.getScene().physics.collide(this, shooter.getCurrentWeapon().getProjectiles(),
            function(sprite, projectile){
                thisObject.__checkDamage(
                    shooter,
                    projectile,
                    shooter.getCurrentWeapon().getBulletProperties(),
                    shooter.getCurrentWeapon().getDistanceLimits(),
                    thisObject.getDistanceToPlayer()
                );
            }
        );
    }

    /**
     * This method is called when a projectile has collided with a living sprite,
     * here he health and the state of the living sprite is determined by the
     * damage and limit distances of the projected projectiles.
     * @param {Living} shooter
     * @param {Projectile} projectile 
     * @param {Number} damage 
     * @param {Object} distanceLimits 
     * @param {Number} currentDistance 
     */
    __checkDamage(shooter, projectile, bulletProperties, distanceLimits, currentDistance){
        projectile.body.reset(-100, -100); 

        projectile.setActive(false);
        projectile.setVisible(false);

        let damage = bulletProperties.damage;
        let critical = false;

        if(currentDistance > distanceLimits.min && currentDistance < distanceLimits.max){
            damage *= 220/currentDistance;
            console.log(`${this} Normal damage ${damage}`);
        }else if(currentDistance >= distanceLimits.max){
            damage *= 1/distanceLimits.max;
            console.log(`${this} Minimal damage ${damage}`);
        }else if(currentDistance <= distanceLimits.min){
            damage *= bulletProperties.critical * 220/currentDistance;
            console.log(`${this} Critical damage ${damage}`);
            critical = true;
        }

        shooter.addDamageDealed(damage);

        if(this.getHealth() - damage <= 0){
            this.setHealth(0);
            this.setAbleToShoot(false);

            this.getSpriteSounds("death").playSound();

            if(critical){
                shooter.heal(bulletProperties.damage*0.08);
            }else{
                shooter.heal(damage*0.08);
            }

        }else{
            this.setHealth(this.getHealth() - damage);
            this.getSpriteSounds("hurt").playSound();
            this.getEnemy3D().play(this.getAnimations("hurt").getAnimationName());
        }
    }

    waitToDestroy(){
        if(this.getProjectiles2D().getChildren().length != 5){
            this.setVisible(false);
            this.getEnemy3D().setVisible(false);
            this.body.enable = false;
            
        }else{
            this.getEnemy3D().destroy();
            this.isAlive = false;
            this.destroy();
        }
    }

    /**
     * Sets the animations of the enemy.
     * @param {Array<String>} animationsArray 
     */
    setAnimations(animationsArray){
        this.animations = {};

        for(let animation of animationsArray){
            this.animations[animation.name] = new SpriteAnimation(this.getScene3D(), `${this.getEnemy3D().getSpriteImgStr()}_${animation.name}`);
            this.animations[animation.name].setAnimationFrames(animation.animationParams.end, animation.animationParams.framerate, animation.animationParams.repeat);
        }

    }

    getAnimations(element){
        return this.animations[element];
    }

    /**
     * This method allows the enemy to have the basic controls of movement according to the stablished parameters.
     */
    move(playerPosition){
        this.setVelocity(0);
        this.setRayData();

        if(this.getDebug() === true){
            this.getSpriteRays().setVelocity(0);
            this.getSpriteRays().redrawRay2D(this.getPosition(), this.getRayData());
        }   

        this.getRaycaster().setSpritePosition = this.getPosition();
        
        this.getRaycaster().setRayAngle = adjustAngleValue(this.angleToElement(playerPosition));
        this.setDistanceToPlayer(playerPosition);

        //We want the enemy to follow us if we are in range of sight and if the distance with the player is less than the distance
        //with the wall.
        if (this.allowChase && this.getDistanceToPlayer() <= this.chaseDistance &&  this.getDistanceToPlayer() > 200 && (this.getDistanceToPlayer() <this.getRayData().distance[0] || this.getRayData().distance[0] == undefined)) {           
            this.setXcomponent(this.getOriginInfo().angleOffset);
            this.setYcomponent(this.getOriginInfo().angleOffset);

            this.setVelocityX(this.getXcomponent());
            this.setVelocityY(this.getYcomponent());

            if(this.getDebug() === true){
                for(let ray of this.getSpriteRays().rays){
                    ray.body.setVelocityX(this.getVelocityX());
                    ray.body.setVelocityY(this.getVelocityY());
                }
            }
        }

        if(this.getDistanceToPlayer() <= this.getChaseDistance() && this.getDistanceToPlayer() <this.getRayData().distance[0] || this.getRayData().distance[0] == undefined){
            this.inSight = true;
            this.setRotation(adjustAngleValue(this.angleToElement(playerPosition) - this.getOriginInfo().angleOffset));
        }else{
            this.inSight = false;
        }
    }

    shoot(properties, randNumber, player){
        let projectile = this.getProjectiles2D().getFirstDead();

        if(this.inSight && this.getAbleToShoot() && projectile){
            this.getSpriteSounds("attack").setSoundPanning(this.getDistanceToPlayer(), player.angleToElement(this.getPosition()), player.getAngleRadians());
            let time = this.getScene().time.now - this.creationTime;

            if(time - this.lastShotTimer > properties.delay + randNumber*1000){
                this.getEnemy3D().play(this.getAnimations("attack").getAnimationName);
                this.lastShotTimer = time;
                setTimeout(() =>{
                    projectile.shoot(this, properties.velocity);
                    this.getSpriteSounds("attack").playSound();
                }, 300)
            }
        }
    }
}