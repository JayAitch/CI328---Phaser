class MenuScene extends Phaser.Scene {
    

    constructor () {
        super('menuscene');
    }
  
    create ()  {

        this.add.image(400, 300, 'sky');
        const playBtn = this.add.text(100, 100, 'Play', { fill: '#000' });
        playBtn.setInteractive();     
        playBtn.on('pointerdown', () => { this.playgame(); });
    }
    
    update(){

    }
    playgame(){
        // play the main game, this may need to be the level loader scene instead when we go to modifying levels with tile data
        this.scene.start("maingame");
    }

}