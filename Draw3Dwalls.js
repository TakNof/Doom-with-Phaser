class Draw3DWalls{
    constructor(blockSize, canvasSize, distance){
        this.blockSize = blockSize;
        this.canvasSize = {x: canvasSize.split("x")[0], y: canvasSize.split("x")[1]}
        this.distance = distance;

        this.drawHeight = (blockSize*canvasSize.y)/distance;
        if(this.drawHeight > canvasSize.y){
            this.blockSize = canvasSize.y;
        }
    }

}