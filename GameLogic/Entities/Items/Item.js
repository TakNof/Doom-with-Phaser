class Item extends Entity{
    /**
     * The constructor of the Item class.
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
}

/**
 * 
 */
class ItemGroup extends Phaser.Physics.Arcade.Group{
    /**
     * 
     * @param {Phaser.Scene} scene The scene to place the 2D items.
     * @param {Phaser.Scene3D} scene3D The scene to place the 3D items.
     * @param {String} key The string of the sprite to place.
     * @param {Number} maxAmount The max amount of items of the group.
     */
    constructor(scene, scene3D, key, maxAmount){
        super(scene.physics.world, scene);
        this.scene3D = scene3D;

        this.createMultiple({
            classType: Item,
            key: "bullet",
            max: maxAmount,
            quantity: maxAmount,
            active: false,
            visible: false,
            createCallback: (item) =>{
                item.item3D = new Sprite(scene3D, {x: canvasSize.width/2, y: canvasSize.height/2}, key);
                item.item3D.setActive(false);
                item.item3D.setVisible(false);
            }
        });

        Phaser.Actions.SetXY(this.getChildren(), -200, -200);

        scene.physics.add.collider(this, scene.player, (object1, object2) => {
            let item, collidedObject;

            if(object1 instanceof Item){
                item = object1;
                collidedObject = object2;
            }else{
                item = object2;
                collidedObject = object1;
            }

            // console.log(`Collision detected: ${item.texture.key} collided with ${collidedObject.texture.key}`);
            item.body.onCollide = false;
            item.setPosition(-200, -200);

            const {item3D} = item;
            item3D.setActive(false);
            item3D.setVisible(false);

            this.killAndHide(item);
            
            if (collidedObject instanceof Player) {
                const {weaponManager} = collidedObject;
                switch(item.item3D.texture.key){
                    case "PistolAmmo":
                        let pistol = weaponManager.weapons.filter(weapon => weapon.config.name == "pistol")[0];
                        weaponManager.reloadWeapon(pistol, 10);
                    break;

                    case "ShotgunAmmo":
                        let Shotgun = weaponManager.weapons.filter(weapon => weapon.config.name == "shotgun")[0];
                        weaponManager.reloadWeapon(Shotgun, 10);
                    break;

                    case "MedPack":
                        collidedObject.heal(50);
                    break;
                }
            }
        });
    }
}