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
 
		this.load.image('background', 'assets/image/fondo.png');
 
		this.load.spritesheet('dummy', 'assets/image/dummy.png', 27, 40);
		this.load.spritesheet('body', 'assets/image/corpo.png', 385, 450);
		this.load.spritesheet('head', 'assets/image/cabeza.png', 385, 450);
		this.load.spritesheet('face', 'assets/image/cara.png', 385, 450);
		this.load.spritesheet('tweezers', 'assets/image/pinza.png', 182, 105, 2);
		this.load.spritesheet('arm_left', 'assets/image/br_es.png', 108, 60, 4);

		this.load.audio('ambient', 'assets/sound/ambient.ogg');
	},

	create: function()
	{
		this.state.start('Gameplay');
	}
};
