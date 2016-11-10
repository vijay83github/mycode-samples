define([
  "jquery.i18n",
  "app.protocol",
  "jquery.validate",
  'jquery.qtip'
], function() {
  quova.platform.admin.views.ViewManager = {

      // div which contains the wait indicator (spinner)
      //load_indicator : $('#app-loader'),

      initialize: function() {
        debug.debug("ViewManager.initialize");

        this.initFormValidator();

        $.fn.serializeFormObject = function(){
          var o = {};
          var a = this.serializeArray();
          $.each(a, function() {
            if (o[this.name] !== undefined) {
              if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
              }
              o[this.name].push(this.value || '');
            } else {
              o[this.name] = this.value || '';
            }
          });
          return o;
        };

      },

      close: function(view) {
        debug.debug("ViewManager.close");
          if(!view) return;

          view.$el.html("");
          view.unbind();

      },

      remove: function(view) {
          if(!view) return;

          view.remove();
          view.unbind();

      },

      removeNewEditView: function(callback) {
          if($.ui.neuoverlay && $.ui.neuoverlay.instances.length) {
              $('#new-edit-view').neuoverlay("close");
          }

          if(callback) {
              callback();
          }
      },

      showWaitIndicator: function(delayIn) {
        if (typeof delayIn === 'undefined') {
          delayIn = 100;
        }
        this.load_indicator.delay(delayIn).fadeIn();
      },

      hideWaitIndicator: function(delayIn) {
        if (typeof delayIn === 'undefined') {
          delayIn = 400;
        }
        this.load_indicator.delay(delayIn).fadeOut();
      },

      keepSessionAlive: function(scope, opts) {
        var self = this;

        // perform server "keep alive" call
        $.ajax({
          url: quova.platform.app.protocol.portal.KeepAlive,
          //url:"/apps/secure/resources/ok",
          type: "GET",
          cache: false,
          error: function(jqXHR) {
            // session has timed out
            if(jqXHR.status == 901) {
              debug.warn("Session timed out - 901 error.");
              return;

            } else {
              // other server error
              debug.warn("ViewManager.keepSessionAlive; Server error: " + jqXHR.status);
            }
            if (opts.error) {
              if (!scope) {
                scope = null;
              }
              opts.error.apply(scope, jqXHR);
            }

            // force spring mvc redirect
            window.location.reload();
            return;

          },
          success: function() {
            debug.debug("Session still active.");

            // complete the action
            //self._onAssetClicked(evt);

            if (opts.success) {
              if (!scope) {
                scope = null;
              }
              opts.success.apply(scope);
            }
          }
        });
      },

      generateFieldTooltip: function(options) {
        var element = $(options.element);
        var tooltipText =  options.text;
        var cssClass = options.invalid? "tooltip-error" : "";
        var position = {
          my: 'left center',
          at: 'right center',
          target: element
        };

        // remove previous instance
        element.qtip("destroy");

        if(!tooltipText || !tooltipText.length) {
          return;
        }

        if(options.invalid) {
          tooltipText = '<span class="'+cssClass+'">'+tooltipText+'</span>';
        }

        // find validate icon and set up tooltip
        var $parent = element.parents(".field-group");

        if(!$parent.length) {
          $parent = element.closest("td");
        }

        var $target = $parent.find(".validate-icon");

        if ($target.length) {
          var _position = position;
          _position.target = $target;

          $target.qtip({
            content: {text: tooltipText},
            show: {
              event: 'mouseover',
              delay: 300,
              solo: true
            },
            hide: { event: 'mouseout' },
            position: _position,
            style: {
              classes: 'ui-tooltip-light ui-tooltip-shadow ui-tooltip-rounded'
            },

            events: options.events? options.events : {}
          });
        }
        // set up tooltip on the field
        element.qtip({
          content: {text: tooltipText},
          show: {
            event: 'focus',
            delay: 300,
            solo: true
          },
          hide: { event: 'blur' },
          position: position,
          style: {
            classes: 'ui-tooltip-light ui-tooltip-shadow ui-tooltip-rounded'
          },

          events: options.events? options.events : {}
        });

        if(options.render && options.render == true) {
          element.qtip("show");
        }
      },

      // Generic form validation
      initFormValidator: function() {
        // set default validation options
        $.validator.setDefaults({
          errorClass: "invalid",
          validClass: "valid",
          ignore: ":disabled",

          errorPlacement: function(error, placement) {
            debug.debug("qtip placement: ", placement);
            quova.platform.admin.views.ViewManager.generateFieldTooltip({
              invalid: true,
              render: false,
              element: placement,
              text: error.text(),
              events: {
                show: function(event, api) {
                  if(placement.is(":hidden") && !placement.hasClass("tagit-hiddenSelect")) {
                    event.preventDefault(); // Stop it!
                  }
                }
              }
            });
          },

          onclick: function(element, event) {
            // click on selects, radiobuttons and checkboxes
            if ( element.name in this.submitted ){
              this.element(element);
              // or option elements, check parent select in that case
            } else if (element.parentNode.name in this.submitted) {
              this.element(element.parentNode);
            }

            if($(element).attr("type") == "checkbox" || $(element).attr("type") == "radio") {
              this.element(element);
            }
          },

          highlight: function(element, errorClass, validClass) {
            var $field = $(element);
            var parentNode = $field.parent(".field-group");

            if(!parentNode.length) {
              parentNode = $field.closest("td");
            }

            parentNode.removeClass(validClass).addClass(errorClass);

            if($field.val() == 0 && !parentNode.hasClass(errorClass)) {
              parentNode.removeClass(errorClass);
            } else if(parentNode.hasClass(errorClass)) {
              parentNode.removeClass(validClass).addClass(errorClass);
            }
          },

          unhighlight: function(element, errorClass, validClass) {
            var $field = $(element);
            var parentNode = $field.parent(".field-group");

            if(!parentNode.length) {
              parentNode = $field.closest("td");
            }

            parentNode.removeClass(errorClass).addClass(validClass);

            parentNode.removeClass(errorClass);

            /*if($field.hasClass("asterisk")) {
             parentNode.find(".validate-icon").addClass(validClass);
             }*/

            // recreate tooltips for hints
            if(parentNode.hasClass(validClass)) {
              var toolText =  $field.attr("tooltip");
              quova.platform.admin.views.ViewManager.generateFieldTooltip({
                invalid: false,
                render: false,
                element: $field,
                text: toolText
              });
            }
          }
        });

      },

      /**
       * Force a page reload. Depending on the state of the app, this can cause the
       * server to send the login page again. For example, in the case of session expired
       * the error will be trapped and this used as a callback for when a message box is closed.
       * @private
       */
      _closeApp: function() {
      debug.debug("ViewManager._closeApp");
        // force spring mvc redirect
        window.location.reload();
    }
    };

    return quova.platform.admin.views.ViewManager;
});