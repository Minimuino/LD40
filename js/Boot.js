var Game =
{
	// Global variables
	WIDTH: 960,
	HEIGHT: 540,

	// Receives an x position in % and returns the absolute value.
	getX: function(percent)
	{
		return this.WIDTH * (percent/100);
	},
	// Receives an y position in % and returns the absolute value.
	getY: function(percent)
	{
		return this.HEIGHT * (percent/100);
	},
	rand: function(low, high)
	{
		return Math.floor(Math.random()*(high-low+1)+low);
	},

	getChildByName: function (display_object, name)
	{
		var i = 0,
			children = display_object.children,
			child = null;

		for (i = 0; i < children.length; i += 1)
		{
			if (children[i].name === name)
			{
				child = children[i];
				break;
			}
		}
		return child;
	}
};

Game.Boot = function(game) {};

Game.Boot.prototype =
{
	preload: function()
	{
		//this.load.image('preloaderBar', 'assets/image/loading-bar.png');
	},

	create: function()
	{
		this.input.maxPointers = 1;
		// this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		// this.scale.pageAlignVertically = true;
		// this.scale.setScreenSize(true);
		this.state.start('Preloader');
	}
};
