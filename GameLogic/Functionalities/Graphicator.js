/**
 * This class allows the representation 3D of the walls using the distance between one coordinate and multiple other coordinate points.
 */
class Graphicator{
    /**
     * @constructor
     * @param {Phaser.Scene} scene The current scene of the game to place the 3D graphics. 
     * @param {Number} blockSize The size of the blocks of the level in pixels.
     * @param {JSON} config The configuration object for the Camera.
     */
    constructor(scene, blockSize, config){
        this.scene = scene;
        this.blockSize = blockSize;
        this.config = config;

        let rectanglesAmount = options.quality.value;

        this.rectanglesWidth = canvasSize.width/rectanglesAmount;
        
        this.rectangles = Array(rectanglesAmount);
        this.rectanglesWorldHeight = 2;
        this.rectanglesWorldzPosition = 0;

        for(let i = 0; i < rectanglesAmount; i++){
            let fixedXPosition = this.rectanglesWidth*(i + 1/2);
            let fixedYPosition = canvasSize.width/2;
            this.rectangles[i] = this.scene.add.rectangle(fixedXPosition, fixedYPosition, this.rectanglesWidth, canvasSize.height, "0x00ff00");
            // this.scene.physics.add.existing(this.rectangles[i], false);
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
            rectangle.setPosition(this.rectanglesWidth/2 + i*this.rectanglesWidth, canvasSize.height/2 - this.blockSize*this.rectanglesWorldHeight/2);
            rectangle.setSize(this.rectanglesWidth, this.placeElementHeightProjection(rayDistance[i], this.rectanglesWorldHeight, this.rectanglesWorldzPosition));

            rectangle.setFillStyle(typeOfHit[i] === "vertical" ? colors.limeGreen : colors.DarkGreen);

            rectangle.setDepth(1000 - (rayDistance[i]/10).toFixed(0));
        }
    }

    // /**
    //  * This method sets the height required for the element to be inbounds of the canvas.
    //  * @param {Number} objectDistance The distance from the player to the element.
    //  * @param {Number} objectHeight The general height of the element in the world.
    //  */
    // placeElementHeightProjection(objectDistance, objectHeight){

    //     //If the distance to the object is infinite, we wouldn't draw the element.
    //     //else we stablish the drawing height according to the block size
    //     //and the canvas size, if that measure surpasses the bounds of the
    //     //canvas, we stablish its height at the max height allowed by the canvas.
    //     if(!isFinite(objectDistance)){
    //         return 0;
    //     }else{
    //         return Math.min(objectHeight*this.blockSize*canvasSize.height/objectDistance, this.config.zPosition*canvasSize.height);
    //     }   
    // }

    placeElementHeightProjection(objectDistance, objectHeight, objectZPosition) {
        // If the distance to the object is infinite, we wouldn't draw the element.
        if (!isFinite(objectDistance)) {
            return;
        }
    
        // Calculate the height projection based on the distance and object height
        let projectedHeight = objectHeight * this.blockSize * canvasSize.height / objectDistance;
    
        // Adjust the height based on the Z position of the object relative to the camera
        if (objectZPosition === this.config.zPosition) {
            // Case 1: Object is at the same height as the camera
            return Math.min(projectedHeight, this.config.zPosition * canvasSize.height);
        } else if (objectZPosition > this.config.zPosition) {
            // Case 2: Object is above the camera
            let heightAdjustment = (objectZPosition - this.config.zPosition) * this.blockSize;
            return Math.min(projectedHeight - heightAdjustment, this.config.zPosition * canvasSize.height);
        } else {
            // Case 3: Object is below the camera
            let heightAdjustment = (this.config.zPosition - objectZPosition) * this.blockSize;
            return Math.min(projectedHeight + heightAdjustment, this.config.zPosition * canvasSize.height);
        }
    }

    project3DTo2D(point, camera) {
        // Translate point to camera space
        let x = point.x - camera.x;
        let y = point.y - camera.y;
        let z = point.z - camera.z;
    
        // Apply perspective projection
        const scale = camera.fov / (camera.fov + z);
        
        // Ensure we don’t divide by zero or project too close
        const adjustedScale = Math.max(scale, 0.1); 
    
        // Compute screen coordinates
        x = x * adjustedScale + config.width / 2;
        y = y * adjustedScale + config.height / 2;
        
        return { x, y, scale: adjustedScale };
    }

    /**
     * 
     * @param {{x: Number, y: Number}} objectPosition position of the sprite in the 2D space.
     * @param {number} objectHeight height of the sprite in the 3D space.
     * @param {Number} distanceToOwner distance between the graphicator owner and the object.
     */
    placeProjectedObject(objectPosition, objectHeight, distanceToOwner){
        let x = objectPosition.x;
        let y = objectHeight - this.config.zPosition;
        let z = distanceToOwner;

        const scale = this.config.fov / (this.config.fov + z);
        
        const adjustedScale = Math.max(scale, 0.1);

        x = x * adjustedScale + canvasSize.width / 2;
        y = y * adjustedScale + canvasSize.height / 2;

        return { x, y, scale: adjustedScale };
    }
}