var BunnyDefender = {};

BunnyDefender.Boot  = function(game) {};

// this in phaser refers to the game object passed into the boot loader function

BunnyDefender.Boot.prototype = {

    preload: function () {
        // for things like preload bar, title image
        this.load.image('preloaderBar', './images/loader_bar.png');
        this.load.image('titleImage', './images/TitleImage.png');
    },

    create: function () {
        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = false;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.minWidth = 270;
        this.scale.minHeight = 480;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.stage.forcePortrait = true; // for mobile
        this.scale.setScreenSize(true);

        this.input.addPointer();
        this.stage.backgroundColor = '#171642';

        this.state.start('Preloader');
    }
};
