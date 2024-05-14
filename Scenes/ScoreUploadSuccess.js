class ScoreUploadSuccess extends MenuBuilder{
    constructor(){
        super("scoreUploadSuccess");
    }

    create(){
        this.uploadData({menu: ["Your score has been uploaded ", "right to hell"], config: {yOffset: 100}}, {menu: ["Try again","Go to menu"], config: {yOffset: 500}});
    }

    handleOptionReturn(){
        return;
    }

    handleOptionSelected(position){
        let scenes = {};

        for(let scene of this.scene.manager.scenes){
            if(scene.scene.key === "Game2D" || scene.scene.key === "Game3D"){
                scenes[scene.scene.key] = scene;
            }
        }

        switch (position){
            case 0:
                scenes["Game2D"].music.stop();
                this.scene.stop("Game3D");
                this.scene.stop("Game2D");
        
                this.scene.launch("Game3D");
                this.scene.start("Game2D");
                this.scene.stop(); 
            break;

            case 1:
                this.scenes["Game2D"].music.stop();
                this.scene.stop("Game3D");
                this.scene.stop("Game2D");
                
                this.scene.start("mainMenu");
                this.scene.stop();
            break;
        }
    }
}
