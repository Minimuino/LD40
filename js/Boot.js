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
