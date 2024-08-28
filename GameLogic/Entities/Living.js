/**
 * This class extends to Entity class, due the "living" sprites count with
 * some diferente properties then the "not-living" ones.
 */
class Living extends Entity{
    /**
    * The constructor of Living Class.
    * @constructor
    * @param {Phaser.Scene} scene The scene to place the sprite in the game.
    * @param {Phaser.Scene} scene3D The scene to place the 3D sprite in the game.
    * @param {{x: Number, y: Number}} worldOriginInfo A literal Object with the initial positioning information for the sprite.
    * @param {JSON} config The size of the sprite in pixels.
    * 
    */
    constructor(scene, scene3D, worldOriginInfo, config){
        super(scene, worldOriginInfo, config.name);
        this.config = config;

        this.scene3D = scene3D;
        scene.physics.add.existing(this, false);
        this.setOwnSize(config.size);
        this.body.setAllowRotation(true);
        // this.setCollideWorldBounds(true);
        // this.body.onWorldBounds = true;
        // this.setImmovable(true);

        this.body.mass = this.config.mass;

        this.setMaxHealth(config.maxHealth);
        
        this.setSpriteAnimations(config.animations);
        this.setSpriteSounds(config.name, config.sounds);
        
        this.setPositionInFreeSpace();

        this.setRaycaster();
        this.setStateMachine(...config.possibleStates);
        
        this.setBounce(0);

        this.children = [];
        this.damagedTimeHistory = [];
        this.lastPlayedAnimation = "";
        
        this.isAlive = true;
        this.isStunned = false;
        this.isCheckingStunning = false;

        let textsIndicativeTexts = ["Stunned!", "Recovered!", "???", "!!!"];

        this.indicativeTexts = {};

        for(let text of textsIndicativeTexts){
            this.indicativeTexts[text] = this.createIndicativeText(text);
            this.indicativeTexts[text].setVisible(false);
        }
    }

    /**
    * Sets the size of the sprite.
    * @param {Number} size 
    */
    setOwnSize(size){
        this.size = size;
        if(!size.x){
            this.setSize(size, size, true);
        }else{
            this.setSize(size.x, size.y, true);
        }
    }   

    /**
     * Gets the size of the sprite.
     * @return {Number}
     */
    getSize(){
        return this.size;
    }

    /**
     * Calulates the X unitary component of the living's sprite velocity.
     * @param {Number} angleAdjustment
     * @returns {Number}
     */
    xComponentUnitary(angleAdjustment){
        return Math.cos(this.getRotation() + angleAdjustment);
    }

    /**
     * Calulates the Y unitary component of the living's sprite velocity.
     * @param {Number} angleAdjustment
     * @returns {Number}
     */
    yComponentUnitary(angleAdjustment){
        return Math.sin(this.getRotation() + angleAdjustment);
    }

    getUnitaryComponents(angleAdjustment){
        return {x: this.xComponentUnitary(angleAdjustment), y: this.yComponentUnitary(angleAdjustment)};
    }

    /**
     * Sets the X component of the velocity according to the rotation stablished of the living sprite.
     * @param {Number} angleAdjustment
     */
    setXcomponent(angleAdjustment = this.config.angleOffset){
        this.Xcomponent = this.xComponentUnitary(angleAdjustment) * this.config.defaultVelocity;
    }

    /**
     * Gets the X component of the velocity according to the rotation stablished of the living sprite.
     * @returns {number}
     */
    getXcomponent(){
        return this.Xcomponent;
    }

    /**
     * Sets the Y component of the velocity according to the rotation stablished of the living sprite.
     * @param {Number} angleAdjustment
     */
    setYcomponent(angleAdjustment = this.config.angleOffset){
        this.Ycomponent = this.yComponentUnitary(angleAdjustment) * this.config.defaultVelocity;
    }

    /**
     * Gets the Y component of the velocity according to the rotation stablished of the living sprite.
     * @returns {number}
     */
    getYcomponent(){
        return this.Ycomponent;
    }

    /**
     * Gets both components of the velocity according to the rotation stablished of the living sprite.
     * @returns {{x: Number, y: Number}}
     */
    getComponents(){
        return {x: this.Xcomponent, y: this.Ycomponent};
    }

    /**
     * Sets the rotation of the living sprite.
     * @param {number} value
     */
    setRotation(value){
        this.rotation = adjustAngleValue(value);
    }

    /**
     * Gets the rotation of the living sprite.
     * @returns {number}
     */
    getRotation(){
        return this.rotation;
    }

    /**
     * Sets the angle of the Living sprite.
     * @param {number} value
     */
    setAngle(value){
        this.angle = value;
    }

    /**
     * Gets the angle of the Living sprite.
     */
    getAngle(){
        return this.angle;
    }

    /**
     * Creates a list with elemnts to collide (helpfull with the rays created by the raycaster object).
     * @returns 
     */
    colliderElements(){
        if(!this.getDebug()){
            return [this];
        }else{
            return [...[this], ... this.getRaycaster().graphicRays.rays];
        }
    }

    /**
     * Sets the position of the living acording to the available spaces in the map.
     * @returns {{x: Number, y: Number}}
     */
    setPositionInFreeSpace(){
        let x, y;

        let walls = this.scene.walls;

        do{
            try{
                do{
                    x = Math.floor(Math.random() * (walls.wallMatrix.length*walls.config.size  - this.body.width));
                    y = Math.floor(Math.random() * (walls.wallMatrix[0].length*walls.config.size - this.body.height));

                }while(walls.getWallAtWorldXY(x, y, this.config.size));
                break;
            }catch (error){
                console.log(`Tile not found, search was done out of bounds.`);                
            }
        }while(true);

        this.setPosition(x, y);
    }

    /**
     * Sets the velocity in the X component of the living sprite.
     * @param {number} value
     */
    setVelocityX(value){
        this.body.setVelocityX(value);
    }

    /**
     * Gets the velocity in the X component of the living sprite.
     * @returns {number}
     */
    getVelocityX(){
        return this.body.velocity.x;
    }

    /**
     * Sets the velocity in the Y component of the living sprite.
     * @param {number} value
     */
    setVelocityY(value){
        this.body.setVelocityY(value);
    }

    /**
     * Gets the velocity in the Y component of the living sprite.
     * @returns {number}
     */
    getVelocityY(){
        return this.body.velocity.y;
    }

    /**
     * Sets the velocity in both axis of the living sprite.
     * @param {Number} value
     */
    setVelocity(value){
        this.setVelocityX(value);
        this.setVelocityY(value);
    }

    /**
     * Gets the velocity in both components of the living sprite.
     * @returns {{Number, Number}}
     */
    getVelocity(){
        return {x : this.getVelocityX(), y : this.getVelocityY()}
    }

    /**
     * Creates the state machine for the Living Sprite
     * @param {Array<String>} possibleStates
     */
    setStateMachine(){
        let possibleStatesMap = new Map();

        for(let state of arguments){
            possibleStatesMap.set(state);
        }

        let className = `${this.constructor.name}StateMachine`;
        let classConstructor = this.__checkClassConstructor(className, "StateMachine");

        this.stateMachine = new classConstructor(this, possibleStatesMap);
    }

    /**
     * This method allows to call any desired class, as long as it exists.
     * @param {String} className 
     * @param {String} classParent 
     * @returns {class}
     */
    __checkClassConstructor(className, classParent){
        const classConstructor = eval(className);
        const classParentConstructor = eval(classParent);
        if (classParentConstructor) {
            if (classConstructor && classConstructor.prototype instanceof classParentConstructor) {
                return classConstructor;
            }
        }else if (classConstructor) {
            return classConstructor;
        } else {
            throw new Error(`The class "${className}" isn't defined or itn't an instanse of "${classParent}".`);
        }
    }

    /**
     * 
     * @returns {StateMachine} The StateMachine object. 
     */
    getStateMachine(){
        return this.stateMachine;
    }

    /**
     * This method created the raycaster object of the sprite.
     * @param {number} depthOfFieldLimit The limit to render the walls of the world.
     * @param {number} angleOffset The angle offset of the projected rays from the sprite.
     */
    setRaycaster() {
        this.raycaster = new Raycaster(this, !this.config.rayAmount ? 1 : this.config.rayAmount);
        this.raycaster.setMatrix(this.getScene().walls.wallMatrix);
        this.getRaycaster().setAngleStep();
    }

    /**
     * Gets the raycaster object of the sprite.
     * @returns {Raycaster}
     */
    getRaycaster(){
        return this.raycaster;
    }
    
    /**
     * Sets the max health of the living sprite.
     * @param {Number} maxHealth
     */
    setMaxHealth(maxHealth){
        this.maxHealth = maxHealth;
        this.setHealth(maxHealth);
    }

    /**
     * Gets the max health of the living sprite.
     * @returns {Number}
     */
    getMaxHealth(){
        return this.maxHealth;
    }

    /**
     * Sets the current health of the living sprite.
     * @param {Number} health
     */
    setHealth(health){
        this.health = health;
    }

    /**
     * Gets the current health of the living sprite.
     * @return {Number}
     */
    getHealth(){
        return this.health;
    }

    /**
     * Heals the Living sprite with the given value.
     * @param {Number} healValue 
     */
    heal(healValue) {
        if(this.getHealth()!= this.getMaxHealth()){
            this.setHealth(Math.min(this.getMaxHealth(), this.getHealth() + healValue));
        }
    }

    /**
     * Decreases the health of the living sprite with the given value.
     * If the living sprite has a Shield, the amount of damage will be 
     * reduced according to the amount of shield value.  Also, this will calculate
     * how much damage will be dealt to the shield and send it to the damageShield method.
     * @param {Number} damageValue 
     */
    decreaseHealthBy(damageValue){
        if(this.getShield() && this.getShield() > 0){
            let shieldDamage = Math.ceil(50*damageValue/this.getShield(), 5)
            damageValue = Math.ceil(10*damageValue/this.getShield(), 5);
            this.damageShield(shieldDamage);
        }

        if(this.getHealth() - damageValue <= 0){
            this.setVelocity(0);
            this.setHealth(0);
            this.isAlive = false;
            this.getStateMachine().transitionToState("Dead");
        }else{
            this.setHealth(this.getHealth() - damageValue);
        }

        this.setTint(0xeb0e0e);

        this.scene.time.delayedCall(200, () =>{
            this.clearTint();
        });
    }

    /**
     * Sets the max shield of the living sprite.
     * @param {Number} maxShield
     */
    setMaxShield(maxShield){
        this.maxShield = maxShield;
        this.setShield(maxShield);
    }

    /**
     * Gets the max health of the living sprite.
     * @returns {Number}
     */
    getMaxShield(){
        return this.maxShield;
    }

    /**
     * Sets the current shield of the living sprite.
     * @param {Number} shield
     */
    setShield(shield){
        this.shield = shield;
    }

    /**
     * Gets the current shield of the living sprite.
     * @return {Number}
     */
    getShield(){
        return this.shield;
    }

    /**
     * Repairs the shield of the living sprite with the given value if there's a shield.
     * @param {Number} repairShieldValue 
     */
    repairShield(repairShieldValue){
        if(this.getShield() != this.getMaxShield()){
            this.setShield(Math.min(this.getMaxShield(), this.getShield() + repairShieldValue));
        }
    }


    /**
     * Reduces the current shield value of the living sprite with the given value if there's a shield.
     * @param {Number} damageValue 
     */
    damageShield(damageValue){
        if(this.getShield() && this.getShield() != 0){
            this.setShield(Math.max(0, this.getShield() - damageValue));
        }
    }


    addDamagedTimeToHistory(){
        this.damagedTimeHistory.push(this.getScene().time.now);
        this.cleanDamagedTimeHistory();
    }


    getDamagedTimeHistory(){
        return this.damagedTimeHistory;
    }


    cleanDamagedTimeHistory(){
        if(this.damagedTimeHistory.length > 5){
            this.damagedTimeHistory.shift();
        }
    }

    /**
     * This method checks if the living sprite has recieved high amount of damage 
     * in a short time span. If true the living sprite will calculate an stunned timer,
     * enter the stun state and recover after the stunned timer expires.
     */
    checkStunning(){
        let object = this.enemy3D || this;

        if(this.isCheckingStunning && this.getDamagedTimeHistory().length != 4){
            return;
        }

        this.isCheckingStunning = true;
            
        let damageTimeSpan = 0;

        for(let i = 0; i < 4; i++){
            damageTimeSpan = this.getDamagedTimeHistory()[i] - damageTimeSpan;
        }

        let recovered = Phaser.Math.Between(1, 5) == 1;

        if(!this.isStunned){
            this.isStunned = damageTimeSpan <= 1600 && !recovered;
        }

        if(!this.stunnedTimer && this.isStunned && !recovered){
            this.displayIndicativeTextTween("Stunned!");

            let stunDuration = Phaser.Math.Between(1, 5)*1000;

            this.tintInterval = this.getScene().tweens.add({
                targets: object,
                tint: 0xcad4a5,
                duration: 200,
                repeat: -1, 
                yoyo: true
            });


            this.stunnedTimer = this.scene.time.delayedCall(stunDuration, () =>{
                if(this.isAlive){
                    this.displayIndicativeTextTween("Recovered!");
                }  

                this.isStunned = false;
                object.clearTint(); 

                this.tintInterval.stop();
                this.stunnedTimer.destroy();    
            });
        }

        this.isCheckingStunning = false;
    }

    /**
     * Method that allows the creation of and indicative text.
     * Comes with a preset config, but can be changed by passing a custom config.
     * @param {Phaser.Text} text
     * @param {Object} config
     * @returns {Phaser.Text}
     */
    createIndicativeText(text, config){
        if(!config){
            config = {
                fontFamily: "Arial",
                fontSize: 24,
                color: "#ff0000",
                align: "center",
                stroke: "#000000",
                strokeThickness: 2,
                alpha: 1
            }
        }
        return this.getScene().add.text(this.getPositionX(), this.getPositionY(), text, config).setOrigin(0.5, 0.5);
    }

    /**
     * Method that returns the tween animation for the indicative text
     * @param {String} textName 
     * @param {Number} duration 
     * @returns 
     */
    displayIndicativeTextTween(textName, duration = 1000){
        const target = this.indicativeTexts[textName];
        target.setPosition(this.x, this.y);
        target.setVisible(true);
        target.setAlpha(1);
        
        return this.getScene().tweens.add({
            targets: target,
            y: target.y - 50,
            alpha: 0,
            scaleX: 0.5,
            scaleY: 0.5,
            duration: duration,
            ease: "Cubic",
            onComplete: () => {
                target.setVisible(false);
            },
        });
    }

    /**
     * Allows to add a child object to the Living sprite.
     * @param {Sprite} child 
     */
    addChild(child){
        child.relativePosition = {x: child.x, y: child.y};

        this.getScene().physics.add.existing(child, false);
        this.children.push(child);
    }

    /**
     * Removes all children of the Living sprite.
     */
    destroyChildren(){
        this.children.forEach(function(child){
            child.destroy();
        });
    }

    
    /**
     * Resets the original state of the sprite object to its initial values.
     */
    reset(){
        this.isAlive = true;
        this.setMaxHealth(this.config.maxHealth);
        // this.getStateMachine().transitionToState("Idle");
        this.disableBody(false);
        this.setVisible(true);
        this.setActive(true);
        this.setPositionInFreeSpace();
        this.setAlpha(1);

        if(this.getRaycaster() && this.getDebug()){
            const {graphicRays} = this.getRaycaster();
            graphicRays.callAll("setPosition", this.getPositionX(),this.getPositionY());
            graphicRays.callAll("setVisible", true);
            graphicRays.callAll("setActive", true);
            graphicRays.setVelocity(0);
        }

        if(this.enemy3D){
            this.enemy3D.setVisible(true);
            this.enemy3D.setActive(true);
        }
    }

    /**
     * Disables the Living sprite.
     */
    disable(){
        this.setPosition(0,0);
        this.setVelocity(0);
        this.setVisible(false);
        this.setActive(false);
        if(this.getRaycaster() && this.getDebug()){
            const {graphicRays} = this.getRaycaster();
            graphicRays.callAll("setPosition", 0,0);
            graphicRays.callAll("setVisible", false);
            graphicRays.callAll("setActive", false);
            graphicRays.setVelocity(0);
        }

        if(this.enemy3D){
            this.enemy3D.setVisible(false);
            this.enemy3D.setActive(false);
        }
    }
}