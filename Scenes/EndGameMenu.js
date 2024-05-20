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