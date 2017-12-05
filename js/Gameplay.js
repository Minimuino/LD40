Game.Gameplay = function(game)
{
	this.pointer;
	this.background;
	this.girl;
	this.walk_tween;
	this.sprites_to_grow;
	this.crits;  // Crits are angry people that shout at you because of your hair
	this.sounds = {};
	this.stage = -1;
	this.go_to_stage = undefined;
	this.crit_click_count = 0;
	this.hair_click_count = 0;
	this.text_sprite;
	this.crit_slots = [];
	this.crit_timer;
	this.crit_slots_database = [
		{ pos: new Phaser.Point(Game.WIDTH, Game.HEIGHT + 120), free: true },
		{ pos: new Phaser.Point(-50, Game.HEIGHT + 120), free: true },
		{ pos: new Phaser.Point(Game.WIDTH, Game.HEIGHT + 10), free: true },
		{ pos: new Phaser.Point(-50, Game.HEIGHT + 10), free: true },
		{ pos: new Phaser.Point(Game.WIDTH, Game.HEIGHT - 100), free: true },
		{ pos: new Phaser.Point(-50, Game.HEIGHT - 100), free: true },
		{ pos: new Phaser.Point(Game.WIDTH, Game.HEIGHT + 240), free: true },
		{ pos: new Phaser.Point(-50, Game.HEIGHT + 240), free: true }
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
		var armpit_left = this.make.sprite(117, 211, 'armpit_left', 2);
		armpit_left.inputEnabled = true;
		armpit_left.events.onInputDown.add(this.removeHair, this);
		this.girl.addChild(armpit_left);
		var armpit_right = this.make.sprite(304, 239, 'armpit_right', 2);
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
		var head_anim = head.animations.add('wind', [0, 1, 2, 3, 4, 5, 6], 6, true);
		head_anim.play('wind');
		var smile_anim = this.girl.face.animations.add('smile', [1], 1, false);
		var disgust_anim = this.girl.face.animations.add('disgusting', [2], 1, false);
		smile_anim.onComplete.add(this.girl.resetFace, this);
		disgust_anim.onComplete.add(this.girl.resetFace, this);

		// Gameplay parameters
		this.sprites_to_grow = [1, 2, 3, 4, 5, 6, 7];
		this.girl.hair_timer;
		this.girl.growth_intervals = [99, 7, 4, 2];
		/*
		this.girl.hair_stages = [16, 2, 3];
		this.girl.current_stage = 0;
		this.girl.hair_count = 0;
		*/

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
		this.background = this.add.sprite(-460, 0, 'background');
		var background_tween = this.add.tween(this.background).to( { x: '+460' }, 50000, Phaser.Easing.Linear.InOut, true, 0, -1);
		background_tween.yoyo(true, 0);

		this.crits = this.add.group();
		this.createGirl();

		this.sounds['ambient'] = this.add.audio('ambient', 1, true);
		this.sounds['pick_hair'] = this.add.audio('pick_hair', 0.5, false);
		this.sounds['ambient'].play();

		// Auto-crit timer
		// this.crit_timer = this.time.events.loop(Phaser.Timer.SECOND * 2, this.generateCrit, this);

		// Fade in
		this.camera.flash('#000000');

		// Disable input for a little while
		this.input.enabled = false;
		this.time.events.add(Phaser.Timer.SECOND * 10, this.startStage0, this);
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

		// Leave crit
		if (this.stage != 0 && this.crits)
			this.leaveCrit(this.crits.getFirstAlive());

		// Stage progress
		this.hair_click_count += 1;
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
		if ((this.girl.tint <= 0x222222) && (tint_delta < 0))
		{
			this.showHelp();
			this.girl.tint = 0xffffff;
			this.girl.getChildAt(0).tint = 0xffffff;
			this.girl.face.tint = 0xffffff;
			return;
		}

		if ((this.girl.tint >= 0xffffff) && (tint_delta > 0))
		{
			return;
		}
		if (this.text_sprite)
		{
			return;
		}
		if (this.girl.tint >= 0xdfdfdf && (tint_delta > 0))
		{
			return;
		}

		this.girl.tint += tint_delta;
		this.girl.getChildAt(0).tint += tint_delta;
		this.girl.face.tint += tint_delta;
		// this.background.tint += tint_delta;
	},

	createCritSprite: function(x, y, name, index, slot, show_delay)
	{
		// Create sprite
		var crit = this.crits.create(x, y, name);
		if (slot % 2 == 1)
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

		crit.alive = false;

		if (!show_delay)
			this.showCrit(crit);
		else
			this.time.events.add(Phaser.Timer.SECOND * show_delay, this.showCrit, this, crit);
	},

	destroyCritSprite: function(object, tween)
	{
		if (this.crit_slots[object.crit_slot])
		{
			this.crit_slots[object.crit_slot].free = true;
		}
		object.destroy();
	},

	showCrit: function(crit)
	{
		function createBubble(crit)
		{
			crit.bubble = crit.addChild(this.make.sprite(0, 20, 'bubble', 0));
			crit.bubble.anchor.setTo(0.5, 0.5);
			var bub_tween = this.add.tween(crit.bubble).to( { y: '+6' }, 600, Phaser.Easing.Linear.Out, true, 0, -1);
			bub_tween.yoyo(true, 0);
		};

		if (!crit)
			return;

		crit.alive = true;

		// Z-sorting of crits group
		// Must do a trick with Y value in order to sort properly
		crit.y -= crit.height;
		this.crits.sort('y', Phaser.Group.SORT_ASCENDING);
		crit.y += crit.height;

		// Play sound
		if (crit.crit_slot % 2 == 1)
			crit.sounds['angry1'].play();
		else
			crit.sounds['angry2'].play();

		// Move up tween
		var x_sign = (crit.crit_slot % 2 == 1) ? '+' : '-'
		var x_delta = x_sign + (Math.abs(crit.width) - 120);
		var y_delta = '-' + crit.height;
		var show = this.add.tween(crit).to( { x: x_delta, y: y_delta }, 240, Phaser.Easing.Linear.Out);
		show.onComplete.add(createBubble, this, crit);
		show.start();

		// Girl animation
		this.girl.face.animations.play('disgusting');
	},

	generateCrit: function(show_delay)
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
		this.createCritSprite(this.crit_slots[slot].pos.x, this.crit_slots[slot].pos.y, name, index, slot, show_delay);
	},

	destroyCrit: function(sprite, pointer)
	{
		if (!sprite)
			return;

		// Bubble tween
		var destroy_tween = this.add.tween(sprite.bubble).to( { alpha: 0 }, 100, Phaser.Easing.Linear.Out);
		var scale_tween = this.add.tween(sprite.bubble.scale).to( {x: 2, y: 2}, 100, Phaser.Easing.Linear.Out);
		// Move down tween
		var x_sign = (sprite.crit_slot % 2 == 1) ? '-' : '+'
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
		sprite.alive = false;
		this.tintWorld(0x202020);

		// Girl animation
		this.girl.face.animations.play('smile');

		// Stage progress
		this.crit_click_count += 1;
	},

	leaveCrit: function(sprite)
	{
		if (!sprite)
			return;

		// Change bubble sprite to approval
		if (sprite.bubble)
			sprite.bubble.frame = 1;
		// Move side tween
		var x_sign = (sprite.crit_slot % 2 == 1) ? '-' : '+'
		var x_delta = x_sign + (Math.abs(sprite.width) - 120);
		var hide_tween = this.add.tween(sprite).to( { x: x_delta }, 1900, Phaser.Easing.Linear.Out, false, 800);
		hide_tween.onComplete.add(this.destroyCritSprite, this);
		hide_tween.start();

		// Other stuff
		sprite.getChildAt(0).frame = 3;
		sprite.sounds['laugh'].play();
		sprite.inputEnabled = false;
		sprite.alive = false;
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

	cleanCrits: function()
	{
		for (var i = 0; i < this.crits.length; i += 1)
		{
			var crit = this.crits.getAt(i);
			if (crit.alive)
			{
				this.leaveCrit(crit);
			}
			else
			{
				if (!crit.bubble)
					this.destroyCritSprite(crit);
			}
		}
	},

	addCritSlot: function()
	{
		this.crit_slots.push(this.crit_slots_database[this.crit_slots.length]);
	},

	updateSlots: function(delay)
	{
		for (var i = 0; i < this.crit_slots.length; i += 1)
		{
			if (this.crit_slots[i].free)
			{
				this.generateCrit(delay * i);
				break;
			}
		}
	},

	showHelp: function()
	{
		this.text_sprite = this.add.sprite(0, 0, 'help', 0);
		this.input.enabled = false;
		this.time.events.add(Phaser.Timer.SECOND * 10, 
			function() { this.text_sprite.destroy(); this.text_sprite = undefined; this.input.enabled = true; }, this);
	},

	showEnding: function()
	{
		this.text_sprite = this.add.sprite(0, 0, 'ending', 0);
		var anim = this.text_sprite.animations.add('default', [0, 1], 0.25, false);
		anim.play('default');
		this.input.enabled = false;
		this.pointer.destroy();
		this.girl.hair_timer.timer.pause();
	},

	startStage0: function()
	{
		function createTweezers()
		{
			this.pointer = this.add.sprite(Game.WIDTH, Game.HEIGHT, 'tweezers', 0);
			var tween1 = this.add.tween(this.pointer).to( { x: Game.WIDTH/3, y: Game.HEIGHT/2 }, 1000, Phaser.Easing.Cubic.InOut);
			var tween2 = this.add.tween(this.pointer.scale).to( {x: 1.3, y: 1.3}, 400, Phaser.Easing.Linear.Out,
				false, 0, 0, true);
			tween2.onComplete.add(function() { this.input.enabled = true; }, this);
			tween1.chain(tween2);
			tween1.start();
		};
		this.stage = 0;
		this.addCritSlot();
		this.generateCrit();
		this.time.events.add(Phaser.Timer.SECOND * 2, createTweezers, this);	
	},

	startStage1: function()
	{
		this.stage = 1;

		// Create 3 new crit slots
		var base_delay = this.girl.growth_intervals[this.stage];
		this.time.events.add(Phaser.Timer.SECOND * base_delay, this.addCritSlot, this);
		this.time.events.add(Phaser.Timer.SECOND * base_delay * 2, this.addCritSlot, this);
		this.time.events.add(Phaser.Timer.SECOND * base_delay * 3, this.addCritSlot, this);

		// Hair growth timer
		this.girl.hair_timer = this.time.events.loop(Phaser.Timer.SECOND * this.girl.growth_intervals[1], this.growHair, this);
	},

	startStage2: function()
	{
		this.stage = 2;

		// Create 2 new crit slots
		var base_delay = this.girl.growth_intervals[this.stage];
		this.time.events.add(Phaser.Timer.SECOND * base_delay, this.addCritSlot, this);
		this.time.events.add(Phaser.Timer.SECOND * base_delay * 2, this.addCritSlot, this);

		// Hair growth timer
		this.girl.hair_timer.delay = Phaser.Timer.SECOND * this.girl.growth_intervals[this.stage];
	},

	startStage3: function()
	{
		this.stage = 3;

		// Create 2 new crit slots
		var base_delay = this.girl.growth_intervals[this.stage];
		this.time.events.add(Phaser.Timer.SECOND * base_delay, this.addCritSlot, this);
		this.time.events.add(Phaser.Timer.SECOND * base_delay * 2, this.addCritSlot, this);

		// Hair growth timer
		this.girl.hair_timer.delay = Phaser.Timer.SECOND * this.girl.growth_intervals[this.stage];
	},

	startStage4: function()
	{
		this.stage = 4;

		this.cleanCrits();
		this.crits.destroy();
		this.time.events.add(Phaser.Timer.SECOND * 7, this.showEnding, this);
	},

	update: function()
	{
		// Update pointer
		if (this.input.enabled)
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

		// Check if stage number needs to be updated
		var hair_rate = this.computeHairRate();
		if (this.stage == 0)
		{
			if (this.crits.length == 0)
			{
				this.go_to_stage = 1;
			}
			if (hair_rate == 0)
			{
				this.leaveCrit(this.crits.getTop());
				this.go_to_stage = 1;
			}
		}
		else if (this.stage == 1)
		{
			if (hair_rate > 0)
			{
				this.updateSlots(6);
			}
			else
			{
				this.cleanCrits();
			}
			if ((this.crit_click_count + this.hair_click_count) > 20)
				this.go_to_stage = 2;
		}
		else if (this.stage == 2)
		{
			if (hair_rate > 0)
			{
				this.updateSlots(3);
			}
			else
			{
				this.cleanCrits();
			}
			if ((this.crit_click_count + this.hair_click_count) > 35)
				this.go_to_stage = 3;
		}
		else if (this.stage == 3)
		{
			if (hair_rate > 0)
			{
				this.updateSlots(2);
			}
			else
			{
				this.cleanCrits();
			}
			if (this.crit_click_count > 45)
				this.go_to_stage = 4;
		}
		else if (this.stage == 4)
		{
			return;
		}
		// Update stage
		if (this.go_to_stage)
		{
			switch(this.go_to_stage)
			{
				case 1:
					this.startStage1();
					break;
				case 2:
					this.startStage2();
					break;
				case 3:
					this.startStage3();
					break;
				case 4:
					this.startStage4();
				default:
					break;
			}
			this.go_to_stage = undefined;
		}

		// Tint girl
		if (this.crits.length > 0 && this.stage != 0)
		{
			var r = Game.rand(0, 10);
			if (r < 1)
				this.tintWorld(-0x010101);
		}
	}
};
