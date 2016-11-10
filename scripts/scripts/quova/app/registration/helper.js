(function() {
    quova.platform.app.registration.Helper = {
        /**
         * createFieldTooltip
         * @param options element, text, invalid, render, events
         */
        createFieldTooltip: function(options) {
            var element = $(options.element);
            var tooltipText =  options.text;
            var cssClass = options.invalid? "tooltip-error" : "";
            var position = {
                my: 'left center',
                at: 'right center',
                target: element
            };

            // cleanup previous instance
            element.qtip("destroy");

            if(!tooltipText || !tooltipText.length) {
                return;
            }

            if(options.invalid) {
                tooltipText = '<span class="'+cssClass+'">'+tooltipText+'</span>'
            }

            if(options.invalid && element.attr("name") == "password") {
               tooltipText += '<div class="qtip-password-example margin-top-5px">' +$("#password").attr("tooltip")+'</div>';
            }

            if(horizon.app.Utils.getUrlVars()["e"] == "1") {
                position.my = "bottom right";
                position.at = "top center";
                position.adjust = {y: -5};
            }

            // find validate icon and set up tooltip
            var $target = element.next(".validate-icon");
            if ($target.length) {
                 var _position = position;
                _position.target = $target;

                $target.qtip({
                    content: {text: tooltipText},
                    show: {
                        event: 'mouseover',
                        solo: true,
                        delay: 300
                    },
                    hide: {
                        event: 'mouseout',
                        fixed: true,
                        delay: 300
                    },
                    position: _position,
                    style: {
                        classes: 'ui-tooltip-light ui-tooltip-shadow ui-tooltip-rounded'
                    },

                    events: options.events? options.events : {}
                });
            }
            // set up tooltip on the field

            var stayOnShow = $(element).hasClass("loginId invalid");

            element.qtip({
                content: {text: tooltipText},
                show: {
                    ready: stayOnShow,
                    event: 'focus',
                    solo: true,
                    delay: 300
                },
                hide: {
                    when: true,
                    event: 'blur',
                    fixed: true,
                    delay: 300
                },
                position: position,
                style: {
                    classes: 'ui-tooltip-light ui-tooltip-shadow ui-tooltip-rounded'
                },

                events: options.events? options.events : {}
            });

            if(options.render && options.render == true) {
                element.qtip("show");
            }
        }
    }
})();
