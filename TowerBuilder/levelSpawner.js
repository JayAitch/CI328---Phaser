const level1 =
    {
        "static": [
            {
                "colour": "blue",
                "type": "tall4",
                "x":0,
                "y":300,
            },
            {
                "colour": "blue",
                "type": "tall4",
                "x":193,
                "y":357,
            },
            {
                "colour": "blue",
                "type": "tall4",
                "x":385,
                "y":414,
            },
            {
                "colour": "blue",
                "type": "tall4",
                "x":579,
                "y":471,
            },
           {
                "colour": "blue",
                "type": "tall4",
                "x":772,
                "y":500,
            },

        ],
        "dynamic":[/**
         {
                "colour": "blue",
                "type": "tall4",
                "x":97,
                "y":300,
            },
         {
                "colour": "blue",
                "type": "tall4",
                "x":289,
                "y":300,
            },
         {
                "colour": "blue",
                "type": "top-sloped4",
                "x":56,
                "y":230,
            }**/
        ]
    }




const level2 =
    {
        "static": [
            {
                "colour": "blue",
                "type": "tall4",
                "x":0,
                "y":500,
            },
            {
                "colour": "blue",
                "type": "tall4",
                "x":192,
                "y":500,
            },
            {
                "colour": "blue",
                "type": "tall4",
                "x":384,
                "y":500,
            },
            {
                "colour": "blue",
                "type": "tall4",
                "x":576,
                "y":500,
            },
            {
                "colour": "blue",
                "type": "tall4",
                "x":768,
                "y":500,
            },
            {
                "colour": "blue",
                "type": "short4",
                "x":0,
                "y":200,
            },
            {
                "colour": "blue",
                "type": "short4",
                "x":192,
                "y":200,
            },
            {
                "colour": "blue",
                "type": "short4",
                "x":384,
                "y":200,
            },
            {
                "colour": "blue",
                "type": "short4",
                "x":384,
                "y":200,
            },
            {
                "colour": "blue",
                "type": "short4",
                "x":576,
                "y":200,
            }
        ],
        "dynamic":[/**
            {
                "colour": "blue",
                "type": "tall4",
                "x":97,
                "y":300,
            },
            {
                "colour": "blue",
                "type": "tall4",
                "x":289,
                "y":300,
            },
            {
                "colour": "blue",
                "type": "top-sloped4",
                "x":56,
                "y":230,
            }**/
        ]
    }




class LevelSpawner{

    constructor (gameScene) {
        this.blockSpawner = gameScene.brickSpawner;
        this.gameScene = gameScene;
        this.levelObjects = new Phaser.GameObjects.Group(this);
        this.currentLevel = level1;

        this.loadLevel();
    }
    
    loadLevel() {

        let staticBlocks = this.currentLevel.static;
     //   console.log(staticBlocks);
        let dynamicBlocks = this.currentLevel.dynamic;
        this.removeAllLevelBlocks();
        for(var blockNum = 0; blockNum < staticBlocks.length; blockNum++){
         //   console.log(staticBlocks[blockNum]);
         //   let objectName = staticBlocks[blockNum].type;

         //   let shape = this.blockPhysics[objectName];
//
            let currentNewBlockJSON = staticBlocks[blockNum]
            this.createStaticBlock(currentNewBlockJSON);
        }

        for(blockNum = 0; blockNum < dynamicBlocks.length; blockNum++){
            //   console.log(staticBlocks[blockNum]);
            //   let objectName = staticBlocks[blockNum].type;

            //   let shape = this.blockPhysics[objectName];
//
            let currentNewBlockJSON = dynamicBlocks[blockNum]
            this.createDynamicBlock(currentNewBlockJSON);

        }


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

        let finishDude = this.gameScene.matter.add.sprite(700, 400, "dude", 0, {shape: levelFinishTriggerVolume});

    }

    removeAllLevelBlocks(){

        let currentLevelObjects = this.levelObjects.children;
        let objectsLength = currentLevelObjects.entries.length;

        /**
         this.spawnables.children.iterate(function(spawnable){
            console.log(spawnable);
            if(spawnable){
                spawnable.destroy();
            }
        });
         **/
        for(var currentLevelObjectIterator = 0; currentLevelObjectIterator < objectsLength; currentLevelObjectIterator++){

            let currentLevelObject = currentLevelObjects.get(currentLevelObjectIterator);
            currentLevelObject.destroy();
        }

    }
    
    
    
    
    
    
    createStaticBlock(brickSpawnJson){
        let newBrick = this.blockSpawner.spawnNewBrick(brickSpawnJson.x, brickSpawnJson.y,brickSpawnJson.type, true);
        this.levelObjects.add(newBrick);
    }

    createDynamicBlock(brickSpawnJson){
        let newBrick = this.blockSpawner.spawnNewBrick(brickSpawnJson.x, brickSpawnJson.y,brickSpawnJson.type, false);
        this.levelObjects.add(newBrick);
       // this.blockSpawner.addToSpawnables(newBrick);
    }
}