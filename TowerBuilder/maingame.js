
let Audio;
let Matter;

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
    

    constructor () {
        super('maingame');
        this.gameStats = new GameScore();

    }


    create ()  {

        this.add.image(800, 400, 'sky');
 //       this.spawnables = new Phaser.GameObjects.Group(this);

		// created simulated physics world at the origin, no physics object can pass these bounds
        this.matter.world.setBounds(0, -100, game.config.width, game.config.height);


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
        this.updateUI();
    }


    completeLevel(){
        Audio.levelCompleteSound.play();
        this.gameStats.addBlocksUsed(availableBlocks);
        this.physicsSpawner.removeAllSpawnables();
        this.scene.launch("LevelCompleteScene");
        this.scene.bringToTop("LevelCompleteScene");
    }

    nextLevel(){
        this.levelSpawner.level++;
        if(this.levelSpawner.level >= this.levelSpawner.levels.length) this.levelSpawner.level = 0;
        this.levelSpawner.setCurrentLevel();
        this.triggerLevelLoad();
    }

    replayLevel(){
        this.triggerLevelLoad();
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
        this.GUI.updateCursorPosition(this.controller.getCursorPos())


        // need a cleaner way of doing this
        //this.brickSpawner.updateBrickCursorPosition()
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
        console.log(currentSpawnables);
        if(amntCurrentSpawnables <= 0) return;

        let spawnableToRemove = currentSpawnables[amntCurrentSpawnables - 1];
        spawnableToRemove.destroy();
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
baseScore = {"resets":0, "munchkins":0, "blocks-used":{}}

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
                    let blocksUsed = baseBlocksAmount - amountRemaining;
                    if(blocksUsed > 0){
                        this.gameStats["blocks-used"][baseBlocks] = blocksUsed;
                    }



                }
            }
        }
        console.log(this.gameStats);
    }
}