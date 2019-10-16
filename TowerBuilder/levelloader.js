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

}