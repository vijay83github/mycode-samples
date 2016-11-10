define([], function() {
    quova.platform.app.Validator = {
        initialize: function() {
             var self = this;

            $.validator.addMethod("equalToIgnoreCase", function (value, element, param) {
                var target = $(param).unbind(".validate-equalToIgnoreCase").bind("blur.validate-equalToIgnoreCase", function() {
                    $(element).valid();
                });
                return this.optional(element) || (value.toLowerCase() == target.val().toLowerCase());
            }, "Please enter the same value again.");

             $.validator.addMethod("regex", function(value, element, regexp) {
                var check = false;
                var re = new RegExp(regexp);
                return this.optional(element) || re.test(value);
            }, $.i18n.prop('messages.common.invalid.field'));

            $.validator.addMethod("specialChars", function(value, element, regexp) {
                var check = false;
                var re = new RegExp(regexp);
                return this.optional(element) || !re.test(value);
            }, $.i18n.prop("messages.common.invalid.chars"));


            $.validator.addMethod("passwordPolicyCheck", $.validator.methods.regex,
                        $.i18n.prop("messages.common.invalid.password"));

            $.validator.addMethod("matchPassword", $.validator.methods.equalTo,
                messages.common.invalid.value_mismatch("Password"));

            $.validator.addMethod("matchEmail", $.validator.methods.equalToIgnoreCase,
                messages.common.invalid.value_mismatch("Email"));

            $.validator.addMethod("passwordContainsUsernameCheck", function(value, element, selector) {
                return self.checkPasswordInput(value, element, selector);
            }, $.i18n.prop("messages.common.invalid.password_contains_username"));


            $.validator.addMethod("passwordContainsEmailCheck", function(value, element, selector) {
                return self.checkPasswordInput(value, element, selector);
            }, $.i18n.prop("messages.common.invalid.password_contains_email"));

        },

        checkPasswordInput: function(value, element, selector) {
            if(!selector) {
                return true;
            }

            var s = $(selector).val();

            if(s && s.length > 0) {
                return (value.indexOf(s) == -1);
            }
            return true;
        }
    };

    return quova.platform.app.Validator;
});