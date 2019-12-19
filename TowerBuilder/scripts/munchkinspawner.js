
class MunchkinSpawner{
    constructor(spawnables)
    {
        this.spawnables = spawnables;

        // default the spawn location to prevent errors
        this.spawnLocation = {"x":0, "y":0};

        // palyer cannot have more than 3 muchkins out at once
        this.maxMunchkins = 3;
        this.currentMunchkins = 0;
    }

    spawnMunchkin(){

        let spawnLocation = this.spawnLocation;


        // shape deffinition for a munckin
        // this is inline with code as it is the only place it is used, could by included in a json
        const munchkinShape = {
            "type": "fromPhysicsEditor",
            "label": "munchkin",
            "isStatic": false,
            "density": 0.0001,
            "restitution": 1,
            "friction": 0.008,
            "frictionAir": 0.00025,
            "frictionStatic" :0.08,
            "collisionFilter": {
                "group": 0,
                "category": 1,
                "mask": 255
            },
            "fixtures": [
                {
                    "label": "munchkin",
                    "isSensor": false,
                    "circle": {
                        "x": 50,
                        "y": 43,
                        "radius": 42
                    }
                }
            ]
        }

        // make sure condiditions are met before attempting to spawn
        if(this.canSpawnMunchkin()){
            // create a new object in the physics world and add to our collection
            let newMunchkin = MatterScene.add.image(spawnLocation.x, spawnLocation.y, "munchkin",0, {shape: munchkinShape});
            this.spawnables.add(newMunchkin);

            // audio queue to inform the player
            Audio.spawnSound.play();

            // keep a count of the current munchkins
            this.currentMunchkins++;
        }
        else{

            // let the player know somethings gone wrong with spawning
            Audio.errorSound.play({volume:0.1});
        }

    }

    // make sure the player only has 3 munchkins
    canSpawnMunchkin(){
        return (this.currentMunchkins < this.maxMunchkins);
    }

    // called by the undo action, keep track of the munchkins
    removeMunchkin(munchkin){
        munchkin.destroy();
        this.currentMunchkins--;
    }
}