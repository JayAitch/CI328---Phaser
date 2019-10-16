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
class GameScene extends Phaser.Scene {
    

    constructor () {
        super('maingame');
        // values to store and display the score
        this.score = 0;
        this.scoreText;
    }

    
    create ()  {

       //   this.loadAnimations(this.cache.json.get('animations').playercharacter)
        // load background
		this.add.image(400, 300, 'sky');

		// created simulated physics world at the origin, no physics object can pass these bounds
        this.matter.world.setBounds(0, 0, game.config.width, game.config.height);


        this.currentBlockType = 0;
        this.pointer = this.input.activePointer;

        // create a text object to display the score
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });


        // place a block at the cursor
        this.input.on('pointerdown', function(event) {
            this.spawnCurrentBlockTypeAtCursorPosition();
        }, this);

        // change the type of block about to be placed
        let keyE = this.input.keyboard.addKey('E');
        keyE.on('down', function(event) {
            this.changeBlockType(1);
            }, this);
        let keyQ = this.input.keyboard.addKey('Q');
        keyQ.on('down', function(event) {
            this.changeBlockType(-1);
            }, this);
    }

    // change the block either up or down
    changeBlockType(amount){
        console.log(this.currentBlockType);
        this.currentBlockType = this.currentBlockType + amount;
        if(this.currentBlockType < 0) this.currentBlockType = Object.keys(blockTypes).length -1;
        if(this.currentBlockType > Object.keys(blockTypes).length -1) this.currentBlockType = 0;


        console.log(this.currentBlockType);
    }

    // use maths random to calculate a colour
    // need substancial cleaning up with respect to the references of the image and there relatioship to bodys
    roleABlockColour(){
        // get these values from somwhere
        // potentially store a collection somewhere when loading them
        let colours = ["black","blue","green"];
        let colourNumber =  Math.random() * 3;
        colourNumber = Math.trunc(colourNumber);
        return colours[colourNumber];
    }

    // get the block type that is currently selected and drop it
    spawnCurrentBlockTypeAtCursorPosition(){
        let blockType = blockTypes[this.currentBlockType];
        this.spawnAtCursorPosition(blockType);
    }


    spawnAtCursorPosition(objectName){

        //role a colour from the ones available
        let colour = this.roleABlockColour();
        let pointerX = this.pointer.x;
        let pointerY = this.pointer.y;

        // store this somewhere
        // get the physics controlling th bricks
        // need substantial cleaning up and creating groups so we can delete them
        let bricktype = this.cache.json.get('brick-physics');
        let shape = bricktype[objectName];

        // work out what the image was called
        let imageReference =  colour + objectName

        //  create a new brick
        let newBrick = this.matter.add.image(pointerX, pointerY, imageReference, 0, {shape: shape});
    }
    
    update() {
    }

    
}