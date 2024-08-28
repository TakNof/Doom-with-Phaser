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