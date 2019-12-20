
// store any actions the player can perform through inputs and add inputs to key presses
class Controller{
    constructor(physicsSpawner, input) {
        this.physicsSpawner = physicsSpawner;
        this.activePointer = input.activePointer;


        // add input to player key presses. The functions these call are exactly the same as the HUD buttons
        // prevents repeated code and maintains a single exicution path.

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
            this._levelComplete();
        });

        let keySpace = input.keyboard.addKey('SPACE');
        keySpace.on('down', (event) => {
            this._spawnAMunchkin();

        });
    }

    // quick access to cursor position
    getCursorPos(){
        let posVector = {
            "x":this.activePointer.x,
            "y":this.activePointer.y
        }
        return posVector;
    }

    // action for changing the current block that is selected
    _changeBlockUp(){
        if(MainGameScene.isPlaying) {
            this.physicsSpawner.changeBlockUp();
        }
    };

    // action for changing the current block that is selected
    _changeBlockDown(){
        if(MainGameScene.isPlaying) {
            this.physicsSpawner.changeBlockDown();
        }
    };

    // action for removing all objects spawned by the player
    _resetBlocks(){
        if(MainGameScene.isPlaying) {
            this.physicsSpawner.removeAllSpawnables();
        }
    }

    // remove the last object placed by the player
    _undoPlacement(){
        if(MainGameScene.isPlaying) {
            this.physicsSpawner.removeLastSpawnable();
        }
    }

    // create a new munchkin at their spawnpoint
    _spawnAMunchkin(){
        if(MainGameScene.isPlaying) {
            this.physicsSpawner.spawnMunchkin();
        }
    }

    // cheat to complete level testing only not intended as part of the game
    _levelComplete(){
        if(MainGameScene.isPlaying) {
            MainGameScene.completeLevel();
        }
    }

}