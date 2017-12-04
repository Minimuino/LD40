Game.Gameplay = function(game)
{
	this.pointer;
	this.background;
	this.girl;
	this.walk_tween;
	this.sprites_to_grow;
	this.crits;  // Crits are angry people that shout at you because of your hair
	this.sounds = {};
	this.crit_slots = [];
	this.crit_slots_database = [
		{ pos: new Phaser.Point(Game.WIDTH, Game.HEIGHT + 120), free: true },
		{ pos: new Phaser.Point(Game.WIDTH, Game.HEIGHT + 10), free: true },
		{ pos: new Phaser.Point(Game.WIDTH, Game.HEIGHT - 100), free: true },
		{ pos: new Phaser.Point(-50, Game.HEIGHT + 120), free: true },
		{ pos: new Phaser.Point(-50, Game.HEIGHT + 10), free: true },
		{ pos: new Phaser.Point(-50, Game.HEIGHT - 100), free: true }
	];
};

Game.Gameplay.prototype =
{
	createGirl: function()
	{
		this.girl = this.add.sprite(240, 85, 'body');

		// Body sprites
		var head = this.make.sprite(0, 0, 'head', 0);
		this.girl.addChild(head);
		this.girl.face = this.make.sprite(0, 0, 'face', 0);
		this.girl.getChildAt(0).addChild(this.girl.face);
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
		var eyebrow = this.make.sprite(219, 78, 'eyebrow', 0);
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

		// Amimations
		this.girl.resetFace = function()
		{
			this.girl.face.frame = 0;
		};
		var head_anim = head.animations.add('wind', [0, 1], 5, true);
		head_anim.play('wind');
		var smile_anim = this.girl.face.animations.add('smile', [1], 1, false);
		var disgust_anim = this.girl.face.animations.add('disgusting', [2], 1, false);
		smile_anim.onComplete.add(this.girl.resetFace, this);
		disgust_anim.onComplete.add(this.girl.resetFace, this);

		// Gameplay parameters
		this.sprites_to_grow = [1, 2, 3, 4, 5, 6, 7];
		this.girl.hair_timer;
		// growth_intervals and hair_stages have to be the same length
		this.girl.growth_intervals = [1, 5, 2, 1, 0.5];
		this.girl.hair_stages = [16, 2, 3, 4, 5];
		this.girl.current_stage = 0;
		this.girl.hair_count = 0;

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
		this.background = this.add.sprite(-100, 0, 'background');
		var background_tween = this.add.tween(this.background).to( { x: '+200' }, 30000, Phaser.Easing.Linear.InOut, true, 0, -1);
		background_tween.yoyo(true, 0);

		this.crits = this.add.group();
		this.createGirl();
		this.pointer = this.add.sprite(0, 0, 'tweezers', 0);

		this.sounds['ambient'] = this.add.audio('ambient', 1, true);
		this.sounds['pick_hair'] = this.add.audio('pick_hair', 0.5, false);
		this.sounds['ambient'].play();

		// Hair growth timer
		this.girl.hair_timer = this.time.events.loop(Phaser.Timer.SECOND * this.girl.growth_intervals[0], this.growHair, this);
		// Auto-crit timer
		//this.time.events.loop(Phaser.Timer.SECOND * 2, this.generateCrit, this);

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
		this.girl.hair_count += 1;
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

	tintWorld: function(tint_delta)
	{
		if (((this.girl.tint <= 0x222222) && (tint_delta < 0)) ||
			((this.girl.tint >= 0xffff00) && (tint_delta > 0)))
			return;
		this.girl.tint += tint_delta;
		this.girl.getChildAt(0).tint += tint_delta;
		this.girl.getChildAt(1).tint += tint_delta;
		this.girl.face.tint += tint_delta;
		this.background.tint += tint_delta;
	},

	createCritSprite: function(x, y, name, index, slot)
	{
		function createBubble(crit)
		{
			var bubble = crit.addChild(this.make.sprite(0, 20, 'bubble', 0));
			bubble.anchor.setTo(0.5, 0.5);
			var bub_tween = this.add.tween(bubble).to( { y: '+6' }, 600, Phaser.Easing.Linear.Out, true, 0, -1);
			bub_tween.yoyo(true, 0);
		};

		// Create sprite
		var crit = this.crits.create(x, y, name);
		if (slot >= 3)
		{
			crit.scale.x *= -1;
		}
		crit.addChild(this.make.sprite(0, 0, 'cr_0' + index + '_face', 0));
		this.crit_slots[slot].free = false;
		crit.crit_slot = slot;

		// Input
		crit.inputEnabled = true;
		crit.events.onInputDown.add(this.destroyCrit, this);

		// Sound
		crit.sounds = {};
		if (index <= 3)
		{
			// It's a woman
			crit.sounds['angry1'] = this.add.audio('woman_angry_3', 0.1, false);
			crit.sounds['angry2'] = this.add.audio('woman_angry_2', 0.1, false);
			crit.sounds['sorry'] = this.add.audio('woman_sorry', 0.1, false);
			crit.sounds['hurt'] = this.add.audio('woman_hurt', 0.1, false);
			crit.sounds['laugh'] = this.add.audio('woman_laugh', 0.1, false);
		}
		else
		{
			// It's a man
			crit.sounds['angry1'] = this.add.audio('man_angry_1', 0.1, false);
			crit.sounds['angry2'] = this.add.audio('man_angry_2', 0.1, false);
			crit.sounds['sorry'] = this.add.audio('man_sorry', 0.1, false);
			crit.sounds['hurt'] = this.add.audio('man_hurt', 0.1, false);
			crit.sounds['laugh'] = this.add.audio('man_laugh', 0.1, false);
		}
		if (slot >= 3)
		{
			crit.sounds['angry1'].play();
			console.log('putas');
		}
		else
			crit.sounds['angry2'].play();

		// Z-sorting of crits group
		// Must do a trick with Y value in order to sort properly
		crit.y -= crit.height;
		this.crits.sort('y', Phaser.Group.SORT_ASCENDING);
		crit.y += crit.height;

		// Move up tween
		var x_sign = (slot >= 3) ? '+' : '-'
		var x_delta = x_sign + (Math.abs(crit.width) - 120);
		var y_delta = '-' + crit.height;
		var show = this.add.tween(crit).to( { x: x_delta, y: y_delta }, 240, Phaser.Easing.Linear.Out);
		show.onComplete.add(createBubble, this, crit);
		show.start();
	},

	destroyCritSprite: function(object, tween)
	{
		if (this.crit_slots[object.crit_slot])
		{
			this.crit_slots[object.crit_slot].free = true;
		}
		object.destroy();
	},

	generateCrit: function()
	{
		// Select sprite and slot
		var index = Game.rand(1, 6);
		var free_slots = this.crit_slots.reduce(function(prev, element, index, arr) { return (element.free) ? prev + 1 : prev; }, 0);
		if (free_slots == 0)
			return;
		var free_slot = Game.rand(1, free_slots);
		var slot = 0;
		for (var i = 0; i < this.crit_slots.length; i += 1)
		{
			if (this.crit_slots[i].free)
			{
				slot += 1;
			}
			if (slot == free_slot)
			{
				slot = i;
				break;
			}
		}
		//console.log(free_slot + ' ' + slot);
		var name = 'cr_0' + index + '_body';
		this.createCritSprite(this.crit_slots[slot].pos.x, this.crit_slots[slot].pos.y, name, index, slot);

		// Girl animation
		this.girl.face.animations.play('disgusting');
	},

	destroyCrit: function(sprite, pointer)
	{
		// Bubble tween
		var bubble = sprite.getChildAt(1);
		var destroy_tween = this.add.tween(bubble).to( { alpha: 0 }, 100, Phaser.Easing.Linear.Out);
		var scale_tween = this.add.tween(bubble.scale).to( {x: 2, y: 2}, 100, Phaser.Easing.Linear.Out);
		// Move down tween
		var x_sign = (sprite.crit_slot >= 3) ? '-' : '+'
		var x_delta = x_sign + (Math.abs(sprite.width) - 120);
		var y_delta = '+' + sprite.height;
		var hide_tween = this.add.tween(sprite).to( { x: x_delta, y: y_delta }, 1900, Phaser.Easing.Linear.Out, false, 800);
		hide_tween.onStart.add(function(object, tween) { object.getChildAt(0).frame = 2; object.sounds['sorry'].play(); }, this);
		hide_tween.onComplete.add(this.destroyCritSprite, this);
		destroy_tween.chain(hide_tween);
		scale_tween.start();
		destroy_tween.start();

		// Other stuff
		sprite.getChildAt(0).frame = 1;
		sprite.sounds['hurt'].play();
		sprite.inputEnabled = false;
		this.tintWorld(0x050505)

		// Girl animation
		this.girl.face.animations.play('smile');
	},

	leaveCrit: function(sprite)
	{
		if (!sprite)
			return;

		// Change bubble sprite to approval
		var bubble = sprite.getChildAt(1);
		bubble.frame = 1;
		// Move side tween
		var x_sign = (sprite.crit_slot >= 3) ? '-' : '+'
		var x_delta = x_sign + (Math.abs(sprite.width) - 120);
		var hide_tween = this.add.tween(sprite).to( { x: x_delta }, 1900, Phaser.Easing.Linear.Out, false, 800);
		hide_tween.onComplete.add(this.destroyCritSprite, this);
		hide_tween.start();

		// Other stuff
		sprite.getChildAt(0).frame = 3;
		sprite.sounds['laugh'].play();
		sprite.inputEnabled = false;
		this.tintWorld(-0x050505);
	},

	computeHairRate: function()
	{
		var count = 0;
		var total = 0;
		for (var i = 1; i < this.girl.children.length; i += 1)
		{
			count += this.girl.getChildAt(i).frame;
			total += this.girl.getChildAt(i).animations.frameTotal - 1;
		}
		return count / total;
	},

	updateSlots: function(n)
	{
		while (this.crit_slots.length != n)
		{
			if (this.crit_slots.length < n)
			{
				this.crit_slots.push(this.crit_slots_database[this.crit_slots.length]);
				this.generateCrit();
			}
			else if (this.crit_slots.length > n)
			{
				this.leaveCrit(this.crits.getRandom());
				this.crit_slots.pop();
			}
		}
	},

	update: function()
	{
		// Update pointer
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

		// Update hair growth interval
		if ((this.girl.hair_count >= this.girl.hair_stages[this.girl.current_stage]) &&
			(this.girl.current_stage < (this.girl.hair_stages.length - 1)))
		{
			this.girl.current_stage += 1;
			this.girl.hair_count = 0;
			this.girl.hair_timer.delay = Phaser.Timer.SECOND * this.girl.growth_intervals[this.girl.current_stage];
		}

		// Update crits
		var hair_rate = this.computeHairRate();
		if (hair_rate < 0.1)
		{
			// No slots
			this.updateSlots(0);
		}
		else if (hair_rate < 0.2)
		{
			// 1 slots
			this.updateSlots(1);
		}
		else if (hair_rate < 0.35)
		{
			// 2 slots
			this.updateSlots(2);
		}
		else if (hair_rate < 0.5)
		{
			// 3 slots
			this.updateSlots(3);
		}
		else if (hair_rate < 0.75)
		{
			// 4 slots
			this.updateSlots(4);
		}
		else if (hair_rate < 0.8)
		{
			// 5 slots
			this.updateSlots(5);
		}
		else if (hair_rate < 0.9)
		{
			// 6 slots
			this.updateSlots(6);
		}
		console.log(hair_rate + ', ' + this.crit_slots.length);
	}
};
