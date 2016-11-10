require.config({
    urlArgs: "t=" +  (new Date()).getTime(),
    baseUrl: '/apps/resources/scripts',
    paths: {
        'collections'               : 'quova/collection',
        'models'                    : 'quova/model',
        'views'                     : 'quova/view',
        'templates'                 : 'quova/templates',
        
        // Require.js plugins
        'text'                      : 'libs/require/text',
        // Major libraries
        'json2'                     : 'libs/json/json2',
        'jquery'                    : 'libs/jquery/jquery',
        'underscore'                : 'libs/underscore/underscore',
        'backbone'                  : 'libs/backbone/backbone',
        'jquery.cookie'             :'libs/jquery/jquery.cookie',
        'jquery.debug'              :'libs/jquery/ba-debug.min',
        'jquery.i18n'               : 'libs/jquery/jquery.i18n.properties',
        'datejs'                    : "libs/date",
        'jquery.reject'             : 'libs/jquery/jquery.reject',
        'jquery.fancybox'           : 'libs/jquery/jquery.fancybox',
        'jquery.activity-indicator' : 'libs/jquery/activity-indicator/jquery.activity-indicator',
        'jquery.validate'           : 'libs/jquery/jquery.validate',
        
        // Twitter bootstrap
        'bootstrap'                 : 'libs/bootstrap',
        'app.bootstrap'             : 'quova/app/bootstrap',
        'app.utils'                 : 'quova/app/utils',
        'app.protocol'              : 'quova/app/protocol',
        'app.validator'             : 'quova/app/validator',
        'app.validateRules'         : 'quova/app/FormValidation'
    },

    shim: {
        'jquery' : {
            exports: 'jQuery'
        },
        'jquery.cookie'              : {
            deps: ['jquery']
        },
        'jquery.debug'              : {
            deps: ['jquery']
        },
        'jquery.i18n'               : {
            deps: ['jquery']
        },
        'datejs'                    : {
            deps: ['jquery']
        },
        'jquery.reject'             : {
            deps: ['jquery']
        },
        'jquery.fancybox'           : {
            deps: ['jquery']
        },
        'jquery.activity-indicator' : {
            deps: ['jquery']
        },
        'jquery.validate'           : {
            deps: ['jquery']
        },
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        'bootstrap': { deps: ["jquery"] }
    }
});

require([
    'app.bootstrap',
    'jquery',
    'underscore',
    'backbone',
    'views/ViewManager',
    'json2',
    'jquery.i18n',
    'jquery.debug',
    'app.utils',
    'models/productPropsModel',
    'models/registration/returnCustomerRegModel',
    'views/registration/returnCustomerRegView'
], function(bstrap, $, _, Backbone, ViewManager) {
    ViewManager.initialize();

    $.i18n.properties({
        name:'Messages',
        path:'/apps/resources/bundle/',
        mode:'both',
        language:'en',
        callback: function() {
            var productPropsModel = new horizon.model.ProductPropsModel({productId: horizon.app.Utils.getUrlVars()["CL"]});
            var returnCustomerRegModel = new horizon.model.registration.ReturnCustomerRegModel();

            productPropsModel.fetch({
                success: function(model) {
                    $("#app-body").html(new horizon.view.registration.ReturnCustomerRegView({
                        productPropsModel: productPropsModel,
                        registrationModel: returnCustomerRegModel
                    }).$el);
                },

                error: function() {
                    require(['views/common/errorView'], function(){
                        var view = new quova.platform.view.common.ErrorView();
                        view.render("PAGE_NOT_FOUND");
                        debug.warn("Product properties not found.");
                    });
                }
            });
        }
    });

});
