var AsteroidsGame = AsteroidsGame || {};

AsteroidsGame.InitialState = function (game) {
    this.result = 'Toque para iniciar o jogo!';

};

AsteroidsGame.InitialState.prototype = {
    preload: function(score) {

    this.load.audio('explosion', 'assets/explosion.ogg');
    this.game.load.image('space', 'assets/starfield.png');

    var score = score || 0;
    this.highestScore = this.highestScore || 0;

    this.highestScore = Math.max(score, this.highestScore);
    },
    create: function() {
    //show the space tile, repeated
    this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');
    
    //give it speed in Y
    this.background.autoScroll(0, 20);

    //start game text
    var text = "Toque para iniciar";
    var style = { font: "30px Arial", fill: "#fff", align: "center" };
    var t = this.game.add.text(this.game.width/2, this.game.height/2, text, style);
    t.anchor.set(0.5);

    //highest score
    text = "Highest score: "+this.highestScore;
    style = { font: "15px Arial", fill: "#fff", align: "center" };
  
    var h = this.game.add.text(this.game.width/2, this.game.height/2 + 50, text, style);
    h.anchor.set(0.5);
    },
    update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('GameState');
    }
  }
}