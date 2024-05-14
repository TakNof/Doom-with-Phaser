class MainMenu extends MenuBuilder{
    constructor(){
        super("mainMenu", true, true);
    }

    create(){
        this.uploadData(undefined, {menu: ["Start", "How to play", "Options", "Credits"], config: {yOffset: 350}});
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
        }
    }
}
