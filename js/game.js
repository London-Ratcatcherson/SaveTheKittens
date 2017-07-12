/////////////////////////////////////////////////////////
// The game code is wrapped in one big function 
//   which contains interior functions
//   
function playGame() {

	/////////////////////////////////////////////////////////
	// Globals

	// debug state flag
	var debug = false;

	// Do we really need three flags?
	var scoringActive = false;
	var pauseActive = false;
	var gameOver = false;

	// Play rounds 0 to 5
	var level = 0;
	var maxLevel = 5;

	// Array of keys pressed
	var keysDown = {};

	// the background object
	var imgBackground = {
		index: 0,
		width: 0,
		height: 0,
		stretchWidth: 0,
		stretchHeight: 0,
		Ready: false,
		BkgCount: 9,
		Backgrounds: [
			"img/EarlyFish.jpg",
			"img/rockyfish.jpg",
			"img/Rosebud.gif",
			"img/theDeep.jpg",
			"img/UnderSeaView.jpg",
			"img/UnderSeaView2.jpg",
			"img/UnderSeaWorld.jpg",
			"img/Volcano.jpg",
			"img/WalrusMist.jpg"
			],
		Image: null
	};

	// the object for player, opponent and kittens
	// speed: movement rate in pixels/second
	// index: last face[] used (to avoid immediate repeats)
	// width, height: face dimensions
	// x, y: coordinate of character top left corner on canvas
	// dX, dY: velocity in pixels/sec 
	// vX, vY: direction (do we need this?)
	// Ready: flag set when image is loaded
	// Active: is this character in play?
	// faces[]: array of character images 
	// faceCount: number of images 
	// Image: the current image 
	//
	function Character(name, speed, width, height, faces)
	{
		this.name = name;
		this.score = 0;
		this.speed = speed;
		this.index = 0;
		this.width = width;
		this.height = height;
		this.x = 0;
		this.y = 0;
		this.dX = 0;
		this.dY = 0;
		this.vX = 0;
		this.vY = 0;
		this.Ready = false;
		this.Active = false;
		this.faces = faces;
		this.faceCount = faces.length;
		this.Image = new Image;
	}
	// And the globals for player, opponent and 3 kittens
	var player, opponent, kittenA, kittenB, kittenC;

	// Background audio
	var sfx = {
		index: 0,
		TrackCount: 11,
		Tracks: [
		"audio/Hill01_Pulling over.mp3",
		"audio/Hill02_Ringtone_ClintonLaugh.mp3",
		"audio/Hill03_Bake_cookies.mp3",
		"audio/Stein01_Money.mp3",
		"audio/Stein02_Free_Higher_Education.mp3",
		"audio/Trump01_I_beat_China_all_the_time.mp3",
		"audio/Trump02_Obamacare.mp3",
		"audio/Trump03_Jobs_President.mp3",
		"audio/Trump04_Build_a_great_wall.mp3",
		"audio/Trump05_We_have_people_that_are_stupid.mp3",
		"audio/Trump06_were_dying.mp3"
		],
		Audio: null
	};

	// End of Globals
	/////////////////////////////////////////////////////////


	/////////////////////////////////////////////////////////
	// Functions
	

	//////////////////////////////////////////////////////////////
	// Initialize the characters
	//   Only called once at start of game
	function initCharacters()
	{
		debugWrite("initCharacters");
		
		// Set up the player, opponent and three kittens
		player = new Character("player", 1, 48, 64,
			["img/Hill01.png", 
			"img/Hill02.png", 
			"img/Hill03.png", 
			"img/Hill04.png", 
			"img/Stein01.png", 
			"img/Stein02.png", 
			"img/Stein03.png", 
			"img/Stein04.png"]
			);
		opponent = new Character("opponent", 8, 64, 96,
			["img/Trump01.png", 
			"img/Trump02.png", 
			"img/Trump03.png", 
			"img/Trump04.png"]);
		kittenA = new Character("kittenA", 1, 36, 48,
			["img/kitten-pix-00.jpg", 
			"img/kitten-pix-01.jpg",  
			"img/kitten-pix-02.jpg",  
			"img/kitten-pix-03.jpg",  
			"img/kitten-pix-04.jpg",  
			"img/kitten-pix-05.jpg",  
			"img/kitten-pix-06.jpg",  
			"img/kitten-pix-07.jpg",  
			"img/kitten-pix-08.jpg",  
			"img/kitten-pix-09.jpg"]);
		kittenB = new Character("kittenB", 1, 36, 48,
			["img/kitten-pix-00.jpg", 
			"img/kitten-pix-01.jpg",  
			"img/kitten-pix-02.jpg",  
			"img/kitten-pix-03.jpg",  
			"img/kitten-pix-04.jpg",  
			"img/kitten-pix-05.jpg",  
			"img/kitten-pix-06.jpg",  
			"img/kitten-pix-07.jpg",  
			"img/kitten-pix-08.jpg",  
			"img/kitten-pix-09.jpg"]);
		kittenC = new Character("kittenC", 1, 36, 48,
			["img/kitten-pix-00.jpg", 
			"img/kitten-pix-01.jpg",  
			"img/kitten-pix-02.jpg",  
			"img/kitten-pix-03.jpg",  
			"img/kitten-pix-04.jpg",  
			"img/kitten-pix-05.jpg",  
			"img/kitten-pix-06.jpg",  
			"img/kitten-pix-07.jpg",  
			"img/kitten-pix-08.jpg",  
			"img/kitten-pix-09.jpg"]);
	} // function initCharacters()
	//////////////////////////////////////////////////////////////


	//////////////////////////////////////////////////////////////
	// Event listener callbacks

	// Keyboard interface not working right now (but not really needed)
	var evtKeyDown = function(e) {
		keysDown[e.keyCode] = true;
		debugWrite("keydown " + keyCode);
	}
	var evtKeyUp = function(e) {
		delete keysDown[e.keyCode];
		debugWrite("keyup " + keyCode);
	}

	var evtMouseMove = function(e) {
		if (e.clientX > player.x) {
			player.vX = 1;
		}
		if (e.clientX < player.x) {
			player.vX = -1;
		}
		if (e.clientY > player.y) {
			player.vY = 1;
		}
		if (e.clientY < player.y) {
			player.vY = -1;
		}
		debugWrite("mouse X: " + e.clientX + " " + player.x + "  :player X  vX:" + player.vX);
		debugWrite("mouse Y: " + e.clientY + " " + player.y + "  :player Y  vY:" + player.vY);
		debugWrite("speed: " + player.speed + "  dX: " + player.dX + "  dY: " + player.dY);
	}

	var evtTouchMove = function(e) {
		// Stop browser processing further touch events
		e.preventDefault();

		if (e.clientX > player.x) {
			player.vX = 1;
		}
		if (e.clientX < player.x) {
			player.vX = -1;
		}
		if (e.clientY > player.y) {
			player.vY = 1;
		}
		if (e.clientY < player.y) {
			player.vY = -1;
		}
		debugWrite("touch X: " + e.clientX + " " + player.x + "  :player X  vX:" + player.vX);
		debugWrite("touch Y: " + e.clientY + " " + player.y + "  :player Y  vY:" + player.vY);
	}

	var evtTouchStart = function(e) {
		// Stop browser processing further touch events
		e.preventDefault();
		debugWrite("touch start");
	}
	var evtTouchEnd = function(e) {
		// Stop browser processing further touch events
		e.preventDefault();
		debugWrite("touch end");
	}
	var evtTouchCancel = function(e) {
		// Stop browser processing further touch events
		e.preventDefault();
		debugWrite("touch cancel");
	}

	//
	//////////////////////////////////////////////////////////////


	//////////////////////////////////////////////////////////////
	// One time initialization
	//
	function setupGame() {

		debugWrite("setupGame");
		// Setup the audio
 		sfx.Audio = document.getElementById("audioPlayerId");
		sfx.Audio.controls = false;

		// initialize the characters
		initCharacters();

		// Scale canvas and background to fit the browser window
		var canvas = document.getElementById("canvasGameId");
		imgBackground.stretchWidth = canvas.width = document.body.clientWidth;
		imgBackground.stretchHeight = canvas.height = document.body.clientHeight;

		// Toggle the background image to "Ready" once loaded
		imgBackground.Image = new Image();
		imgBackground.Image.onload = function() {
			imgBackground.Ready = true;
			debugWrite("imgBackground.Image.onload");
		};

		// toggle each character image to "Ready" once loaded
		opponent.Image.onload = function () {
			opponent.Ready = true;
			debugWrite("opponent.Image.onload");
		};
		player.Image.onload = function () {
			player.Ready = true;
			debugWrite("player.Image.onload");
		};
		kittenA.Image.onload = function () {
			kittenA.Ready = true;
			debugWrite("kittenA.Image.onload");
		};
		kittenB.Image.onload = function () {
			kittenB.Ready = true;
			debugWrite("kittenB.Image.onload");
		};
		kittenC.Image.onload = function () {
			kittenC.Ready = true;
			debugWrite("kittenC.Image.onload");
		};


		// Setup UI listeners for kbd, mouse, touch
		// Keyboard ui (attached to window)
		// NOTE: keyboard UI not working
		canvas.addEventListener("keydown", evtKeyDown, false);
		canvas.addEventListener("keyup", evtKeyUp, false);

		// Mouse ui (attached to canvas)
		// Mouse / touch change player acceleration.
		// If the pointer x/y position is the left/top of the player 
		//   top left corner, acceleration change flag is set to decrease.
		//   
		// If the pointer x/y position is the right/bottom of the player 
		//   top left corner, acceleration change flag is set to increase.
		// The acceleration is added in function update()
		//
		canvas.addEventListener("mousemove", evtMouseMove, false);
		
		// Touch needs some more events to keep the touch from continuing
		canvas.addEventListener("touchstart", evtTouchStart, false);
		canvas.addEventListener("touchend", evtTouchEnd, false);
		canvas.addEventListener("touchcancel", evtTouchCancel, false);
		canvas.addEventListener("touchmove", evtTouchMove, false);

		// Set a timer so resize events clear before resetcallback invoked
		var timer_id = undefined;
		window.addEventListener("resize", function(e) {
			if (timer_id != undefined) {
				clearTimeout(timer_id);
				timer_id = undefined;
			}
			timer_id = setTimeout(function() {
				timer_id = undefined;
				resizeCallback()
			}, 1500);
		}, false);
	} // function SetupGame()
	//////////////////////////////////////////////////////////////

	// send debug msg to console if debug flag set
	function debugWrite(s) {
		if (debug == true) {
			console.log(s);
		}
	}

	// Returns a random number between min (inclusive) and max (exclusive)
	function getRandomArbitrary(min, max) {
		var index = Math.random() * (max - min) + min;
		return index.toFixed(0);
	}

	// Keep playing? 
	function haveWeWon() {
		debugWrite("haveWeWon level " + level);
		
		// Turn off characters, disable scoring
		scoringActive = false;
		player.Ready = opponent.Ready = kittenA.Ready = kittenB.Ready = kittenC.Ready = false;
		
		// 3 second timeout function that toggles the "pause" flag
		pauseActive = true;
		setTimeout(function() { pauseActive = false; }, 3000);

		if (maxLevel < level) {
			gameOver = true;
		} else {
			// Keep playing
			++level;
		}
	}



	// When the window is resized, reset the game (new level)
	function resizeCallback() {
		debugWrite("resizeCallback");

		haveWeWon();
	}

	// Randomly position a character 
	function setupCharacter(t, width, height)
	{
		var x  = t.width + (Math.random() * (width - (t.width * 2)));
		t.x = Math.floor(x);
		var y = t.height + (Math.random() * (height - (t.height * 2)));
		t.y = Math.floor(y);
		// Set t velocity
		var z;
		do {
			z = Math.floor(getRandomArbitrary(-2, 2));
		} while (z == 0);
		t.dX = z;
		do {
			z = Math.floor(getRandomArbitrary(-2, 2));
		} while (z == 0);
		t.dY = z;

		// Activate
		t.Active = true;
		debugWrite("setupCharacter: " + t.name + " x: " + t.x + " y:" + t.y + " speed: " + t.dX + " "+ t.dY);
	}

	// Position a character out of play
	function setupCharacterOff(t, width, height)
	{
		t.x = width * -1;
		t.y = width * -1;
		t.speed = t.dX = t.dY = t.vX = t.vY = 0;

		// Don't activate
		t.Active = t.Ready = false;

		debugWrite("setupCharacterOff: " + t.name + " x: " + t.x + " y:" + t.y + " speed: " + t.dX + " "+ t.dY);
	}

	// Bounce off walls by reversing velocity
	function wallBounce(t, width, height, mod)
	{
		if ((0 > t.x) || (width < t.x + t.width)){ 
			t.dX *= -(mod);
		}
		if ((0 > t.y ) || (height < t.y + t.height)){
			t.dY *= -(mod);
		}
	}

	// Check for collision!
	function collision(one, two) {
		if (one.Ready & two.Ready) {
			if (
				   one.x <= (two.x + one.width)
				&& two.x <= (one.x + two.width)
				&& one.y <= (two.y + one.height)
				&& two.y <= (one.y + two.height)
			) {
				debugWrite("collision " + one.name + " " + two.name);
				// Touching
				return true;
			}
		}
		return false;
	}

	// Saved a kitten bookkeeping (move out of play, turn off)
	function saveKitten(t, kitten)
	{
		++t.score;
		setupCharacterOff(kitten, kitten.width, kitten.height);

		debugWrite("saveKitten " + kitten.name + " score " + t.score);
	}

		// Grabbed a kitten bookkeeping (move out of play, turn off)
	function grabKitten(t, kitten)
	{
		++t.score;
		setupCharacterOff(kitten, kitten.width, kitten.height);

		debugWrite("grabKitten " + kitten.name + " score " + t.score);
	}




	//////////////////////////////////////////////////////////////
	// Reset the game when A) resize event; 
	//   B) player/opponent collision
	//
	var reset = function () {
		debugWrite("reset, level " + level);
	
		// Reset canvas dimensions in case of resize / rotation
		var canvas = document.getElementById("canvasGameId");
		imgBackground.stretchWidth = canvas.width = document.body.clientWidth;
		imgBackground.stretchHeight = canvas.height = document.body.clientHeight;

		// New faces for background, player, opponent
		var index;
		do {
			index = getRandomArbitrary(0, imgBackground.BkgCount);
		} while  ((index == imgBackground.index) || (index >= imgBackground.BkgCount));
		imgBackground.index = index;
		imgBackground.Image.src = imgBackground.Backgrounds[index];
		do {
			index = getRandomArbitrary(0, opponent.faceCount);
		} while  ((index == opponent.index) || (index >= opponent.faceCount));
		opponent.index = index;
		opponent.Image.src = opponent.faces[index];
		do {
			index = getRandomArbitrary(0, player.faceCount);
		} while  ((index == player.index) || (index >= player.faceCount));
		player.index = index;
		player.Image.src = player.faces[index];
		player.dX = 0;
		player.dY = 0;


		//  New faces for all 3 kittens, with no onscreen repeats
		do {
			index = getRandomArbitrary(0, kittenA.faceCount);
		} while  ((index == kittenA.index) || (index >= kittenA.faceCount));
		kittenA.index = index;
		// Wrap around index if out of bounds
		if (kittenA.faceCount <= index + 2) {
			index = 0;
		}
		kittenB.index = index + 1;
		kittenC.index = index + 2;
		kittenA.Image.src = kittenA.faces[kittenA.index];
		kittenB.Image.src = kittenB.faces[kittenB.index];
		kittenC.Image.src = kittenC.faces[kittenC.index];
		kittenA.dX = kittenB.dX = kittenC.dX = 0;
		kittenA.dY = kittenB.dY = kittenC.dY = 0;
		kittenA.x = kittenB.x = kittenC.x = 0;
		kittenA.y = kittenB.y = kittenC.y = 0;

		// New sound
		do {
			index = getRandomArbitrary(0, sfx.TrackCount);
		} while  ((index == sfx.index) || (index >= sfx.TrackCount));
		sfx.index = index;
		sfx.Audio.src = sfx.Tracks[index];

		// Setup the player in the middle of the canvas
		player.x = canvas.width / 2;
		player.y = canvas.height / 2;

		// Throw the opponent somewhere on the screen randomly
		setupCharacter(opponent, canvas.width, canvas.height);

		// Add kittens at higher levels
		// Position them so they do not start collided with opponent 
		do {
			setupCharacter(kittenA, canvas.width, canvas.height);
		} while (collision(opponent, kittenA));
		if (level > 2) {
			do {
				setupCharacter(kittenB, canvas.width, canvas.height);
			} while (collision(opponent, kittenB));
		} else {
			setupCharacterOff(kittenB, canvas.width, canvas.height);
		}
		if (level > 4) {
			do {
				setupCharacter(kittenC, canvas.width, canvas.height);
			} while (collision(opponent, kittenC));
		} else {
			setupCharacterOff(kittenC, canvas.width, canvas.height);
		}

		// Enable scoring
		scoringActive = true;
		sfx.Audio.play();
	}; // var reset = function () {
	//////////////////////////////////////////////////////////////


	//////////////////////////////////////////////////////////////
	// Update game objects every (modifier) seconds
	var update = function (modifier) {

		// Don't update if we're paused
		if (false == scoringActive) {
			return;
		}

		var canvas = document.getElementById("canvasGameId");

		// Move player - first, update the the velocity from user moves
		if (38 in keysDown) { // Player holding up
			player.dY -= player.speed * modifier;
		}
		if (40 in keysDown) { // Player holding down
			player.dY += player.speed * modifier;
		}
		if (37 in keysDown) { // Player holding left
			player.dX -= player.speed * modifier;
		}
		if (39 in keysDown) { // Player holding right
			player.dX += player.speed * modifier;
		}
		// Mouse / touch moves
		player.dY += player.vY * (player.speed * modifier);
		player.dX += player.vX * (player.speed * modifier);
		// Second, update the player position
		player.x += player.dX;
		player.y += player.dY;

		// Collision checks - has player hit a wall?
		wallBounce(player, canvas.width, canvas.height, 1);

		// Move opponent
		opponent.x += opponent.dX;
		opponent.y += opponent.dY;

		// Move kittens
		kittenA.x += kittenA.dX;
		kittenA.y += kittenA.dY;
		kittenB.x += kittenB.dX;
		kittenB.y += kittenB.dY;
		kittenC.x += kittenC.dX;
		kittenC.y += kittenC.dY;

		// If oponent or kittens hit wall, bounce
		wallBounce(opponent, canvas.width, canvas.height, 1);
		wallBounce(kittenA, canvas.width, canvas.height, 1);
		wallBounce(kittenB, canvas.width, canvas.height, 1);
		wallBounce(kittenC, canvas.width, canvas.height, 1);

		// Collision checks - player grabbed?
		if (collision(player, opponent)){
			player.Active = player.Ready = false;
			++opponent.score;
			scoringActive = false;
			haveWeWon();
		}
		// Saved a kitten! remove kitten from play
		if (collision(player, kittenA)) {
			saveKitten(player, kittenA);
		}
		if (collision(player, kittenB)) {
			saveKitten(player, kittenB);
		}
		if (collision(player, kittenC)) {
			saveKitten(player, kittenC);
		}
		// kitten grabbed!
		if (collision(opponent, kittenA)) {
			grabKitten(opponent, kittenA);
		}
		if (collision(opponent, kittenB)) {
			grabKitten(opponent, kittenB);
		}
		if (collision(opponent, kittenC)) {
			grabKitten(opponent, kittenC);
		}

		// Reset if no kittens are left 
 		if (true == player.Ready) {
			if (false == kittenA.Active &&
				false == kittenB.Active &&
				false == kittenC.Active) {
				haveWeWon();
			}
		}

	}; // var update = function (modifier) {
	//////////////////////////////////////////////////////////////


	//////////////////////////////////////////////////////////////
	// Draw everything
	var render = function () {

		// Get the canvas ready 
		var canvas = document.getElementById("canvasGameId");
		var ctx = canvas.getContext("2d");
		ctx.fillStyle = "rgb(0, 204, 0)";
		ctx.clearRect(0, 0, document.body.clientWidth, document.body.clientHeight);
		ctx.fillRect(0, 0, document.body.clientWidth, document.body.clientHeight);


		if (true == imgBackground.Ready) {
			ctx.drawImage(imgBackground.Image, 0, 0, 
				imgBackground.stretchWidth, imgBackground.stretchHeight);
		}
		if (true == player.Ready) {
			ctx.drawImage(player.Image, player.x, player.y,
				player.width, player.height);
		}
		if (true == opponent.Ready) {
			ctx.drawImage(opponent.Image, opponent.x, opponent.y,
				opponent.width, opponent.height);
		}
		if (true == kittenA.Ready) {
			ctx.drawImage(kittenA.Image, kittenA.x, kittenA.y,
				kittenA.width, kittenA.height);
		}
		if (level > 2) {
			if (true == kittenB.Ready) {
				ctx.drawImage(kittenB.Image, kittenB.x, kittenB.y,
					kittenB.width, kittenB.height);
			}
			if (level > 4) {
				if (true == kittenC.Ready) {
					ctx.drawImage(kittenC.Image, kittenC.x, kittenC.y,
						kittenC.width, kittenC.height);
				}
			}
		}

		// Scoreboard
		ctx.fillStyle = "rgb(250, 250, 250)";
		ctx.font = "24px Helvetica";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText("Kittens grabbed " + opponent.score + ", Kittens saved " + player.score, 32, 32);

	};
	//////////////////////////////////////////////////////////////


	//////////////////////////////////////////////////////////////
	// The main game loop
	var main = function () {
		var now = Date.now();
		var delta = now - then;

		update(delta / 1000);
		render();

		then = now;

		// Request to do this again ASAP
		// Cross-browser support for requestAnimationFrame
		var w = window;
		requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
		var animationThread = requestAnimationFrame(main);
		
		// if the pause flag is unset, reset the scoringActive flag
		if (false == pauseActive && false == scoringActive) {
			reset();
		}
		
		// If gameOver flag is set the game is over!
		//   (After pause to show score)
		if (gameOver && false == pauseActive) {
			// Turn off audio, remove eventlisteners
			sfx.Audio.pause();
			var canvas = document.getElementById("canvasGameId");
			// window.removeEventListener()
			window.removeEventListener("keydown", evtKeyDown, false);
			window.removeEventListener("keyup", evtKeyUp, false);
			canvas.removeEventListener("mousemove", evtMouseMove, false);
			canvas.removeEventListener("touchstart", evtTouchStart, false);
			canvas.removeEventListener("touchend", evtTouchEnd, false);
			canvas.removeEventListener("touchcancel", evtTouchCancel, false);
			canvas.removeEventListener("touchmove", evtTouchMove, false);

			cancelAnimationFrame(animationThread);
			var oppScore = opponent.score;
			var playerScore = player.score;
			if (player.score > opponent.score) {
				location.href = "youwin.html?player=" + playerScore + "&opponent=" + oppScore;
			} else {
				location.href = "youlose.html?player=" + playerScore + "&opponent=" + oppScore;
			}
		}
	}; // var main = function () {
	//////////////////////////////////////////////////////////////

	// End of Function definitions
	/////////////////////////////////////////////////////////

	
	/////////////////////////////////////////////////////////
	// JavaScript execution starts here

	var then = Date.now();
	// Onetime initializations
	setupGame();
	// each new level initializations
	reset();
	// the game loop
	main();
	
}



