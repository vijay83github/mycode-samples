require.config({
    paths: {
        'text'                        : '../../../libs/require/text',
        // Major libraries
        'json2'                       : '../../../libs/json/json2',
        'jquery'                      : '../../../libs/jquery/jquery',
        'underscore'                  : '../../../libs/underscore/underscore',
        'backbone'                    : '../../../libs/backbone/backbone',
        // Other libraries
        'jquery.ui'                   : '../../../libs/jquery/jquery-ui-1.8.18.custom.min',
        'jquery.debug'                :'../../../libs/jquery/ba-debug.min',
        'jquery.fancybox'             : '../../../libs/jquery/jquery.fancybox',
        'jquery.formalize'            : '../../../libs/jquery/jquery.formalize.min',
        'jquery.i18n'                 : '../../../libs/jquery/jquery.i18n.properties',
        'jquery.qtip'                 : '../../../libs/jquery/qtip/jquery.qtip',
        'jquery.reject'               : '../../../libs/jquery/jquery.reject',
        'jquery.cookie'               : '../../../libs/jquery/jquery.cookie',
        'jquery.validate'             :'../../../libs/jquery/jquery.validate',
        'datejs'                      : "../../../libs/date",
        
        // Commons
        'app.bootstrap'               : '../bootstrap',
        'jquery.validator'            :'../validator',
        'app.utils'                   : "../utils",
        'app.validator'               : '../validator',
        'app.validateRules'           : '../FormValidation',
        //Views
        'views'                       : '../../view',
        'view.baseView'               : '../../view/BaseView',
        'view.common.formView'        : '../../view/common/formView',
        'view.account.forgotPassword' : '../../view/account/forgotPassword'
    },
    urlArgs: "t=" +  (new Date()).getTime(),
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
       'jquery.ui'                   : {
            deps: ['jquery']
       },
       'jquery.debug'                : {
            deps: ['jquery']
       },
       'jquery.fancybox'             : {
            deps: ['jquery']
       },
       'jquery.formalize'            : {
            deps: ['jquery']
       },
       'jquery.i18n'                 : {
            deps: ['jquery']
       },
       'jquery.qtip'                 : {
            deps: ['jquery']
       },
       'jquery.reject'               : {
            deps: ['jquery']
       },
       'jquery.cookie'               : {
           deps: ['jquery']
       },
       'jquery.validate'             : {
            deps: ['jquery']
       },
       'datejs'                      : {
            deps: ['jquery']
       }
    }
});

require([
    'app.bootstrap',
    'jquery',
    'underscore',
    'backbone',
    'jquery.reject',
    'view.account.forgotPassword',
    'json2',
    'jquery.cookie'
], function() {
    $(function() {
        var view = new quova.platform.view.account.ForgotPassword();
        view.render();

    });
    horizon.app.Utils.checkBrowser();

});
