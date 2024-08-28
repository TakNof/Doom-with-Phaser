class PlayerState extends BaseState {
    /**
     * 
     * @param {Player} player The object which will provide the context for the player states.
     * @param {String} stateKey
     */
    constructor(player, stateKey) {
        super(stateKey);
        this.player = player;
    }

    updateChildren(updatePosition = true){
        if(this.player.children.length > 0){
            for(let child of this.player.children){
                if(updatePosition){
                    this.updateChildPosition(child);
                }
            }
        }
    }

    updateChildPosition(child){
        let sign = this.player.flipX ? -1 : 1;
        child.setPosition(this.player.getPositionX() + sign*child.relativePosition.x, this.player.getPositionY() + child.relativePosition.y);
    }
}
  
