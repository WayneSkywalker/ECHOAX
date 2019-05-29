$(document).ready(function () {
  $('#search').click(function () {
    $('.nav-link').toggleClass('hide-item')
    $('.search-form').toggleClass('active')
  });

})
$('#1').on('click', function (event) {
  $('.search-topic').removeClass('active');
  $('.topic').removeClass('hide-item');
});

$('.deletenews').on('click', function (event) {
  $target = $(event.target);
  const id = $target.attr('data-id');
  $.ajax({
    type:'DELETE',
    url: '/deletenews/' + id,
    success: function(res){
      alert('Delete news');
      window.location.href='/userrequest';
    },
    error: function(err){
      console.log(err);
    }
  });
});

$('#searchbtn').on('click', function (event) {
  $('.topic').addClass('hide-item')
  $('.search-topic').addClass('active')
  event.stopPropagation();
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

