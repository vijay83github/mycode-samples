define([
    "jquery.validate",
    "jquery.additional-methods",
    "jquery.qtip",
    "app.utils",
    "app.reg.helper"
], function() {
    quova.platform.app.registration.Validator = {
        regex: {
            // include filters on non-supported characters
            emailChars: /:\<|\>|\\|\=|\&|\;|\"|\,/,
            // include supported characters
            emailFormat: /^([a-zA-Z0-9_\+\.-]+)@([\da-zA-Z\.-]+)\.([a-zA-Z]{2,})$/
        },
        initialize: function() {
            var self = this;

            self.initValidators();
            self.initClassRules();

            // set default validation options
            $.validator.setDefaults({
                errorClass: "invalid",
                validClass: "valid",
                ignore: ":disabled",

                errorPlacement: function(error, placement) {
                    //debug.debug("error", error);
                    error = error.html()? error.html() : error.text();

                    quova.platform.app.registration.Helper.createFieldTooltip({
                        invalid: true,
                        render: false,
                        element: placement,
                        text: error,
                        events: {
                            show: function(event, api) {
                                if(placement.is(":hidden")) {
                                    event.preventDefault(); // Stop it!
                                }
                            }
                        }
                    });
                },

                /*invalidHandler: function(form, validator) {
                    var errors = validator.numberOfInvalids();
                    if (errors) {
                        horizon.app.Utils.showAlertErrorMessage(
                            $.i18n.prop("messages.common.invalid.total_invalids"));
                    }
                },*/

                onclick: function(element, event) {
                    // click on selects, radiobuttons and checkboxes
                    if ( element.name in this.submitted )
                        this.element(element);
                    // or option elements, check parent select in that case
                    else if (element.parentNode.name in this.submitted)
                        this.element(element.parentNode);

                    if($(element).attr("type") == "checkbox" || $(element).attr("type") == "radio") {
                        this.element(element);
                    }
                },

                highlight: function(element, errorClass, validClass) {
                    var field = $(element);
                    var parentNode = field.parent();
                    var isGroup = parentNode.hasClass("options-group") || parentNode.hasClass("fields-group");

                    field.removeClass(validClass).addClass(errorClass);

                    if(isGroup) {
                        if(!parentNode.find(".validate-icon").length) {
                            parentNode.append('<span class="validate-icon"></span>');
                        }
                        validateHelper.groupElementHighlight(field, errorClass, validClass);
                    } else {
                        if(!field.next().hasClass("validate-icon")) {
                            $('<span class="validate-icon"></span>').insertAfter(element);
                        }
                        validateHelper.singleElementHighlight(field, errorClass, validClass);
                    }
                },

                unhighlight: function(element, errorClass, validClass) {
                    var field = $(element);
                    var parentNode = field.parent();
                    var isGroup = parentNode.hasClass("options-group") || parentNode.hasClass("fields-group");

                    field.removeClass(errorClass).addClass(validClass);

                    if(isGroup) {
                        parentNode.find(".validate-icon").removeClass(errorClass);

                        if(field.hasClass("asterisk")) {
                            parentNode.find(".validate-icon").addClass(validClass);
                        }
                    } else {
                        field.next(".validate-icon").removeClass(errorClass);

                        if(field.hasClass("asterisk")) {
                            field.next(".validate-icon").addClass(validClass);
                        }
                    }

                    // recreate tooltips for hints
                    if(field.hasClass(validClass)) {
                        var toolText =  field.attr("tooltip");
                        quova.platform.app.registration.Helper.createFieldTooltip({
                            invalid: false,
                            render: false,
                            element: field,
                            text: toolText
                        });
                    }
                }
            });

        },

        initValidators: function() {
            var self = this;
            $.validator.addMethod("emailFormatCheck", $.validator.methods.regex,
                $.i18n.prop("messages.common.invalid.email_format"));

            $.validator.addMethod("userEmailFormatCheck", $.validator.methods.regex,
                    $.i18n.prop("messages.common.invalid.username"));

            $.validator.addMethod("emailCharCheck", $.validator.methods.specialChars,
                $.i18n.prop("messages.common.invalid.chars"));

            $.validator.addMethod("passwordPolicyCheck", $.validator.methods.regex,
                $.i18n.prop("messages.common.invalid.password"));

            $.validator.addMethod("username", $.validator.methods.regex,
                $.i18n.prop("messages.common.invalid.username"));
            
            $.validator.addMethod("firstname", $.validator.methods.regex,
                    $.i18n.prop("messages.common.invalid.firstname"));
            
            $.validator.addMethod("lastname", $.validator.methods.regex,
                    $.i18n.prop("messages.common.invalid.lastname"));
            
            $.validator.addMethod("organization", $.validator.methods.regex,
                    $.i18n.prop("messages.common.invalid.organization"));
            
            $.validator.addMethod("usernameOrEmail", $.validator.methods.regex,
                    $.i18n.prop("messages.common.invalid.organization"));
            
         
        },

        initClassRules: function() {
            $.validator.addClassRules("username", {
                required: true,
                minlength: 4,
                maxlength: 64,
                username: {
                    param: /^[a-zA-Z0-9\_\-\.]*$/,
                    depends: function(element) {
                        var value = $(element).val();
                        // if value doesn't contain '@' and '.'
                        return !(value.indexOf('@') > -1 && value.indexOf('.') > -1);
                    }
                },

                userEmailFormatCheck: {
                    param: this.regex.emailFormat,
                    depends: function(element) {
                        var value = $(element).val();
                        // if value contains '@' and '.'
                        return (value.indexOf('@') > -1 && value.indexOf('.') > -1);
                    }
                },

                emailCharCheck: {
                    param: this.regex.emailChars,
                    depends: function(element) {
                        var value = $(element).val();
                        // if value contains '@' and '.'
                        return (value.indexOf('@') > -1 && value.indexOf('.') > -1);
                    }
                }
            });

            $.validator.addClassRules("confirmLoginEmail", {
                required: true,
                matchEmail: '#login-email'
            });

            $.validator.addClassRules("email", {
                required: true,
                maxlength: 64,
                emailFormatCheck: this.regex.emailFormat,
                emailCharCheck: this.regex.emailChars
            });

            $.validator.addClassRules("confirmEmail", {
                required: true,
                matchEmail: '#email'
            });

            $.validator.addClassRules("password", {
                required: true,
                minlength: 7,
                maxlength: 128,
                passwordContainsUsernameCheck: "#reg-form input[id='username']",
                passwordContainsEmailCheck: "#reg-form input[id='login-email']",
                passwordPolicyCheck: /(?=.*[^0-9])(?=.*[0-9])/
            });

            $.validator.addClassRules("confirmPassword", {
                required: true,
                matchPassword: '#password'
            });

            $.validator.addClassRules("name", {
                required: true,
                maxlength: 64,
                firstname: /^[a-zA-Z]*$/,
            	lastname: /^[a-zA-Z]*$/
                

            });

            $.validator.addClassRules("organization", {
                required: true,
                maxlength: 255,
                organization: {
                    param: /^[a-zA-Z\.]*$/
                    	  }
            });
            $.validator.addClassRules("usernameOrEmail", {
                required: true,
                maxlength: 255,
                usernameOrEmail: {
                    param: /^([a-zA-Z0-9_\+\.-]+)@([\da-zA-Z\.-]+)\.([a-zA-Z]{2,})$/
                    	  }
            });
            
        }

    };

    return quova.platform.app.registration.Validator;

});

var validateHelper = {
    groupElementHighlight: function(element, errorClass, validClass) {
        var $element = $(element);

        if($element.val() == 0 && !$element.hasClass(errorClass)) {
            $element.parent().find(".validate-icon").removeClass(errorClass);
        } else if($element.hasClass(errorClass)) {
            $element.parent().find(".validate-icon").removeClass(validClass).addClass(errorClass);
        }
    },

    singleElementHighlight: function(element, errorClass, validClass) {
        var $element = $(element);
        // do not highlight for empty field and remove previous class
        if($element.val() == 0 && !$element.hasClass(errorClass)) {
            element.next(".validate-icon").removeClass(validClass);

        } else if($element.hasClass(errorClass)) {
            // handling icons
            element.next(".validate-icon").removeClass(validClass).addClass(errorClass);
        }
    }
};