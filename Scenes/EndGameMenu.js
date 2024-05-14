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
        let score = data;
        let scoreText = [];

        let iterations = 0;
        for(let typeScore in score){
            if(typeScore === "totalScore"){

                scoreText.push(`YOUR SCORE: ${score[typeScore]}`);

            }else{
                scoreText.push(`${score[typeScore]}`);
            }
            iterations ++;
        }
        this.uploadData({menu: scoreText, config: {yOffset: 150}}, {menu: ["Next"], config: {yOffset: canvasSize.height*0.9}});
    }
}