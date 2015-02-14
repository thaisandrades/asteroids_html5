var AsteroidsGame = AsteroidsGame || {};

AsteroidsGame.GameCongratsState = function (game) {
    //this.result = 'Toque para iniciar o jogo!';
};

AsteroidsGame.GameCongratsState.prototype = {
    preload: function(score) {
    var score = score || 0;
    //this.highestScore = this.highestScore || 0;

    //this.highestScore = Math.max(score, this.highestScore);

    this.highestScore = window.localStorage.getItem('high_score');

    },
    create: function() {
    //show the space tile, repeated
    this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');
    
    //give it speed in Y
    this.background.autoScroll(0, 20);

    //start game text
    var text = "Parabéns! Você sobreviveu!\n Toque para iniciar um novo jogo";
    var style = { font: "25px Arial", fill: "#fff", align: "center" };
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