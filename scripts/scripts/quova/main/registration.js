require.config({
    baseUrl: '/apps/resources/scripts',
    paths: {
        // Require.js plugins
        'text'                        : 'libs/require/text',
        // Major libraries
        'json2'                       : 'libs/json/json2',
        'jquery'                      : 'libs/jquery/jquery',
        'underscore'                  : 'libs/underscore/underscore',
        'backbone'                    : 'libs/backbone/backbone',
        // Other libraries
        'jquery.ui'                   : 'libs/jquery/jquery-ui-1.8.18.custom.min',
        'jquery.activity-indicator'   : 'libs/jquery/activity-indicator/jquery.activity-indicator',
        'jquery.additional-methods'   : 'libs/jquery/additional-methods',
        'jquery.ba-postMessage'       : 'libs/jquery/jquery.ba-postmessage',
        'jquery.cookie'               : 'libs/jquery/jquery.cookie',
        'jquery.debug'                : 'libs/jquery/ba-debug.min',
        'jquery.deparam'              : 'libs/jquery/jquery.deparam',
        'jquery.fancybox'             : 'libs/jquery/jquery.fancybox',
        'jquery.formalize'            : 'libs/jquery/jquery.formalize.min',
        'jquery.i18n'                 : 'libs/jquery/jquery.i18n.properties',
        'jquery.metadata'             : 'libs/jquery/jquery.metadata',
        'jquery.passwordStrength'     : 'libs/jquery/jquery.passwordStrength',
        'jquery.validate'             : 'libs/jquery/jquery.validate',
        'jquery.reject'               : 'libs/jquery/jquery.reject',
        'jquery.qtip'                 : 'libs/jquery/qtip/jquery.qtip',
        'datejs'                      : "libs/date",

        'XDomainRequest'              : "libs/jQuery.XDomainRequest",
        
        // Common helper classes
        'app.bootstrap'               : 'quova/app/bootstrap',
        'app.utils'                   : 'quova/app/utils',
        'app.protocol'                : 'quova/app/protocol',
        'app.validator'               : 'quova/app/validator',
        'app.validateRules'           : 'quova/app/FormValidation',
        'app.reg.app'                 : 'quova/app/registration/app',
        'app.reg.contextMgr'          : 'quova/app/registration/contextMgr',
        'app.reg.helper'              : 'quova/app/registration/helper',
        'app.reg.router'              : 'quova/app/registration/router',
        'app.reg.validators'          : 'quova/app/registration/validators',

        // Views
        'views'                       : 'quova/view',
        'view.baseView'               : 'quova/view/BaseView',
        'view.common.formView'        : 'quova/view/common/formView',
        'view.reg.registrationView'   : 'quova/view/registration/registrationView',
        'view.common.errorView'       : 'quova/view/common/errorView',
        'view.reg.landingPageView'    : 'quova/view/registration/landingPageView',
        'view.reg.singleStepView'     : 'quova/view/registration/singleStepView',
        'model.baseModel'             : 'quova/model/BaseModel',
        'model.reg.registrationModel' : 'quova/model/registration/registrationModel',
        'model.reg.productModel'      : 'quova/model/registration/productModel',
        'templates'                   : 'quova/templates',
        'templates.common'            : 'quova/templates/common',
        'templates.registration'      : 'quova/templates/registration'
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

        'jquery.ui'                   : {
            deps: ['jquery']
        },
        'jquery.activity-indicator'   : {
            deps: ['jquery']
        },
        'jquery.validate'             : {
            deps: ['jquery']
        },
        'jquery.additional-methods'   : {
            deps: ['jquery',  'jquery.validate' ]
        },
        'jquery.ba-postMessage'       : {
            deps: ['jquery']
        },
        'jquery.cookie'               : {
            deps: ['jquery']
        },
        'jquery.debug'                : {
            deps: ['jquery']
        },
        'jquery.deparam'              : {
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
        'jquery.metadata'             : {
            deps: ['jquery']
        },
        'jquery.passwordStrength'     : {
            deps: ['jquery']
        },
        'jquery.reject'               : {
            deps: ['jquery']
        },
        'jquery.qtip'                 : {
            deps: ['jquery']
        },
        'datejs'                      : {
            deps: ['jquery']
        },

        'bootstrap': {
            deps: ['jquery']
        },
      
        'model.baseModel'  :{
            deps:['backbone']
        },
        'view.common.errorView'  :{
            deps:['backbone']
        },
        'view.reg.landingPageView' :{
            deps:['backbone']
        },
        'app.validateRules': {
            deps: ['jquery']
        }
       
      
    }
});

require([
    'jquery',
    'underscore',
    'backbone',
    'app.bootstrap',
    'app.reg.app',
    'views/ViewManager',
    'json2',
    'jquery.reject'

], function($, _, backbone, bootstrap, App, ViewManager) {

    App.initialize();
    // initialize the view manager
    ViewManager.initialize();
    horizon.app.Utils.checkBrowser();

});
