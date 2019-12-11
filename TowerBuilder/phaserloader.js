// handles asset loading through json cached before starting this scene
class PreloadScene extends Phaser.Scene{
    
    constructor(){
        super({ key: 'preload' });

    }
    
    create(){
        Audio = new AudioPlayer();
    }
    
    preload ()
    {
          // start loading all assets defined in the json
        this.loadAssetFromJson(this.cache.json.get('assets'));

        // add background image to the page
        this.add.image(900, 600, 'sky');
        
        // show the player the loading state
        this.createProgressbar();

    }



    
    
    // create a progress bar in the center of the screen and append complete and progress update listeners
    // @number: screen X center
    // @number: screen Y center
    createProgressbar(){
        
        
        // fully loaded size of the progress bar
        let width = 500;
        let height = 50;
        
        // position the bar in the center of the screen
        let xStartpos = gameCenterX() - width / 2;
        let yStartPos = gameCenterY() - height /2;
        
        // create the rectangle
        let borderRect = new Phaser.Geom.Rectangle(
            xStartpos,
            yStartPos,
            width,
            height,
        );
        
        // !!! look this up what is action inside this typwise
        let progressbar = this.add.graphics();

        
        // create a function to update the progress bar
        let updateProgressbar = function(percentComplete)
        {
            progressbar.clear();
            progressbar.fillStyle(0xeeeeee, 1);
            progressbar.fillRect(xStartpos, yStartPos, percentComplete * width, height);
            
        };

        // append listener to loader API to trigger update to bar
        this.load.on('progress', updateProgressbar);
        
        this.load.once('complete', function ()
        {
            //todo: move and test this at the end of on create
            this.scene.start('menuscene');
        }, this);
    }
    
    // TODO: check that its parsable and throw something meaningfull
    // cache all assets referenced in the JSON
    // @json json that for all the assets
    loadAssetFromJson(json){
        
        // start looking for objects from the top of the json
        Object.keys(json).forEach( function(group)
        {
            
            // go through any array found there
            Object.keys(json[group]).forEach(function (key){
                
                // save the value of the current element
                let value = json[group][key];   

                // route different load methods based on group in the json
                // this will be different for each asset type
                // now we can store any property we want against the asset location
                switch(group) {
                    case 'image':
                        this.load[group](key, value);
                        break;

                    case 'audio':
                        this.load[group](key, value);
                        break;

                    case 'spritesheet':
                        this.load[group](key, value[0], value[1]);
                        break;
                        
                    case 'animation':
                      //  this.loadAnimations(key, value)
                        break;

                    case 'bricks':
                        this.loadBricks(key, value);
                        //  this.loadAnimations(key, value)
                        break;
                    default:
                        // code block
                } 
                
            }, this);
        }, this);
        
    }

    loadBricks(brickColour, bricksToLoad){
       // const typeOfBricks = ["Blue","Black"];
        for(let brickPosition = 0; brickPosition < bricksToLoad.length; brickPosition++){

            let currentBrickType = bricksToLoad[brickPosition];
            let fileLocation = `assets/bricks/${brickColour}/${currentBrickType}.png`;


            // potentially add to a collection
            let gameReference = `${brickColour}${currentBrickType}`;
            this.load.image(gameReference, fileLocation);
  //          console.log(fileLocation + "" + gameReference);
        }


    }


    // currently unused, this is how animations would be used
    // see assets/animation.json for an example of how the data format would look
    loadAnimations(json){
        // go through the json
        Object.keys(json).forEach( function(objectKey) {  
            
            // assign the current value
            let animation = json[objectKey];
            
            // is it a single frame animation
            if(animation.frames.frame || animation.frames.frame === 0){
                
                // yes - load the animation from the json data
                this.anims.create({
                    key: objectKey,
                    frames: [animation.frames],
                    frameRate: animation.frameRate,
                });       
                
            }  else {
                
                // multi frame animation - create 
                this.anims.create({
                    key: objectKey,
                    frames: this.anims.generateFrameNumbers(animation.frames.key, animation.frames),
                    frameRate: animation.frameRate,
                    repeat: animation.repeat
                });   
            }
        },this);
        
    }
}