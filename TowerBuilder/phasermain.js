
class BootScene extends Phaser.Scene {
    constructor() {
        super({key: 'boot'});
    }

    preload() {
        // load all files necessary for the loading screen
        // our game assets will be loaded via parsing assets json
        this.load.json('assets', 'assets/assets.json');
        this.load.json('animations', 'assets/animations.json');
        this.load.json("brick-physics", "assets/brick-physics.json");
        this.load.json("levels", "assets/levels.json");
        this.load.image('sky', 'assets/sky1.png');
    }

    create() {
        // trigger asset load from json
        this.scene.start('preload');
    }
}

let difficulty = 0;
let game;




const config = {
    type: Phaser.AUTO,


    width: 1200,
    height: 1100,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    autoRound: false,

    scene: [BootScene, PreloadScene, MenuScene, GameScene, LevelCompleteScene],


    physics: {
        default: 'matter',
        matter: {
            gravity: {y: 1.1}
            //debug: true
        }
    },

};


window.addEventListener('load', (event) => {
    main();
});

function main(){
    // pass game configuration
    game = new Phaser.Game(config);
}





/**
 * DONE:
 *         +leveltrigger blocking placement
 *         +seperate levels in json
 *         +check for block placement
 *         +new munchkin from kenny
 *         +cap on munchkin volumes
 *         +add sounds
 *         +fix menu screan
 *         +spawn in level complete screen
 *         +HUD layoring and clarity
 *             finetune munchkin physics
 *          particles
 *          undo button
 *       particles
 *           sortout score
 * TODO:
    playtest levels
    fix file structure
    combine spawners
    error checking on json parsing
    rename physics blocks and move end box and munchkin
    add level with multiple objectives and dynamic blocks


 **/
