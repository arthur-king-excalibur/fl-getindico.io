include(ScriptRoot + "fckeditor/fckeditor.js");


if (location.protocol == "https:") {
    var indicoSource = curry(jsonRpcValue, Indico.Urls.SecureJsonRpcService);
    var indicoRequest = curry(jsonRpc, Indico.Urls.SecureJsonRpcService);
    var imageSrc = function (imageId) {return Indico.Urls.SecureImagesBase + '/' + Indico.SystemIcons[imageId] };
} else {
    var indicoSource = curry(jsonRpcValue, Indico.Urls.JsonRpcService);
    var indicoRequest = curry(jsonRpc, Indico.Urls.JsonRpcService);
    var imageSrc = function (imageId) {return Indico.Urls.ImagesBase + '/' + Indico.SystemIcons[imageId] }
}


function getPx(pixVal) {
    var m = pixVal.match(/(\d+)px/);
    return parseInt(m[1], 10);
}


function pixels(val){
    return val + 'px';
}

function zeropad(number) {
    return ((''+number).length == 1)?'0'+number:number;
}


/**
 @namespace IndicoUI interface library
*/

var IndicoUI = {
    // The current used layer level
    __globalLayerLevel : 0,

    // To keep track of all used layer levels.
    // A used level is set to true and level 0 is always used
    __globalLayerLevels : [true],

    /**
     * Set the element's z-index to the top layer
     */
    assignLayerLevel: function(element) {
        if (!exists(element))
            return;
        // Find the highest used layer
        for (var i = this.__globalLayerLevel; i >= 0; i--) {
            if (this.__globalLayerLevels[i]) {
                this.__globalLayerLevel = i;
                break;
            }
        }

        var level = ++this.__globalLayerLevel;
        this.__globalLayerLevels[level] = true;
        element.setStyle('zIndex', this.__globalLayerLevel);
    },
    /**
     * Marks a layer level as unused, call this funtion
     * when closing an element
     */
    unAssignLayerLevel: function(element) {
        if (!exists(element))
            return;
        var level = element.dom.style.zIndex;
        if (level == '') {
            return;
        }
        this.__globalLayerLevels[parseInt(level)] = false;
    },
    __count : 0,
    loadTimeFuncs : {},

    executeOnLoad : function(func) {
        IndicoUI.loadTimeFuncs[IndicoUI.__count] = (func);
        IndicoUI.__count++;
    }
};


$E(document).observeClick(function(e) {

    each(IndicoUtil.onclickFunctions, function(func) {
        if (exists(func)) {
            func(e);
        }
    });

    //two-phase delete, due to loop/delete interactions
    var idxs = [];
    var count = 0;

    each(IndicoUtil.onclickFunctions, function(func) {
        if (func === null) {
            idxs.push(count);
        }
        count++;
    });

    idxs.reverse();

    each(idxs, function(idx) {
        IndicoUtil.onclickFunctions.removeAt(idx);
    });
});

window.onload = function() {
    for (var f in IndicoUI.loadTimeFuncs) {
        IndicoUI.loadTimeFuncs[f]();
    }
};
