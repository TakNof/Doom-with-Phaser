class Raycaster{

    constructor(playerAngle, playerPositionX, playerPositionY){
        this.rayAngle = playerAngle + 3*Math.PI/2;

        if(this.rayAngle < 0){
            this.rayAngle += 2*Math.PI;
        }else if(this.rayAngle > 2*Math.PI){
            this.rayAngle -= 2*Math.PI;
        }
        
        this.playerPosition = {x: playerPositionX, y: playerPositionY};

        this.raysAmount = 1;
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

        let NegInvTan = -1/Math.tan(this.rayAngle);

        let matrixPosition;
        
        for(let i = 0; i < this.raysAmount; i++){
            
            let depthOfField = 0; 

            if(this.rayAngle == 0 || this.rayAngle == Math.PI){

                rayXposition = this.playerPosition.x;
                rayYposition = this.playerPosition.y;

                depthOfField = 8;

            }else if(this.rayAngle < Math.PI){
                console.log("Less", this.rayAngle)
                rayYposition = parseInt((this.playerPosition.y - 0.0001)/32)*32;
                rayXposition = (this.playerPosition.y - rayYposition) * NegInvTan + this.playerPosition.x;

                rayYoffset = 32;
                rayXoffset = -rayYoffset*NegInvTan;

            }else{
                console.log("Higher", this.rayAngle)
                rayYposition = parseInt((this.playerPosition.y + 32)/32)*32;
                rayXposition = (this.playerPosition.y - rayYposition) * NegInvTan + this.playerPosition.x;

                rayYoffset = -32;
                rayXoffset = -rayYoffset*NegInvTan;
            }

            // console.log(this.rayAngle, NegInvTan);

            // console.log("Ray X position: ",rayXposition, "Ray y position: ", rayYposition,  "Ray X offset: ",rayXoffset, "Ray Y offset: ", rayYoffset);

            while(depthOfField < 8){     
                matrixPosition = {

                    x: parseInt((rayXposition + rayXoffset)/32),
                    y: parseInt((rayYposition + rayYoffset)/32)
                }

                if(matrixPosition.x < 0 || matrixPosition.y < 0){
                    break;
                }

                let wallPlace = matrixPosition.y * this.matrixDimensions.xdim + matrixPosition.x;
                
                if(wallPlace < this.matrixDimensions.xdim * this.matrixDimensions.ydim && this.matrix[matrixPosition.y][matrixPosition.x] === true){
                    console.log("Wall detected");
                    depthOfField  = 8;
                }else{
                    rayXposition += rayXoffset;
                    rayYposition += rayYoffset;

                    depthOfField += 1;
                }
            }
        }

        return {x: rayXposition, y: rayYposition};
    }

    // drawRays3D(){
    //     let stepSize = {x: Math.sqrt(1 + 1/(2*Math.tan(this.rayAngle))), y: Math.sqrt(1 + 2*Math.tan(this.rayAngle))};

    //     let rayLength;

    //     let step;

    //     let mapCheck = this.playerPosition;

    //     if(rayDirection.x < 0){
    //         step.x = -1;
    //         rayLength.x = (this.playerPosition.x - parseFloat(mapCheck.x)) * stepSize.x; 
    //     }else{
    //         step.x = 1;
    //         rayLength.x = (parseFloat(mapCheck.x + 1) - this.playerPosition.x) * stepSize.x;
    //     }

    //     if(rayDirection.y < 0){
    //         step.y = -1;
    //         rayLength.y = (this.playerPosition.y - parseFloat(mapCheck.y)) * stepSize.y; 
    //     }else{
    //         step.y = 1;
    //         rayLength.y = (parseFloat(mapCheck.y + 1) - this.playerPosition.y) * stepSize.y;
    //     }
        
    //     let wallFound = false;
    //     let maxDistance;
    //     let distance;
    //     while(!wallFound && distance < maxDistance){
    //         if(rayLength.x < rayLength.y){
    //             mapCheck.x += step.x;
    //             rayLength.x += stepSize.x;

    //         }else{
    //             mapCheck.y += step.y;
    //             rayLength.y += stepSize.y;

    //         }

    //         if(mapCheck.x >= 0 && mapCheck.x < this.matrixDimensions.x && mapCheck.y >= 0 && mapCheck.y < this.matrixDimensions.y){
    //             if(this.matrix[matrixPosition.y][matrixPosition.x] == true){
    //                 wallFound = true;
    //             }
    //         }                
    //     }
    // }
}