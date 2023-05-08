/**
 * This class contains all the atributes needed to create the rays of the raycaster.
 */
class Rays{
    /**
     * The constructor of the Rays class.
     * @param {Scene} scene The current scene of the game to place the ray.
     * @param {number} raysAmount The amount of rays to graph.
     * @param {Object} spritePosition The position of the sprite.
     * @param {String} colorOfRays The color of the rays.
     */
    constructor(scene, raysAmount, spritePosition, colorOfRays){
        this.scene = scene;
        this.raysAmount = raysAmount;
        this.rays = Array(raysAmount);

        for(let i = 0; i < this.raysAmount; i++){
            this.rays[i] = this.scene.add.line(spritePosition.x, spritePosition.y, 0, 0, 0, 0, colorOfRays);
            this.scene.physics.add.existing(this.rays[i], false);
            this.rays[i].body.setAllowRotation(true);
            this.rays[i].body.setSize(64, 64, true);
            this.rays[i].body.setCollideWorldBounds(true);
        }
    }

    /**
     * Sets the initial angle ray offset.
     * @param {number} rayAngleOffset
     */
    set setInitialRayAngleOffset(rayAngleOffset){
        this.initialRayAngleOffset = rayAngleOffset;
    }

    /**
     * Gets the initial angle ray offset.
     */
    get getInitialRayAngleOffset(){
        return this.initialRayAngleOffset;
    }

    /**
     * Sets the velocity in the X component of the rays.
     * @param {number} value
     */
    set setVelocityX(value){
        for(let ray of this.rays){
            ray.body.setVelocityX(value);
        }
    }

    /**
     * Sets the velocity in the Y component of the rays.
     * @param {number} value
     */
    set setVelocityY(value){
        for(let ray of this.rays){
            ray.body.setVelocityY(value);
        }
    }

    /**
     * Sets the velocity in both axis of the rays.
     * @param {number} value
     */
    set setVelocity(value){
        this.setVelocityX = value;
        this.setVelocityY = value;
    }

    /**
     * This method redraws the created rays to the new coordinates given by the raycaster and the sprite's position.
     * @param {{x: number, y: number}} position The position of the sprite form where the rays are being generated.
     * @param {{x: coordinatesX, y: coordinatesY}} rayDataCoordinates The rayData thrown by the raycaster to graph the rays.
     */
    redrawRay2D(position, rayDataCoordinates){
        //This method allows the recalculation of the ray coordinates and redraws it.
        for(let i = 0; i < this.raysAmount; i++){
            //The XEquation and YEquation are needed due to the fact that the ray is drawn according to "local" coordinates,
            //so we have to convert them to global coordinates.
            this.rays[i].setTo(0, 0, - position.x + rayDataCoordinates.x[i], - position.y + rayDataCoordinates.y[i]);
        }
    }
}