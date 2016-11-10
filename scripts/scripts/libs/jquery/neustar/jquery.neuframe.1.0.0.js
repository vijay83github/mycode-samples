/*!
 * jQuery Neuframe v1.0.0
 *
 * Dependencies:
 *     jQuery core
 */
(function($) {

	$.fn.neuframe = function( options ) {
        var horizonServiceOrigins = {
            // !!! do not use relative path below
            /*local: "http://localhost:8080",
            dev:   "http://neu.quova.com",
            qa:    "http://platformqa01.qa.quova.com",
            stage: "https://ipintelligence-stage.neustar.biz",
            prod:  "https://ipintelligence.neustar.biz"*/
        };

        var init = function(el) {
            var settings = $.extend({}, $.fn.neuframe.defaults, options);
            var url, origin, appName;
            var env = "dev";

            if(settings.env && (settings.env == "local" || settings.env == "dev" ||
                settings.env == "qa" || settings.env == "stage" || settings.env == "prod")) {
                env = settings.env;

                if(env == "prod" || env == "stage") {
                    //document.domain = "neustar.biz"
                }
            }

            if(!settings.appName.length) {
                alert("appName is required.");
                return;
            }

            if(!settings.appName) {
                alert("appName is invalid.");
                return;
            } else {
                if(settings.appName == "login") {
                    appName = "login"
                } else if(settings.appName == "registration") {
                    appName = "registration"
                } else {
                    alert("Invalid appName!");
                }
            }

            if(!settings.productId.length) {
                alert("productId is required.");
                return;
            }

            url = horizonServiceOrigins[env]+"/apps/"+appName+"?CL="+settings.productId+"&e=1&orig="+
                window.location.protocol+'//'+window.location.host;
            origin = horizonServiceOrigins[env];

            var iframe = $('<iframe />', {
                name: settings.name,
                id: settings.id,
                src: url,
                width: settings.width,
                height: settings.height,
                frameBorder: 0
            }).appendTo($(el).empty());

            /**
             * Receive message from embed widget
             */
            jQuery.receiveMessage(
                function(e) {
                    var data = e.data? deserialize(e.data) : "";

                    if(data.status == "init") {
                        // If initCallback function has defined
                        if(settings.initCallback) {
                            settings.initCallback({});
                        }

                        var initPost = function(){
                            jQuery.postMessage({status: "init", cookies: settings.cookies.data}, url,
                                iframe.get(0).contentWindow);
                        };

                        // If cookies object has defined
                        if(settings.cookies) {
                            if(settings.cookies.wait) {
                                setTimeout(initPost, settings.cookies.wait);
                            } else {
                                initPost();
                            }
                        }
                    }

                    if(data.status == "success" && settings.successCallback) {
                        if(settings.successCallback(data)) {
                            if(appName == "login") {
                                parent.location = decodeURIComponent(data.redirectUrl);
                            }

                            if(appName == "registration") {
                                parent.location = decodeURIComponent(data.redirectUrl);
                            }
                        }
                    }

                    if(data.status == "fail" && settings.failureCallback) {
                        settings.failureCallback(data);
                    }
              }, origin);

        };

        this.each (
            function(){ init(this); }
        );


        var deserialize = function(p) {
            var ret = {},
                seg = p.replace(/^\?/,'').split('&'),
                len = seg.length, i = 0, s;
            for (;i<len;i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        };

    };

    // default values
    $.fn.neuframe.defaults = {
        name: "",
        id: "",
        width: '340px',
        height: "auto",
        appName: "",
        productId: "",
        initCallback: function(data) {
            return true;
        },
        successCallback: function(data) {
            return true;
        },
        failureCallback: function(data) {
            return true;
        }
    };

})(jQuery);