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




class GameScene extends Phaser.Scene {
    

    constructor () {
        super('maingame');
        // values to store and display the score
        this.score = 0;
        this.scoreText;
    }

    
    create ()  {
        this.add.image(400, 300, 'sky')
		
		
        const brickPhysics = this.cache.json.get('brick-physics');

		// created simulated physics world at the origin, no physics object can pass these bounds
        this.matter.world.setBounds(0, -100, game.config.width, game.config.height);

        // todo: move this to a seperate scenee?
        // create the hud
        // we shouldnt be passing this in
        this.createHUD();

        this.brickSpawner = new BrickSpawner(brickPhysics, this
            //     this.cache.json.get('brick-physics'),
            //   this.matter //this potentially needs to go, i dont want to be passing the physics engine around , its a pretty big object concider using a group/pool
        );
        this.dodoSpawner = new DodoSpawner(this);

/*
        // place a block at the cursor
        this.input.on('pointerdown', function(event) {
        //    this.spawnCurrentBlockTypeAtCursorPosition();
           // brickSpawner.spawnBrickAtCursorLocation();
        //  this.brickSpawner.displayBrickSpawnLocation();
      //      console.log("11123");
        }, this);
*/
        this.input.on('pointerup', function(event) {
            //    this.spawnCurrentBlockTypeAtCursorPosition();
            this.brickSpawner.spawnBrickAtCursorLocation();
        }, this);

        // change the type of block about to be placed
        let keyE = this.input.keyboard.addKey('E');
        keyE.on('down', function(event) {
            this.brickSpawner.changeBlockType(-1);
            }, this);

        let keyQ = this.input.keyboard.addKey('Q');
        keyQ.on('down', function(event) {	
            this.brickSpawner.changeBlockType(1);
            }, this);


        let keySpace = this.input.keyboard.addKey('SPACE');
        keySpace.on('down', function(event) {
           // this.brickSpawner.changeBlockType(1);
            console.log("spawner")
            this.dodoSpawner.spawnDodo(100,100);
        }, this);
		
		
		
		//let finishdude = this.add.image(100,300, 'dude');
		

  
		
		
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
		console.log(this.Events);
		
		
		let finishDude = this.matter.add.sprite(100, 300, "dude", 0, {shape: levelFinishTriggerVolume});
		this.matter.world.on('collisionstart', function(event){
			let collisionPairs = event.pairs;

			for (var i = 0; i < event.pairs.length; i++){
				// this has potential issues with multiple volumes
				// other examples get the par
			//	let bodyA = this.getRootBody(collisionPairs[i].bodyA);
				//let bodyB = this.getRootBody(collisionPairs[i].bodyB);
				let bodyA = collisionPairs[i].bodyA;
				let bodyB = collisionPairs[i].bodyB;

				
				if(bodyA.label === 'levelChangeTrigger' && bodyB.label === 'marble'||
				bodyB.label === 'levelChangeTrigger' && bodyA.label === 'marble')
				{
					
					alert('levelcomplete	');
				}
			}
		})
		
		
		
		
		
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

    createHUD() {

        // create a text object to display the score
        this.scoreText = this.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});


        // condense the style out into a config object
        const textStyle = {
            fill: '#000',
            fontFamily: '"Roboto Condensed"',
            fontSize: "50px",
            fontWeight: "bolder"
        };
;


        let upBtn = this.add.image((game.config.width / 2) + 200, game.config.height - 55, "greenshort1").setScale(2);
        this.add.text((game.config.width / 2) + 200, game.config.height - 75, '>', textStyle);
        upBtn.setInteractive();
        upBtn.on('pointerdown', () => {


            //naughty duplicate code!!!!!!!!!!!!!
            this.brickSpawner.changeBlockType(1);
        });


        let dwnBtn = this.add.image((game.config.width / 2) - 200, game.config.height - 55, "blackshort1").setScale(2);
        this.add.text((game.config.width / 2) - 200, game.config.height - 45, '<', textStyle);
        dwnBtn.setInteractive();
        dwnBtn.on('pointerdown', () => {

            //naughty duplicate code!!!!!!!!!!!!!!!!!
            this.brickSpawner.changeBlockType(-1);
        });


        this.currentBlockTypeDisplay = this.add.image((game.config.width / 2), game.config.height - 55, "blue" + blockTypes[this.currentBlockType]).setScale(1);

        // spawn the cursor block display offscreen, we dont want to see it untill it has the right block
        this.cursorBlockDisplay = this.add.image((game.config.width * 20), game.config.height * 20, "blue" + blockTypes[this.currentBlockType]).setScale(1);

    }

    update() {

        // need a cleaner way of doing this
        this.brickSpawner.updateBrickCursorPosition()
    }

    
}

class DodoSpawner{
    constructor(gameScene)
    {
        this.sceneRef = gameScene;
        this.matterRef = gameScene.matter;
    }
    spawnDodo(posX,posY){



        const shape = {
            "type": "fromPhysicsEditor",
            "label": "top-sloped4",
            //"inertia": Infinity,
            "isStatic": false,
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
                    "label": "marble",
                    "isSensor": false,
                    "circle": {
                        "x": 32,
                        "y": 32,
                        "radius": 20
                    }
                }
            ]
        }
        // this should be done with a group instead
         let newDodo = this.matterRef.add.sprite(posX, posY, "dude",0, {shape: shape});
        newDodo.anims.play("duderight", true);
    }
}




class BrickSpawner {


    // most of this constructor is unessisary, there is some intense coupling with this and the maingame scene.
    // need a way of constructing game objects seperately
    // UI needs its own classes, eg brick placing cursor
    constructor(blockPhysics, gameScene){
        this.currentBlockType = 0;
        this.gameScene = gameScene;
        this.pointer = gameScene.input.activePointer;//this.input.activePointer;
        this.blockPhysics = blockPhysics;

        // use a group here instead of the entire physcis engine
        this.matterRef = gameScene.matter;
        this.displayCurrentBrickType();

    }


    updateBrickCursorPosition(){
        let pointerX = this.pointer.x;
        let pointerY = this.pointer.y;
        this.gameScene.cursorBlockDisplay.x = pointerX;
        this.gameScene.cursorBlockDisplay.y = pointerY;
        this.gameScene.cursorBlockDisplay.setTint(0x0f0fff);
    }

    spawnBrickAtCursorLocation(){
        let pointerX = this.pointer.x;
        let pointerY = this.pointer.y;

        // make sure there is space to spawn one and we arn't off screen
        if(!this.canSpawnBrick(pointerX, pointerY)) return;

        let objectName = blockTypes[this.currentBlockType];
        this.spawnNewBrick(pointerX, pointerY, objectName);
    }






    canSpawnBrick(posX, posY){
        if(posY < game.config.height - 150)
        {
            return true;
        }
        return false;
    }

    roleABlockColour(){
        // get these values from somwhere
        // potentially store a collection somewhere when loading them
        // consider using a single brick asset (white) and running a mask over it
        let colours = ["black","blue","green"];
        let colourNumber =  Math.random() * 3;
        colourNumber = Math.trunc(colourNumber);
        return colours[colourNumber];
    }

    spawnNewBrick(posX, posY, objectName){
        //role a colour from the ones available
        let colour = this.roleABlockColour();

        let shape = this.blockPhysics[objectName];

        // work out what the image was called
        let imageReference =  colour + objectName;
        //  create a new brick
        // this should be done with a group instead
        let newBrick = this.matterRef.add.image(posX, posY, imageReference, 0, {shape: shape});

    }

    changeBlockType(amount){
        this.currentBlockType = this.currentBlockType + amount;
        if(this.currentBlockType < 0) this.currentBlockType = Object.keys(blockTypes).length -1;
        if(this.currentBlockType > Object.keys(blockTypes).length -1) this.currentBlockType = 0;
        this.displayCurrentBrickType();
    }

    displayCurrentBrickType(){

        let currentBrickTypeInt = this.currentBlockType;
        let currentBrickTypeTextureRef = "blue" + blockTypes[currentBrickTypeInt];

        this.gameScene.currentBlockTypeDisplay.setTexture(currentBrickTypeTextureRef);
       // this.image(blockTypes[this.currentBlockType]);
        this.gameScene.cursorBlockDisplay.setTexture(currentBrickTypeTextureRef);

    }


}