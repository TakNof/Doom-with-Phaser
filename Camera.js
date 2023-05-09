/**
 * Class needed for the creation of the 3D environment according to a POV.
 */
class Camera{
    /**
     * The constructor of Camera Class.
     * @param {Scene} scene The scene to render.
     * @param {{x: number, y: number}} canvasSize The size of the canvas to place the camera.
     * @param {number} fov The degrees of view of the camera. 
     * @param {Player} player A player object from the Player Class.
     * @param {[Enemy]} enemies2D An array of enemy objects from the Enemy Class.
     */
    constructor(scene, canvasSize, fov, player, enemies2D){
        this.scene = scene;
        this.canvasSize = {x: parseInt(canvasSize.split("x")[0]), y: parseInt(canvasSize.split("x")[1])};

        this.fov = fov;
        this.player = player;
        this.setPlayerGlobalAngle();
        this.setArcAngles();

        this.fovArcLenght = this.canvasSize.x;

        this.fovArcRadius = this.fovArcLenght/this.fov;
        this.enemies2D = enemies2D;
        this.amountEnemies2D = enemies2D.length;
        this.enemyAngleToPlayerInv = Array(this.amountEnemies2D);

        if(this.enemies2D[0] instanceof Enemy){
            this.setEnemyAngleToPlayerInv();
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
            this.enemyAngleToPlayerInv[i] = this.enemies2D[0].adjustAngleValue(this.enemies2D[i].getAngleToPlayer + Math.PI);
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
    drawElementByPlayerPov(index){
        /**
         * This if statement allows to change the pivot angle of the fov of the player,
         * to avoid miscalculations in the graphication of the enemy due to the angular reset
         * when a lap is completed.
         * 
         * If the angle of the player respect to the enemy is located within the fourth quadrant of the region,
         * then the calculations will be done with the x0 angle, else the calculations will be done with
         * the x1024 angle.
         */
        if(this.enemyAngleToPlayerInv[index] > 3*Math.PI/2){
            return this.fovArcRadius*(this.enemyAngleToPlayerInv[index] - this.getArcAngles.x0);
        }else{
            return this.fovArcLenght -this.fovArcRadius*(this.arcAngles.x1024 - this.enemyAngleToPlayerInv[index]);
        }
    }

    /**
     * This method draws the enemy in the screen, adjusting its coordinates in x and y axis, its scale and its visibility acording to the angle from it is being seen.
     */
    drawEnemy(){
        /**
         * This loops depends on the amount of eneimes.
         */

        //Here we update the player's global angle and the enemies inverted angle.
        this.setPlayerGlobalAngle();
        this.setEnemyAngleToPlayerInv();

        let adjust;
        for(let i = 0; i < this.amountEnemies2D; i++){
            adjust = {x0: 0, x1024: 0};

            /** 
             * According to the current inverted angle of the enemy respect to the player, we check if that angle is located in the fourth angle.
             * If so we change the adjust value of the respectrive fov angle, to allow the conditional of the line 136 to check if the enemy is located
             * between the two angles of the fov. 
             */     
            if(this.enemyAngleToPlayerInv[i] + Math.PI/2 >= 2*Math.PI){
                adjust.x1024 = 1;
            }else if(this.enemyAngleToPlayerInv[i] - Math.PI/2 <= 0){
                adjust.x0 = 1;
            }
            
            /**
             * According to the adjust values calculeted previously, the evaluation values of the player's fov angles will change between 0 and 1,
             * the 1 in the adjust value will allow the angle of that fov end to substract or add a whole lap. With that, the conditional will work
             * properly, avoiding the issue of the angle reset when reaching 360 degrees or 2PI radians.
             */
            if(this.enemyAngleToPlayerInv[i] > this.getArcAngles.x0 - 2*Math.PI*adjust.x0 && this.enemyAngleToPlayerInv[i] < this.getArcAngles.x1024 + 2*Math.PI*adjust.x1024){
                this.enemies2D[i].getEnemy3D.setVisible = true;

                let enemyHeight = this.player.getGraphicator.setEnemyHeight(this.enemies2D[i].getDistanceToPlayer);
                
                if(enemyHeight/200 > 2.5){
                    this.enemies2D[i].getEnemy3D.setScaleY = 2.5;
                    this.enemies2D[i].getEnemy3D.setScaleX = 2.5;
                }else{
                    this.enemies2D[i].getEnemy3D.setScaleY = enemyHeight/200;
                    this.enemies2D[i].getEnemy3D.setScaleX = enemyHeight/200;
                }
                
                this.enemies2D[i].getEnemy3D.setPositionX = this.drawElementByPlayerPov(i);
                this.enemies2D[i].getEnemy3D.setPositionY = (this.canvasSize.y + 0.5*this.canvasSize.y);
        
                this.enemies2D[i].getEnemy3D.setDepth = 3;
                
            }else{
                this.enemies2D[i].getEnemy3D.setVisible = false;
            }
            
            //If the wall is closer to the enemy than the player, we need to set the depth of the enemy behind of the depth of the walls.
            if(this.enemies2D[i].getDistanceToPlayer > this.enemies2D[i].getRayData.distance[0]){
                this.enemies2D[i].getEnemy3D.setDepth = 0;
            }
        }
    }
}