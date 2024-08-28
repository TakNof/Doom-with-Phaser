class BaseState {
    /**
     * @param {String} stateKey
     */
    constructor(stateKey) {
        this.stateKey = stateKey;
      if (new.target === BaseState) {
        throw new Error("Can not instanciate an abstract class.");
      }
    }
    
    enterState(){
        throw new Error("The method should be implemented in the subclass.");
    }

    exitState(){
        throw new Error("The method should be implemented in the subclass.");
    }

    updateState(){
        throw new Error("The method should be implemented in the subclass.");
    }

    getNextState(){
        throw new Error("The method should be implemented in the subclass.");
    }

    /**
     * 
     * @param {Object} other The object which has entered the trigger. 
     */
    onTriggerEnter(other){
        throw new Error("The method should be implemented in the subclass.");
    }

    /**
     * 
     * @param {Object} other The object which is staying the trigger. 
     */
    onTriggerStay(other){
        throw new Error("The method should be implemented in the subclass.");
    }

    /**
     * 
     * @param {Object} other The object which has exited the trigger. 
     */
    onTriggerExit(other){
        throw new Error("The method should be implemented in the subclass.");
    }
}
  
