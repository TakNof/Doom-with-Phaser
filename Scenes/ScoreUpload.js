class ScoreUpload extends MenuBuilder{
    constructor(){
        super("scoreUpload");
    }

    create(){
        this.uploadData({menu: ["Enter your name: "], config: {yOffset: 100}}, {menu: ["Accept"], config: {yOffset: 500}});
        this.playerNameInput = this.add.dynamicBitmapText(canvasSize.width/2, 250, "doomSFont", "").setOrigin(0.5).setFontSize(32);
        
        const maxNameLength = 10;

        this.scenes = {};

        for(let scene of this.scene.manager.scenes){
            if(scene.scene.key === "Game2D" || scene.scene.key === "Game3D"){
                this.scenes[scene.scene.key] = scene;
            }
        }

        this.input.keyboard.on('keydown', event =>
        {
            if (event.keyCode === 8 && this.playerNameInput.text.length > 0){
                this.playerNameInput.text = this.playerNameInput.text.substr(0, this.playerNameInput.text.length - 1);
            }else if ((event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode <= 90)) && this.playerNameInput.text.length < maxNameLength){
                this.playerNameInput.text += event.key;
            }
            this.buttonsObject.getSelectorMovingSound().playSound();
        });

        this.pressedUploadScore = false;
    }

    handleOptionReturn(){
        return;
    }

    handleOptionSelected(){
        if(this.controls.enter.isUp && this.playerNameInput.text.length != 0 || !this.pressedUploadScore){
            this.pressedUploadScore = true;
            this.uploadData({menu: ["Uploading score", "to the server..."], config: {yOffset: canvasSize.height/2}});
            this.playerNameInput.setVisible(false);
            fetch('https://databaseapi-rxi4.onrender.com/score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name: this.playerNameInput.text, score: this.scenes["Game2D"].player.getScore().totalScore}),
            })
            .then(response => {
                response.json();
            })
            .then(data => {
                this.scene.start("scoreUploadSuccess");
                this.scene.stop();    
            });   
        }      
    }
}
