const randomColor = () => {
  return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
};

$(window).load(() => {
  $("#color1").css("background-color", randomColor());
  $("#color2").css("background-color", randomColor());
  $("#color3").css("background-color", randomColor());
  $("#color4").css("background-color", randomColor());
  $("#color5").css("background-color", randomColor());
});
