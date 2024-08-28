 /**
 * This class extends to Living class, due the "living" sprites could be
 * players or enemies. Furthermore, this class implements all the movement controlers for the player/s.
 */
 class Player extends Living{
    /**
    * The constructor of Player Class.
    * @constructor
    * @param {Phaser.Scene} scene2D The scene to place the sprite in the game.
    * @param {Phaser.Scene} scene3D The scene to place the 3D sprite in the game.
    * @param {{x: Number, y: Number}} worldOriginInfo A literal Object with the initial positioning information for the sprite.
    * @param {JSON} config The configuration object for the Player.
    * 
    */
    constructor(scene2D, scene3D, worldOriginInfo, config){
        super(scene2D, scene3D, worldOriginInfo, config);

        this.setXcomponent(this.config.angleOffset);
        this.setYcomponent(this.config.angleOffset);

        this.setDebug(game.config.physics.arcade.debug);

        this.setMaxShield(config.maxShield);
        this.getRaycaster().setAngleStep(this.config.fov);
        this.setCamera(scene2D.cameraConfig);

        this.damageDealed = 0;
        this.damageReceived = 0;
        this.lastSwitchWeaponTimer = 0;
        this.creationTime = this.getScene().time.now;
    }

    /**
     * Sets the camera of the player.
     * @param {JSON} config JSON with the configuration of the camera.
     */
    setCamera(config){
        this.camera = new Camera(this.scene, this.scene3D, config, this);
    }

    /**
     * Gets the camera of the player.
     * @returns {Camera}
     */
    getCamera(){
        return this.camera;
    }

    setWeaponManager(){
        const {weaponsConfig} = this.config;
        this.weapons = new Array(weaponsConfig.list.length);

        for(let [i, weaponConfig] of weaponsConfig.list.entries()){
            this.weapons[i] = new Weapon(
                this.scene,
                this.scene3D,
                {x: canvasSize.width/2, y: canvasSize.height*0.9},
                this,
                [this.scene.walls.walls, this.scene.children.list.filter(obj => obj instanceof Enemy)],
                weaponConfig
            );
        }

        this.weaponManager = new WeaponManager(this.scene, this.config.controls, this.weapons, weaponsConfig.generalWeaponSounds, this);
    }

    /**
     * Gets the list of weapons of the player.
     * @returns {Array<Weapon>}
     */
    getWeapons(){
        return this.weapons;
    }

    /**
     * Checks if the living sprite have been impacted by a projectile or not.
     * @param {Living} shooter The living object which has shot THIS living object.
     */
    evalProjectileCollision(shooter){
        let thisObject = this;
        this.getScene().physics.collide(this, shooter.getProjectiles2D(),
            function(sprite, projectile){
                let index = shooter.getProjectiles2D().getChildren().indexOf(projectile);
                let projectile3D = shooter.getProjectiles3D().getChildren()[index];
                thisObject.__checkDamage(
                    projectile,
                    projectile3D,
                    shooter.getBulletProperties(),
                    shooter.getDistanceLimits(),
                    shooter.getDistanceToPlayer()
                );
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
     */
    __checkDamage(projectile, projectile3D, bulletProperties, distanceLimits, currentDistance){
        projectile.body.reset(-100, -100); 

        projectile.setActive(false);
        projectile.setVisible(false);

        projectile3D.body.reset(-100, -100); 

        projectile3D.setActive(false);
        projectile3D.setVisible(false);

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

        if(this.getHealth() - damage <= 0){
            this.setHealth(0);
            
            this.getSpriteSounds("death").playSound();

            this.isAlive = false;

        }else{
            this.getSpriteSounds("hurt").playSound();
            this.getHUD().displayHurtRedScreen();
            this.setHealth(this.getHealth() - damage);
        }

        this.getHUD().setHUDElementValue("health", this.getHealth(), true, "%");
    }

    /**
     * Sets the time the player has been alive.
     */
    setTimeAlive(){
        this.timeAlive = (this.getScene().time.now - this.creationTime)/1000;
    }

    /**
     * Gets the time the player has been alive.
     * @returns {Number}
     */    
    getTimeAlive(){
        return this.timeAlive;
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

    setScore(type){
        let score = {timeScore: 0, difficulty: 0, damageDealedScore: 0, damageReceivedScore: 0, totalScore: 0};
        let aux = ["I'm too young to die", "Hurt me Plenty", "Ultra-Violence", "Nightmare"];
        switch (type) {
            case "Victory":
                score.timeScore = `TIME ALIVE: ${Math.round(this.getTimeAlive())}s + BONUS`; 
                score.totalScore += (1000000/this.getTimeAlive());

                if(options.difficulty.setting == 0){
                    score.difficulty = `DIFICULTY: ${aux[options.difficulty.setting].toUpperCase()}, SCORE x${1}`;
                }else{
                    score.difficulty = `DIFICULTY: ${aux[options.difficulty.setting].toUpperCase()}, SCORE x${options.difficulty.setting * 10}`;
                }
                break;

            case "Defeat":
                score.timeScore = `TIME ALIVE: ${Math.round(this.getTimeAlive())}s`; 
                score.totalScore += this.getTimeAlive()*10;

                score.difficulty = `DIFICULTY: ${aux[options.difficulty.setting].toUpperCase()}`
                break;

            default:
                throw new Error("Invalid type: " + type);
        }
        
        score.damageDealedScore = `DAMAGE DEALED: ${Math.round(this.getDamageDealed())}`;
        score.damageReceivedScore = `DAMAGE RECIEVED: -${Math.round(this.getDamageReceived())}`;

        score.totalScore += this.getDamageDealed()*10;
        score.totalScore -= this.getDamageReceived()*10;

        if(type == "Victory"){
            if(options.difficulty.setting != 0){
                score.totalScore *= options.difficulty.setting * 10;
            }
        }
        
        this.score = score;
        this.score.totalScore = Math.round(score.totalScore/10)*10;
    }

    getScore(){
        return this.score;
    }

    update(){
        // this.move();
        // this.shoot();
        // this.reload();
        // this.switchWeapons();

        this.getStateMachine().update();
        this.getRaycaster().update();
        this.moveCamera();
        this.shoot();
        this.switchWeapons();
    }

    moveCamera(){
        const {a, d, left, right} = this.config.controls;

        if((left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown)){

            //Here we use trigonometrics to calculate the x and y component of the velocity.
            this.setXcomponent();
            this.setYcomponent();    
    
            if (left.isDown || a.isDown){
                this.setAngle(this.getAngle() - this.config.angleOperator);

            }else if(right.isDown || d.isDown){
                this.setAngle(this.getAngle() + this.config.angleOperator);
            }
        }
    }

    /**
     * This method allows the player to have the basic controls of movement according to the stablished parameters.
     * The movement only works through the key arrows.
     */
    move(){
        if(this.getVelocityX() != 0 && this.getVelocityY() != 0){
            this.setVelocity(0);
        }
        this.setRayData();

        if(this.getDebug() === true){
            this.getSpriteRays().setVelocity(0);
            this.getSpriteRays().redrawRay2D(this.getPosition(), this.getRayData());
        }     
        
        this.getRaycaster().setSpritePosition(this.getPosition());


        if((this.controls.up.isDown ^ this.controls.down.isDown) ^ (this.controls.w.isDown ^ this.controls.s.isDown)){
            if (this.controls.up.isDown || this.controls.w.isDown){
                //Here we use the velocity calculated, and we change its sign accordingly to the direction of movement.
                this.setVelocityX(this.getXcomponent());
                this.setVelocityY(this.getYcomponent()); 

            }else if(this.controls.down.isDown || this.controls.s.isDown){    
                this.setVelocityX(-this.getXcomponent());
                this.setVelocityY(-this.getYcomponent());
            }

            if(this.getDebug() === true){
                for(let ray of this.getSpriteRays().rays){
                    ray.body.setVelocityX(this.getVelocityX());
                    ray.body.setVelocityY(this.getVelocityY());
                }
            }
        } 

        if((this.controls.left.isDown ^ this.controls.right.isDown) ^ (this.controls.a.isDown ^ this.controls.d.isDown)){

            //Here we use trigonometrics to calculate the x and y component of the velocity.
            this.setXcomponent(this.config.angleOffset);
            this.setYcomponent(this.config.angleOffset);    
    
            if (this.controls.left.isDown || this.controls.a.isDown){
                this.setAngle(this.getAngle() - this.getAngleOperator());

            }else if(this.controls.right.isDown || this.controls.d.isDown){
                this.setAngle(this.getAngle() + this.getAngleOperator());
            }
        }

        if(this.getDebug() === true){
            this.getSpriteRays().setInitialRayAngleOffset(this.config.angleOffset);
        }

        this.getRaycaster().setRayAngle(this.getRotation() + this.config.angleOffset - (Math.PI/4));
    }

    shoot(){
        if(this.config.controls.space.isDown){
            this.weaponManager.HandleWeapon();
        }
    }

    switchWeapons(){
        if(Phaser.Input.Keyboard.JustDown(this.config.controls.shift)){
            this.weaponManager.switchWeapons();
        }
    }

    /**
     * Allow the player to switch among the weapons.
     */
    // switchWeapons(){
    //     if(this.controls.shift.isDown){
    //         let time = this.getScene().time.now;
    //         if (time - this.lastSwitchWeaponTimer  > this.getCurrentWeapon().switchWeaponDelay) {
    //             this.getCurrentWeapon().playSwitchWeaponSound();

    //             this.getCurrentWeapon().setVisible(false);

    //             let index = this.weapons.indexOf(this.getCurrentWeapon());

    //             if(index == this.weapons.length - 1){
    //                 this.setCurrentWeapon(this.weapons[0]);
    //             }else{
    //                 this.setCurrentWeapon(this.weapons[index + 1]);
    //             }

    //             this.getCurrentWeapon().setVisible(true);

    //             this.lastShotTimer = 0;
    //             this.lastSwitchWeaponTimer = time;

    //             this.getHUD().setHUDElementValue("ammo", this.getCurrentWeapon().getProjectiles().countActive(false), false);
    //         }
    //     }
    // }

    /**
     * Allows the player to reload the current weapon.
     */
    reload(){
        if(this.controls.r.isDown){
            this.getCurrentWeapon().getProjectiles().createMultiple({
                    key: "bullet",
                    max: 10,
                    quantity: 10,
                    active: false,
                    visible: false
            });
            this.getHUD().setHUDElementValue("ammo", this.getCurrentWeapon().getProjectiles().countActive(false), false);
        }
    }
}