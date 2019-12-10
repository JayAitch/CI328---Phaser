
let Audio;
let MatterScene;
let MainGameScene;


class AudioPlayer{
    constructor(){
        this.levelCompleteSound = game.sound.add("level-complete");
        this.spawnSound = game.sound.add("place-brick-pop");
        this.errorSound = game.sound.add("error-sound");
        this.uiClick = game.sound.add("ui-click");
    }
    static playSound(soundRef){

    }
}



class GameScene extends Phaser.Scene {
    
    isPlaying = false;
    constructor () {
        super('maingame');
        this.gameStats = new GameScore();
        this.background=[];

    }


    create ()  {

        this.background = this.add.image(240, 600, 'sky');
        this.background2 = this.add.image(-1680, 600, 'sky').setScale(-1,1);
        this.background3 = this.add.image(-3600, 600, 'sky');

		// created simulated physics world at the origin, no physics object can pass these bounds
        this.matter.world.setBounds(0, -100, game.config.width, game.config.height);
        MatterScene = this.matter;
        MainGameScene = this;
        // create a new collision handler
        this.collisionHandler = new CollisionHandler(this);



        this.physicsSpawner = new PhysicsSpawner(this);

        // create any ui graphics
        this.GUI = new GameHUD(this);

        // create keyboard/pointer controls
        this.controller = new Controller(this.physicsSpawner, this.input);
        this.GUI.createButtons(this.controller);



		// create the level spawner + spawn
        this.levelSpawner = new LevelSpawner(this);
        this.isPlaying = true;
        this.updateUI();

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


        this.levelCompleteEmitters = [];
        this.levelCompleteEmitters[0] = levelCompleteParticleRed.createEmitter(emitterConfig);
        this.levelCompleteEmitters[1] = levelCompleteParticleGreen.createEmitter(emitterConfig);
        this.levelCompleteEmitters[2] = levelCompleteParticlePink.createEmitter(emitterConfig);
    }



    completeLevel(){
        Audio.levelCompleteSound.play();
        for(let key in this.levelCompleteEmitters){
            this.levelCompleteEmitters[key].emitParticle();
        }
        this.gameStats.addBlocksUsed(availableBlocks);
        this.physicsSpawner.removeAllSpawnables();
        this.isPlaying = false;

        setTimeout(() => {
            this.scene.launch("LevelCompleteScene");
            this.scene.bringToTop("LevelCompleteScene");
        }, 1000)


    }

    nextLevel(){
        this.levelSpawner.level++;
        if(this.levelSpawner.level >= this.levelSpawner.levels.length) this.levelSpawner.level = 0;
        this.levelSpawner.setCurrentLevel();
        this.triggerLevelLoad();
        this.isPlaying = true;
    }

    replayLevel(){
        this.triggerLevelLoad();
        this.isPlaying = true;
    }

    triggerLevelLoad(){
        this.levelSpawner.loadLevel();
        this.physicsSpawner.resetBricks();
        this.updateUI();
    }

    updateUI(){
        this.GUI.updateUI();
    }

    update() {
        let cloudSpeed = 0.1;
        this.background.x +=cloudSpeed;
        this.background2.x +=cloudSpeed;
        this.background3.x +=cloudSpeed;


        if(this.background2.x >= 2160){
            this.background.x = 240;
            this.background2.x = -1680;
            this.background3.x = -3600;
            console.log("moveds");
        }
        this.GUI.updateCursorPosition(this.controller.getCursorPos())


    }


}

class PhysicsSpawner{

    constructor(gameScene){
        this.gameScene = gameScene;
        this.spawnables = new Phaser.GameObjects.Group(gameScene);
        this.brickSpawner = new BrickSpawner(gameScene, this.spawnables);
        this.munchkinSpawner = new MunchkinSpawner(gameScene, this.spawnables);

    }

    resetBricks(){
        this.brickSpawner.resetSelectedBlock();
    }

    // remove munchkins and bricks set the available blocks to be the levels max
    removeAllSpawnables(){

        let currentSpawnables = this.spawnables.children;
        let amntCurrentSpawnables = currentSpawnables.entries.length;

        for(var currentSpawnableNum = 0; currentSpawnableNum < amntCurrentSpawnables; currentSpawnableNum++){

            let currentSpawnable = currentSpawnables.get(currentSpawnableNum);
            currentSpawnable.destroy();
        }
        // duplicate the array instead of passing by reference
        availableBlocks = JSON.parse(JSON.stringify( levelBaseBlocks ));
        this.munchkinSpawner.currentMunchkins = 0;
        this.gameScene.gameStats.addToCount("resets"); // this is firing on level changes aswell
        this.updateUI()
    }

    spawnBrickAtLocation(pointerPos){
            this.brickSpawner.spawnBrickAtLocation(pointerPos);
            this.updateUI();
    }

    removeLastSpawnable(){
        let currentSpawnables = this.spawnables.children.getArray();
        let amntCurrentSpawnables = currentSpawnables.length;

        if(amntCurrentSpawnables <= 0) return;
        let spawnableToRemove = currentSpawnables[amntCurrentSpawnables - 1];

        if(spawnableToRemove.body.label === "munchkin"){
            this.munchkinSpawner.removeMunchkin(spawnableToRemove);
        }
        else{
            this.brickSpawner.removeBlock(spawnableToRemove);
        }

        this.updateUI();
    }

    changeBlockUp(){
        this.brickSpawner.changeBlockType(1);
        this.updateUI();
    }

    changeBlockDown(){
        this.brickSpawner.changeBlockType(-1);
        this.updateUI();
    }


    updateUI(){
        // we should
        this.gameScene.updateUI();
    }

    spawnMunchkin(){
        this.munchkinSpawner.spawnMunchkin(100,100);
        this.gameScene.gameStats.addToCount("munchkins");
        this.updateUI();
    }
}




baseScore = {"resets":0, "munchkins":0, "blocks-remaining":{}}

class GameScore{
    constructor(gameStats){
        if(gameStats)
        {
            this.gameStats = gameStats;
        }
        else{
            this.resetScore();
        }
    }

    resetScore() {
        this.gameStats = JSON.parse(JSON.stringify( baseScore ));

    }

    addToCount(type){
        this.gameStats[type]++;
    }

    addBlocksUsed(blockJson){
        for (var key in blockJson) {
            if (blockJson.hasOwnProperty(key)) {
                if (levelBaseBlocks.hasOwnProperty(key)) {
                   // let blocksLeft =
                    let baseBlocks = blockJson[key].type;
                    let baseBlocksAmount = levelBaseBlocks[key].amount;
                    let amountRemaining = blockJson[key].amount;
                    this.gameStats["blocks-remaining"][baseBlocks] = amountRemaining;




                }
            }
        }
        console.log(this.gameStats);
    }
}