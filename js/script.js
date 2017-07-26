$(document).ready(function() {
  $("#start-btn").click(function() {
    var whiteTimer = new Timer($("#time-setter").val(), $("#white-countdown"));
    var blackTimer = new Timer($("#time-setter").val(), $("#black-countdown"));
    $(".landing").fadeToggle();
    whiteTimer.start();
  });
});

function Timer(time, el) {
  el.text(time + ":00");

  var milli = time * 60000;
  console.log(time + " minutes = " + milli + " milliseconds");

  var startTime, endTime, timePaused, timeResumed;

  this.start = function() {
    startTime = new Date().getTime();
    endTime = startTime + milli;
    console.log(startTime + " is current time; " + endTime + " is ending time");
  };
}
