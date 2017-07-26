$(document).ready(function() {
  $("#start-btn").click(function() {
    var whiteTimer = new Timer($("#time-setter").val(), $("#white-countdown"));
    var blackTimer = new Timer($("#time-setter").val(), $("#black-countdown"));
    $(".landing").fadeToggle();
    $("#timer-wrapper").fadeToggle();
    whiteTimer.start();
    $("#switch-white, #end-white").css("visibility", "visible");
    $("#switch-black, #end-black").css("visibility", "hidden");

    addGameClickFunctions(whiteTimer, blackTimer);
  });
});

function Timer(time, el) {
  el.text(time + ":00");

  var milli = time * 60000;
  //console.log(time + " minutes = " + milli + " milliseconds");

  var m = time;
  var s = 0;

  var startTime, now, endTime, timePaused, timeResumed, int;

  this.hasBegun = false;

  this.start = function() {
    this.hasBegun = true;
    setTimeout(function() {
      startTime = new Date().getTime();
      endTime = startTime + milli;

      int = setInterval(function() {
        now = new Date().getTime();
        m = Math.floor((endTime - now) / 60000);
        s = Math.floor(((endTime - now) / 1000) % 60);
        s = s < 10 ? "0" + s : s;

        if((endTime - now) <= 0) {
          el.text("0:00");
          clearInterval(int);
          endGame(true);
        }

        else el.text(m + ":" + s);
        //console.log(m + ":" + s + " remain");
      }, 200);
    }, 750);
  };

  this.pause = function() {
    timePaused = new Date().getTime();
    //console.log("Paused at " + timePaused);
    clearInterval(int);
  };

  this.resume = function() {
    timeResumed = new Date().getTime();
    endTime += (timeResumed - timePaused);

    int = setInterval(function() {
      now = new Date().getTime();
      m = Math.floor((endTime - now) / 60000);
      s = Math.floor(((endTime - now) / 1000) % 60);
      s = s < 10 ? "0" + s : s;

      if((endTime - startTime) <= 0) {
        el.text("0:00");
        clearInterval(int);
        endGame(true);
      }

      else el.text(m + ":" + s);
      //console.log(m + ":" + s + " remain");
    }, 200);
  };
}

function addGameClickFunctions(white, black) {
  $("#switch-white").click(function() {
    white.pause();

    $("#switch-white, #end-white").css("visibility", "hidden");
    $("#switch-black, #end-black").css("visibility", "visible");

    !black.hasBegun ? black.start() : black.resume();
  });

  $("#switch-black").click(function() {
    black.pause();

    $("#switch-black, #end-black").css("visibility", "hidden");
    $("#switch-white, #end-white").css("visibility", "visible");

    white.resume();
  });

  $(".end-game").click(function() {
    white.pause();
    black.pause();

    endGame(false);
  });
}

function endGame(timeRanOut) {


  if(timeRanOut) {

    if($("#switch-black").css("visibility") === "visible") {
      console.log("White wins on time");
    }
    //console.log("Time ran out.");

    else {
      console.log("Black wins on time");
    }
  }

  else {
    console.log("Time was not up when game ended.");
  }
}
