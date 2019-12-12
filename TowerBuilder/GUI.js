// condense the style out into a config object
const textStyles = {
    "header":{
        fill: '#777',
        fontFamily: "kenvector_future",
        fontSize: "48px",
    },
    "button":{
        fill: '#999',
        fontFamily: "kenvector_future_thin",
        fontSize: "32px",
    },
    "list-item":{
        fill: '#222',
        fontFamily: "kenvector_future_thin",
        fontSize: "16px",
    },
    "list-header":{
        fill: '#333',
        fontFamily: "kenvector_future_thin",
        fontSize: "18px",
    }
};
const instructions = {
    "Goal":"get the munkin to the target zone",
    "Hint":"score more points by using fewer blocks / resets",
    "click/touch":" release a block",
    "Q and E/touchcontrolsimage":"change block type",
    "Space /'munchkinbutton'":" to release a munchkin",
    "T /'resetimage'":" to remove start again",
    "R / 'backimage'":" button to remove the last placed block"
}

const HUDBaseDepth = 5000;



 var currentBlockCursor;

// consider creating these on a seperate scene and managing the block spawner object
class GameHUD {
    // TODO fix coupling issue with this and the brick spawner
    constructor(gameScene) {
        // change GUI to have a display of each of the remaining blocks, control display through pull?
        //dont think we need this anymore
        this.gameScene = gameScene;
        // create a text object to display the score

        this.brickSpawner = gameScene.physicsSpawner.brickSpawner;

        let hudBG = gameScene.add.image(gameCenterX(), game.config.height - 55, "hud-bg");
        hudBG.depth  = HUDBaseDepth;

        this.currentBlockTypeDisplay = gameScene.add.image(gameCenterX(), game.config.height - 55, "blueshort1");
        this.currentBlockTypeDisplay.depth = HUDBaseDepth + 1;

        this.currentBlockTypeDisplayText = gameScene.add.text(gameCenterX(), game.config.height - 40, '-', textStyles.header);
        this.currentBlockTypeDisplayText.depth = HUDBaseDepth + 1;
        // spawn the cursor block display offscreen, we dont want to see it until it has the right block


        this.cursorBlockDisplay = gameScene.add.image((game.config.width * 2), game.config.height * 20, "blue"+ this.brickSpawner.getCurrentBlockName(), 0);

        currentBlockCursor = this.cursorBlockDisplay;
        currentBlockCursor.setDepth(HUDBaseDepth - 1);
        this.createCursorTween();

    }



    createCursorTween(){
        this.cursorTween = MainGameScene.tweens.add({
            targets: this.cursorBlockDisplay,
            duration: 100,
            paused: true,
            scale:1.2,
            yoyo:true
        })
    }

    createButtons(controller) {

        let blockUpAction = function () {
            controller._changeBlockUp();
        };

        let blockUpBtn = new ImageButton(gameCenterX() + 150, game.config.height - 55, "right-button", this.gameScene, blockUpAction);
        blockUpBtn.scale = 1.5;

        let blockDownAction = function () {
            controller._changeBlockDown();
        };
        let blockDownBtn = new ImageButton(gameCenterX() - 150, game.config.height - 55, "left-button", this.gameScene, blockDownAction);
        blockDownBtn.scale = 1.5;

        let blockResetAction = function () {
            controller._resetBlocks();
        };
        let blockResetBtn = new ImageButton(gameCenterX() - 300, game.config.height - 55, "small-button-blue-bg", this.gameScene, blockResetAction,"","restart-btn");

        let blockUndoAction = function () {
            controller._undoPlacement();
        };
        let blockUndoBtn = new ImageButton(gameCenterX() + 300, game.config.height - 55, "small-button-blue-bg", this.gameScene, blockUndoAction,"","back-btn");

        let munchkinSpawnAction = function () {
            controller._spawnAMunchkin();
        };
        let munchkinSpawnBtn = new ImageButton(gameCenterX() - 400, game.config.height - 55, "small-button-blue-bg", this.gameScene, munchkinSpawnAction,"", "start-btn");

    }

    // control all UI changes here rather than on the spawner
    updateUI() {
        this.cursorTween.play();
        let currentBrickTypeTextureRef = "blue" + this.brickSpawner.getCurrentBlockName();
        this.currentBlockTypeDisplayText.setText(this.brickSpawner.getCurrentBlockAmount());
        this.currentBlockTypeDisplayText.x = gameCenterX();
        offsetTextByWidth(this.currentBlockTypeDisplayText);
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

        const background =  this.add.image(gameCenterX(), gameCenterY(), 'menu-bg');

        this.createScoreTable(MainGameScene.gameStats.gameStats);



        let levelCompleteText = this.add.text(gameCenterX(), gameCenterY()-350, 'Level Complete', textStyles.header);
        offsetTextByWidth(levelCompleteText);


        let nextLevelAction = ()=>{
            if(!MainGameScene.isPlaying) {
                MainGameScene.gameStats.resetScore();
                MainGameScene.nextLevel();
                this.scene.bringToTop("maingame");
            }
        };

        let nextLevelButton = new ImageButton(
            gameCenterX() + 100,
            gameCenterY()+ 350,
            "large-button-white-bg",
            this,
            nextLevelAction,
            "Next Level"
        );

        let resetLevelAction = () => {
            if(!MainGameScene.isPlaying) {
                MainGameScene.gameStats.resetScore();
                MainGameScene.replayLevel();
                this.scene.bringToTop("maingame");
            }
        };

        let resetLevelBtn = new ImageButton(
            gameCenterX() - 100,
            gameCenterY() + 350,
            "large-button-white-bg",
            this,
            resetLevelAction,
            "Replay"
        );



    }


    createScoreTable(scores){
        let listPosition =  gameCenterY() -100;
        let listOffset = 40;
        let baseScore = 500 * (difficulty + 1);
        let score = baseScore;

        let resets = scores.resets - 1 || 0;
        let munchkinsUsed = scores.munchkins || 0;
        let remainingBlocks = scores["blocks-remaining"] || {};


        let resetPenalty = resets * 200;
        let munchkinPenalty = munchkinsUsed * 100
        let blocksRemainingBonus = this.calculateBonusFromRemainingBlocks(remainingBlocks)


        this.createScoreRow(listPosition, `completion bonus`, baseScore)
        listPosition = listPosition + listOffset;


        this.createScoreRow(listPosition, `resets used ${resets}:`, resetPenalty * -1)
        listPosition = listPosition + listOffset;

         score = score - resetPenalty;

        this.createScoreRow(listPosition, `munchkins used ${munchkinsUsed}:`,munchkinPenalty * -1)
        listPosition = listPosition + listOffset;

         score = score - munchkinPenalty;

        this.createScoreRow(listPosition, `blocks bonus:`, blocksRemainingBonus)
        listPosition = listPosition + listOffset;

        if(score < 0) score = 0
        score = score + blocksRemainingBonus;
        this.createScoreRow(listPosition, `score:`, score)

    }
    calculateBonusFromRemainingBlocks(blocksScore){
        let blocksScoreNumber = 0;
        let pointsPerBlock = 100;
        for(let blocksRemaining in blocksScore){
            blocksScoreNumber += blocksScore[blocksRemaining] * pointsPerBlock;
        }

        return blocksScoreNumber;
    }


    createScoreRow(yPosition, headerText, value){
            this.createScoreHeader(yPosition, headerText);
            this.createScoreValue(yPosition, value);
    }


    createScoreHeader(yPosition, text){
        this.add.text(gameCenterX() -250, yPosition, text, textStyles["list-header"]);
    }

    createScoreValue(yPosition, text){
        this.add.text(gameCenterX() +150, yPosition, text, textStyles["list-item"]);
    }
}




class MenuScene extends Phaser.Scene {

    menuScreens = {'main': [], 'instructions': [], 'settings': [], 'credits': [],};
    currentScreen = this.menuScreens.main;

    constructor() {
        super('menuscene');
    }

    create() {

        this.add.image(900, 600, 'sky');
        this.createGenericUI();
        this.setUpMainScreen();
        this.setUpSettingsScreen();
        this.setUpInstructionsScreen();
        this.switchScene();

    }

    createGenericUI() {

        const background = this.add.image(gameCenterX(), gameCenterY(), 'menu-bg');
        let titleText = this.add.text(gameCenterX(), gameCenterY() - 350, 'Munchkin Rescue', textStyles.header);
        offsetTextByWidth(titleText);

        let backBtnAction = () => {
            this.currentScreen = this.menuScreens.main;
            this.switchScene();
        };
        const backButton = new ImageButton(gameCenterX(), gameCenterY() + 350, 'large-button-white-bg', this, backBtnAction, "back");
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

        const playBtn = new ImageButton(gameCenterX(), gameCenterY() - 150, 'large-button-white-bg', this, playBtnAction, "Play");
        playBtn.scale = 2;

        const instructionsBtn = new ImageButton(gameCenterX(), gameCenterY() - 50, 'large-button-white-bg', this, instructionsBtnAction, "Instructions");
        instructionsBtn.scale = 2;

        const settingsBtn = new ImageButton(gameCenterX(), gameCenterY() + 50, 'large-button-white-bg', this, settingsBtnAction, "Settings");
        settingsBtn.scale = 2;

        const creditsBtn = new ImageButton(gameCenterX(), gameCenterY() + 150, 'large-button-white-bg', this, creditsBtnAction, "Credits");
        creditsBtn.scale = 2;


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

        let yTextPos = gameCenterY() - 200;
        for(let instruction in instructions){
            let textControl = instruction;

            let newInstructionControlText =  this.add.text(gameCenterX() - 200, yTextPos, textControl, textStyles["list-header"]);

            yTextPos+= 25
            let textAction = instructions[instruction];
            let newInstructionText =  this.add.text(gameCenterX() - 200, yTextPos, textAction, textStyles.button);
;
            yTextPos+= 35
            this.menuScreens.instructions.push(newInstructionText);
            this.menuScreens.instructions.push(newInstructionControlText);
        }

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


    constructor(xPos, yPos, imageRef, scene, action, text, buttonIcon) {
        this.newBtn = scene.add.image(xPos, yPos, imageRef);
        this.baseTint = -1;

        if (text) {
            this.newTxt = scene.add.text(xPos, yPos, text, textStyles.button);
            // make the text appear in the centre of the button
            offsetTextByHeight(this.newTxt);
            offsetTextByWidth(this.newTxt);
            this.newTxt.depth = HUDBaseDepth + 2;
        }

        if(buttonIcon){
            this.btnIcon = scene.add.image(xPos, yPos, buttonIcon);
            this.btnIcon.depth = HUDBaseDepth + 2;
        }

        this.newBtn.setInteractive();
        this.newBtn.depth = HUDBaseDepth + 1;


        this.newBtn.on('pointerdown', () => {
            Audio.uiClick.play();
            action();
        });

        this.newBtn.on('pointerover', (pointer) => {
            if(this.btnIcon) this.btnIcon.tint = 0xeeeeee;
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
        if(this.btnIcon) this.btnIcon.visibile = isVisible;

        this.newBtn.visible = isVisible;

    }

    set active(isActive){
        if(this.newTxt)this.newTxt.active = isActive;
        if(this.btnIcon) this.btnIcon.active = isActive;
        this.newBtn.active = isActive;
    }

    set scale(scale){
        if(this.btnIcon) {this.btnIcon.size(scale)};
        this.newBtn.setScale(scale);
    }
}


function offsetTextByHeight(text){
    text.y = text.y - (text.height /2)
}

function offsetTextByWidth(text){
    text.x = text.x - (text.width /2)
}
function gameCenterX ()
{
    return game.config.width / 2;
}
function gameCenterY ()
{
    return game.config.height / 2;
}