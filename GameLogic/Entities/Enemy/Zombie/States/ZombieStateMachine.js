class ZombieStateMachine extends StateMachine{
    /**
     * @param {Object} contextObject The object which will provide the context for the enemy states.
     * @param {{Object: String}} states An object containing the states of the State Machine Enemy.
     */
    constructor(contextObject, states){
        super(states);
        this.contextObject = contextObject;
        this.initializeStates();
        this.create();
    }

    initializeStates(){
        for(let state of this.states){
            try {
                let classConstructor = this.contextObject.__checkClassConstructor(`Zombie${state[0]}State`);
                this.states.set(state[0], new classConstructor(this.contextObject, state[0]));
            } catch (error) {
                console.warn(`Couldn't load the state "${state[0]}": ${error}`);
            }
        }

        this.currentState = this.states.get("Idle");
    }
}