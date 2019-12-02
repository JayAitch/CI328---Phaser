
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


// settup game configuration settings
var config = {
    type: Phaser.AUTO,


    width: 1200,
    height: 1000,

    autoCenter: Phaser.Scale.CENTER_BOTH,
    scene: [BootScene, PreloadScene, MenuScene, GameScene, LevelCompleteScene],


    physics: {
        default: 'matter',
        matter: {
            gravity: {y: 1.5},
            debug: true
        }
    },

};


// pass game configuration
game = new Phaser.Game(config);
let difficulty = 0;
//	console.log(Matter.Events)


/**
 * DONE:
 *         +leveltrigger blocking placement
 *         +seperate levels in json
 *         +check for block placement
 *         +new munchkin from kenny
 *         +cap on munchkin volumes
 *         +add sounds
 * TODO:
    playtest levels
    fix file structure
    sortout score
     fix menu screan
    particles
     combine spawners
    spawn in level complete screen
    error checking on json parsing
    rename physics blocks and move end box and munchkin
    add level with multiple objectives and dynamic blocks
    finetune munchkin physics

 **/