define([
    'text!templates.registration/landingPageTemplate.html',
    'jquery.activity-indicator'

], function(template) {
    quova.platform.view.registration.LandingPageView = Backbone.View.extend({
        el: $("#app-body"),

        events: {
            'click button#register-button': 'routeToRegistration'
        },

        render: function(){
            $(this.el).activity({padding:6});
            // default to neustar logo
            $("#app-header").find("#product-logo").html('<a href="http://www.neustar.biz" target="neustar">' +
                    '<img src="/apps/resources/images/themes/neustar/logo.png" alt="Neustar" width="102" height="27"/></a>');
            $(this.el).html( _.template(template));
        },

        routeToRegistration: function() {
            quova.platform.router.registration.AppRouter.navigate("/registration/process", {trigger: true, replace: false});
        }
    });

    return quova.platform.view.registration.LandingPageView;
});
