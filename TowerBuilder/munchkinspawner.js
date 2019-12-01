
class MunchkinSpawner{
    constructor(gameScene, spawnables)
    {
        this.spawnables = spawnables;
        this.matterRef = gameScene.matter;
        this.spawnLocation = {"x":0, "y":0};

    }

    spawnMunchkin(posX, posY){

        let spawnLocation = this.spawnLocation;
        const shape = {
            "type": "fromPhysicsEditor",
            "label": "munchkin",
            "isStatic": false,
            "density": 0.0001,
            "restitution": 1,
            "friction": 0.008,
            "frictionAir": 0.0025,
            "frictionStatic" :0.0,
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


        let newMunchkin = this.matterRef.add.sprite(spawnLocation.x, spawnLocation.y, "munchkin",0, {shape: shape});

        this.spawnables.add(newMunchkin);

    }
}