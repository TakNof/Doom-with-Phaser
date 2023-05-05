class Graphicator{
    /**
     * @constructor
     * @param {Scene} scene 
     * @param {number} blockSize 
     * @param {{x: number, y: number}} canvasSize 
     * @param {number} raysAmount 
     */
    constructor(scene, blockSize, canvasSize, raysAmount){
        this.scene = scene;
        this.blockSize = blockSize;
        this.canvasSize = {x: canvasSize.split("x")[0], y: canvasSize.split("x")[1]};

        this.rectanglesAmount = raysAmount;

        this.rectanglesWidth = this.canvasSize.x/this.rectanglesAmount;
        this.rectangles = Array(raysAmount);

        for(let i = 0; i < this.raysAmount; i++){
            this.rectangles[i] = this.add.rectangle(this.rectanglesWidth/2 + i*this.rectanglesWidth, this.canvasSize.y + 0.5*this.canvasSize.y, this.rectanglesWidth, this.canvasSize.y/3,"0x00ff00").setDepth(2);;
            this.physics.add.existing(rays3DCamera[i], false);
        }

    }

    set setHeight(distance){
        if(!isFinite(distance)){
            this.drawHeight = 0;
        }else{
            this.drawHeight = (this.blockSize*this.canvasSize.y)/distance;
            if(this.drawHeight > 1.27*this.canvasSize.y){
                this.drawHeight = 1.27*this.canvasSize.y;
            }
        }   
    }

    getHeight(){
        return this.drawHeight;
    }

    setHeightEnemy(distance){
        let drawHeight;

        if(!isFinite(distance)){
            drawHeight = 0;
        }else{
            drawHeight = Math.abs(this.blockSize*this.canvasSize.y)/distance;
            if(drawHeight > 1.3*this.canvasSize.y){
                drawHeight = 1.3*this.canvasSize.y;
            }
        }

        return drawHeight;
    }
}