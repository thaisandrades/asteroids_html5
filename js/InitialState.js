var AsteroidsGame = AsteroidsGame || {};

AsteroidsGame.InitialState = function (game) {
    this.result = 'Toque para iniciar o jogo!';

};

AsteroidsGame.InitialState.prototype = {
    preload: function(score) {

    this.load.image('playerParticle', 'assets/player-particle.png');
    this.load.audio('explosion', 'assets/explosion.ogg');
    this.game.load.image('space', 'assets/starfield.png');
    this.game.load.image('playerParticle', 'assets/player-particle.png');

    var score = score || 0;
    //this.highestScore = this.highestScore || 0;

    //this.highestScore = Math.max(score, this.highestScore);
    this.highestScore = 0;
    this.highestScore = window.localStorage.getItem('high_score');
    },
    create: function() {
    //show the space tile, repeated
    this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');
    
    //give it speed in Y
    this.background.autoScroll(0, 20);

    //start game text
    var text = "Toque para iniciar";
    var style = { font: "25px Arial", fill: "#fff", align: "center" };
    var t = this.game.add.text(this.game.width/2, this.game.height/2, text, style);
    t.anchor.set(0.5);
    
     //info game text
    var text = "Mova o celular para os lados \npara fazer sua nave se movimentar.\n Toque na tela para atirar.";
    var style = { font: "15px Arial", fill: "#fff", align: "center" };
    var t = this.game.add.text(this.game.width/2, this.game.height/2+50, text, style);
    t.anchor.set(0.5);

    //highest score
    if(!this.highestScore)
        this.highestScore = 0;
        
    text = "Highest score: "+this.highestScore;
    style = { font: "15px Arial", fill: "#fff", align: "center" };
  
    var h = this.game.add.text(this.game.width/2, this.game.height/2 + 100, text, style);
    h.anchor.set(0.5);
    },
    update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('GameState');
    }
  }
}