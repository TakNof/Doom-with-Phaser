class PlayerIdleState extends PlayerState{
    /**
     * 
     * @param {Player} player The object which will provide the context for the player states.
     * @param {Object} key
     */
    constructor(player, key){
        super(player, key);
    }

    enterState(){}
        
    updateState(){
        const {w, s, up, down} = this.player.config.controls;
        this.player.moveCamera();
    
        this.player.setVelocity(0);

        if((up.isDown ^ down.isDown) ^ (w.isDown ^ s.isDown)) {
            this.player.getStateMachine().transitionToState('Walk');
        }
    }

    exitState(){}

    getNextState(){
        return this.stateKey;
    }

    /**
     * 
     * @param {Object} other The object which has entered the trigger. 
     */
    onTriggerEnter(other){}

    /**
     * 
     * @param {Object} other The object which is staying the trigger. 
     */
    onTriggerStay(other){}

    /**
     * 
     * @param {Object} other The object which has exited the trigger. 
     */
    onTriggerExit(other){}
}

class PlayerWalkState extends PlayerState{
    /**
     * 
     * @param {Player} player The object which will provide the context for the player states.
     * @param {Object} key
     */
    constructor(player, key){
        super(player, key);
    }

    enterState(){}

    updateState(){
        const {w, s, up, down} = this.player.config.controls;

        this.player.moveCamera();

        if(!(up.isDown ^ down.isDown) ^ (w.isDown ^ s.isDown)){
            this.player.stateMachine.transitionToState('Idle');
        }

        if((up.isDown ^ down.isDown) ^ (w.isDown ^ s.isDown)){
            if (up.isDown || w.isDown){
                //Here we use the velocity calculated, and we change its sign accordingly to the direction of movement.
                this.player.setVelocityX(this.player.getXcomponent());
                this.player.setVelocityY(this.player.getYcomponent()); 

            }else if(down.isDown || s.isDown){    
                this.player.setVelocityX(-this.player.getXcomponent());
                this.player.setVelocityY(-this.player.getYcomponent());
            }
        }
    }

    exitState(){}

    getNextState(){
        return this.stateKey;
    }

    /**
     * 
     * @param {Object} other The object which has entered the trigger. 
     */
    onTriggerEnter(other){}

    /**
     * 
     * @param {Object} other The object which is staying the trigger. 
     */
    onTriggerStay(other){}

    /**
     * 
     * @param {Object} other The object which has exited the trigger. 
     */
    onTriggerExit(other){}
}


class PlayerDeadState extends PlayerState{
    /**
     * 
     * @param {Player} player The object which will provide the context for the player states.
     * @param {Object} key
     */
    constructor(player, key){
        super(player, key);
    }

    enterState(){
        this.player.getSpriteSounds("Dead").playSound();
    }

    updateState(){
        this.player.setVelocityX(0)
    }

    exitState(){}

    getNextState(){
        return this.stateKey;
    }

    /**
     * 
     * @param {Object} other The object which has entered the trigger. 
     */
    onTriggerEnter(other){}

    /**
     * 
     * @param {Object} other The object which is staying the trigger. 
     */
    onTriggerStay(other){}

    /**
     * 
     * @param {Object} other The object which has exited the trigger. 
     */
    onTriggerExit(other){}
}