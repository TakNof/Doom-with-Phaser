class ZombieIdleState extends EnemyState{
    /**
     * 
     * @param {Enemy} enemy The object which will provide the context for the enemy states.
     * @param {Object} stateKey
     */
    constructor(enemy, stateKey){
        super(enemy, stateKey);
    }

    enterState(){
        this.enemy.getSpriteSounds( this.stateKey).playSound();
        this.timeout = this.enemy.getScene().time.delayedCall(Phaser.Math.Between(2, 3)*1000, () =>{
            this.enemy.getStateMachine().transitionToState("Patrol");
        });
    }

    updateState(){
        this.enemy.setVelocityX(0);
        
        if(this.enemy.targetInSight && this.enemy.getScene().player.isAlive){
            this.timeout.destroy();
            this.enemy.getStateMachine().transitionToState("Chase");

        }
    }

    exitState(){
        this.timeout = undefined;
    }

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

class ZombiePatrolState extends EnemyState{
    /**
     * 
     * @param {Enemy} enemy The object which will provide the context for the enemy states.
     * @param {Object} stateKey
     */
    constructor(enemy, stateKey){
        super(enemy, stateKey);
    }

    enterState(){
        const {defaultVelocity} = this.enemy.config;

        this.enemy.flipX = !this.enemy.flipX;
        let sign = this.enemy.flipX ? -1: 1;
        this.enemy.setVelocityX(sign*defaultVelocity);

        this.interval = this.enemy.getScene().time.addEvent({
            delay: Phaser.Math.Between(1, 3)*1000,
            callback: ()=>{
                this.enemy.flipX = !this.enemy.flipX;
                let sign = this.enemy.flipX ? -1: 1;
                this.enemy.setVelocityX(sign*defaultVelocity);
            },
            callbackScope: this,
            loop: true
        });

        this.timeout = this.enemy.getScene().time.delayedCall(Phaser.Math.Between(4, 6)*1000, ()=>{
            if(this.interval){
                this.interval.remove();
                this.interval = undefined;
            }

            this.timeout.destroy();
            this.timeout = undefined;
            this.enemy.getStateMachine().transitionToState("Idle"); 
        })
    }

    updateState(){
        const {player} = this.enemy.scene
        this.enemy.play(this.enemy.getSpriteAnimations("Walk"), true);
        if(this.enemy.targetInSight && player.isAlive){
            this.interval.remove();
            this.timeout.destroy();

            this.interval = undefined;
            this.timeout = undefined;
            this.enemy.getStateMachine().transitionToState("Chase");

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

class ZombieChaseState extends EnemyState{
    /**
     * 
     * @param {Enemy} enemy The object which will provide the context for the enemy states.
     * @param {Object} stateKey
     */
    constructor(enemy, stateKey){
        super(enemy, stateKey);
    }

    enterState(){
        this.enemy.displayIndicativeTextTween("!!!", 3000);
    }

    updateState(){
        const {player} = this.enemy.getScene();

        this.enemy.play(this.enemy.getSpriteAnimations("Walk"), true);

        if(this.enemy.getDistanceToTarget() <= this.enemy.config.attackDistance && player.isAlive){
            this.enemy.getStateMachine().transitionToState("Attack");
        }else if(!this.enemy.targetInSight && player.isAlive){
            this.enemy.getPathFinder().targetLastSeenPosition = player.getPosition();
            this.enemy.getStateMachine().transitionToState("Search");
        }else{
            this.enemy.moveToTarget();
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

class ZombieSearchState extends EnemyState{
    /**
     * 
     * @param {Enemy} enemy The object which will provide the context for the enemy states.
     * @param {Object} stateKey
     */
    constructor(enemy, stateKey){
        super(enemy, stateKey);
    }

    enterState(){
        this.searchTimer = this.enemy.scene.time.delayedCall(10000, () => {
            // console.log("Unable to reach player");
            this.enemy.getPathFinder().unableToReachTarget = true;
        }, [], this);

        this.enemy.getPathFinder().refreshTarget();
        if(this.enemy.body.onFloor()){
            this.enemy.getPathFinder().setPath();
        }
        this.enemy.getPathFinder().getPathCallInterval().paused = false;
        
        this.reachedPlayerLastSeenPosition = false;
    }

    updateState(){
        if(this.enemy.targetInSight){
            if(this.interval){
                this.interval.remove();
                this.timeout.destroy();

                this.interval = undefined;
                this.timeout = undefined;
            }
            this.enemy.getPathFinder().targetLastSeenPosition = undefined;
            this.enemy.getStateMachine().transitionToState("Chase");
        }
        
        this.enemy.getPathFinder().refreshTarget();
        if((Phaser.Math.Distance.BetweenPoints(this.enemy.getPosition(), this.enemy.getPathFinder().targetPosition) <= 10 && !this.enemy.targetInSight) || this.enemy.getPathFinder().unableToReachTarget){
            this.reachedPlayerLastSeenPosition = true;
            this.enemy.getPathFinder().reset();
                    
            this.enemy.setVelocityX(0);
            
            if(!this.interval || this.interval.paused){
                let searchStateTime = Phaser.Math.Between(4, 6)*1000;

                this.enemy.displayIndicativeTextTween("???", searchStateTime);

                this.interval = this.enemy.getScene().time.addEvent({
                    delay: Phaser.Math.Between(1, 3)*1000,
                    callback: ()=>{
                        this.enemy.flipX = !this.enemy.flipX;
                    },
                    callbackScope: this,
                    loop: true
                });

                this.timeout = this.enemy.getScene().time.delayedCall(searchStateTime, () =>{
                    this.interval.remove();
                    this.timeout.destroy();

                    this.interval = undefined;
                    this.timeout = undefined;

                    this.enemy.getStateMachine().transitionToState("Patrol");
                    this.enemy.lastAttackTimer = this.enemy.scene.time.now + this.enemy.config.attackDelay;
                })
            }

        }else if(!this.reachedPlayerLastSeenPosition && this.enemy.getPathFinder().path){
            this.enemy.play(this.enemy.getSpriteAnimations("Walk"), true);
            this.enemy.moveToPoint();
        }
    }

    exitState(){
        this.enemy.getPathFinder().reset();

        this.searchTimer.destroy();
        this.searchTimer = undefined;
    }

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

class ZombieAttackState extends EnemyState{
    /**
     * 
     * @param {Enemy} enemy The object which will provide the context for the enemy states.
     * @param {Object} stateKey
     */
    constructor(enemy, stateKey){
        super(enemy, stateKey);
    }

    enterState(){
        this.enemy.getPathFinder().reset();
    }

    updateState(){
        const {enemy} = this;
        enemy.setVelocity(0);
                
        if(enemy.target.isAlive){
            if(enemy.getDistanceToTarget() > enemy.config.attackDistance){
                enemy.getStateMachine().transitionToState("Chase"); 
            }else{
                enemy.aimToCoordinates(enemy.target.getPosition());
                enemy.shoot();
            }
        }else{
            enemy.getStateMachine().transitionToState("Patrol");
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

class ZombieDamagedState extends EnemyState{
    /**
     * 
     * @param {Enemy} enemy The object which will provide the context for the enemy states.
     * @param {Object} stateKey
     */
    constructor(enemy, stateKey){
        super(enemy, stateKey);
    }

    enterState(){
        const {enemy} = this;
        const {enemy3D} = enemy;
        enemy3D.play(enemy.getSpriteAnimations(this.stateKey));

        enemy.getSpriteSounds(this.stateKey).sound.setDetune(Phaser.Math.Between(-1,1)*100);
        enemy.getSpriteSounds(this.stateKey).playSound();

        enemy.addDamagedTimeToHistory();
        enemy.checkStunning();
        if(enemy.isAlive){
            if(enemy.isStunned){
                enemy.getStateMachine().transitionToState("Stunned");
            }else{
                enemy.getStateMachine().transitionToState("Attack");
            }
        }else{
            enemy.getStateMachine().transitionToState("Dead");
        }
    }

    updateState(){}

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

class ZombieStunnedState extends EnemyState{
    /**
     * 
     * @param {Enemy} enemy The object which will provide the context for the enemy states.
     * @param {Object} stateKey
     */
    constructor(enemy, stateKey){
        super(enemy, stateKey);
    }

    enterState(){}

    updateState(){
        this.enemy.setVelocity(0);
        if(!this.enemy.isStunned){
            this.enemy.getStateMachine().transitionToState("Chase");
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

class ZombieDeadState extends EnemyState{
    /**
     * 
     * @param {Enemy} enemy The object which will provide the context for the enemy states.
     * @param {Object} stateKey
     */
    constructor(enemy, stateKey){
        super(enemy, stateKey);
    }

    enterState(){
        const {enemy} = this;
        const {enemy3D} = enemy;
        
        // enemy.play(enemy.getSpriteAnimations(this.stateKey));
        enemy.getSpriteSounds(this.stateKey).sound.setDetune(Phaser.Math.Between(-1,1)*100);
        enemy.getSpriteSounds(this.stateKey).playSound();

        //itemDropLogic
        let spawnItem = Phaser.Math.Between(1, 3) == 1;
        
        if(spawnItem){
            let itemToSpawn = Phaser.Math.Between(1,3);
                
            switch (itemToSpawn) {
                case 1:
                    itemToSpawn = "PistolAmmo";
                break;
                
                case 2:
                    itemToSpawn = "ShotgunAmmo";
                break;

                case 3:
                    itemToSpawn = "MedPack";
                break;
            }

            let item = enemy.scene.items[itemToSpawn].getFirstDead();
            if(item){
                item.setActive(true);
                item.setVisible(true);
                item.body.onCollide = true;
                
                item.x = enemy.x;
                item.y = enemy.y;
            }
        }

        enemy.disableBody(true);
        setTimeout(() => {
            enemy3D.getScene().tweens.add({
                targets: enemy3D,
                alpha: 0,
                duration: 1000,
                ease: "Cubic",
                onComplete: () => {
                    enemy.disable();
                    enemy.getPathFinder().cleanPathMarkers();
                    enemy.getPathFinder().clearPath();
                },
            });
        }, 200);
    }

    updateState(){
        this.enemy.setVelocity(0);
    }

    exitState(){
        this.enemy.getPathFinder().reset();
    }

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