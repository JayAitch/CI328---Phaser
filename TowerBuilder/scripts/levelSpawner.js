/**
 *
 * this is all the blocks avaialble to the level.
{"amount":5, "type":"short1"},
{"amount":5, "type":"short2"},
{"amount":5, "type":"short3"},
{"amount":5, "type":"short4"},
{"amount":5, "type":"tall1"},
{"amount":2, "type":"tall2"},
{"amount":2, "type":"tall3"},
{"amount":2, "type":"tall4"},
{"amount":0, "type":"bottom-sloped1"},
{"amount":0, "type":"bottom-sloped2"},
{"amount":0, "type":"bottom-sloped3"},
{"amount":0, "type":"bottom-sloped4"},
{"amount":0, "type":"top-sloped1"},
{"amount":0, "type":"top-sloped2"},
{"amount":0, "type":"top-sloped3"},
{"amount":0, "type":"top-sloped4"}
 **/



// controls any blocks that are placed by level definitions
class LevelSpawner{

    constructor () {
        this.physicsSpawner = MainGameScene.physicsSpawner;
        this.levels = MainGameScene.cache.json.get('levels')

        // store as a local reference
        this.gameScene = MainGameScene;
        this.levelObjects = new Phaser.GameObjects.Group(this);

        // level the player is currently on
        this.level = 0;


        // set attributes of the current level and trigger the load
        this.setCurrentLevel();
        this.loadLevel();
    }


    // find the level in the json and set it as the current one
    setCurrentLevel(){
        this.currentLevel = this.levels[this.level]
    }


    // parse the level json and make the game state the same as the intial level state
    loadLevel() {


        // remove any blocks previously spawned by this
        this.removeAllLevelBlocks();



        // go through all static blocks defined in the json and load them
        let staticBlocks = this.currentLevel.static;
        for(let blockNum = 0; blockNum < staticBlocks.length; blockNum++){
            let currentNewBlockJSON = staticBlocks[blockNum]
            this.createStaticBlock(currentNewBlockJSON);
        }


        // spawn any dynamic blocks defined by the json
        // do this after static ones to have somewhere to place them
        let dynamicBlocks = this.currentLevel.dynamic;
        for(let blockNum = 0; blockNum < dynamicBlocks.length; blockNum++){
            let currentNewBlockJSON = dynamicBlocks[blockNum]
            this.createDynamicBlock(currentNewBlockJSON);

        }

        // create objective objects
        // allow for multiple objectives to be defined
        let objectives = this.currentLevel.objectives;
        for(let objectiveNum = 0; objectiveNum < objectives.length; objectiveNum++){
            let currentObjectiveJSON = objectives[objectiveNum]
            this.createObjective(currentObjectiveJSON);

        }

        // set where the munchkins spawn on this level
        let munchkinSpawnLocation = this.currentLevel["spawn-location"]
        this.assignSpawnPoint(munchkinSpawnLocation);

        // assign any blocks deffined by the level
        this.assignAvailableBlocksFromLevel();
    }

    assignAvailableBlocksFromLevel(){
        // assign blocks from level definition of difficulty
        levelBaseBlocks = this.currentLevel["available-blocks"][difficulty];
        // prevent pass by reference, copy object into new reference
        availableBlocks = JSON.parse(JSON.stringify( levelBaseBlocks ));
    }

    // destroy anything created by the level spawner
    removeAllLevelBlocks(){

        let currentLevelObjects = this.levelObjects.children;
        let objectsLength = currentLevelObjects.entries.length;

        // manually iterating as .iterator was actually leaving some blocks spawned
        for(let currentLevelObjectIterator = 0; currentLevelObjectIterator < objectsLength; currentLevelObjectIterator++){

            let currentLevelObject = currentLevelObjects.get(currentLevelObjectIterator);
            currentLevelObject.destroy();
        }

    }
    
    // set the position of the spawn position display and the location the munchkin spawner uses
    assignSpawnPoint(location){

        this.physicsSpawner.munchkinSpawner.spawnLocation = location;
        if(this.spawnPositonDisplay){
            // we already have a spawn poition display so move it to the correct location
            this.spawnPositonDisplay.x = location.x;
            this.spawnPositonDisplay.y = location.y;
        }else{
            // this is the first level so create a new spawn positon display object
            this.spawnPositonDisplay = this.gameScene.add.image(location.x,location.y, "arrow").setScale(.1)
            this.spawnPositonDisplay.angle = 90;
        }


    }

    // create objective object from the level deffinitions
    createObjective(objectiveJSON){
        // this shape is only ever used in this function
        // level finish trigger shape definition notice it is a sensor and therefore doesnt block collisions
        const levelFinishTriggerVolume = {
            "type": "fromPhysicsEditor",
            "label": "levelChangeTrigger",
            //"inertia": Infinity,
            "isStatic": true,
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
                        "x": 45,
                        "y": 45,
                        "radius": 45
                    }
                }
            ]
        }
        let target = this.gameScene.matter.add.sprite(objectiveJSON.x, objectiveJSON.y, "target", 0, {shape: levelFinishTriggerVolume});


        // add to the array so it can be deleted later
        this.levelObjects.add(target);
    }
    
    // spawn a static block as defined by json
    createStaticBlock(brickSpawnJson){

        // default the angle to 0
        let angle = brickSpawnJson.angle || 0;

        //spawn type and position that is defined
        let newBrick = this.physicsSpawner.brickSpawner.spawnNewBrick(brickSpawnJson.x, brickSpawnJson.y,brickSpawnJson.type, true, angle);
        this.levelObjects.add(newBrick);
    }

    // spawn a dynamic block as defined by json
    createDynamicBlock(brickSpawnJson){
        let angle = brickSpawnJson.angle || 0;

        //spawn type and position that is defined
        let newBrick = this.physicsSpawner.brickSpawner.spawnNewBrick(brickSpawnJson.x, brickSpawnJson.y,brickSpawnJson.type, false, angle);
        this.levelObjects.add(newBrick);
    }
}