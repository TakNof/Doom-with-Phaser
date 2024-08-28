class PathFinder{
    constructor(scene, objectOwner, walls){
        this.scene = scene;
        this.objectOwner = objectOwner;
        this.walls = walls;
        this.targetPosition = this.objectOwner.target.getPosition();

        this.lastPointReachedTime = 0;
        this.timeToReachPoint = 2000;
        this.path;
        this.pathId;
        this.targetLastSeenPosition;
        this.targetHighPositionVariation = false;
        this.unableToReachTarget = false;
        this.visualizePathMarkers = true;
        this.markers = [];
        this.timeToCompletePath = 7000;

        this.setEasyStar();
        this.setPathCallInterval();
        // this.setUnreachablePathTimer();
    }

    setEasyStar(){
        this.easyStar = new EasyStar.js();

        this.easyStar.setGrid(this.scene.walls.getWallMatrix());

        this.easyStar.setAcceptableTiles([0]);

        this.easyStar.enableDiagonals();
        this.easyStar.enableCornerCutting();

        this.easyStar.setTileCost(1, 10000);
        this.easyStar.setTileCost(0, 0);
    }

    getEasyStar(){
        return this.easyStar;
    }

    setPath(){
        if(this.targetHighPositionVariation){
            this.clearPath();
        }

        // console.log("Setting path");
        const {size} = this.walls.config;
        let data = [
            Math.floor(this.objectOwner.getPositionX()/size), 
            Math.floor(this.objectOwner.getPositionY()/size),
            Math.floor(this.targetPosition.x/size),
            Math.floor(this.targetPosition.y/size)
        ];
        try {
            this.pathId = this.easyStar.findPath(...data, (path) =>{
                if (path === null) {
                    console.warn("Path was not found.");
                } else {
                    // console.warn("Path was found");
                    this.path = path;
                    if(this.visualizePathMarkers){
                        this.setPathMarkers();
                    }
    
                    // if(this.pathTimer.paused){
                    //     this.pathTimer.paused = false;
                    // }
                }
            });
            this.easyStar.calculate();
        } catch (error) {}
    }

    clearPath(){
        if(this.pathId){
            // console.log("Clearing path")
            this.easyStar.cancelPath(this.pathId);
            this.pathId = undefined;
        }

        // this.removeUnreachablePathTimer();
    }

    setPathMarkers(){
        this.cleanPathMarkers();
        const {size} = this.walls.config;
        for(let step of this.path){
            this.markers.push(this.scene.add.rectangle((step.x + 0.5)*size, (step.y + 0.5)*size, 10, 10, 0x7434eb));
        }
    }

    cleanPathMarkers(){
        for(let i = 0; i < this.markers.length; i++){
            this.markers[i].destroy();
        }
        this.markers = [];
    }

    refreshTarget(){
        if(this.targetLastSeenPosition){
            this.targetPosition = this.targetLastSeenPosition;
        }else{
            this.targetPosition = this.scene.player.getPosition();
        }

        // console.log(this.targetHighPositionVariation);
    }

    setPathCallInterval(){
        this.resetPathCallInterval();

        this.pathInterval = this.scene.time.addEvent({
            delay: 1000,
            callback: ()=>{
                let time = this.scene.time.now;
                if(time > this.lastPointReachedTime + this.timeToReachPoint){
                    this.setPath();
                }
            },
            callbackScope: this,
            loop: true
        });
        this.pathInterval.paused = true;
        this.unableToReachTarget = false;
    }

    getPathCallInterval(){
        return this.pathInterval;
    }

    resetPathCallInterval(){
        if(this.pathInterval){
            this.pathInterval.reset();
        }
    }

    setUnreachablePathTimer(){
        this.pathTimer = this.scene.time.delayedCall(this.timeToCompletePath, () => {
            this.unableToReachTarget = true;
            // console.log("Unreachable path");
        }, [], this);

        this.pathTimer.paused = true;
    }

    getUnreachablePathTimer(){
        return this.pathTimer;
    }

    resetUnreachablePathTimer(){
        console.log("reseting timer for unableToReachTarget...");
        this.pathTimer.reset({delay: this.timeToCompletePath, callback: () => {
            this.unableToReachTarget = true;
            // console.log("Unreachable path");
        }, callbackScope: this});
    }

    removeUnreachablePathTimer(){
        if(this.pathTimer){
            this.pathTimer.paused = true;
            this.resetUnreachablePathTimer();
            this.unableToReachTarget = false;
        }
    }

    reset(){
        this.unableToReachTarget = false;
        this.lastPointReachedTime = 0;
        this.getPathCallInterval().paused = true;
        // this.setUnreachablePathTimer();
        this.clearPath();
        this.cleanPathMarkers();
    }
}