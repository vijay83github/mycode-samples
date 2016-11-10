define([
  'view.common.errorView',
  'view.reg.landingPageView',
  'view.reg.singleStepView',
  'model.reg.registrationModel'
], function() {
    var appRouter = Backbone.Router.extend({
        initialize: function() {
             this.contextMgr =  quova.platform.app.registration.ContextMgr;
             this.contextMgr.setDebugLevel();
        },

        routes: {
            '/user/login': 'showMainView',
            '/registration/process': 'showRegistrationView',
            '*actions': 'defaultAction'
        },

        defaultAction: function(actions){
            this.showRegistrationView()
        },

        showErrorView: function(errorType) {
            var view = new quova.platform.view.common.ErrorView();
            view.render(errorType);
        },

        showMainView: function() {
            var view = new quova.platform.view.registration.LandingPageView();
            view.render();
        },

        showRegistrationView: function() {
            var self = this;
            var productId = horizon.app.Utils.getUrlVars()["CL"];

            if(!productId) {
                this.showErrorView("PAGE_NOT_FOUND");
                debug.warn("Product Id not defined.");
            } else {
                self.contextMgr.init({
                    productId: productId,
                    customResourceUrl: quova.platform.app.protocol.registration.ProductResource
                });

                var req = $.getJSON(self.contextMgr.getProductConfigUrl(), function(data) {

                    self.contextMgr.setProductData(data);

                    if(!self.contextMgr.hasRegistration()) {
                        self.showErrorView("PAGE_NOT_FOUND");
                        return;
                    }

                    var model = new quova.platform.model.registration.RegistrationModel();
                    var regView;
                    // var productTemplates = self.contextMgr.getProductFormTemplates();

                    regView = new quova.platform.view.registration.SingleStepView({
                        model: model,
                        productId: self.contextMgr.getProductId(),
                        contextMgr: self.contextMgr
                    });

                    /*regView.isEmbeded = true;

                    if(!embeded) {
                        regView.isEmbeded = false;
                        $("#appview").removeClass("neuframe");
                    }*/
                    
                  //  horizon.app.Utils.addProductNameAndURLToFooter(data.productBuyUrl,data.productServiceUrl,data.productName);

                    var embedded = horizon.app.Utils.getUrlVars()["e"];
                    regView.embeddedMode = embedded? embedded=="1" : false;

                    if(regView.embeddedMode === true) {
                        $("html").addClass("neuframe").css("overflow", "hidden");
                    } else {
                        $("html").css("overflow", "visible");
                    }

                    regView.render();

                    self._enableGoogleAnalytics();
                });

                req.error(function() {
	                if (jqXHR.status == 404) {
                        self.showErrorView("PAGE_NOT_FOUND");
                        debug.warn("Product properties not found.");
	                }
                });
            }
        },

        _enableGoogleAnalytics: function() {
            var self = this;
            self.contextMgr.regViewEvent = {};
            _.extend(self.contextMgr.regViewEvent, Backbone.Events);
            var useGoogleAnalytics = $.cookie("use_google_analytics") === "true"? true : false;
            debug.info("env: ", self.contextMgr.env);

            if(self.contextMgr.hasGoogleAnalytics() && useGoogleAnalytics === true) {
                    /*Jira 3720 -start*/
            	 /* $.getScript("//ns-cdn.neustar.biz/_global/js/cdnlP_GA_CONFIG.js", function(data, textStatus, jqxhr) {
                    debug.info('Loaded cdnlP_GA_CONFIG.');

                    $.getScript("//ns-cdn.neustar.biz/_global/js/cdnlP_GAneustar.js", function(data, textStatus, jqxhr) {
                        self.contextMgr.regViewEvent.on("registrationSuccess", function() {
                            self.contextMgr.registrationSuccess();
                    });Jira 3720 -end*/
                       /* self.contextMgr.regViewEvent.on("registrationPageViewed", function() {
                            self.contextMgr.registrationPageViewed();
                        });*/
                        /* Jira 3720 -start debug.info('Loaded cdnlP_GAneustar.');
                    });
            }); */
            (function(w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({
                    'gtm.start': new Date().getTime(),
                    event: 'gtm.js'
                });
                var f = d.getElementsByTagName(s)[0],
                    j = d.createElement(s),
                    dl = l != 'dataLayer' ? '&l=' + l : '';
                j.async = true;
                j.src =
                    '//www.googletagmanager.com/gtm.js?id=' + i + dl;
                f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', 'GTM-DG2P');

            }
        }/*Jira 3720 -end*/
    });

    var initialize = function() {
        quova.platform.router.registration.AppRouter = new appRouter();
        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});
