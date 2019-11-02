
class Controller{
    constructor(gameScene) {

        gameScene.input.on('pointerdown', function(event) {
            //    this.spawnCurrentBlockTypeAtCursorPosition();
            gameScene.brickSpawner.spawnBrickAtCursorLocation();
        });

        // change the type of block about to be placed
        let keyE = gameScene.input.keyboard.addKey('E');
        keyE.on('down', function(event) {
            gameScene.brickSpawner.changeBlockType(-1);
        });

        let keyQ = gameScene.input.keyboard.addKey('Q');
        keyQ.on('down', function(event) {
            gameScene.brickSpawner.changeBlockType(1);
        });
        let keyT = gameScene.input.keyboard.addKey('T');
        keyT.on('down', function(event) {
            gameScene.removeAllSpawnables();
        });

        let keyY = gameScene.input.keyboard.addKey('Y');
        keyY.on('down', function(event) {
            gameScene.removeLastSpawnable();
        });

        let keySpace = gameScene.input.keyboard.addKey('SPACE');
        keySpace.on('down', function(event) {
            // this.brickSpawner.changeBlockType(1);
            console.log("spawner")
            gameScene.dodoSpawner.spawnMunchkin(100,100);
        });
    }

}