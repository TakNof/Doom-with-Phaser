class EndGameChoiseMenu extends MenuBuilder{
    constructor(){
        super("endGameChoiseMenu");
    }

    handleOptionReturn(){
        return;
    }

    handleOptionSelected(position){
        switch (position) {
            case 0:
                this.scenes["Game2D"].music.stop();
                this.scene.stop("Game3D");
                this.scene.stop("Game2D");
        
                this.scene.launch("Game3D");
                this.scene.start("Game2D");
                this.scene.stop();
            break;

            case 1:
                this.scene.start("scoreUpload");
                this.scene.stop();
            break;

            case 2:
                this.scenes["Game2D"].music.stop();
                this.scene.stop("Game3D");
                this.scene.stop("Game2D");
                
                this.scene.start("mainMenu");
                this.scene.stop();
            break;
        }
    }

    create(data){
        this.uploadData({menu: ["Choose your destiny:"], config: {yOffset: 150}}, {menu: ["Retry", "Save my score", "Back to menu, i'm hungry"], config: {yOffset: 300}});
    }
}