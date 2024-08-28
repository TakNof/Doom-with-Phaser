class Cacodemon extends Enemy{
    /**
    * The constructor of Cacodemon Class.
    * @constructor
    * @param {Phaser.Scene} scene2D The scene to place the sprite in the game.
    * @param {Phaser.Scene} scene3D The scene to place the 3D sprite in the game.
    * @param {{x: Number, y: Number}} worldOriginInfo A literal Object with the initial positioning information for the sprite.
    * @param {Object} config The configuration object for the Enemy.
    */
    constructor(scene2D, scene3D, worldOriginInfo, config){
        super(scene2D, scene3D, worldOriginInfo, config);
    }

    shoot(){
        let time = this.getScene().time.now;

        if (time > this.nextFire){
            const {delay} = this.config.bulletConfig;
            this.nextFire = time + delay;

            let projectile = this.projectiles.getFirstDead();
            if(projectile){
                const {projectile3D} = projectile;
                projectile.setActive(true);
                projectile.setVisible(true);
                projectile.setPosition(this.getPositionX(), this.getPositionY());
                projectile.addForce(this.getUnitaryComponents(this.config.angleOffset));
                
                projectile3D.setActive(true);
                projectile3D.setVisible(true);
                this.enemy3D.play(this.getSpriteAnimations("Attack"));

                this.projectileDestroyCall = this.scene.time.delayedCall(10*1000, ()=>{
                    if(projectile.active){
                        projectile3D.setActive(false);
                        projectile3D.setVisible(false);
                        this.projectiles.killAndHide(projectile);
                        
                        projectile.setVelocity(0);
                        projectile.setPosition(-100, -100);
                        console.log("Bullet fly time exceeded");
                    }
                });
            }
            
            this.getSpriteSounds("Attack").sound.setDetune(Phaser.Math.Between(-3,3)*100);
            this.getSpriteSounds("Attack").playSound(this);
        }
    }
} 