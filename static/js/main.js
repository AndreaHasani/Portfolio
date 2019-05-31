// Global variables because of, why not
var user_ip, user_interaction, user_location;
var user_referrer = document.referrer;
var nav_clicked_id;
user_interaction = {
    "arrow_click": false,
    "resume": false,
    "publications": false,
    "side_projects": false,
    "contact_me": false,
};

// Cookie functions
function setCookie(name, value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}

function ipLookUp () {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://ipapi.co/json/');
    xhr.onload = function() {
	if (xhr.status === 200) {
	    let response = JSON.parse(xhr.responseText);
	    user_ip = response.ip;
	    user_location = response.city + ", " + response.country_name;
	}
	else {
	    return false;
	}
    };
    xhr.send();
}

$(document).ready(function () {
  var main_height = $(".sector-wrapper")[0].clientHeight;
  document.getElementsByClassName("sector-wrapper")[0].style.height = main_height + "px";
});
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

var scroll = new SmoothScroll('a.nav_a', {
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


$(".nav_a").on("click", function (e) {
    nav_clicked_id = $(this).attr("data-goto");
});

$(".more .icons div > a").on("click", function (e) {
    e.preventDefault();
  var clickedClass = $(this).parent().attr("class");

  if (clickedClass == "publications") {}
    user_interaction[clickedClass] = true;
    user_interaction["active_pane"] = clickedClass;

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
  oldPane.removeClass("pane-active");
  nextPane.addClass("pane-active");
    user_interaction["active_pane"] = "about";
  paneNavigation(nextPane, oldPane, 1);
});

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
  var type_inst = new TypeIt("#typing", {
    loop: true,
    strings: ["builds websites.", "builds bots.", "builds cms.", "fixes wordpress problems.", "writes api.", "writes scrapers.", "deploys docker containers.", "writes python scripts."],
    lifeLike: true,
    cursorChar: "",
    breakLines: false,
    deleteSpeed: 60,
    nextStringDelay: [600, 400]
  }).go();
});

function displayMenu() {

    var navbar = document.getElementById("nav");
    var icon = document.getElementById("navbar_icon");
    if (navbar.className === "navbar") {
        icon.className += " change";
        navbar.className += " responsive";
    } else {
        icon.className = "icon";
        navbar.className = "navbar";
    }
}

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

function sendStats(arrayData){
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      console.log("responseText:" + xmlhttp.responseText);
      try {
        var data = JSON.parse(xmlhttp.responseText);
      } catch (err) {
        console.log(err.message + " in " + xmlhttp.responseText);
        return;
      }
    }
  };

    xmlhttp.open("POST", "/stats");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(arrayData));
}

window.onbeforeunload = function(){
    let not_new_user = getCookie(user_ip);
    if (not_new_user) {
	return;
    }
    else {
	setCookie(user_ip,1,7);
      sendStats({"user_ip": user_ip, "user_location": user_location, "user_referrer": user_referrer, "user_interaction": user_interaction});
    }
};

$(document).ready(function (e) {
ipLookUp();
    document.addEventListener('scrollStart', function(e) {
	user_interaction['arrow_click'] = true;
	user_interaction['active_pane'] = "About";
    }, false);


    document.addEventListener('scrollStop', function(e) {
	console.log(nav_clicked_id);
	if (nav_clicked_id != null) {
	    if (nav_clicked_id == "publications") {}
	    user_interaction[nav_clicked_id] = true;
	    user_interaction["active_pane"] = nav_clicked_id;

	    var nextPane = $("#" + nav_clicked_id);
	    var oldPane = $(".pane-active");
	    oldPane.removeClass("pane-active");
	    nextPane.addClass("pane-active");
	    paneNavigation(nextPane, oldPane, 0);
	}
    }, false);
});
