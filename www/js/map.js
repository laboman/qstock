/*global alert, deg2rad, $, console*/

// #1 TÄHÄN KOORDINAATIT KARTOISTA
// Vaikkapa http://kansalaisen.karttapaikka.fi/koordinaatit/koordinaatit.html?map.x=401&map.y=457&e=428693&n=7210432&scale=8000&tool=siirra&styles=normal&lang=fi&showSRS=EPSG%3A3067&tool=siirra&lang=fi
// ja sieltä "Muunna"
// http://kansalaisen.karttapaikka.fi/koordinaatit/muunnos.html?x=428895&y=7210118&srsName=EPSG%3A3067&lang=fi
// Tuolta ETRS89 maantiet. koord. (~WGS84) ja sieltä "65.00731315" ja "25.49162927" kuten alla laitettu festareille_coords.

var qstock_coords = { top_lat : 65.02377081, top_lon : 25.4545248,
                     bot_lat : 65.01689648, bot_lon : 25.4702675 };

var festareille_coords = { top_lat : 65.02260126, top_lon : 25.45425279,
                     bot_lat : 65.00731315, bot_lon : 25.49162927 };

var nallikariin_coords = { top_lat : 65.03345872, top_lon : 25.40617949,
                     bot_lat : 65.01135335, bot_lon : 25.47234598 };

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    "use strict";
    var R, dLat, dLon, a, c, d;
    R = 6371; // Radius of the earth in km
    dLat = deg2rad(lat2 - lat1);  // deg2rad below
    dLon = deg2rad(lon2 - lon1);
    a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    "use strict";
    return deg * (Math.PI / 180);
}

function setMap(view) {
    "use strict";
    $("#map-qstock").hide();
    $("#map-festareille").hide();
    $("#map-nallikariin").hide();
    $("#map-info").hide();
    if (view === 'info') {
        $("#map-info").show();
        $("#maparea").hide();
        $("#map-pos").hide();
    } else if (view === 'nallikariin') {
        $("#map-nallikariin").show();
        $("#maparea").show();
    } else if (view === 'festareille') {
        $("#map-festareille").show();
        $("#maparea").show();
    } else {
        $("#map-qstock").show();
        $("#maparea").show();
    }
}

function getDistanceString(coords) {
    "use strict";
    var distance, lat_diff, long_diff, direction, k;
    distance = getDistanceFromLatLonInKm(coords.latitude, coords.longitude, 65.02002987, 25.46251017);
    
    distance = Math.round(distance);
    // Positive value indicated we are south from Qstock
    lat_diff = 65.02002987 - coords.latitude;
    
    // Positive value indicated we are west from Qstock
    long_diff = 25.46251017 - coords.longitude;

    if (lat_diff === 0) {
        if (long_diff < 0) {
            direction = "länteen";
        } else {
            direction = "itään";
        }
    } else if (lat_diff > 0) {
        k = long_diff / lat_diff;
        if (k < -2.0) {
            direction = "länteen";
        } else if (k < -0.5) {
            direction = "luoteeseen";
        } else if (k < 0.5) {
            direction = "pohjoiseen";
        } else if (k < 2.0) {
            direction = "koiliseen";
        } else {
            direction = "itään";
        }
    } else {
        k = long_diff / -lat_diff;
        if (k < -2.0) {
            direction = "länteen";
        } else if (k < -0.5) {
            direction = "lounaaseen";
        } else if (k < 0.5) {
            direction = "etelään";
        } else if (k < 2.0) {
            direction = "kaakkoon";
        } else {
            direction = "itään";
        }
    }
// #2 VIESTI KUN EI OLLA MINKÄÄN KARTAN ALUEELLA
    return 'QStock on noin ' + distance + ' kilometriä ' + direction + '.';
}

function inside(coords, rect) {
    "use strict";
    if (((coords.latitude < rect.top_lat) && (coords.latitude > rect.bot_lat)) &&
            ((coords.longitude < rect.bot_lon) && (coords.longitude > rect.top_lon))) {
        return true;
    } else {
        return false;
    }
}

function posLeft(coords, rect) {
    "use strict";
    var pos, width, x;
    
    pos = Math.floor(((coords.longitude - rect.top_lon) / (rect.bot_lon - rect.top_lon)) * 1000) - 25;

    width = $("#maparea").width();
    
    x = (pos - (width / 2.0));
    if (x < 0) {
        x = 0;
    } else if (x > (1000 - width)) {
        x = (1000 - width);
    }

    $("#maparea").scrollLeft(x);

    if (pos < 0) {
        pos = 0;
    } else if (pos > (1000 - 50)) {
        pos = (1000 - 50);
    }

    return pos;
}

function posTop(coords, rect) {
    "use strict";
    var pos, height, y;
    
    pos = Math.floor((1 - ((coords.latitude - rect.bot_lat) / (rect.top_lat - rect.bot_lat))) * 1000) - 25;

    height = $("#maparea").height();

    y = (pos - (height / 2.0));
    if (y < 0) {
        y = 0;
    } else if (y > (1000 - height)) {
        y = (1000 - height);
    }
    
    $("#maparea").scrollTop(y);

    if (pos < 0) {
        pos = 0;
    } else if (pos > (1000 - 50)) {
        pos = (1000 - 50);
    }
    
    return pos;
}

var onSuccess = function (position) {
    "use strict";
    var coords;

    coords = position.coords;

    // TEST COORDS
    //coords = { accuracy: 10, latitude: 65.02377080, longitude: 25.4545249 }; // QSTOCK TOP LEFT;
    // coords = { accuracy: 10, latitude: 65.01689650, longitude: 25.4702674 }; // QSTOCK BOTTOM RIGHT;
    //var coords = { accuracy: 10, latitude: 65.019, longitude: 25.461 }; // QSTOCK MIDDLE;


    // #3 EPÄTARKAN PAIKKATIEDON MÄÄRITTELY, ALLA 100 metriä
    if (coords.accuracy > 1000) {
        // #4 VIESTI KUN PAIKKATIETO LIIAN EPÄTARKKA
        alert('Paikkatieto epätarkka, odota että puhelin tarkentaa paikkatietoa ja yritä uudelleen');
    } else {
        if (inside(coords, qstock_coords)) {
            setMap("qstock");
            $("#map-pos").show();
            $("#map-pos").css('top', posTop(coords, qstock_coords));
            $("#map-pos").css('left', posLeft(coords, qstock_coords));
        } else if (inside(coords, festareille_coords)) {
            setMap("festareille");
            $("#map-pos").show();
            $("#map-pos").css('top', posTop(coords, festareille_coords));
            $("#map-pos").css('left', posLeft(coords, festareille_coords));
        } else if (inside(coords, nallikariin_coords)) {
            setMap("nallikariin");
            $("#map-pos").show();
            $("#map-pos").css('top', posTop(coords, nallikariin_coords));
            $("#map-pos").css('left', posLeft(coords, nallikariin_coords));
        } else {
            alert(getDistanceString(coords));
        }
    }
};

function onError(error) {
    "use strict";
    // #5 VIESTI KUN PAIKKATIETOA EI SAADA OLLENKAAN
    alert('Paikkatietoa ei saatu, tarkista puhelimenasetukset ja yritä uudelleen.');
}

function setMyPos() {
    "use strict";
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

function maploaded() {
    "use strict";
}

function setMiddle() {
    "use strict";
    $("#maparea").scrollLeft(350);
    $("#maparea").scrollTop(350);
}

function map_init() {
    "use strict";
    setMap("");
    $("#map-pos").hide();
    setTimeout(setMiddle, 500);
}