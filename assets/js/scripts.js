$(document).ready(function () {
    var gameIsReady;
    var rndCard;
    var gameRunning = false;
    var badGuess = "";
    var badGuesses = 0;
    var pastGuesses = [];
    var correctLetters = [];
    var cheat = false;

    // Pulls a random card
    function saveCard(data) {
        rndCard = data;
        //Replace special chars
        rndCard.name = rndCard.name.replace(/[',!]/g, "");
        rndCard.name = rndCard.name.replace(/[-]/g, " ");

        //Discard cards w/ names too long
        if (rndCard.name.length >= 18) {
            setTimeout(newRndCard(), 50);
        }

        $(".click2p").fadeIn(1500);
        gameIsReady = true;
    }
    //Pulling a random card from the skryfall api
    function newRndCard() {
        $.getJSON('https://api.scryfall.com/cards/random?q=-type%3Aland+legal%3Alegacy+not%3Atoken+not%3Asplit+not%3Atransform', function (data) {
            saveCard(data);
        })
    };

    newRndCard()

    //Setting up game zone
    $("#splashScreen").on("click", function () {
        if (gameIsReady) {
            gameIsReady = false;
            var letterCount = "";
            for (var i = 0; i < rndCard.name.length; i++) {
                correctLetters.push(rndCard.name.charAt(i).toUpperCase());
                if (rndCard.name.charAt(i) === " ") {
                    letterCount = letterCount + " ";
                } else {
                    letterCount = letterCount + "_"
                }
            }
            // $("#miaLetters").text(miaLetters.toUpperCase());
            $("#letterCount").text(letterCount);
            $("#splashScreen").fadeOut(1500);
            $("#gameMain").delay(1500).fadeIn(1250);
            setTimeout(function () { gameRunning = true; }, 2750);
        }
    });

    //Guessing Letters
    document.onkeyup = function (event) {
        var guessSTR = String.fromCharCode(event.keyCode);
        var buildCGuess = "";
        if (event.keyCode == 40) {
            badGuesses--;
            cheat = true;
        }
        if (event.keyCode == 38) {
            console.log(rndCard.name);
            cheat = true;
        }
        if (event.keyCode <= 90 && event.keyCode >= 65) {
            if (gameRunning == true) {
                if (pastGuesses.includes(guessSTR)) {
                    alert("You've already guessed that");
                } else {
                    pastGuesses.push(guessSTR);
                    if (correctLetters.includes(guessSTR)) {
                        for (var i = 0; i < rndCard.name.length; i++) {
                            if (pastGuesses.includes(rndCard.name.charAt(i).toUpperCase())) {
                                buildCGuess = buildCGuess + rndCard.name.charAt(i).toUpperCase();
                            } else if (rndCard.name.charAt(i) != " ") {
                                buildCGuess = buildCGuess + "_";
                            } else {
                                buildCGuess = buildCGuess + " ";
                            }
                        }
                        $("#letterCount").text(buildCGuess.toUpperCase());

                        if ($("#letterCount").text() == rndCard.name.toUpperCase()) {
                            if(cheat){
                                alert("I get why you cheated, lifes hard. Refresh and try again w/o cheating")
                            } else {
                                alert("Wow you got it without cheating! Nice!!");
                            }
                            $("#cardIMG").attr("src", rndCard.image_uris.normal);
                        }
                    } else {
                        badGuess = badGuess + guessSTR;
                        badGuesses++;
                        $("#badGuesses").text(badGuess);
                        if (badGuesses == 7) {
                            gameRunning = false;
                            $("#cardIMG").attr("src", rndCard.image_uris.normal);
                            alert("You've run out of guess, refresh the page to try again")
                        }
                    }
                }
            }

        }
    }
});
