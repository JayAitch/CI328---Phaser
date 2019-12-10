
class MunchkinSpawner{
    constructor(gameScene, spawnables)
    {
        this.spawnables = spawnables;
        this.matterRef = gameScene.matter;
        this.spawnLocation = {"x":0, "y":0};
        this.maxMunchkins = 3;
        this.currentMunchkins = 0;
    }

    spawnMunchkin(){

        let spawnLocation = this.spawnLocation;
        const shape = {
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

        if(this.canSpawnMunchkin()){
            let newMunchkin = this.matterRef.add.image(spawnLocation.x, spawnLocation.y, "munchkin",0, {shape: shape});
            this.spawnables.add(newMunchkin);
            Audio.spawnSound.play();
            this.currentMunchkins++;
        }
        else{
            Audio.errorSound.play({volume:0.1});
        }

    }

    canSpawnMunchkin(){
        return (this.currentMunchkins < this.maxMunchkins);
    }

    removeMunchkin(munchkin){
        munchkin.destroy();
        this.currentMunchkins--;
    }
}