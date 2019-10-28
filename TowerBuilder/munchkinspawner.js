
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
            "density": 0.010000000149011612,
            "restitution": 0.5,
            "friction": 0.100100000149011612,
            "frictionAir": 0.00999012312,
            "frictionStatic": 0.2,
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