$(document).ready(function(){
	$('#search').click(function(){
		$('.nav-link').toggleClass('hide-item')
		$('.search-form').toggleClass('active')
	})

	$('#searchbtn').click(function(e){
		$('.topic').addClass('hide-item')
    $('.search-topic').addClass('active')
    e.stopPropagation();
    $("1").attr("focus","focused");
	})

$("input:text").blur(function() {
        $('.search-topic').removeClass('active');
        $('.topic').removeClass('hide-item');
    });
})

function opentab(evt, status) {
  var i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(status).style.display = "block";
  evt.currentTarget.className += " active";
}
$(window).resize(function () {
  if ($(window).width() >= 1200  ) {
    $(".btnedit1").removeClass("hidden");
    $(".btnedit2").removeClass("active");
  }
  else{
    $(".btnedit1").addClass("hidden");
    $(".btnedit2").addClass("active");
  }
});
$(window).resize(function () {
  if ($(window).width() <= 767 &&  window.matchMedia("(orientation: portrait)").matches)  {
    $(".ph.card.backphish.flex-wrap.flex-row").removeClass("flex-row");
    $(".ph.card.backphish.flex-wrap").removeClass("flex-wrap");
  }
  else{
    $(".ph.card.backphish").addClass("flex-wrap").addClass("flex-row");

  }
});
