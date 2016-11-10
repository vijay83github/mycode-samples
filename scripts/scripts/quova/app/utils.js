define([
    "jquery.fancybox",
    "datejs",
    'jquery.reject'
], function() {

    horizon.app.Utils = {
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
        dialogue: function(content, callback) {
            $.fancybox($("<div></div>").html(content).html(), {
                'transitionIn': 'none',
                'transitionOut': 'none',
                'centerOnScroll': true,
                'autoDimensions': false,
                'width': 400,
                'height': 'auto',
                'onClosed': function() {
                    if(callback){
                        callback();
                    }
                }
            });
        },

        showAlertErrorMessage: function (message, title, callback) {
            var htmlStr = "";

            if(title) {
                htmlStr += '<h6 class="green-header-bar normal ui-corner-all">'+title+'</h6>';
            }

            htmlStr += '<p class="error padded_15">'+message+'</p>';

            this.dialogue(htmlStr, callback);
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
        },
        
        /*addProductNameAndURLToFooter: function(buyUrl,productUrl,productName){
        	*//*console.log('In the UTIL JS');
        	console.log('test'+buyUrl);
        	console.log('test'+productUrl);
        	console.log('test'+productName);*//*
        	if(buyUrl==null) {
        		var productId = this.getUrlVars()['CL'];
        		$.getJSON("/apps/admin/config/"+ productId,function(data){
        			$('#anchorBuyProductURL').attr('href',data.productBuyUrl != '' ? data.productBuyUrl : '#');     
        		});
        	}else{
    			 $('#anchorBuyProductURL').attr('href',buyUrl);
    		}
        	if(productName==null){
				var productId = this.getUrlVars()['CL'];
	    		console.log('Blank data found: '+productId);
	    		$.getJSON("/apps/admin/config/"+ productId,function(data){
	            $('#anchorProductServiceURL').text('');
	    		});
        	}else{
        			$('#anchorProductServiceURL').attr('href',productUrl);
                    $('#anchorProductServiceURL').text(productName);
        	}
        	
        	*//*console.log('In the UTIL JS');
        	if(buyUrl== "" || productUrl == "" || productName == ""){
        		var productId = this.getUrlVars()['CL'];
        		console.log('Blank data found: '+productId);
        		$.getJSON("/apps/admin/config/"+ productId,function(data){
        			$('#anchorBuyProductURL').attr('href',data.productBuyUrl != '' ? data.productBuyUrl : '#');        			
                	$('#anchorProductServiceURL').attr('href',data.productServiceUrl != '' ? data.productServiceUrl : '#');
                    $('#anchorProductServiceURL').text(data.productName);
        		});
        	} else {        		
                $('#anchorBuyProductURL').attr('href',buyUrl);
            	$('#anchorProductServiceURL').attr('href',productUrl);
                $('#anchorProductServiceURL').text(productName);
        	}*//*
        },
        */
        checkBrowser: function(){
            var browsers = $.parseJSON($.cookie().browsers);
            console.log(browsers);
            $.reject({
                display: ['firefox', 'chrome', 'safari', 'msie'],
                browserInfo: {
                    firefox: {
                        text: 'Firefox ' + browsers.firefoxVersion,
                        url: 'http://www.mozilla.com/firefox/'
                    },
                    safari: {
                        text: 'Safari ' + browsers.safariVersion,
                        url: 'http://www.apple.com/safari/download/'
                    },
                    msie: {
                        text: 'Internet Explorer ' + browsers.msieVersion,
                        url: 'http://www.microsoft.com/windows/Internet-explorer/'
                    },
                    chrome: {
                        text: 'Chrome ' + browsers.chromeVersion,
                        url: 'http://www.google.com/chrome/'
                    }
                },
                imagePath: '/apps/resources/images/browsers/',
                closeCookie: true,
                reject: {
                    msie7: true, msie8: true, msie9: false, msie10: false,
                    opera: true, konqueror: true,
                    safari1: true, safari2: true, safari3: true, safari4: true, safari7: false,

                    chrome1: true, chrome2: true, chrome3: true, chrome4: true,
                    chrome5: true, chrome6: true, chrome7: true, chrome8: true,
                    chrome9: true, chrome10: true, chrome11: true, chrome12: true,

                    firefox1: true, firefox2: true, firefox3: true,
                    unknown: false
                }
            });
        }
    };

    return horizon.app.Utils;
});
