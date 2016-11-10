require.config({
    paths: {
        // Require.js plugins
        'text'                      : '../../../libs/require/text',
        // Major libraries
        'json2'                     : '../../../libs/json/json2',
        'jquery'                    : '../../../libs/jquery/jquery',
        'underscore'                : '../../../libs/underscore/underscore',
        'backbone'                  : '../../../libs/backbone/backbone',
        // Other libraries
        'jquery.ui'                 : '../../../libs/jquery/jquery-ui-1.8.18.custom.min',
        'jquery.activity-indicator' : '../../../libs/jquery/activity-indicator/jquery.activity-indicator',
        'jquery.debug'              :'../../../libs/jquery/ba-debug.min',
        'jquery.form'               : '../../../libs/jquery/jquery.form',
        'jquery.ba-postMessage'     : '../../../libs/jquery/jquery.ba-postmessage',
        'jquery.cookie'             :'../../../libs/jquery/jquery.cookie',
        'jquery.fancybox'           : '../../../libs/jquery/jquery.fancybox',
        'jquery.i18n'               : '../../../libs/jquery/jquery.i18n.properties',
        'jquery.validate'           : '../../../libs/jquery/jquery.validate',
        'jquery.qtip'               : '../../../libs/jquery/qtip/jquery.qtip',
        'jquery.reject'             : '../../../libs/jquery/jquery.reject',
        'datejs'                    : "../../../libs/date",
        
        'app.reg.contextMgr'        : '../registration/contextMgr',
        
        // Common helper classes
        'app.bootstrap'             : '../bootstrap',
        'app.commonHelper'          : '../commonHelper',
        'app.utils'                 : '../utils',
        'app.protocol'              : '../protocol',
        'app.validator'             : '../validator',
        'app.validateRules'         : '../FormValidation',
        'views'                     : '../../view',
        'view.baseView'             : '../../view/BaseView',
        'view.common.errorView'     : '../../view/common/errorView',
        'view.common.formView'      : '../../view/common/formView',
        'view.account.loginView'    : '../../view/account/loginView',
        'templates'                 : '../../templates',
        'templates.common'          : '../../templates/common',
        'templates.account'         : '../../templates/account'
        
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
        'jquery.ui'                 : {
            deps: ['jquery']
        },
        'jquery.activity-indicator' : {
            deps: ['jquery']
        },
        'jquery.debug'              : {
            deps: ['jquery']
        },
        'jquery.form'               : {
            deps: ['jquery']
        },
        'jquery.ba-postMessage'     : {
            deps: ['jquery']
        },
        'jquery.cookie'             : {
            deps: ['jquery']
        },
        'jquery.fancybox'           : {
            deps: ['jquery']
        },
        'jquery.i18n'               : {
            deps: ['jquery']
        },
        'jquery.validate'           : {
            deps: ['jquery']
        },
        'jquery.qtip'               : {
            deps: ['jquery']
        },
        'jquery.reject'             : {
            deps: ['jquery']
        },
        'datejs'                    : {
            deps: ['jquery']
        }
    }
});

require([
    'app.bootstrap',
    'jquery',
    'app.commonHelper',
    'underscore',
    'backbone',
    'jquery.i18n',
    'jquery.reject',
    'jquery.cookie',
    'view.account.loginView',
    'json2'

], function() {
    $(function() {
        $.i18n.properties({
            name:'Messages',
            path:'/apps/resources/bundle/',
            mode:'both',
            language:'en',
            callback: function() {
                var embedded = quova.platform.app.CommonHelper.getUrlVars()["e"];
                var view = new quova.platform.view.account.LoginView();
                view.embeddedMode = embedded? embedded=="1" : false;

                if(view.embeddedMode === true) {
                    $("html").addClass("neuframe").css("overflow", "hidden");
                } else {
                    $("html").css("overflow", "visible");
                }

                view.render();
            }
        });
    });
    horizon.app.Utils.checkBrowser();

});
