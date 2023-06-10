/**
 * This class allows the representation 3D of the walls using the distance between one coordinate and multiple other coordinate points.
 */
class Graphicator{
    /**
     * @constructor
     * @param {Scene} scene The current scene of the game to place the 3D graphics.
     * @param {number} blockSize The size of the blocks of the level in pixels.
     * @param {number} raysAmount The amount of rays to draw in the canvas.
     */
    constructor(scene, blockSize, raysAmount){
        this.scene = scene;
        this.blockSize = blockSize;

        this.rectanglesAmount = raysAmount;

        this.rectanglesWidth = canvasSize.width/this.rectanglesAmount;
        this.rectangles = Array(raysAmount);

        for(let i = 0; i < this.rectanglesAmount; i++){
            this.rectangles[i] = this.scene.add.rectangle(this.rectanglesWidth/2 + i*this.rectanglesWidth, 0.8*canvasSize.height, this.rectanglesWidth, canvasSize.height/3,"0x00ff00").setDepth(1);;
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
            this.rectangles[i].setPosition(this.rectanglesWidth/2 + i*this.rectanglesWidth, (0.8*canvasSize.height) - this.getRectangleHeight/2);
            this.rectangles[i].setSize(this.rectanglesWidth, this.getRectangleHeight);
    
            if(typeOfHit[i] === "vertical"){
                this.rectangles[i].setFillStyle(colors.limeGreen);
            }else{
                this.rectangles[i].setFillStyle(colors.DarkGreen);
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
            this.drawHeight = (this.blockSize*canvasSize.height)/distance;
            if(this.drawHeight > 1.27*canvasSize.height){
                this.drawHeight = 1.27*canvasSize.height;
            }
        }   
    }

    /**
     * Gets the rectangle height.
     * @return {number}
     */
    get getRectangleHeight(){
        return this.drawHeight;
    }

    /**
     * Sets the rectangle depth.
     * @param {Number} index 
     * @param {Number} value 
     */
    setRectangleDepth(index, value){
        this.rectangles[index].setDepth(value);
    }

    /**
     * Calculates the enemy height according to the distance between the enemy and the player.
     * @param {number} distance 
     * @returns {number}
     */
    setEnemyHeight(distance){
        let drawHeight;

        if(!isFinite(distance)){
            drawHeight = 0;
        }else{
            drawHeight = this.blockSize * canvasSize.height/distance;
            if(drawHeight > 1.27*canvasSize.height){
                drawHeight = 1.27*canvasSize.height;
            }
        }

        return drawHeight;
    }
}