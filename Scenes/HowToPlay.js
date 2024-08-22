class HowToPlay extends MenuBuilder{
    constructor(){
        super("howToPlay", false, true);
    }

    create(){
        this.uploadData(
            {
                menu: 
                    [
                        "Movement:", "W,A,S,D or ArrowKeys",
                        "Shoot:", "SPACE",
                        "Change Weapon:", "SHIFT",
                        "Kill all demons to win."
                    ],
                config: {yOffset: 250, lineSpace: 50}
            },
            {menu: ["Go Back"], config: {yOffset: canvasSize.height*0.9}});
        }

    handleOptionReturn(){
        this.scene.start("mainMenu");
        this.scene.stop();
    }

    handleOptionSelected(position){
        this.handleOptionReturn();
    }
}