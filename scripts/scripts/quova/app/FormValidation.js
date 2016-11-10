(function() {
quova.platform.app.CommonValidation = {
    rules: {
        password: {
            required: true,
            regex: /(?=^.{8,255}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*/
        },

        email: {
            maxlength: 80,
            regex: /^\s*\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*\s*$/,
            specialChars: /:\<|\>|\\|\=|\+|\&|\;|\"|\,/
        },

        newPassword: {
            required: true,
            minlength: 7,
            maxlength: 128,
            passwordContainsUsernameCheck: "input[id='username']",
            passwordPolicyCheck: /(?=.*[^0-9])(?=.*[0-9])/
        }
    },

    messages: {
        email: {
            regex: "The email address is invalid.",
            specialChars: "The email contains illegal special characters."
        },

        password: {
            regex: "The password did not meet the requirements."
        }
    }
};

})();