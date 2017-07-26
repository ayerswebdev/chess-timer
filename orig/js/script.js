var globals = {};
globals.buzzer = new Audio("https://sfxcontent.s3.amazonaws.com/soundfx/Buzzer2.mp3");

$(document).ready(function() {
  $("#timer").hide();
  $("#error").hide();

  $("#start").click(function() {
    globals.time = (parseInt($("#min").val()) * 60000) + (parseInt($("#sec").val()) * 1000);
    if(globals.time > 0) {
      setTimer();

      $("#landing").hide();
      $("#timer").show();

      setTimeout(function() {
        runTimer(globals.time);
      }, 500);
    }

    else {
      $("#error").show();
      setTimeout(function() {
        $("#error").fadeOut(250);
      }, 1500);
    }
  });

  $("#switch").click(function() {
    clearInterval(globals.timer);
    switchTurns();
  });
});

function switchTurns() {
  if($("#switch").hasClass("light")) {
    $("#switch, #new-game").css({
      "-webkit-animation": "fadeBlack 0.75s linear",
      "background-color": "#212121",
      "color": "#E0E0E0"
    });

    $("body").css({
      "-webkit-animation": "fadeBackgroundBlack 0.75s linear",
      "background-color": "#212121",
      "color": "#212121"
    });
  }

  else {
    $("#switch, #new-game").css({
      "-webkit-animation": "fadeWhite 0.75s linear",
      "background-color": "#E0E0E0",
      "color": "#212121"
    });

    $("body").css({
      "-webkit-animation": "fadeBackgroundWhite 0.75s linear",
      "background-color": "#E0E0E0",
      "color": "#E0E0E0"
    });

  }

  $("#switch, #new-game").toggleClass("light");

  setTimeout(function() {
    $("#turn").text($("#switch").hasClass("light") ? "White" : "Black");
  }, 750);

  setTimer();
  setTimeout(function() {
    runTimer(globals.time)
  }, 800);
}

function runTimer(time) {
  var start = new Date().getTime();
  var end = start + time;

  globals.timer = setInterval(function() {
    var now = new Date().getTime();
    var m = Math.floor((end - now) / 60000);
    var s = Math.floor(((end - now) / 1000)%60);
    s = (s < 10 ? "0" : "") + s;

    if(end - now <= 0) {
      clearInterval(globals.timer);
      $("#time-remaining").text("0:00");
      globals.buzzer.play();
      setTimeout(function() {
        setTimer();
        switchTurns();
      }, 1000);
    }

    else $("#time-remaining").text(m + ":" + s);
  }, 200);
}

function setTimer() {
  var m = $("#min").val();
    if(typeof $("#sec").val() === undefined) {
      var s = "00";
    }
    else var s = $("#sec").val();
    s = s < 10 && s !== "00" ? "0" + s : s;

    $("#time-remaining").text(m + ":" + s);
}

$("#new-game").click(function() {
  clearInterval(globals.timer);
  setTimer();
  $("#timer").hide();
  $("#landing").show();

  if(!($("#switch").hasClass("light"))) {
    $("#switch, #new-game").addClass("light");
    $("#turn").text("White");
    $("#switch, #new-game").css({
      "background-color": "#E0E0E0",
      "color": "#212121"
    });
    $("body").css({
      "background-color": "#E0E0E0",
      "color": "#E0E0E0"
    });
  }
});
