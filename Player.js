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
    * @param {{x: Number, y: Number, angleOffset: Number}} playerOriginInfo  A list with the initial positioning information for the sprite.
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

        this.getSprite.scene3D = scene3D;

        this.getSprite.angleOperator = playerAngleOperator;

        this.setRotation = 0;
        this.setAngle = 0;

        this.setXcomponent(this.getOriginInfo.angleOffset);
        this.setYcomponent(this.getOriginInfo.angleOffset);

        this.getSprite.cursors = this.getScene.input.keyboard.createCursorKeys();

       for(let key of ["W", "A", "S", "D", "R"]) {
            this.getSprite.cursors[key] = this.getScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[key]);
        }

        this.getSprite.keySpace = this.getScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.getSprite.keyShift = this.getScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        this.setMaxHealth = maxHealth;
        this.setHealth = this.getMaxHealth;

        this.setSpriteSounds("player", ["hurt", "death", "heal"]);

        this.getSprite.roundsShot = 0;
        this.getSprite.damageDealed = 0;
        this.getSprite.damageReceived = 0;
        this.getSprite.lastSwitchWeaponTimer = 0;
        this.getSprite.creationTime = this.getScene.time.now;
    }
    
    /**
     * Gets the angle operator to determine the amount of rotation of the player sprite.
     * @return {number}
     */
    get getAngleOperator(){
        return this.getSprite.angleOperator;
    }

    /**
     * Sets the graphicator object of the player.
     */
    setGraphicator(){
        this.getSprite.graphicator = new Graphicator(this.getScene3D, this.getSize, this.getRaysAmount);
    }

    /**
     * Gets the graphicator object of the player.
     * @returns {Graphicator}
     */
    get getGraphicator(){
        return this.getSprite.graphicator;
    }

    /**
     * Sets the HUD object of the player.
     * @param {Object} canvasSize
     */
    setHUD(enemies = undefined){
        this.getSprite.hud = new HUD(this.getSprite.scene3D, enemies);
        this.getSprite.hud.setHealthValue = this.getHealth;
    }

    /**
     * Gets the HUD object of the player.
     * @returns {HUD}
     */
    get getHUD(){
        return this.getSprite.hud;
    }

    /**
     * Sets the camera of the player.
     * @param {number} fov in radians.
     * @param {Array<Enemy>} enemies2D 
     */
    setCamera(fov, enemies2D){
        this.getSprite.camera = new Camera(this.getSprite.scene3D, fov, this, enemies2D);
    }

    /**
     * Gets the camera of the player.
     * @returns {Camera}
     */
    get getCamera(){
        return this.getSprite.camera;
    }

    /**
     * Sets the list of weapons of the player.
     * @param {Array<Object>} weapons
     */
    setWeapons(weapons){
        this.getSprite.weapons = new Array(weapons.length);

        for(let [i, weapon] of weapons.entries()){
            this.getSprite.weapons[i] = new Weapon(
                this.getScene3D,
                {x: canvasSize.width/2, y: canvasSize.height*0.9},
                weapon.name,
                canvasSize.width/2,
                80,
                weapon.bulletProperties,
                weapon.distanceLimits,
                weapon.animationParams
                );

            this.getSprite.weapons[i].setProjectiles(this.getScene);
            this.getSprite.weapons[i].setVisible = false;
        }

        this.getSprite.currentWeapon = this.getSprite.weapons[0];
        this.getSprite.currentWeapon.setVisible = true;
        
    }

    switchWeapons(){
        if(this.getSprite.keyShift.isDown){
            let time = this.getScene.time.now;
            if (time - this.getSprite.lastSwitchWeaponTimer  > this.getSprite.currentWeapon.switchWeaponDelay) {
                this.getSprite.currentWeapon.playSwitchWeaponSound();

                this.getSprite.currentWeapon.setVisible = false;

                let index = this.getSprite.weapons.indexOf(this.getSprite.currentWeapon);

                if(index == this.getSprite.weapons.length - 1){
                    this.getSprite.currentWeapon = this.getSprite.weapons[0];
                }else{
                    this.getSprite.currentWeapon = this.getSprite.weapons[index + 1];
                }

                this.getSprite.currentWeapon.setVisible = true;

                this.getSprite.lastShotTimer = 0;
                this.getSprite.lastSwitchWeaponTimer = time;

                this.getHUD.setAmmoValue = this.getCurrentWeapon.getProjectiles.countActive(false);
            }
        }
    }

    reload(){
        if(this.getSprite.cursors["R"].isDown){
            this.getCurrentWeapon.getProjectiles.createMultiple({
                    key: "bullet",
                    max: 10,
                    quantity: 10,
                    active: false,
                    visible: false
            });
            this.getHUD.setAmmoValue = this.getCurrentWeapon.getProjectiles.countActive(false);
        }
    }

    /**
     * Gets the list of weapons of the player.
     * @returns {Array<Weapon>}
     */
    get getWeapons(){
        return this.getSprite.weapons;
    }

    /**
     * Sets the current weapon of the player.
     * @param {Number} index
     */
    set setPlayerCurrentWeapon(index){
        this.getSprite.currentWeapon.setVisible = false;

        this.getSprite.currentWeapon = this.getSprite.weapons[index].setVisible = true;
    }

    /**
     * Gets the current weapon of the player.
     * @return {Weapon}
     */
    get getCurrentWeapon(){
        return this.getSprite.currentWeapon;
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
        projectile.body.reset(-100, -100); 

        projectile.setActive(false);
        projectile.setVisible(false);

        projectile3D.body.reset(-100, -100); 

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
        this.getSprite.timeAlive = (this.getScene.time.now - this.getSprite.creationTime)/1000;
    }

    /**
     * Gets the time the player has been alive.
     * @returns {Number}
     */    
    getTimeAlive(){
        return this.getSprite.timeAlive;
    }

    addRoundShot(){
        this.getSprite.roundsShot +=1;
    }

    getRoundsShot(){
        return this.getSprite.roundsShot;
    }

    addDamageDealed(damage){
        this.getSprite.damageDealed += damage;
    }

    getDamageDealed(){
        return this.getSprite.damageDealed;
    }

    addDamageReceived(damage){
        this.getSprite.damageReceived += damage;
    }

    getDamageReceived(){
        return this.getSprite.damageReceived;
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
        
        this.getSprite.score = score;
        this.getSprite.score.totalScore = Math.round(score.totalScore/10)*10;
    }

    getScore(){
        return this.getSprite.score;
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


        if((this.getSprite.cursors.up.isDown ^ this.getSprite.cursors.down.isDown) ^ (this.getSprite.cursors["W"].isDown ^ this.getSprite.cursors["S"].isDown)){
            if (this.getSprite.cursors.up.isDown || this.getSprite.cursors["W"].isDown){
                //Here we use the velocity calculated, and we change its sign accordingly to the direction of movement.
                this.setVelocityX = this.getXcomponent;
                this.setVelocityY = this.getYcomponent;  

            }else if(this.getSprite.cursors.down.isDown || this.getSprite.cursors["S"].isDown){    
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

        if((this.getSprite.cursors.left.isDown ^ this.getSprite.cursors.right.isDown) ^ (this.getSprite.cursors["A"].isDown ^ this.getSprite.cursors["D"].isDown)){

            //Here we use trigonometrics to calculate the x and y component of the velocity.
            this.setXcomponent(this.getOriginInfo.angleOffset);
            this.setYcomponent(this.getOriginInfo.angleOffset);    
    
            if (this.getSprite.cursors.left.isDown || this.getSprite.cursors["A"].isDown){
                this.setAngle = this.getAngle - this.getAngleOperator;

            }else if(this.getSprite.cursors.right.isDown || this.getSprite.cursors["D"].isDown){
                this.setAngle = this.getAngle + this.getAngleOperator;
            }
        }

        if(this.getDebug === true){
            this.getSpriteRays.setInitialRayAngleOffset = this.getOriginInfo.angleOffset;
        }

        this.getRaycaster.setRayAngle = this.getRotation + this.getOriginInfo.angleOffset - (Math.PI/4);
    }

    shoot(){
        if(this.getSprite.keySpace.isDown){
            let time = this.getScene.time.now;
            if (time - this.getSprite.lastShotTimer > this.getSprite.currentWeapon.getDelayBetweenShots) {
                this.getCurrentWeapon.shootProjectile(this, this.getCurrentWeapon.getBulletVelocity);
                this.getHUD.setAmmoValue = this.getCurrentWeapon.getProjectiles.countActive(false);

                this.getSprite.lastShotTimer = time;
            }
        }
    }


}