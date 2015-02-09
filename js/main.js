var AsteroidsGame = AsteroidsGame||{};
//AsteroidsGame.game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });
AsteroidsGame.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');
AsteroidsGame.game.state.add('InitialState', AsteroidsGame.InitialState);
AsteroidsGame.game.state.add('GameState', AsteroidsGame.GameState);
AsteroidsGame.game.state.add('GameOverState', AsteroidsGame.GameOverState);

AsteroidsGame.game.state.start('InitialState');
