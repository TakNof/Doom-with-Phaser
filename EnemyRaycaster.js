class EnemyRaycaster{

    constructor(enemyPositionX, enemyPositionY, playerPositionX, playerPositionY){
        this.rayAngle = Math.atan((enemyPositionY - playerPositionY)/(enemyPositionX - playerPositionX))
        
        if(this.rayAngle < 0){
            this.rayAngle += 2*Math.PI;
        }else if(this.rayAngle > 2*Math.PI){
            this.rayAngle -= 2*Math.PI;
        }

        this.enemyPosition = {x: enemyPositionX, y: enemyPositionY};

        this.playerPosition = {x: playerPositionX, y: playerPositionY};

        this.rayAmount = 1;

        this.angleOffset = (90/this.rayAmount)*Math.PI/180;

        this.matrix = [[]];
    }

    set setRayAngle(player){
        if(this.enemyPosition.x > player.x){
            this.rayAngle = Math.atan((this.enemyPosition.y - player.y)/(this.enemyPosition.x - player.x)) + Math.PI;
        }else{
            this.rayAngle = Math.atan((this.enemyPosition.y - player.y)/(this.enemyPosition.x - player.x));
        }

        if(this.rayAngle < 0){
            this.rayAngle += 2*Math.PI;
        }else if(this.rayAngle > 2*Math.PI){
            this.rayAngle -= 2*Math.PI;
        }     
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
        this.matrixDimensions = {xdim: this.matrix[0][0].length, ydim: this.matrix[0].length};
    }

    get getMatrixDimensions(){
        return this.matrixDimensions;
    }

    set setEnemyPosition(enemyPosition){
        this.enemyPosition = enemyPosition;
    }

    get getEnemyPosition(){
        return this.enemyPosition;
    }

    set setPlayerPosition(playerPosition){
        this.playerPosition = playerPosition;
    }

    get getPlayerPosition(){
        return this.playerPosition;
    }

    detectWalls(){
        let rayYposition;
        let rayXposition;

        let rayYoffset;
        let rayXoffset;
        
        let currentAngle = this.rayAngle;

        let coordinatesX = Array(this.rayAmount);
        let coordinatesY = Array(this.rayAmount);

        let checks = {horizontal: true, vertical: true};
            
        let depthOfFieldLimit = 10;

        let wallDetected = false;

        for(let i = 0; i < this.rayAmount; i++){
            let NegInvTan = -(1/Math.tan(currentAngle));
            let NegTan = -Math.tan(currentAngle);

            let matrixPosition;

            let totalDistance = {x: 10000, y: 10000};
            let horizontal = {x: 0, y: 0};
            let vertical  = {x: 0, y: 0};          

            let adjustMatrixPosition ={x: 0, y:0};
            

            //Horizontal check

            if(checks.horizontal === true){
                    
                let depthOfField = 0; 

                if(currentAngle == 0 || currentAngle == Math.PI || currentAngle == 2*Math.PI){

                    rayXposition = this.enemyPosition.x;
                    rayYposition = this.enemyPosition.y;

                    depthOfField = depthOfFieldLimit;

                }else if(currentAngle > Math.PI){
                    // console.log("Higher", currentAngle)
                    rayYposition = parseInt((this.enemyPosition.y - 0.0001)/32)*32;
                    rayXposition = (this.enemyPosition.y - rayYposition) * NegInvTan + this.enemyPosition.x;

                    rayYoffset = -32;
                    rayXoffset = -rayYoffset*NegInvTan;
                    
                    adjustMatrixPosition.y = 1;
                    
                }else if(currentAngle < Math.PI){
                    // console.log("Less", currentAngle)
                    rayYposition = parseInt((this.enemyPosition.y + 32)/32)*32;
                    rayXposition = (this.enemyPosition.y - rayYposition) * NegInvTan + this.enemyPosition.x;

                    rayYoffset = 32;
                    rayXoffset = -rayYoffset*NegInvTan;
                }
                
                horizontal = {x: rayXposition, y: rayYposition};

                while(depthOfField < depthOfFieldLimit){     
                    matrixPosition = {
                        x: parseInt((rayXposition)/32),
                        y: parseInt((rayYposition)/32) - 1*adjustMatrixPosition.y
                    }

                    let wallPlace = matrixPosition.y * this.matrixDimensions.xdim + matrixPosition.x;
                    
                    if(matrixPosition.x < 0 || matrixPosition.y < 0 || wallPlace > this.matrixDimensions.xdim * this.matrixDimensions.ydim){
                        break;
                    }
                    
                    horizontal = {x: rayXposition, y: rayYposition};

                    if(wallPlace < this.matrixDimensions.xdim * this.matrixDimensions.ydim && this.matrix[matrixPosition.y][matrixPosition.x] === true){
                        // console.log(`Vertical wall detected at ${matrixPosition.x}, y:${matrixPosition.y}`);
                        totalDistance.y = this.hypoCalc(horizontal.x, horizontal.y);
                        depthOfField  = depthOfFieldLimit;
                        wallDetected = true;
                    }else{
                        rayXposition += rayXoffset;
                        rayYposition += rayYoffset;

                        depthOfField += 1;
                    }
                }

                
                
                // console.log("Finished horizontal procedure");
            }
            
            adjustMatrixPosition ={x: 0, y:0};

            if(checks.vertical === true){
                
                let depthOfField = 0; 

                if(currentAngle == Math.PI/2 || currentAngle ==  3*Math.PI/2){

                    rayYposition = this.enemyPosition.x;
                    rayXposition = this.enemyPosition.y;

                    depthOfField = depthOfFieldLimit;

                }else if(currentAngle > Math.PI/2 && currentAngle < 3*Math.PI/2){
                    // console.log("Left", currentAngle)
                    rayXposition = parseInt((this.enemyPosition.x - 0.0001)/32)*32;
                    rayYposition = (this.enemyPosition.x - rayXposition) * NegTan + this.enemyPosition.y;

                    rayXoffset = -32;
                    rayYoffset = -rayXoffset*NegTan;

                    adjustMatrixPosition.x = 1;

                }else if(currentAngle < Math.PI/2 || currentAngle > 3*Math.PI/2){
                    // console.log("Right", currentAngle)
                    rayXposition = parseInt((this.enemyPosition.x + 32)/32)*32;
                    rayYposition = (this.enemyPosition.x - rayXposition) * NegTan + this.enemyPosition.y;

                    rayXoffset = 32;
                    rayYoffset = -rayXoffset*NegTan;
                }
                
                vertical = {x: rayXposition, y: rayYposition};
        
                while(depthOfField < depthOfFieldLimit){
                    matrixPosition = {
                        x: parseInt((rayXposition)/32) - 1*adjustMatrixPosition.x,
                        y: parseInt((rayYposition)/32)
                    }
                    

                    let wallPlace = matrixPosition.y * this.matrixDimensions.xdim + matrixPosition.x;

                    if(matrixPosition.x < 0 || matrixPosition.y < 0 || wallPlace > this.matrixDimensions.xdim * this.matrixDimensions.ydim){
                        break;
                    }
                    
                    vertical = {x: rayXposition, y: rayYposition};

                    if(wallPlace < this.matrixDimensions.xdim * this.matrixDimensions.ydim && this.matrix[matrixPosition.y][matrixPosition.x] === true){
                        // console.log(`Horizontal wall detected at ${matrixPosition.x}, y:${matrixPosition.y}`);
                        totalDistance.x = this.hypoCalc(vertical.x, vertical.y);

                        depthOfField  = depthOfFieldLimit;
                        wallDetected = true;
                    }else{
                        rayXposition += rayXoffset;
                        rayYposition += rayYoffset;

                        depthOfField += 1;
                    }
                }
                
                // console.log("Finished vertical procedure");
            }

            if(checks.horizontal === true && checks.vertical === true){
                // console.log(`total distance x: ${totalDistance.x} y: ${totalDistance.y}`);
                if(totalDistance.x < totalDistance.y){
                    // console.log("Using vertical total distance");
                    rayXposition = vertical.x;
                    rayYposition = vertical.y;
                }else if(totalDistance.x > totalDistance.y){
                    // console.log("Using horizontal total distance");
                    rayXposition = horizontal.x;
                    rayYposition = horizontal.y;
                }else{
                    rayXposition = Math.cos(currentAngle) * depthOfFieldLimit*32 + this.enemyPosition.x;
                    rayYposition = Math.sin(currentAngle) * depthOfFieldLimit*32 + this.enemyPosition.y;
                }
            }else if(checks.horizontal === true ^ checks.vertical === true){
                if(checks.horizontal === true){
                    // console.log("Using horizontal distance");
                    rayXposition = horizontal.x;
                    rayYposition = horizontal.y;
                }else{
                    // console.log("Using vertical distance");
                    rayXposition = vertical.x;
                    rayYposition = vertical.y;
                }
            }

            coordinatesX[i] = rayXposition;
            coordinatesY[i] = rayYposition;
            
            

            if(currentAngle < 0){
                currentAngle += 2*Math.PI;
            }else if(currentAngle > 2*Math.PI){
                currentAngle -= 2*Math.PI;
            } 
            
            
            
        }

        return {x: coordinatesX, y: coordinatesY, wallHit: wallDetected};
    }

    hypoCalc(x, y){
        return Math.sqrt(Math.pow(this.enemyPosition.x - x, 2) + Math.pow(this.enemyPosition.y - y, 2));
    }
}