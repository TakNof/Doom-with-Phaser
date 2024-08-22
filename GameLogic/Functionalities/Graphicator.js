/**
 * This class allows the representation 3D of the walls using the distance between one coordinate and multiple other coordinate points.
 */
class Graphicator{
    /**
     * @constructor
     * @param {Phaser.Scene} scene The current scene of the game to place the 3D graphics. 
     * @param {Number} blockSize The size of the blocks of the level in pixels.
     * @param {Number} raysAmount The amount of rays to draw in the canvas.
     */
    constructor(scene, blockSize, raysAmount){
        this.scene = scene;
        this.blockSize = blockSize;

        this.rectanglesAmount = raysAmount;

        this.rectanglesWidth = canvasSize.width/this.rectanglesAmount;
        
        this.rectangles = Array(raysAmount);
        this.rectanglesWorldHeight = 1.27;

        for(let i = 0; i < this.rectanglesAmount; i++){
            let fixedXPosition = this.rectanglesWidth*(i + 1/2);
            let fixedYPosition = canvasSize.width/2;
            this.rectangles[i] = this.scene.add.rectangle(fixedXPosition, fixedYPosition, this.rectanglesWidth, canvasSize.height/3, "0x00ff00");
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
        for(let [i, rectangle] of this.rectangles.entries()){
            rectangle.setSize(this.rectanglesWidth, this.placeElementHeightProjection(rayDistance[i], this.rectanglesWorldHeight));
    
            rectangle.setFillStyle(typeOfHit[i] === "vertical" ? colors.limeGreen : colors.DarkGreen);

            rectangle.setDepth(1000 - (rayDistance[i]/10).toFixed(0));
        }
    }

    /**
     * This method sets the height required for the element to be inbounds of the canvas.
     * @param {Number} objectDistance The distance from the player to the element.
     * @param {Number} objectHeight The general height of the element in the world.
     */
    placeElementHeightProjection(objectDistance, objectHeight){

        //If the distance to the object is infinite, we wouldn't draw the element.
        //else we stablish the drawing height according to the block size
        //and the canvas size, if that measure surpasses the bounds of the
        //canvas, we stablish its height at the max height allowed by the canvas.
        if(!isFinite(objectDistance)){
            return 0;
        }else{
            return Math.min(this.blockSize*canvasSize.height/objectDistance, objectHeight*canvasSize.height)
        }   
    }
}