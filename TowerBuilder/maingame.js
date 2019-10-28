// store this against "levels" construct levels with json? tiled?

const blockTypes = {
    0:"short1",
    1:"short2",
    2:"short3",
    3:"short4",
    4:"tall1",
    5:"tall2",
    6:"tall3",
    7:"tall4",
    8:"bottom-sloped1",
    9:"top-sloped1",
    10: "top-sloped2",
    11:"bottom-sloped2",
    12:"bottom-sloped3",
    13: "top-sloped3",
    14:"top-sloped4",
    15:"bottom-sloped4"
};


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

        this.GUI = new GUI(this);
        this.brickSpawner = new BrickSpawner(this);
        this.dodoSpawner = new MunchkinSpawner(this);

        // create a new collision handler
        this.collisionHandler = new CollisionHandler(this);

		this.controller = new Controller(this);

		
		let levelFinishTriggerVolume = {
            "type": "fromPhysicsEditor",
            "label": "top-sloped4",
            //"inertia": Infinity,
            "isStatic": true,
            "density": 0.10000000149011612,
            "restitution": 0,
            "friction": 0.10000000149011612,
            "frictionAir": 0.00999012312,
            "frictionStatic": 0.5,
            "collisionFilter": {
                "group": 0,
                "category": 1,
                "mask": 255
            },

            "fixtures": [
                {
                    "label": "levelChangeTrigger",
                    "isSensor": true,
                    "circle": {
                        "x": 32,
                        "y": 32,
                        "radius": 20
                    }
                }
            ]
        }

		let finishDude = this.matter.add.sprite(100, 300, "dude", 0, {shape: levelFinishTriggerVolume});

    }
	
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

    }

    update() {

        // need a cleaner way of doing this
        this.brickSpawner.updateBrickCursorPosition()
    }

    
}







