/**
 * This class allows the creating of the walls of the game.
 */
class WallsBuilder{
    /**
     * The constructor of the walls builder class.
     * @constructor
     * @param {Scene} scene The current scene of the game to place the sprite.
     * @param {JSON} config The configuration object for the Player.
     */
    // constructor(scene, spriteImgStr, blockSize, amountWalls, generateWalls, generateRandomWalls){
    constructor(scene, config){
        this.scene = scene;
        this.config = config;

        let x = parseInt(canvasSize.width*this.config.generalSizeMultiplier/this.config.size);
        let y = parseInt(canvasSize.height*this.config.generalSizeMultiplier/this.config.size);
        this.wallNumberRatio = {x: x, y: y};
        this.createWalls();
    }

    createWalls(){
        if(this.config.generate){
            //Creating the group for the walls.
            this.walls = this.scene.physics.add.staticGroup();

            //Creating the matrix of booleans.
            this.setWallMatrix();

            let wallStart = {x: 0, y: 0};
            let blockExtension = {x: 0, y: 0};
            let wallPosition = {x: 0, y: 0};

            //These loops frame the map section of the canvas to not let the player getting out.
            for(let k = 0; k < this.wallNumberRatio.x; k++){
                this.wallMatrix[0][k] = 1;
                this.wallMatrix[this.wallNumberRatio.y - 1][k] = 1;
            }
            for(let j = 0; j < this.wallNumberRatio.y; j++){
                this.wallMatrix[j][0] = 1;
                this.wallMatrix[j][this.wallNumberRatio.x - 1] = 1;
            }

            for(let i = 0; i < this.config.amount; i++){
                //within this loop we generate the walls through random positioning
                //and scale of each wall.

                //In order to make things more simple we generate the walls acording to the grid we generated
                //and the scale of the walls. So instead of asking for the coordinates of the wall we ask for its
                //position in the grid.

                if(this.config.random){
                    //Due we need to make some tests we have this conditional, so we can create a more controlled map if needed.

                    //We stablish the starting grid point of the wall in x,y.
                    wallStart.x = getRndInteger(0, this.wallNumberRatio.x);
                    wallStart.y = getRndInteger(0, this.wallNumberRatio.y);

                    //And then the extension of the wall in x, y as well.
                    //This while loop will prevent the walls from being generated out of bounds.
                    do{
                        blockExtension.x = getRndInteger(1, 5);
                        blockExtension.y = getRndInteger(1, 5);
                        
                    }while(blockExtension.x + wallStart.x > this.wallNumberRatio.x ||
                        blockExtension.y + wallStart.y > this.wallNumberRatio.y);    
                    
                }else{
                    wallStart.x = 15;
                    wallStart.y = 19;
        
                    blockExtension.x = 3;
                    blockExtension.y = 3;
                }               
                
                //Then we use two for loops to change the value in the matrix by true;
                for(let j = wallStart.y; j < blockExtension.y + wallStart.y; j++){
                    for(let k = wallStart.x; k < blockExtension.x + wallStart.x; k++){
                        this.wallMatrix[j][k] = 1;
                    }
                }
            }

            //Now with the wall positions being true in the matrix the only thing that lefts to do is to
            //traverse the matrix looking for the true values, if found, a wall object will be generated.
            for(let i = 0; i < this.wallNumberRatio.y; i++){
                for(let j = 0; j < this.wallNumberRatio.x; j++){
                    if(this.wallMatrix[i][j] === 1){
                        wallPosition.x = this.config.size*(j + 0.5);
                        wallPosition.y = this.config.size*(i + 0.5);
                        this.walls.create(wallPosition.x, wallPosition.y, this.config.name);
                    }
                }
            }

            this.walls.name = "walls";
        }
    }

    setColliders(){
        for(let element of arguments){
            this.scene.physics.add.collider(element, this.walls);
        }
    }

    /**
     * This method creates the base matrix fulled of booleans to create the wall.
     */
    setWallMatrix(){    
        this.wallMatrix = [];
    
        let row = Array(this.wallNumberRatio.x);
    
        for(let j = 0; j < this.wallNumberRatio.x; j++){
            row[j] = 0;
        }
    
        for(let i = 0; i < this.wallNumberRatio.y; i++){
            this.wallMatrix.push(row.concat());
        }
    }

    /**
     * This method returns the wall matrix.
     * @return {Array<Array<Boolean>>}
     */
    getWallMatrix(){
        return this.wallMatrix;
    }

    /**
     * Gets the wall number ratio.
     * @return {Number}
     */
    getWallNumberRatio(){
        return this.wallNumberRatio;
    }

    /**
     * Gets the wall block size.
     * @return {Number}
     */
    getWallBlockSize(){
        return this.config.size;
    }

    getWallAtWorldXY(x, y, objectSize) {
        const cellSize = this.config.size;
        const cellsToCheck = objectSize / cellSize;
    
        const startX = Math.floor(x / cellSize);
        const startY = Math.floor(y / cellSize);
    
        for (let i = 0; i < cellsToCheck; i++) {
            for (let j = 0; j < cellsToCheck; j++) {
                const checkX = startX + i;
                const checkY = startY + j;
    
                if (checkX >= 0 && checkX < this.wallMatrix[0].length && checkY >= 0 && checkY < this.wallMatrix.length) {
                    if (this.wallMatrix[checkY][checkX] != 0) {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        }
        return false;
    }
}