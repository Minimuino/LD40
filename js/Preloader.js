Game.Preloader = function(game)
{

};

Game.Preloader.prototype =
{
    preload: function()
    {
        // this.stage.backgroundColor = '#B4D9E7';
        // this.preloadBar = this.add.sprite((Game.GAME_WIDTH-311)/2,
        //     (Game.GAME_HEIGHT-27)/2, 'preloaderBar');
        // this.load.setPreloadSprite(this.preloadBar);
 
        // this.load.image('background', 'img/background.png');
 
        // this.load.spritesheet('candy', 'img/candy.png', 82, 98);
    },

    create: function()
    {
        this.state.start('Gameplay');
    }
};
