class Raycaster{

    constructor(emitter, rayAmount){
        this.emitter = emitter;
        this.rayAngle = adjustAngleValue(this.emitter.getRotation() + this.emitter.config.angleOffset);
        this.rayAmount = rayAmount;        
        this.depthOfFieldLimit = options.renderDistance.value;
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
        if(this.target){
            this.rayAngle = adjustAngleValue(Phaser.Math.Angle.BetweenPoints(this.emitter.getPosition(), this.target.getPosition()));
        }else{
            this.rayAngle = adjustAngleValue(this.emitter.getRotation() + this.emitter.config.angleOffset - (Math.PI/4));
        }
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
        let rayYposition;
        let rayXposition;
                
        let currentAngle = this.rayAngle;
        
        let coordinatesX = Array(this.rayAmount);
        let coordinatesY = Array(this.rayAmount);
        let distances = Array(this.rayAmount);
        let typeOfHit = Array(this.rayAmount);
        let angles = Array(this.rayAmount);

        let checks = {horizontal: true, vertical: true};
            
        let RDistance;

        for(let i = 0; i < this.rayAmount; i++){
            let totalDistance = {x: 1000, y: 1000};
            let horizontal;
            let vertical;          

            let horizontalCheckResults;
            let verticalCheckResults;
            
            let wallDetected = false;

            typeOfHit[i] = "";
    
            horizontalCheckResults = this.generalCheck(currentAngle, totalDistance, true);

            totalDistance.y = horizontalCheckResults.totalDistance;
            horizontal = horizontalCheckResults.coordinates;

            verticalCheckResults = this.generalCheck(currentAngle, totalDistance);

            totalDistance.x = verticalCheckResults.totalDistance;
            vertical = verticalCheckResults.coordinates;

            wallDetected = horizontalCheckResults.wallDetected || verticalCheckResults.wallDetected;
            
            if(checks.horizontal && checks.vertical){
                // console.log(`total distance x: ${totalDistance.x} y: ${totalDistance.y}`);
                if(totalDistance.x < totalDistance.y){
                    // console.log("Using vertical total distance");
                    rayXposition = vertical.x;
                    rayYposition = vertical.y;
                    RDistance = totalDistance.x;
                    typeOfHit[i] = "vertical";
                }else if(totalDistance.x > totalDistance.y){
                    // console.log("Using horizontal total distance");
                    rayXposition = horizontal.x;
                    rayYposition = horizontal.y;
                    RDistance = totalDistance.y;
                }else{
                    rayXposition = Math.cos(currentAngle) * this.depthOfFieldLimit*this.emitter.scene.wallsConfig + this.emitter.getPositionX();
                    rayYposition = Math.sin(currentAngle) * this.depthOfFieldLimit*this.emitter.scene.wallsConfig + this.emitter.getPositionY();
                    RDistance = Phaser.Math.Distance.BetweenPoints(this.emitter.getPosition(), {x: rayXposition, y: rayYposition});
                    // RDistance = this.hypoCalc(rayXposition, rayYposition);
                }
            }else if(checks.horizontal ^ checks.vertical){
                if(checks.horizontal){
                    // console.log("Using horizontal distance");
                    rayXposition = horizontal.x;
                    rayYposition = horizontal.y;
                }else{
                    // console.log("Using vertical distance");
                    rayXposition = vertical.x;
                    rayYposition = vertical.y;
                }
            }          
            
            currentAngle = adjustAngleValue(currentAngle + this.getAngleStep());
            
            coordinatesX[i] = rayXposition;
            coordinatesY[i] = rayYposition;

            let fixAngle = (this.rayAngle - 5*Math.PI/4) - currentAngle;

            fixAngle = adjustAngleValue(fixAngle);

            RDistance = RDistance*Math.sin(fixAngle);
            angles[i] = fixAngle;
            distances[i] = wallDetected ? RDistance : Infinity;
            
        }
        
        return {x: coordinatesX, y: coordinatesY, angles, distances, typeOfHit};
    }
    
    generalCheck(angle, totalDistance, isHorizontal = false){
        let angleLimitations;

        let tanFuncUsed;
        let totalDistanceUsed;

        let wallPlace;
        let spritePosition;
        let rayPosition = [0, 0];
        let rayOffset = [0, 0];
        let raySelector;

        if(isHorizontal){
            tanFuncUsed = -(1/Math.tan(angle));
            angleLimitations = {cond1: angle == 0 || angle == Math.PI || angle == 2*Math.PI, cond2: angle > Math.PI, cond3: angle < Math.PI};
            totalDistanceUsed = totalDistance.y;
            spritePosition = {"fir": this.emitter.getPositionY(), "sec": this.emitter.getPositionX()};

            raySelector = {"fir": 1, "sec": 0}

        }else{
            tanFuncUsed =-Math.tan(angle);
            angleLimitations = {cond1: angle == Math.PI/2 || angle ==  3*Math.PI/2, cond2: angle > Math.PI/2 && angle < 3*Math.PI/2, cond3: angle < Math.PI/2 || angle > 3*Math.PI/2};
            totalDistanceUsed = totalDistance.x;
            spritePosition = {"fir": this.emitter.getPositionX(), "sec": this.emitter.getPositionY()};

            raySelector = {"fir": 0, "sec": 1}
        }
    
        let matrixPosition;       

        let adjustMatrixPosition = {x: 0, y: 0};
                
        let coordinatesUsed =  {x: 0, y: 0};

        let wallDetected = false;
          
        let depthOfField = 0;         

        if(angleLimitations.cond1){

            rayPosition[0] = this.emitter.getPositionX();
            rayPosition[1] = this.emitter.getPositionY();

            depthOfField = this.depthOfFieldLimit;
        }else if(angleLimitations.cond2){
            rayPosition[raySelector.fir] = parseInt((spritePosition.fir - 0.0001)/32)*32;
            rayPosition[raySelector.sec] = (spritePosition.fir - rayPosition[raySelector.fir]) * tanFuncUsed + spritePosition.sec;

            rayOffset[raySelector.fir] = -32;
            rayOffset[raySelector.sec] = -rayOffset[raySelector.fir]*tanFuncUsed;
            
            if(isHorizontal){
                adjustMatrixPosition.y = 1;
            }else{
                adjustMatrixPosition.x = 1;
            }
            
        }else if(angleLimitations.cond3){
            rayPosition[raySelector.fir] = parseInt((spritePosition.fir + 32)/32)*32;
            rayPosition[raySelector.sec] = (spritePosition.fir - rayPosition[raySelector.fir]) * tanFuncUsed + spritePosition.sec;

            rayOffset[raySelector.fir] = 32;
            rayOffset[raySelector.sec] = -rayOffset[raySelector.fir]*tanFuncUsed;
        }

        while(depthOfField < this.depthOfFieldLimit){     
            matrixPosition = {
                x: parseInt((rayPosition[0])/32)- 1*adjustMatrixPosition.x,
                y: parseInt((rayPosition[1])/32) - 1*adjustMatrixPosition.y
            }

            wallPlace = matrixPosition.y * this.matrixDimensions.xdim + matrixPosition.x;
            
            if(matrixPosition.x < 0 || matrixPosition.y < 0 || wallPlace > this.matrixDimensions.xdim * this.matrixDimensions.ydim){
                break;
            }
            
            coordinatesUsed = {x: rayPosition[0], y: rayPosition[1]};

            if(wallPlace < this.matrixDimensions.xdim * this.matrixDimensions.ydim && this.matrix[matrixPosition.y][matrixPosition.x] !== 0){
                wallDetected = true;
                totalDistanceUsed = Phaser.Math.Distance.BetweenPoints(this.emitter.getPosition(), coordinatesUsed);
                depthOfField  = this.depthOfFieldLimit;
            }else{
                rayPosition[raySelector.fir] += rayOffset[raySelector.fir];
                rayPosition[raySelector.sec] += rayOffset[raySelector.sec];

                depthOfField += 1;
            }
        }
        
        return {totalDistance: totalDistanceUsed, coordinates: coordinatesUsed, wallDetected};
    }
}

// class Raycaster{

//     // constructor(spriteAngle, spritePosition, rayAmount){
//     constructor(emitter, rayAmount){
//         this.emitter = emitter;
//         this.rayAngle = adjustAngleValue(this.emitter.getRotation() + this.emitter.config.angleOffset);
//         this.rayAmount = rayAmount;        
//         this.depthOfFieldLimit = options.renderDistance.value;
//         if(game.config.physics.arcade.debug){
//             this.graphicRays = new Rays(this.emitter.scene, this.emitter);
//         }
//     }

//     setTarget(target){
//         this.target = target;
//     }

//     setAngleStep(fov = 1){
//         this.angleStep = fov/this.rayAmount;
//     }

//     getAngleStep(){
//         return this.angleStep;
//     }

//     setRayAngle(){
//         if(this.target){
//             this.rayAngle = adjustAngleValue(Phaser.Math.Angle.BetweenPoints(this.emitter.getPosition(), this.target.getPosition()));
//         }else{
//             this.rayAngle = adjustAngleValue(this.emitter.getRotation() + this.emitter.config.angleOffset - (Math.PI/4));
//         }
//     }

//     getRayAngle(){
//         return this.rayAngle;
//     }

//     setMatrix(matrix){
//         this.matrix = matrix;
//         this.setMatrixDimensions();
//     }

//     getMatrix(){
//         return this.matrix;
//     }

//     setMatrixDimensions(){
//         this.matrixDimensions = {xdim: this.matrix[0].length, ydim: this.matrix.length};
//     }

//     getMatrixDimensions(){
//         return this.matrixDimensions;
//     }

//     update(){
//         this.setRayAngle();
//         if(this.graphicRays){
//             this.graphicRays.redrawRay2D(this.calculateRayData());
//             this.graphicRays.setVelocityX(this.emitter.getVelocityX());
//             this.graphicRays.setVelocityY(this.emitter.getVelocityY());
//         }
//     }

//     calculateRayData(){
//         let rayYposition;
//         let rayXposition;
                
//         let currentAngle = this.rayAngle;
        
//         let coordinatesX = Array(this.rayAmount);
//         let coordinatesY = Array(this.rayAmount);
//         let distances = Array(this.rayAmount);
//         let typeOfHit = Array(this.rayAmount);
//         let angles = Array(this.rayAmount);
            
//         let RDistance;

//         for(let i = 0; i < this.rayAmount; i++){
//             let totalDistance = {x: 1000, y: 1000};
//             let horizontal;
//             let vertical;          

//             let horizontalCheckResults;
//             let verticalCheckResults;
            
//             let wallDetected = false;

//             typeOfHit[i] = "";
    
//             horizontalCheckResults = this.generalCheck(currentAngle, totalDistance, true);

//             totalDistance.y = horizontalCheckResults.totalDistance;
//             horizontal = horizontalCheckResults.coordinates;

//             verticalCheckResults = this.generalCheck(currentAngle, totalDistance);

//             totalDistance.x = verticalCheckResults.totalDistance;
//             vertical = verticalCheckResults.coordinates;

//             wallDetected = horizontalCheckResults.wallDetected || verticalCheckResults.wallDetected;
            
//             // console.log(`total distance x: ${totalDistance.x} y: ${totalDistance.y}`);
//             if(totalDistance.x < totalDistance.y){
//                 // console.log("Using vertical total distance");
//                 rayXposition = vertical.x;
//                 rayYposition = vertical.y;
//                 RDistance = totalDistance.x;
//                 typeOfHit[i] = "vertical";
//             }else if(totalDistance.x > totalDistance.y){
//                 // console.log("Using horizontal total distance");
//                 rayXposition = horizontal.x;
//                 rayYposition = horizontal.y;
//                 RDistance = totalDistance.y;
//             }else{
//                 rayXposition = Math.cos(currentAngle) * this.depthOfFieldLimit*this.emitter.scene.wallsConfig + this.emitter.getPositionX();
//                 rayYposition = Math.sin(currentAngle) * this.depthOfFieldLimit*this.emitter.scene.wallsConfig + this.emitter.getPositionY();
//                 RDistance = Phaser.Math.Distance.BetweenPoints(this.emitter.getPosition(), {x: rayXposition, y: rayYposition});
//                 // RDistance = this.hypoCalc(rayXposition, rayYposition);
//             }      
            
//             currentAngle = adjustAngleValue(currentAngle + this.getAngleStep());
            
//             coordinatesX[i] = rayXposition;
//             coordinatesY[i] = rayYposition;

//             let fixAngle = (this.rayAngle - 5*Math.PI/4) - currentAngle;

//             fixAngle = adjustAngleValue(fixAngle);

//             RDistance = RDistance*Math.sin(fixAngle);
//             angles[i] = fixAngle;
//             distances[i] = wallDetected ? RDistance : Infinity;
            
//         }
        
//         return {x: coordinatesX, y: coordinatesY, angles, distances, typeOfHit};
//     }
    
//     generalCheck(angle, totalDistance, isHorizontal = false) {
//         let coordinatesUsed;

//         const tanFuncUsed = isHorizontal ? -(1 / Math.tan(angle)) : -Math.tan(angle);
//         const angleLimitations = {
//             cond1: isHorizontal ? (angle % Math.PI === 0) : (angle % (Math.PI / 2) === 0),
//             cond2: angle > (isHorizontal ? Math.PI : Math.PI / 2),
//             cond3: angle < (isHorizontal ? Math.PI : Math.PI / 2)
//         };
        
//         const spritePosition = isHorizontal
//             ? { fir: this.emitter.getPositionY(), sec: this.emitter.getPositionX() }
//             : { fir: this.emitter.getPositionX(), sec: this.emitter.getPositionY() };
    
//         const raySelector = isHorizontal
//             ? { fir: 1, sec: 0 }
//             : { fir: 0, sec: 1 };
    
//         const rayPosition = [0, 0];
//         const rayOffset = [0, 0];
//         const adjustMatrixPosition = { x: 0, y: 0 };
    
//         let totalDistanceUsed = totalDistance[isHorizontal ? 'y' : 'x'];
//         let wallDetected = false;
//         let depthOfField = 0;
    
//         if(angleLimitations.cond1){

//             rayPosition[0] = this.emitter.getPositionX();
//             rayPosition[1] = this.emitter.getPositionY();

//             depthOfField = this.depthOfFieldLimit;
//         }else if(angleLimitations.cond2){
//             rayPosition[raySelector.fir] = parseInt((spritePosition.fir - 0.0001)/32)*32;
//             rayPosition[raySelector.sec] = (spritePosition.fir - rayPosition[raySelector.fir]) * tanFuncUsed + spritePosition.sec;

//             rayOffset[raySelector.fir] = -32;
//             rayOffset[raySelector.sec] = -rayOffset[raySelector.fir]*tanFuncUsed;
//             adjustMatrixPosition[isHorizontal ? 'y' : 'x'] = 1;

//         }else if(angleLimitations.cond3){
//             rayPosition[raySelector.fir] = parseInt((spritePosition.fir + 32)/32)*32;
//             rayPosition[raySelector.sec] = (spritePosition.fir - rayPosition[raySelector.fir]) * tanFuncUsed + spritePosition.sec;

//             rayOffset[raySelector.fir] = 32;
//             rayOffset[raySelector.sec] = -rayOffset[raySelector.fir]*tanFuncUsed;
//         }

//         // if (angleLimitations.cond1) {
//         //     rayPosition[0] = this.emitter.getPositionX();
//         //     rayPosition[1] = this.emitter.getPositionY();
//         //     depthOfField = this.depthOfFieldLimit;
//         // } else {
//         //     rayPosition[raySelector.fir] = Math[angleLimitations.cond2 ? 'floor' : 'ceil']((spritePosition.fir - 0.0001)/32)*32;
//         //     rayPosition[raySelector.sec] = (spritePosition.fir - rayPosition[raySelector.fir]) * tanFuncUsed + spritePosition.sec;
//         //     rayOffset[raySelector.fir] = angleLimitations.cond2 ? -32 : 32;
//         //     rayOffset[raySelector.sec] = -rayOffset[raySelector.fir] * tanFuncUsed;
//         //     adjustMatrixPosition[isHorizontal ? 'y' : 'x'] = angleLimitations.cond2 ? 1 : -1;
//         // }
    
//         while (depthOfField < this.depthOfFieldLimit) {
//             const matrixPosition = {
//                 x: Math.floor(rayPosition[0] / 32) - adjustMatrixPosition.x,
//                 y: Math.floor(rayPosition[1] / 32) - adjustMatrixPosition.y
//             };
    
//             const wallPlace = matrixPosition.y * this.matrixDimensions.xdim + matrixPosition.x;
    
//             if (matrixPosition.x < 0 || matrixPosition.y < 0 || wallPlace > this.matrixDimensions.xdim * this.matrixDimensions.ydim) {
//                 break;
//             }
            
//             coordinatesUsed = {x: rayPosition[0], y: rayPosition[1]};

//             if (wallPlace < this.matrixDimensions.xdim * this.matrixDimensions.ydim && this.matrix[matrixPosition.y][matrixPosition.x] !== 0) {
//                 wallDetected = true;
//                 totalDistanceUsed = Phaser.Math.Distance.BetweenPoints(this.emitter.getPosition(), coordinatesUsed);
//                 depthOfField = this.depthOfFieldLimit;
//             } else {
//                 rayPosition[raySelector.fir] += rayOffset[raySelector.fir];
//                 rayPosition[raySelector.sec] += rayOffset[raySelector.sec];
//                 depthOfField++;
//             }
//         }
    
//         return { totalDistance: totalDistanceUsed, coordinates: coordinatesUsed, wallDetected };
//     }

    //Dumb raycasting procedure
    // generalCheck(angle, totalDistance, isHorizontal = false) {
    //     let tanFuncUsed;
    //     let totalDistanceUsed;
    //     let rayPosition = [0, 0];
    //     let rayOffset = [0, 0];
    //     let raySelector;
    //     let depthOfField = 0;
    
    //     if (isHorizontal) {
    //         tanFuncUsed = -(1 / Math.tan(angle));
    //         totalDistanceUsed = totalDistance.y;
    //         raySelector = { fir: 1, sec: 0 };
    //     } else {
    //         tanFuncUsed = -Math.tan(angle);
    //         totalDistanceUsed = totalDistance.x;
    //         raySelector = { fir: 0, sec: 1 };
    //     }
    
    //     const angleLimitations = {
    //         cond1: angle % Math.PI === 0,
    //         cond2: angle > Math.PI,
    //         cond3: angle < Math.PI
    //     };
    
    //     const spritePosition = isHorizontal 
    //         ? { fir: this.emitter.getPositionY(), sec: this.emitter.getPositionX() }
    //         : { fir: this.emitter.getPositionX(), sec: this.emitter.getPositionY() };
    
    //     let adjustMatrixPosition = { x: 0, y: 0 };
    
    //     if (angleLimitations.cond1) {
    //         rayPosition[0] = this.emitter.getPositionX();
    //         rayPosition[1] = this.emitter.getPositionY();
    //         depthOfField = this.depthOfFieldLimit;
    //     } else {
    //         rayPosition[raySelector.fir] = angleLimitations.cond2 
    //             ? Math.floor(spritePosition.fir / 32) * 32
    //             : Math.ceil(spritePosition.fir / 32) * 32;
            
    //         rayPosition[raySelector.sec] = (spritePosition.fir - rayPosition[raySelector.fir]) * tanFuncUsed + spritePosition.sec;
    //         rayOffset[raySelector.fir] = angleLimitations.cond2 ? -32 : 32;
    //         rayOffset[raySelector.sec] = -rayOffset[raySelector.fir] * tanFuncUsed;
    //         adjustMatrixPosition[raySelector.fir] = angleLimitations.cond2 ? 1 : -1;
    //     }
    
    //     while (depthOfField < this.depthOfFieldLimit) {
    //         const matrixPosition = {
    //             x: Math.floor(rayPosition[0] / 32) - adjustMatrixPosition.x,
    //             y: Math.floor(rayPosition[1] / 32) - adjustMatrixPosition.y
    //         };
    
    //         if (matrixPosition.x < 0 || matrixPosition.y < 0 || matrixPosition.y * this.matrixDimensions.xdim + matrixPosition.x >= this.matrixDimensions.xdim * this.matrixDimensions.ydim) {
    //             break;
    //         }
    
    //         if (this.matrix[matrixPosition.y][matrixPosition.x] !== 0) {
    //             totalDistanceUsed = Phaser.Math.Distance.BetweenPoints(this.emitter.getPosition(), { x: rayPosition[0], y: rayPosition[1] });
    //             return { totalDistance: totalDistanceUsed, coordinates: rayPosition, wallDetected: true };
    //         }
    
    //         rayPosition[raySelector.fir] += rayOffset[raySelector.fir];
    //         rayPosition[raySelector.sec] += rayOffset[raySelector.sec];
    //         depthOfField++;
    //     }
    
    //     return { totalDistance: totalDistanceUsed, coordinates: rayPosition, wallDetected: false };
    // }
// }