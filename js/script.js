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


//Timer object that  includes methods to start, pause, and resume a timer
function Timer(time, el) {
  el.text(time + ":00");

  var milli = time * 60000;

  var m = time;
  var s = 0;

  var startTime, now, endTime, timePaused, timeResumed, int;

  this.hasBegun = false;


  this.start = function() {
    this.hasBegun = true;

    //Wait 750 ms to start the game after the button has been pressed; gives animations
    //time to finish with time to spare
    setTimeout(function() {

      //the timer uses Date objects to calculate time remaining
      startTime = new Date().getTime();
      endTime = startTime + milli;

      //update every 200 ms for added accuracy
      int = setInterval(function() {
        now = new Date().getTime();
        m = Math.floor((endTime - now) / 60000);
        s = Math.floor(((endTime - now) / 1000) % 60);
        s = s < 10 ? "0" + s : s;

        //if the timer is up, the game is over; manually set the timer to 0:00 to avoid
        //the issue of negative time remaining
        if((endTime - now) <= 0) {
          el.text("0:00");
          clearInterval(int);
          endGame(true);
        }

        //if time isn't up, update the displayed time remaining
        else el.text(m + ":" + s);
      }, 200);
    }, 750);
  };

  //when timer pauses, collect the current time and stop the timer
  this.pause = function() {
    timePaused = new Date().getTime();
    clearInterval(int);
  };

  this.resume = function() {
    timeResumed = new Date().getTime();

    //add the time paused (when resumed minus when paused) onto the ending time
    endTime += (timeResumed - timePaused);

    //continue counting down
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
    }, 200);
  };
}

//functions for switching turns and ending the games (correspond with buttons in the UI)
function addGameClickFunctions(white, black) {
  $("#switch-white").click(function() {
    white.pause();

    /*
    toggle visibility of buttons for each side
    chose this method because $(selector).toggle() and the like all rely on display: none,
    which would cause the time remaining to jump around (ugly!). Visibility, however
    still reserves the space required by the hidden elements so other elements will remain
    in the same spot.
    */
    $("#switch-white, #end-white").css("visibility", "hidden");
    $("#switch-black, #end-black").css("visibility", "visible");

    //if black hasn't gone yet, start the timer; otherwise, resume it
    !black.hasBegun ? black.start() : black.resume();
  });

  $("#switch-black").click(function() {
    black.pause();

    //see comment for switch-white press for details on why I did this
    $("#switch-black, #end-black").css("visibility", "hidden");
    $("#switch-white, #end-white").css("visibility", "visible");

    //white goes first, so there's no way that it hasn't started (no need for ternary operator
    //as in above case)
    white.resume();
  });

  //if the End Game button is pressed, clear both timers and handle it
  $(".end-game").click(function() {
    white.pause();
    black.pause();

    endGame(false);
  });
}

function endGame(timeRanOut) {
  if(timeRanOut) {

    //if black ran out of time, show that white won
    if($("#switch-black").css("visibility") === "visible") {
      console.log("White wins on time");
      $("#winner-text").text("Time is up! White wins!");
      $("#winner").show();
      $("#timer-wrapper").fadeToggle();
      $(".game-over-wrapper").fadeToggle();
    }

    //if white ran out of time, show that black won
    else {
      console.log("Black wins on time");
      $("#winner-text").text("Time is up! Black wins!");
      $("#winner").show();
      $("#timer-wrapper").fadeToggle();
      $(".game-over-wrapper").fadeToggle();
    }
  }

  //if the 'End Game' button was pressed (no one ran out of time)
  else {
    console.log("Time was not up when game ended.");

    $("#no-winner").show();
    $("#timer-wrapper").fadeToggle();
    $(".game-over-wrapper").fadeToggle();

    //when user presses OK on no-winner screen
    $("#winner-select").click(function() {

      //get the value from the dropdown
      var val = document.getElementById('winner-dd').value;


      //and update the display based on that value
      if(val == "choose");

      else if(val == "white") {
        console.log("Winner: White");
        $("#winner-text").text("White wins! Play again?");
        $("#no-winner").hide();
        $("#winner").show();
      }

      else if(val == "black") {
        console.log("Winner: Black");
        $("#winner-text").text("Black wins! Play again?");
        $("#no-winner").hide();
        $("#winner").show();
      }

      else if (val == "draw") {
        console.log("Result: Draw");
        $("#winner-text").text("Stalemate! Play again?");
        $("#no-winner").hide();
        $("#winner").show();
      }

      //built-in scoring function
      else {
        console.log("User needs to score");

        //hide other screens and show the scoring screen
        $("#no-winner").hide();
        $(".game-over-wrapper").fadeToggle();
        $(".score-wrapper").fadeToggle();

        $("#score-btn").click(function() {
          var whiteScore = scoreGame('white');
          var blackScore = scoreGame('black');

          //if white won, then update the display to convey this information
          if(whiteScore > blackScore) {
            $("#winner-text").text("White wins! Final score: " + whiteScore + "-" + blackScore + ".");
            $("#winner").show();
            $(".score-wrapper").fadeToggle();
            $(".game-over-wrapper").fadeToggle();
          }

          //if black won, then update the display to convey this information
          else if(whiteScore < blackScore) {
            $("#winner-text").text("Black wins! Final Score: " + blackScore + "-" + whiteScore + ".");
            $("#winner").show();
            $(".score-wrapper").fadeToggle();
            $(".game-over-wrapper").fadeToggle();
          }

          //if the result was a draw, then update the display to convey this information
          else {
            $("#winner-text").text("Draw! Final Score: " + whiteScore + "-" + blackScore + ".");
            $("#winner").show();
            $(".score-wrapper").fadeToggle();
            $(".game-over-wrapper").fadeToggle();
          }
        });
      }
    });
  }

  //reload the page if the user wants to start a new game
  $("#ng-button").click(function() {
    location.reload();
  });
}

function scoreGame(color) {

  //the five scoring pieces; if the king had been taken there would be no need to score
  var pieces = ['pawn', 'rook', 'knight', 'bishop', 'queen'];
  var score = 0;

  //values of each scoring piece using Reinfield values
  var indValues = [1, 5, 3, 3, 9];

  for(var i = 0; i < 5; i++) {

    //get the ID of the current scoring piece that we wish to evaluate
    var elID = color + "-" + pieces[i];

    //calculate the individual score and add it to the score tally
    score += document.getElementById(elID).value * indValues[i];
  }

  console.log(color + " ended with " + score + " points.");
  return score;
}
