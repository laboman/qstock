/*global console,jQuery,$,alert*/


function insertAd(imgsrc, href) {
    "use strict";
    // var banner = '<div><a href="#" onclick="' + "window.open('" + href + "', '_system');" + '"><img src="' + imgsrc + '"</a></div>';
    var banner = "<div><a onclick='navigator.app.loadUrl(" + '"' + href + '"' + ", {openExternal : true})' href='javascript:void(0)'>" + '<img src="' + imgsrc + '"></a></div>';

    $("#banner").append(banner);
}


                    
function start_banner() {
    "use strict";
    var addToShow;
    
    addToShow = Math.floor(Math.random() * 4) + 1;
    
    switch (addToShow) {
    case 1:
        insertAd("img/banners/vihreavirta_mobiilimainos2.png", "http://www.pohjoistavoimaa.fi/sahkotarjous");
        break;
    case 2:
        insertAd("img/banners/Sale_verkkokauppa_480x60.jpg", "http://Foodie.fi/oulu");
        break;
    case 3:
        insertAd("img/banners/kaleva-qstock-kampanja-mobiilisovellus-480x60px.gif", "http://www.kaleva.fi/qstock/");
        break;
    case 4:
        insertAd("img/banners/480x60.jpg", "https://www.op.fi/op?id=81201&panknro=574000");
        break;
    }
}
