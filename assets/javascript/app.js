$(document).ready(function(){

    var database = firebase.database();

    var game = {
        player1: "",
        player2: "",
        player1ready: false,
        player2ready: false,
        player1choice: "",
        player2choice: "",
        gameStarted: false,
        round: 1,
        localPlayer: "",
        wins: 0,
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
            this.player1ready = false;
            this.player2ready = false;
            this.player1choice = "";
            this.player2choice = "";
            this.gameStarted = false;
            this.round = 1;
            this.localPlayer = "";
        }

    }

    var gameReset = {
        player1: "",
        player2: "",
        player1ready: false,
        player2ready: false,
        player1choice: "",
        player2choice: "",
        gameStarted: false,
        round: 1,
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
            $("#player-one-exists").css("display", "inline");
            $("#player-one-name-display").text(game.player1);
            console.log("PLAYER1 CHANGED TO " + snapshot.val() + " AH");
            if(game.player2 !== "") {
                game.gameStarted = true;
                database.ref("game/gameStarted").set(true);
            }
        }
        else {
            $("#player-one-new").css("display", "inline");
            $("#player-one-exists").css("display", "none");
        }
    });

    database.ref("game/player2").on("value", function(snapshot){
        if(snapshot.val() !== ""){
            game.player2 = snapshot.val();
            $("#player-two-new").css("display", "none");
            $("#player-two-exists").css("display", "inline");
            $("#player-two-name-display").text(game.player2);
            console.log("PLAYER2 CHANGED TO " + snapshot.val() + " WOAH");
            if(game.player1 !== "") {
                game.gameStarted = true;
                database.ref("game/gameStarted").set(true);
            }
        }
        else {
            $("#player-two-new").css("display", "inline");
            $("#player-two-exists").css("display", "none");
        }
    });

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
        console.log(game.player2);
    });

    $("#end").on("click", function(){
        database.ref("game/").set(gameReset);
        database.ref("game/").once("value").then(function(snapshot){
            game.update(snapshot.val());
            console.log(game);
        });
    });

    $("li").on("click", function(){
        database.ref("game/" + game.localPlayer + "choice").set($(this).text());
    });
});