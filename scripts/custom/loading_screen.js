var scene_wrapperEl = document.getElementById('scene_wrapper');

var loading_screenEl = document.getElementById('loading_screen');
var loading_textEl = document.getElementById('loading_text');
var loading_barEl = document.getElementById('loading_bar');

var models = [];
var models_number;
var models_loaded = 0;
//builds loading screen when scene is not loaded
function build_loading_screen() {
    loading_textEl.innerHTML = "LOADING SCENE";
    var loading_bar_itemEL = document.createElement('div');
    loading_barEl.appendChild(loading_bar_itemEL);
    loading_bar_itemEL.classList.add("moving_item");
}
//updates loading screen based on models actually loaded
function update_loading_screen() {
    models = document.querySelectorAll('[model-info]')
    models_number = models.length;
    setTimeout( function() { scene_wrapperEl.removeAttribute("style"); }, 10000);
    models_loaded++;
    if (models_loaded == 1) {
        //remove the old bar item when the first model is loaded
        loading_barEl.removeChild(loading_barEl.lastChild);
    }
    loading_textEl.innerHTML = "LOADING MODELS " + Math.round((models_loaded * 100) / models_number) + " %";
    var loading_bar_itemEL = document.createElement('div');
    loading_barEl.appendChild(loading_bar_itemEL);
    loading_bar_itemEL.style.maxWidth = 80 / models_number + "vw";
    loading_bar_itemEL.classList.add("stacking_item");
    if (models_loaded == models_number) {
        scene_wrapperEl.removeAttribute("style");
        loading_screenEl.remove();
    };
}
/*checks if model has loaded before building all of the dinamic content
function start_loading_screen_listeners() {
    models = document.getElementsByClassName("model");
    models_number = models.length;
    for (i = 0; i < models_number; i++) {
        models[i].addEventListener("model-loaded", update_loading_screen)
    }
}*/