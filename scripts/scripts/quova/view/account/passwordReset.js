define([
    'view.common.formView',
    'app.validator',
    'app.validateRules',
    'jquery.ui',
    'jquery.i18n',
    'jquery.passwordStrength',
    'jquery.qtip'
], function() {
    quova.platform.view.account.PasswordReset = quova.platform.view.common.FormView.extend({
        el: $('#appview'),

        initialize: function(args) {
	        var self = this;
	        // need to do some clean up when the page is changed
	        $(window).unload(function() {
		        self.stopSubmitIndicator(self.submitButton);
	        });
        },

        events: _.extend({
            'click button#submit-new-password': 'handleSubmit',
            'focus #new-password': 'showPasswordIndicators',
            'blur #new-password': 'hidePasswordIndicators'
        }, quova.platform.view.common.FormView.prototype.events),

        render: function() {
            var self = this;
            this.form = $('#reset-password-form');
            this.submitButton = this.form.find('#submit-new-password').button().css("visibility", "visible");
            this.newPassword = this.form.find('#new-password');
            this.retypePassword = this.form.find('#retype-password');
            // containers
            this.passwordExample = $('#password-example');

            this.form.validate($.extend(self.validator, this.validRules));

            // set up password strength indicator
            this.newPassword.passwordStrength({targetDiv: '#password-strength',classes : ['weak','medium','strong']});
        },

        validRules: {
            rules: {
                /* keys are HTML field names */
                newPassword: quova.platform.app.CommonValidation.rules.newPassword,
                confirmNewPassword: {
                    required: true,
                    matchPassword: "#new-password"
                }
            }
        },

        showPasswordIndicators: function() {
            this.passwordExample.show();
        },

        hidePasswordIndicators: function() {
            this.passwordExample.hide();
        },

        handleSubmit: function() {
            var self = this;

            if(!this.form.valid()) {
                return;
            }

            this.form.submit(function() {
                self.startSubmitIndicator(self.submitButton);
            });
        }
    });

    return quova.platform.view.account.PasswordReset;

});