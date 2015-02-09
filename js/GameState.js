var AsteroidsGame = AsteroidsGame || {};

AsteroidsGame.GameState = function (game) {
    //this.result = 'Toque para iniciar o jogo!';
	var sprite;
	var asteroids_g;
	var asteroids_p;
	var asteroids_m;
	var cursors;

	var bullet;
	var bullets;
	var bulletTime = 0;

	var score = 0;
	var lives = 3;
	var scoreText;
	var livesText;
};

AsteroidsGame.GameState.prototype = {

preload: function(score) {
	this.game.load.image('space', 'assets/starfield.png');
    this.game.load.image('bullet', 'assets/bullets3.png');
    this.game.load.image('ship', 'assets/ship3.png');
    //game.load.image('asteroid', 'assets/asteroid1.png');
    this.game.load.image('asteroid_g', 'assets/ast_green_80.png');
    this.game.load.image('asteroid_m', 'assets/ast_blue_50x50.png');
    this.game.load.image('asteroid_p', 'assets/ast_purple_35x35.png');
},
create: function() {

    //  This will run in Canvas mode, so let's gain a little speed and display
    this.game.renderer.clearBeforeRender = false;
    this.game.renderer.roundPixels = true;

    //  We need arcade physics
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //  Enable the QuadTree
    this.game.physics.arcade.skipQuadTree = false;

    //  A spacey background
    this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');
    //give it speed in Y
    this.background.autoScroll(0, 20);

    //  Our ships bullets
    bullets = this.game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    //  All 40 of them
    bullets.createMultiple(40, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);

    //  Our player ship
    sprite = this.game.add.sprite(300, 300, 'ship');
    sprite.anchor.set(0.5);

    asteroids_g = this.game.add.group();
    asteroids_g.enableBody = true;

    asteroids_m = this.game.add.group();
    asteroids_m.enableBody = true;

    asteroids_p = this.game.add.group();
    asteroids_p.enableBody = true;

    for (var i = 0; i < 10; i++)
    {
        var s = asteroids_g.create(this.game.world.randomX, this.game.world.randomY, 'asteroid_g');
        //s.body.collideWorldBounds = true;
        s.body.bounce.set(1);
        s.body.velocity.setTo(Math.random(), 10 + Math.random() * 40);
    }

    for (var i = 0; i < 10; i++)
    {
        var s = asteroids_m.create(this.game.world.randomX, this.game.world.randomY, 'asteroid_m');
        //s.body.collideWorldBounds = true;
        s.body.bounce.set(1);
        s.body.velocity.setTo(Math.random(), 10 + Math.random() * 40);
    }

    for (var i = 0; i < 10; i++)
    {
        var s = asteroids_p.create(this.game.world.randomX, this.game.world.randomY, 'asteroid_p');
        //s.body.collideWorldBounds = true;
        s.body.bounce.set(1);
        s.body.velocity.setTo(Math.random(), 10 + Math.random() * 40);
    }

    //  and its physics settings
    this.game.physics.enable(sprite, Phaser.Physics.ARCADE);
    //sprite.body.collideWorldBounds = true;
    sprite.body.bounce.set(1);

    sprite.body.drag.set(100);
    sprite.body.maxVelocity.set(150);

    //  Game input
    cursors = this.game.input.keyboard.createCursorKeys();
    this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
    this.score = 0;
    this.lives = 3;
    //  The score
    this.scoreText = this.game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });

    //  The lives
    this.livesText = this.game.add.text(16, 45, 'Lives: 3', { fontSize: '32px', fill: '#FFF' });
},
	update: function() {
//game.physics.arcade.collide(sprite, asteroids_green);
    //game.physics.arcade.collide(sprite, asteroids_purple);
    //game.physics.arcade.collide(sprite, asteroids_blue);

    this.game.physics.arcade.overlap(asteroids_g, bullets, this.fireGreenAsteroid, null, this);
    this.game.physics.arcade.overlap(asteroids_p, bullets, this.firePurpleAsteroid, null, this);
    this.game.physics.arcade.overlap(asteroids_m, bullets, this.fireBlueAsteroid, null, this);

    this.game.physics.arcade.overlap(asteroids_g, sprite, this.loseLife, null, this);
    this.game.physics.arcade.overlap(asteroids_p, sprite, this.loseLife, null, this);
    this.game.physics.arcade.overlap(asteroids_m, sprite, this.loseLife, null, this);

    if (cursors.up.isDown)
    {
        //this.game.physics.arcade.accelerationFromRotation(sprite.rotation, 200, sprite.body.acceleration);
        sprite.body.acceleration.y = -300;
    }
    else
    {
        sprite.body.acceleration.set(0);
    }

    if (cursors.left.isDown)
    {
        //sprite.body.angularVelocity = -300;
        sprite.body.acceleration.x= -300;
    }
    else if (cursors.right.isDown)
    {
        //sprite.body.angularVelocity = 300;
        sprite.body.acceleration.x= 300;
    }
    else if (cursors.down.isDown)
    {
        //sprite.body.angularVelocity = 0;
        sprite.body.acceleration.y = 300;        
    }

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {

        this.fireBullet();
    }

    this.screenWrap(sprite);

    bullets.forEachExists(this.screenWrap, this);
	},
	loseLife:function(sprite, asteroid){
		if(sprite.alive){
	       sprite.kill();
	       if(this.lives <= 0){
       			this.game.time.events.add(800, this.gameOver, this);
       		}
       		else{
		       timer = this.time.create(false);
		       timer.add(5000, this.reviveSprite, this.context); 
		       ////this.timer.loop(100, reviveSprite, this.context);
		       timer.start();
			   this.lives-=1;
		       this.livesText.text = 'Lives: ' + this.lives;
      		 }
       		
   		} 
	},
	fireBullet:function(){
	//if ((this.game.time.now > this.bulletTime) && this.sprite.alive)
	if (sprite.alive)
	    {
	    	//alert('bullet?');
	        bullet = bullets.getFirstExists(false);

	        if (bullet)
	        {	            
                bullet.reset(sprite.body.x + 16, sprite.body.y + 16);
	            bullet.lifespan = 2000;
	            bullet.rotation = sprite.rotation;
	            //this.game.physics.arcade.velocityFromRotation(sprite.rotation, 400, bullet.body.velocity);
                this.game.physics.arcade.velocityFromRotation(-(3.1415/2), 400, bullet.body.velocity);

	            
                bulletTime = this.game.time.now + 50;
	        }
	    }
	},
	screenWrap:function(sprite){

	    if (sprite.x < 0)
	    {
	        sprite.x = this.game.width;
	    }
	    else if (sprite.x > this.game.width)
	    {
	        sprite.x = 0;
	    }

	    if (sprite.y < 0)
	    {
	        sprite.y = this.game.height;
	    }
	    else if (sprite.y > this.game.height)
	    {
	        sprite.y = 0;
	    }
	},
	fireGreenAsteroid:function(asteroid, bullets){

	    // Removes the asteroid from the screen
	    //bullets.kill();
	    asteroid.kill();

	    //  Add and update the score
	    this.score += 5;
	    this.scoreText.text = 'Score: ' + this.score;
	},
	fireBlueAsteroid:function(asteroid, bullets){
		// Removes the asteroid from the screen
	    //bullets.kill();
	    asteroid.kill();

	    //  Add and update the score
	    this.score += 10;
	    this.scoreText.text = 'Score: ' + this.score;
	},
	firePurpleAsteroid:function(asteroid, bullets){
	 	// Removes the asteroid from the screen
	    //bullets.kill();
	    asteroid.kill();

	    //  Add and update the score
	    this.score += 15;
	    this.scoreText.text = 'Score: ' + this.score;
	},
	reviveSprite:function(){
		sprite.revive();
	},
	gameOver: function() {    
    //pass it the score as a parameter 
    this.game.state.start('GameOverState', true, false, this.score);
  },
}

/*
function blinkSprite() {
    if (sprite.exists) {
        sprite.kill();
    } else {
        sprite.revive();
    }
}*/