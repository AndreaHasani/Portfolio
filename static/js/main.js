// Fix for viewport min
var viewport = document.querySelector("meta[name=viewport]");
if (viewport) {
  var content = viewport.getAttribute("content");
  var parts = content.split(",");
  for (var i = 0; i < parts.length; ++i) {
    var part = parts[i].trim();
    var pair = part.split("=");
    if (pair[0] === "min-width") {
      var minWidth = parseInt(pair[1]);
      if (screen.width < minWidth) {
        document.head.removeChild(viewport);

        var newViewport = document.createElement("meta");
        newViewport.setAttribute("name", "viewport");
        newViewport.setAttribute("content", "width=" + minWidth);
        document.head.appendChild(newViewport);
        break;
      }
    }
  }
}

// Global variables because of, why not

var stack_programming_typed;
var figuresLeft = [];

$(".mobile-menu ul li a").forEach(function(e) {
  e.addEventListener(
    "click",
    function(event) {
    event.preventDefault();
    var id = $(this).attr("id");
      Velocity($("#about")[0], "scroll", {
        duration: 600,
        easing: "easeInOutCubic",
        complete: function() {
          paneNavigation($("#" + id.replace("_click", "")), 400, 0);
        }
});
},
    false
  );
});

$("#arrow").on(
    "click", function() {
      Velocity($("#about")[0], "scroll",
               {duration : 600, easing : "easeInOutCubic"});
    });

// $(document).ready(function () {
// var dom ="<div class='back-btn'>" +
// 	"<a href='#about'><img src='{{ url_for('static',
// filename='img/left-arrow.svg')}}' /></a>" +
// 	"</div>";
//     $("#resume, #contact_me, #publications, #client_projects").append(dom);
// });

// /* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
// particlesJS.load("particles-js", "./static/assets/particles.json", function()
// {
//   console.log("callback - particles.js config loaded");
// });

// var options_frontpage = {
//   loop: true,
//   typeSpeed: 60,
//   strings: [
//     "builds websites.",
//     "writes scrapers.",
//     "builds bots.",
//     "deploys docker containers.",
//     "builds cms.",
//     "writes python scripts."
//   ],
//   cursorChar: "",
//   backSpeed: 30,
//   startDelay: 250
// };
// var typed = new Typed("#typing", options_frontpage);

new TypeIt("#typing", {
  loop : true,
  strings : [
    "builds websites.", "builds bots.", "builds cms.",
    "fixes wordpress problems.", "writes api.", "writes scrapers.",
    "deploys docker containers.", "writes python scripts."
  ],
  lifeLike : true,
  cursorChar : "",
  breakLines : false,
  deleteSpeed : 60,
  nextStringDelay : [ 300, 1000 ]
});

$(".stack .bottom-divs").forEach(function(element) {
  new TypeIt($(element).find(".typing")[0], {
    loop : true,
    strings : $(element).attr("data-lang").split(","),
    lifeLike : true,
    cursorChar : "",
    breakLines : false,
    deleteSpeed : 60,
    nextStringDelay : [ 300, 1000 ]
  });
});

var getHiddenElementHeight = function(element) {
  h = element.addClass("get-height")[0].scrollHeight;
  element.removeClass("get-height");
  return h;
};

function paneNavigation(nextPane, oldPane, duration, delay, from) {
  paneHeight = getHiddenElementHeight(nextPane);
  Velocity($(".sector-wrapper")[0], {height : paneHeight},
           {duration : duration, easing : "easeInOutCubic"});

  setTimeout(
      function() {
        Velocity(oldPane[0], {
          opacity : 0,
	    transform: ["translateX(-25px)", 'translateX(0)'],
          display : "none"
        },
                 {easing : "fadeOut", queue : false, duration : duration / 2});
      },
      0);

  setTimeout(
      function() {
        Velocity(nextPane[0], {opacity : 1, transform: ["translateX(0)", 'translateX(-25px)'], display : "block"},
                 {easing : "fadeIn", queue : false, duration : duration / 2});
      },
      duration / 2);

  if (from == 0) {
    setTimeout(
        function() {
          Velocity($(".back-btn")[0],
                   {opacity : 1, transform: ["translateX(0)", 'translateX(-25px)'], display : "block"},
                   {easing : "fadeIn", queue : false, duration : duration});
        },
        0);

  } else {
    setTimeout(
        function() {
          Velocity(
              $(".back-btn")[0],
              {opacity : 0, transform: ["translateX(-25px)", 'translateX(0)'], display : "none"},

              {easing : "fadeOut", queue : false, duration : duration / 2});
        },
        0);

    setTimeout(
        function() {
          Velocity($(".back-btn")[0], {transform: ["translateX(0)", 'translateX(-25)']},
                   {easing : "fadeIn", queue : false, duration : duration / 2});
        },
        0);
  }
}

$(".more .icons div > a")
    .on(
        "click", function() {
          var clickedClass = $(this).parent().attr("class");
          if (clickedClass == "publications") {
          }
          var nextPane = $("#" + clickedClass);
          var oldPane = $(".active");
          oldPane.removeClass("active");
          nextPane.addClass("active");
          paneNavigation(nextPane, oldPane, 1500, 0, 0);
        });

$(".back-btn")
    .on(
        "click", function() {
          var nextPane = $(".sector-wrapper .main-pane");
          var oldPane = $(".active");
          oldPane.removeClass("active");
          nextPane.addClass("active");
          paneNavigation(nextPane, oldPane, 1500, 0, 1);
        });

function generateRandomNumber(min_value, max_value) {
  let random_number = Math.random() * (max_value - min_value) + min_value;
  return Math.floor(random_number);
}

function loopFigures() {
  if (figuresLeft.length == 0) {
    figuresLeft = Array.from($(".items figure"));
  }
  $(".items figure").removeClass("hover");
  let num = generateRandomNumber(0, figuresLeft.length);
  var row = $(figuresLeft[num]);
  row.addClass("hover");
  figuresLeft.splice(num, 1);
}

$(document).ready(function() {
  figuresLeft = Array.from($(".items figure"));
  loopFigures();
  let loopinterval = setInterval(loopFigures, 1500);
  $(".items figure")
      .on(
          "mouseover", function() {
            clearInterval(loopinterval);
            figuresLeft = Array.from($(".items figure"));
            $(".items figure").removeClass("hover");
          });

  $(".items figure")
      .on(
          "mouseout", function() {
            loopFigures();
            loopinterval = setInterval(loopFigures, 1500);
          });
});

function createModal(title, images, entry) {
  let modalHtml = ` <div id = "modal1" class = "modal">

                  <!--Modal content--><div class = "post modal-content">
                  <span class = "close"> & times;
  </ span><h1 class = 'title'> ${title}</ h1><div class = 'content'>`;
  if (images.length > 0) {
    modalHtml += `<div class = 'images'>`;
    for (let i = 0; i < images.length; i++) {
      modalHtml += `<img src = '${images[i]}'>`;
    }
    modalHtml += `</ div>`;
  }
  modalHtml += `<div class = 'entry'> ${entry}</ div></ div>
      <div class = 'bigCloseBtn'><button> Close</ button></ div></ div></ div>

      </ div>`;

  $("body").append(modalHtml);

  $("#modal1").css("display", "block");
  $(".modal .bigCloseBtn")
      .on(
          "click", function() { $(".modal").remove(); });
}

$(document).ready(function() {
  $("figure figcaption button.popout")
      .on(
          "click", function(e) {
            e.preventDefault();
            let main = $(this).parent().parent().parent();
            let title = main.find("figcaption h3").text();
            let images =
                main.find(".hidden-info .images img").map(function(element) {
                  return element.getAttribute("src");
                });
            let entry = main.find(".hidden-info .entry").html();
            createModal(title, images, entry);
          });
});

$(document).on(
    "click", function(event) {
      if (!$(event.target)
               .closest(".modal-content, figcaption button")
               .length) {
        $("body").find("#modal1").remove();
      }
    });

// Form Ajax submit
function urlConstruct(endpoint, data) {
  var url = endpoint + "?";
  for (var key in data) {
    url += key + "=" + encodeURI(data[key]) + "&";
  }

  return url.slice(0, -1);
}

$(document).ready(function(e) {
  $("form.contact-form")
      .on(
          "submit", function(event) {
            event.preventDefault();
            var error = 0;
            var name = $("#name").val().trim();
            var email = $("#email").val().trim();
            var subject = $("#subject").val().trim();
            var message = $("#message").val().trim();

            if (name == "") {
              $("input#name").css("border", "2px solid red");
              name = "";
              error = 1;
            } else {
              $("input#name").css("border", "1px solid #aaaaaa");
            }

            if (email == "") {
              $("input#email").css("border", "2px solid red");
              email = "";
              error = 1;
            } else {
              $("input#email").css("border", "1px solid #aaaaaa");
            }

            if (subject == "") {
              $("input#subject").css("border", "2px solid red");
              subject = "";
              error = 1;
            } else {
              $("input#subject").css("border", "1px solid #aaaaaa");
            }

            if (message.length <= 5) {
              $("textarea#message").css("border", "2px solid red");
              message = "";
              error = 1;
            } else {
              $("textarea#message").css("border", "1px solid #aaaaaa");
            }

            if (error == 0) {
              var inputdata = {
                name : name,
                email : email,
                message : message,
                subject : subject
              };
              url = urlConstruct($(this).attr("action"), inputdata);

              ajax_get(
                  url, function(data) {
                    if (data["code"] == 200) {
                      $("#form-messages p").remove();
                      $("#form-messages").append(data["message"]);
                    } else if (data["code"] == 500) {
                      $("#form-messages p").remove();
                      $("#form-messages").append(data["message"]);
                    } else {
                      $("input#name").val(name);
                      $("textarea#message").val(message);
                      $("input#email").val("");
                      $("input#subject").val(subject);
                      $("#form-messages p").remove();
                      $("#form-messages").append(data["message"]);
                    }
                  });
            }
            return false;
          });
});

function ajax_get(url, callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    $("#preloader").css("display", "inline-block");
    $("#reqButton").css("display", "None");
    $("#err-info").css("display", "None");
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      console.log("responseText:" + xmlhttp.responseText);
      try {
        var data = JSON.parse(xmlhttp.responseText);
      } catch (err) {
        console.log(err.message + " in " + xmlhttp.responseText);
        return;
      }
      callback(data);
    }
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}
