// all of the fonts used in the game so they are consistant and can be changed easily
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


// quick access to instruction set, is used to print the instructions screen
const instructions = {
    "Goal":"get the munkin to the target zone",
    "Hint":"score more points by using fewer blocks / resets",
    "click/touch":" release a block",
    "Q and E/touchcontrolsimage":"change block type",
    "Space /'munchkinbutton'":" to release a munchkin",
    "T /'resetimage'":" to remove start again",
    "R / 'backimage'":" button to remove the last placed block"
}
const credits ={
    "art":{
        "Kenny":"munchkin, bricks, button backgrounds CC0 1.0",
        "GDquest":"HUD icons CC0 1.0",
        "Kyzerole":"target CC0 1.0",
        "Bart" : "background (no changes made) CC by 3.0",
        "oglsdl":"arrow (no changes made) CC by 4.0"
    },
    "sounds":{
        "Kenny": "Button clicks CC0 1.0",
        "distillerystudio": "failed placement sound(no changes made) CC by 3.0",
        "LittleRobotSoundFactory":"level finish sound (no changes made) CC by 3.0",
        "greenvwbeetle":"spawn sound CC0 1.0"
    },
    "font":{
        "Kenny":"game font CC0 1.0"
    }

}

// All UI objects will be relative to the overlays depth.
const HUDBaseDepth = 5000;


// poor OOD, quickest way to allow the physics spawner to check the spawn position of a new block
// this object has all the properties we need to check
let currentBlockCursor;

// runtime HUD of the game, adds mobile controls and player feedback
class GameHUD {

    constructor() {
        // get the brick spawner, going to want to access the block that is selected and how many of them there are
        this.brickSpawner = MainGameScene.physicsSpawner.brickSpawner;

        // create the huds main background image
        let hudBG = MainGameScene.add.image(gameCenterX(), game.config.height - 55, "hud-bg");
        // make sure it renders ontop of the game and cursor, but behind buttons
        hudBG.depth  = HUDBaseDepth;

        // create the current block display the middle of the HUD
        this.currentBlockTypeDisplay = MainGameScene.add.image(gameCenterX(), game.config.height - 55, "blueshort1");
        this.currentBlockTypeDisplay.depth = HUDBaseDepth + 1;

        // create the current block amountdisplay the middle of the HUD
        this.currentBlockTypeDisplayText = MainGameScene.add.text(gameCenterX(), game.config.height - 40, '-', textStyles.header);
        this.currentBlockTypeDisplayText.depth = HUDBaseDepth + 1;


        // spawn the cursor block display offscreen, updates to this will change its image and reposition it
        this.cursorBlockDisplay = MainGameScene.add.image(20000, 20000, "blue"+ this.brickSpawner.getCurrentBlockName(), 0);

        currentBlockCursor = this.cursorBlockDisplay;

        // make sure the current block cursor is behind the HUD
        currentBlockCursor.setDepth(HUDBaseDepth - 1);

        // add a tween for action feedback on the cursor
        this.createCursorTween();

    }



    createCursorTween(){
        // tween to create action feedback on the cursor
        this.cursorTween = MainGameScene.tweens.add({
            targets: this.cursorBlockDisplay,
            duration: 100,
            paused: true,
            scale:1.2,
            yoyo:true
        })
    }

    createButtons(controller) {


        // use an anonomous function to create the button action from the controller object
        let blockUpAction = function () {
            controller._changeBlockUp();
        };
        // create the button object, no need for an icon, or UI text
        let blockUpBtn = new ImageButton(
            gameCenterX() + 150,
            game.config.height - 55,
            "right-button",
            MainGameScene,
            blockUpAction
        );
        // use the classes methods to rescale any compound UI objects
        blockUpBtn.scale = 1.5;


        // use an anonomous function to create the button action from the controller object
        let blockDownAction = function () {
            controller._changeBlockDown();
        };
        // create the button object, no need for an icon, or UI text
        let blockDownBtn = new ImageButton(
            gameCenterX() - 150,
            game.config.height - 55,
            "left-button",
            MainGameScene
            , blockDownAction);
        // use the classes methods to rescale any compound UI objects
        blockDownBtn.scale = 1.5;


        // anonomous funciton to reset blocks.
        let blockResetAction = function () {
            controller._resetBlocks();
        };

        // create a new button, the id for the image icon is supplied to overlay that over the button
        // this adds a bigger touch array whilst adding affordance from icons
        let blockResetBtn = new ImageButton(
            gameCenterX() - 300,
            game.config.height - 55,
            "small-button-blue-bg",
            MainGameScene,
            blockResetAction,
            "",
            "restart-btn");

        let blockUndoAction = function () {
            controller._undoPlacement();
        };

        // create iconed button
        let blockUndoBtn = new ImageButton(
            gameCenterX() + 300,
            game.config.height - 55,
            "small-button-blue-bg",
            MainGameScene,
            blockUndoAction,
            "",
            "back-btn"
        );

        // action from controller to spawn munchkin
        let munchkinSpawnAction = function () {
            controller._spawnAMunchkin();
        };
        // create a button with an icon
        let munchkinSpawnBtn = new ImageButton(
            gameCenterX() - 400,
            game.config.height - 55,
            "small-button-blue-bg",
            MainGameScene,
            munchkinSpawnAction,
            "",
            "start-btn");

    }

    // triggered by game actions, allows the UI to inform the player of actions
    updateUI() {

        // trigger the cursor tween when doing an action
        this.cursorTween.play();


        let currentBrickTypeTextureRef = "blue" + this.brickSpawner.getCurrentBlockName();

        // update any blocks used and recenter and ofset the text
        this.currentBlockTypeDisplayText.setText(this.brickSpawner.getCurrentBlockAmount());
        this.currentBlockTypeDisplayText.x = gameCenterX();
        offsetByWidth(this.currentBlockTypeDisplayText);

        // update the UI block texture, if the player has switched blocks this will change
        this.cursorBlockDisplay.setTexture(currentBrickTypeTextureRef);
        this.currentBlockTypeDisplay.setTexture(currentBrickTypeTextureRef);
    }

    updateCursorPosition(pos) {
        this.cursorBlockDisplay.x = pos.x;
        this.cursorBlockDisplay.y = pos.y;
    }

}



// screen to display player score and actions to take them to the next level
class LevelCompleteScene extends Phaser.Scene {


    constructor() {
        super('levelcompletescene');
    }
    create () {
        const background =  this.add.image(gameCenterX(), gameCenterY(), 'menu-bg');
        let level = MainGameScene.levelSpawner.level + 1;
        let lastLevel = MainGameScene.levelSpawner.levels.length;
        let nextButtonText = "Next Level";
        this.createScoreTable(MainGameScene.gameStats.gameStats);



        // if its the last level show the button action properly
        if(level === lastLevel) nextButtonText = "To Title";
        let levelCompleteText = this.add.text(gameCenterX(), gameCenterY()-350, `Level ${level} Complete`, textStyles.header);
        offsetByWidth(levelCompleteText);

        // trigger the next level action
        let nextLevelAction = ()=>{
            // as this scene is perstant this action needs to be restricted to a paused state
            if(!MainGameScene.isPlaying) {
                // trigger score reset and next level
                MainGameScene.gameStats.resetScore();
                MainGameScene.nextLevel();
                this.scene.bringToTop("maingame");
            }
        };

        // create buttons with a background and text for a bigger touch area
        // stored as member to allow text change when last level
        let nextLevelButton = new ImageButton(
            gameCenterX() + 150,
            gameCenterY()+ 350,
            "large-button-white-bg",
            this,
            nextLevelAction,
            nextButtonText
        );

        // rescale the object to improve touch frienlyness
        nextLevelButton.scale = 1.5;

        // annonomous function to reset the level
        let resetLevelAction = () => {
            if(!MainGameScene.isPlaying) {
                // reset score and trigger replay level.
                MainGameScene.gameStats.resetScore();
                MainGameScene.replayLevel();
                this.scene.bringToTop("maingame");
            }
        };

        // create buttons with a background and text for a bigger touch area
        let resetLevelBtn = new ImageButton(
            gameCenterX() - 150,
            gameCenterY() + 350,
            "large-button-white-bg",
            this,
            resetLevelAction,
            "Replay"
        );
        resetLevelBtn.scale = 1.5;


    }


    // this was a bit of a fix to the issues with a playing being unable to recognises changes in their score
    // without this it would be hard for a player to work out the effect reseting etc has on the score
    createScoreTable(scores){
        let listPosition =  gameCenterY() -100;

        // spacing between list rows
        let listOffset = 40;

        // higher base score for higher difficulties
        let baseScore = 500 * (difficulty + 1);
        let score = baseScore;

        // get the score changing stats from the score object
        let resets = scores.resets - 1 || 0;
        let munchkinsUsed = scores.munchkins || 0;
        let remainingBlocks = scores["blocks-remaining"] || {};


        // calculate and display to the player
        let resetPenalty = resets * 200;
        let munchkinPenalty = munchkinsUsed * 100
        let blocksRemainingBonus = this.calculateBonusFromRemainingBlocks(remainingBlocks)

        // show the base score
        this.createScoreRow(listPosition, `completion bonus`, baseScore)
        listPosition = listPosition + listOffset;

        // show the score penalty from resets
        this.createScoreRow(listPosition, `resets used ${resets}:`, resetPenalty * -1)
        listPosition = listPosition + listOffset;

         score = score - resetPenalty;

         // show the score penalty from munchkins
        this.createScoreRow(listPosition, `munchkins used ${munchkinsUsed}:`,munchkinPenalty * -1)
        listPosition = listPosition + listOffset;

         score = score - munchkinPenalty;

         // show the effect of the remaining blocks
        this.createScoreRow(listPosition, `blocks bonus:`, blocksRemainingBonus)
        listPosition = listPosition + listOffset;

        // make sure that the score can never be below 0

        if(score < 0) score = 0
        score = score + blocksRemainingBonus;

        // show the final score
        this.createScoreRow(listPosition, `score:`, score)

    }

    // give 100 points to the player for each block they have remaining
    calculateBonusFromRemainingBlocks(blocksScore){
        let blocksScoreNumber = 0;
        let pointsPerBlock = 100;
        for(let blocksRemaining in blocksScore){
            blocksScoreNumber += blocksScore[blocksRemaining] * pointsPerBlock;
        }

        return blocksScoreNumber;
    }


    // create differntly formatted text objects for the head and value row for the core
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



// menu/ landing screen for the game
class MenuScene extends Phaser.Scene {

    // array to store a collection to represent each page
    menuScreens = {'main': [], 'instructions': [], 'settings': [], 'credits': [],};

    // default to showing the main menu screen
    currentScreen = this.menuScreens.main;

    constructor() {
        super('menuscene');
    }

    create() {

        // create the background and the 'pages' of the menu
        this.add.image(900, 600, 'sky');
        this.createGenericUI();
        this.setUpMainScreen();
        this.setUpSettingsScreen();
        this.setUpInstructionsScreen();
        this.setupCreditsScreen();
        this.switchMenuScreen();

    }

    // create any objects that are consistant across the pages
    createGenericUI() {

        const background = this.add.image(gameCenterX(), gameCenterY(), 'menu-bg');
        let titleText = this.add.text(gameCenterX(), gameCenterY() - 350, 'Munchkin Rescue', textStyles.header);
        offsetByWidth(titleText);

        let backBtnAction = () => {
            this.currentScreen = this.menuScreens.main;
            this.switchMenuScreen();
        };
        const backButton = new ImageButton(
            gameCenterX(),
            gameCenterY() + 350,
            'large-button-white-bg',
            this,
            backBtnAction,
            "back"
        );

        // add back button to the arrays of each screen to show on every page except the main one
        this.menuScreens.settings.push(backButton);
        this.menuScreens.instructions.push(backButton);
        this.menuScreens.credits.push(backButton);
    }

    setUpMainScreen() {

        // setup all the button actions
        // page switch occurs by setting the current page and triggering scene switch
        let playBtnAction = () => {
            this.playMenuButtonClick()
        };
        let instructionsBtnAction = () => {
            this.currentScreen = this.menuScreens.instructions
            this.switchMenuScreen()
        };

        let settingsBtnAction = () => {
            this.currentScreen = this.menuScreens.settings
            this.switchMenuScreen()
        };

        let creditsBtnAction = () => {
            this.currentScreen = this.menuScreens.credits
            this.switchMenuScreen()
        };




        // create the buttons on the main page and rescale to increase the touch area
        const playBtn = new ImageButton(gameCenterX(),
            gameCenterY() - 150,
            'large-button-white-bg',
            this,
            playBtnAction,
            "Play"
        );

        playBtn.scale = 2;

        const instructionsBtn = new ImageButton(
            gameCenterX(), gameCenterY() - 50,
            'large-button-white-bg',
            this, instructionsBtnAction,
            "Instructions"
        );

        instructionsBtn.scale = 2;

        const settingsBtn = new ImageButton(gameCenterX(),
            gameCenterY() + 50,
            'large-button-white-bg',
            this,
            settingsBtnAction,
            "Settings"
        );

        settingsBtn.scale = 2;

        const creditsBtn = new ImageButton(
            gameCenterX(),
            gameCenterY() + 150,
            'large-button-white-bg',
            this,
            creditsBtnAction,
            "Credits"
        );

        creditsBtn.scale = 2;

        // these buttons will only show on the main page
        this.menuScreens.main.push(creditsBtn);
        this.menuScreens.main.push(instructionsBtn)
        this.menuScreens.main.push(settingsBtn);
        this.menuScreens.main.push(playBtn);
    }

    setupCreditsScreen(){

        let yTextPos = gameCenterY() - 200;
        for(let category in credits){
            let categoryText = category;
            let categoryRows = credits[category];

            let newCreditCategoryHeader =  this.add.text(gameCenterX() - 370, yTextPos, categoryText, textStyles["list-header"]);
            yTextPos+= 35

            for(let creditKey in categoryRows){

                let newCrediHeadRow =  this.add.text(gameCenterX() - 350, yTextPos, creditKey, textStyles["list-item"]);
                let newCreditValueRow =  this.add.text(gameCenterX()  -100, yTextPos, categoryRows[creditKey], textStyles["list-item"]);

                yTextPos+= 35
                this.menuScreens.credits.push(newCrediHeadRow);
                this.menuScreens.credits.push(newCreditValueRow);


            }
            yTextPos+= 10
            this.menuScreens.credits.push(newCreditCategoryHeader);

     //       yTextPos+= 25 // offset the instruction from the title
    //        let textAction = instructions[instruction];
     //       let newInstructionText =  this.add.text(gameCenterX() - 200, yTextPos, textAction, textStyles["list-item"]);
   //
             //offset the instruction from others
     //       this.menuScreens.instructions.push(newInstructionText);
    //        this.menuScreens.instructions.push(newInstructionControlText);
        }
    }

    setUpSettingsScreen() {


        const difficultyHeader = this.add.text(gameCenterX() - 150, gameCenterY() -100, 'Difficulty:', textStyles.button);
        // tint of selected difficulty
        const selectedTint = 0x999999;



        // settup button action to change difficulty and feedback via UI changes
        let difficultyEasyBtnAction = () => {
            difficulty = 0;
            difficultyEasy.baseTint = selectedTint;
            difficultyNormal.resetTint();
            difficultyHard.resetTint();
        };

        const difficultyEasy = new ImageButton(gameCenterX() - 75, gameCenterY() , 'small-button-green-bg', this, difficultyEasyBtnAction, "E");
        // start as selected dicciculty
        difficultyEasy.baseTint = selectedTint;
        difficultyEasy.scale = 1.5;

        // settup button action to change difficulty and feedback via UI changes
        let difficultyNormalBtnAction = () => {
            difficulty = 1;
            difficultyEasy.resetTint();
            difficultyNormal.baseTint = selectedTint;
            difficultyHard.resetTint();
        };

        const difficultyNormal = new ImageButton(gameCenterX(), gameCenterY(), 'small-button-yellow-bg', this, difficultyNormalBtnAction, "N");
        difficultyNormal.scale = 1.5;

        // settup button action to change difficulty and feedback via UI changes
        let difficultyHardBtnAction = () => {
            difficulty = 2;
            difficultyEasy.resetTint();
            difficultyNormal.resetTint();
            difficultyHard.baseTint = selectedTint;
        };

        const difficultyHard = new ImageButton(gameCenterX() + 75, gameCenterY(), 'small-button-orange-bg', this, difficultyHardBtnAction, "H");
        difficultyHard.scale = 1.5;

        // add buttons to the screen to show when menu item pressed
        this.menuScreens.settings.push(difficultyHeader);
        this.menuScreens.settings.push(difficultyEasy);
        this.menuScreens.settings.push(difficultyNormal);
        this.menuScreens.settings.push(difficultyHard);
    }


    // create a list of instructions from the collection
    setUpInstructionsScreen(){

        let yTextPos = gameCenterY() - 200;
        for(let instruction in instructions){
            let textControl = instruction;

            let newInstructionControlText =  this.add.text(gameCenterX() - 200, yTextPos, textControl, textStyles["list-header"]);

            yTextPos+= 25 // offset the instruction from the title
            let textAction = instructions[instruction];
            let newInstructionText =  this.add.text(gameCenterX() - 200, yTextPos, textAction, textStyles["list-item"]);
;
            yTextPos+= 35 //offset the instruction from others
            this.menuScreens.instructions.push(newInstructionText);
            this.menuScreens.instructions.push(newInstructionControlText);
        }

    }

    // hide all elements and show all elements part of the current screen
    switchMenuScreen(){

        let currentScreen = this.currentScreen;

        this.hideAllScreens();
        for(let currentScreenKey in currentScreen){
            let UIObject = currentScreen[currentScreenKey]
            UIObject.visible = true;
            UIObject.active = true;
        }
    }

    // hide all of the UI elments inside our screens collection
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

    // trigger the main game to load starting the game
    playMenuButtonClick(){
        this.scene.start("maingame");
    }

}



// class to allow for the simple creation of buttons
// allows buttons to be definied with an action background, icon and text
class ImageButton {

    // final 2 parameters are optional
    constructor(xPos, yPos, imageRef, scene, action, text, buttonIcon) {

        // create the image defined
        this.newBtn = scene.add.image(xPos, yPos, imageRef);
        this.initialTint = -1;

        // if instantiated with text option create a text UI  object
        if (text && text.length > 0) {
            this.newTxt = scene.add.text(xPos, yPos, text, textStyles.button);
            // make the text appear in the centre of the button

            // offset by its height and width in order to centre it in the middle of the button
            offsetByHeight(this.newTxt);
            offsetByWidth(this.newTxt);
            this.newTxt.depth = HUDBaseDepth + 2;
        }

        // create a button icon if instantiated with a reference.
        if(buttonIcon){
            this.btnIcon = scene.add.image(xPos, yPos, buttonIcon);
            this.btnIcon.depth = HUDBaseDepth + 2;
        }

        this.newBtn.setInteractive();
        this.newBtn.depth = HUDBaseDepth + 1;


        // add a call to the defined action to DOM click event
        this.newBtn.on('pointerdown', () => {
            // feedback for button presses
            Audio.uiClick.play();
            action();
        });

        // show the player the click action will be performed on this button
        this.newBtn.on('pointerover', (pointer) => {
            if(this.btnIcon) this.btnIcon.tint = 0xeeeeee;
            this.newBtn.tint = 0xeeeeee;
        });
    ﻿

        // reset the tint to the base one, allow external control for example on settings screen
        this.newBtn.on('pointerout', (pointer) => {
            this.newBtn.tint = this.initialTint;
        });

        return this;
    }


    // hide and show both text and image components of the button
    set visible(isVisible){
        if(this.newTxt) this.newTxt.visible = isVisible;
        if(this.btnIcon) this.btnIcon.visibile = isVisible;

        this.newBtn.visible = isVisible;

    }

    // allow the base tint to be change externaly and propergate to memeber variables
    set baseTint(tint){
        this.initialTint = tint;
        this.newBtn.tint = tint;
    }
    get baseTint(){
        return this.initialTint;
    }


    //disable all components of the button
    set active(isActive){
        if(this.newTxt)this.newTxt.active = isActive;
        if(this.btnIcon) this.btnIcon.active = isActive;
        this.newBtn.active = isActive;
    }

    // rescale all components of the button
    set scale(scale){
        if(this.btnIcon) {this.btnIcon.size(scale)};
        this.newBtn.setScale(scale);
    }

    // reset the tint to no tint
    resetTint(){
        this.baseTint = -1;
        this.newBtn.tint = this.baseTint;
    }
}



// UI helper functions
function offsetByHeight(UIObject){
    UIObject.y = UIObject.y - (UIObject.height /2)
}

function offsetByWidth(UIObject){
    UIObject.x = UIObject.x - (UIObject.width /2)
}
function gameCenterX ()
{
    return game.config.width / 2;
}
function gameCenterY ()
{
    return game.config.height / 2;
}