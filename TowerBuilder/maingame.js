// store this against "levels" construct levels with json? tiled?



//TODO: move logic for the brick creation to a seperate class
//      move HUD logic to another scene to a scene
//      promote screen center and and such methods to a UI class
//      create button class
//      change blocks to spritesheet
//      find some button asets
//      create a generic scene potentially running at all time with the background and music?
//      creted generic interface for spawnables



class GameScene extends Phaser.Scene {
    

    constructor () {
        super('maingame');
    }


    create ()  {
        this.add.image(400, 300, 'sky')

        this.spawnables = new Phaser.GameObjects.Group(this);

		// created simulated physics world at the origin, no physics object can pass these bounds
        this.matter.world.setBounds(0, -100, game.config.width, game.config.height);


        // create brick spawner
        this.brickSpawner = new BrickSpawner(this);

        // create any ui graphics
        this.GUI = new GUI(this);

        // create the munchkin spawner
        this.munchkinSpawner = new MunchkinSpawner(this);

        // create a new collision handler
        this.collisionHandler = new CollisionHandler(this);

        // create keyboard/pointer controls
		this.controller = new Controller(this);

		// create the level spawner + spawn
        this.levelSpawner = new LevelSpawner(this);

        this.updateUI();
    }



    // we may need this yet when dealing with multiple volumes on the same object
	//http://labs.phaser.io/edit.html?src=src/game%20objects/tilemap/collision/matter%20detect%20collision%20with%20tile.js

	getRootBody(body)
	{
		if (body.parent === body) { return body; }
		while (body.parent !== body)
		{
			body = body.parent;
		}
		return body;
	}


    completeLevel(){

        // move these
        this.levelSpawner.level++;
        if(this.levelSpawner.level >= levels.length) this.levelSpawner.level = 0;
        this.levelSpawner.setCurrentLevel();

        this.removeAllSpawnables();
        this.levelSpawner.loadLevel();
        this.brickSpawner.resetSelectedBlock();
    }

    updateUI(){
       // if(this.GUI)
        this.GUI.updateUI();
    }


    // remove munchkins and bricks set the available blocks to be the levels max
    removeAllSpawnables(){

        let currentSpawnables = this.spawnables.children;
        let amntCurrentSpawnables = currentSpawnables.entries.length;


        /**
        this.spawnables.children.iterate(function(spawnable){
            console.log(spawnable);
            if(spawnable){
                spawnable.destroy();
            }
        });
         **/

        for(var currentSpawnableNum = 0; currentSpawnableNum < amntCurrentSpawnables; currentSpawnableNum++){

            let currentSpawnable = currentSpawnables.get(currentSpawnableNum);
            currentSpawnable.destroy();
        }
        // duplicate the array instead of passing by reference
        availableBlocks = JSON.parse(JSON.stringify( levelBaseBlocks ));
        this.updateUI()
    }

    removeLastSpawnable(){
        let currentSpawnables = this.spawnables.children.getArray();
        let amntCurrentSpawnables = currentSpawnables.length;
        console.log(currentSpawnables);
        if(amntCurrentSpawnables <= 0) return;

        let currentSpawnable = currentSpawnables[amntCurrentSpawnables - 1];
        currentSpawnable.destroy();
    }

    update() {

        // need a cleaner way of doing this
        this.brickSpawner.updateBrickCursorPosition()
    }

    
}







