/*
    Copyright (C) 2017 Carlos Pérez

    This file is part of 'The more hair you have...' (shortened as TMHYH).

    TMHYH is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    TMHYH is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with TMHYH. If not, see <http://www.gnu.org/licenses/>.
*/

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

		// Images
		this.load.image('background', 'assets/image/fondo.png');
		this.load.spritesheet('help', 'assets/image/axuda.png', 960, 540, 1);
		this.load.spritesheet('ending', 'assets/image/fin.png', 960, 540, 2);

		// Girl
		this.load.spritesheet('body', 'assets/image/corpo.png', 385, 473);
		//this.load.spritesheet('head', 'assets/image/cabeza.png', 384, 473, 2);
		this.load.spritesheet('head', 'assets/image/pelo.png', 385, 473, 7);
		this.load.spritesheet('face', 'assets/image/expresions.png', 385, 472, 3);
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
		this.load.spritesheet('cr_01_body', 'assets/image/criticons/cr_01/cr_01_corpo.png', 419, 445);
		this.load.spritesheet('cr_01_face', 'assets/image/criticons/cr_01/cr_01_exp.png', 418, 445, 4);
		this.load.spritesheet('cr_02_body', 'assets/image/criticons/cr_02/cr_02_corpo.png', 417, 425);
		this.load.spritesheet('cr_02_face', 'assets/image/criticons/cr_02/cr_02_exp.png', 416, 425, 4);
		this.load.spritesheet('cr_03_body', 'assets/image/criticons/cr_03/cr_03_corpo.png', 420, 423);
		this.load.spritesheet('cr_03_face', 'assets/image/criticons/cr_03/cr_03_exp.png', 419, 423, 4);
		this.load.spritesheet('cr_04_body', 'assets/image/criticons/cr_04/cr_04_corpo.png', 416, 429);
		this.load.spritesheet('cr_04_face', 'assets/image/criticons/cr_04/cr_04_exp.png', 415, 428, 4);
		this.load.spritesheet('cr_05_body', 'assets/image/criticons/cr_05/cr_05_corpo.png', 417, 423);
		this.load.spritesheet('cr_05_face', 'assets/image/criticons/cr_05/cr_05_exp.png', 416, 423, 4);
		this.load.spritesheet('cr_06_body', 'assets/image/criticons/cr_06/cr_06_corpo.png', 420, 428);
		this.load.spritesheet('cr_06_face', 'assets/image/criticons/cr_06/cr_06_exp.png', 419, 428, 4);
		this.load.spritesheet('bubble', 'assets/image/criticons/bocadillo.png', 118, 78, 2);

		// Audio
		this.load.audio('ambient', 'assets/sound/ambient.ogg');
		this.load.audio('pick_hair', 'assets/sound/quitar_pelo.ogg');
		this.load.audio('woman_angry_3', 'assets/sound/cr_muller_enfado3.ogg');
		this.load.audio('woman_angry_2', 'assets/sound/cr_muller_enfado2.ogg');
		this.load.audio('woman_sorry', 'assets/sound/cr_muller_pena.ogg');
		this.load.audio('woman_hurt', 'assets/sound/cr_muller_pincha.ogg');
		this.load.audio('woman_laugh', 'assets/sound/cr_muller_risa.ogg');
		this.load.audio('man_angry_1', 'assets/sound/cr_home_enfado1.ogg');
		this.load.audio('man_angry_2', 'assets/sound/cr_home_enfado2.ogg');
		this.load.audio('man_sorry', 'assets/sound/cr_home_pena.ogg');
		this.load.audio('man_hurt', 'assets/sound/cr_home_pincha.ogg');
		this.load.audio('man_laugh', 'assets/sound/cr_home_risa.ogg');
	},

	create: function()
	{
		this.state.start('Gameplay');
	}
};
