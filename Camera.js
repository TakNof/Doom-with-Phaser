/**
 * Class needed for the creation of the 3D environment according to a POV.
 */
class Camera{
    /**
     * The constructor of Camera Class.
     * @param {Scene} scene The scene to render.
     * @param {{x: number, y: number}} canvasSize The size of the canvas to place the camera.
     * @param {number} fov The view of the camera in radians. 
     * @param {Player} player A player object from the Player Class.
     * @param {[Enemy]} enemies2D An array of enemy objects from the Enemy Class.
     */
    constructor(scene, canvasSize, fov, player, enemies2D){
        this.scene = scene;
        this.canvasSize = canvasSize;

        this.fov = fov;
        this.player = player;
        this.setPlayerGlobalAngle();
        this.setArcAngles();

        this.fovArcLenght = this.canvasSize.width;

        this.fovArcRadius = this.fovArcLenght/this.fov;
        this.setEnemies(enemies2D);
        
    }

    /**
     * Sets the enemies to the located acording to the camera.
     * @param {Array<Enemy>} enemies 
     */
    setEnemies(enemies){
        this.enemies2D = enemies;
        this.amountEnemies2D = this.enemies2D.length;
        this.enemyAngleToPlayerInv = Array(this.amountEnemies2D);
        this.enemy3DSprites = Array(this.amountEnemies2D);
        this.enemyDistances = Array(this.amountEnemies2D);

        this.projectiles2DSprites = Array(this.amountEnemies2D);
        this.projectiles3DSprites = Array(this.amountEnemies2D);
        this.projectilesDistances = Array(this.amountEnemies2D);
        this.projectilesAngleToPlayerInv = Array(this.amountEnemies2D);


        if(this.enemies2D[0] instanceof Enemy){
            this.setEnemyAngleToPlayerInv();
            this.setEnemy3DSprites();
            this.setEnemyDistances();
        }
    }

    /**
     * Sets angle limits of each end of the players FOV.
     */
    setArcAngles(){
        this.arcAngles = {
            x0: this.player.adjustAngleValue(this.playerGlobalAngle - this.fov/2),
            x1024:this.player.adjustAngleValue(this.playerGlobalAngle + this.fov/2)
        };
    }

    get getFOVArcRadius(){
        return this.fovArcRadius;
    }
    
    /**
     * Gets the angle limits of each end of the players FOV.
     * @returns {Object}
     */
    get getArcAngles(){
        return this.arcAngles;
    }

    /**
     * Sets the angle of the player into global degrees scale, then the method setArcAngles is called.
     */
    setPlayerGlobalAngle(){
        this.playerGlobalAngle = this.player.adjustAngleValue(this.player.getAngle + 3*Math.PI/2);
        this.setArcAngles();
    }

    /**
     * Gets the global angle of the player.
     */
    get getPlayerGlobalAngle(){
        return this.playerGlobalAngle;
    }

    /**
     * Sets all the enemies inverted angles to the player (which is actually the player angle to the enemy).
     */
    setEnemyAngleToPlayerInv(){
        for(let i = 0; i < this.amountEnemies2D; i++){
            this.enemyAngleToPlayerInv[i] = this.enemies2D[0].adjustAngleValue(this.enemies2D[i].getAngleToElement + Math.PI);
        }
    }

    /**
     * Gets all the enemies inverted angles to the player.
     * @returns {Array}
     */
    get getEnemyAngleToPlayerInv(){
        return this.enemyAngleToPlayerInv;
    }

    /**
     * Sets the list of enemy 3D sprites.
     */
    setEnemy3DSprites(){
        for(let i = 0; i < this.amountEnemies2D; i++){
            this.enemy3DSprites[i] = this.enemies2D[i].getEnemy3D;
        }
        
    }

    /**
     * Gets the list of enemy 3D sprites.
     * @returns {Array}
     */
    get getEnemy3DSprites(){
        return this.enemy3DSprites;
    }

    /**
     * Sets the list of distances of the enemies.
     */
    setEnemyDistances(){
        for(let i = 0; i < this.amountEnemies2D; i++){
            this.enemyDistances[i] = this.enemies2D[i].getDistanceToPlayer;
        }
    }

    /**
     * Gets the list of distances of the enemies.
     * @returns {Array}
     */
    get getEnemyDistances(){
        return this.enemyDistances;
    }

    
    /**
     * Sets all the enemies inverted angles to the player (which is actually the player angle to the enemy).
     */
    setProjectilesAngleToPlayerInv(playerPosition){
        for(let i = 0; i < this.amountEnemies2D; i++){
            this.projectilesAngleToPlayerInv[i] =
            this.enemies2D[0].adjustAngleValue(
                this.angleToElement({
                    x: this.enemies2D[i].getProjectiles2D.x,
                    y: this.enemies2D[i].getProjectiles2D.y
                },
                playerPosition
                ));
        }
    }

    /**
     * Gets all the enemies inverted angles to the player.
     * @returns {Array}
     */
    get getProjectilesAngleToPlayerInv(){
        return this.ProjectilesAngleToPlayerInv;
    }

    /**
     * Sets the list of Projectiles 3D sprites.
     */
    setProjectiles3DSprites(){
        for(let i = 0; i < this.amountEnemies2D; i++){
            this.projectiles3DSprites[i] = this.enemies2D[i].getProjectiles3D.getChildren();
        }
    }

    /**
     * Gets the list of Projectiles 3D sprites.
     * @returns {Array}
     */
    get getProjectiles3DSprites(){
        return this.projectiles3DSprites;
    }

    /**
     * Sets the list of Projectiles 2D sprites.
     */
    setProjectiles2DSprites(){
        for(let i = 0; i < this.amountEnemies2D; i++){
            this.projectiles2DSprites[i] = this.enemies2D[i].getProjectiles2D.getChildren();
        }
    }

    /**
     * Gets the list of Projectiles 2D sprites.
     * @returns {Array}
     */
    get getProjectiles2DSprites(){
        return this.projectiles2DSprites;
    }

    /**
     * Sets the list of distances of the enemies.
     */
    setProjectilesDistances(){
        for(let i = 0; i < this.amountEnemies2D; i++){
            this.projectilesDistances[i] =
            this.hypoCalc(
                this.enemies2D[i].getProjectiles2D.x, this.player.getPositionX,
                this.enemies2D[i].getProjectiles2D.y, this.player.getPositionY
            );
        }
    }

    /**
     * Gets the list of distances of the enemies.
     * @returns {Array}
     */
    get getProjectilesDistances(){
        return this.projectilesDistances;
    }
    


    
    /**
     * This method draws the whole 3D world graphication.
     */
    draw3DWorld(){
        this.player.getGraphicator.redraw3DScaling(this.player.getRayData.distance, this.player.getRayData.typeOfHit);
        if(this.enemies2D[0] instanceof Enemy){
            this.drawEnemy();
        }
    }

    /**
     * This method calculates the position of the enemy in the screen according to the angle from it is being seen.
     * @param {number} index The index of the for loop to access the list of the enemies inverted angles.
     * @returns {number}
     */
    drawElementByPlayerPov(currentAngle){
        /**
         * This if statement allows to change the pivot angle of the fov of the player,
         * to avoid miscalculations in the graphication of the enemy due to the angular reset
         * when a lap is completed.
         * 
         * If the angle of the player respect to the enemy is located within the fourth quadrant of the region,
         * then the calculations will be done with the x0 angle, else the calculations will be done with
         * the x1024 angle.
         */
        if(currentAngle > 3*Math.PI/2){
            return this.fovArcRadius*(currentAngle - this.getArcAngles.x0);
        }else{
            return this.fovArcLenght -this.fovArcRadius*(this.arcAngles.x1024 - currentAngle);
        }
    }

    /**
     * This method draws the enemy in the screen, adjusting its coordinates in x and y axis, its scale and its visibility acording to the angle from it is being seen.
     */
    drawEnemy(){
        //Here we update the player's global angle and the enemies inverted angle.
        this.setPlayerGlobalAngle();
        this.setEnemyAngleToPlayerInv();
        this.setEnemy3DSprites();
        this.setEnemyDistances();

        if(this.enemies2D[0].getProjectiles2D !== undefined){
            this.setProjectiles2DSprites();
            this.setProjectiles3DSprites();
            this.setProjectilesAngleToPlayerInv(this.player.getPosition);
            this.setProjectilesDistances();
        }
        
        let distances = Array(this.amountEnemies2D);
        for(let i = 0; i < this.amountEnemies2D; i++){
            this.enemies2D[i].setNewEnemy3D = this.drawEnemyElements(this.enemies2D[i].getEnemy3D.getSprite, this.enemyAngleToPlayerInv[i], this.enemies2D[i].getDistanceToPlayer, 200, 1.5);
        }

        for(let enemy of this.enemies2D){
            for(let i = 0; i < enemy.getProjectiles2D.getChildren().length; i++){
                enemy.getProjectiles3D.getChildren()[i] = this.drawEnemyElements(
                    enemy.getProjectiles3D.getChildren()[i],
                    this.angleToElement({
                        x: enemy.getProjectiles2D.getChildren()[i].x,
                        y: enemy.getProjectiles2D.getChildren()[i].y
                        },
                        this.player.getPosition
                    ) + Math.PI,
                    this.hypoCalc(
                        enemy.getProjectiles2D.getChildren()[i].x, this.player.getPositionX,
                        enemy.getProjectiles2D.getChildren()[i].y, this.player.getPositionY
                    ),
                    1000,
                    1.5
                );
            }
        }
        
        /**
         * This for loop is used to analize the distance of each enemy and estimate the depth of drawing of the enemy
         */
        for(let i = 0; i < this.amountEnemies2D; i++){
            if(this.enemies2D[i].getEnemy3D.getVisible){
                for(let j = 0; j < this.amountEnemies2D; j++){
                    distances[j] = [this.enemies2D[j].getDistanceToPlayer, j];
                }

                distances.sort(function(a, b) {
                    return a[0] - b[0];
                });

                for(let j = 0; j < this.amountEnemies2D; j++){
                    distances[j][0] = this.amountEnemies2D - j + 2;
                }

                distances.sort(function(a, b) {
                    return a[1] - b[1];
                });

                for(let i = 0; i < this.amountEnemies2D; i++){
                    //If the wall is closer to the enemy than the player, we need to set the depth of the enemy behind of the depth of the walls.
                    if(this.enemies2D[i].getDistanceToPlayer > this.enemies2D[i].getRayData.distance[0]){
                        this.enemies2D[i].getEnemy3D.setDepth = 0;
                    }else{
                        this.enemies2D[i].getEnemy3D.setDepth = distances[i][0];
                    }
                }
            }
            
        }
    }

    /**
     * Due we need to calculate multiple elements comming from the enemy, create this general method with
     * the stablished procedure.
     * @param {Array} elements
     * @param {Array<Number>} angleElementToPlayer
     */
    drawEnemyElements(element, angleElementToPlayer, distanceToPlayer, scaleDivisor, heightMultiplier){
        let adjust;
       
        adjust = {x0: 0, x1024: 0};

        /** 
         * According to the current angle of the element respect to the player, we check if that angle is located in the fourth quadrant.
         * If so we change the adjust value of the respectrive fov angle, to allow second conditional to check if the element is located
         * between the two angles of the fov. 
         */     
        if(angleElementToPlayer + Math.PI/2 >= 2*Math.PI){
            adjust.x1024 = 1;
        }else if(angleElementToPlayer - Math.PI/2 <= 0){
            adjust.x0 = 1;
        }
        
        /**
         * According to the adjust values calculeted previously, the evaluation values of the player's fov angles will change between 0 and 1,
         * the 1 in the adjust value will allow the angle of that fov end to substract or add a whole lap. With that, the conditional will work
         * properly, avoiding the issue of the angle reset when reaching 360 degrees or 2PI radians.
         */
        if(angleElementToPlayer > this.getArcAngles.x0 - 2*Math.PI*adjust.x0 && angleElementToPlayer < this.getArcAngles.x1024 + 2*Math.PI*adjust.x1024){
            element.visible = true;
            
            let enemyHeight = this.player.getGraphicator.setEnemyHeight(distanceToPlayer);
            
            if(enemyHeight/scaleDivisor > 2.5){
                element.scaleY = 2.5;
                element.scaleX = 2.5;
            }else{
                element.scaleY = enemyHeight/scaleDivisor;
                element.scaleX = enemyHeight/scaleDivisor;
            }
            
            element.x = this.drawElementByPlayerPov(angleElementToPlayer);
            element.y = (heightMultiplier*this.canvasSize.height - this.canvasSize.height/enemyHeight);  
            
                
            
        }else{
            element.visible = false;
        }

        return element;
    }

    /**
     * This method stablishes the angle of the enemy respect to the element.
     * @param {number} elementPosition1 The position of the element1.
     * @param {number} elementPosition2 The position of the element2.
     * @returns {number} 
     */
    angleToElement(elementPosition1, elementPosition2){
        if(elementPosition1.x > elementPosition2.x){
            return Math.atan((elementPosition1.y - elementPosition2.y)/(elementPosition1.x - elementPosition2.x)) + Math.PI;
        }else{
            return Math.atan((elementPosition1.y - elementPosition2.y)/(elementPosition1.x - elementPosition2.x))
        }
    }

    /**
     * This method calculates the distance between 2 coordinates.
     * @param {number} x1 The x coordinate of the first sprite.  
     * @param {number} x2 The x coordinate of the second sprite. 
     * @param {number} y1 The y coordinate of the first sprite. 
     * @param {number} y2 The y coordinate of the second sprite. 
     * @returns {number} The hyphypotenuse according to the specified coordinates.
     */
    hypoCalc(x1, x2, y1, y2){
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
    }
}