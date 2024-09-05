class Weapon extends Entity{
    /**
    * The constructor of Weapon Class.
    * @constructor
    * @param {Phaser.Scene} scene2D The current scene of the game to place the bullets.
    * @param {Phaser.Scene} scene3D The current scene of the game to place the weapon sprite.
    * @param {{x: Number, y: Number, angleOffset: Number}} worldOriginInfo  A list with the initial positioning information for the weapon sprite.
    * @param {Object} owner The owner of the weapons.
    * @param {Array<Phaser.Object>} bulletDetectionElements The elements that will be detected by the bullets of the weapon.
    * @param {Object} config The specific configuration of the weapon
    */
    constructor(scene2D, scene3D, worldOriginInfo, owner, bulletDetectionElements, config){
        super(scene3D, worldOriginInfo, `${config.name}_${config.animations[0].name}`); //Loading the atlas directly instead of an sprite.
        this.scene2D = scene2D;
        this.owner = owner;
        this.depth = 10000;
        this.config = config;
        this.config.bulletConfig.delay = 60*1000/config.fireRate;
        this.nextFire = 0;

        this.bullets = new ProjectileGroup(scene2D, owner, bulletDetectionElements, config.ammoAmount, this.config.bulletConfig);
        this.setSpriteSounds(config.name, config.sounds);
        this.setSpriteAnimations(config.animations);
    }

    actionateWeapon(){
        let time = this.getScene().time.now;

        if (time > this.nextFire){
            const {delay} = this.config.bulletConfig;
            this.nextFire = time + delay;

            let bullet = this.bullets.getFirstDead(false);
            if(bullet){
                bullet.setVisible(true);
                bullet.setPosition(this.owner.getPositionX(), this.owner.getPositionY());
                bullet.addForce(this.owner.getUnitaryComponents(this.owner.config.angleOffset));

                this.scene.cameras.main.shake(200, 0.005);
                this.play(this.getSpriteAnimations("Shoot"));
                this.getSpriteSounds("Shoot").playSound();

                this.scene.time.delayedCall(10*1000, ()=>{
                    if(bullet.active){
                        bullet.setVisible(false);
                        bullet.setVelocity(0);
                        bullet.setPosition(-100, -100);
                        console.log("Bullet fly time exceeded");
                    };
                });
            }
        }
    }

    disable(){
        this.setVisible(false);
        this.setActive(false);
        this.nextFire = 0;
    }

    enable(){
        this.setVisible(true);
        this.setActive(true);
    }
}