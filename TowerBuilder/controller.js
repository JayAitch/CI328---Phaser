
class Controller{
    constructor(physicsSpawner, input) {
        this.physicsSpawner = physicsSpawner;
        this.activePointer = input.activePointer;

        input.on('pointerup', (event) => {
            if(MainGameScene.isPlaying) {
                let pointerPos = this.getCursorPos();
                physicsSpawner.spawnBrickAtLocation(pointerPos);

            }
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
            this._undoPlacement()
        });

        let keyC = input.keyboard.addKey('C');
        keyC.on('down', (event) => {
            MainGameScene.completeLevel();
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
        if(MainGameScene.isPlaying) {
            this.physicsSpawner.changeBlockUp();
        }
    };

    _changeBlockDown(){
        if(MainGameScene.isPlaying) {
            this.physicsSpawner.changeBlockDown();
        }
    };
    _resetBlocks(){
        if(MainGameScene.isPlaying) {
            this.physicsSpawner.removeAllSpawnables();
        }
    }
    _undoPlacement(){
        if(MainGameScene.isPlaying) {
            this.physicsSpawner.removeLastSpawnable();
        }
    }
    _spawnAMunchkin(){
        if(MainGameScene.isPlaying) {
            this.physicsSpawner.spawnMunchkin();
        }
    }

}