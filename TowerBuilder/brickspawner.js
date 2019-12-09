
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

]
//let availableBlocks = levelBaseBlocks;

// move to brickspawner
let availableBlocks = [

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
q
    spawnBrickAtLocation(position){
        let posX = position.x;
        let posY = position.y;

        // make sure there is space to spawn one and we arn't off screen
        if(!this.canSpawnBrick(posX, posY)){
            Audio.errorSound.play({volume: 0.1});
            return;
        }

       // let objectName = availableBlocks[this.currentBlockType].type;
        let objectName = this.getCurrentBlockName();
        Audio.spawnSound.play();
        let newBrick = this.spawnNewBrick(posX, posY, objectName,false,0);
        this.addToSpawnables(newBrick);

        availableBlocks[this.currentBlockType].amount--;
    }

    getCurrentBlockName(){
        if(availableBlocks[this.currentBlockType])
        return availableBlocks[this.currentBlockType].type;
    }
    getCurrentBlockAmount(){
        if(availableBlocks[this.currentBlockType])
        return availableBlocks[this.currentBlockType].amount;
    }

    addToSpawnables(newBrick){
        this.spawnables.add(newBrick);
    }

    canSpawnBrick(posX, posY){
        // we may want to manage this state to allow level complete scene
        let isSpaceToSpawn = this.isSpaceToSpawnBlock(posX,posY);
   //
        if(isSpaceToSpawn)
        {
            if(availableBlocks[this.currentBlockType].amount > 0 && posY < game.config.height - 120){

                return true;
            }

        }

        return false;
    }


    isSpaceToSpawnBlock(posX, posY){

        let objectName = this.getCurrentBlockName();

        let newRectangle = new Phaser.Geom.Rectangle(posX - (currentBlockCursor.width/2), posY -(currentBlockCursor.height/2) , currentBlockCursor.width,  currentBlockCursor.height);

        // get all bodies currently in the world
        let worldBodies  = this.matterRef.world.engine.world.bodies;

        // go through them
        for(let bodiesIterator = 0; bodiesIterator < worldBodies.length; bodiesIterator++) {

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
        // get these values from somwhere
        // potentially store a collection somewhere when loading them
        // consider using a single brick asset (white) and running a mask over it
        let colours = ["black","blue","green", "red", "white","yellow"];
        let colourNumber =  Math.random() * 6;
        colourNumber = Math.trunc(colourNumber);
        return colours[colourNumber];
    }

    spawnNewBrick(posX, posY, objectName, isStatic, angle){
        //role a colour from the ones available
        let colour = this.roleABlockColour();

        let shape = this.blockPhysics[objectName];
        shape.isStatic = isStatic;

        // work out what the image was called
        let imageReference =  colour + objectName;

        //  create a new brick
        let newBrick = this.matterRef.add.image(posX, posY, imageReference, 0, {shape: shape});
        newBrick.angle = angle;
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
