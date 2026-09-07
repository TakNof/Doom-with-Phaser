class Raycaster{

    constructor(emitter, rayAmount){
        this.emitter = emitter;
        this.rayAngle = adjustAngleValue(this.emitter.getRotation() + this.emitter.config.angleOffset);
        this.rayAmount = rayAmount;
        this.depthOfFieldLimit = options.renderDistance.value;
        this.cellSize = this.emitter.scene.wallsConfig.size;
        this.rayData = Array.from({length: this.rayAmount}, () => ({
            rayHitXposition: 0,
            rayHitYposition: 0,
            angle: 0,
            rayAngle: 0,
            distance: 0,
            typeOfHit: ""
        }));
        if(game.config.physics.arcade.debug){
            this.graphicRays = new Rays(this.emitter.scene, this.emitter);
        }
    }

    setTarget(target){
        this.target = target;
    }

    setAngleStep(fov = 1){
        this.angleStep = fov/this.rayAmount;
    }

    getAngleStep(){
        return this.angleStep;
    }

    setRayAngle(){
        let angleResult;

        if(this.target){
            let emitterPosition = this.emitter.getPosition();
            let targetPosition = this.target.getPosition();

            angleResult = Phaser.Math.Angle.BetweenPoints(emitterPosition , targetPosition);
        }else{
            let emitterRotation = this.emitter.getRotation();
            let emitterAngleOffsetFixed = this.emitter.config.angleOffset - (Math.PI/4);

            angleResult = emitterRotation + emitterAngleOffsetFixed;
        }

        this.rayAngle = adjustAngleValue(angleResult);
    }

    getRayAngle(){
        return this.rayAngle;
    }

    setMatrix(matrix){
        this.matrix = matrix;
        this.setMatrixDimensions();
    }

    getMatrix(){
        return this.matrix;
    }

    setMatrixDimensions(){
        this.matrixDimensions = {xdim: this.matrix[0].length, ydim: this.matrix.length};
    }

    getMatrixDimensions(){
        return this.matrixDimensions;
    }

    update(){
        this.setRayAngle();
        if(this.graphicRays){
            this.graphicRays.redrawRay2D(this.calculateRayData());
            this.graphicRays.setVelocityX(this.emitter.getVelocityX());
            this.graphicRays.setVelocityY(this.emitter.getVelocityY());
        }
    }

    calculateRayData(){
        let currentAngle = this.rayAngle;

        let emitterPosition = this.emitter.getPosition();
        let emitterX = this.emitter.getPositionX();
        let emitterY = this.emitter.getPositionY();
        const cellSize = this.cellSize;

        for(let i = 0; i < this.rayAmount; i++){
            let rayInfo = this.rayData[i];
            rayInfo.rayAngle = currentAngle;

            let hit = this.castRay(currentAngle, emitterX, emitterY);

            let rayXposition;
            let rayYposition;
            let RDistance;

            if(hit.wallDetected){
                rayXposition = hit.x;
                rayYposition = hit.y;
                RDistance = hit.distance;
                rayInfo.typeOfHit = hit.typeOfHit;
            }else{
                rayXposition = Math.cos(currentAngle) * this.depthOfFieldLimit*cellSize + emitterX;
                rayYposition = Math.sin(currentAngle) * this.depthOfFieldLimit*cellSize + emitterY;
                RDistance = Phaser.Math.Distance.BetweenPoints(emitterPosition, {x: rayXposition, y: rayYposition});
                rayInfo.typeOfHit = "";
            }

            currentAngle = adjustAngleValue(currentAngle + this.getAngleStep());

            rayInfo.rayHitXposition = rayXposition;
            rayInfo.rayHitYposition = rayYposition;

            let fixAngle = (this.rayAngle - 5*Math.PI/4) - currentAngle;

            fixAngle = adjustAngleValue(fixAngle);

            RDistance = RDistance*Math.sin(fixAngle);
            rayInfo.angle = fixAngle;
            rayInfo.distance = hit.wallDetected ? RDistance : Infinity;
        }

        return this.rayData;
    }

    /**
     * Casts a single ray from (emitterX, emitterY) at the given angle using a single-pass
     * DDA (Digital Differential Analyzer) grid walk: it steps one grid cell at a time,
     * always advancing whichever axis (x or y) reaches its next grid line first, and stops
     * as soon as a wall cell is found or the depth-of-field budget runs out.
     */
    castRay(angle, emitterX, emitterY){
        const cellSize = this.cellSize;
        const rayDirX = Math.cos(angle);
        const rayDirY = Math.sin(angle);

        let mapX = Math.floor(emitterX/cellSize);
        let mapY = Math.floor(emitterY/cellSize);

        let stepX, deltaDistX, sideDistX;
        if(rayDirX === 0){
            stepX = 0;
            deltaDistX = Infinity;
            sideDistX = Infinity;
        }else{
            deltaDistX = Math.abs(cellSize/rayDirX);
            if(rayDirX < 0){
                stepX = -1;
                sideDistX = ((emitterX - mapX*cellSize)/cellSize)*deltaDistX;
            }else{
                stepX = 1;
                sideDistX = (((mapX + 1)*cellSize - emitterX)/cellSize)*deltaDistX;
            }
        }

        let stepY, deltaDistY, sideDistY;
        if(rayDirY === 0){
            stepY = 0;
            deltaDistY = Infinity;
            sideDistY = Infinity;
        }else{
            deltaDistY = Math.abs(cellSize/rayDirY);
            if(rayDirY < 0){
                stepY = -1;
                sideDistY = ((emitterY - mapY*cellSize)/cellSize)*deltaDistY;
            }else{
                stepY = 1;
                sideDistY = (((mapY + 1)*cellSize - emitterY)/cellSize)*deltaDistY;
            }
        }

        const xdim = this.matrixDimensions.xdim;
        const ydim = this.matrixDimensions.ydim;

        let wallDetected = false;
        let hitSide = 0;
        let depth = 0;

        while(depth < this.depthOfFieldLimit){
            if(sideDistX < sideDistY){
                sideDistX += deltaDistX;
                mapX += stepX;
                hitSide = 0;
            }else{
                sideDistY += deltaDistY;
                mapY += stepY;
                hitSide = 1;
            }

            if(mapX < 0 || mapY < 0 || mapX >= xdim || mapY >= ydim){
                break;
            }

            if(this.matrix[mapY][mapX] !== 0){
                wallDetected = true;
                break;
            }

            depth++;
        }

        if(!wallDetected){
            return {wallDetected: false};
        }

        const distance = hitSide === 0 ? (sideDistX - deltaDistX) : (sideDistY - deltaDistY);

        return {
            wallDetected: true,
            distance,
            x: emitterX + rayDirX*distance,
            y: emitterY + rayDirY*distance,
            typeOfHit: hitSide === 0 ? "v" : "h"
        };
    }
}
