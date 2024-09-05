class GeneralGameScene extends Phaser.Scene{
    constructor(key){
        super({key: key});
    }

    preload(){
        this.load.image("wall", "./assets/wall.png", {frameWidth: 32, frameHeight: 32});
        this.load.image("player", "./assets/Player/Sprites/doomguy64x64.png", {frameWidth: 64, frameHeight: 64});
        this.load.image("bullet", "./assets/Player/Sprites/bullet.png", {frameWidth: 12, frameHeight: 12});

        let controls = this.input.keyboard.createCursorKeys();

        for(let key of ["w", "a", "s", "d", "r", "shift", "space", "enter", "esc"]) {
            controls[key] = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[key.toUpperCase()]);
        }

        this.wallsConfig = {
            name: "wall",
            size: 32,
            amount: 25,
            generate: true,
            random: true,
            generalSizeMultiplier: 2
        };

        const shotgun = {
            name: "shotgun",
            fireRate: 60, //RPM
            ammoAmount: 15,
            maxAmmoAmount: 60,
            bulletConfig:{
                name: "bullet",
                damage: 80,
                velocity: 2000,
                critical: 2.2,
                maxCriticalDamage: 320
            },
            distanceLimits:{
                min: 180,
                max: 1000
            },
            animations: [{name: "Shoot", animationParams: {end: 8, framerate: 10}}],
            sounds: this.loadAudios("shotgun", `./assets/Player/Weapons/Shotgun/Sounds/`, [{name: "Shoot"}]),
        }
        
        const pistol = {
            name: "pistol",
            fireRate: 200, //RPM
            ammoAmount: 30,
            maxAmmoAmount: 80,
            bulletConfig:{
                name: "bullet",
                damage: 40,
                velocity: 1600,
                // velocity: 10,
                critical: 1.3
            },
            distanceLimits:{
                min: 250,
                max: 600
            },
            animations: [{name: "Shoot", animationParams: {end: 7, framerate: 15}}],
            sounds: this.loadAudios("pistol", "./assets/Player/Weapons/Pistol/Sounds/", [{name: "Shoot"}]),
        }

        const weapons = [pistol, shotgun];

        for(let weapon of weapons){
            let folderName = weapon.name.charAt(0).toUpperCase() + weapon.name.slice(1);
            this.loadAnimations(weapon.name, `./assets/Player/Weapons/${folderName}/Animations/`, weapon.animations);
        }

        let generalWeaponSounds = [
            {name: "Switch", amount: 3}
        ]

        let playerSounds = [
            {name: "Damaged"},
            {name: "Heal"},
            {name: "Dead"}
        ];

        this.playerConfig = {
            name: "player",
            size: this.wallsConfig.size*2,
            zPosition: 0,
            height: 2,
            mass: 90,
            originPosition: {x: 0.5, y: 0.5},
            angleOffset: 3*Math.PI/2,
            angleOperator: this.angleOperator = 3.5,
            fov: 90*Math.PI/180,
            defaultVelocity: 300,
            maxHealth: !game.config.physics.arcade.debug ? 100 : Infinity,
            maxShield: 150,
            rayAmount: options.quality.value,
            rayColor: "0x00ff00",
            possibleStates: ["Idle", "Walk", "Dead"],
            controls: controls,
            weaponsConfig: {list: weapons, generalWeaponSounds: this.loadAudios("weapon", "./assets/Player/Weapons/Sounds/", generalWeaponSounds)},
            sounds: this.loadAudios("player", "./assets/Player/Sounds/", playerSounds),
        }

        this.cameraConfig = {
            fov: this.playerConfig.fov,
            angleOffset: this.playerConfig.angleOffset - this.playerConfig.fov/2,
            zPosition: this.playerConfig.height,
            fovArcLenght: canvasSize.width,
            fovArcRadius: canvasSize.width/this.playerConfig.fov,
            rayAmount: this.playerConfig.rayAmount

        }

        this.load.image("cacodemon", "./assets/Enemy/Cacodemon/Sprites/cacodemon.png");
        this.load.image("small_cacodemon", "./assets/Enemy/Cacodemon/Sprites/small_cacodemon.jpg");

        let cacodemonSounds = [
            {name: "Attack"},
            {name: "Damaged"},
            {name: "Dead"}
        ];

        let energyBombSounds = [
            {name: "Explosion"},
            {name: "Shoot"}
        ];
        
        this.cacodemonConfig = {
            name: "cacodemon",
            size: this.wallsConfig.size*2,
            zPosition: 1,
            height: 1,
            scaleFactor: 500,
            mass: 300,
            defaultVelocity: 150,
            angleOffset: 3*Math.PI/2,
            chaseDistance: 500,
            attackDistance: 200,
            maxHealth: 250,
            distanceLimits:{
                min: 250,
                max: 1000
            },
            rayAmount: 1,
            rayColor: "0x000000",
            possibleStates: ["Idle", "Patrol", "Chase", "Search", "Attack", "Damaged", "Stunned", "Dead"],
            animations: [
                {name: "Attack", animationParams: {end: 9, framerate: 15}},
                {name: "Damaged", animationParams: {end: 7, framerate: 15}},
                // {name: "Dead", animationParams: {end: 3, framerate: 15}}
            ],
            sounds: this.loadAudios("cacodemon", "./assets/Enemy/Cacodemon/Sounds/", cacodemonSounds)
        }

        this.cacodemonConfig = {... this.cacodemonConfig, bulletConfig:{
            name: "small_energy_bomb",
            make3D: true,
            zPosition: this.cacodemonConfig.zPosition,
            height: 1,
            scaleFactor: 100,
            damage: 12,
            velocity: 200,
            delay: 3000,
            critical: 1.5,
            sounds: this.loadAudios("small_energy_bomb", "./assets/Enemy/Cacodemon/Projectiles/Sounds/", energyBombSounds)
        }};

        this.load.image("small_energy_bomb", "./assets/Enemy/Cacodemon/Projectiles/Sprites/small_energy_bomb.png");
        this.load.image("energy_bomb", "./assets/Enemy/Cacodemon/Projectiles/Sprites/energy_bomb.png");

        this.load.image("PistolAmmo", "./assets/Items/PistolAmmo.png");
        this.load.image("ShotgunAmmo", "./assets/Items/ShotgunAmmo.png");
        this.load.image("MedPack", "./assets/Items/MedPack.png");

        this.loadAnimations("cacodemon", "./assets/Enemy/Cacodemon/Animations/", this.cacodemonConfig.animations);

        this.load.audio("at_dooms_gate", "assets/music/at_dooms_gate.wav");

        this.cameras.main.setViewport(0, 0, window.innerHeight, window.innerHeight);
        this.cameras.main.scrollX = 0;
        this.cameras.main.scrollY = 0;

        if(game.config.physics.arcade.debug){
            this.cameras.main.setViewport(0, 0, canvasSize.width, canvasSize.height);
        }else{
            this.scene.setVisible(false);
        }
    }

    /**
     * This methods allow us to load the audios faster.
     * @param {String} spriteName The name of the asociated sprite to relate the sound.
     * Eg: If you're creating the sounds for the player, you have to put here "player".
     * @param {String} route The route where the sounds are located
     * @param {JSON} listOfSoundsParameters A json with the parameters of the sounds you wish to create.
     * @return {Array<String>} An array with the sounds' names.
     */
    loadAudios(spriteName, route, listOfSoundsParameters){
        let soundNames = [];

        for(let sound of listOfSoundsParameters){
            if(!sound.amount) sound.amount = 1;
            for(let i = 0; i < sound.amount; i++){
                let fullname = sound.amount > 1 ? `${sound.name}_${i + 1}`: sound.name;
                soundNames.push(fullname);
                this.load.audio(`${spriteName}_${fullname}`, `${route}${fullname}.wav`);
            }
        }

        return soundNames;
    }

    /**
     * This methods allow us to load the animations faster.
     * @param {String} spriteName The name of the asociated sprite to relate the sound.
     * Eg: If you're creating the sounds for the player, you have to put here "player".
     * @param {String} route The route where the animation JSONs are located.
     * @param {JSON} listOfAnimationParameters A json with the parameters of the Animation you wish to create.
     */
    loadAnimations(spriteName, route, listOfAnimationParameters){
        for(let animation of listOfAnimationParameters){
            let fullRoute = `${route}${animation.name}/${animation.name}`;
            this.load.atlas(`${spriteName}_${animation.name}`, `${fullRoute}.png`, `${fullRoute}.json`);
        }
    }   
}