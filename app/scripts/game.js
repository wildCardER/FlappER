
window.Game = (function() {
	'use strict';

	/**
	 * Main game class.
	 * @param {Element} el jQuery element containing the game.
	 * @constructor
	 */

	var ObstacleId = 0;
	var gapHeight = 120;

	var Game = function(el) {
		this.el = el;
		this.player = new window.Player(this.el.find('.Player'), this);
		this.isPlaying = false;

		// Cache a bound onFrame since we need it each frame.
		this.onFrame = this.onFrame.bind(this);
	};

	/**
	 * Runs every frame. Calculates a delta and allows each game
	 * entity to update itself.
	 */
	Game.prototype.onFrame = function() {
		// Check if the game loop should stop.
		if (!this.isPlaying) {
			return;
		}
		// Calculate how long since last frame in seconds.
		var now = +new Date() / 1000,
				delta = now - this.lastFrame;
		this.lastFrame = now;

		// Update game entities.
		this.player.onFrame(delta);

		// Request next frame.
		window.requestAnimationFrame(this.onFrame);
	};

	/**
	 * Starts a new game.
	 */
	Game.prototype.start = function() {
		this.reset();

		// Restart the onFrame loop
		this.lastFrame = +new Date() / 1000;
		window.requestAnimationFrame(this.onFrame);
		this.isPlaying = true;
		spawnObstacle();
		moveObstacles();
	};

	/**
	 * Resets the state of the game so a new game can be started.
	 */
	Game.prototype.reset = function() {
		this.player.reset();
	};

	/**
	 * Signals that the game is over.
	 */
	Game.prototype.gameover = function() {
		this.isPlaying = false;

		// Should be refactored into a Scoreboard class.
		var that = this;
		var scoreboardEl = this.el.find('.Scoreboard');
		scoreboardEl
			.addClass('is-visible')
			.find('.Scoreboard-restart')
				.one('click', function() {
					scoreboardEl.removeClass('is-visible');
					that.start();
				});
	};

	var spawnObstacle = function(){
		ObstacleId++;
		var ObstacleTopHeight = Math.floor(Math.random() * (window.height() - 250)) + 50;
		var ObstacleBottomHeight = window.height() - (ObstacleTopHeight + gapHeight);
		var Obstacle = '<div class="pipe" pipe-id="' + ObstacleId + '"><div style="height: ' + ObstacleTopHeight + 'px" class="topHalf"></div><div style="height:' + ObstacleBottomHeight + 'px" class="bottomHalf"></div></div>';
		window.append(Obstacle);
	};
/*
	var deleteObstacle = function(){
		$('.window .Obstacle').first().remove();
	};
*/
	var moveObstacles = function (){
		$('.Obstacle').each(function(){
			$(this).animate({
				right: '+=160px'
			}, 1300, 'linear');
		});
	};
	/**
	 * Some shared constants.
	 */
	Game.prototype.WORLD_WIDTH = 102.4;
	Game.prototype.WORLD_HEIGHT = 57.6;

	return Game;
})();


