
class GUI{

    constructor(gameScene){

        // create a text object to display the score
        this.scoreText = gameScene.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});


        // condense the style out into a config object
        const textStyle = {
            fill: '#000',
            fontFamily: '"Roboto Condensed"',
            fontSize: "50px",
            fontWeight: "bolder"
        };



        let upBtn = gameScene.add.image((game.config.width / 2) + 200, game.config.height - 55, "greenshort1").setScale(2);
        gameScene.add.text((game.config.width / 2) + 200, game.config.height - 75, '>', textStyle);
        upBtn.setInteractive();
        upBtn.on('pointerdown', () => {


            //naughty duplicate code!!!!!!!!!!!!!
            gameScene.brickSpawner.changeBlockType(1);
        });


        let dwnBtn = gameScene.add.image((game.config.width / 2) - 200, game.config.height - 55, "blackshort1").setScale(2);
        gameScene.add.text((game.config.width / 2) - 200, game.config.height - 45, '<', textStyle);
        dwnBtn.setInteractive();
        dwnBtn.on('pointerdown', () => {

            //naughty duplicate code!!!!!!!!!!!!!!!!!
            gameScene.brickSpawner.changeBlockType(-1);
        });


        this.currentBlockTypeDisplay = gameScene.add.image((game.config.width / 2), game.config.height - 55, "blue" + blockTypes[this.currentBlockType]).setScale(1);

        // spawn the cursor block display offscreen, we dont want to see it untill it has the right block
        this.cursorBlockDisplay = gameScene.add.image((game.config.width * 20), game.config.height * 20, "blue" + blockTypes[this.currentBlockType]).setScale(1);

    }

}