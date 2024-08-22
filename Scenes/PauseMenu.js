class PauseMenu extends MenuBuilder{
    constructor(){
        super("pauseMenu", true);
    }

    create(){        
        this.uploadData(undefined, {menu: ["Restart", "Resume", "Options", "Back to menu"], config: {yOffset: 350}});
    }
    
    
    handleOptionReturn(){
        this.scenes["Game3D"].scene.resume();
        this.scenes["Game2D"].scene.resume();
        this.scene.stop();
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
                handleOptionReturn();
            break;

            case 2:
                
            break;

            case 3:
                this.scenes["Game2D"].music.stop();
                this.scene.stop("Game3D");
                this.scene.stop("Game2D");
                
                this.scene.start("mainMenu");
                this.scene.stop();
            break;
        }
    }
}