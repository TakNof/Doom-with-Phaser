class MainMenu extends MenuBuilder{
    constructor(){
        super("mainMenu", true, true);
    }

    create(){
        this.uploadData(undefined, {menu: ["Start", "How to play", "Options", "Credits"], config: {yOffset: 300}});
    }

    handleOptionReturn(){
        return;
    }

    handleOptionSelected(position){
        switch (position){
            case 0:
                this.scene.start("selectDifficulty");
                this.scene.stop();
            break;

            case 1:
                this.scene.start("howToPlay");
                this.scene.stop();
            break;

            case 2:
                this.scene.start("selectLeaderBoard");
            break;
            
        }
    }
}
