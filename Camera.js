class Camera{
    /**
     * 
     * @param {Phaser.Scene} scene The scene to render the elements.
     * @param {Number} fov The field of view of the camera in radians.
     * @param {Player} player A player object from the Player Class.
     */
    constructor(scene, fov, player){
        this.scene = scene;
        
        this.fov = fov;
        this.player = player;
        this.setPlayerGlobalAngle();

        this.fovArcLenght = canvasSize.width;

        this.fovArcRadius = this.fovArcLenght/this.fov;
    }

    /**
     * Gets the radius of the fov arc.
     * @returns {Number} 
     */
    getFovArcRadius(){
        return this.fovArcRadius;
    }


    /**
     * Sets the angle of the player into global degrees scale, then the method setArcAngles is called.
     */
    setPlayerGlobalAngle(){
        this.playerGlobalAngle = adjustAngleValue(this.player.getAngleRadians() + this.player.getOriginInfo().angleOffset);
        this.setArcAngles();
    }

    /**
     * Gets the global angle of the player.
     * @returns {Number}
     */
    getPlayerGlobalAngle(){
        return this.playerGlobalAngle;
    }

    /**
     * Sets the angles of the fov arc to make the graphication.
     */
    setArcAngles(){
        this.arcAngles = {
            x0: adjustAngleValue(this.getPlayerGlobalAngle() - this.fov/2),
            x1024:adjustAngleValue(this.getPlayerGlobalAngle() + this.fov/2)
        };
    }

    /**
     * Gets the angles of the fov arc to make the graphication.
     * @returns {Number}
     */
    getArcAngles(){
        return this.arcAngles;
    }

    /**
     * Sets the enemies to the located acording to the camera.
     * @param {Array<Enemy>} enemies 
     */
    setEnemies(enemies){
        this.enemies = enemies;
    }

    /**
     * This method draws the whole 3D world graphication.
     */
    draw3DWorld(){
        this.player.getGraphicator().redraw3DScaling(this.player.getRayData().distance, this.player.getRayData().typeOfHit);
        // this.player.getGraphicator().ableRectanglesVisibility(false);

        this.setPlayerGlobalAngle();

        if(this.enemies[0] instanceof Enemy){
            this.drawEnemy();
        }
    }

    /**
     * This method draws the enemy in the screen adjusting its coordinates in x and y axis,
     * its scale and its visibility acording to the angle from it is being seen.
     */
    drawEnemy(){
        for(let enemy of this.enemies){
            if(enemy.getHealth() != 0){
                enemy.setNewEnemy3D(this.drawEnemyElements(enemy.getEnemy3D(), this.player.angleToElement(enemy.getPosition()), enemy.getDistanceToPlayer(), 200, 1.5));
            }

            for(let [i, projectile2D] of enemy.getProjectiles2D().getChildren().entries()){
                if(projectile2D.active){
                    let projectile3D = enemy.getProjectiles3D().getChildren()[i];
                    projectile3D.active = true;

                    if(projectile3D){
                        projectile3D = this.drawEnemyElements(
                            projectile3D,
                            this.player.angleToElement(projectile2D.getPosition()),
                            hypoCalc(
                                projectile2D.getPositionX(),
                                this.player.getPositionX(),
                                projectile2D.getPositionY(),
                                this.player.getPositionY()
                            ),
                            1000,
                            1.65
                        );
                    }
                }else{
                    continue;
                }
            }
        }        
    }

    /**
     * Due we need to calculate multiple elements comming from the enemy,
     * we created this general method with the stablished procedure.
     * @param {Array} elements
     * @param {Array<Number>} anglePlayerToElement
     */
    drawEnemyElements(element, anglePlayerToElement, distanceToPlayer, scaleDivisor, heightMultiplier){     
        /**
         * According to the adjust values calculeted previously, the evaluation values of the player's fov angles will change between 0 and 1,
         * the 1 in the adjust value will allow the angle of that fov end to substract or add a whole lap. With that, the conditional will work
         * properly, avoiding the issue of the angle reset when reaching 360 degrees or 2PI radians.
         */
        if(this.checkElementWithinFOV(anglePlayerToElement) && element.active){
            element.visible = true;
            let enemyHeight = this.player.getGraphicator().setEnemyHeight(distanceToPlayer);
            
            if(enemyHeight/scaleDivisor > 2.5){
                element.scaleY = 2.5;
                element.scaleX = 2.5;
            }else{
                element.scaleY = enemyHeight/scaleDivisor;
                element.scaleX = enemyHeight/scaleDivisor;
            }
            
            element.x = this.drawElementByPlayerPov(anglePlayerToElement);
            element.y = (heightMultiplier*canvasSize.height/3 + canvasSize.height/enemyHeight);  
            
            element.setDepth(1000 - (distanceToPlayer/10).toFixed(0));            
        }else{
            element.visible = false;
        }

        return element;
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
            return this.fovArcRadius*(currentAngle - this.getArcAngles().x0);
        }else{
            return this.fovArcLenght - this.fovArcRadius*(this.getArcAngles().x1024 - currentAngle);
        }
    }

    /**
     * Checks if the object is visible in player's FOV.
     * @param {Number} anglePlayerToElement 
     * @returns {boolean}
     */
    checkElementWithinFOV(anglePlayerToElement){
        /** 
         * The reset of the degrees of rotation of the elements its a big issue with verifying the visibility of an object.
         * With these conditionals we solve that issue. If the x0 angle is greater than the x1024 angle, it means the second
         * fov angle has done a loop already, so we use other conditional checking if the angle of the element is greater than
         * the first fov angle or if it is less than the second fov angle.
         * 
         * In case the x1024 angle is greater than the x0 angle, the procedure would be the normal procedure of checking 
         * if the angle of the element is withing the range of the angles of the fov.
         */
        if (this.getArcAngles().x0 > this.getArcAngles().x1024) {
            return !!(anglePlayerToElement >= this.getArcAngles().x0 || anglePlayerToElement <= this.getArcAngles().x1024);
        } else {
            return !!(anglePlayerToElement >= this.getArcAngles().x0 && anglePlayerToElement <= this.getArcAngles().x1024);
        }
    }

}