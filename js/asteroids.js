var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('space', 'assets/starfield.png');
    game.load.image('bullet', 'assets/bullets2.png');
    game.load.image('ship', 'assets/ship.png');
    //game.load.image('asteroid', 'assets/asteroid1.png');
    game.load.image('asteroid_green', 'assets/ast_green.png');
    game.load.image('asteroid_blue', 'assets/ast_blue.png');
    game.load.image('asteroid_purple', 'assets/ast_purple.png');

}

var sprite;
var asteroids_green;
var asteroids_purple;
var asteroids_blue;
var cursors;

var bullet;
var bullets;
var bulletTime = 0;

var score = 0;
var lives = 3;
var scoreText;
var livesText;

function create() {

    //  This will run in Canvas mode, so let's gain a little speed and display
    game.renderer.clearBeforeRender = false;
    game.renderer.roundPixels = true;

    //  We need arcade physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  Enable the QuadTree
    game.physics.arcade.skipQuadTree = false;

    //  A spacey background
    game.add.tileSprite(0, 0, game.width, game.height, 'space');

    //  Our ships bullets
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    //  All 40 of them
    bullets.createMultiple(40, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);

    //  Our player ship
    sprite = game.add.sprite(300, 300, 'ship');
    sprite.anchor.set(0.5);
    
    asteroids_green = game.add.group();
    asteroids_green.enableBody = true;

    asteroids_blue = game.add.group();
    asteroids_blue.enableBody = true;

    asteroids_purple = game.add.group();
    asteroids_purple.enableBody = true;

    for (var i = 0; i < 1; i++)
    {
        var s = asteroids_green.create(game.world.randomX, game.world.randomY, 'asteroid_green');
        //s.body.collideWorldBounds = true;
        s.body.bounce.set(1);
        s.body.velocity.setTo(10 + Math.random() * 40, 10 + Math.random() * 40);
    }

    for (var i = 0; i < 1; i++)
    {
        var s = asteroids_blue.create(game.world.randomX, game.world.randomY, 'asteroid_blue');
        //s.body.collideWorldBounds = true;
        s.body.bounce.set(1);
        s.body.velocity.setTo(10 + Math.random() * 40, 10 + Math.random() * 40);
    }

    for (var i = 0; i < 1; i++)
    {
        var s = asteroids_purple.create(game.world.randomX, game.world.randomY, 'asteroid_purple');
        //s.body.collideWorldBounds = true;
        s.body.bounce.set(1);
        s.body.velocity.setTo(10 + Math.random() * 40, 10 + Math.random() * 40);
    }

    //  and its physics settings
    game.physics.enable(sprite, Phaser.Physics.ARCADE);
    //sprite.body.collideWorldBounds = true;
    sprite.body.bounce.set(1);

    sprite.body.drag.set(100);
    sprite.body.maxVelocity.set(150);

    //  Game input
    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    //  The score
    scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });

    //  The lives
    livesText = game.add.text(16, 45, 'Lives: 3', { fontSize: '32px', fill: '#FFF' });
}

function update() {

    //game.physics.arcade.collide(sprite, asteroids_green);
    //game.physics.arcade.collide(sprite, asteroids_purple);
    //game.physics.arcade.collide(sprite, asteroids_blue);

    game.physics.arcade.overlap(asteroids_green, bullets, fireGreenAsteroid, null, this);
    game.physics.arcade.overlap(asteroids_purple, bullets, firePurpleAsteroid, null, this);
    game.physics.arcade.overlap(asteroids_blue, bullets, fireBlueAsteroid, null, this);

    game.physics.arcade.overlap(asteroids_green, sprite, loseLife, null, this);
    game.physics.arcade.overlap(asteroids_purple, sprite, loseLife, null, this);
    game.physics.arcade.overlap(asteroids_blue, sprite, loseLife, null, this);

    if (cursors.up.isDown)
    {
        game.physics.arcade.accelerationFromRotation(sprite.rotation, 200, sprite.body.acceleration);
    }
    else
    {
        sprite.body.acceleration.set(0);
    }

    if (cursors.left.isDown)
    {
        sprite.body.angularVelocity = -300;
    }
    else if (cursors.right.isDown)
    {
        sprite.body.angularVelocity = 300;
    }
    else
    {
        sprite.body.angularVelocity = 0;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
        fireBullet();
    }

    screenWrap(sprite);

    bullets.forEachExists(screenWrap, this);

}

function fireBullet () {

    if (game.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(sprite.body.x + 16, sprite.body.y + 16);
            bullet.lifespan = 2000;
            bullet.rotation = sprite.rotation;
            game.physics.arcade.velocityFromRotation(sprite.rotation, 400, bullet.body.velocity);
            bulletTime = game.time.now + 50;
        }
    }

}

function screenWrap (sprite) {

    if (sprite.x < 0)
    {
        sprite.x = game.width;
    }
    else if (sprite.x > game.width)
    {
        sprite.x = 0;
    }

    if (sprite.y < 0)
    {
        sprite.y = game.height;
    }
    else if (sprite.y > game.height)
    {
        sprite.y = 0;
    }

}

function fireGreenAsteroid (asteroid, bullets) {
    
    // Removes the asteroid from the screen
    //bullets.kill();
    asteroid.kill();

    //  Add and update the score
    score += 5;
    scoreText.text = 'Score: ' + score;

}

function fireBlueAsteroid (asteroid, bullets) {
    
    // Removes the asteroid from the screen
    //bullets.kill();
    asteroid.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}

function firePurpleAsteroid (asteroid, bullets) {
    
    // Removes the asteroid from the screen
    //bullets.kill();
    asteroid.kill();

    //  Add and update the score
    score += 15;
    scoreText.text = 'Score: ' + score;

}

function loseLife(sprite, asteroid) {
   lives-=1;
   livesText.text = 'Lives: ' + score;
    sprite.kill();
    timer = this.time.create(false);
    timer.add(500, reviveSprite, this.context); 
    //this.timer.loop(100, reviveSprite, this.context);
    timer.start();
}

function reviveSprite(){

    sprite.revive();
}

function blinkSprite() {
    if (sprite.exists) {
        sprite.kill();
    } else {
        sprite.revive();
    }
}

function render() {
    //game.debug.quadTree(game.physics.arcade.quadTree);
}