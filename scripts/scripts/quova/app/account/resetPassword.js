require.config({
    paths: {
        'text'                       : '../../../libs/require/text',
        // Major libraries
        'json2'                      : '../../../libs/json/json2',
        'jquery'                     : '../../../libs/jquery/jquery',
        'underscore'                 : '../../../libs/underscore/underscore',
        'backbone'                   : '../../../libs/backbone/backbone',
        // Other libraries
        'jquery.ui'                  : '../../../libs/jquery/jquery-ui-1.8.18.custom.min',
        'jquery.debug'               : '../../../libs/jquery/ba-debug.min',
        'jquery.fancybox'            : '../../../libs/jquery/jquery.fancybox',
        'jquery.formalize'           : '../../../libs/jquery/jquery.formalize.min',
        'jquery.i18n'                : '../../../libs/jquery/jquery.i18n.properties',
        'jquery.passwordStrength'    : '../../../libs/jquery/jquery.passwordStrength',
        'jquery.qtip'                : '../../../libs/jquery/qtip/jquery.qtip',
        'jquery.validate'            : '../../../libs/jquery/jquery.validate',
        'jquery.reject'              : '../../../libs/jquery/jquery.reject',
        'datejs'                     : "../../../libs/date",
        
        // Commons
        'app.bootstrap'              : '../bootstrap',
        'jquery.validator'           : '../validator',
        'app.utils'                  : "../utils",
        'app.validator'              : '../validator',
        'app.validateRules'          : '../FormValidation',
        //Views
        'views'                      : '../../view',
        'view.baseView'              : '../../view/BaseView',
        'view.common.formView'       : '../../view/common/formView',
        'view.account.passwordReset' : '../../view/account/passwordReset'
    },
    urlArgs: "t=" + (new Date()).getTime(),

    shim: {
        underscore: {
            exports: '_'
        },
        'backbone': {
            deps: ['jquery', "underscore"],
            exports: "Backbone"
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'jquery.ui': {
            deps: ['jquery']
        },
        'jquery.debug': {
            deps: ['jquery']
        },
        'jquery.fancybox': {
            deps: ['jquery']
        },
        'jquery.formalize': {
            deps: ['jquery']
        },
        'jquery.i18n': {
            deps: ['jquery']
        },
        'jquery.passwordStrength': {
            deps: ['jquery']
        },
        'jquery.qtip': {
            deps: ['jquery']
        },
        'jquery.validate': {
            deps: ['jquery']
        },
        'app.validator' :{
          deps:['jquery']
        },
        'app.validateRules' : {
          deps:['jquery']
        },
        'datejs': {
            deps: ['jquery']
        },
        'jquery.reject': {
            deps: ['jquery']
        }
    }
});

require([
    'app.bootstrap',
    'jquery',
    'underscore',
    'backbone',
    'jquery.i18n',
    'jquery.reject',
    'view.account.passwordReset',
    'json2'
], function () {
    $(function () {
        $.i18n.properties({
            name: 'Messages',
            path: '../resources/bundle/',
            mode: 'both',
            language: 'en',
            callback: function () {
                quova.platform.app.Validator.initialize();
                var view = new quova.platform.view.account.PasswordReset();
                view.render();

            }
        });
    });
    //horizon.app.Utils.checkBrowser();
});