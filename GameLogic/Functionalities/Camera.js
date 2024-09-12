class Camera{
    /**
     * The constructor of the Camera Class
     * @constructor
     * @param {Phaser.Scene} scene2D The scene2D to get the info of the elements.
     * @param {Phaser.Scene} scene3D The scene3D to render the elements.
     * @param {Number} fov The field of view of the camera in radians.
     * @param {JSON} config The configuration object for the Camera.
     */
    constructor(scene2D, scene3D, config, owner){
        this.scene2D = scene2D;
        this.scene3D = scene3D;
        this.config = config;
        this.owner = owner;
        this.blocksize = scene2D.wallsConfig.size;

        this.graphicator = new Graphicator(scene3D, this.blocksize, this.config);
    }

    setWorldElements(){
        this.worldElements = this.scene2D.children.list.filter(obj => obj instanceof Enemy);
        this.worldElements = [...this.worldElements, ...this.scene2D.children.list.filter(obj => obj instanceof Item)];
        this.hud = new HUD(this.scene3D, this.worldElements);
    }

    /**
     * Sets the angles of the fov arc to make the graphication.
     */
    setArcAngles(){
        const ownerFixedRotation = this.owner.getRotation() + this.owner.config.angleOffset;
        this.arcAngles = {
            x0: adjustAngleValue(ownerFixedRotation - this.config.fov/2),
            x1024:adjustAngleValue(ownerFixedRotation + this.config.fov/2)
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
     * This method draws the whole 3D world graphication.
     */
    draw3DWorld(){
        this.setArcAngles();
        this.graphicator.redraw3DScaling(this.owner.getRaycaster().calculateRayData());
        this.draw3DWorldElements();
    }

    draw3DWorldElements() {
        for (let element of this.worldElements) {
            const { angle, distance } = this.calculateAngleAndDistance(this.owner.getPosition(), element.getPosition());
    
            if (element instanceof Enemy) {
                this.drawEnemy(element, distance, angle);
                if(element.config.bulletConfig.make3D){
                    this.drawActiveProjectiles(element);
                }
            }

            if(element instanceof Item){
                this.drawElement(element, distance, angle, element.item3D, {height: 1, zPosition: 0})
            }
        }
    }
    
    drawEnemy(enemy, distance, angle) {
        this.drawElement(enemy, distance, angle, enemy.enemy3D, enemy.config);
    }
    
    drawProjectile(projectile, distance, angle) {
        this.drawElement(projectile, distance, angle, projectile.projectile3D, projectile.config);
    }
    
    drawElement(element, distance, angle, element3D, config) {
        if (!this.checkElementWithinFOV(angle) && !element.active) {
            element3D.visible = false;
            return;
        }
    
        const {height, zPosition} = config;
    
        element3D.visible = true;
        element3D.setPositionX(this.drawElementByOwnerPov(angle));
        element3D.setPositionY(this.graphicator.placeElementHeightProjection(distance, element.height/this.blocksize, zPosition) + canvasSize.height/2);
        element3D.setScale(this.config.fov*element.height/(this.config.fov + distance));
        element3D.setDepth(1000 - (distance / 10).toFixed(0));
    }
    
    drawActiveProjectiles(enemy) {
        let activeProjectiles = enemy.projectiles.getChildren().filter(projectile => projectile.active);
        activeProjectiles.forEach(projectile => {
            const { angle, distance } = this.calculateAngleAndDistance(this.owner.getPosition(), projectile.getPosition());
            this.drawProjectile(projectile, distance, angle);
        });
    }
    
    calculateAngleAndDistance(position1, position2) {
        const angle = adjustAngleValue(Phaser.Math.Angle.BetweenPoints(position1, position2));
        const distance = Phaser.Math.Distance.BetweenPoints(position1, position2);
        return { angle, distance };
    }

    /**
     * This method calculates the position of the enemy in the screen according to the angle from it is being seen.
     * @param {number} index The index of the for loop to access the list of the enemies inverted angles.
     * @returns {number}
     */
    drawElementByOwnerPov(currentAngle){
        /**
         * This if statement allows to change the pivot angle of the fov of the owner,
         * to avoid miscalculations in the graphication of the enemy due to the angular reset
         * when a lap is completed.
         * 
         * If the angle of the owner respect to the enemy is located within the fourth quadrant of the region,
         * then the calculations will be done with the x0 angle, else the calculations will be done with
         * the x1024 angle.
         */
        if(currentAngle > 3*Math.PI/2){
            return this.config.fovArcRadius*(currentAngle - this.getArcAngles().x0);
        }else{
            return this.config.fovArcLenght - this.config.fovArcRadius*(this.getArcAngles().x1024 - currentAngle);
        }
    }

    /**
     * Checks if the object is visible in owner's FOV.
     * @param {Number} angleOwnerToElement 
     * @returns {boolean}
     */
    checkElementWithinFOV(angleOwnerToElement){
        /** 
         * The reset of the degrees of rotation of the elements its a big issue with verifying the visibility of an object.
         * With these conditionals we solve that issue. If the x0 angle is greater than the x1024 angle, it means the second
         * fov angle has done a loop already, so we use other conditional checking if the angle of the Projectile is greater than
         * the first fov angle or if it is less than the second fov angle.
         * 
         * In case the x1024 angle is greater than the x0 angle, the procedure would be the normal procedure of checking 
         * if the angle of the element is withing the range of the angles of the fov.
         */
        if (this.getArcAngles().x0 > this.getArcAngles().x1024) {
            return !!(angleOwnerToElement >= this.getArcAngles().x0 || angleOwnerToElement <= this.getArcAngles().x1024);
        } else {
            return !!(angleOwnerToElement >= this.getArcAngles().x0 && angleOwnerToElement <= this.getArcAngles().x1024);
        }
    }

}