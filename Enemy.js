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
    */
    constructor(scene, scene3D, enemyOriginInfo, spriteImgStr, depth, size, defaultVelocity, chaseDistance){
        super(scene, enemyOriginInfo, spriteImgStr, depth, size, defaultVelocity);

        this.scene3D = scene3D;

        this.setEnemy3D(this.getSpriteImgStr().replace("small_", ""));

        this.setXcomponent();
        this.setYcomponent();

        this.setProjectiles();

        this.setChaseDistance(chaseDistance);

        this.inSight = false;

        this.creationTime = this.getScene().time.now;
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
     * @param {String} spriteImgStr 
     * @param {boolean} visible 
     */
    setEnemy3D(spriteImgStr, visible = false){
        this.enemy3D = new Sprite(this.getScene3D(), {x: canvasSize.width/2, y: canvasSize.height/2, angleOffset: 0}, spriteImgStr, 3);
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
        this.enemyProjectiles3D = new ProjectileGroup(this.getScene3D(), "energy_bomb", amount);
    }

    /**
     * Gets the enemy projectiles.
     */
    getProjectiles2D(){
        return this.enemyProjectiles;
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
            // console.log(`${this} Normal damage ${damage}`);
        }else if(currentDistance >= distanceLimits.max){
            damage *= 1/distanceLimits.max;
            // console.log(`${this} Minimal damage ${damage}`);
        }else if(currentDistance <= distanceLimits.min){
            damage *= bulletProperties.critical * 220/currentDistance
            console.log(`${this} Critical damage ${damage}, Current Distance: ${currentDistance}`);
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
        if(this.getProjectiles2D().getFirstAlive()){
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
        if(this.active){
            this.setVelocity(0);
            this.setRayData();
    
            if(this.getDebug() === true){
                this.getSpriteRays().setVelocity(0);
                this.getSpriteRays().redrawRay2D(this.getPosition(), this.getRayData());
            }   
    
            this.getRaycaster().setSpritePosition(this.getPosition());
            
            this.getRaycaster().setRayAngle(adjustAngleValue(this.angleToElement(playerPosition)));
            this.setDistanceToPlayer(playerPosition);
    
            //We want the enemy to follow us if we are in range of sight and if the distance with the player is less than the distance
            //with the wall.
            if (this.getDistanceToPlayer() <= this.chaseDistance && this.getDistanceToPlayer() > 200 && (this.getDistanceToPlayer() < this.getRayData().distance[0] || this.getRayData().distance[0] == undefined)) {           
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
    
            if(this.getDistanceToPlayer() <= this.getChaseDistance() && this.getDistanceToPlayer() < this.getRayData().distance[0] || this.getRayData().distance[0] == undefined){
                this.inSight = true;
                this.setRotation(adjustAngleValue(this.angleToElement(playerPosition) - this.getOriginInfo().angleOffset));
            }else{
                this.inSight = false;
            } 
        }
    }

    shoot(player){
        let projectile = this.getProjectiles2D().getFirstDead();
        
        if(this.inSight && this.getAbleToShoot() && projectile){
            this.getSpriteSounds("attack").setSoundPanning(this.getDistanceToPlayer(), player.angleToElement(this.getPosition()), player.getAngleRadians());
            let time = this.getScene().time.now - this.creationTime;

            if(time - this.lastShotTimer > this.getBulletProperties().delay + getRndInteger(0, 10)*100){
                this.getEnemy3D().play(this.getAnimations("attack").getAnimationName());
                this.lastShotTimer = time;
                setTimeout(() =>{
                    if(this.active){
                        projectile.shoot(this, this.getBulletProperties().velocity);
                        this.getSpriteSounds("attack").playSound();
                    }
                }, 300)
            }
        }
    }
}

class EnemyGroup extends Phaser.Physics.Arcade.Group{
    /**
     * The constructor for the Cacodemon class.
     * @constructor
     * @param {Phaser.Scene} scene2D The scene to place the 2D sprites in the game.
     * @param {Phaser.Scene} scene3D The scene to place the 3D sprites in the game.
     * @param {Number} amount The amount of enemies to place.
     * @param {{name: string,
     * name3D: String, defaultVelocity: Number, 
     * angleOffset: Number, chaseDistance: Number,
     * maxHealth: Number, bulletProperties: {
     * damage: Number, velocity: Number, delay: Number, critical: Number},
     * distanceLimits: {min: Number, max: Number},
     * animationsToSet: [...{name: String, animationParams:{end: Number, framerate: Number}}],
     * spriteSounds: [String]}} config
     */
    constructor(scene, scene3D, amount, wallObject, config){
        super(scene.physics.world, scene);

        this.maxSize = amount;

        this.wallMatrix = wallObject.getWallMatrix().slice();
        let wallNumberRatio = wallObject.getWallNumberRatio();
        let blockSize = wallObject.getWallBlockSize();

        for(let i = 0; i < amount; i++){
            this.add(new Enemy(scene, scene3D, this.setInitialPosition(wallNumberRatio, config.angleOffset), config.name, 0, blockSize*2, config.defaultVelocity, config.chaseDistance));
        }

        this.callAll("setBulletProperties", config.bulletProperties);
        this.callAll("setDistanceLimits", config.distanceLimits);
        this.callAll("setAnimations", config.animationsToSet);
        this.callAll("setSpriteSounds", config.name.replace("small_", ""), config.spriteSounds);
        this.callAll("setRaycaster", this.wallMatrix, 1, config.angleOffset);
        this.callAll("setDebug", false);
        this.callAll("setSpriteRays", colors.black);
        this.callAll("setMaxHealth", config.maxHealth);

        scene.physics.add.collider(this,this);
    }

    callAllSoundPanning(player) {
        this.getChildren().forEach(function (enemy) {
            for(let sound in enemy.getSpriteSounds()){
                enemy.getSpriteSounds(sound).setSoundPanning(enemy.getDistanceToPlayer(), player.angleToElement(enemy.getPosition()), player.getAngleRadians());
            }              
        });
    };
    

    /**
     * Custom method to call the same method to all children in the group.
     * @param {String} methodName the name of the method to call.
     * @param  {...any} args the arguments to pass to the method.
     */
    callAll(methodName, ...args) {
        this.getChildren().forEach(function (enemy) {
            if(args === null){
                enemy[methodName]();
            }else{
                enemy[methodName](...args);
            }
        });
    };

    /**
     * Sets the position of the enemy acording to the available spaces in the map.
     * @param {Number} wallNumberRatio
     * @param {Number} enemyAngleOffset
     * @returns {{x: Number, y: Number, angleOffset: Number}}
     */
    setInitialPosition(wallNumberRatio, enemyAngleOffset) {
        let enemyPosition = {x: 0, y: 0, angleOffset: 0};

        let i = getRndInteger(0, wallNumberRatio.y);
        let j = getRndInteger(0, wallNumberRatio.x);

        while(this.wallMatrix[i][j]){
            i = getRndInteger(0, wallNumberRatio.y);
            j = getRndInteger(0, wallNumberRatio.x);
        }

        // this.wallMatrix[i][j] = true;
        enemyPosition.x = (j*32 + 32);
        enemyPosition.y = (i*32 + 32);
        enemyPosition.angleOffset = enemyAngleOffset;

        return enemyPosition;
    }
}