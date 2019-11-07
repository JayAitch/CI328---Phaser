
class MunchkinSpawner{
    constructor(gameScene)
    {
        this.sceneRef = gameScene;
        this.matterRef = gameScene.matter;
    }

    spawnMunchkin(posX, posY){

        const shape = {
            "type": "fromPhysicsEditor",
            "label": "munchkin",
            "isStatic": false,
            "density": 0.0001,
            "restitution": 0.8,
            "friction": 0.008,
            "frictionAir": 0.0005,
            "frictionStatic" :0.02,
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
                        "x": 22,
                        "y": 22,
                        "radius": 20
                    }
                }
            ]
        }


        let newDodo = this.matterRef.add.sprite(posX, posY, "munchkin",0, {shape: shape});
        this.sceneRef.spawnables.add(newDodo);
    }
}