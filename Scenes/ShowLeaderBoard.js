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
            //In this case the convertion to String is done only because when
            //the value is passed as 0 with number type, javascript decides that
            //0 == undefined for no reason, messing with the menu selection. 
            this.scene.start("showLeaderBoard", String(position));
        }
    }
}

class ShowLeaderBoard extends MenuBuilder{
    constructor(){
        super("showLeaderBoard", false, true);

        this.difficultiesList = ["Im_too_young_to_die", "Hurt_me_Plenty", "Ultra-Violence", "Nightmare"];
    }

    create(position){
        position = parseInt(position);
        let difficultyName = this.difficultiesList[position].replace(/_/g, ' ').replace(/Im/g, "I'm");;
        let optionsList = [difficultyName, "LeaderBoard:"];

        this.uploadData({menu:["Loading info from the database..."], config: {yOffset: canvasSize.height/2}});

        console.log(this.difficultiesList[position]);
        fetch(`https://databaseapi-rxi4.onrender.com/scores/${this.difficultiesList[position]}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if(data.length > 0){
                for(let [i, value] of data.entries()){
                    optionsList.push(`${i + 1}. ${value.name}: ${value.score}`);
                }
            }else{
                optionsList.push(...["No worthy scores", "have been found."]);
            }
            
            this.uploadData({menu: optionsList, config: {yOffset: 100, lineSpace: 50}}, {menu: ["Go back"], config: {yOffset: canvasSize.height*0.9}});
        })
        .catch((error) => {
            console.error('Error:', error);
        });   
    }

    handleOptionReturn(){
        this.scene.start("selectLeaderBoard");
        this.scene.stop();
    }

    handleOptionSelected(position){
        this.handleOptionReturn();
    }
}
