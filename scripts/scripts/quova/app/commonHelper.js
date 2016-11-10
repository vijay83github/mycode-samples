define([
    "jquery.fancybox",
    "datejs"
], function() {

    quova.platform.app.CommonHelper = {
        /**
         * Clear server-side message or this.message node
         */
        /*clearUserMessage: function() {
            $("#message-bar").slideUp(function() {
                $(this).find(".message-article").hide();
                $(this).find(".message").html("");
            });

            $("#user-message").fadeOut("slow");
        },

        showUserMessage: function(message, autoClose) {
            var self = this;
            this.clearUserMessage();

            $("#message-bar").slideDown(function()  {
                $(this).find(".message").html(message);
                $(this).find(".message-article").show();

                if(autoClose) {
                    setTimeout(function() { self.clearUserMessage(); }, 5000);
                }
			 });
        },*/

        /*
         * Common dialogue() function that creates our dialogue qTip.
         * We'll use this method to create both our prompt and confirm dialogues
         * as they share very similar styles, but with varying content and titles.
         */
        dialogue: function(content) {

            $.fancybox($("<div></div>").html(content).html(), {
                'transitionIn': 'none',
                'transitionOut': 'none',
                'centerOnScroll': true,
                'autoDimensions': false,
                'width': 400,
                'height': 'auto'
                //'autoScale': true
            });

        },

        showAlertErrorMessage: function (message, title) {
            var htmlStr = "";

            if(title) {
                htmlStr += '<h6 class="green-header-bar normal ui-corner-all">'+title+'</h6>';
            }

            htmlStr += '<p class="error padded_15">'+message+'</p>';

            this.dialogue(htmlStr);
        },

        getUrlVars: function() {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

            for(var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }

            return vars;
        },

        epochToDate: function(epochTime, format) {
            if(!epochTime) {
                return "";
            }
	        // default date format
	        if (!format || format === "") {
		        format = "MM/dd/yyyy";
	        }

	        var mEpoch = parseInt(epochTime);
            if(mEpoch<10000000000) mEpoch *= 1000; // convert to milliseconds (Epoch is usually expressed in seconds, but Javascript uses Milliseconds)
            var dateFromEpoch = new Date(mEpoch);

	        return dateFromEpoch.toString(format);
        }

        /*getAbsolutePath: function() {
            var loc = window.location;
            var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
            return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
        }*/
    };

    return quova.platform.app.CommonHelper;
});
