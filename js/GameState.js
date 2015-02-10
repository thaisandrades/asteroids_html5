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
    var timer;
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
    this.game.load.image('playerParticle', 'assets/player-particle.png');
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

    //sounds
    this.explosionSound = this.game.add.audio('explosion');

    //  Our ships bullets
    bullets = this.game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    //  All 40 of them
    bullets.createMultiple(10, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);

    //  Our player ship
    sprite = this.game.add.sprite(this.game.width/2, this.game.height - 10, 'ship');
    sprite.anchor.set(0.5);

    asteroids_g = this.game.add.group();
    asteroids_g.enableBody = true;

    asteroids_m = this.game.add.group();
    asteroids_m.enableBody = true;

    asteroids_p = this.game.add.group();
    asteroids_p.enableBody = true;

    this.createAsteroids(1, 1, 1);
    
    Loop = this.game.time.create(true);
    Loop.add(Phaser.Timer.SECOND * 15, this.createAsteroids, this);
    Loop.start();
    
    /*for (var i = 0; i < 1; i++)
    {
        var s = asteroids_g.create(this.game.world.randomX, this.game.world.randomY, 'asteroid_g');
        //s.body.collideWorldBounds = true;
        s.body.bounce.set(1);
        s.body.velocity.setTo(Math.random(), 10 + Math.random() * 40);
    }

    for (var i = 0; i < 3; i++)
    {
        var s = asteroids_m.create(this.game.world.randomX, this.game.world.randomY, 'asteroid_m');
        //s.body.collideWorldBounds = true;
        s.body.bounce.set(1);
        s.body.velocity.setTo(Math.random(), 10 + Math.random() * 40);
    }

    for (var i = 0; i < 3; i++)
    {
        var s = asteroids_p.create(this.game.world.randomX, this.game.world.randomY, 'asteroid_p');
        //s.body.collideWorldBounds = true;
        s.body.bounce.set(1);
        s.body.velocity.setTo(Math.random(), 10 + Math.random() * 40);
    }*/
    //this.createAsteroids()
    //this.game.time.events.add(Phaser.Timer.SECOND *20, this.createAsteroids(), this);
    //this.game.time.events.add(Phaser.Timer.SECOND *60, this.createAsteroids(), this);
    //this.game.time.events.loop(Phaser.Timer.SECOND *20, this.createAsteroids(3,3,3), this);
    //timer = this.game.time.create(false);
      
    //  and its physics settings
    this.game.physics.enable(sprite, Phaser.Physics.ARCADE);
    sprite.body.collideWorldBounds = true;
    sprite.body.bounce.set(0);

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
   var gameWidth = this.game.width;
   var RIGHT = 0, LEFT = 1;
    this.game.input.onTap.add(function(e){
        if (Math.floor(e.x/(gameWidth/2)) === LEFT) {
            sprite.body.acceleration.x= 300;
        }
    
        if (Math.floor(e.x/(gameWidth/2)) === RIGHT) {
            sprite.body.acceleration.x= -300;
        }
    });
},
    update: function() {

    this.game.physics.arcade.overlap(asteroids_g, bullets, this.fireGreenAsteroid, null, this);
    this.game.physics.arcade.overlap(asteroids_p, bullets, this.firePurpleAsteroid, null, this);
    this.game.physics.arcade.overlap(asteroids_m, bullets, this.fireBlueAsteroid, null, this);

    this.game.physics.arcade.overlap(asteroids_g, sprite, this.loseLife, null, this);
    this.game.physics.arcade.overlap(asteroids_p, sprite, this.loseLife, null, this);
    this.game.physics.arcade.overlap(asteroids_m, sprite, this.loseLife, null, this);

    this.fireBullet();
 
    this.screenWrap(sprite);

    bullets.forEachExists(this.screenWrap, this);
    },
    loseLife:function(sprite, asteroid){
        if(sprite.alive){
            this.lives-=1;
           this.explosionSound.play();

           //make the sprite explode
           var emitter = this.game.add.emitter(sprite.x, sprite.y, 100);
           emitter.makeParticles('playerParticle');
           emitter.minParticleSpeed.setTo(-200, -200);
           emitter.maxParticleSpeed.setTo(200, 200);
           emitter.gravity = 0;
           emitter.start(true, 1000, null, 100);

           sprite.kill();

           if(this.lives == 0){                          
                sprite.destroy();
                this.game.time.events.add(300, this.gameOver, this);
            }
            else{
               timer = this.time.create(false);
               timer.add(5000, this.reviveSprite, this.context); 
               ////this.timer.loop(100, reviveSprite, this.context);
               timer.start();
               
               this.livesText.text = 'Lives: ' + this.lives;
             }            
        } 
    },
    fireBullet:function(){
    //if ((this.game.time.now > this.bulletTime) && this.sprite.alive)
    if (sprite.alive)
        {            
            bullet = bullets.getFirstExists(false);

            if (bullet)
            {               
                bullet.reset(sprite.body.x + 16, sprite.body.y + 16);
                bullet.lifespan = 200;
                bullet.rotation = sprite.rotation;
                //this.game.physics.arcade.velocityFromRotation(sprite.rotation, 400, bullet.body.velocity);
                this.game.physics.arcade.velocityFromRotation(-(3.1415/2), 700, bullet.body.velocity);

                
                bulletTime = this.game.time.now + 10;
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

        this.explosionSound.play();

        //make the player explode
        var emitter = this.game.add.emitter(asteroid.x, asteroid.y, 100);
        emitter.makeParticles('playerParticle');
        emitter.minParticleSpeed.setTo(-200, -200);
        emitter.maxParticleSpeed.setTo(200, 200);
        emitter.gravity = 0;
        emitter.start(true, 1000, null, 100);

        //  Add and update the score
        this.score += 5;
        this.scoreText.text = 'Score: ' + this.score;
    },
    fireBlueAsteroid:function(asteroid, bullets){
        // Removes the asteroid from the screen
        //bullets.kill();
        asteroid.kill();

        this.explosionSound.play();

        //make the player explode
        var emitter = this.game.add.emitter(asteroid.x, asteroid.y, 100);
        emitter.makeParticles('playerParticle');
        emitter.minParticleSpeed.setTo(-200, -200);
        emitter.maxParticleSpeed.setTo(200, 200);
        emitter.gravity = 0;
        emitter.start(true, 1000, null, 100);

        //  Add and update the score
        this.score += 10;
        this.scoreText.text = 'Score: ' + this.score;
    },
    firePurpleAsteroid:function(asteroid, bullets){
        // Removes the asteroid from the screen
        //bullets.kill();
        asteroid.kill();

        this.explosionSound.play();

        //make the player explode
        var emitter = this.game.add.emitter(asteroid.x, asteroid.y, 100);
        emitter.makeParticles('playerParticle');
        emitter.minParticleSpeed.setTo(-200, -200);
        emitter.maxParticleSpeed.setTo(200, 200);
        emitter.gravity = 0;
        emitter.start(true, 1000, null, 100);

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
  }, createAsteroids:function(){     
            
        console.log('createAsteroids '); 
        
        for (var i = 0; i < 1; i++)
        {
            var s = asteroids_g.create(this.game.world.randomX, this.game.world.randomY, 'asteroid_g');
            //s.body.collideWorldBounds = true;
            s.body.bounce.set(1);
            s.body.velocity.setTo(Math.random(), 10 + Math.random() * 40);
        }

        for (var i = 0; i < 1; i++)
        {
            var s = asteroids_m.create(this.game.world.randomX, this.game.world.randomY, 'asteroid_m');
            //s.body.collideWorldBounds = true;
            s.body.bounce.set(1);
            s.body.velocity.setTo(Math.random(), 10 + Math.random() * 40);
        }

        for (var i = 0; i < 1; i++)
        {
            var s = asteroids_p.create(this.game.world.randomX, this.game.world.randomY, 'asteroid_p');
            //s.body.collideWorldBounds = true;
            s.body.bounce.set(1);
            s.body.velocity.setTo(Math.random(), 10 + Math.random() * 40);
        }
  }
}