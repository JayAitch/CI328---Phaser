/**
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


class LevelSpawner{

    constructor (gameScene) {
        this.physicsSpawner = gameScene.physicsSpawner;
        this.levels = gameScene.cache.json.get('levels')

        // fixing the reliance of spawning finish point on gamescene we can remove this reference
        this.gameScene = gameScene;
        this.levelObjects = new Phaser.GameObjects.Group(this);
        this.level = 0;
        this.setCurrentLevel();
        this.loadLevel();
    }

    setCurrentLevel(){
        this.currentLevel = this.levels[this.level]
    }


    loadLevel() {
        this.removeAllLevelBlocks();

        this.levelFinishTriggerVolume = {
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
                        "x": 45,
                        "y": 45,
                        "radius": 45
                    }
                }
            ]
        }

        let staticBlocks = this.currentLevel.static;
        for(let blockNum = 0; blockNum < staticBlocks.length; blockNum++){
         //   console.log(staticBlocks[blockNum]);
         //   let objectName = staticBlocks[blockNum].type;

         //   let shape = this.blockPhysics[objectName];
//
            let currentNewBlockJSON = staticBlocks[blockNum]
            this.createStaticBlock(currentNewBlockJSON);
        }


        let dynamicBlocks = this.currentLevel.dynamic;
        for(let blockNum = 0; blockNum < dynamicBlocks.length; blockNum++){
            //   console.log(staticBlocks[blockNum]);
            //   let objectName = staticBlocks[blockNum].type;

            //   let shape = this.blockPhysics[objectName];
//
            let currentNewBlockJSON = dynamicBlocks[blockNum]
            this.createDynamicBlock(currentNewBlockJSON);

        }

        let objectives = this.currentLevel.objectives;
        for(let objectiveNum = 0; objectiveNum < objectives.length; objectiveNum++){
            //   console.log(staticBlocks[blockNum]);
            //   let objectName = staticBlocks[blockNum].type;

            //   let shape = this.blockPhysics[objectName];
//
            let currentObjectiveJSON = objectives[objectiveNum]
            //this.createDynamicBlock(currentNewBlockJSON);

            this.createObjective(currentObjectiveJSON);
        }
        console.log(this.currentLevel["spawn-location"]);
        let munchkinSpawnLocation = this.currentLevel["spawn-location"]
        this.assignSpawnPoint(munchkinSpawnLocation);
        this.assignAvailableBlocksFromLevel();
   //     let finishDude = this.gameScene.matter.add.sprite(700, 400, "dude", 0, {shape: levelFinishTriggerVolume});

    }
    assignAvailableBlocksFromLevel(){
        levelBaseBlocks = this.currentLevel["available-blocks"][difficulty];
        availableBlocks = JSON.parse(JSON.stringify( levelBaseBlocks ));
     //   this.gameScene.removeAllSpawnables();

    }

    removeAllLevelBlocks(){

        let currentLevelObjects = this.levelObjects.children;
        let objectsLength = currentLevelObjects.entries.length;

        for(var currentLevelObjectIterator = 0; currentLevelObjectIterator < objectsLength; currentLevelObjectIterator++){

            let currentLevelObject = currentLevelObjects.get(currentLevelObjectIterator);
            currentLevelObject.destroy();
        }

    }
    
    
    assignSpawnPoint(location){

        this.physicsSpawner.munchkinSpawner.spawnLocation = location;
        if(this.spawnPositonDisplay){
            this.spawnPositonDisplay.x = location.x;
            this.spawnPositonDisplay.y = location.y;
        }else{
            this.spawnPositonDisplay = this.gameScene.add.image(location.x,location.y, "arrow").setScale(.1)
            this.spawnPositonDisplay.angle = 90;
        }


    }

    createObjective(objectiveJSON){
        let finishDude = this.gameScene.matter.add.sprite(objectiveJSON.x, objectiveJSON.y, "target", 0, {shape: this.levelFinishTriggerVolume});
        this.levelObjects.add(finishDude);
    }
    
    
    createStaticBlock(brickSpawnJson){
        let newBrick = this.physicsSpawner.brickSpawner.spawnNewBrick(brickSpawnJson.x, brickSpawnJson.y,brickSpawnJson.type, true);
        this.levelObjects.add(newBrick);
    }

    createDynamicBlock(brickSpawnJson){
        let newBrick = this.physicsSpawner.brickSpawner.spawnNewBrick(brickSpawnJson.x, brickSpawnJson.y,brickSpawnJson.type, false);
        this.levelObjects.add(newBrick);
       // this.blockSpawner.addToSpawnables(newBrick);
    }
}