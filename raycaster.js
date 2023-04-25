class Raycaster{

    constructor(playerAngle, playerPositionX, playerPositionY){
        this.rayAngle = playerAngle - 3*Math.PI/2;
        this.playerPositionX = playerPositionX;
        this.playerPositionY = playerPositionY;

        this.raysAmount = 1;
    }

    set setRayAngle(playerAngle){
        this.rayAngle = playerAngle;
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
        this.playerPositionX = playerPosition.x;
        this.playerPositionY = playerPosition.y;
    }

    drawRays3D(){
        let rayYposition;
        let rayXposition;

        let rayYoffset;
        let rayXoffset;

        let NegInvTan = -1/Math.tan(this.rayAngle);

        let maxX;
        let maxY;

        let matrixPosition;
        
        for(let i = 0; i < this.raysAmount; i++){
            
            let depthOfField = 0; 

            if(this.rayAngle == 0 || this.rayAngle == Math.PI){

                rayXposition = this.playerPositionX;
                rayYposition = this.playerPositionY;

                depthOfField = 8;

            }else if(this.rayAngle < Math.PI){
                
                // if(Number.isInteger(this.playerPositionY/32)){
                //     rayYposition = parseInt((this.playerPositionY+ 0.0001)/32)*32 ;
                // }

                rayYposition = parseInt((this.playerPositionY - 0.0001)/32)*32;
                rayXposition = (this.playerPositionY-rayYposition) * NegInvTan + this.playerPositionX;

                rayYoffset = -32;
                rayXoffset = -rayYoffset*NegInvTan;

            }else{
                rayYposition = parseInt((this.playerPositionY + 32)/32)*32;
                rayXposition = (this.playerPositionY-rayYposition) * NegInvTan + this.playerPositionX;

                rayYoffset = 32;
                rayXoffset = -rayYoffset*NegInvTan;
            }

            // console.log("Ray X position: ",rayXposition, "Ray y position: ", rayYposition,  "Ray X offset: ",rayXoffset, "Ray Y offset: ", rayYoffset);

            while(depthOfField < 8){     
                matrixPosition = {

                    x: parseInt((rayXposition + rayXoffset)/32),
                    y: parseInt((rayYposition + rayYoffset)/32)
                }

                if(matrixPosition.x * matrixPosition.y < this.matrixDimensions.xdim * this.matrixDimensions.ydim && this.matrix[matrixPosition.y][matrixPosition.x] == true){
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

}