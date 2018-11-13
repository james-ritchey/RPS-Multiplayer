$(document).ready(function(){
    var counter = 5;
    var intervalID = null;

    var database = firebase.database();

    var game = {
        player1: "",
        player2: "",
        player1choice: "",
        player2choice: "",
        gameStarted: false,
        round: 1,
        localPlayer: "",
        p1wins: 0,
        p1losses: 0,
        p2wins: 0,
        p2losses: 0,
        update: function(data){
            this.player1 = data.player1;
            this.player2 = data.player2;
            this.player1ready = data.player1ready;
            this.player2ready = data.player2ready;
            this.player1choice = data.player1choice;
            this.player2choice = data.player2choice;
            this.gameStarted = data.gameStarted;
            this.round = data.round;
        },
        reset: function(){
            this.player1 = "";
            this.player2 = "";
            this.player1choice = "";
            this.player2choice = "";
            this.gameStarted = false;
            this.round = 1;
            this.localPlayer = "";
            counter = 5;
            this.p1wins = 0;
            this.p1losses = 0;
            this.p2wins = 0;
            this.p2losses = 0;
            $("#results").text("");
            $("#player-one-choice").text("");
            $("#player-two-choice").text("");
            $("#player-one-answers").css("display", "block");
            $("#player-two-answers").css("display", "block");
            $("#player-one-local").css("display", "none");
            $("#player-two-local").css("display", "none");
            $("#player1-local").css("display", "none");
            $("#player2-local").css("display", "none");
        }

    }

    var gameReset = {
        player1: "",
        player2: "",
        player1choice: "",
        player2choice: "",
        gameStarted: false,
        round: 1,
    }

    function checkResults(p1, p2) {
        if(p1 === "Rock") {
            if(p2 === "Paper") {
                $("#results").text(game.player2 + " wins!");
                game.p2wins++;
                game.p1losses++;
                $("#player-two-wins").text(game.p2wins);
                $("#player-one-losses").text(game.p1losses);
            }
            else if(p2 === "Scissors") {
                $("#results").text(game.player1 + " wins!");
                game.p1wins++;
                game.p2losses++;
                $("#player-one-wins").text(game.p1wins);
                $("#player-two-losses").text(game.p2losses);
            }
            else if(p2 === "Rock") {
                $("#results").text("It's a draw!");
                console.log("draw");
            }
        }
        else if(p1 === "Paper") {
            if(p2 === "Paper") {
                $("#results").text("It's a draw!");
            }
            else if(p2 === "Scissors") {
                $("#results").text(game.player2 + " wins!");
                game.p2wins++;
                game.p1losses++;
                $("#player-two-wins").text(game.p2wins);
                $("#player-one-losses").text(game.p1losses);
            }
            else if(p2 === "Rock") {
                $("#results").text(game.player1 + " wins!");
                game.p1wins++;
                game.p2losses++;
                $("#player-one-wins").text(game.p1wins);
                $("#player-two-losses").text(game.p2losses);
            }
        }
        else if(p1 === "Scissors") {
            if(p2 === "Paper") {
                $("#results").text(game.player1 + " wins!");
                game.p1wins++;
                game.p2losses++;
                $("#player-one-wins").text(game.p1wins);
                $("#player-two-losses").text(game.p2losses);
            }
            else if(p2 === "Scissors") {
                $("#results").text("It's a draw!");
            }
            else if(p2 === "Rock") {
                $("#results").text(game.player2 + " wins!");
                game.p2wins++;
                game.p1losses++;
                $("#player-two-wins").text(game.p2wins);
                $("#player-one-losses").text(game.p1losses);
            }
        }
        setTimeout(nextRound, 3000);
    }

    function nextRound() {
        $("#player-one-choice").text("");
        $("#player-two-choice").text("");
        $("#player-one-answers").css("display", "block");
        $("#player-two-answers").css("display", "block");
        database.ref("game/player1choice").set("");
        database.ref("game/player2choice").set("");
    }

    database.ref("game/").once("value").then(function(snapshot){
        game.update(snapshot.val());
        if(game.player1 !== ""){
            $("#player-one-exists").css("display", "inline");
            $("#player-one-name-display").text(game.player1);
        }
        else {
            $("#player-one-new").css("display", "inline");
        }
        if(game.player2 !== ""){
            $("#player-two-exists").css("display", "inline");
            $("#player-two-name-display").text(game.player2);
        }
        else {
            $("#player-two-new").css("display", "inline");
        }
    });

    database.ref("game/gameStarted").on("value", function(snapshot){
        if(!snapshot.val()){
            game.reset();
        }
        else{
            $("#" + game.localPlayer + "-local").css("display", "inline");
        }
    });

    database.ref("game/player1").on("value", function(snapshot){
        if(snapshot.val() !== ""){
            game.player1 = snapshot.val();
            $("#player-one-new").css("display", "none");
            $("#player-one-exists").css("display", "block");
            $("#player-one-name-display").text(game.player1);
            console.log("PLAYER1 CHANGED TO " + snapshot.val() + " AH");
            if(game.player2 !== "") {
                game.gameStarted = true;
                database.ref("game/gameStarted").set(true);
            }
        }
        else {
            $("#player-one-new").css("display", "block");
            $("#player-one-exists").css("display", "none");
        }
    });

    database.ref("game/player2").on("value", function(snapshot){
        if(snapshot.val() !== ""){
            game.player2 = snapshot.val();
            $("#player-two-new").css("display", "none");
            $("#player-two-exists").css("display", "block");
            $("#player-two-name-display").text(game.player2);
            console.log("PLAYER2 CHANGED TO " + snapshot.val() + " WOAH");
            if(game.player1 !== "") {
                game.gameStarted = true;
                database.ref("game/gameStarted").set(true);
            }
        }
        else {
            $("#player-two-new").css("display", "block");
            $("#player-two-exists").css("display", "none");
        }
    });

    database.ref("game/player1choice").on("value", function(snapshot){
        game.player1choice = snapshot.val();
        if(snapshot.val() !== "" && game.player2choice !== "") {
            checkResults(snapshot.val(), game.player2choice);
        }
    });

    database.ref("game/player2choice").on("value", function(snapshot){
        game.player2choice = snapshot.val();
        if(game.player1choice !== "" && snapshot.val() !== "") {
            checkResults(game.player1choice, snapshot.val());
        }
    });

    database.ref("chat").on("value", function(snapshot){
        if(snapshot.val() !== "") {
            var newMessage = $("<p>");
            $(newMessage).text(snapshot.val());
            $(newMessage).addClass("message");
            $("#messages").prepend(newMessage);
        }
    });

    database.ref("game/").onDisconnect().set(gameReset);
    database.ref("chat/").onDisconnect().set("");

    $("#player-one-submit").on("click", function(){
        if($("#player-one-name").val().trim() !== "" && game.player1 === "") {
            game.player1 = $("#player-one-name").val().trim();
            game.localPlayer = "player1";
            $("#player-one-name").val("");
            updates = {player1: game.player1}
            database.ref("game/").update(updates);
            $("#player-one-new").css("display", "none");
            $("#player-one-exists").css("display", "inline");
            $("#player-one-name-display").text(game.player1);
            $("#player-two-new").css("display", "none");
            $("#player-two-exists").css("display", "inline");
            if(game.player2 === "")
                $("#player-two-name-display").text("Waiting for opponent...");
        }
        console.log(game.player1);
    });

    $("#player-two-submit").on("click", function(){
        if($("#player-two-name").val().trim() !== "" && game.player2 === "") {
            game.player2 = $("#player-two-name").val().trim();
            game.localPlayer = "player2";
            $("#player-two-name").val("");
            updates = {player2: game.player2}
            database.ref("game/").update(updates);
            $("#player-two-new").css("display", "none");
            $("#player-two-exists").css("display", "inline");
            $("#player-two-name-display").text(game.player2);
            $("#player-one-new").css("display", "none");
            $("#player-one-exists").css("display", "inline");
            if(game.player1 === "")
                $("#player-one-name-display").text("Waiting for opponent...");
        }
    });

    $("#end").on("click", function(){
        database.ref("game/").set(gameReset);
        database.ref("chat").set("");
        game.reset();
        $("#messages").empty();
    });

    $("li").on("click", function(){
        database.ref("game/" + game.localPlayer + "choice").set($(this).text());
        $("#player-one-choice").text(game.player1choice);
        $("#player-two-choice").text(game.player2choice);
        $("#player-one-answers").css("display", "none");
        $("#player-two-answers").css("display", "none");
    });

    $("#send").on("click", function(){
        if($("#send-message").val().trim() !== "" && game.localPlayer !== ""){
            database.ref("game/" + game.localPlayer).once("value").then(function(snapshot){
                var message = snapshot.val() + ": " + $("#send-message").val().trim();
                database.ref("chat").set(message);
                console.log(message);
            });
        }
    });
});