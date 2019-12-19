
/**
 * DONE:
 *         +leveltrigger blocking placement
 *         +seperate levels in json
 *         +check for block placement
 *         +new munchkin from kenny
 *         +cap on munchkin volumes
 *         +add sounds
 *         +fix menu screan
 *         +spawn in level complete screen
 *         +HUD layoring and clarity
 *             finetune munchkin physics
 *          particles
 *          undo button
 *       particles
 *           sortout score
 * TODO:

 add level with multiple objectives and dynamic blocks
 keydown issue
 last level -> game finished
 **/

let Audio;
let MatterScene;
let MainGameScene;
let difficulty = 0;
let game;




// Initial scene, used to load any assets required by the loader
class BootScene extends Phaser.Scene {
    constructor() {
        super({key: 'boot'});
    }

    preload() {
        // load all files necessary for the loading screen
        //  game assets will be loaded via parsing assets json
        this.load.json('assets', 'assets/assets.json');
        this.load.image('sky', 'assets/images/sky1.png');
    }

    create() {
        // trigger asset load from json
        this.scene.start('preload');
    }
}



// create sound objects ready for playing
class AudioPlayer{
    constructor(){
        this.levelCompleteSound = game.sound.add("level-complete");
        this.spawnSound = game.sound.add("place-brick-pop");
        this.errorSound = game.sound.add("error-sound");
        this.uiClick = game.sound.add("ui-click");
    }

}


// main game scene, creates all game objects and is the central controller for any game actions
class GameScene extends Phaser.Scene {
    
    isPlaying = false;

    constructor () {
        super('maingame');
        // create a new game score object
        this.gameStats = new GameScore();
    }


    create ()  {
        //simplify class constructions by assigning this to a global
        MatterScene = this.matter;
        MainGameScene = this;

        //screen required 3 background in order to make background panning smooth
        this.background = this.add.image(240, 600, 'sky');
        // inversely scaled background to allow for tiling
        this.background2 = this.add.image(-1680, 600, 'sky').setScale(-1,1);
        this.background3 = this.add.image(-3600, 600, 'sky');

		// created simulated physics world , no physics object can pass these bounds
        this.matter.world.setBounds(0, -100, game.config.width, game.config.height);



        // create a new collision handler to look for triggers
        const collisionHandler = new CollisionHandler();


        // object that controls the actions of spawning new objects into the game at play
        this.physicsSpawner = new PhysicsWorld();

        // create any ui graphics
        this.GUI = new GameHUD();

        // create keyboard/pointer controls
        this.controller = new Controller(this.physicsSpawner, this.input);
        this.GUI.createButtons(this.controller);



		// create the level spawner + spawn
        this.levelSpawner = new LevelSpawner(this);

        // control whether controller takes input
        this.isPlaying = true;
        this.updateUI();

        // set up emitters for level complete fanfaire
        this.setupLevelCompleteEmitters();

    }

    setupLevelCompleteEmitters(){
        const emitterConfig = {
            x: gameCenterX(),
            y: gameCenterY(),
            lifespan:3000,

            alpha:{
                start: 1,
                end:0
            },
            on: false,
            gravityY: 500,
            speedX: { min:-800,max:800},
            speedY: { min:-1000,max:0},
            quantity:15,
            rotate:{ start:0, end:360, ease:400 },
            scale:{start:0.7, end:1}

        }

        let levelCompleteParticleRed = this.add.particles('redshort1');
        let levelCompleteParticleGreen = this.add.particles('greenshort1');
        let levelCompleteParticlePink = this.add.particles('blueshort1');

        // add emitters to an array to allow all to trigger at once
        this.levelCompleteEmitters = [];
        this.levelCompleteEmitters[0] = levelCompleteParticleRed.createEmitter(emitterConfig);
        this.levelCompleteEmitters[1] = levelCompleteParticleGreen.createEmitter(emitterConfig);
        this.levelCompleteEmitters[2] = levelCompleteParticlePink.createEmitter(emitterConfig);
    }



    // trigger the level complete
    completeLevel(){
        // play fanfair sound
        Audio.levelCompleteSound.play();

        // trigger particle emmiters
        for(let key in this.levelCompleteEmitters){
            this.levelCompleteEmitters[key].emitParticle();
        }
        // allow the level complete screen to calculate the blocks used
        this.gameStats.addBlockRemaining(availableBlocks);

        this.isPlaying = false;

        // wait for the fanfair to reach its climax then trigger level finished screen to appear
        setTimeout(() => {
            this.physicsSpawner.removeAllSpawnables();
            this.scene.launch("LevelCompleteScene");
            this.scene.bringToTop("LevelCompleteScene");
        }, 1000)


    }

    // move the player onto the next level and load it
    nextLevel(){
        this.levelSpawner.level++;
        // if we get to the end set player to the first level
        if(this.levelSpawner.level >= this.levelSpawner.levels.length) this.levelSpawner.level = 0;
        this.levelSpawner.setCurrentLevel();
        this.triggerLevelLoad();
        this.isPlaying = true;
    }

    // trigger a reload of the current level
    replayLevel(){
        this.triggerLevelLoad();
        this.isPlaying = true;
    }


    triggerLevelLoad(){
        // load level blocks and avaivailable blocks in
        this.levelSpawner.loadLevel();

        // reset the players current brick so it isnt trying to display one not part of the current blocks array
        this.physicsSpawner.resetBricks();

        // trigger UI update to display blocks of current level
        this.updateUI();
    }

    // trigger a UI update, this gets the UI to pull from the brick spawner
    updateUI(){
        this.GUI.updateUI();
    }

    // called per fram
    update() {
        // move the backgrounds and reset if we have gone past 3 of them
        let cloudSpeed = 0.1;
        this.background.x +=cloudSpeed;
        this.background2.x +=cloudSpeed;
        this.background3.x +=cloudSpeed;
        if(this.background2.x >= 2160){
            this.background.x = 240;
            this.background2.x = -1680;
            this.background3.x = -3600;
        }

        // update display of where the next brick will spawn
        this.GUI.updateCursorPosition(this.controller.getCursorPos())


    }


}

class PhysicsWorld{

    constructor(){
        this.spawnables = new Phaser.GameObjects.Group(MainGameScene);
        this.brickSpawner = new BrickSpawner(this.spawnables);
        this.munchkinSpawner = new MunchkinSpawner(this.spawnables);

    }

    resetBricks(){
        this.brickSpawner.resetSelectedBlock();
    }

    // remove munchkins and bricks set the available blocks to be the levels max
    removeAllSpawnables(){

        let currentSpawnables = this.spawnables.children;
        let amntCurrentSpawnables = currentSpawnables.entries.length;

        // done manually to as iterate will miss some blocks off
        for(var currentSpawnableNum = 0; currentSpawnableNum < amntCurrentSpawnables; currentSpawnableNum++){
            let currentSpawnable = currentSpawnables.get(currentSpawnableNum);
            currentSpawnable.destroy();
        }

        // duplicate the array instead of passing by reference
        availableBlocks = JSON.parse(JSON.stringify( levelBaseBlocks ));
        this.munchkinSpawner.currentMunchkins = 0;
        // add to the calculation of score
        MainGameScene.gameStats.addToCount("resets");
        this.updateUI()
    }

    // spawn a brick and trigger the blocks remaining and cursor tween
    spawnBrickAtLocation(pointerPos){
            this.brickSpawner.spawnBrickAtLocation(pointerPos);
            this.updateUI();
    }

    removeLastSpawnable(){

        // make an array from the groups api
        let currentSpawnables = this.spawnables.children.getArray();
        let amntCurrentSpawnables = currentSpawnables.length;

        // if its empty dont do anything
        if(amntCurrentSpawnables <= 0) return;

        // find what the last thing to be created was
        let spawnableToRemove = currentSpawnables[amntCurrentSpawnables - 1];

        // let the respective spawners control what they do when they remove a block
        if(spawnableToRemove.body.label === "munchkin"){
            this.munchkinSpawner.removeMunchkin(spawnableToRemove);
        }
        else{
            this.brickSpawner.removeBlock(spawnableToRemove);
        }

        // something has changed inform the player through UI update
        this.updateUI();
    }

    // change the block the player has selected and show them its changed
    changeBlockUp(){
        this.brickSpawner.changeBlockType(1);
        this.updateUI();
    }

    changeBlockDown(){
        this.brickSpawner.changeBlockType(-1);
        this.updateUI();
    }

    // all UI updates done through the main game scene
    updateUI(){
        // we should
        MainGameScene.updateUI();
    }

    // spawn munchkin and update score object
    spawnMunchkin(){
        this.munchkinSpawner.spawnMunchkin();
        MainGameScene.gameStats.addToCount("munchkins");
        this.updateUI();
    }
}



// base structor of object used to calculate score
baseScore = {"resets":0, "munchkins":0, "blocks-remaining":{}}

class GameScore{

    // allow for the capacity of a score to be pased in on creation incase the data wants to be serialised
    constructor(gameStats){
        if(gameStats)
        {
            this.gameStats = gameStats;
        }
        else{
            // nothing passsed in so create a base score
            this.resetScore();
        }
    }

    // set the score to be the pase score
    resetScore() {
        // prevent a pass by reference
        this.gameStats = JSON.parse(JSON.stringify( baseScore ));
    }

    // increment a score parameter
    addToCount(type){
        this.gameStats[type]++;
    }

    addBlockRemaining(blockJson){
        for (var key in blockJson) {
            // make sure isnt about to throw an error
            if (blockJson.hasOwnProperty(key)) {

                    let baseBlocks = blockJson[key].type;
                    let amountRemaining = blockJson[key].amount;
                    // assign remaining blocks to allow the score to calculate
                    this.gameStats["blocks-remaining"][baseBlocks] = amountRemaining;

            }
        }

    }
}



// game configuration object
const config = {
    type: Phaser.AUTO,


    width: 1200,
    height: 1100,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    autoRound: false,

    scene: [BootScene, PreloadScene, MenuScene, GameScene, LevelCompleteScene],


    physics: {
        default: 'matter',
        matter: {
            gravity: {y: 1.1}
            //debug: true
        }
    },

};


// load the game only when dom is finished loading
window.addEventListener('load', (event) => {
    main();
});


function main(){
    // launch the game
    game = new Phaser.Game(config);
}
