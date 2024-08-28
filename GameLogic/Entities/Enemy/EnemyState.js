class EnemyState extends BaseState {
    /**
     * 
     * @param {Enemy} enemy The object which will provide the context for the enemy states.
     * @param {String} stateKey
     */
    constructor(enemy, stateKey) {
        super(stateKey);
        this.enemy = enemy;
    }

    updateChildren(updatePosition = true){
        if(this.enemy.children.length > 0){
            for(let child of this.enemy.children){
                if(updatePosition){
                    this.updateChildPosition(child);
                }

            }
        }
    }

    updateChildPosition(child){
        let sign = this.enemy.flipX ? -1 : 1;
        child.setPosition(this.enemy.getPositionX() + sign*child.relativePosition.x, this.enemy.getPositionY() + child.relativePosition.y);
    }
}
  
