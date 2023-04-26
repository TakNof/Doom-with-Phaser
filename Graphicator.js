class Graphicator{
    constructor(blockSize, canvasSize, raysWidth, raysAmount){
        this.blockSize = blockSize;
        this.canvasSize = {x: canvasSize.split("x")[0], y: canvasSize.split("x")[1]};
        this.raysWidth = raysWidth;
        this.raysAmount = raysAmount;
    }

    set setHeight(distance){
        if(!isFinite(distance)){
            this.drawHeight = 0;
        }else{
            this.drawHeight = (this.blockSize*this.canvasSize.y)/distance;
            if(this.drawHeight > 1.3*this.canvasSize.y){
                this.drawHeight = 1.3*this.canvasSize.y;
            }
        }   
    }

    getHeight(){
        return this.drawHeight;
    }
}