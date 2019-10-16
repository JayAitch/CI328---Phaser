
class BootScene extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'boot' });
    }

    preload ()
    {
        // load all files necessary for the loading screen
        // our game assets will be loaded via parsing assets json
        this.load.json('assets', 'assets/assets.json');
        this.load.json('animations', 'assets/animations.json');
        this.load.json("brick-physics", "assets/brick-physics.json");
        this.load.image('sky', 'assets/sky.png');
    }

    create ()
    {
        // trigger asset load from json
        this.scene.start('preload');
    }
}



    // settup game configuration settings
    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene:[BootScene, PreloadScene, MenuScene, LevelLoader, GameScene],
        
        // using the arcade physics engine
        physics: {
            default: 'matter',
            matter: {
          //     gravity: { y: 300 },
                debug: true
            }
        },
        

    };

	// pass game configuration
    game = new Phaser.Game(config);
