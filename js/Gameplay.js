Game.Gameplay = function(game)
{
	this.pointer;
	this.girl;
	this.walk_tween;
	this.growth_interval = 3;
	this.sprites_to_grow;
	this.crits;
	this.sounds = {};
};

Game.Gameplay.prototype =
{
	createGirl: function()
	{
		this.girl = this.add.sprite(200, 85, 'body');

		// Body sprites
		var head = this.make.sprite(0, 0, 'head', 0);
		var head_anim = head.animations.add('wind', [0, 1], 5, true);
		head_anim.play('wind');
		this.girl.addChild(head);
		this.girl.getChildAt(0).addChild(this.make.sprite(0, 0, 'face'));
		this.girl.inputEnabled = true;
		// Hair sprites
		var arm_left = this.make.sprite(37, 26, 'arm_left', 0);
		arm_left.inputEnabled = true;
		arm_left.events.onInputDown.add(this.removeHair, this);
		this.girl.addChild(arm_left);
		var arm_right = this.make.sprite(327, 371, 'arm_right', 0);
		arm_right.inputEnabled = true;
		arm_right.events.onInputDown.add(this.removeHair, this);
		this.girl.addChild(arm_right);
		var armpit_left = this.make.sprite(117, 211, 'armpit_left', 0);
		armpit_left.inputEnabled = true;
		armpit_left.events.onInputDown.add(this.removeHair, this);
		this.girl.addChild(armpit_left);
		var armpit_right = this.make.sprite(304, 239, 'armpit_right', 0);
		armpit_right.inputEnabled = true;
		armpit_right.events.onInputDown.add(this.removeHair, this);
		this.girl.addChild(armpit_right);
		var eyebrow = this.make.sprite(217, 76, 'eyebrow', 0);
		eyebrow.inputEnabled = true;
		eyebrow.events.onInputDown.add(this.removeHair, this);
		this.girl.addChild(eyebrow);
		var moustache = this.make.sprite(210, 122, 'moustache', 0);
		moustache.inputEnabled = true;
		moustache.events.onInputDown.add(this.removeHair, this);
		this.girl.addChild(moustache);
		var pubis = this.make.sprite(191, 429, 'pubis', 0);
		pubis.inputEnabled = true;
		pubis.events.onInputDown.add(this.removeHair, this);
		this.girl.addChild(pubis);

		this.sprites_to_grow = [1, 2, 3, 4, 5, 6, 7];

		// Move down tween
		var body_down_1 = this.add.tween(this.girl).to( { y: '+4' }, 400, Phaser.Easing.Cubic.Out);
		var body_down_2 = this.add.tween(this.girl).to( { y: '+8' }, 400, Phaser.Easing.Cubic.Out);
		body_down_1.chain(body_down_2);
		// Move up tween
		var body_up_1 = this.add.tween(this.girl).to( { y: '-4' }, 400, Phaser.Easing.Cubic.Out);
		var body_up_2 = this.add.tween(this.girl).to( { y: '-8' }, 400, Phaser.Easing.Cubic.Out);
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

	create: function()
	{
		var back = this.add.sprite(0, 0, 'background');

		this.crits = this.add.group();
		this.createGirl();
		this.pointer = this.add.sprite(0, 0, 'tweezers', 0);

		this.sounds['ambient'] = this.add.audio('ambient', 1, true);
		this.sounds['pick_hair'] = this.add.audio('pick_hair', 1, false);
		this.sounds['ambient'].play();

		// Hair growth timer
		this.timer = this.time.events.loop(Phaser.Timer.SECOND * this.growth_interval, this.growHair, this);
		this.time.events.add(Phaser.Timer.SECOND * 3, this.createCrit, this);

		// Fade in
		this.camera.flash('#000000');
	},

	playWalkTween: function()
	{
		this.walk_tween.start();
	},

	removeHair: function(sprite, pointer)
	{
		if (sprite.frame <= 0)
			return;

		var child_index = this.girl.getChildIndex(sprite);
		sprite.frame -= 1;
		var found = this.sprites_to_grow.find(function(value) { return value === child_index; });
		if (!found)
		{
			this.sprites_to_grow.push(child_index);
		}
		this.sounds['pick_hair'].play();
	},

	growHair: function()
	{
		//console.log(this.sprites_to_grow);
		// Rand select in this.sprites_to_grow (the only hair sprites available)
		if (this.sprites_to_grow.length === 0)
			return;
		var index = Game.rand(0, this.sprites_to_grow.length - 1);
		var child_index = this.sprites_to_grow[index];

		// Increase frame number
		var sprite = this.girl.getChildAt(child_index);
		sprite.frame = Math.min(sprite.frame + 1, sprite.animations.frameTotal - 1);

		// Remove sprite from list if it reached its maximum
		if (sprite.frame === sprite.animations.frameTotal - 1)
		{
			this.sprites_to_grow.splice(index, 1);
		}
	},

	createCrit: function()
	{
		function createBubble(crit)
		{
			var bubble = crit.addChild(this.make.sprite(0, 0, 'bubble'));
			bubble.anchor.x = 0.5;
			bubble.anchor.y = 0.5;
			var bub_tween = this.add.tween(bubble).to( { y: '+6' }, 600, Phaser.Easing.Linear.Out, true, 0, -1);
			bub_tween.yoyo(true, 0);
		};

		var index = Game.rand(1, 3);
		index = 1;																							// Remove
		var name = 'cr_0' + index + '_body';
		var crit = this.crits.create(0, 0, name);
		crit.x = Game.WIDTH;
		crit.y = Game.rand(crit.height, Game.HEIGHT);
		crit.addChild(this.make.sprite(0, 0, 'cr_0' + index + '_face', 0));
		var crit_anim = crit.getChildAt(0).animations.add('wind', [0, 1, 2, 3], 1, true);					// Remove
		crit_anim.play('wind');																				// Remove

		// Input
		crit.inputEnabled = true;
		crit.events.onInputDown.add(this.destroyCrit, this);

		// Z-sorting of crits group
		// Must do a trick with Y value in order to sort properly
		crit.y -= crit.height;
		this.crits.sort('y', Phaser.Group.SORT_ASCENDING);
		crit.y += crit.height;

		// Move up tween
		var show = this.add.tween(crit).to( { x: '-'+(crit.width-100), y: '-'+crit.height }, 240, Phaser.Easing.Linear.Out);
		show.onComplete.add(createBubble, this, crit);
		show.start();
	},

	destroyCrit: function(sprite, pointer)
	{
		// Bubble tween
		var bubble = sprite.getChildAt(1);
		var destroy_tween = this.add.tween(bubble).to( { alpha: 0 }, 100, Phaser.Easing.Linear.Out);
		var scale_tween = this.add.tween(bubble.scale).to( {x: 2, y: 2}, 100, Phaser.Easing.Linear.Out);
		// Move down tween
		var hide_tween = this.add.tween(sprite).to( { x: '+'+(sprite.width-100), y: '+'+sprite.height }, 240, Phaser.Easing.Linear.Out);
		hide_tween.onComplete.add(function(object, tween) { object.destroy() }, this);
		destroy_tween.chain(hide_tween);
		scale_tween.start();
		destroy_tween.start();
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
