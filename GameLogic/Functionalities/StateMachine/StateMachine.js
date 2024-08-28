class StateMachine{
    /**
     * 
     * @param {Map} states An object containing the states of the State Machine.
     */
    constructor(states){
        if (new.target === StateMachine) {
            throw new Error("Can not instanciate an abstract class.");
        }
        this.states = states;
        this.statesHistory = [];
        this.isTransitioningState = false;
        this.printTransitions = false;
    } 
    
    create(){
        this.addStateToHistory();
        this.currentState.enterState();
    }

    update(){
        this.nextStateKey = this.currentState.getNextState();
        
        if(!this.isTransitioningState){
            if(this.nextStateKey === this.currentState.stateKey){
                this.currentState.updateState();
            }else{
                this.transitionToState(this.nextStateKey);
            }
        }
    }

    transitionToState(stateKey){
        if(this.printTransitions){
            console.log(`Passing ${this.currentState.stateKey} to ${stateKey}`);
        }
       
        this.isTransitioningState = true;

        this.currentState.exitState();
        this.currentState = this.states.get(stateKey);

        this.addStateToHistory();
        this.currentState.enterState();
        
        this.isTransitioningState = false;
    }
    
    addStateToHistory(){
        // this.statesHistory.push({state: this.currentState.stateKey, time: this.contextObject.scene.time.now});
        this.statesHistory.push(this.currentState.stateKey);
        this.cleanStatesHistory();
    }

    getStateHistory(){
        return this.statesHistory;
    }

    cleanStatesHistory(){
        if(this.statesHistory.length > 5){
            this.statesHistory.shift();
        }
    }

    /**
     * 
     * @param {Object} other The object which has entered the trigger. 
     */
    onTriggerEnter(other){
        this.currentState.onTriggerEnter(other);
    }

    /**
     * 
     * @param {Object} other The object which is staying the trigger. 
     */
    onTriggerStay(other){
        this.currentState.onTriggerStay(other);
    }

    /**
     * 
     * @param {Object} other The object which has exited the trigger. 
     */
    onTriggerExit(other){
        this.currentState.onTriggerExit(other);
    }
}