class Graphicator{
    constructor(blockSize, canvasSize, raysWidth, raysAmount){
        this.blockSize = blockSize;
        this.canvasSize = {x: canvasSize.split("x")[0], y: canvasSize.split("x")[1]};
        this.raysWidth = raysWidth;
        this.raysAmount = raysAmount;
    }

    set setDistance(distance){
        this.distance = distance;

        this.drawHeight = (this.blockSize*this.canvasSize.y)/this.distance;
        if(this.drawHeight > this.canvasSize.y){
            this.drawHeight = this.canvasSize.y;
        }
    }

    getDistance(){
        return this.drawHeight;
    }

    drawRays3D(){
        for(let i = 0; i < this.raysAmount; i++){
            
        }
    }


}