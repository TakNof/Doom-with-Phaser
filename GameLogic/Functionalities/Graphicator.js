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

        /**
         * Distance (in pixels) from the camera to the projection plane, derived from the fov.
         * This is the single constant that ties wall height, sprite scale and sprite vertical
         * placement together into one consistent perspective: everything projects as
         * (worldSizeInPixels * projectionPlaneDistance) / distance.
         */
        this.projectionPlaneDistance = (canvasSize.height/2)/Math.tan(this.config.fov/2);

        let rectanglesAmount = options.quality.value;

        this.rectanglesWidth = canvasSize.width/rectanglesAmount;

        this.verticalLines = Array(rectanglesAmount);
        this.rectanglesWorldHeight = 2;
        this.rectanglesWorldzPosition = 0;
        this.pixelAmount = 32;

        this.texture = this.buildBrickTexture();

        // Floor/ceiling are cast per-column, just like walls, using their own bands (see
        // castFloorOrCeiling) instead of a flat, camera-independent backdrop.
        this.floorPixelAmount = 6;
        this.ceilingPixelAmount = 6;
        this.floorPixels = Array(rectanglesAmount);
        this.ceilingPixels = Array(rectanglesAmount);

        for(let i = 0; i < rectanglesAmount; i++){
            let fixedXPosition = this.rectanglesWidth*(i + 0.5);
            let fixedYPosition = canvasSize.height/2;

            this.verticalLines[i] = this.scene.add.container(fixedXPosition, fixedYPosition);
            let rectangleSizeY = this.placeElementHeightProjection(100, this.rectanglesWorldHeight, this.rectanglesWorldzPosition);
            let pixelHeight = rectangleSizeY/this.pixelAmount;

            let pixelStep = this.blockSize/this.pixelAmount;
            let pixelAux = 0;
            for(let y = 0; y < this.pixelAmount; y++){
                let color = this.texture[Math.ceil(pixelAux*this.blockSize)] == 1 ? colors.mortar : colors.brick;
                let pixelYPosition = (pixelHeight/2 - fixedYPosition/2) + (y*pixelHeight);
                let pixel = this.scene.add.rectangle(0, pixelYPosition, this.rectanglesWidth, pixelHeight, color);
                this.verticalLines[i].add(pixel);
                pixelAux += pixelStep;
            }

            // Floor/ceiling bands are top-level rectangles rather than container children,
            // because (unlike a wall column's texture rows, which all sit at the same distance)
            // each band is at its own distance and needs its own depth to sort correctly
            // against other columns' walls and sprites.
            this.floorPixels[i] = Array(this.floorPixelAmount);
            for(let f = 0; f < this.floorPixelAmount; f++){
                this.floorPixels[i][f] = this.scene.add.rectangle(fixedXPosition, fixedYPosition, this.rectanglesWidth, 1, colors.floor);
            }

            this.ceilingPixels[i] = Array(this.ceilingPixelAmount);
            for(let c = 0; c < this.ceilingPixelAmount; c++){
                this.ceilingPixels[i][c] = this.scene.add.rectangle(fixedXPosition, fixedYPosition, this.rectanglesWidth, 1, colors.ceiling);
            }
        }
    }

    /**
     * Builds a running-bond brick pattern (mortar joints staggered by half a brick every other
     * course) as a flat 0/1 grid the same shape the wall-column sampling in redraw3DScaling already
     * reads from: this.blockSize rows by this.blockSize columns, where redraw3DScaling only ever
     * samples every (blockSize/pixelAmount)-th row - so each of those rows is generated directly,
     * then repeated to fill the rows in between for a texture that stays coherent if read as-is.
     * @returns {Array<number>} A flat 0/1 array, 1 = mortar, 0 = brick body.
     */
    buildBrickTexture(){
        // const size = this.blockSize;
        // const rowsSampled = this.pixelAmount;
        // const rowStride = size/rowsSampled;

        // const brickWidth = 8;
        // const courseHeight = 4;

        // const texture = new Array(size*size);

        // for(let row = 0; row < size; row++){
        //     const sampledRow = Math.floor(row/rowStride);
        //     const rowInCourse = sampledRow % courseHeight;
        //     const course = Math.floor(sampledRow/courseHeight);
        //     const offset = (course % 2 === 0) ? 0 : brickWidth/2;
        //     const isMortarRow = rowInCourse === 0;

        //     for(let col = 0; col < size; col++){
        //         const isMortarJoint = (col + offset) % brickWidth === brickWidth - 1;
        //         texture[row*size + col] = (isMortarRow || isMortarJoint) ? 1 : 0;
        //     }
        // }

        const texture = [
            0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1,
            0,0,0,0,1,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1,
            0,1,1,1,1,1,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1,
            0,1,1,1,1,1,1,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1,
            0,1,1,1,1,1,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1,
            0,0,0,0,1,1,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1,
            0,0,0,0,1,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1,
            0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1,

            1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0,
            1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0,
            1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0,
            1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0,
            1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0,
            1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0,
            1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0,
            1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0,
            
            0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1,
            0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1,
            0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1,
            0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1,
            0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1,
            0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1,
            0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1,
            0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1,

            1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0,
            1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0,
            1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0,
            1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0,
            1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0,
            1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0,
            1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0,
            1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0,
        ]

        return texture;
    }

    /**
     * This method redraws the size of the created rectangles acording to the distance given by the raycaster,
     * and casts that same ray's floor and ceiling bands.
     * @param {{x: Array<number>, y: Array<number>, angles: Array<number>, rayAngles: Array<number>, distances: Array<number>, typeOfHit: Array<string>}} raycasterData The per-ray data from the raycaster.
     * @param {{x: Number, y: Number}} emitterPosition The world position of the camera owner (the player), used to cast the floor/ceiling.
     */
    redraw3DScaling(raycasterData, emitterPosition) {
        const horizon = canvasSize.height/2;
        const eyeHeightPx = this.config.zPosition*this.blockSize;

        for(let i = 0; i < this.verticalLines.length; i++){
            let verticalLineHeight = this.placeElementHeightProjection(raycasterData.distances[i], this.rectanglesWorldHeight, this.rectanglesWorldzPosition);
            let pixelHeight = verticalLineHeight/this.pixelAmount;

            let shade = raycasterData.typeOfHit[i] === "v" ? 1: 0.8;

            let pixelStep = this.blockSize/this.pixelAmount;
            let currentTextureRow = 0;

            // The texture's horizontal (U) coordinate has to come from whichever world axis
            // actually varies along the hit wall's face, not always X: a "v" hit crossed a
            // vertical grid line (wall face runs along Y, so Y is what changes as you scan
            // across it); an "h" hit crossed a horizontal grid line (wall face runs along X).
            // Always sampling X regardless of hit type is why a "v" wall's texture used to barely
            // move between columns - X stays nearly constant along that wall's own face.
            // Math.floor (not Math.ceil) here: a texel index is "which cell does this continuous
            // coordinate fall inside," which is the floor of it. Math.ceil rounds a position that's
            // fractionally almost at a block boundary (e.g. 31.9998, a float artifact of a hit that's
            // really still in the current block) up to 32, which then wraps to column 0 - jumping to
            // the START of the texture instead of landing on its last column (31), right at the point
            // where a wall segment visually ends.
            let texturePixelXcounter;
            if(raycasterData.typeOfHit[i] === "v"){
                texturePixelXcounter = Math.floor(raycasterData.raysHitYposition[i])%this.blockSize;
                if(raycasterData.angles[i] > Math.PI/2 && raycasterData.angles[i] < 3*Math.PI/2){
                    texturePixelXcounter = this.blockSize - 1 - texturePixelXcounter;
                }
            }else{
                texturePixelXcounter = Math.floor(raycasterData.raysHitXposition[i])%this.blockSize;
                if(raycasterData.angles[i] > Math.PI){
                    texturePixelXcounter = this.blockSize - 1 - texturePixelXcounter;
                }
            }
            texturePixelXcounter = ((texturePixelXcounter%this.blockSize) + this.blockSize)%this.blockSize;
            for(let y = 0; y < this.pixelAmount; y++){
                let color = this.texture[currentTextureRow*this.blockSize + texturePixelXcounter] == 1 ? colors.mortar: colors.brick;
                color *= shade;

                let pixelYPosition = (pixelHeight/2 - verticalLineHeight/2) + (y*pixelHeight);

                this.verticalLines[i].list[y].setPosition(0, pixelYPosition, this.rectanglesWidth, pixelHeight);
                this.verticalLines[i].list[y].setSize(this.rectanglesWidth, pixelHeight);
                this.verticalLines[i].list[y].setFillStyle(color);
                currentTextureRow += pixelStep;
            }

            this.verticalLines[i].setDepth(1000 - (raycasterData.distances[i]/10).toFixed(0));

            const column = {
                x: this.rectanglesWidth*(i + 0.5),
                rayDirX: Math.cos(raycasterData.rayAngles[i]),
                rayDirY: Math.sin(raycasterData.rayAngles[i]),
                sinFixAngle: Math.sin(raycasterData.angles[i]),
                emitterX: emitterPosition.x,
                emitterY: emitterPosition.y
            };

            const wallTop = horizon - verticalLineHeight/2;
            const wallBottom = horizon + verticalLineHeight/2;

            // this.castFloorOrCeiling(this.floorPixels[i], this.floorPixelAmount, Math.max(wallBottom, horizon + 1), canvasSize.height, horizon, eyeHeightPx, column, colors.floor, colors.floorAlt);
            // this.castFloorOrCeiling(this.ceilingPixels[i], this.ceilingPixelAmount, 0, Math.min(wallTop, horizon - 1), horizon, eyeHeightPx, column, colors.ceiling, colors.ceilingAlt);
        }
    }

    /**
     * Renders one column's worth of floor or ceiling as a stack of perspective-correct bands
     * between screenTop and screenBottom. Each band's distance comes from the classic row-casting
     * formula (how far a screen row sits from the horizon maps directly to a world distance via
     * projectionPlaneDistance); that perpendicular distance is then converted into a real
     * (worldX, worldY) point along this column's own ray using the same fisheye-correction
     * relationship the raycaster already applies to wall hits (distance*sin(fixAngle)), just
     * inverted. That's what makes the tile checker line up with the world grid and shrink toward
     * the horizon correctly, instead of the flat, camera-independent backdrop this used to be.
     * @param {Array<Phaser.GameObjects.Rectangle>} pixels The pre-built band rectangles for this column.
     * @param {Number} amount How many bands to split screenTop..screenBottom into.
     * @param {Number} screenTop Top screen-Y of the region to cast (floor: below the wall; ceiling: 0).
     * @param {Number} screenBottom Bottom screen-Y of the region to cast.
     * @param {Number} horizon The screen-Y of the horizon (canvasSize.height/2).
     * @param {Number} heightPx How far (in pixels) the plane being cast sits from the camera's eye.
     * @param {{x:Number, rayDirX:Number, rayDirY:Number, sinFixAngle:Number, emitterX:Number, emitterY:Number}} column Precomputed per-column ray data.
     * @param {Number} color Tile color for even-parity world tiles.
     * @param {Number} altColor Tile color for odd-parity world tiles.
     */
    castFloorOrCeiling(pixels, amount, screenTop, screenBottom, horizon, heightPx, column, color, altColor){
        let span = screenBottom - screenTop;

        if(span <= 0){
            for(let b = 0; b < amount; b++){
                pixels[b].setVisible(false);
            }
            return;
        }

        let bandHeight = span/amount;

        for(let b = 0; b < amount; b++){
            let midY = screenTop + bandHeight*(b + 0.5);
            let perpDistance = (heightPx*this.projectionPlaneDistance)/Math.abs(midY - horizon);
            let radialDistance = Math.abs(column.sinFixAngle) > 1e-3 ? perpDistance/column.sinFixAngle : perpDistance;
            radialDistance = Math.max(radialDistance, 1);

            let worldX = column.emitterX + column.rayDirX*radialDistance;
            let worldY = column.emitterY + column.rayDirY*radialDistance;

            let tileX = Math.floor(worldX/this.blockSize);
            let tileY = Math.floor(worldY/this.blockSize);
            let tileColor = (((tileX + tileY)%2) + 2)%2 === 0 ? color : altColor;

            let pixel = pixels[b];
            pixel.setVisible(true);
            pixel.setPosition(column.x, midY);
            pixel.setSize(this.rectanglesWidth, bandHeight);
            pixel.setFillStyle(tileColor);
            pixel.setDepth(1000 - radialDistance/10);
        }
    }

    /**
     * This method sets the height (in pixels) required for a wall column to represent
     * the correct perspective size at the given distance.
     * @param {Number} objectDistance The distance from the player to the element.
     * @param {Number} objectHeight The general height of the element in the world (in blocks).
     * @param {Number} objectZPosition The base Z position of the element in the world (in blocks).
     */
    placeElementHeightProjection(objectDistance, objectHeight, objectZPosition) {
        // If the distance to the object is infinite, we wouldn't draw the element.
        if (!isFinite(objectDistance)) {
            return 0;
        }

        let scale = this.config.fov*objectHeight/(this.config.fov + objectDistance);
        let deltaZ = (objectZPosition - this.config.zPosition);
        let finalHeight = ((canvasSize.height - deltaZ*scale)/(objectDistance*Math.tan(this.config.fov/2)))*this.blockSize;
        return finalHeight;
    }

    /**
     * This method calculates the vertical screen offset (from the horizon, at canvasSize.height/2)
     * at which a sprite should be placed so that objects above the camera's eye level rise above
     * the horizon and objects below it sink below the horizon, both converging back to the horizon
     * as distance grows - the "vanishing point" effect.
     * @param {Number} objectDistance The perpendicular distance from the player to the element.
     * @param {Number} objectZPosition The Z position of the element in the world (in blocks).
     * @returns {Number} The vertical offset in pixels, relative to the horizon.
     */
    placeElementVerticalOffset(objectDistance, objectZPosition){
        if(!isFinite(objectDistance)){
            return 0;
        }

        let deltaZ = (objectZPosition - this.config.zPosition)*this.blockSize;
        return -(deltaZ*this.projectionPlaneDistance)/objectDistance;
    }

    /**
     * This method calculates the uniform scale a sprite needs so that its displayed pixel height
     * matches the same distance-based perspective used for walls and vertical placement, regardless
     * of the sprite texture's own native pixel size.
     * @param {Number} objectDistance The perpendicular distance from the player to the element.
     * @param {Number} objectHeight The general height of the element in the world (in blocks).
     * @param {Number} nativeHeightPx The element's native (unscaled) texture height in pixels.
     * @returns {Number} The scale factor to pass to setScale.
     */
    placeElementScale(objectDistance, objectHeight, nativeHeightPx){
        if(!isFinite(objectDistance) || !nativeHeightPx){
            return 0;
        }

        let targetHeight = (objectHeight*this.blockSize*this.projectionPlaneDistance)/objectDistance;
        return targetHeight/nativeHeightPx;
    }
}