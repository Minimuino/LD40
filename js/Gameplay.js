Game.Gameplay = function(game)
{
	this.pointer;
	this.girl;
	this.walk_tween;
	this.growth_interval = 5;
	this.sounds = [];
};

Game.Gameplay.prototype =
{
	createGirl: function()
	{
		this.girl = this.add.sprite(200, 90, 'body');

		// Body sprites
		this.girl.addChild(this.make.sprite(0, 0, 'head'));
		this.girl.getChildAt(0).addChild(this.make.sprite(0, 0, 'face'));
		this.girl.inputEnabled = true;
		// Hair sprites
		var arm_left = this.make.sprite(37, 26, 'arm_left', 0);
		arm_left.inputEnabled = true;
		arm_left.events.onInputDown.add(this.removeHair, this);
		this.girl.addChild(arm_left);

		// Move down tween
		var body_down_1 = this.add.tween(this.girl).to( { y: '+5' }, 500, Phaser.Easing.Cubic.Out);
		var body_down_2 = this.add.tween(this.girl).to( { y: '+10' }, 500, Phaser.Easing.Cubic.Out);
		body_down_1.chain(body_down_2);
		// Move up tween
		var body_up_1 = this.add.tween(this.girl).to( { y: '-5' }, 500, Phaser.Easing.Cubic.Out);
		var body_up_2 = this.add.tween(this.girl).to( { y: '-10' }, 500, Phaser.Easing.Cubic.Out);
		body_up_1.chain(body_up_2);
		body_down_2.chain(body_up_1);
		// Start walk animation
		body_up_2.onComplete.add(this.playWalkTween, this);
		this.walk_tween = body_down_1;
		body_down_1.start();

		// Head tween
		// var tween_head = this.add.tween(this.girl.getChildAt(0)).to( { y: '+5' }, 1600, "Cubic", true, 0, -1); // Cubic
		// tween_head.yoyo(true, 0);
	},

	playWalkTween: function()
	{
		this.walk_tween.start();
	},

	removeHair: function(sprite, pointer)
	{
		sprite.frame = Math.max(sprite.frame - 1, 0);
	},

	growHair: function()
	{
		var sprite = this.girl.getChildAt(1);
		sprite.frame = Math.min(sprite.frame + 1, sprite.animations.frameTotal - 1);
	},

	create: function()
	{
		var back = this.add.sprite(0, 0, 'background');

		this.createGirl();
		this.pointer = this.add.sprite(0, 0, 'tweezers', 0);

		this.sounds.push(this.add.audio('ambient', 1, true));
		this.sounds[0].play();

		// Hair growth timer
		this.timer = this.time.events.loop(Phaser.Timer.SECOND * this.growth_interval, this.growHair, this);
	},

	update: function()
	{
		this.pointer.x = this.input.activePointer.x - 6;
		this.pointer.y = this.input.activePointer.y - 6;
		if (this.input.activePointer.isDown)
		{
			this.pointer.frame = 1;
		}
		else
		{
			this.pointer.frame = 0;
		}
	}
};
