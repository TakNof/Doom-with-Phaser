class Raycaster{

    constructor(playerAngle, playerPositionX, playerPositionY){
        this.rayAngle = playerAngle + 3*Math.PI/2;

        if(this.rayAngle < 0){
            this.rayAngle += 2*Math.PI;
        }else if(this.rayAngle > 2*Math.PI){
            this.rayAngle -= 2*Math.PI;
        }
        
        this.playerPosition = {x: playerPositionX, y: playerPositionY};
    }

    set setRayAngle(playerAngle){
        this.rayAngle = playerAngle + 3*Math.PI/2;

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
    }

    get getMatrix(){
        return this.matrix;
    }

    set setMatrixDimensions(matrixDimensions){
        this.matrixDimensions = {xdim: matrixDimensions[0], ydim: matrixDimensions[1]};
    }

    get getMatrixDimensions(){
        return this.matrixDimensions;
    }

    set setPlayerPosition(playerPosition){
        this.playerPosition = playerPosition;
    }

    get getPlayerPosition(){
        return this.playerPosition;
    }

    drawRays3D(){
        let rayYposition;
        let rayXposition;

        let rayYoffset;
        let rayXoffset;

        let NegInvTan = -(1/Math.tan(this.rayAngle));
        let NegTan = -Math.tan(this.rayAngle);

        let matrixPosition;

        let totalDistance = {x: 10000, y: 10000};
        let horizontal = {x: 0, y: 0};
        let vertical  = {x: 0, y: 0};

        let checks = {horizontal: true, vertical: true};
        
        let depthOfFieldLimit = 7;

        let adjustMatrixPosition ={x: 0, y:0};

        //Horizontal check

        if(checks.horizontal === true){
           
            
            let depthOfField = 0; 

            if(this.rayAngle == 0 || this.rayAngle == Math.PI || this.rayAngle == 2*Math.PI){

                rayXposition = this.playerPosition.x;
                rayYposition = this.playerPosition.y;

                depthOfField = depthOfFieldLimit;

            }else if(this.rayAngle > Math.PI){
                // console.log("Higher", this.rayAngle)
                rayYposition = parseInt((this.playerPosition.y - 0.0001)/32)*32;
                rayXposition = (this.playerPosition.y - rayYposition) * NegInvTan + this.playerPosition.x;

                rayYoffset = -32;
                rayXoffset = -rayYoffset*NegInvTan;
                
                adjustMatrixPosition.y = 1;
                
            }else if(this.rayAngle < Math.PI){
                // console.log("Less", this.rayAngle)
                rayYposition = parseInt((this.playerPosition.y + 32)/32)*32;
                rayXposition = (this.playerPosition.y - rayYposition) * NegInvTan + this.playerPosition.x;

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

            if(this.rayAngle == Math.PI/2 || this.rayAngle ==  3*Math.PI/2){

                rayYposition = this.playerPosition.x;
                rayXposition = this.playerPosition.y;

                depthOfField = depthOfFieldLimit;

            }else if(this.rayAngle > Math.PI/2 && this.rayAngle < 3*Math.PI/2){
                // console.log("Left", this.rayAngle)
                rayXposition = parseInt((this.playerPosition.x - 0.0001)/32)*32;
                rayYposition = (this.playerPosition.x - rayXposition) * NegTan + this.playerPosition.y;

                rayXoffset = -32;
                rayYoffset = -rayXoffset*NegTan;

                adjustMatrixPosition.x = 1;

            }else if(this.rayAngle < Math.PI/2 || this.rayAngle > 3*Math.PI/2){
                // console.log("Right", this.rayAngle)
                rayXposition = parseInt((this.playerPosition.x + 32)/32)*32;
                rayYposition = (this.playerPosition.x - rayXposition) * NegTan + this.playerPosition.y;

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
                rayXposition = Math.cos(this.rayAngle) * depthOfFieldLimit*32 + this.playerPosition.x;
                rayYposition = Math.sin(this.rayAngle) * depthOfFieldLimit*32 + this.playerPosition.y;
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

        return {x: rayXposition, y: rayYposition};
    }
    
    hypoCalc(x, y){
        return Math.sqrt(Math.pow(this.playerPosition.x - x, 2) + Math.pow(this.playerPosition.y - y, 2));
    }
}