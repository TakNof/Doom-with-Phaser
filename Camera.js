class Camera{
    /**
     * 
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
        this.fovArcLenght = 7*this.fov;
        
        this.enemies2D = enemies2D;
        this.amountEnemies2D = enemies2D.length
        this.enemyAngleToPlayerInv = Array(this.amountEnemies2D);

        this.setEnemyAngleToPlayerInv();
        
    }

    setArcAngles(){
        this.arcAngles = {
            x0: this.player.adjustAngleValue(this.playerGlobalAngle - this.fov/2),
            x1024:this.player.adjustAngleValue(this.playerGlobalAngle + this.fov/2)
        };
    }

    get getArcAngles(){
        return this.arcAngles;
    }

    setPlayerGlobalAngle(){
        this.playerGlobalAngle = this.player.adjustAngleValue(this.player.getRotation + 3*Math.PI/2);
        this.setArcAngles();
    }

    get getPlayerGlobalAngle(){
        return this.playerGlobalAngle;
    }

    setEnemyAngleToPlayerInv(){
        for(let i = 0; i < this.amountEnemies2D; i++){
            this.enemyAngleToPlayerInv[i] = this.enemies2D[0].adjustAngleValue(this.enemies2D[i].getAngleToPlayer + Math.PI);
        }
    }

    get getEnemyAngleToPlayerInv(){
        return this.enemyAngleToPlayerInv;
    }
    
    draw3DWorld(){
        this.player.getGraphicator.redraw3DScaling(this.player.getRayData.distance, this.player.getRayData.typeOfHit);
        this.setPlayerGlobalAngle();
        this.setEnemyAngleToPlayerInv();
        this.drawEnemy();
    }

    drawElementByPlayerPov(index){
        return (-(this.canvasSize.x*7*Math.abs(this.enemyAngleToPlayerInv[index] - this.getArcAngles.x1024))/this.fovArcLenght) + this.canvasSize.x;
    }

    drawEnemy(){

        for(let i = 0; i < this.amountEnemies2D; i++){
            if(this.enemyAngleToPlayerInv[i] + Math.PI/4 >= 2*Math.PI){
                this.getArcAngles.x1024 = this.getArcAngles.x1024 + 2*Math.PI;
            }else if(this.enemyAngleToPlayerInv[i] - Math.PI/4 <= Math.PI/4){
                this.getArcAngles.x0 = this.getArcAngles.x0 - 2*Math.PI;
            }
            if(this.enemyAngleToPlayerInv[i] > this.getArcAngles.x0 && this.enemyAngleToPlayerInv[i] < this.getArcAngles.x1024){
                this.enemies2D[i].getEnemy3D.setVisible = true;
        
                let enemyHeight = this.player.getGraphicator.setEnemyHeight(this.enemies2D[i].getDistanceToPlayer);
                
                if(enemyHeight/200 > 2.5){
                    this.enemies2D[i].getEnemy3D.scaleY = 2.5;
                    this.enemies2D[i].getEnemy3D.scaleX = 2.5;
                }else{
                    this.enemies2D[i].getEnemy3D.scaleY = enemyHeight/200;
                    this.enemies2D[i].getEnemy3D.scaleX = enemyHeight/200;
                }
                
                this.enemies2D[i].getEnemy3D.setPositionX = this.drawElementByPlayerPov(i);
                this.enemies2D[i].getEnemy3D.setPositionY = (this.canvasSize.y + 0.5*this.canvasSize.y) - enemyHeight/2;

                console.log(this.enemies2D[i].getEnemy3D.getPosition);
        
                this.enemies2D[i].getEnemy3D.setDepth = 3;
                
            }else{
                this.enemies2D[i].getEnemy3D.setVisible = false;
            }
        
            if(this.enemies2D[i].getDistanceToPlayer > this.enemies2D[i].getRayData.distance[0]){
                this.enemies2D[i].getEnemy3D.setDepth = 0;
            }
        }
    }
}