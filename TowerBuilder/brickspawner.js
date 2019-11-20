
const blockTypes = {
    0:"short1",
    1:"short2",
    2:"short3",
    3:"short4",
    4:"tall1",
    5:"tall2",
    6:"tall3",
    7:"tall4",
    8:"bottom-sloped1",
    9:"top-sloped1",
    10: "top-sloped2",
    11:"bottom-sloped2",
    12:"bottom-sloped3",
    13: "top-sloped3",
    14:"top-sloped4",
    15:"bottom-sloped4"
};

let levelBaseBlocks = [
    {"amount":10, "type":"short1"},
    {"amount":10, "type":"short2"},
    {"amount":10, "type":"short3"},
    {"amount":10, "type":"short4"},
    {"amount":10, "type":"tall1"},
    {"amount":10, "type":"tall2"},
    {"amount":10, "type":"tall3"},
    {"amount":10, "type":"tall4"},
    {"amount":10, "type":"bottom-sloped1"},
    {"amount":10, "type":"bottom-sloped2"},
    {"amount":10, "type":"bottom-sloped3"},
    {"amount":10, "type":"bottom-sloped4"},
    {"amount":10, "type":"top-sloped1"},
    {"amount":10, "type":"top-sloped2"},
    {"amount":10, "type":"top-sloped3"},
    {"amount":10, "type":"top-sloped4"}
]
//let availableBlocks = levelBaseBlocks;

// move to brickspawner
let availableBlocks = [
    {"amount":10, "type":"short1"},
    {"amount":10, "type":"short2"},
    {"amount":10, "type":"short3"},
    {"amount":10, "type":"short4"},
    {"amount":10, "type":"tall1"},
    {"amount":10, "type":"tall2"},
    {"amount":10, "type":"tall3"},
    {"amount":10, "type":"tall4"},
    {"amount":10, "type":"bottom-sloped1"},
    {"amount":10, "type":"bottom-sloped2"},
    {"amount":10, "type":"bottom-sloped3"},
    {"amount":10, "type":"bottom-sloped4"},
    {"amount":10, "type":"top-sloped1"},
    {"amount":10, "type":"top-sloped2"},
    {"amount":10, "type":"top-sloped3"},
    {"amount":10, "type":"top-sloped4"}
]



class BrickSpawner {


    // most of this constructor is unessisary, there is some intense coupling with this and the maingame scene.
    // need a way of constructing game objects seperately
    // UI needs its own classes, eg brick placing cursor
    constructor(gameScene, spawnables){
        this.currentBlockType = 0;

        this.spawnables = spawnables;
        this.blockPhysics = gameScene.cache.json.get('brick-physics');

        // use a group here instead of the entire physcis engine
        this.matterRef = gameScene.matter;

    }

    spawnBrickAtLocation(position){
        let posX = position.x;
        let posY = position.y;

        // make sure there is space to spawn one and we arn't off screen
        if(!this.canSpawnBrick(posX, posY)) return;

       // let objectName = availableBlocks[this.currentBlockType].type;
        let objectName = this.getCurrentBlockName();
        let newBrick = this.spawnNewBrick(posX, posY, objectName);
        this.addToSpawnables(newBrick);

        availableBlocks[this.currentBlockType].amount--;
    }

    getCurrentBlockName(){
        return availableBlocks[this.currentBlockType].type;
    }
    getCurrentBlockAmount(){
        return availableBlocks[this.currentBlockType].amount;
    }

    addToSpawnables(newBrick){
        this.spawnables.add(newBrick);
    }

    canSpawnBrick(posX, posY){
        // we may want to manage this state to allow level complete scene
        //if(!this.gameScene.isPlaying) return false;
        if(posY < game.config.height - 150)
        {
            if(availableBlocks[this.currentBlockType].amount > 0){
                return true;
            }

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

    spawnNewBrick(posX, posY, objectName, isStatic){
        //role a colour from the ones available
        let colour = this.roleABlockColour();

        let shape = this.blockPhysics[objectName];
        shape.isStatic = isStatic;

        // work out what the image was called
        let imageReference =  colour + objectName;

        //  create a new brick
        let newBrick = this.matterRef.add.image(posX, posY, imageReference, 0, {shape: shape});
        return newBrick;
    }

    changeBlockType(amount){
        this.currentBlockType = this.currentBlockType + amount;
        if(this.currentBlockType < 0) this.currentBlockType = availableBlocks.length -1;
        if(this.currentBlockType > availableBlocks.length -1) this.currentBlockType = 0;
    }

    resetSelectedBlock(){
        this.currentBlockType = 0;
    }



}
