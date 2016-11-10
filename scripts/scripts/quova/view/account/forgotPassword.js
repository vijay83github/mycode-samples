/*!
 * FormView Controller
 */
define([
    'view.common.formView',
    'app.utils',
    'app.validator',
    'app.validateRules',
    "jquery.ui",
    "jquery.qtip",
	"jquery.debug"
], function() {
    quova.platform.view.account.ForgotPassword = quova.platform.view.common.FormView.extend({
        el: $('#appview'),

        initialize: function(args) {
	        var self = this;
	        // need to do some clean up when the page is changed
	        $(window).unload(function() {
		        self.stopSubmitIndicator(self.submitButton);
	        });
	      //  horizon.app.Utils.addProductNameAndURLToFooter("","","");
        },

        events: _.extend({
            'click button#submit-address': 'handleSubmit'
        }, quova.platform.view.common.FormView.prototype.events),

        render: function() {
            //$(this.el).html(_.template(this.template));
            var self = this;
            this.form = $('#forgot-password-form');
            this.submitButton = this.form.find('#submit-address').button().css("visibility", "visible");
            this.username = this.form.find('#usernameOrEmail');
            this.username.focus();

            this.form.validate($.extend(self.validator, {
                rules:{
                    userName: {required: true}
                }
            }));
        },

        handleSubmit: function() {
            var self = this;

            self.username.val($.trim(self.username.val()));

            if(!this.form.valid()) {
                return;
            }

            this.form.submit(function() {
                self.startSubmitIndicator(self.submitButton);

            });
        }

    });

    return quova.platform.view.account.ForgotPassword;

});
