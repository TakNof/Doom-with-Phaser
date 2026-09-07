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
    constructor(scene, emitter){
        this.scene = scene;
        this.emitter = emitter;

        this.rays = Array(this.emitter.config.rayAmount);

        for(let i = 0; i < this.rays.length; i++){
            this.rays[i] = this.scene.add.line(this.emitter.getPositionX(), this.emitter.getPositionY(), 0, 0, 0, 0, this.emitter.config.rayColor);
            this.scene.physics.add.existing(this.rays[i], false);
            this.rays[i].body.setAllowRotation(true);
            this.rays[i].body.setSize(emitter.config.size, emitter.config.size, true);
        }
    }

    /**
     * Gets the list of rays created.
     * @returns {Array<Phaser.line>}
     */
    getRays(){
        return this.rays;
    }

    /**
     * Sets the velocity in the X component of the rays.
     * @param {number} value
     */
    setVelocityX(value){
        for(let ray of this.rays){
            ray.body.setVelocityX(value);
        }
    }

    /**
     * Sets the velocity in the Y component of the rays.
     * @param {number} value
     */
    setVelocityY(value){
        for(let ray of this.rays){
            ray.body.setVelocityY(value);
        }
    }

    /**
     * Sets the velocity in both axis of the living sprite.
     * @param {Number} value
     */
    setVelocity(value){
        this.setVelocityX(value);
        this.setVelocityY(value);
    }
    
    /**
     * This method redraws the created rays to the new coordinates given by the raycaster and the sprite's position.
     * @param {Array<{rayHitXposition: number, rayHitYposition: number}>} rayDataCoordinates The rayData thrown by the raycaster to graph the rays.
     */
    redrawRay2D(rayDataCoordinates){
        //This method allows the recalculation of the ray coordinates and redraws it.
        for(let i = 0; i < this.emitter.config.rayAmount; i++){
            let rayInfo = rayDataCoordinates[i];
            this.rays[i].setTo(0, 0, -this.emitter.getPositionX() + rayInfo.rayHitXposition, -this.emitter.getPositionY() + rayInfo.rayHitYposition);
        }
    }

    /**
     * Custom method to call the same method to all children in the group.
     * @param {String} methodName the name of the method to call.
     * @param  {...any} args the arguments to pass to the method.
     */
    callAll(methodName, ...args) {
        this.rays.forEach(function (ray) {
            if(args === null){
                ray[methodName]();
            }else{
                ray[methodName](...args);
            }
        });
    };
}