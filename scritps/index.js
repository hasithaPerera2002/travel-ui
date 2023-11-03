$("#btnProfile").hide();

$(document).ready(function () {
  console.log("ready!");
  $("#spinner").hide();
});

if (sessionStorage.getItem("userId")) {
  console.log(
    "userId is present in sessionStorage: " + sessionStorage.getItem("userId")
  );

  var innerHtml = `
  <a href="profile.html"><img class="rounded-circle"
                            style="border-radius: 30rem;height: 100%;width: 100%;" src="data:image/jpg;base64,${sessionStorage.getItem(
                              "profilePicture"
                            )}"
                            alt="aio"></a>  
  `;
  $("#btnProfile").append(innerHtml);
  $("#btnProfile").show();

  $("#btnLogin").hide();
} else {
  $("#btnProfile").hide();
  $("#btnLogin").show();
  console.log("userId is not present in sessionStorage");
}

var owlPlugin = function () {
  if ($(".owl-3-slider").length > 0) {
    var owl3 = $(".owl-3-slider").owlCarousel({
      loop: true,
      autoHeight: true,
      margin: 10,
      autoplay: true,
      smartSpeed: 700,
      items: 1,
      nav: true,
      dots: true,
      navText: [
        '<span class="icon-keyboard_backspace"></span>',
        '<span class="icon-keyboard_backspace"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 1,
        },
        800: {
          items: 2,
        },
        1000: {
          items: 2,
        },
        1100: {
          items: 3,
        },
      },
    });
  }
  if ($(".owl-4-slider").length > 0) {
    var owl4 = $(".owl-4-slider").owlCarousel({
      loop: true,
      autoHeight: true,
      margin: 10,
      autoplay: true,
      smartSpeed: 700,
      items: 4,
      nav: true,
      dots: true,
      navText: [
        '<span class="icon-keyboard_backspace"></span>',
        '<span class="icon-keyboard_backspace"></span>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 2,
        },
        800: {
          items: 2,
        },
        1000: {
          items: 3,
        },
        1100: {
          items: 4,
        },
      },
    });

    $(".js-custom-next-v2").click(function (e) {
      e.preventDefault();
      owl4.trigger("next.owl.carousel");
    });
    $(".js-custom-prev-v2").click(function (e) {
      e.preventDefault();
      owl4.trigger("prev.owl.carousel");
    });
  }

  if ($(".owl-single-text").length > 0) {
    var owlText = $(".owl-single-text").owlCarousel({
      loop: true,
      autoHeight: true,
      margin: 0,
      autoplay: true,
      smartSpeed: 1200,
      items: 1,
      nav: false,
      navText: [
        '<span class="icon-keyboard_backspace"></span>',
        '<span class="icon-keyboard_backspace"></span>',
      ],
    });
  }
  if ($(".owl-single").length > 0) {
    var owl = $(".owl-single").owlCarousel({
      loop: true,
      autoHeight: true,
      margin: 0,
      autoplay: true,
      smartSpeed: 800,
      items: 1,
      nav: false,
      navText: [
        '<span class="icon-keyboard_backspace"></span>',
        '<span class="icon-keyboard_backspace"></span>',
      ],
      onInitialized: counter,
    });

    function counter(event) {
      $(".owl-total").text(event.item.count);
    }

    $(".js-custom-owl-next").click(function (e) {
      e.preventDefault();
      owl.trigger("next.owl.carousel");
      owlText.trigger("next.owl.carousel");
    });
    $(".js-custom-owl-prev").click(function (e) {
      e.preventDefault();
      owl.trigger("prev.owl.carousel");
      owlText.trigger("prev.owl.carousel");
    });

    $(".owl-dots .owl-dot").each(function (i) {
      $(this).attr("data-index", i - 3);
    });

    owl.on("changed.owl.carousel", function (event) {
      var i = event.item.index;
      if (i === 1) {
        i = event.item.count;
      } else {
        i = i - 1;
      }
      $(".owl-current").text(i);
      $(".owl-total").text(event.item.count);
    });
  }
};
owlPlugin();
