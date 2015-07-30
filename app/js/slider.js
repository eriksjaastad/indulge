$('.icon-menu').on('click', function() {
  $('.tweetList').toggleClass('is-active');
  if ($(this).hasClass('icon-menu')) {
    $(this).removeClass('icon-menu');
    $(this).addClass('icon-cross');
  }
  else {
    $(this).removeClass('icon-cross');
    $(this).addClass('icon-menu');
  }
});
