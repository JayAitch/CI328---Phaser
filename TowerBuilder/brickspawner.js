
class BrickSpawner {


    // most of this constructor is unessisary, there is some intense coupling with this and the maingame scene.
    // need a way of constructing game objects seperately
    // UI needs its own classes, eg brick placing cursor
    constructor(gameScene){
        this.currentBlockType = 0;
        this.gameScene = gameScene;
        this.pointer = gameScene.input.activePointer;//this.input.activePointer;
        this.blockPhysics = gameScene.cache.json.get('brick-physics');

        // use a group here instead of the entire physcis engine
        this.matterRef = gameScene.matter;
        this.displayCurrentBrickType();

    }


    updateBrickCursorPosition(){
        let pointerX = this.pointer.x;
        let pointerY = this.pointer.y;
        this.gameScene.GUI.cursorBlockDisplay.x = pointerX;
        this.gameScene.GUI.cursorBlockDisplay.y = pointerY;
        this.gameScene.GUI.cursorBlockDisplay.setTint(0x0f0fff);
    }

    spawnBrickAtCursorLocation(){
        let pointerX = this.pointer.x;
        let pointerY = this.pointer.y;

        // make sure there is space to spawn one and we arn't off screen
        if(!this.canSpawnBrick(pointerX, pointerY)) return;

        let objectName = blockTypes[this.currentBlockType];
        this.spawnNewBrick(pointerX, pointerY, objectName);
    }


    canSpawnBrick(posX, posY){
        if(posY < game.config.height - 150)
        {
            return true;
        }
        return false;
    }

    roleABlockColour(){
        // get these values from somwhere
        // potentially store a collection somewhere when loading them
        // consider using a single brick asset (white) and running a mask over it
        let colours = ["black","blue","green"];
        let colourNumber =  Math.random() * 3;
        colourNumber = Math.trunc(colourNumber);
        return colours[colourNumber];
    }

    spawnNewBrick(posX, posY, objectName){
        //role a colour from the ones available
        let colour = this.roleABlockColour();

        let shape = this.blockPhysics[objectName];

        // work out what the image was called
        let imageReference =  colour + objectName;
        //  create a new brick
        // this should be done with a group instead
        let newBrick = this.matterRef.add.image(posX, posY, imageReference, 0, {shape: shape});
        this.gameScene.spawnables.add(newBrick);
    }

    changeBlockType(amount){
        this.currentBlockType = this.currentBlockType + amount;
        if(this.currentBlockType < 0) this.currentBlockType = Object.keys(blockTypes).length -1;
        if(this.currentBlockType > Object.keys(blockTypes).length -1) this.currentBlockType = 0;
        this.displayCurrentBrickType();
    }

    displayCurrentBrickType(){

        let currentBrickTypeInt = this.currentBlockType;
        let currentBrickTypeTextureRef = "blue" + blockTypes[currentBrickTypeInt];

        this.gameScene.GUI.currentBlockTypeDisplay.setTexture(currentBrickTypeTextureRef);
        // this.image(blockTypes[this.currentBlockType]);
        this.gameScene.GUI.cursorBlockDisplay.setTexture(currentBrickTypeTextureRef);

    }
    onUpdate(){

    }

}