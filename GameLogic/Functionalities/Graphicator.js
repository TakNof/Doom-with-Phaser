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
        this.floorCeilingTexture = this.buildFloorCeilingTexture();

        // Floor/ceiling are cast per-column, just like walls, using their own bands (see
        // castFloorOrCeiling). They're grouped into containers ("vertical lines") the same
        // way wall columns are, and kept at the lowest depth on purpose: a container has a
        // single depth relative to other display objects, so individual bands can no longer
        // be interleaved against sprites at their own per-band distance - pinning floor/ceiling
        // to the back avoids that ordering problem entirely instead of getting it wrong.
        this.floorPixelAmount = 32;
        this.ceilingPixelAmount = 32;
        this.floorLines = Array(rectanglesAmount);
        this.ceilingLines = Array(rectanglesAmount);

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

            this.floorLines[i] = this.scene.add.container(fixedXPosition, 0);
            this.floorLines[i].setDepth(0);
            for(let f = 0; f < this.floorPixelAmount; f++){
                let pixel = this.scene.add.rectangle(0, fixedYPosition, this.rectanglesWidth, 1, colors.floor);
                this.floorLines[i].add(pixel);
            }

            this.ceilingLines[i] = this.scene.add.container(fixedXPosition, 0);
            this.ceilingLines[i].setDepth(0);
            for(let c = 0; c < this.ceilingPixelAmount; c++){
                let pixel = this.scene.add.rectangle(0, fixedYPosition, this.rectanglesWidth, 1, colors.ceiling);
                this.ceilingLines[i].add(pixel);
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
        const texture = [
            1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,
            0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0,
            0,0,0,0,1,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0,
            0,0,1,1,1,1,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0,
            0,0,0,1,1,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0,
            0,0,0,0,1,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0,
            1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,

            1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,
            1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,
            1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,
            
            1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,
            0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0,
            1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,

            1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,
            1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,
            1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,
        ]

        return texture;
    }

    /**
     * Builds a simple tiled grout pattern shared by the floor and ceiling: a this.blockSize by
     * this.blockSize 0/1 grid with a grout line along one edge of each tile (row 0 and column 0).
     * Sampled with a world coordinate wrapped modulo this.blockSize (see castFloorOrCeiling), that
     * single edge repeats into a full grid of tile borders, the same way a single brick course
     * repeats into the full wall texture.
     * @returns {Array<number>} A flat 0/1 array, 1 = grout line, 0 = tile body.
     */
    buildFloorCeilingTexture(){
        const texture = [
            1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,
            0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0,
            0,0,0,0,1,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0,
            0,0,1,1,1,1,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0,
            0,0,0,1,1,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0,
            0,0,0,0,1,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0,
            1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,

            1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,
            1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,
            1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,
            
            1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,
            0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0,
            1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,

            1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,
            1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,
            1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,
        ]

        return texture;
    }

    /**
     * This method redraws the size of the created rectangles acording to the distance given by the raycaster,
     * and casts that same ray's floor and ceiling bands.
     * @param {Array<{rayHitXposition: number, rayHitYposition: number, angle: number, rayAngle: number, distance: number, typeOfHit: string}>} raycasterData The per-ray data from the raycaster.
     * @param {{x: Number, y: Number}} emitterPosition The world position of the camera owner (the player), used to cast the floor/ceiling.
     * @param {Number} emitterAngle The camera owner's facing angle (radians), i.e. the raycaster's center ray - used to derive the floor/ceiling fisheye correction directly, the same way the reference row-caster computes cos(playerAngle - rayAngle).
     */
    redraw3DScaling(raycasterData, emitterPosition, emitterAngle) {
        const horizon = canvasSize.height/2;
        const eyeHeightPx = this.config.zPosition*this.blockSize;

        for(let i = 0; i < this.verticalLines.length; i++){
            let rayInfo = raycasterData[i];
            let currentVerticalLine = this.verticalLines[i];
            let verticalLineHeight = this.placeElementHeightProjection(rayInfo.distance, this.rectanglesWorldHeight, this.rectanglesWorldzPosition);
            let pixelHeight = verticalLineHeight/this.pixelAmount;

            let shade = rayInfo.typeOfHit === "v" ? 1: 0.8;

            let pixelStep = this.blockSize/this.pixelAmount;
            let currentTextureRow = 0;

            let texturePixelXcounter;
            if(rayInfo.typeOfHit === "v"){
                texturePixelXcounter = Math.floor(rayInfo.rayHitYposition)%this.blockSize;
                if(rayInfo.rayAngle > Math.PI/2 && rayInfo.rayAngle < 3*Math.PI/2){
                    texturePixelXcounter = this.blockSize - 1 - texturePixelXcounter;
                }
            }else{
                texturePixelXcounter = Math.floor(rayInfo.rayHitXposition)%this.blockSize;
                if(rayInfo.rayAngle < Math.PI)
                    {
                    texturePixelXcounter = this.blockSize - 1 - texturePixelXcounter;
                }
            }
            for(let y = 0; y < this.pixelAmount; y++){
                let color = this.texture[currentTextureRow*this.blockSize + texturePixelXcounter] == 1 ? colors.mortar: colors.brick;
                color *= shade;

                let pixelYPosition = (pixelHeight/2 - verticalLineHeight/2) + (y*pixelHeight);

                currentVerticalLine.list[y].setPosition(0, pixelYPosition, this.rectanglesWidth, pixelHeight);
                currentVerticalLine.list[y].setSize(this.rectanglesWidth, pixelHeight);
                currentVerticalLine.list[y].setFillStyle(color);
                currentTextureRow += pixelStep;
            }

            currentVerticalLine.setDepth(1000 - (rayInfo.distance/10).toFixed(0));

            const column = {
                x: this.rectanglesWidth*(i + 0.5),
                rayDirX: Math.cos(rayInfo.rayAngle),
                rayDirY: Math.sin(rayInfo.rayAngle),
                // cos of this ray's angular offset from the player's own facing direction - the
                // fisheye correction, derived the same way the reference row-caster computes
                // raFix = cos(FixAng(playerAngle - rayAngle)), rather than reusing rayInfo.angle
                // (which Raycaster.js derives independently for the wall-distance correction).
                raFix: Math.cos(rayInfo.rayAngle - emitterAngle),
                emitterX: emitterPosition.x,
                emitterY: emitterPosition.y
            };

            const wallTop = horizon - verticalLineHeight/2;
            const wallBottom = horizon + verticalLineHeight/2;

            const topSize = wallTop;
            // The floor region (wallBottom..canvasSize.height) is always exactly as tall as the
            // ceiling region (0..wallTop), since horizon sits at the exact vertical midpoint of
            // the canvas - canvasSize.height - wallBottom reduces to horizon - verticalLineHeight/2,
            // the same expression as topSize.
            const bottomSize = topSize;

            const ceilingYPosition = topSize/2;
            const floorYPosition = wallBottom + bottomSize/2;

            const ceilingPixelHeight = topSize/this.ceilingPixelAmount;
            const floorPixelHeight = bottomSize/this.floorPixelAmount;

            this.floorLines[i].setPosition(this.floorLines[i].x, floorYPosition);
            this.floorLines[i].setSize(this.rectanglesWidth, bottomSize);
            this.ceilingLines[i].setPosition(this.ceilingLines[i].x, ceilingYPosition);
            this.ceilingLines[i].setSize(this.rectanglesWidth, topSize);

            // floorPixelAmount === ceilingPixelAmount and bottomSize === topSize (horizon symmetry),
            // so band p of the floor and band (amount-1-p) of the ceiling sit the same |distance|
            // from the horizon and land on the exact same world point - one trig+texture sample
            // serves both, the same trick classic row-casters use when they compute tx/ty once for
            // screen row y and reuse it to draw the mirrored ceiling row at (screenHeight - y).
            const bandAmount = this.floorPixelAmount;
            for(let p = 0; p < bandAmount; p++){
                const floorLinePixels = this.floorLines[i].list[p];
                const mirroredIndex = bandAmount - 1 - p;
                const ceilingLinePixels = this.ceilingLines[i].list[mirroredIndex];

                const floorPixelYPosition = (floorPixelHeight/2 - bottomSize/2) + (p*floorPixelHeight);
                floorLinePixels.setPosition(0, floorPixelYPosition);
                floorLinePixels.setSize(this.rectanglesWidth, floorPixelHeight);

                const ceilingPixelYPosition = (ceilingPixelHeight/2 - topSize/2) + (mirroredIndex*ceilingPixelHeight);
                ceilingLinePixels.setPosition(0, ceilingPixelYPosition);
                ceilingLinePixels.setSize(this.rectanglesWidth, ceilingPixelHeight);

                const sample = this.sampleFloorCeilingTile(floorYPosition + floorPixelYPosition, horizon, eyeHeightPx, column);
                floorLinePixels.setFillStyle(this.tintFloorCeilingTile(sample, colors.floor, colors.floorAlt));
                ceilingLinePixels.setFillStyle(this.tintFloorCeilingTile(sample, colors.ceiling, colors.ceilingAlt));
            }
        }
    }

    /**
     * Computes the perspective-correct world tile a floor/ceiling band lands on. midY (this band's
     * absolute screen-Y center) maps to a world distance via the classic row-casting formula (how
     * far a screen row sits from the horizon corresponds directly to a world distance through
     * projectionPlaneDistance); that perpendicular distance is then turned into a real (worldX,
     * worldY) point along this column's own ray using the same fisheye-correction relationship the
     * raycaster applies to wall hits (distance*sin(fixAngle)), just inverted. Only Math.abs(midY -
     * horizon) matters, so a ceiling row (above the horizon) and its mirrored floor row (equally far
     * below it) resolve to the same world point - callers exploit that to sample once per row pair.
     * @param {Number} midY Absolute screen-Y center of the band being sampled.
     * @param {Number} horizon The screen-Y of the horizon (canvasSize.height/2).
     * @param {Number} heightPx How far (in pixels) the plane being cast sits from the camera's eye.
     * @param {{rayDirX:Number, rayDirY:Number, raFix:Number, emitterX:Number, emitterY:Number}} column Precomputed per-column ray data.
     * @returns {{isEvenTile: boolean, isGroutLine: boolean}} The tile parity (checkerboard) and whether this point falls on a grout line.
     */
    sampleFloorCeilingTile(midY, horizon, heightPx, column){
        const blockSize = this.blockSize;

        const perpDistance = (heightPx*this.projectionPlaneDistance)/Math.max(Math.abs(midY - horizon), 1e-6);
        const radialDistance = Math.max(Math.abs(column.raFix) > 1e-3 ? perpDistance/column.raFix : perpDistance, 1);

        const worldX = column.emitterX + column.rayDirX*radialDistance;
        const worldY = column.emitterY + column.rayDirY*radialDistance;

        const tileX = Math.floor(worldX/blockSize);
        const tileY = Math.floor(worldY/blockSize);
        const isEvenTile = (((tileX + tileY)%2) + 2)%2 === 0;

        const texX = Math.floor(((worldX%blockSize) + blockSize)%blockSize);
        const texY = Math.floor(((worldY%blockSize) + blockSize)%blockSize);
        const isGroutLine = this.floorCeilingTexture[texY*blockSize + texX] === 1;

        return {isEvenTile, isGroutLine};
    }

    /**
     * Turns a sampleFloorCeilingTile() result into a concrete fill color for one surface (floor or
     * ceiling), since the same sample is shared between a floor band and its mirrored ceiling band
     * but each needs its own color pair.
     * @param {{isEvenTile: boolean, isGroutLine: boolean}} sample Result from sampleFloorCeilingTile.
     * @param {Number} color Tile color for even-parity world tiles.
     * @param {Number} altColor Tile color for odd-parity world tiles.
     * @returns {Number} The color to fill this band with.
     */
    tintFloorCeilingTile(sample, color, altColor){
        const tileColor = sample.isEvenTile ? color : altColor;
        return sample.isGroutLine ? tileColor*0.5 : tileColor;
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