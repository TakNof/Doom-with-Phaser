class SelectLeaderBoard extends MenuBuilder{
    constructor(){
        super("selectLeaderBoard", false, true);
    }

    create(){
        this.uploadData({menu: ["Select the leaderboard", "you wanna see:"], config: {yOffset: 100, lineSpace: 50}}, {menu: ["I'm too young to die", "Hurt me Plenty", "Ultra-Violence", "Nightmare", "Go back"], config: {yOffset: 250}});
    }

    handleOptionReturn(){
        this.scene.start("mainMenu");
        this.scene.stop();
    }

    handleOptionSelected(position){
        if(position == 4){
            this.handleOptionReturn();
        }else{
            this.scene.start("showLeaderBoard", position);
            // console.log("option selected");
        }
    }
}

class ShowLeaderBoard extends MenuBuilder{
    constructor(){
        super("showLeaderBoard", false, true);

        this.difficultiesList = ["Im_too_young_to_die", "Hurt_me_Plenty", "Ultra-Violence", "Nightmare"];
    }

    create(position){
        
        let optionsList = [`${this.difficultiesList[position]} LeaderBoard: `];

        this.uploadData({menu:["Loading info from the database..."], config: {yOffset: canvasSize.height/2}});

        fetch(`https://databaseapi-rxi4.onrender.com/scores/${this.difficultiesList[position]}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            for(let [i, value] of data.entries()){
                optionsList.push(`${i + 1}. ${value.name}: ${value.score}`);
            }
            this.uploadData({menu: optionsList, config: {yOffset: 100, lineSpace: 50}}, {menu: ["Go back"], config: {yOffset: canvasSize.height*0.9}});
        })
        .catch((error) => {
            console.error('Error:', error);
        });   
    }

    handleOptionReturn(){
        this.scene.launch("selectLeaderBoard");
        this.scene.stop();
    }

    handleOptionSelected(position){
        this.handleOptionReturn();
    }
}
