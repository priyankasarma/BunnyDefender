BunnyDefender.Preloader = function(game) {
    this.preloadBar = null;
    this.titleText = null;
    this.ready = false;
};

BunnyDefender.Preloader.prototype = {
    preload: function() {
        this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloadBar');
        this.preloadBar.anchor.setTo(0.5, 0.5);
        this.load.setPreloadSprite(this.preloadBar);
        this.titleText = this.add.image(this.world.centerX, this.world.centerY - 220, 'titleImage');
        this.titleText.anchor.setTo(0.5, 0.5);

        this.load.image('titleScreen', 'images/TitleBG.png');
        this.load.bitmapFont('eightBitWonder', 'fonts/eightbitwonder.png', 'fonts/eightbitwonder.fnt');
    },

    create: function() {
        this.preloadBar.cropEnabled = false;
    },

    update: function() {
        this.ready = true;
        this.state.start('StartMenu');
    }
};
