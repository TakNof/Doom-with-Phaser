class WeaponManager{
    constructor(scene, controls, weapons, generalWeaponSounds){
        this.scene = scene;
        this.controls = controls;
        this.weapons = weapons;       

        this.initWeapons();
        this.nextWeaponSwitch = 0;
        this.switchWeaponDelay = 1000;
        this.setGeneralWeaponSounds("weapon", generalWeaponSounds);

        this.currentWeapon;
    }

    /**
     * Sets the general weapon sounds to be played.
     * @param {String} name
     * @param {Array<String>} soundNames
     */
    setGeneralWeaponSounds(name, ...soundNames){
        this.generalWeaponSounds = {};
        
        if(Array.isArray(soundNames[0])){
            soundNames = soundNames[0];
        }
 
        for(let element of soundNames){
         this.generalWeaponSounds[element] = new Sound(this.scene, `${name}_${element}`);
        }
    }

    /**
     * Gets the general weapon sound specified by the given name.
     * @param {String} element The name of the sound to retrieve.
     * @returns {Sound}
     */
    getGeneralWeaponSounds(element){
        if(!element){
            return this.generalWeaponSounds;
        }else{
            return this.generalWeaponSounds[element];
        }
    }

    initWeapons(){
        for(let weapon of this.weapons){
            weapon.setActive(false);
            weapon.setVisible(false);
        }

        this.setCurrentWeapon(this.weapons[0]);
    }

    setCurrentWeapon(weapon){
        if(this.currentWeapon){
            this.currentWeapon.setActive(false)
            this.currentWeapon.setVisible(false);
        }
            
        this.currentWeapon = weapon;
        this.currentWeapon.setActive(true);
        this.currentWeapon.setVisible(true);
    }

    getCurrentWeapon(){
        return this.currentWeapon;
    }

    HandleWeapon(){
        this.currentWeapon.actionateWeapon();
    }

    switchWeapons(){
        let time = this.scene.time.now;

        if(time > this.nextWeaponSwitch){
            this.nextWeaponSwitch = time + this.switchWeaponDelay;
            let switchSound = `Switch_${Phaser.Math.Between(1,3)}`;
            this.getGeneralWeaponSounds(switchSound).playSound();

            this.currentWeapon.disable();

            let index = this.weapons.indexOf(this.getCurrentWeapon());

            if(index == this.weapons.length - 1){
                this.setCurrentWeapon(this.weapons[0]);
            }else{
                this.setCurrentWeapon(this.weapons[index + 1]);
            }

            this.currentWeapon.enable();
        }
    }
}