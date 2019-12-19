// variable to store the level/difficulties base blocks, used by level create so sits outside of the class
let levelBaseBlocks = [

]


// all blocks that the player has available to them, this is used by display elements so sits outside the class
let availableBlocks = [

]



class BrickSpawner {


    constructor(spawnables){
        this.currentBlockType = 0;

        this.spawnables = spawnables;

        // allow the physics shapes to be defined externaly to the code
        this.blockPhysics = MainGameScene.cache.json.get('brick-physics');
    }

    spawnBrickAtLocation(position){
        let posX = position.x;
        let posY = position.y;

        // dont try if its they are clicking on the menu, dont give warning errors when clicking buttons
        if(posY >= 950) return;

        // is there currently space to spawn this
        if(!this.canSpawnBrick(posX, posY)){

            // make sound to  let the player know there has been an issue placing the block
            Audio.errorSound.play({volume: 0.1});
            // dont place
            return;
        }
        // find which block has been selected by the player
        let objectName = this.getCurrentBlockName();

        // make sound to tell the player they have placed it
        Audio.spawnSound.play();

        // actually spawn the brick in game
        let newBrick = this.spawnNewBrick(posX, posY, objectName,false,0);

        // keep track of this inside the spawnables group
        // this is done here so that bricks can be spawned without being added to the group
        this.addToSpawnables(newBrick);

        // reduce the amount of blocks available
        availableBlocks[this.currentBlockType].amount--;
    }

    // find the image that is the currentblock number is refering to
    getCurrentBlockName(){
        if(availableBlocks[this.currentBlockType])
        return availableBlocks[this.currentBlockType].type;
    }

    // find the amount of blocks that is the currentblock number is refering to
    getCurrentBlockAmount(){
        if(availableBlocks[this.currentBlockType])
        return availableBlocks[this.currentBlockType].amount;
    }

    // store the new brick in the spawnables array to allow it to be removed when required
    addToSpawnables(newBrick){
        this.spawnables.add(newBrick);
    }

    canSpawnBrick(posX, posY){

        // make sure the block isnt being spawned inside something else
        let isSpaceToSpawn = this.isSpaceToSpawnBlock(posX,posY);

        if(isSpaceToSpawn)
        {
            // the block has space to spawn but is there enough blocks left
            if(availableBlocks[this.currentBlockType].amount > 0){

                return true;
            }

        }

        return false;
    }


    isSpaceToSpawnBlock(posX, posY){

        // create a rectangle the same size as the current cursor block
        // this is a more accurate and quicker way of doing it over calculating its position from the block body definition
        let newRectangle = new Phaser.Geom.Rectangle(posX - (currentBlockCursor.width/2), posY -(currentBlockCursor.height/2) , currentBlockCursor.width,  currentBlockCursor.height);

        // get all bodies currently in the world
        let worldBodies  = MatterScene.world.engine.world.bodies;


        // go through every body in the current world. Could potentially be restricted to groups of bodys
        for(let bodiesIterator = 0; bodiesIterator < worldBodies.length; bodiesIterator++) {
            // store the current iteration
            let currentBody = worldBodies[bodiesIterator];

            // ignore the levelchange trigger and right bounds box????? whateve it is
            if(currentBody.label !== 'levelChangeTrigger'&& currentBody.label !== 'Rectangle Body') {

                // assign the body as we go through
                let bodyToCheckBounds = currentBody.bounds

                // get the outer bounds of the body, dont actually care about any complex collisions
                let left = bodyToCheckBounds.min.x
                let right = bodyToCheckBounds.max.x
                let top = bodyToCheckBounds.min.y
                let bottom = bodyToCheckBounds.max.y

                // check if our test rectangle intsects
                let doesIntersect = Phaser.Geom.Intersects.RectangleToValues(newRectangle, left, right, top, bottom);

                // an intersection has been found, return false and stop looking
                if (doesIntersect) {

                    return false;
                }
            }
        }
        // no intersections found, there is space to spawn
        return true;
    }


    roleABlockColour(){
        // all blocks are created with a 'random' colour, this makes the game more colourful
        let colours = ["black","blue","green", "red", "white","yellow"];
        let colourNumber =  Math.random() * 6;
        // has to be an 'integer'
        colourNumber = Math.trunc(colourNumber);
        return colours[colourNumber];
    }

    spawnNewBrick(posX, posY, objectName, isStatic, angle){
        //role a colour from the ones available
        let colour = this.roleABlockColour();

        let shape = this.blockPhysics[objectName];
        shape.isStatic = isStatic;

        // work out what the image is called
        let imageReference =  colour + objectName;

        //  create a new brick
        let newBrick = MatterScene.add.image(posX, posY, imageReference, 0, {shape: shape});

        // allow level defined blocks to be placed at angles
        newBrick.angle = angle;
        return newBrick;
    }

    // store the current block as a number, keep the number inbound of the blocks array
    changeBlockType(amount){
        this.currentBlockType = this.currentBlockType + amount;
        if(this.currentBlockType < 0) this.currentBlockType = availableBlocks.length -1;
        if(this.currentBlockType > availableBlocks.length -1) this.currentBlockType = 0;
    }

    // used when reassigning current blocks, prevents attempt to access out of bound blocks after changing levels
    resetSelectedBlock(){
        this.currentBlockType = 0;
    }

    // used to 'undo' block placement
    removeBlock(block){
        let blockType = block.body.label;
        // find which part of our block array reprisents this type of block
        // doing it this way prevents any blocks not defined available blocks being added.
        for(let availableBlock in availableBlocks){
            if(availableBlocks[availableBlock].type === blockType){
                availableBlocks[availableBlock].amount++;
            }
        }
        // destroy the block
        block.destroy();
    }


}
