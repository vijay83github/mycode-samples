/*!
 * ErrorView Controller
 */
define([
    'text!templates/common/errorTemplate.html',
    'jquery.activity-indicator','backbone'
], function(template) {
    quova.platform.view.common.ErrorView = Backbone.View.extend({
        el: $("#app-body"),

        render: function(errorType){
            $(this.el).activity({padding:6});
            // default to neustar logo
            $("#product-logo").hide()
                //html('<a href="http://www.neustar.biz" target="neustar-home">'+
                  //      '<img src="/apps/resources/images/themes/neustar/logo.png" alt="Neustar" width="102" height="27"/></a>');

            var _template =  _.template(template);
            $(this.el).html(_template({errorType:errorType}));
        },

        routeToRegistration: function() {
            quova.platform.router.registration.AppRouter.navigate("/", {trigger: true, replace: false});
        }
    });

    return quova.platform.view.common.ErrorView;
});
