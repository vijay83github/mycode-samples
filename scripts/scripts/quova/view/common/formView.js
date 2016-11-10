/*!
 * FormView Controller
 */
define([
    'backbone',
    'jquery.validate',
    'app.validator',
    'app.validateRules',
    'app.utils',
    'views/BaseView'
], function() {

    quova.platform.view.common.FormView = quova.platform.view.BaseView.extend({
        viewPort: null,
        processOverlay: null,
        submitLabel: "Submit",

        events: {
        },

        startSubmitIndicator: function(el) {
            var self = this;
            var button = $(el);
            this.submitLabel = button.html();

            if(!button.button) {
                button.attr("disabled", "disabled").html('<span class="ui-button-text">Submitting...</span>');
            } else {
                button.button("disable").html('<span class="ui-button-text">Submitting...</span>');
            }

            // Exit if qtip is not being used.
            if(!$.fn.qtip) return;

            var processQtip = $(this.viewPort).qtip({
                // Any content config you want here really.... go wild!
                content: 'Processing..',
                position: {
                    my: 'top',
                    at: 'center',
                    target: $(window),
                    adjust: { y: 5 },
                    effect: function(api, newPos) {
                        $(this).animate(newPos, {
                            duration: 200,
                            queue: false
                        });
                        api.cache.finalPos = newPos;
                    }
                },
                show: {
                    modal: {
                        on: true, // Make it modal (darken the rest of the page)...
                        blur: false // ... but don't close the tooltip when clicked
                    },
                    ready: true,
                    effect: function() {
                        $(this).stop(0, 1).fadeIn(400);
                    },
                    delay: 0
                },
                hide: false,
                style: {
                    classes: 'jgrowl ui-tooltip-dark ui-tooltip-rounded',
                    tip: false
                },
                events: {
                    hide: function(event, api) { api.destroy(); }
                }
            });

            // Grab the first element in the tooltips array and access it's qTip API
            self.processOverlay = processQtip.qtip('api');

        },

        stopSubmitIndicator: function(el, callback, setTimeout) {
            var self = this;
            var button = $(el);

            var _stopSubmitIndicator = function(){
                if(!button.button) {
                    button.html(this.submitLabel).removeAttr("disabled");
                } else {
                    button.html(this.submitLabel).button("enable");
                }

                button.html('<span class="ui-button-text">'+self.submitLabel+'</span>');

                if(self.processOverlay != null) {
                    self.processOverlay.hide();
                }

                if(callback) {
                    callback();
                }
            };

            if(typeof(timeout) == "undefined" || setTimeout == false) {
                _stopSubmitIndicator();
            } else {
                setTimeout(_stopSubmitIndicator, 3000);
            }

        },

        clear: function() {
            this.model.clear();
        },

        validator: {
            errorClass: "invalid",
            validClass: "valid",
            ignore: ":disabled",

            errorPlacement: function(error, placement) {
                error = error.html()? error.html() : error.text();
                var position = {
                    my: 'left center',
                    at: 'right center',
                    target: placement
                };

                if($("html").hasClass("neuframe")) {
                    // show within the area of iframe
                    $.extend(position, {
                        my: 'top left',
                        at: 'bottom left'
                    });
                }

                placement.qtip({
                    content: {text: '<span class="error">'+error+'</span>'},
                    show: {
                        event: 'focus',
                        solo: true,
                        delay: 300
                    },
                    hide: {
                        fixed: true,
                        event: 'blur',
                        delay: 300
                    },
                    position: position,
                    style: {
                        classes: 'ui-tooltip-light ui-tooltip-shadow ui-tooltip-rounded'
                    },

                    events: {
                        show: function(event, api) {
                            if(placement.hasClass("valid") || placement.is(":hidden")) {
                                event.preventDefault(); // Stop it!
                            }
                        }
                    }
                });
            }
        }


    });

    return quova.platform.view.common.FormView;

});