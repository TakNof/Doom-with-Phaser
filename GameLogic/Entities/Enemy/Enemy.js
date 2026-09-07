/**
 * This class extends to Living class, due the "living" sprites could be
 * players or enemies. Furthermore, this class implements all the movement controlers for the enemy/s.
 */

class Enemy extends Living{
    /**
    * The constructor of Enemy Class.
    * @constructor
    * @param {Phaser.Scene} scene2D The scene to place the sprite in the game.
    * @param {Phaser.Scene} scene3D The scene to place the 3D sprite in the game.
    * @param {{x: Number, y: Number}} worldOriginInfo A literal Object with the initial positioning information for the sprite.
    * @param {Object} config The configuration object for the Enemy.
    */
    constructor(scene2D, scene3D, worldOriginInfo, config){
        super(scene2D, scene3D, worldOriginInfo, config);
        this.scene3D = scene3D;
        // this.setTexture(`small_${config.name}`);

        
        this.target = this.scene.player;
        this.getRaycaster().setTarget(this.target);
        this.setPathFinder();

        this.projectiles = new ProjectileGroup(this.scene, this, [this.scene.walls.walls, this.target], 10, config.bulletConfig);


        this.targetInSight = false;
        this.stunned = false;

        this.lastAttackTimer = config.attackDelay;
        this.showInfo = false;
        this.nextFire = 0;

        if(this.showInfo){
            this.setInfoTexts();
        }

        this.enemy3D = new Sprite(this.scene3D, {x: canvasSize.width/2, y: canvasSize.height/2}, config.name);
    }

    /**
     * Sets the distance between the Target and the enemy using the Target's position. 
     */
    setDistanceToTarget(){
        this.distanceToTarget = Phaser.Math.Distance.BetweenPoints(this.getPosition(), this.target.getPosition());            
    }
    
    /**
     * Gets the distance between the Target and the enemy.
     * @return {number}
     */
    getDistanceToTarget(){
        return this.distanceToTarget;
    }

    checkTargetInSight(){
        this.targetInSight = this.getDistanceToTarget() < this.getRaycaster().calculateRayData()[0].distance;
    }
    
    /**
     * Sets the pathFinder object, used by the Enemy to find its path to the Target.
     */
    setPathFinder(){
        this.pathFinder = new PathFinder(this.getScene(), this, this.scene.walls);
    }

    /**
     * Gets the pathFinder object.
     * @returns {PathFinder}
     */
    getPathFinder(){
        return this.pathFinder;
    }

    /**
     * Makes the sprite to aim to the desired coordinates.
     * @param {{x: Number, y: Number}} point 
     */
    aimToCoordinates(point){
        let targetAngle = Phaser.Math.Angle.BetweenPoints(this.getPosition(), point);
        this.setAngle(Phaser.Math.RadToDeg(adjustAngleValue(targetAngle) - this.config.angleOffset));
    }
    
    /**
     * Moves the enemy towards the designated target.
     */
    moveToTarget(){
        this.aimToCoordinates(this.target.getPosition());
        this.move();
    }

    /**
     * Moves the enemy along the path of the pathfinder.
     */
    moveToPoint(){
        try {
            const pathFinder = this.getPathFinder();
            const {size} = pathFinder.walls.config;
            const {path} = pathFinder;

            if (path.length === 0) {
                pathFinder.clearPath();
                return;
            }
            
            const distance = (point) =>{
                const dx = (point.x + 0.5)*size - this.getPositionX();
                const dy = (point.y + 0.5)*size - this.getPositionY();
                return Math.sqrt(dx * dx + dy * dy);
            }
            const targetPoint = path.length > 1 ? (distance(path[0]) < distance(path[1]) ? path[0] : path[1]) : path[0];
    
            let dx = (targetPoint.x + 0.5)*size - this.getPositionX();
            let dy = (targetPoint.y + 0.5)*size - this.getPositionY();
            // console.log(Math.abs(dx), Math.abs(dy));
    
            if(Math.abs(dx) < this.size && Math.abs(dy) < this.size){
                if(pathFinder.markers.length > 0){
                    pathFinder.markers[0].destroy();
                    pathFinder.markers.shift();
                }
                path.shift();
                pathFinder.lastPointReachedTime = this.scene.time.now;
                this.setVelocity(0);
                // console.log("Deleting step");
                return;
            }
    
            let worldTargetPoint = {
                x: (targetPoint.x + 0.5)*size,
                y: (targetPoint.y + 0.5)*size
            };
    
            this.aimToCoordinates(worldTargetPoint);
            this.move();

        } catch (error) {
            console.log("Not path found");
        }
    }

    /**
     * Allows the movement of the enemy.
     */
    move(){
        this.setXcomponent();
        this.setYcomponent();
        this.setVelocityX(this.getXcomponent());
        this.setVelocityY(this.getYcomponent());  
    }

    setInfoTexts(){
        this.infoToShow = [`State: ${this.getStateMachine().currentState.stateKey}`, `Player in Sight: ${this.targetInSight}`, `VelocityX: ${this.getVelocityX()}`];
        
        this.infoTexts = new Array(this.infoToShow.length);
        for(let i = 0; i < this.infoTexts.length; i++){
            this.infoTexts[i] = this.scene.add.text(0, 0, "", {fontSize: '24px',fill: '#ffffff'});
        }
    }

    updateInfoTexts(){
        this.infoToShow = [`State: ${this.getStateMachine().currentState.stateKey}`, `Player in Sight: ${this.targetInSight}`, `VelocityX: ${this.getVelocityX()}`];
        for(let i = 0; i < this.infoTexts.length; i++){
            this.infoTexts[i].x = this.x - 60;
            this.infoTexts[i].y = this.y - 100 + (i * 24);
            this.infoTexts[i].text = this.infoToShow[i];
        }
    }

    update(frameFactor = 1){
        //Enemy movement already goes through Arcade Physics velocities (scaled by
        //delta) and its turning snaps to an absolute angle, so it's refresh-rate
        //independent as-is. `frameFactor` is stored only for any future per-frame math.
        this.frameFactor = frameFactor;
        if(this.isAlive){
            this.setDistanceToTarget();
            this.getStateMachine().update();
            this.getRaycaster().update();
            this.checkTargetInSight();
            this.updateSoundPaning();
            this.projectiles.updateSoundPaning();
            if(this.showInfo){
                this.updateInfoTexts();
            }
        }
    }
}

class EnemyGroup extends Phaser.Physics.Arcade.Group{
    /**
     * The constructor for the EnemyGroup class.
     * @constructor
     * @param {Phaser.Scene} scene2D The scene to place the sprite in the game.
     * @param {Phaser.Scene} scene3D The scene to place the 3D sprite in the game.
     * @param {Number} amount The amount of enemies to place.
     * @param {Number} maxSize The maximum amount of enemies to place.
     * @param {Object} config The enemy object to make the copies of.
     */
    constructor(scene2D, scene3D, amount, maxSize, config){
        super(scene2D.physics.world, scene2D);
        this.maxSize = maxSize;

        let className = this.__checkClassConstructor(config.name.charAt(0).toUpperCase() + config.name.slice(1), "Enemy");
        for(let i = 0; i < amount; i++){
            this.add(new className(scene2D, scene3D, {x: 0, y:0}, config));
        }
        scene2D.physics.add.collider(this);
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
    
    groupCollidersElements(){
        let colliderElements = [];

        this.getChildren().forEach(function (enemy) {
            colliderElements = [...colliderElements, ...enemy.colliderElements()];
        });

        return colliderElements;
    }
}