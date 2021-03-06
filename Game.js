BunnyDefender.Game = function (game) {
    this.totalBunnies;
    this.bunnyGroup;

    this.totalSpaceRocks;
    this.spaceRockGroup;

    this.burst;

    this.gameOver;
    this.countdown;

    this.overMessage;
    this.secondsElapsed;
    this.timer;

    this.music;
    this.ouch;
    this.boom;
    this.ding;
};

BunnyDefender.Game.prototype = {
    create: function () {
        this.gameOver = false;

        this.secondsElapsed = 0;
        this.timer = this.time.create(false);
        this.timer.loop(1000, this.updateSeconds, this);

        this.totalBunnies = 20;
        this.totalSpaceRocks = 13;

        this.music = this.add.audio('game_audio');
        this.music.play('', 0, 0.3, true);
        this.ouch = this.add.audio('hurt_audio');
        this.boom = this.add.audio('explosion_audio');
        this.ding = this.add.audio('select_audio');

        this.buildWorld();
    },

    buildWorld: function () {
        this.add.image(0, 0, 'sky');
        this.add.image(0, 800, 'hill');
        this.buildBunnies();
        this.buildSpaceRocks();
        this.buildEmitter();

        this.countdown = this.add.bitmapText(10, 10, 'eightBitWonder', 'Bunnies Left ' + this.totalBunnies, 20);
        this.timer.start();
    },

    updateSeconds: function() {
        this.secondsElapsed++;
    },

    buildBunnies: function () {
        this.bunnyGroup = this.add.group();
        this.bunnyGroup.enableBody = true;

        for (let i = 0; i < this.totalBunnies; i++) {
            var b = this.bunnyGroup.create(this.rnd.integerInRange(-10, this.world.width - 50), this.rnd.integerInRange(this.world.height - 180, this.world.height - 60), 'bunny', 'Bunny0000');
            b.anchor.setTo(0.5, 0.5);
            b.body.moves = false;
            b.animations.add('Rest', this.game.math.numberArray(1, 58));
            b.animations.add('Walk', this.game.math.numberArray(68, 107));
            b.animations.play('Rest', 24, true);
            this.assignBunnyMovement(b);
        }
    },

    buildSpaceRocks: function() {
        this.spaceRockGroup = this.add.group();
        for (let i = 0; i < this.totalSpaceRocks; i++) {
            var r = this.spaceRockGroup.create(this.rnd.integerInRange(0, this.world.width), this.rnd.realInRange(this.world.height - 1500, 0), 'spaceRock', 'SpaceRock0000');
            var scale = this.rnd.realInRange(0.3, 1.0);
            r.scale.x = scale;
            r.scale.y = scale;

            this.physics.enable(r, Phaser.Physics.ARCADE);
            r.enableBody = true;
            r.body.velocity.y = this.rnd.integerInRange(200, 400);

            r.animations.add('Fall');
            r.animations.play('Fall', 24, true);

            r.checkWorldBounds = true;
            r.events.onOutOfBounds.add(this.resetRock, this);
        }
    },

    resetRock: function(r) {
        if(r.y > this.world.height) {
            this.respawnRock(r);
        }
    },

    respawnRock: function(r) {
        if(!this.gameOver) {
            r.reset(this.rnd.integerInRange(0, this.world.width), this.rnd.realInRange(-1500, 0));
            r.body.velocity.y = this.rnd.integerInRange(200, 400);
        }
    },

    buildEmitter: function() {
        this.burst = this.add.emitter(0, 0, 80);

        this.burst.minParticleScale = 0.3;
        this.burst.maxParticleScale = 1.2;

        this.burst.minParticleSpeed.setTo(-30, 30);
        this.burst.maxParticleSpeed.setTo(30, -30);

        this.burst.makeParticles('explosion');
        this.input.onDown.add(this.fireBurst, this);
    },

    fireBurst: function(pointer) {
        if(!this.gameOver) {
            this.boom.play();
            this.boom.volume = 0.2;

            this.burst.emitX = pointer.x;
            this.burst.emitY = pointer.y;
            this.burst.start(true, 2000, null, 20);
        }
    },

    burstCollision: function(r, b) {
        this.respawnRock(r)
    },

    bunnyCollision: function(r, b) {
        if(b.exists) {
            this.respawnRock(r);
            this.makeGhost(b);

            this.ouch.play();
            b.kill();

            this.totalBunnies--;
            this.checkBunniesLeft();
        }
    },

    checkBunniesLeft: function() {
        this.countdown.setText('Bunnies Left ' + this.totalBunnies);

        if(this.totalBunnies <= 0) {
            this.gameOver = true;
            this.music.stop();

            this.overMessage = this.add.bitmapText(this.world.centerX - 180, this.world.centerY - 40, 'eightBitWonder', 'GAME OVER!\n\n' + this.secondsElapsed, 42);
            this.overMessage.align = 'center';
            this.overMessage.inputEnabled = true;
            this.overMessage.events.onInputDown.addOnce(this.quitGame, this);
        }
    },

    quitGame: function(pointer) {
        this.ding.play();
        this.state.start('StartMenu');
    },

    friendlyFire: function(b, e) {
        if(b.exists) {
            this.makeGhost(b);
            b.kill();
            this.totalBunnies -= 1;

            this.ouch.play();

            this.checkBunniesLeft();
        }
    },

    makeGhost: function(b) {
        bunnyGhost = this.add.sprite(b.x - 20, b.y - 180, 'ghost');
        bunnyGhost.anchor.setTo(0.5, 0.5);
        bunnyGhost.scale.x = b.scale.x;
        this.physics.enable(bunnyGhost, Phaser.Physics.ARCADE);
        bunnyGhost.enableBody = true;
        bunnyGhost.checkWorldBounds = true;
        bunnyGhost.body.velocity.y = -800;
    },

    update: function() {
        this.physics.arcade.overlap(this.spaceRockGroup, this.burst, this.burstCollision, null, this);
        this.physics.arcade.overlap(this.spaceRockGroup, this.bunnyGroup, this.bunnyCollision, null, this);
        this.physics.arcade.overlap(this.bunnyGroup, this.burst, this.friendlyFire, null, this);
    },

    assignBunnyMovement: function(b) {
        bposition = Math.floor(this.rnd.realInRange(50, this.world.width - 50));
        bdelay = this.rnd.integerInRange(2000, 6000);

        //determine direction of movement
        if(bposition < b.x) {
            b.scale.x = 1;
        } else {
            b.scale.x = -1;
        }

        t = this.add.tween(b).to({x: bposition}, 3500, Phaser.Easing.Quadratic.InOut, true, bdelay);
        t.onStart.add(this.startBunny, this);
        t.onComplete.add(this.stopBunny, this);
    },

    startBunny: function (b) {
        b.animations.stop('Rest');
        b.animations.play('Walk', 24, true);
    },

    stopBunny: function (b) {
        b.animations.stop('Walk');
        b.animations.play('Rest', 24, true);
        this.assignBunnyMovement(b);
    }
};
