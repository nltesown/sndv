"use strict";

$(run);

function run() {
  var $container = $(".container");
  var $titles = $(".titles");
  var $share = $(".share");
  var $refresh = $(".refresh");


  $titles.hide();
  $share.hide();

  $.getJSON("data/cities.json").success(function (cities) {
    var venise, calcutta, de, initial;
    $refresh.one("click", playOut);
    playIn();
    initial = $("body").data("initial"); // Initial pair of cities

    function cityFromCookie(i) { // i: 0, 1
      var arr, city;
      try {
        arr = JSON.parse(Cookies.get("cities" + i));
        if (arr.length === 0) throw true;
      } catch (e) {
        arr = _.shuffle(_.map(_.clone(cities[i]), function (n, i) { return {i: i, n: n}; }));
        Cookies.set("cities" + i, JSON.stringify(arr), { expires: 60 * 60 * 24 });
      }

      // A TESTER
      if (initial && initial[i]) {
        arr.push(initial[i]);
        initial[i] = null;
      }

      city = arr.pop();
      console.log("city:", city);
      Cookies.set("cities" + i, JSON.stringify(arr), { expires: 60 * 60 * 24 });
      return city;
    }

    function playOut() {
      $refresh.addClass("fa-spin");
      window.setTimeout(function () {
        $titles.fadeOut(25);
        window.setTimeout(function () {
          playIn();
        }, 500);
      }, 1000);
    }

    function playIn() {
      window.setTimeout(function () {
        venise = cityFromCookie(0); // Get fresh data and put them on stage
        calcutta = cityFromCookie(1);
        de = ("AEIOU".indexOf(venise.n.substring(0, 1).toUpperCase()) !== -1) ? "<br/>d'" : " de<br/>";
        $titles.html(replaceApos(formatSpacing("<h1>Son nom" + de + venise.n + "<br/>dans<br/>" + calcutta.n + "<br/>" + "desert</h1><h2>Visa n°&thinsp;" + visaPrint(visa(venise, calcutta)) + "</h2>")));
        $refresh.removeClass("fa-spin"); // Animate

        // history.replaceState(null, "", "?visa=" + visa(venise, calcutta));
        history.replaceState(null, "", visa(venise, calcutta));

        window.setTimeout(function () {
          $refresh.one("click", playOut);
          $titles.fadeIn(50);
        }, 500);
        window.setTimeout(function () { // First run only (TODO: put it out of the way)
          $share.fadeIn(25);
        }, 2000);
      }, 0);
    }



  });
}

function formatSpacing(s) {
  return s.replace(/(.)([-'])/gi, "<span class=\"thin\">$1$2</span>");
}

function replaceApos(s) {
  return s.replace("'", "’");
}

function visa(venise, calcutta) {
  return "4" + pad(venise.i, 2) + pad(calcutta.i, 2);
}

function visaPrint(visa) {
  return visa.substr(0, 2) + "&thinsp;" + visa.substr(2);
}

function pad(num, size) {
  return ("00" + num).substr(-size);
}

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function deaccent(instr) {
  return _.map(instr, function (c) {
    var p = _.indexOf("àáâãäåçèéêëìíîïñòóôõöùúûüýÿ", c);
    return (p === -1 ? c : "aaaaaaceeeeiiiinooooouuuuyy"[p]);
  }).join("").trim();
}

