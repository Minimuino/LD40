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

		// Girl
		this.load.spritesheet('body', 'assets/image/corpo.png', 385, 473);
		this.load.spritesheet('head', 'assets/image/cabeza.png', 384, 473, 2);
		this.load.spritesheet('face', 'assets/image/cara.png', 385, 473);
		// Hair
		this.load.spritesheet('arm_left', 'assets/image/pelo/br_es.png', 108, 60, 4);
		this.load.spritesheet('arm_right', 'assets/image/pelo/br_der.png', 45, 77, 4);
		this.load.spritesheet('armpit_left', 'assets/image/pelo/ax_es.png', 34, 39, 3);
		this.load.spritesheet('armpit_right', 'assets/image/pelo/ax_der.png', 27, 27, 3);
		this.load.spritesheet('eyebrow', 'assets/image/pelo/entre.png', 19, 13, 3);
		this.load.spritesheet('moustache', 'assets/image/pelo/big.png', 33, 11, 3);
		this.load.spritesheet('pubis', 'assets/image/pelo/pub.png', 78, 17, 3);
		// Pointer
		this.load.spritesheet('tweezers', 'assets/image/pinza.png', 182, 105, 2);

		// People
		this.load.spritesheet('cr_01_body', 'assets/image/criticons/cr_01/cr_01_corpo.png', 382, 332);
		this.load.spritesheet('cr_01_face', 'assets/image/criticons/cr_01/cr_01_enfado.png', 382, 332);
		this.load.spritesheet('cr_02_body', 'assets/image/criticons/cr_02/cr_02_corpo.png', 382, 317);
		this.load.spritesheet('cr_02_face', 'assets/image/criticons/cr_02/cr_02_enfado.png', 382, 317);
		this.load.spritesheet('cr_03_body', 'assets/image/criticons/cr_03/cr_03_corpo.png', 388, 355);
		this.load.spritesheet('cr_03_face', 'assets/image/criticons/cr_03/cr_03_enfado.png', 388, 355);

		// Audio
		this.load.audio('ambient', 'assets/sound/ambient.ogg');
	},

	create: function()
	{
		this.state.start('Gameplay');
	}
};
