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


        // create a group to store platforms
        this.platforms = this.physics.add.staticGroup();

        this.cursors = this.input.keyboard.createCursorKeys();  
        
        // scaele the groud playform beyond screen bounds and re calculate physics
        this.platforms.create(400, 568, 'platform').setScale(2).refreshBody();

        // create 3 platforms
        this.platforms.create(600, 400, 'platform');
        this.platforms.create(50, 250, 'platform');
        this.platforms.create(750, 220, 'platform');
        
        
        // create a text object to display the score
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        
        this.spawnPlayer(100, 450);
        this.spawnStars();
        this.createBombGroup();

    }
    
    // creates a bomb group and configures colliders
    createBombGroup(){
        
        this.bombs = this.physics.add.group();

        // make the bombs collide with platforms
        this.physics.add.collider(this.bombs, this.platforms);

        // addin function to handle bomb - player collision
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
        
    }
    
    
    // spawn a new bomb and enable collider
    spawnABomb(){
                    
            // find the closest side of the map to the player 
            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            // create a bomb on the side closest to the player
            this.bomb = this.bombs.create(x, 16, 'bomb');
            
            // loose no velocity on bouncing
            this.bomb.setBounce(1);
            
            // enable collision
            this.bomb.setCollideWorldBounds(true);
            
            // assign a random horizontal velocity and a set verticle veloctiy
            this.bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        
    }
    
    
    // spawn stars and create colliders
    spawnStars(){
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
        
         
        
        
    }
    
    
    // spawn the player
    spawnPlayer(xPos, yPos){

        if(!this.player){
            
            // we need to character to have a collider
            this.player = this.physics.add.sprite(xPos, yPos, 'dude');

            // how much will the player bounce when landing
            this.player.setBounce(0.2);
            this.player.setCollideWorldBounds(true);  
                    

            this.physics.add.collider(this.player, this.platforms);
        }

    }
    
    
    
    
    update(){
        // key listeners applying velocity
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-160);

            this.player.anims.play('dudeleft', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(160);

            this.player.anims.play('duderight', true);

        }
        else
        {
            this.player.setVelocityX(0);

           // this.player.anims.play('dudeturn');
            this.player.anims.play('dudeturn', true);
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
            this.spawnABomb();
        }
    }
    
}