$(document).ready(function () {
  var main_height = $(".sector-wrapper")[0].clientHeight;
  document.getElementsByClassName("sector-wrapper")[0].style.height = main_height + "px";
}); // Check for mobile

window.mobilecheck = function () {
  var check = false;

  (function (a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);

  return check;
}; // Fix for viewport min


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
} // Global variables because of, why not


var stack_programming_typed;
var figuresLeft = [];

var scroll = new SmoothScroll('a[href="#about"]', {
	// Selectors
	topOnEmptyHash: true, // Scroll to the top of the page for links with href="#"

	// Speed & Duration
	speed: 800, // Integer. Amount of time in milliseconds it should take to scroll 1000px
	speedAsDuration: true, // If true, use speed as the total duration of the scroll animation
	clip: true, // If true, adjust scroll distance to prevent abrupt stops near the bottom of the page
	// Easing
	easing: 'easeOutCubic', // Easing pattern to use

});

function paneNavigation(nextPane, oldPane, from) {
  setTimeout(function () {
    oldPane[0].style.position = "absolute";
    oldPane[0].classList.remove("in-transition");
    oldPane[0].classList.add("out-transition");
    oldPane[0].classList.remove("animate");
  }, 0);
  setTimeout(function () {
    nextPane[0].style.position = "relative";
    nextPane[0].classList.remove("out-transition");
    nextPane[0].classList.add("in-transition");
    nextPane[0].classList.add("animate");
  }, 600);
  $(".sector-wrapper")[0].style.height = nextPane[0].clientHeight + "px";

  if (from == 0) {
    setTimeout(function () {
      $(".back-btn")[0].classList.add("in-transition");
      $(".back-btn")[0].classList.add("animate");
    }, 600);
  } else {
    $(".back-btn")[0].classList.add("out-transition");
    $(".back-btn")[0].classList.remove("animate");
  }
}

$(".more .icons div > a").on("click", function (e) {
    e.preventDefault();
  var clickedClass = $(this).parent().attr("class");

  if (clickedClass == "publications") {}

  var nextPane = $("#" + clickedClass);
  var oldPane = $(".pane-active");
  oldPane.removeClass("pane-active");
  nextPane.addClass("pane-active");
  paneNavigation(nextPane, oldPane, 0);
});
$(".back-btn").on("click", function (e) {
  e.preventDefault();
  var nextPane = $(".sector-wrapper .main-pane");
  var oldPane = $(".pane-active");
  console.log(oldPane);
  oldPane.removeClass("pane-active");
  nextPane.addClass("pane-active");
  paneNavigation(nextPane, oldPane, 1);
});

function generateRandomNumber(min_value, max_value) {
  var random_number = Math.random() * (max_value - min_value) + min_value;
  return Math.floor(random_number);
}

function loopFigures() {
  if (figuresLeft.length == 0) {
    figuresLeft = Array.from($(".items figure"));
  }

  $(".items figure").removeClass("hover");
  var num = generateRandomNumber(0, figuresLeft.length);
  var row = $(figuresLeft[num]);
  row.addClass("hover");
  figuresLeft.splice(num, 1);
}

$(document).ready(function () {
  figuresLeft = Array.from($(".items figure"));
  loopFigures();
  var loopinterval = setInterval(loopFigures, 1500);
  $(".items figure").on("mouseover", function () {
    clearInterval(loopinterval);
    figuresLeft = Array.from($(".items figure"));
    $(".items figure").removeClass("hover");
  });
  $(".items figure").on("mouseout", function () {
    loopFigures();
    loopinterval = setInterval(loopFigures, 1500);
  });
  var type_inst = new TypeIt("#typing", {
    loop: true,
    strings: ["builds websites.", "builds bots.", "builds cms.", "fixes wordpress problems.", "writes api.", "writes scrapers.", "deploys docker containers.", "writes python scripts."],
    lifeLike: true,
    cursorChar: "",
    breakLines: false,
    deleteSpeed: 60,
    nextStringDelay: [300, 1000]
  }).go();
});

function createModal(title, images, entry) {
  var modalHtml = " <div id = \"modal1\" class = \"modal\">\n\n                  <!--Modal content--><div class = \"post modal-content\">\n                  <span class = \"close\"> & times;\n  </ span><h1 class = 'title'> ".concat(title, "</ h1><div class = 'content'>");

  if (images.length > 0) {
    modalHtml += "<div class = 'images'>";

    for (var _i = 0; _i < images.length; _i++) {
      modalHtml += "<img src = '".concat(images[_i], "'>");
    }

    modalHtml += "</ div>";
  }

  modalHtml += "<div class = 'entry'> ".concat(entry, "</ div></ div>\n      <div class = 'bigCloseBtn'><button> Close</ button></ div></ div></ div>\n\n      </ div>");
  $("body").append(modalHtml);
  $("#modal1").css("display", "block");
  $(".modal .bigCloseBtn").on("click", function () {
    $(".modal").remove();
  });
}

$(document).ready(function () {
  $("figure figcaption button.popout").on("click", function (e) {
    e.preventDefault();
    var main = $(this).parent().parent().parent();
    var title = main.find("figcaption h3").text();
    var images = main.find(".hidden-info .images img").map(function (element) {
      return element.getAttribute("src");
    });
    var entry = main.find(".hidden-info .entry").html();
    createModal(title, images, entry);
  });
});
$(document).on("click", function (event) {
  if (!$(event.target).closest(".modal-content, figcaption button").length) {
    $("body").find("#modal1").remove();
  }
}); // Form Ajax submit

function urlConstruct(endpoint, data) {
  var url = endpoint + "?";

  for (var key in data) {
    url += key + "=" + encodeURI(data[key]) + "&";
  }

  return url.slice(0, -1);
}

$(document).ready(function (e) {
  $("form.contact-form").on("submit", function (event) {
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
        name: name,
        email: email,
        message: message,
        subject: subject
      };
      url = urlConstruct($(this).attr("action"), inputdata);
      ajax_get(url, function (data) {
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

  xmlhttp.onreadystatechange = function () {
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
} // TweenLite.to(".main-pane", 0.5, {css : {maxHeight : 500}});
