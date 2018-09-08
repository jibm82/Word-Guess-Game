var game = {
    // Game variables
    currentWordOptionIndex: 0,
    slider: undefined,
    started: false,

    // Object for storing global game results
    counters: {
        matchesWon: 0,
        matchesLost: 0
    },

    // Object for storing user interface ids and classes.
    ui: {
        coveredWordId: "covered-word",
        letterClass: "letter",
        matchesLostId: "matches-lost",
        matchesWonId: "matches-won",
        playedLetterClass: "played",
        remainingGuessesId: "remaining-guesses",
        sliderId: "slider"
    },

    // Object for handling a single match
    match: {
        correctLetters: [],
        currentWord: "",
        currentImage: "",
        characterForCover: "_",
        playedLetters: [],
        remainingGuesses: undefined,

        // Match methods
        new: function (word, image) {
            this.currentWord = word;
            this.currentImage = image;
            this.correctLetters = [];
            this.playedLetters = [];
            this.remainingGuesses = 10;
        },

        coveredWord: function () {
            var coveredWord = "";

            for (var i = 0; i < this.currentWord.length; i++) {
                if (this.currentWord[i] === " " || this.correctLetters.indexOf(this.currentWord[i]) !== -1) {
                    coveredWord += this.currentWord[i];
                } else {
                    coveredWord += this.characterForCover;
                }
            }

            return coveredWord;
        },

        // If the submitted letter has not been played will return true
        guessLetter: function (letter) {
            if (this.isLetterNew(letter)) {
                this.playedLetters.push(letter);

                if (this.isLetterCorrect(letter)) {
                    this.correctLetters.push(letter);
                } else {
                    this.remainingGuesses--;
                }

                return true;
            } else {
                return false;
            }
        },

        // Match validation methods

        isLetterNew: function (letter) {
            return this.playedLetters.indexOf(letter) === -1;
        },

        isLetterCorrect: function (letter) {
            return this.currentWord.indexOf(letter) !== -1;
        },

        playerWon: function () {
            return this.currentWord === this.coveredWord()
        },

        playerLost: function () {
            return this.remainingGuesses === 0;
        }
    },

    // Game methods

    new: function () {
        this.currentWordOptionIndex = this.wordOptions.length;
        this.newMatch()
    },

    newMatch: function () {
        if (this.currentWordOptionIndex == this.wordOptions.length) {
          this.randomizeWordOptions();
        }

        var wordOption = this.wordOptions[this.currentWordOptionIndex++];

        this.match.new(wordOption.word, wordOption.image);

        this.showLetters();
        this.updateCurrentWord();
        document.getElementById(this.ui.remainingGuessesId).textContent = this.match.remainingGuesses;
    },

    guessLetter: function (letter) {
        var match = this.match;

        if (match.guessLetter(letter)) {
            if (match.playerWon()) {
                this.handleMatchWon();
            } else if (match.playerLost()) {
                this.handleMatchLost();
            } else {
                this.updateMatchUI(letter);
            }
        }
    },

    randomizeWordOptions: function (){
      this.currentWordOptionIndex = 0;
      this.wordOptions = this.wordOptions.sort(function(a, b){
        return 0.5 - Math.random()
      });
    },

    // Game UI methods

    initializeSlider: function () {
        this.slider = tns({
            autoplay: true,
            autoplayButtonOutput: false,
            container: "#" + this.ui.sliderId,
            controls: false,
            nav: false,
            items: 2,
            responsive: {
                640: {
                    items: 2
                },
                700: {
                    items: 4
                },
                900: {
                    items: 5
                }
            }
        });
    },

    addImageToSlider: function () {
        var image = document.createElement("img");

        image.setAttribute("src", "assets/images/covers/" + this.match.currentImage);

        if (this.slider !== undefined) {
            this.slider.destroy();
        }

        var sliderContainer = document.getElementById(this.ui.sliderId);
        sliderContainer.insertBefore(image, sliderContainer.firstChild);

        if (this.slider === undefined) {
            this.initializeSlider();
        } else {
            this.slider = this.slider.rebuild();
        }
    },

    hideLetter: function (letter) {
        var letterId = this.ui.letterClass + letter.toUpperCase();

        document.getElementById(letterId).classList.add(this.ui.playedLetterClass);
    },

    showLetters: function () {
        letters = document.getElementsByClassName(this.ui.letterClass);

        for (var i = 0; i < letters.length; i++) {
            letters[i].classList.remove(this.ui.playedLetterClass);
        }
    },

    handleMatchLost: function () {
        this.updateMatchesLostCounter();
        this.newMatch();
    },

    handleMatchWon: function () {
        this.updateMatchesWonCounter();
        this.addImageToSlider();
        this.newMatch();
    },

    updateBodyClass: function (className) {
        document.getElementsByTagName("BODY")[0].className = "text-center " + className;
    },

    updateCurrentWord: function () {
        document.getElementById(this.ui.coveredWordId).textContent = this.match.coveredWord();
    },

    updateMatchesWonCounter: function () {
        this.counters.matchesWon++;
        document.getElementById(this.ui.matchesWonId).textContent = this.counters.matchesWon;
    },

    updateMatchesLostCounter: function () {
        this.counters.matchesLost++;
        document.getElementById(this.ui.matchesLostId).textContent = this.counters.matchesLost;
    },

    updateMatchUI: function (letter) {
        this.updateCurrentWord();
        this.hideLetter(letter);
        document.getElementById(this.ui.remainingGuessesId).textContent = this.match.remainingGuesses;
    },

    // Options for guessing
    wordOptions: [
        { word: "amelie", image: "amelie.webp" },
        { word: "bad boys", image: "bad_boys.webp" },
        { word: "beast of no nation", image: "beast_of_no_nation.jpg" },
        { word: "beauty and the beast", image: "beauty_and.jpg" },
        { word: "black mirror", image: "black_mirror.jpg" },
        { word: "black panther", image: "black_panther.webp" },
        { word: "bright", image: "bright.jpg" },
        { word: "cars", image: "cars.webp" },
        { word: "coco", image: "coco.webp" },
        { word: "coraline", image: "coraline.webp" },
        { word: "doctor strange", image: "doctor_strange.webp" },
        { word: "elementary", image: "elementary.webp" },
        { word: "emoji movie", image: "emoji_movie.webp" },
        { word: "ex machina", image: "ex_machina.webp" },
        { word: "glow", image: "glow.jpg" },
        { word: "gran torino", image: "gran_torino.webp" },
        { word: "insatiable", image: "insatiable.jpg" },
        { word: "jurassic park", image: "jurassic_park.webp" },
        { word: "kung fu panda", image: "kung_fu_panda.webp" },
        { word: "life is beautiful", image: "life_is_beautiful.webp" },
        { word: "lost", image: "lost.webp" },
        { word: "mamma mia", image: "mamma_mia.webp" },
        { word: "moana", image: "moana.webp" },
        { word: "pearl harbor", image: "pearl_harbor.webp" },
        { word: "pixels", image: "pixels.webp" },
        { word: "pocahontas", image: "pocahontas.webp" },
        { word: "ratatouille", image: "ratatouille.webp" },
        { word: "rogue one", image: "rogue_one.webp" },
        { word: "scarface", image: "scarface.webp" },
        { word: "schindlers list", image: "schindlers_list.webp" },
        { word: "shrek", image: "shrek.webp" },
        { word: "stranger things", image: "stranger_things.jpg" },
        { word: "the blacklist", image: "the_blacklist.webp" },
        { word: "the conjuring", image: "the_conjuring.webp" },
        { word: "the godfather", image: "the_godfather.webp" },
        { word: "the imitiation game", image: "the_imitation_game.webp" },
        { word: "the informant", image: "the_informant.webp" }
    ]
};
