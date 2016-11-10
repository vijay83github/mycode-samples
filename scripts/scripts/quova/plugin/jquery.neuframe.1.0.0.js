/*!
 * jQuery Neuframe v1.0.0
 *
 * Dependencies:
 *     jQuery core
 */
(function($) {

	$.fn.neuframe = function( options ) {
        var appServiceOrigins = {
           /* dev:   "http://localhost:8080",
            stage: "https://ipintelligence-stage.neustar.biz",
            prod:  "https://ipintelligence.neustar.biz"*/
        };

        var init = function(el) {
            var settings = $.extend({}, $.fn.neuframe.defaults, options);
            var url, origin, appName;
            var env = "dev";

            if(settings.env && (settings.env == "stage" || settings.env == "dev" || settings.env == "prod")) {
                env = settings.env;
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
            url = appServiceOrigins[env]+"/apps/"+appName+"?CL="+settings.productId+"&e=1&orig="+
                window.location.protocol+'//'+window.location.host;
            origin = appServiceOrigins[env];

            var iframe = $('<iframe />', {
                name: settings.name,
                id: settings.id,
                src: url,
                width: settings.width,
                height: settings.height,
                frameBorder: 0
            }).appendTo(el);

            $.receiveMessage(
                function(e) {
                    var data = e.data? deserialize(e.data) : "";

                    if(data.status == "success" && settings.successCallback) {
                        if(settings.successCallback(data)) {
                            if(appName == "login") {
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
        successCallback: function(data) {
            return true;
        },
        failureCallback: function(data) {
            return true;
        }
    };

})(jQuery);