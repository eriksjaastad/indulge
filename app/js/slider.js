$('.icon-arrow-right').on('click', function() {
  $('.tweetList').addClass('is-active');
  // $('body').addClass('has-active-menu');
  // $('.mask').addClass('is-active');
});

$('.icon-cross').on('click', function() {
  $('.tweetList').removeClass('is-active');
//   $('body').removeClass('has-active-menu');
//   $('.mask').removeClass('is-active');
});
