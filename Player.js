 /**
 * This class extends to Living class, due the "living" sprites could be
 * players or enemies. Furthermore, this class implements all the movement controlers for the player/s.
 */

class Player extends Living{
    /**
    * The constructor of Player Class.
    * @constructor
    * @param {Scene} scene The scene to place the 2D sprites in the game.
    * @param {Scene} scene3D The scene to place the 3D sprites in the game.
    * @param {Object} playerOriginInfo  A list with the initial positioning information for the sprite.
    * @param {String} playerImgStr An str of the image name given in the preload method of the main class.
    * @param {Number} size The size of the sprite in pixels.
    * @param {Number} depth The depth of rendering of the sprite.
    * @param {Number} defaultVelocity The default velocity for the living sprite.
    * @param {Number} playerAngleOperator The player angle operator in order to rotate the sprite arround.
    * @param {Number} maxHealth The maximum health of the player.
    * 
    */
    constructor(scene, scene3D, playerOriginInfo, playerImgStr, size, depth, defaultVelocity, playerAngleOperator, maxHealth){
        super(scene, playerOriginInfo, playerImgStr, size, depth, defaultVelocity);

        this.scene3D = scene3D;

        this.playerAngleOperator = playerAngleOperator;

        this.setRotation = 0;
        this.setAngle = 0;

        this.setXcomponent();
        this.setYcomponent();

        this.cursors = this.scene.input.keyboard.createCursorKeys();

       for(let key of ["W", "A", "S", "D"]) {
            this.cursors[key] = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[key]);
        }

        this.keySpace = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.keyShift = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        this.setMaxHealth = maxHealth;
        this.setHealth = this.getMaxHealth;

        this.setSpriteSounds("player", ["hurt", "death", "heal"]);

        this.rounds_shot = 0;
        this.damageDealed = 0;
        this.damageReceived = 0;
        this.lastSwitchWeaponTimer = 0;
        this.creationTime = this.scene.time.now;
    }
    
    /**
     * Sets the graphicator object of the player.
     */
    setGraphicator(){
        this.playerGraphicator = new Graphicator(this.scene3D, this.size, this.raysAmount);
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
     * @param {number} fov in radians.
     * @param {Array<Enemy>} enemies2D 
     */
    setCamera(fov, enemies2D){
        this.playerCamera = new Camera(this.scene3D, fov, this, enemies2D);
    }

    /**
     * Sets the HUD object of the player.
     * @param {Object} canvasSize
     */
    setHUD(enemies = undefined){
        this.playerHUD = new HUD(this.scene3D, enemies);
        this.playerHUD.setHealthValue = this.getHealth;
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
     * @param {Array<Object>} weapons
     */
    setWeapons(weapons){
        this.playerWeapons = new Array(weapons.length);

        for(let [i, weapon] of weapons.entries()){
            this.playerWeapons[i] = new Weapon(
                this.scene3D,
                {x: canvasSize.width/2, y: canvasSize.height*0.9},
                weapon.name,
                canvasSize.width/2,
                80,
                weapon.bulletProperties,
                weapon.distanceLimits,
                weapon.animationParams
                );

            this.playerWeapons[i].setVisible = false;
        }

        this.playerCurrentWeapon = this.playerWeapons[0];
        this.playerCurrentWeapon.setVisible = true;
        
    }

    switchWeapons(){
        if(this.keyShift.isDown){
            let time = this.scene.time.now;
            if (time - this.lastSwitchWeaponTimer  > this.playerCurrentWeapon.switchWeaponDelay) {
                this.playerCurrentWeapon.playSwitchWeaponSound();

                this.playerCurrentWeapon.setVisible = false;

                let index = this.playerWeapons.indexOf(this.playerCurrentWeapon);

                if(index == this.playerWeapons.length - 1){
                    this.playerCurrentWeapon = this.playerWeapons[0];
                }else{
                    this.playerCurrentWeapon = this.playerWeapons[index + 1];
                }

                this.playerCurrentWeapon.setVisible = true;

                this.lastShotTimer = 0;
                this.lastSwitchWeaponTimer = time;
            }
        }
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
     * Checks if the living sprite have been impacted by a projectile or not.
     * @param {Living} shooter The living object which has shot THIS living object.
     */
    evalProjectileCollision(shooter){
        let thisObject = this;
        this.scene.physics.collide(this.getSprite, shooter.getProjectiles2D,
            function(sprite, projectile){
                let index = shooter.getProjectiles2D.getChildren().indexOf(projectile);
                let projectile3D = shooter.getProjectiles3D.getChildren()[index];
               thisObject.__checkDamage(projectile, projectile3D, shooter.getBulletProperties, shooter.getDistanceLimits, shooter.getDistanceToPlayer);
            }
        );
    }

    /**
     * This method is called when a projectile has collided with a living sprite,
     * here he health and the state of the living sprite is determined by the
     * damage and limit distances of the projected projectiles.
     * @param {Projectile} projectile 
     * @param {Number} damage 
     * @param {Object} distanceLimits 
     * @param {Number} currentDistance 
     * @returns 
     */
    __checkDamage(projectile, projectile3D, bulletProperties, distanceLimits, currentDistance){
        projectile.destroy();
        projectile3D.destroy();

        let damage = bulletProperties.damage;

        if(currentDistance > distanceLimits.min && currentDistance < distanceLimits.max){
            damage *= 220/currentDistance;
            // console.log(`${this} Normal damage ${damage}`);
        }else if(currentDistance >= distanceLimits.max){
            damage *= 1/distanceLimits.max;
            // console.log(`${this} Minimal damage ${damage}`);
        }else if(currentDistance <= distanceLimits.min){
            damage *= bulletProperties.critical * 220/currentDistance;
            // console.log(`${this} Critical damage ${damage}`);
        }

        this.addDamageReceived(damage);

        if(this.getHealth - damage <= 0){
            this.setHealth = 0;
            
            this.getSpriteSounds("death").playSound();

            this.isAlive = false;

        }else{
            this.getSpriteSounds("hurt").playSound();
            this.getHUD.displayHurtRedScreen();
            this.setHealth = this.getHealth - damage;
        }
    }

    /**
     * Sets the time the player has been alive.
     */
    setTimeAlive(){
        this.timeAlive = (this.scene.time.now - this.creationTime)/1000;
    }

    /**
     * Gets the time the player has been alive.
     * @returns {Number}
     */    
    getTimeAlive(){
        return this.timeAlive;
    }

    addRoundShot(){
        this.rounds_shot +=1;
    }

    getRoundsShot(){
        return this.rounds_shot;
    }

    addDamageDealed(damage){
        this.damageDealed += damage;
    }

    getDamageDealed(){
        return this.damageDealed;
    }

    addDamageReceived(damage){
        this.damageReceived += damage;
    }

    getDamageReceived(){
        return this.damageReceived;
    }

    setScore(type, enemiesAmount){
        let score = {timeScore: 0, shotsScore: 0, damageDealedScore: 0, damageReceivedScore: 0, totalScore: 0};
        switch (type) {
            case "Victory":
                score.timeScore = `TIME ALIVE = ${Math.round(this.getTimeAlive())}s + BONUS`; 
                score.totalScore += (1000000/this.getTimeAlive());
                break;

            case "Defeat":
                score.timeScore = `TIME ALIVE = ${Math.round(this.getTimeAlive())}s`; 
                score.totalScore += this.getTimeAlive()*10;
                break;

            default:
                throw new Error("Invalid type: " + type);
        }
        score.shotsScore = `SHOTS = ${Math.round(this.getRoundsShot())}`;
        score.damageDealedScore = `DAMAGE DEALED = ${Math.round(this.getDamageDealed())}`;
        score.damageReceivedScore = `DAMAGE RECIEVED = -${Math.round(this.getDamageReceived())}`;

        score.totalScore += this.getRoundsShot()/enemiesAmount*10;
        score.totalScore += this.getDamageDealed()*10;
        score.totalScore -= this.getDamageReceived()*10;
        
        this.score = score;
        this.score.totalScore = Math.round(score.totalScore/10)*10;
    }

    getScore(){
        return this.score;
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


        if((this.cursors.up.isDown ^ this.cursors.down.isDown) ^ (this.cursors["W"].isDown ^ this.cursors["S"].isDown)){
            if (this.cursors.up.isDown || this.cursors["W"].isDown){
                //Here we use the velocity calculated, and we change its sign accordingly to the direction of movement.
                this.setVelocityX = this.getXcomponent;
                this.setVelocityY = this.getYcomponent;  

            }else if(this.cursors.down.isDown || this.cursors["S"].isDown){    
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
    
        if((this.cursors.left.isDown ^ this.cursors.right.isDown) ^ (this.cursors["A"].isDown ^ this.cursors["D"].isDown)){

            //Here we use trigonometrics to calculate the x and y component of the velocity.
            this.setXcomponent();
            this.setYcomponent();    
    
            if (this.cursors.left.isDown || this.cursors["A"].isDown){
                this.setAngle =  this.adjustAngleValue(this.getAngle - this.playerAngleOperator);
                this.setRotation = this.getAngle;

            }else if(this.cursors.right.isDown || this.cursors["D"].isDown){
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
                this.getPlayerCurrentWeapon.getSprite.play(this.getPlayerCurrentWeapon.getShootingAnimation().getAnimationName);
                let projectile = new Projectile(this.scene, this.getPosition, "bullet", 12, 80, this.playerCurrentWeapon.getBulletVelocity);
                this.getPlayerCurrentWeapon.getProjectiles.add(projectile.getSprite);
                projectile.shootProjectile(this);
                this.getPlayerCurrentWeapon.playSoundEffect();

                this.lastShotTimer = time;

                this.addRoundShot();
            }
        }
    }


}