class Graphicator2{
    /**
     * @constructor
     * @param {Scene} scene The current scene of the game to place the 3D graphics.
     * @param {number} blockSize The size of the blocks of the level in pixels.
     * @param {{x: number, y: number}} canvasSize The size of the canvas in pixels.
     * @param {number} raysAmount The amount of rays to draw in the canvas.
     */
    constructor(scene, blockSize, canvasSize, raysAmount){
        this.scene = scene;
        this.blockSize = blockSize;
        this.canvasSize = {x: parseInt(canvasSize.split("x")[0]), y: parseInt(canvasSize.split("x")[1])};

        this.rectanglesAmount = raysAmount;

        this.rectanglesWidth = this.canvasSize.x/this.rectanglesAmount;
        this.rectangles = Array(raysAmount);

        for(let i = 0; i < this.rectanglesAmount; i++){
            this.rectangles[i] = this.scene.add.rectangle(this.rectanglesWidth/2 + i*this.rectanglesWidth, this.canvasSize.y + 0.8*this.canvasSize.y, this.rectanglesWidth, this.canvasSize.y/3,"0x00ff00").setDepth(2);;
            this.scene.physics.add.existing(this.rectangles[i], false);
        }

    }

    /**
     * This method redraws the size of the created rectangles acording to the distance given by the raycaster.
     * @param {Raycaster} raycaster The raycaster to obtain the graph information.
     */
    redraw3DScaling(raycaster){
        //This method allows the recalculation of the 3D ray coordinates and redraws it.
        for(let i = 0; i < this.rectanglesAmount; i++){
            this.setHeight = raycaster.calculateRayData().distance[i];
            this.rectangles[i].setPosition(this.rectanglesWidth/2 + i*this.rectanglesWidth, (this.canvasSize.y + 0.8*this.canvasSize.y) - this.getHeight()/2);
            this.rectangles[i].setSize(this.rectanglesWidth, this.getHeight());
    
            if(raycaster.calculateRayData().typeOfHit[i] === "vertical"){
                this.rectangles[i].setFillStyle("0x004200");
            }else{
                this.rectangles[i].setFillStyle("0x00ff00");
            }
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