class Raycaster{

    constructor(spriteAngle, spritePositionX, spritePositionY, rayAmount){
        this.rayAngle = spriteAngle;

        this.rayAngle = this.adjustAngleValue(this.rayAngle);
        
        this.spritePosition = {x: spritePositionX, y: spritePositionY};

        this.rayAmount = rayAmount;

        this.angleOffset = (90/this.rayAmount)*Math.PI/180; 
    }

    set setRayAngle(spriteAngle){
        this.rayAngle = this.adjustAngleValue(spriteAngle);    
    }

    get getRayAngle(){
        return this.rayAngle;
    }

    set setMatrix(matrix){
        this.matrix = matrix;
        this.setMatrixDimensions();
    }

    get getMatrix(){
        return this.matrix;
    }

    setMatrixDimensions(){
        this.matrixDimensions = {xdim: this.matrix[0].length, ydim: this.matrix.length};
    }

    get getMatrixDimensions(){
        return this.matrixDimensions;
    }

    set setSpritePosition(spritePosition){
        this.spritePosition = spritePosition;
    }

    get getSpritePosition(){
        return this.spritePosition;
    }

    calculateRayData(){
        let rayYposition;
        let rayXposition;
                
        let currentAngle = this.rayAngle;

        let coordinatesX = Array(this.rayAmount);
        let coordinatesY = Array(this.rayAmount);
        let distances = Array(this.rayAmount);
        let kindOfHit = Array(this.rayAmount);

        let checks = {horizontal: true, vertical: true};
            
        let depthOfFieldLimit = 20;

        let RDistance;

        for(let i = 0; i < this.rayAmount; i++){
            let totalDistance = {x: 10000, y: 10000};
            let horizontal = {x: 0, y: 0};
            let vertical  = {x: 0, y: 0};          

            let horizontalCheckResults;
            let verticalCheckResults;
            
            let wallDetected = false;

            kindOfHit[i] = "";
    
            horizontalCheckResults = this.generalCheck(currentAngle, depthOfFieldLimit, totalDistance, true);

            totalDistance.y = horizontalCheckResults.totalDistance;
            horizontal = horizontalCheckResults.coordinates;

            verticalCheckResults = this.generalCheck(currentAngle, depthOfFieldLimit, totalDistance);

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
                    kindOfHit[i] = "vertical";
                }else if(totalDistance.x > totalDistance.y){
                    // console.log("Using horizontal total distance");
                    rayXposition = horizontal.x;
                    rayYposition = horizontal.y;
                    RDistance = totalDistance.y;
                }else{
                    rayXposition = Math.cos(currentAngle) * depthOfFieldLimit*32 + this.spritePosition.x;
                    rayYposition = Math.sin(currentAngle) * depthOfFieldLimit*32 + this.spritePosition.y;
                    RDistance = this.hypoCalc(rayXposition, rayYposition);
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
            
            currentAngle = currentAngle + this.angleOffset;

            currentAngle = this.adjustAngleValue(currentAngle);
            
            coordinatesX[i] = rayXposition;
            coordinatesY[i] = rayYposition;

            let fixAngle = (this.rayAngle - 5*Math.PI/4) - currentAngle;

            fixAngle = this.adjustAngleValue(fixAngle);
            fixAngle = this.adjustAngleValue(fixAngle);

            RDistance = RDistance*Math.sin(fixAngle);

            if(wallDetected){
                distances[i] = RDistance;
            }else{
                distances[i] = Infinity;
            }
            
        }
        
        return {x: coordinatesX, y: coordinatesY, distance: distances, typeOfHit: kindOfHit};
    }
    

    generalCheck(angle, depthOfFieldLimit, totalDistance, isHorizontal = false){
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
            spritePosition = {"fir": this.spritePosition.y, "sec": this.spritePosition.x};

            raySelector = {"fir": 1, "sec": 0}

        }else{
            tanFuncUsed =-Math.tan(angle);
            angleLimitations = {cond1: angle == Math.PI/2 || angle ==  3*Math.PI/2, cond2: angle > Math.PI/2 && angle < 3*Math.PI/2, cond3: angle < Math.PI/2 || angle > 3*Math.PI/2};
            totalDistanceUsed = totalDistance.x;
            spritePosition = {"fir": this.spritePosition.x, "sec": this.spritePosition.y};

            raySelector = {"fir": 0, "sec": 1}
        }
    
        let matrixPosition;       

        let adjustMatrixPosition = {x: 0, y: 0};
                
        let coordinatesUsed =  {x: 0, y: 0};

        let wallDetected = false;
          
        let depthOfField = 0;         

        if(angleLimitations.cond1){

            rayPosition[0] = this.spritePosition.x;
            rayPosition[1] = this.spritePosition.y;

            depthOfField = depthOfFieldLimit;
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

        while(depthOfField < depthOfFieldLimit){     
            matrixPosition = {
                x: parseInt((rayPosition[0])/32)- 1*adjustMatrixPosition.x,
                y: parseInt((rayPosition[1])/32) - 1*adjustMatrixPosition.y
            }

            wallPlace = matrixPosition.y * this.matrixDimensions.xdim + matrixPosition.x;
            
            if(matrixPosition.x < 0 || matrixPosition.y < 0 || wallPlace > this.matrixDimensions.xdim * this.matrixDimensions.ydim){
                break;
            }
            
            coordinatesUsed = {x: rayPosition[0], y: rayPosition[1]};

            if(wallPlace < this.matrixDimensions.xdim * this.matrixDimensions.ydim && this.matrix[matrixPosition.y][matrixPosition.x] === true){
                wallDetected = true;
                totalDistanceUsed = this.hypoCalc(coordinatesUsed.x, coordinatesUsed.y);
                depthOfField  = depthOfFieldLimit;
            }else{
                rayPosition[raySelector.fir] += rayOffset[raySelector.fir];
                rayPosition[raySelector.sec] += rayOffset[raySelector.sec];

                depthOfField += 1;
            }
        }
        
        return {totalDistance: totalDistanceUsed, coordinates: coordinatesUsed, wallDetected: wallDetected};
    }

    hypoCalc(x, y){
        return Math.sqrt(Math.pow(this.spritePosition.x - x, 2) + Math.pow(this.spritePosition.y - y, 2));
    }

    adjustAngleValue(angle){
        if(angle < 0){
            angle += 2*Math.PI;
        }else if(angle > 2*Math.PI){
            angle -= 2*Math.PI;
        }

        return angle;
    }
}