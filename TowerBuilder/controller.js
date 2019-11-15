
class Controller{
    constructor(physicsSpawner, input) {
        this.physicsSpawner = physicsSpawner;
        this.activePointer = input.activePointer;

        input.on('pointerdown', (event) => {
            let pointerPos = this.getCursorPos();
            physicsSpawner.spawnBrickAtLocation(pointerPos);
        });

        // change the type of block about to be placed
        let keyE = input.keyboard.addKey('E');
        keyE.on('down', (event) => {
            this._changeBlockDown();

        });

        let keyQ = input.keyboard.addKey('Q');
        keyQ.on('down', (event) => {
            this._changeBlockUp();
        });
        let keyT = input.keyboard.addKey('T');
        keyT.on('down', (event) => {
            this._resetBlocks();
        });

        let keyY = input.keyboard.addKey('Y');
        keyY.on('down', (event) => {
            physicsSpawner.removeLastSpawnable();
        });

        let keyC = input.keyboard.addKey('C');
        keyC.on('down', (event) => {
     //       physicsSpawner.completeLevel();
        });

        let keySpace = input.keyboard.addKey('SPACE');
        keySpace.on('down', (event) => {
            this._spawnAMunchkin();

        });
    }

    getCursorPos(){
        let posVector = {
            "x":this.activePointer.x,
            "y":this.activePointer.y
        }
        return posVector;
    }

    _changeBlockUp(){
        this.physicsSpawner.changeBlockUp();
    };

    _changeBlockDown(){
        this.physicsSpawner.changeBlockDown();
    };
    _resetBlocks(){
        this.physicsSpawner.removeAllSpawnables();
    }
    _spawnAMunchkin(){
        this.physicsSpawner.spawnMunchkin();
    }

}