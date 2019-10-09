class LevelLoader extends Phaser.Scene{
    
    
    
    constructor () {
        super('levelloader');
    }
    
    
    create(){
        
        // this is potentialy going to load everything ion the level so we may need
        // a connection between mobs/scenary and animations - sprite sheets, if there are not very many we can cache them on the initial loader
        // load any animations here rather then in the preload
        this.loadAnimations(this.cache.json.get('animations').playercharacter)

    }
    // THIS ISNT BEING CALLED
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //  potentially move all animation loading here depending on load on the client 
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
        
        // we have finished loading the scene open the main scene
        this.scene.start('maingame');
    }
}