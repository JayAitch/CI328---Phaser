        
class GameScene extends Phaser.Scene {
    

    constructor () {
        super('GameScene');
        // values to store and display the score
        this.score = 0;
        this.scoreText;
    }

    init() {}
    preload () {
        this.load.image('sky', 'assets/sky.png');
		this.load.image('ground', 'assets/platform.png');
		this.load.image('star', 'assets/star.png');
		this.load.image('bomb', 'assets/bomb.png');
        
        // load spritesheet for animations
		this.load.spritesheet('dude', 
			'assets/dude.png',
			{ frameWidth: 32, frameHeight: 48 }
		);
    }
    
    create ()  {

      
        // load background
		this.add.image(400, 300, 'sky');


        // create a group to store platforms
        this.platforms = this.physics.add.staticGroup();

        this.cursors = this.input.keyboard.createCursorKeys();  
        
        // scaele the groud playform beyond screen bounds and re calculate physics
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        // create 3 platforms
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');
        
        
        // create a text object to display the score
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        
        
        //#
        //#
        //#                 player character
        //#
        
        // we need to character to have a collider
        this.player = this.physics.add.sprite(100, 450, 'dude');

        // how much will the player bounce when landing
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        // create animations from spritesheet frames
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        //
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.physics.add.collider(this.player, this.platforms);
        
        
        
        //#
        //#
        //#                 stars
        //#
        
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        // assign random bounce to stars in our collection
        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        
        // add collider
        this.physics.add.collider(this.stars, this.platforms);
        
        // handle the collision overlap with our collectStar method
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        
        
        //#
        //#
        //#                 bombs
        //#       
        this.bombs = this.physics.add.group();

        // make the bombs collide with platforms
        this.physics.add.collider(this.bombs, this.platforms);

        // addin function to handle bomb - player collision
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
    }
    
    update(){
                // key listeners applying velocity
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-330);
        }
    }
    
    // trigger by player overlapping with the star
    collectStar (player, star)
    {
        // disable the star collider bounds
        star.disableBody(true, true);
        
        // add to the score
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
        
        // make sure all the stars are already collected
        if (this.stars.countActive(true) === 0)
        {
            
            // re enable physics collisions on the stars
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);

            });
            
            // find the closest side of the map to the player 
            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            // create a bomb on the side closest to the player
            this.bomb = this.bombs.create(x, 16, 'bomb');
            
            // loose no velocity on bouncing
            this.bomb.setBounce(1);
            // enamble collision
            this.bomb.setCollideWorldBounds(true);
            
            // assign a random horizontal velocity and a set verticle veloctiy
            this.bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

        }
    }

    // called by bom collision
    hitBomb (player, bomb)
    {
        // pause the physics engine ending inputs
        this.physics.pause();
        
        // show the player they are dead
        this.player.setTint(0xff0000);

        // trigger aimation to show dead state
        this.player.anims.play('turn');

        // show the game is over
        this.gameOver = true;
        
        this.scene.start("GameEndScene");
    }

}





class MenuScene extends Phaser.Scene {
    

    constructor () {
        super('MenuScene');
    }

    init() {}
    preload () {
        this.load.image('sky', 'assets/sky.png');
        
    }
    
    create ()  {

        this.add.image(400, 300, 'sky');
        const playBtn = this.add.text(100, 100, 'Play', { fill: '#0f0' });
        playBtn.setInteractive();     
        playBtn.on('pointerdown', () => { this.playgame(); });
    }
    
    update(){

    }
    playgame(){
        this.scene.start("GameScene");
    }

}




class GameEndScene extends Phaser.Scene {
    

    constructor () {
        super('GameEndScene');
    }

    init() {}
    preload () {
        this.load.image('sky', 'assets/sky.png');
        
    }
    
    create ()  {

        this.add.image(400, 300, 'sky');
        const playBtn = this.add.text(100, 100, 'Play Again', { fill: '#0f0' });
        const quitBtn = this.add.text(100, 200, 'Quit', { fill: '#0f0' });
        playBtn.setInteractive();     
        quitBtn.setInteractive();
        quitBtn.on('pointerdown', () => { this.quitgame(); });
        playBtn.on('pointerdown', () => { this.playgame(); });
    }
    
    update(){

    }
    playgame(){
        this.scene.start("GameScene");
    }
     
    quitgame(){
        this.scene.start("MenuScene");
    }

}




    


    // settup game configuration settings
    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene:[MenuScene,GameScene,GameEndScene],
        
        // using the arcade physics engine
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        },
        

    };

	// pass game configuration
    var game = new Phaser.Game(config);

