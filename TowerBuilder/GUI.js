// condense the style out into a config object
const textStyles = {
    "header":{
        fill: '#777',
        fontFamily: "kenvector_future",
        fontSize: "32px",
    },
    "button":{
        fill: '#999',
        fontFamily: "kenvector_future_thin",
        fontSize: "14px",
    }
};

// consider creating these on a seperate scene and managing the block spawner object
class GameHUD {
    // TODO fix coupling issue with this and the brick spawner
    constructor(gameScene) {

        // change GUI to have a display of each of the remaining blocks, control display through pull?
        //dont think we need this anymore
        this.gameScene = gameScene;
        // create a text object to display the score

        this.brickSpawner = gameScene.physicsSpawner.brickSpawner;

        this.currentBlockTypeDisplay = gameScene.add.image(gameCenterX(), game.config.height - 55, "blueshort1");

        this.currentBlockTypeDisplayText = gameScene.add.text(gameCenterX(), game.config.height - 40, '-', textStyles.header);
        // spawn the cursor block display offscreen, we dont want to see it until it has the right block


        this.cursorBlockDisplay = gameScene.add.image((game.config.width * 20), game.config.height * 20, "blue"+ this.brickSpawner.getCurrentBlockName(), 0);

    }


    createButtons(controller) {

        let blockUpAction = function () {
            controller._changeBlockUp();
        };

        let blockUpBtn = new ImageButton(gameCenterX() + 200, game.config.height - 55, "greenshort1", this.gameScene, blockUpAction);


        let blockDownAction = function () {
            controller._changeBlockDown();
        };
        let blockDownBtn = new ImageButton(gameCenterX() - 200, game.config.height - 55, "blackshort1", this.gameScene, blockDownAction);


        let blockResetAction = function () {
            controller._resetBlocks();
        };
        let blockResetBtn = new ImageButton(gameCenterX() - 300, game.config.height - 55, "restart-btn", this.gameScene, blockResetAction);

        let munchkinSpawnAction = function () {
            controller._spawnAMunchkin();
        };
        let munchkinSpawnBtn = new ImageButton(gameCenterX() - 400, game.config.height - 55, "munchkin", this.gameScene, munchkinSpawnAction);

    }

    // control all UI changes here rather than on the spawner
    updateUI() {

        let currentBrickTypeTextureRef = "blue" + this.brickSpawner.getCurrentBlockName();
        this.currentBlockTypeDisplayText.setText(this.brickSpawner.getCurrentBlockAmount());
        this.cursorBlockDisplay.setTexture(currentBrickTypeTextureRef);
        this.currentBlockTypeDisplay.setTexture(currentBrickTypeTextureRef);
    }

    updateCursorPosition(pos) {
        this.cursorBlockDisplay.x = pos.x;
        this.cursorBlockDisplay.y = pos.y;
    }

}




// store this against "levels" construct levels with json? tiled?
class LevelCompleteScene extends Phaser.Scene {


    constructor() {
        super('LevelCompleteScene');
    }
    create () {
        const MainGameScene = this.scene.get('maingame');

        const background =  this.add.image(gameCenterX(), gameCenterY(), 'menu-bg').setScale(6);

        this.createScoreTable(MainGameScene.gameStats.gameStats);



        let levelCompleteText = this.add.text(gameCenterX(), gameCenterY()-250, 'Level Complete', textStyles.header);
        offsetTextByWidth(levelCompleteText);


        let nextLevelAction = ()=>{
            MainGameScene.gameStats.resetScore();
            MainGameScene.nextLevel();
            this.scene.bringToTop("maingame");
        };

        let nextLevelButton = new ImageButton(
            (game.config.width / 2) + 100,
            game.config.height/2  + 200,
            "large-button-white-bg",
            this,
            nextLevelAction,
            "Next Level"
        );

        let resetLevelAction = () => {
            MainGameScene.gameStats.resetScore();
            MainGameScene.replayLevel();
            this.scene.bringToTop("maingame");
        };

        let resetLevelBtn = new ImageButton(
            (game.config.width / 2) - 100,
            game.config.height/2+200,
            "large-button-white-bg",
            this,
            resetLevelAction,
            "Replay"
        );



    }


    createScoreTable(scores){
        let listPosition =  gameCenterY() -200;
        for (var key in scores) {
            if (scores.hasOwnProperty(key)) {
                let scoretext = "" + key + " :  " + scores[key]
                let scoreRow = this.add.text(gameCenterX() -150, listPosition, scoretext, textStyles.button);
                //offsetTextByWidth(scoreRow);
                listPosition = listPosition + 50;
            }
        }
    }

}




class MenuScene extends Phaser.Scene {

    menuScreens = {'main': [], 'instructions': [], 'settings': [], 'credits': [],};
    currentScreen = this.menuScreens.main;

    constructor() {
        super('menuscene');
    }

    create() {

        this.add.image(800, 400, 'sky');
        this.createGenericUI();
        this.setUpMainScreen();
        this.setUpSettingsScreen();
        this.setUpInstructionsScreen();
        this.switchScene();

    }

    createGenericUI() {

        const background = this.add.image(gameCenterX(), gameCenterY(), 'menu-bg').setScale(6);
        let titleText = this.add.text(gameCenterX(), gameCenterY() - 250, 'Munchkin Rescue', textStyles.header);
        offsetTextByWidth(titleText);

        let backBtnAction = () => {
            this.currentScreen = this.menuScreens.main;
            this.switchScene();
        };
        const backButton = new ImageButton(gameCenterX(), gameCenterY() + 250, 'large-button-white-bg', this, backBtnAction, "back");
        this.menuScreens.settings.push(backButton);
        this.menuScreens.instructions.push(backButton);
        this.menuScreens.credits.push(backButton);
    }

    setUpMainScreen() {

        let playBtnAction = () => {
            this.playgame()
        };
        let instructionsBtnAction = () => {
            this.currentScreen = this.menuScreens.instructions
            this.switchScene()
        };

        let settingsBtnAction = () => {
            this.currentScreen = this.menuScreens.settings
            this.switchScene()
        };

        let creditsBtnAction = () => {
            this.currentScreen = this.menuScreens.credits
            this.switchScene()
        };

        const playBtn = new ImageButton(gameCenterX(), gameCenterY() - 75, 'large-button-white-bg', this, playBtnAction, "Play");
        const instructionsBtn = new ImageButton(gameCenterX(), gameCenterY() - 25, 'large-button-white-bg', this, instructionsBtnAction, "Instructions");
        const settingsBtn = new ImageButton(gameCenterX(), gameCenterY() + 25, 'large-button-white-bg', this, settingsBtnAction, "Settings");
        const creditsBtn = new ImageButton(gameCenterX(), gameCenterY() + 75, 'large-button-white-bg', this, creditsBtnAction, "Credits");


        this.menuScreens.main.push(creditsBtn);
        this.menuScreens.main.push(instructionsBtn)
        this.menuScreens.main.push(settingsBtn);
        this.menuScreens.main.push(playBtn)
    }

    setUpSettingsScreen() {


        const difficultyHeader = this.add.text(gameCenterX() - 150, gameCenterY() - 45, 'Difficulty:', textStyles.button);

        let difficultyEasyBtnAction = () => {
            difficulty = 0;
        };

        const difficultyEasy = new ImageButton(gameCenterX() - 50, gameCenterY(), 'small-button-green-bg', this, difficultyEasyBtnAction, "E");

        let difficultyNormalBtnAction = () => {
            difficulty = 1;
        };

        const difficultyNormal = new ImageButton(gameCenterX(), gameCenterY(), 'small-button-yellow-bg', this, difficultyNormalBtnAction, "N");


        let difficultyHardBtnAction = () => {
            difficulty = 2;
        };

        const difficultyHard = new ImageButton(gameCenterX() + 50, gameCenterY(), 'small-button-orange-bg', this, difficultyHardBtnAction, "H");


        this.menuScreens.settings.push(difficultyHeader);
        this.menuScreens.settings.push(difficultyEasy);
        this.menuScreens.settings.push(difficultyNormal);
        this.menuScreens.settings.push(difficultyHard);
    }

    setUpInstructionsScreen(){
    }
    switchScene(){

        let currentScreen = this.currentScreen;

        this.hideAllScreens();
        for(let currentScreenKey in currentScreen){
            let UIObject = currentScreen[currentScreenKey]
            UIObject.visible = true;
            UIObject.active = true;
        }
    }

    hideAllScreens(){

        let allScreens = this.menuScreens;
        for(let currentScreenKey in allScreens){
            let currentScreen = allScreens[currentScreenKey];
            for(let currentUIObjectKey in currentScreen) {
                let UIObject = currentScreen[currentUIObjectKey];
                UIObject.visible = false;
                UIObject.active = false;
                console.log(UIObject);
            }
        }
    }

    update(){

    }
    playgame(){
        // play the main game, this may need to be the level loader scene instead when we go to modifying levels with tile data
        this.scene.start("maingame");
        //this.scene.bringToTop("maingame")
    }

}




class ImageButton {


    constructor(xPos, yPos, imageRef, scene, action, text) {
        this.newBtn = scene.add.image(xPos, yPos, imageRef);
        this.baseTint = -1;

        if (text) {
            this.newTxt = scene.add.text(xPos, yPos, text, textStyles.button);
            // make the text appear in the centre of the button
            offsetTextByHeight(this.newTxt);
            offsetTextByWidth(this.newTxt)
            console.log(this.newTxt);
        }

        this.newBtn.setInteractive();

        this.newBtn.on('pointerdown', () => {
            Audio.uiClick.play();
            action();
        });

        this.newBtn.on('pointerover', (pointer) => {
            this.newBtn.tint = 0xeeeeee;
        });
    ﻿


        this.newBtn.on('pointerout', (pointer) => {
            this.newBtn.tint = this.baseTint;
        });
    }


    // hide and show both text and image components of the button
    set visible(isVisible){
        if(this.newTxt) this.newTxt.visible = isVisible;
        this.newBtn.visible = isVisible;
    }

    set active(isActive){
        if(this.newTxt)this.newTxt.active = isActive;
        this.newBtn.active = isActive;
    }
}


function offsetTextByHeight(text){
    text.y = text.y - (text.height /2)
}

function offsetTextByWidth(text){
    text.x = text.x - (text.width /2)
}