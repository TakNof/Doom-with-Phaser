class SelectDifficulty extends MenuBuilder{
    constructor(){
        super("selectDifficulty", true, true);
    }

    create(){
        this.uploadData({menu: ["Choose how you wanna die:"], config: {yOffset: 280}}, {menu: ["I'm too young to die", "Hurt me Plenty", "Ultra-Violence", "Nightmare"], config: {yOffset: 350}});
    }

    handleOptionReturn(){
        this.scene.launch("mainMenu");
        this.scene.stop();
    }

    handleOptionSelected(position){
        options.difficulty.setting = position;

        this.setOptions();
        this.scene.launch("Game3D");
        this.scene.start("Game2D");
        this.scene.stop();
    }

    setOptions(){
        switch (options.quality.setting) {
            case 0:
                options.quality.value = 32;
            break;

            case 1:
                options.quality.value = 64;
            break;

            case 2:
                options.quality.value = 96;
            break;

            case 3:
                options.quality.value = 128;
            break;
        }

        switch (options.renderDistance.setting) {
            case 0:
                options.renderDistance.value = 10;
            break;

            case 1:
                options.renderDistance.value = 15;
            break;

            case 2:
                options.renderDistance.value = 20;
            break;
        }

        switch (options.difficulty.setting) {
            case 0:
                cacodemon.chaseDistance = 200;
                cacodemon.maxHealth = 200;
                cacodemon.distanceLimits.min = 400;
                cacodemon.bulletProperties.delay = 5000;
                cacodemon.defaultVelocity = 125;
                cacodemon.bulletProperties.damage = 6;
            break;
        
            case 1:
                cacodemon.chaseDistance = 300;
                cacodemon.maxHealth = 225;
                cacodemon.distanceLimits.min = 320;
                cacodemon.bulletProperties.delay = 3800;
                cacodemon.defaultVelocity = 135;
                cacodemon.bulletProperties.damage = 8;
            break;

            case 3:
                cacodemon.chaseDistance = 1000;
                cacodemon.maxHealth = 320;
                cacodemon.distanceLimits.min = 100;
                cacodemon.bulletProperties.delay = 2500;
                cacodemon.defaultVelocity = 200;
                cacodemon.bulletProperties.damage = 20;
            break;
        }
    }

}
