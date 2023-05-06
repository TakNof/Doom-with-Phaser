class Graphicator{
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
     * @param {Array<number>} rayDistance The ray distance to graph the rectangles size.
     * @param {Array<String>} typeOfHit The type of hit of the ray to select its colour.
     */
    redraw3DScaling(rayDistance, typeOfHit) {
        //This method allows the recalculation of the 3D ray coordinates and redraws it.
        for(let i = 0; i < this.rectanglesAmount; i++){
            this.setRectangleHeight = rayDistance[i];
            this.rectangles[i].setPosition(this.rectanglesWidth/2 + i*this.rectanglesWidth, (this.canvasSize.y + 0.8*this.canvasSize.y) - this.getRectangleHeight/2);
            this.rectangles[i].setSize(this.rectanglesWidth, this.getRectangleHeight);
    
            if(typeOfHit[i] === "vertical"){
                this.rectangles[i].setFillStyle("0x004200");
            }else{
                this.rectangles[i].setFillStyle("0x00ff00");
            }
        }
    }

    /**
     * This method sets the height required for the rectangle to be inbounds of the canvas.
     * @param {number} distance The distance between the sprite and the wall.
     */
    set setRectangleHeight(distance){

        //If the distance is infinite, we wouldn't draw the rectangle.
        //else we stablish the drawing height according to the block size
        //and the canvas size, if that measure surpasses the bounds of the
        //canvas, we stablish its height at the max height allowed by the canvas.
        if(!isFinite(distance)){
            this.drawHeight = 0;
        }else{
            this.drawHeight = (this.blockSize*this.canvasSize.y)/distance;
            if(this.drawHeight > 1.27*this.canvasSize.y){
                this.drawHeight = 1.27*this.canvasSize.y;
            }
        }   
    }

    get getRectangleHeight(){
        return this.drawHeight;
    }

    setEnemyHeight(distance){
        let drawHeight;

        if(!isFinite(distance)){
            drawHeight = 0;
        }else{
            drawHeight = this.blockSize * this.canvasSize.y/distance;
            if(drawHeight > 1.3*this.canvasSize.y){
                drawHeight = 1.3*this.canvasSize.y;
            }
        }

        return drawHeight;
    }
}