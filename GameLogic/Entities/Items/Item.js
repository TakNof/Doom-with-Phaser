class Item extends Entity{
    /**
     * The constructor of the item class.
     * @constructor
     * @param {*} scene 
     * @param {*} originInfo 
     */
    constructor(scene, originInfo, key, size){
        super(scene, originInfo, key);

        scene.physics.add.existing(this, false);
        this.setActive(false);
        this.setVisible(false);

        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        this.setOwnSize(size);
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