// post page
var line = 0;
if (parseInt($(".content").css("height"), 10) > 400) {
  line = parseInt($(".content").css("height"), 10) * 0.15;
}

var lineHeight = "";
if (line > 0) {
  lineHeight = line + "px";
} else {
  lineHeight = "0";
}

$(".vertical-line").css("height", lineHeight);

var lineWidth = lineHeight;
$(".horizontal-line").css("width", lineWidth);
