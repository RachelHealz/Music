var audiolet = new Audiolet();
var lowPass = 200;
var highPass = 300;

var MaxDelay= 10.0;
var Delay=0.3;

var feedb= 0.5;
var mix=0.5;

var gate = 1;
var attack = 1;
var decay = .2;
var sustain = .9;
var release = 2;

var sines = [];
var sawes = [];

var LPFilter = new LowPassFilter(audiolet, lowPass);
var HPFilter = new HighPassFilter(audiolet, highPass);
var feedBDelay = new feedBDelay(audiolet, MaxDelay, Delay, feedb, mix);

LPFilter.connect(HPFilter);
HPFilter.connect(FeedBDelay);
feedBDelay.connect(audiolet.output);

var stopKeys = [];

var transUp = false;

function makeTone(frequency, stopHandler) {
  sines.push(new Sine(audiolet, frequency));
  //sawes.push(new Saw(audiolet,frequency));
  
  sines[sines.length - 1].connect(LPFilter);
  //sawes[sawes.length-1].connect(LPFilter);

  //sawes[sawes.length-1].phase = 0;

  stopKeys[sines.length - 1] = stopHandler;

  return sines.length - 1;
};

function stopMe(index) {
  sines[index].remove();

  var returnValue = stopKeys[index];
  stopKeys.splice(index);

  return returnValue;
}
//CHANGING LOW PASS DIAL
$("input[name=lowPass]").bind("change", function() {
  console.log("change detected!");
  
  lowPass = parseInt(this.value);
  LPFilter.frequency.setValue(lowPass);

});

//SETVALUE OF HIGHPASS AND CHANGE
$("input[name=highPass]").bind("change", function() {
  highPass = parseInt(this.value);
  HPFilter.frequency.setValue(highPass);
});

$("input[name=delayTime]").bind("change",function() {
  val = parseFloat(this.value);

  delayTime = val;
  feedBDelay.delayTime.setValue(delayTime);
});
$("input[name=delayFeedback]").bind("change",function() {
  val = parseFloat(this.value);

  delayFeedback = val;
  feedBDelay.feedback.setValue(delayFeedback);
});
$("input[name=delayMix]").change(function() {
  val = parseFloat(this.value);

  delayMix = val;
  feedBDelay.mix.setValue(delayMix);

});

$("input[name=enableDelay]").change(function() {
  if (this.checked) {
    feedBDelay.feedback.setValue($("input[name=delayFeedback]").val());
    feedBDelay.mix.setValue($("input[name=delayMix]").val());
    feedBDelay.delayTime.setValue($("input[name=delayTime]").val());

    $(this).parents("fieldset").find("input").not(this).removeAttr("disabled");
  } else {
    feedBDelay.feedback.setValue(0);
    feedBDelay.mix.setValue(0);
    feedBDelay.delayTime.setValue(0.3);

    $(this).parents("fieldset").find("input").not(this).attr("disabled", "disabled");
  }
});

$("input[name=showKeyboardKeys]").change(function(e) {
  if (this.checked) {
    $("body").removeClass("hideKeyboardKeys");

  } else {
    $("body").addClass("hideKeyboardKeys");
  }
});

//For the transpose
$("input[name=transposeUp]").change(function() {
  transposeUp = this.checked;
  $("input[name=showKeyboardKeys]").removeAttr("checked").change();
});

//for the delay
$("input.number").knobby();