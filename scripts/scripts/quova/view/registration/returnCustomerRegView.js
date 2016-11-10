define([
    // templates
    'text!templates/registration/returnCustomerRegTemplate.html',
    // libs
    'backbone',
    'jquery.debug',
    'app.utils',
    'app.protocol',
    'bootstrap',
    'jquery.cookie',
    'views/common/formView'
], function(tmpl) {
    horizon.view.registration.ReturnCustomerRegView = quova.platform.view.common.FormView.extend({
        embeddedMode: false,
        model: null,
        formSelector: "",
        events: {
            'click #cancel-registration':"redirectProductHome",
            'click #submit-button':"submit"
        },

        initialize: function() {
            var self = this;
            this.productPropsModel = this.options.productPropsModel;
            this.registrationModel = this.options.registrationModel;
            this.prodId = this.productPropsModel.get("productId");

            this.render();

            return this;
        },


        render: function() {
            var self = this;

            if(!window.user) {
                require(['views/common/errorView'], function(){
                    var view = new quova.platform.view.common.ErrorView();
                    view.render("PAGE_NOT_FOUND");
                });
            }

            self.user = window.user;
            self.token = horizon.app.Utils.getUrlVars()["tk"];

            $("html").css("overflow", "auto");
            this.$el.css({ width: this.productPropsModel.getTemplateWidth() || '100%', 'margin': 'auto' });
            this.$el.html(_.template(tmpl, {data: {
                submitLabel: this.productPropsModel.getSubmitButtonLabel()
            }}));
            //this.$el.find("#cancel-button").attr("href", quova.platform.app.protocol.registration.LandingPage+"?CL="+ this.prodId);
            this.$submitButton = this.$el.find("#submit-button");
            this.$cancelButton = this.$el.find("#cancel-button");
            this.$regHeader = this.$el.find("#return-reg-header");
            this.$regContent = this.$el.find("#return-reg-content");

            this._renderProductInfo();

            this._renderCustomTemplates();

            return this;
        },

        _renderProductInfo: function(){
            var pageInfo = this.productPropsModel.getSharedAppProperties();

            // Handle company and product logos
            var $pageHeader =  $("#app-header");
            var $neustarLogo =  $pageHeader.find("#neustar-logo");

            if(pageInfo.includeNeustarLogo === true) {
                $neustarLogo.show();
            } else {
                $neustarLogo.hide();
            }

            if(pageInfo.logoSourceUrl && pageInfo.logoSourceUrl.length) {
                $pageHeader.find("#product-logo").html('<a href="'+pageInfo.logoHref+'">' +
                    '<img src="'+pageInfo.logoSourceUrl+'" title="'+pageInfo.logoTooltip+'" alt="'+pageInfo.logoTooltip+'"></a>');
            } else {
                $pageHeader.find("#product-logo").html('');
            }
        },

        _renderCustomTemplates: function(){
            var self = this;
            var templatesObjects = this.productPropsModel.getTemplateFileObjects();
            var templateUrl = this.productPropsModel.getTemplateFileLocation();

            this.$regHeader.html(_.template(this.productPropsModel.getTemplatePageTitle(), {username: self.user.firstName}));

            $.each(templatesObjects, function(index, item) {
                var filename = item.fileName;
                var newNode=self.$regContent.append("<div></div>");

                setTimeout(function(){
                    $(newNode).load(templateUrl+filename, function(){
                        if(index == templatesObjects.length-1) {
                            self.$el.find(".button-group").show();
                        }
                    });

                },500);
            });
        },

        _displayError: function(errorCode){
            var self = this;
            var message = "";
            var title = "";
            var callback = function(){
                window.location = "/apps/login?CL="+self.prodId;
            };

            // 400
            if(errorCode == 401) { //bad request
                message = $.i18n.prop("messages.registration.update.error401");
                title = $.i18n.prop("messages.common.header.http_status_401");
            }
            if(errorCode == 400) { //bad request
                message = $.i18n.prop("messages.registration.create.error400");
                title = $.i18n.prop("messages.common.header.http_status_400");
            } else if(errorCode == 409) { // username already exist
                // platform server error
                message = $.i18n.prop("messages.registration.create.error409");
            } else if(errorCode == 500) { // platform server internal server error
                message = $.i18n.prop("messages.registration.create.error500");
                title = $.i18n.prop("messages.common.header.http_status_500");
            } else if (errorCode == "invalid") {
                message = $.i18n.prop("messages.common.invalid.total_invalids");
                title = $.i18n.prop("messages.common.invalid.header.total_invalids");
            }

            horizon.app.Utils.showAlertErrorMessage(message, title, callback);
        },

        submit: function(e) {
            e.preventDefault();
            var self = this;

            self.$cancelButton.attr("disabled", "disabled");
            self.startSubmitIndicator(self.$submitButton);
            // Trigger event for custom product template use
            $(document).trigger('registrationOnSubmit');

            self.registrationModel.prodId = self.prodId;
            self.registrationModel.username = self.user.username;
            self.registrationModel.token = self.token;
            // Set config registration flow for the backend
            var productProps = this.productPropsModel.getReturnCustomerRegProps();
            self.registrationModel.activateAccount = productProps.activateAccount;
            self.registrationModel.sendActivationEmail = productProps.sendActivationEmail;
            // Set custom fields
            self.registrationModel.productModel.set(self.$el.find(".custom-template-container :input").serializeObject());
            self.registrationModel.productModel.set("name", this.productPropsModel.getSharedAppProperties().iamProductCategory);


            self.registrationModel.save({}, {
                success: function(model, resp){
                    //{"success":false,"errorCode":401,"errorString":"Invalid or expired token","redirectUrl":null}
                    if(resp.success === true ) {
                        window.location = resp.redirectUrl;
                        // Go to confirmation date
                        //self.contextMgr.regViewEvent.trigger("registrationSuccess", "registration success event");
                    } else {
                        debug.log("Horizon existing user registration failure.");
                        self._displayError(resp.errorCode);
                    }
                    self.stopSubmitIndicator(self.$submitButton, function(){
                        self.$cancelButton.attr("disabled", "enabled");
                    });
                },
                error: function(model, resp){
                    self._displayError(resp.status);
                    self.stopSubmitIndicator(self.$submitButton, function(){
                        self.$cancelButton.attr("disabled", "enabled");
                    });
                }
            });
        },

        redirectProductHome: function(e){
            e.preventDefault();
            location.href = window.cancelUrl;
        }

    });

});