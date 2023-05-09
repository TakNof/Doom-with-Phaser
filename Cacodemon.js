class Cacodemon{
    constructor(scene, amount, wallMatrix, wallNumberRatio, wallBlockSize, defaultVelocity, chaseDistance, allowChase){
        this.scene = scene;
        this.amount = amount;
        this.wallMatrix = wallMatrix;
        this.wallNumberRatio = wallNumberRatio;
        this.blockSize = wallBlockSize;
        this.defaultVelocity = defaultVelocity;
        this.chaseDistance = chaseDistance;
        this.allowChase = allowChase;

        this.enemies = new Array(this.amount);
    }

    create(){        
        let enemiesPlaced = 0;
        let enemyPosition;

        let i;
        let j;
        while(enemiesPlaced < this.amount){
            enemyPosition = {x: 0, y: 0};
            i = this.getRndInteger(0, this.wallNumberRatio.y);
            j = this.getRndInteger(0, this.wallNumberRatio.x);

            if(this.wallMatrix[i][j] === false){
                enemyPosition.x = (j*32 + 32);
                enemyPosition.y = (i*32 + 32);

                //Here we create an enemy.
                this.enemies[enemiesPlaced] =  new Enemy(this.scene, [enemyPosition.x, enemyPosition.y, 0], "small_cacodemon", wallBlockSize*2, 1, defaultVelocity, chaseDistance, allowChase);

                //We pass load the player position due we need the enemy to chase the player.
                this.enemies[enemiesPlaced].setAngleToPlayer = player.getPosition;
                
                //Here we stablish the raycaster of the enemy, we pass it as well the matrix of walls.
                this.enemies[enemiesPlaced].setRaycaster(walls.getWallMatrix, 1, enemyangleOffset);
                this.enemies[enemiesPlaced].getRaycaster.setAngleStep();
                
                //Here we put the color of the rays of the enemy.
                this.enemies[enemiesPlaced].setSpriteRays(colors.blackColor);

                //We create an sprite that will be the 3D representation of the enemy.
                this.enemies[enemiesPlaced].setEnemy3D(canvasSizeX/2, canvasSizeY*1.5, "cacodemon");

                //We set all the elements we need to collide with the walls.
                this.enemies[enemiesPlaced].setColliderElements();

                enemiesPlaced += 1;
            }
        }

        this.setColliders();
    }

    /**
     * Gets the enemies list.
     * @returns {Array<Enemy>}
     */
    get getEnemies(){
        return this.enemies;
    }

    /**
     * Sets the colliders of the enemies.
     */
    setColliders(){
        for(let enemy1 of this.enemies){
            for(let enemy2 of this.enemies){
                this.scene.physics.add.collider(enemy1.getColliderElements, enemy2.getColliderElements);
            }
        }
    }

    /**
     * This method corrects the depth of the 3D sprites of the enemies, due to the new 
     */
    correctSpriteDepth(){
        let distances = Array(this.amount);

        for(let i = 0; i < this.amount; i++){
            distances[i] = [this.enemies[i].getDistanceToPlayer, i];
        }

        distances.sort();

        for(let i = 0; i < this.amount; i++){
            distances[i][0] = this.amount - i;
        }

        distances.sort();

        for(let i = 0; i < this.amount; i++){
            this.enemies[i].getEnemy3D.setDepth = distances[i][0];
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