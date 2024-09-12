class Projectile extends Entity{
    /**
     * The constructor of the Projectile class.
     * @constructor
     * @param {Phaser.Scene} scene 
     * @param {{x: Number, y: Number}} originInfo
     * @param {String} key
     */
    constructor(scene, x, y, key){
        super(scene, {x: x, y: y}, key);
        this.scene.physics.add.existing(this, false);
        this.body.setAllowRotation(true);
        this.body.onCollide = false;
    }

    /**
    * Sets the size of the sprite.
    * @param {Number} size 
    */
    setOwnSize(size){
        this.size = size;
        if(!size.x){
            this.setSize(size, size, true);
        }else{
            this.setSize(size.x, size.y, true);
        }
    }  

    /**
     * Adds force to the bullet to start its movement acording to a velocity and a point in the canvas.
     * @param {Number} velocity 
     * @param {{x: Number, y: Number}} directionComponents 
     */
    addForce(directionComponents){
        this.setActive(true);
        this.setVisible(true);
        this.setOwnSize(12);
        let angle = Phaser.Math.RadToDeg(Math.atan(directionComponents.y/directionComponents.x));
        this.body.onCollide = true;
        // this.disableBody(false);
        this.setAngle(angle);
        this.setVelocityX(directionComponents.x * this.config.velocity);
        this.setVelocityY(directionComponents.y * this.config.velocity);

        if(this.spriteSounds){
            this.getSpriteSounds("Shoot").playSound(this);
        }
    }
}

/**
 * 
 */
class ProjectileGroup extends Phaser.Physics.Arcade.Group{
    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {Object} owner
     * @param {Number} maxAmount
     * @param {Array<Phaser.Sprite>} bulletDetectionElements
     * @param {JSON} config 
     */
    constructor(scene, owner, bulletDetectionElements, maxAmount, config){
        super(scene.physics.world, scene);
        this.owner = owner;

        this.createMultiple({
            classType: Projectile,
            key: config.name,
            max: maxAmount,
            quantity: maxAmount,
            active: false,
            visible: false,
            createCallback: (projectile) =>{
                projectile.config = config;
                if(config.sounds){
                    projectile.setSpriteSounds(projectile.texture.key, config.sounds);                    
                }

                if(config.make3D){
                    projectile.projectile3D = new Sprite(owner.scene3D, {x: canvasSize.width/2, y: canvasSize.height/2}, config.name.replace("small_", ""));
                    projectile.projectile3D.setActive(false);
                    projectile.projectile3D.setVisible(false);
                }
            }
        });

        Phaser.Actions.SetXY(this.getChildren(), -100, -100);

        for (let element of bulletDetectionElements) {
            scene.physics.add.collider(this, element, (object1, object2) => {
                let bullet, collidedObject;

                if(object1 instanceof Projectile){
                    bullet = object1;
                    collidedObject = object2;
                }else{
                    bullet = object2;
                    collidedObject = object1;
                }

                if(object2 instanceof Item){
                    object2.body.setVelocity(0);
                    return;
                }

                // console.log(`Collision detected: ${bullet.texture.key} collided with ${collidedObject.texture.key}`);
                bullet.setVelocity(0);
                bullet.setPosition(-100, -100);
                bullet.body.onCollide = false;

                if(bullet.projectile3D){
                    const {projectile3D} = bullet;
                    projectile3D.setActive(false);
                    projectile3D.setVisible(false);
                }
                
                bullet.setVisible(false);
        
                let enemyShotPlayer = owner instanceof Enemy && collidedObject instanceof Player;
                let playerShotEnemy = owner instanceof Player && collidedObject instanceof Enemy;
                if (enemyShotPlayer || playerShotEnemy) {
                    // console.log(`${collidedObject.texture.key} has received ${bullet.getDamage()} points of damage.`);
                    // console.log(`${collidedObject.texture.key} current health: ${collidedObject.getHealth()}`);
                    // console.log(collidedObject.isAlive);
                    if(collidedObject.isAlive){
                        if(playerShotEnemy) collidedObject.getStateMachine().transitionToState("Damaged");
                        if(enemyShotPlayer) collidedObject.getSpriteSounds("Damaged").playSound();
                        collidedObject.decreaseHealthBy(bullet.config.damage);
                    }

                    if(enemyShotPlayer){
                        collidedObject.camera.hud.displayHurtRedScreen();
                    }
                }

                if(bullet.spriteSounds){
                    bullet.getSpriteSounds("Explosion")?.playSound();
                }
            });
        }
    }

    updateSoundPaning(){
        this.getChildren().forEach(function (projectile) {
            projectile.updateSoundPaning();
        });
    };
}