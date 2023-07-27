class Cacodemon{
    /**
     * The constructor for the Cacodemon class.
     * @param {Scene} scene The current scene of the game to place the sprite.
     * @param {Number} amount The amount of enemies to place.
     * @param {[[Sprite]]} wallMatrix The matrix used to placer the walls.
     * @param {{x: Number, y: Number}} wallNumberRatio The ratio of walls that can be placed on the canvas.
     * @param {Number} wallBlockSize The size of the wall blocks
     * @param {Number} defaultVelocity The default velocity to set on the enemies.
     * @param {Number} chaseDistance The distance (in pixels) the enemies will be allowed to chase the player.
     * @param {Boolean} allowChase If the enemies will be allowed to chase the player. 
     */
    constructor(scene, scene3D, amount, wallsObject, defaultVelocity, chaseDistance, allowChase){
        this.scene = scene;
        this.scene3D = scene3D;
        this.amount = amount;
        this.wallMatrix = wallsObject.getWallMatrix;
        this.wallNumberRatio = wallsObject.getWallNumberRatio;
        this.blockSize = wallsObject.getWallBlockSize;
        this.defaultVelocity = defaultVelocity;
        this.chaseDistance = chaseDistance;
        this.allowChase = allowChase;

        this.enemies = new Array(this.amount);

        this.bulletProperties = {damage: 12, velocity: 200, delay: 3500, critical: 1.5};
        this.distanceLimits = {min: 250, max: 1000};
        
    }

    /**
     * Here we create all the enemies.
     * @param {boolean} debugValue Whether to debug the enemies or not. 
     */
    create(enemyAngleOffset, debugValue = false){
        let enemiesPlaced = 0;
        let enemyPosition;

        let i;
        let j;
        while(enemiesPlaced < this.amount){
            enemyPosition = {x: 0, y: 0};
            i = this.getRndInteger(0, this.wallNumberRatio.y);
            j = this.getRndInteger(0, this.wallNumberRatio.x);

            if(!this.wallMatrix[i][j]){
                enemyPosition.x = (j*32 + 32);
                enemyPosition.y = (i*32 + 32);
                enemyPosition.angleOffset = enemyAngleOffset;

                //Here we create an enemy.
                this.enemies[enemiesPlaced] =  new Enemy(this.scene, this.scene3D, enemyPosition, "small_cacodemon", 1,     this.blockSize*2, this.defaultVelocity, this.chaseDistance, this.allowChase);
                
                let enemy = this.enemies[enemiesPlaced];

                //Here we set the particular enemy projetcile properties based on the properties of this class.
                enemy.setBulletProperties(this.bulletProperties);
                enemy.setDistanceLimits(this.distanceLimits);
                
                //Here we stablish the raycaster of the enemy, we pass it as well the matrix of walls.
                enemy.setRaycaster(this.wallMatrix, 1, enemyAngleOffset);
                enemy.getRaycaster().setAngleStep();
                
                //Here we put the color of the rays of the enemy.
                enemy.setDebug(debugValue);
                enemy.setSpriteRays(colors.black);

                enemy.setMaxHealth(250);

                //We set all the elements we need to collide with the walls.
                enemy.setColliderElements();
                enemiesPlaced += 1;
            }
        }

        this.setColliders();
    }

    /**
     * Gets the enemies list.
     * @returns {Array<Enemy>}
     */
    getEnemies(){
        return this.enemies;
    }

    /**
     * Allows all the enemies to move and chase the player.
     * @param {OBject} playerPosition 
     */
    move(playerPosition){
        for(let enemy of this.getEnemies()){
            enemy.move(playerPosition);
        }
    }   

    /**
     * Allows all the enemies to shoot at the player.
     */
    shoot(player){
        for(let enemy of this.getEnemies()){
            enemy.shoot(this.bulletProperties, this.getRndInteger(0, 9), player);
        }
    }

    /**
     * Gets the bullet properties of the cacodemons.
     * @returns {Object}
     */
    getBulletProperties(){
        return this.bulletProperties;
    }

    /**
     * Gets the minimum and maximum distance to deal damage concidering the distance to the object.
     */
    getDistanceLimits(){
        return this.distanceLimits;
    }

    /**
     * Sets the colliders of the enemies.
     */
    setColliders(){
        for(let enemy1 of this.getEnemies()){
            for(let enemy2 of this.getEnemies()){
                this.scene.physics.add.collider(enemy1.getColliderElements, enemy2.getColliderElements);
            }
        }
    }

    /**
     * This method allows us to get a number between the specified range.
     * @param {number} min 
     * @param {number} max 
     * @returns {randomNumber}
     */
    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }
}