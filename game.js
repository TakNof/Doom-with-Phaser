var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    backgroundColor: '#0072bc',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var cursors;
var player;

var walls;

var canvasSize = "1024x768";

var canvasSizeX = canvasSize.split("x")[0];
var canvasSizeY = canvasSize.split("x")[1];

var playerPositionX = canvasSizeX/2;
var playerPositionY = canvasSizeY/2;


var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('wall', 'assets/wall.jpg');
}

function create()
{

    //Here we are creating the main character.
    player = this.add.rectangle(playerPositionX, playerPositionY, 64, 64, 0xffffff);

    this.physics.add.existing(player, false);

    cursors = this.input.keyboard.createCursorKeys();

    player.body.setCollideWorldBounds(true);

    console.log("player created");

    //Here we create the map walls.
    
    walls = this.physics.add.staticGroup();
    var wallBlockSize = "32x32";

    var wallBlockSizeX = parseInt(wallBlockSize.split("x")[0]);
    var wallBlockSizeY = parseInt(wallBlockSize.split("x")[1]);

    var wallNumberRatioX = parseInt(canvasSizeX/wallBlockSizeX);
    var wallNumberRatioY = parseInt(canvasSizeY/wallBlockSizeY);

    console.log(wallNumberRatioX);
    console.log(wallNumberRatioY);

    var wallOrder = [];

    var row = Array(wallBlockSizeX);

    for(let j = 0; j < wallNumberRatioX; j++){
        row[j] = false;
    }

    for(let i = 0; i < wallNumberRatioY; i++){
        wallOrder.push(row);
    }
    
    for(let i = 0; i < wallNumberRatioY; i++){
        console.log(wallOrder[i]);
    }

    for(let i = 0; i < 2; i++){
        wallPositionX = 16;
        wallPositionY = (i*32) + 16;

        // if(wallOrder){

        // }
        walls.create(wallPositionX , wallPositionY, this.add.rectangle(wallPositionX , wallPositionY, 32, 32, 0xffffff).setDepth(1));
    }

    // this.physics.add.collider(player, walls);

}

// function drawMap(){
//     var walls = this.physics.add.staticGroup();
//     var wallBlockSize = "10x10";

//     wallBlockSizeX = wallBlockSize.split("x")[0];
//     wallBlockSizeY = wallBlockSize.split("x")[1]

//     var wallOrder = Array(parseInt((canvasSizeX/10) + (canvasSizeY/10)));

//     console.log(wallOrder.length);

//     for(let i = 0; i <= 10; i++){
//         walls.create(wallBlockSizeX, wallBlockSize.split("x")[1], this.add.rectangle(playerPositionX, playerPositionY, 64, 64, 0xffffff));
//     }
// }

function update ()
{
    player.body.setVelocity(0);

    if (cursors.left.isDown)
    {
        player.body.setVelocityX(-300);
    }
    else if (cursors.right.isDown)
    {
        player.body.setVelocityX(300);
    }

    if (cursors.up.isDown)
    {
        player.body.setVelocityY(-300);
    }
    else if (cursors.down.isDown)
    {
        player.body.setVelocityY(300);
    }
}
