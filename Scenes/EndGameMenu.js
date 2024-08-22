class EndGameMenu extends MenuBuilder{
    constructor(){
        super("endGameMenu");
    }

    handleOptionReturn(){
        return;
    }

    handleOptionSelected(){
        this.scene.start("endGameChoiseMenu");
        this.scene.stop();
    }

    create(data){
        let {score, endGameState} = data;

        let scoreText = [endGameState === "Victory" ? "YOU WON" : "YOU DIED"];

        let iterations = 0;
        for(let typeScore in score){
            if(typeScore === "totalScore"){

                scoreText.push(`YOUR SCORE: ${score[typeScore]}`);

            }else{
                scoreText.push(`${score[typeScore]}`);
            }
            iterations ++;
        }
        this.uploadData({menu: scoreText, config: {yOffset: 100, fontSize: 24}}, {menu: ["Next"], config: {yOffset: canvasSize.height*0.9}});
    }
}

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
                this.scenes["Game2D"].music.stop();
                this.scene.stop("Game3D");
                this.scene.stop("Game2D");
                
                this.scene.start("mainMenu");
                this.scene.stop();
            break;
        }
    }

    create(data){
        this.uploadData({menu: ["Choose your destiny:"], config: {yOffset: 150}}, {menu: ["Retry", "Back to menu, i'm hungry"], config: {yOffset: 300}});
    }
}