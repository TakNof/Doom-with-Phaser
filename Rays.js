/**
 * This class contains all the atributes needed to create the rays of the raycaster.
 */
class Rays{
    /**
     * The constructor of the Ray class.
     * @param {Scene} scene The current scene of the game to place the ray.
     * @param {number} raysAmount The amount of rays to graph.
     */
    constructor(scene, raysAmount, spritePosition, initialRayAngleOffset){
        this.scene = scene;
        this.raysAmount = raysAmount;
        this.rays = Array(raysAmount);

        this.initialRayAngleOffset = initialRayAngleOffset;

        for(let i = 0; i < this.raysAmount; i++){
            this.rays[i] = this.scene.add.line(spritePosition.x, spritePosition.y, 0, 0, 0, 0, "0x00ff00");
            this.scene.physics.add.existing(this.rays[i], false);
            this.rays[i].body.setAllowRotation(true);
            this.rays[i].body.setSize(64, 64, true);
            this.rays[i].body.setCollideWorldBounds(true);
        }
    }

    get getInitialRayAngleOffset(){
        return this.initialRayAngleOffset;
    }

    setVelocity(velocity){
        for(let ray of this.rays){
            ray.body.setVelocity(velocity);
        }
    }

    setVelocityX(velocity){
        for(let ray of this.rays){
            ray.body.setVelocityX(velocity);
        }
    }

    setVelocityY(velocity){
        for(let ray of this.rays){
            ray.body.setVelocitY(velocity);
        }
    }

    /**
     * @param {{x: number, y: number}} position The position of the sprite form where the rays are being generated.
     * @param {Raycaster} raycaster The raycaster to obtain the graph information.
     */
    redrawRay2D(position, raycaster){
        //This method allows the recalculation of the ray coordinates and redraws it.
        for(let i = 0; i < this.raysAmount; i++){
            //The XEquation and YEquation are needed due to the fact that the ray is drawn according to "local" coordinates,
            //so we have to convert them to global coordinates.
            this.rays[i].setTo(0, 0, - position.x + raycaster.calculateRayData().x[i], - position.y + raycaster.calculateRayData().y[i]);
        }
    }
}