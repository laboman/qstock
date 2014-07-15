/*global console,jQuery,$,alert*/


function insertAd(imgsrc, href) {
    "use strict";
    var banner = "<div><a onclick='openexturl(" + '"' + href + '"' + ")' href='javascript:void(0)'>" + '<img src="' + imgsrc + '"></a></div>';
    $("#banner").append(banner);
}

function openexturl(url) {
    // USE THIS WHEN ON #IOS
    window.open(url, "_system", "location=yes");
    // #IOS ENDS

    // USE THIS WHEN ON #ANDROID 
//    navigator.app.loadUrl(url, {openExternal : true});
}
                    
function start_banner() {
    "use strict";
    var addToShow;
    
    addToShow = Math.floor(Math.random() * 5) + 1;
    
    switch (addToShow) {
    case 1:
        insertAd("img/banners/vihreavirta_mobiilimainos2.png", "http://www.pohjoistavoimaa.fi/sahkotarjous");
        break;
    case 2:
        insertAd("img/banners/Sale_verkkokauppa_480x60.jpg", "http://Foodie.fi/oulu");
        break;
    case 3:
        insertAd("img/banners/kaleva-kesakampanja2014-qstock-mobiilisovellus-480x60px.gif", "http://kampanjat.kaleva.fi/index.cfm?kes14m");
        break;
    case 4:
        insertAd("img/banners/480x60.jpg", "https://www.op.fi/op?id=81201&panknro=574000");
        break;
    case 5:
        insertAd("img/banners/qstock-app_samsung_galaxy_s5_480x60.png", "https://www.dna.fi/samsung-galaxy?utm_source=qstock-app&utm_medium=display&utm_campaign=samsung_galaxy_s5&utm_content=");
        break;
    }
    
}
