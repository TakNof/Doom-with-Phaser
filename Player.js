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

        this.sprite.scene3D = scene3D;

        this.sprite.angleOperator = playerAngleOperator;

        this.setRotation = 0;
        this.setAngle = 0;

        this.setXcomponent();
        this.setYcomponent();

        this.sprite.cursors = this.getScene.input.keyboard.createCursorKeys();

       for(let key of ["W", "A", "S", "D"]) {
            this.sprite.cursors[key] = this.getScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[key]);
        }

        this.sprite.keySpace = this.getScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.sprite.keyShift = this.getScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        this.setMaxHealth = maxHealth;
        this.setHealth = this.getMaxHealth;

        this.setSpriteSounds("player", ["hurt", "death", "heal"]);

        this.sprite.rounds_shot = 0;
        this.sprite.damageDealed = 0;
        this.sprite.damageReceived = 0;
        this.sprite.lastSwitchWeaponTimer = 0;
        this.sprite.creationTime = this.getScene.time.now;
    }
    
    /**
     * Gets the angle operator to determine the amount of rotation of the player sprite.
     * @return {number}
     */
    get getAngleOperator(){
        return this.sprite.angleOperator;
    }

    /**
     * Sets the graphicator object of the player.
     */
    setGraphicator(){
        this.sprite.graphicator = new Graphicator(this.getScene3D, this.getSize, this.getRaysAmount);
    }

    /**
     * Gets the graphicator object of the player.
     * @returns {Graphicator}
     */
    get getGraphicator(){
        return this.sprite.graphicator;
    }

    /**
     * Sets the HUD object of the player.
     * @param {Object} canvasSize
     */
    setHUD(enemies = undefined){
        this.sprite.hud = new HUD(this.sprite.scene3D, enemies);
        this.sprite.hud.setHealthValue = this.getHealth;
    }

    /**
     * Gets the HUD object of the player.
     * @returns {HUD}
     */
    get getHUD(){
        return this.sprite.hud;
    }

    /**
     * Sets the camera of the player.
     * @param {number} fov in radians.
     * @param {Array<Enemy>} enemies2D 
     */
    setCamera(fov, enemies2D){
        this.sprite.camera = new Camera(this.sprite.scene3D, fov, this, enemies2D);
    }

    /**
     * Gets the camera of the player.
     * @returns {Camera}
     */
    get getCamera(){
        return this.sprite.camera;
    }

    /**
     * Sets the list of weapons of the player.
     * @param {Array<Object>} weapons
     */
    setWeapons(weapons){
        this.sprite.weapons = new Array(weapons.length);

        for(let [i, weapon] of weapons.entries()){
            this.sprite.weapons[i] = new Weapon(
                this.sprite.scene3D,
                {x: canvasSize.width/2, y: canvasSize.height*0.9},
                weapon.name,
                canvasSize.width/2,
                80,
                weapon.bulletProperties,
                weapon.distanceLimits,
                weapon.animationParams
                );

            this.sprite.weapons[i].setVisible = false;
        }

        this.sprite.currentWeapon = this.sprite.weapons[0];
        this.sprite.currentWeapon.setVisible = true;
        
    }

    switchWeapons(){
        if(this.sprite.keyShift.isDown){
            let time = this.getScene.time.now;
            if (time - this.sprite.lastSwitchWeaponTimer  > this.sprite.currentWeapon.switchWeaponDelay) {
                this.sprite.currentWeapon.playSwitchWeaponSound();

                this.sprite.currentWeapon.setVisible = false;

                let index = this.sprite.weapons.indexOf(this.sprite.currentWeapon);

                if(index == this.sprite.weapons.length - 1){
                    this.sprite.currentWeapon = this.sprite.weapons[0];
                }else{
                    this.sprite.currentWeapon = this.sprite.weapons[index + 1];
                }

                this.sprite.currentWeapon.setVisible = true;

                this.sprite.lastShotTimer = 0;
                this.sprite.lastSwitchWeaponTimer = time;
            }
        }
    }

    /**
     * Gets the list of weapons of the player.
     * @returns {Array<Weapon>}
     */
    get getWeapons(){
        return this.sprite.weapons;
    }

    /**
     * Sets the current weapon of the player.
     * @param {Number} index
     */
    set setPlayerCurrentWeapon(index){
        this.sprite.currentWeapon.setVisible = false;

        this.sprite.currentWeapon = this.sprite.weapons[index].setVisible = true;
    }

    /**
     * Gets the current weapon of the player.
     * @return {Weapon}
     */
    get getPlayerCurrentWeapon(){
        return this.sprite.currentWeapon;
    }

    /**
     * Checks if the living sprite have been impacted by a projectile or not.
     * @param {Living} shooter The living object which has shot THIS living object.
     */
    evalProjectileCollision(shooter){
        let thisObject = this;
        this.getScene.physics.collide(this.getSprite, shooter.getProjectiles2D,
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

        this.getHUD.setHealthValue = this.getHealth;
    }

    /**
     * Sets the time the player has been alive.
     */
    setTimeAlive(){
        this.sprite.timeAlive = (this.getScene.time.now - this.sprite.creationTime)/1000;
    }

    /**
     * Gets the time the player has been alive.
     * @returns {Number}
     */    
    getTimeAlive(){
        return this.sprite.timeAlive;
    }

    addRoundShot(){
        this.sprite.roundsShot +=1;
    }

    getRoundsShot(){
        return this.sprite.roundsShot;
    }

    addDamageDealed(damage){
        this.sprite.damageDealed += damage;
    }

    getDamageDealed(){
        return this.sprite.damageDealed;
    }

    addDamageReceived(damage){
        this.sprite.damageReceived += damage;
    }

    getDamageReceived(){
        return this.sprite.damageReceived;
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
        
        this.sprite.score = score;
        this.sprite.score.totalScore = Math.round(score.totalScore/10)*10;
    }

    getScore(){
        return this.sprite.score;
    }

    /**
     * This method allows the player to have the basic controls of movement according to the stablished parameters.
     * The movement only works through the key arrows.
     */
    move(){
        this.setVelocity = 0;
        this.setRayData();

        if(this.getDebug === true){
            this.getSpriteRays.setVelocity = 0;
            this.getSpriteRays.redrawRay2D(this.getPosition, this.getRayData);
        }     
        
        this.getRaycaster.setSpritePosition = this.getPosition;


        if((this.sprite.cursors.up.isDown ^ this.sprite.cursors.down.isDown) ^ (this.sprite.cursors["W"].isDown ^ this.sprite.cursors["S"].isDown)){
            if (this.sprite.cursors.up.isDown || this.sprite.cursors["W"].isDown){
                //Here we use the velocity calculated, and we change its sign accordingly to the direction of movement.
                this.setVelocityX = this.getXcomponent;
                this.setVelocityY = this.getYcomponent;  

            }else if(this.sprite.cursors.down.isDown || this.sprite.cursors["S"].isDown){    
                this.setVelocityX = -this.getXcomponent;
                this.setVelocityY = -this.getYcomponent;
            }

            if(this.getDebug === true){
                for(let ray of this.getSpriteRays.rays){
                    ray.body.setVelocityX(this.getVelocityX);
                    ray.body.setVelocityY(this.getVelocityY);
                }
            }
        } 

        if((this.sprite.cursors.left.isDown ^ this.sprite.cursors.right.isDown) ^ (this.sprite.cursors["A"].isDown ^ this.sprite.cursors["D"].isDown)){

            //Here we use trigonometrics to calculate the x and y component of the velocity.
            this.setXcomponent(3*Math.PI/2);
            this.setYcomponent(3*Math.PI/2);    
    
            if (this.sprite.cursors.left.isDown || this.sprite.cursors["A"].isDown){
                this.setAngle = this.getAngle - this.getAngleOperator

            }else if(this.sprite.cursors.right.isDown || this.sprite.cursors["D"].isDown){
                this.setAngle = this.getAngle + this.getAngleOperator
            }
        }

        if(this.getDebug === true){
            this.getSpriteRays.setInitialRayAngleOffset = this.getAngleOffset;
        }

        this.getRaycaster.setRayAngle = this.getRotation + this.getAngleOffset - (Math.PI/4);
    }

    shoot(){
        if(this.sprite.keySpace.isDown){
            let time = this.getScene.time.now;
            if (time - this.sprite.lastShotTimer > this.sprite.currentWeapon.getDelayBetweenShots) {
                this.getPlayerCurrentWeapon.getSprite.play(this.getPlayerCurrentWeapon.getShootingAnimation().getAnimationName);
                let projectile = new Projectile(this.getScene, this.getPosition, "bullet", 12, 80, this.sprite.currentWeapon.getBulletVelocity);
                this.getPlayerCurrentWeapon.getProjectiles.add(projectile.getSprite);
                projectile.shootProjectile(this);
                this.getPlayerCurrentWeapon.playSoundEffect();

                this.sprite.lastShotTimer = time;

                this.addRoundShot();
            }
        }
    }


}