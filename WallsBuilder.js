/**
 * This class allows the creating of the walls of the game.
 */
class WallsBuilder{
    /**
     * The constructor of the walls builder class.
     * @constructor
     * @param {Scene} scene The current scene of the game to place the sprite.
     * @param {string} spriteImgStr An str of the image name given in the preload method of the main class.
     * @param {number} blockSize The size of the sprite in pixels.
     * @param {boolean} generateWalls Whether to generate walls or not.
     * @param {boolean} generateRandomWalls Whether to generate random walls or not.
     */
    constructor(scene, spriteImgStr, blockSize, amountWalls, generateWalls, generateRandomWalls){
        this.scene = scene;

        this.spriteImgStr = spriteImgStr;

        this.blockSize = blockSize; 

        this.amountWalls = amountWalls;

        this.generateWalls = generateWalls;
        this.generateRandomWalls = generateRandomWalls;

        this.wallNumberRatio = {x: parseInt(canvasSize.width/this.blockSize), y: parseInt(canvasSize.height/this.blockSize)};
    }

    createWalls(){
        if(this.generateWalls){
            //Creating the group for the walls.
            this.walls = this.scene.physics.add.staticGroup();

            //Creating the matrix of booleans.
            this.setWallMatrix();

            let wallStart = {x: 0, y: 0};
            let blockExtension = {x: 0, y: 0};
            let wallPosition = {x: 0, y: 0};

            for(let i = 0; i < this.amountWalls; i++){
                //within this loop we generate the walls through random positioning
                //and scale of each wall.

                //In order to make things more simple we generate the walls acording to the grid we generated
                //and the scale of the walls. So instead of asking for the coordinates of the wall we ask for its
                //position in the grid.

                if(this.generateRandomWalls){
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
                    wallStart.y = getRndInteger(0, 8);
        
                    blockExtension.x = 3;
                    blockExtension.y = 3;
                }               
                
                //Then we use two for loops to change the value in the matrix by true;
                for(let j = wallStart.y; j < blockExtension.y + wallStart.y; j++){
                    for(let k = wallStart.x; k < blockExtension.x + wallStart.x; k++){
                        this.wallMatrix[j][k] = true;
                    }
                }

                //These loops frame the map section of the canvas to not let the player getting out.
                for(let k = 0; k < this.wallNumberRatio.x; k++){
                    this.wallMatrix[0][k] = true;
                    this.wallMatrix[this.wallNumberRatio.y - 1][k] = true;
                }
                for(let j = 0; j < this.wallNumberRatio.y; j++){
                    this.wallMatrix[j][0] = true;
                    this.wallMatrix[j][this.wallNumberRatio.x - 1] = true;
                }

                //Now with the wall positions being true in the matrix the only thing that lefts to do is to
                //traverse the matrix looking for the true values, if found, a wall object will be generated.
                for(let i = 0; i < this.wallNumberRatio.y; i++){
                    for(let j = 0; j < this.wallNumberRatio.x; j++){
                        if(this.wallMatrix[i][j] === true){
                            wallPosition.x = (j*32) + 16;
                            wallPosition.y = (i*32) + 16;
                            this.walls.create(wallPosition.x, wallPosition.y, new Sprite(this.scene, wallPosition, this.spriteImgStr, this.blockSize, 1));
                            // walls.create(wallPosition.x , wallPosition.y, this.add.sprite(wallPosition.x , wallPosition.y, "wall").setDepth(1));
                        }
                    }
                }
            }
        }
    }
    /**
     * Sets the colliders of the objects given
     * @param {?} Objects
     */
    setColliders(){
        for(let element of arguments){
            if(typeof(element) == Array){
                for(let subelement of element){
                    this.scene.physics.add.collider(subelement, this.walls);
                }
            }else{
                this.scene.physics.add.collider(element, this.walls);
            }
        }
    }

    /**
     * Checks if the walls have been impacted by a projectile or not.
     * @param {Projectile} projectiles
     */
    evalCollision(projectiles2D, projectiles3D = undefined){
        this.scene.physics.collide(this.walls, projectiles2D,
            function(sprite, projectile){
                if(projectiles3D){
                    let index = projectiles2D.getChildren().indexOf(projectile);
                    let projectile3D = projectiles3D.getChildren()[index];
                    projectile3D.destroy();
                }
                projectile.destroy();
            }
        );
    }


    /**
     * This method creates the base matrix fulled of booleans to create the wall.
     */
    setWallMatrix(){    
        this.wallMatrix = [];
    
        let row = Array(this.wallNumberRatio.x);
    
        for(let j = 0; j < this.wallNumberRatio.x; j++){
            row[j] = false;
        }
    
        for(let i = 0; i < this.wallNumberRatio.y; i++){
            this.wallMatrix.push(row.concat());
        }
    }

    /**
     * This method returns the wall matrix.
     * @return {Array<Array<Boolean>>}
     */
    get getWallMatrix(){
        return this.wallMatrix;
    }

    /**
     * Gets the wall number ratio.
     * @return {Object}
     */
    get getWallNumberRatio(){
        return this.wallNumberRatio;
    }
}