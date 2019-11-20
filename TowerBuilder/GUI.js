

// condense the style out into a config object
const textStyle = {
    fill: '#000',
    fontFamily: '"Roboto Condensed"',
    fontSize: "50px",
    fontWeight: "bolder"
};

// consider creating these on a seperate scene and managing the block spawner object
class GUI {
    // TODO fix coupling issue with this and the brick spawner
    constructor(gameScene) {

        // change GUI to have a display of each of the remaining blocks, control display through pull?
        //dont think we need this anymore
        this.gameScene = gameScene;
        // create a text object to display the score
        this.scoreText = gameScene.add.text(16, 16, 'score: 0', {fontSize: '16px', fill: '#000'});
        this.brickSpawner = gameScene.physicsSpawner.brickSpawner;

        // this coupling with brick spawner is really bad


        // move this to a class so we can create on for each block type and pass the object type by reference
        this.currentBlockTypeDisplay = gameScene.add.image((game.config.width / 2), game.config.height - 55, "blueshort1").setScale(1);
        this.currentBlockTypeDisplayText = gameScene.add.text((game.config.width / 2), game.config.height - 40, '-', textStyle);
        // spawn the cursor block display offscreen, we dont want to see it until it has the right block
        this.cursorBlockDisplay = gameScene.add.image((game.config.width * 20), game.config.height * 20, "blue" + availableBlocks[this.currentBlockType]).setScale(1);
    }


    createButtons(controller) {

        let blockUpAction = function () {
            controller._changeBlockUp();
        };
        let blockUpBtn = new ImageButton((game.config.width / 2) + 200, game.config.height - 55, "greenshort1", this.gameScene, blockUpAction);


        let blockDownAction = function () {
            controller._changeBlockDown();
        };
        let blockDownBtn = new ImageButton((game.config.width / 2) - 200, game.config.height - 55, "blackshort1", this.gameScene, blockDownAction);


        let blockResetAction = function () {
            controller._resetBlocks();
        };
        let blockResetBtn = new ImageButton((game.config.width / 2) - 300, game.config.height - 55, "restart-btn", this.gameScene, blockResetAction);

        let munchkinSpawnAction = function () {
            controller._spawnAMunchkin();
        };
        let munchkinSpawnBtn = new ImageButton((game.config.width / 2) - 400, game.config.height - 55, "munchkin", this.gameScene, munchkinSpawnAction);

    }

    // control all UI changes here rather than on the spawner
    updateUI() {

        let currentBrickTypeTextureRef = "blue" + this.brickSpawner.getCurrentBlockName();


        this.currentBlockTypeDisplayText.setText(this.brickSpawner.getCurrentBlockAmount());
        this.cursorBlockDisplay.setTexture(currentBrickTypeTextureRef);

        this.currentBlockTypeDisplay.setTexture(currentBrickTypeTextureRef);

    }
/**
// concider a push update like so::
    updateUI(currentBrickTextureRef, amountLeft) {

        let currentBrickTypeTextureRef = "blue" + currentBrickTextureRef;


        this.currentBlockTypeDisplayText.setText(amountLeft);
        this.cursorBlockDisplay.setTexture(currentBrickTypeTextureRef);

        this.currentBlockTypeDisplay.setTexture(currentBrickTypeTextureRef);
    }
**/

    updateCursorPosition(pos){
        this.cursorBlockDisplay.x = pos.x;
        this.cursorBlockDisplay.y = pos.y;
    }
}


class ImageButton{
    constructor(xPos, yPos, imageRef, gameScene, action){
        let newBtn = gameScene.add.image(xPos, yPos,  imageRef);
        newBtn.setInteractive();
        console.log("btn");
        newBtn.on('pointerdown', () => {

            action();
        });

        newBtn.on('pointerover',function(pointer){
            newBtn.tint = 0x00ffff;
        });
    ﻿


        newBtn.on('pointerout',function(pointer){
            newBtn.tint = -1;
        });


    }
}
