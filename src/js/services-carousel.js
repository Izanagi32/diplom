$(document).ready(function(){
  setTimeout(function() {
    $('.services__carousel').slick({
      rows: 0,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3500,
      speed: 800,
      dots: false,
      arrows: false,
      swipe: true,
      touchThreshold: 8,
      pauseOnHover: false,
      pauseOnFocus: false,
      cssEase: 'linear',
      infinite: true,
      fade: false,
      waitForAnimate: true,
      centerMode: false,
      variableWidth: false,
      adaptiveHeight: false,
      responsive: [
        {
          breakpoint: 1280,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
    
    var totalSlides = $('.services__carousel .services__item').length;
    var slidesVisible = 3;
    
    $('.services__carousel').on('afterChange', function(event, slick, currentSlide) {
      if (currentSlide >= totalSlides - slidesVisible) {
        setTimeout(function() {
          $('.services__carousel').slick('slickGoTo', 0, true);
        }, 100);
      }
    });
    
    $(window).on('resize', function() {
      $('.services__carousel').slick('refresh');
    });
    
    $('.services__carousel').on('breakpoint', function() {
      $('.services__carousel').slick('refresh');
    });
  }, 300);
}); 