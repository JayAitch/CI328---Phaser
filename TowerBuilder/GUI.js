// consider creating these on a seperate scene and managing the block spawner object
class GUI{
    // TODO fix coupling issue with this and the brick spawner
    //
    constructor(gameScene){

        // change GUI to have a display of each of the remaining blocks, control display through pull?


        // create a text object to display the score
        this.scoreText = gameScene.add.text(16, 16, 'score: 0', {fontSize: '16px', fill: '#000'});
        this.brickSpawner = gameScene.brickSpawner;

        // condense the style out into a config object
        const textStyle = {
            fill: '#000',
            fontFamily: '"Roboto Condensed"',
            fontSize: "50px",
            fontWeight: "bolder"
        };


        // dont like that we are opening a reference on another object to do this
        let upBtn = gameScene.add.image((game.config.width / 2) + 200, game.config.height - 55, "greenshort1").setScale(2);
        gameScene.add.text((game.config.width / 2) + 200, game.config.height - 75, 'A', textStyle);
        upBtn.setInteractive();
        upBtn.on('pointerdown', () => {


            //naughty duplicate code!!!!!!!!!!!!!
            this.brickSpawner.changeBlockType(1);
        });


        let dwnBtn = gameScene.add.image((game.config.width / 2) - 200, game.config.height - 55, "blackshort1").setScale(2);
        gameScene.add.text((game.config.width / 2) - 200, game.config.height - 45, 'D', textStyle);
        dwnBtn.setInteractive();
        dwnBtn.on('pointerdown', () => {

            //naughty duplicate code!!!!!!!!!!!!!!!!!
            this.brickSpawner.changeBlockType(-1);
        });

        let resetBtn = gameScene.add.image((game.config.width / 2) - 300, game.config.height - 55, "blackshort1");
        gameScene.add.text((game.config.width / 2) - 300, game.config.height - 45, 'T', textStyle);
        resetBtn.setInteractive();
        resetBtn.on('pointerdown', () => {

            //naughty duplicate code!!!!!!!!!!!!!!!!!
            gameScene.removeAllSpawnables();
        });

        // this coupling with brick spawner is really bad


        // move this to a class so we can create on for each block type and pass the object type by reference
        this.currentBlockTypeDisplay = gameScene.add.image((game.config.width / 2), game.config.height - 55, "blue" + availableBlocks[this.currentBlockType]).setScale(1);
        this.currentBlockTypeDisplayText = gameScene.add.text((game.config.width / 2), game.config.height - 40, '-', textStyle);

        // spawn the cursor block display offscreen, we dont want to see it untill it has the right block
        this.cursorBlockDisplay = gameScene.add.image((game.config.width * 20), game.config.height * 20, "blue" + availableBlocks[this.currentBlockType]).setScale(1);

    }

    // control all UI changes here rather than on the spawner
    updateUI(){
        let currentBrickTypeInt = this.brickSpawner.currentBlockType;
        let currentBrick = availableBlocks[currentBrickTypeInt];
        let currentBrickTypeTextureRef = "blue" + currentBrick.type;

        this.currentBlockTypeDisplay.setTexture(currentBrickTypeTextureRef);
        this.currentBlockTypeDisplayText.setText(currentBrick.amount);

        this.cursorBlockDisplay.setTexture(currentBrickTypeTextureRef);

        this.currentBlockTypeDisplay.setTexture(currentBrickTypeTextureRef);
    }
}
//TODO: make a button class with image ref