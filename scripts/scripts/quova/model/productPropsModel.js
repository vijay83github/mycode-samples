define(['backbone'],function() {
    horizon.model.ProductPropsModel = Backbone.Model.extend({
        url: function() {
            //return "https://s3-us-west-2.amazonaws.com/nexgen-horizon-dev/properties.json";
            // return "/apps/pc/products/properties.json";
        },

        initialize: function(options){

            if(!options.productId) {
                new Error('"Product Id" must be defined for ProductPropsModel initialize.');
                return;
            }
            this.productId = options.productId;
        },

        defaults: {
        },

        parse: function(data){
            if(!data.products) {
                horizon.app.Utils.showErrorView("PAGE_NOT_FOUND");
                return data;
            }

            debug.debug("ProductPropsModel", data.products[this.productId]);

            this.productProps = data.products[this.productId];
            this.returnCustomerRegProps = this.getReturnCustomerRegProps();

            return this.productProps;
        },

        getSharedAppProperties: function() {
            var props = this.productProps["sharedAppProperties"];

            var sharedAppProperties = {
                iamProductCategory: "",
                pageHeader: "",
                logoHref: "",
                logoSourceUrl: "",
                logoTooltip: ""
            };

            if(!props) {
                debug.warn("pageInfo not defined.");
                return sharedAppProperties;
            }

            if(!props.logoTooltip) {
                debug.warn("iamProductCategory not defined.");
            } else {
                sharedAppProperties.iamProductCategory = props.iamProductCategory;
            }

            if(!props.logoHref) {
                debug.warn("Product logo Href not defined.");
            } else {
                sharedAppProperties.logoHref = props.logoHref;
            }

            if(!props.logoSourceUrl) {
                debug.warn("Product logo source url not defined.");
            } else {
                sharedAppProperties.logoSourceUrl = props.logoSourceUrl;
            }

            if(!props.logoTooltip) {
                debug.warn("Product logo image tooltip not defined.");
            } else {
                sharedAppProperties.logoTooltip = props.logoTooltip;
            }

            if(typeof props.includeNeustarLogo == "undefined") {
                sharedAppProperties.includeNeustarLogo = true;
            } else {
                sharedAppProperties.includeNeustarLogo = props.includeNeustarLogo;
            }

            return sharedAppProperties;
        },

        getReturnCustomerRegProps: function(){
            var props = this.productProps["returnCustomerRegistration"];

            var returnCustomerRegistration = {
                htmlTemplates: null,
                submitButtonLabel: null,
                activateAccount: null,
                sendActivationEmail: null
            };

            if(!props) {
                debug.warn('"returnCustomerRegistration" not defined.');
                return returnCustomerRegistration;
            }

            if(typeof(props.activateAccount) == "undefined") {
                debug.warn('"activateAccount" not defined.');
                return returnCustomerRegistration;
            } else {
                returnCustomerRegistration.activateAccount = props.activateAccount;
            }

            if(typeof(props.sendActivationEmail) == "undefined") {
                debug.warn('"sendActivationEmail" not defined.');
                return returnCustomerRegistration;
            } else {
                returnCustomerRegistration.sendActivationEmail = props.sendActivationEmail;
            }

            if(!props.htmlTemplates) {
                debug.warn('"returnCustomerRegistration.htmlTemplates" not defined.');
                return returnCustomerRegistration;
            } else {
                returnCustomerRegistration.htmlTemplates = props.htmlTemplates;
            }

            if(!props.htmlTemplates) {
                debug.warn('"returnCustomerRegistration.htmlTemplates" not defined.');
                return;

            } else {
                returnCustomerRegistration.htmlTemplates = props.htmlTemplates;

                if(!props.htmlTemplates.formTemplates) {
                    debug.warn('"returnCustomerRegistration.htmlTemplates" not defined.');
                } else {
                    returnCustomerRegistration.htmlTemplates.formTemplates = props.htmlTemplates.formTemplates;
                }

                if(!props.htmlTemplates.formTemplates.width) {
                    debug.warn('"returnCustomerRegistration.htmlTemplates.formTemplates.width" not defined.');
                } else {
                    returnCustomerRegistration.htmlTemplates.formTemplates.width = props.htmlTemplates.formTemplates.width;
                }

                if(!props.htmlTemplates.formTemplates.pageTitle) {
                    debug.warn('"returnCustomerRegistration.htmlTemplates.formTemplates.width" not defined.');
                } else {
                    returnCustomerRegistration.htmlTemplates.formTemplates.pageTitle = props.htmlTemplates.formTemplates.pageTitle;
                }

                if(!props.htmlTemplates.formTemplates.files) {
                    debug.warn('"returnCustomerRegistration.htmlTemplates.formTemplates.files" not defined.');
                } else {
                    returnCustomerRegistration.htmlTemplates.formTemplates.files = props.htmlTemplates.formTemplates.files;
                }
            }

            if(!props.submitButtonLabel) {
                debug.warn('"returnCustomerRegistration.submitButtonLabel" not defined.');
            } else {
                returnCustomerRegistration.submitButtonLabel = props.submitButtonLabel;
            }

            return returnCustomerRegistration;
        },

        getTemplateWidth: function(){
            return this.returnCustomerRegProps.htmlTemplates.formTemplates.width;
        },

        getTemplatePageTitle: function(){
            return this.returnCustomerRegProps.htmlTemplates.formTemplates.pageTitle;
        },

        getSubmitButtonLabel: function(){
            return this.returnCustomerRegProps.submitButtonLabel ||
                $.i18n.props("messages.registration.return_customer.submit_button");
        },

        getTemplateFileObjects: function(){
            return this.returnCustomerRegProps.htmlTemplates.formTemplates.files;
        },

        getTemplateFileLocation: function(){
            return "https://s3-us-west-2.amazonaws.com/nexgen-horizon/" + this.productId + "/";
            // return "/apps/pc/products/templates/" + this.productId +"/";
        }


    });

    //return quova.platform.model.registration.ProductModel;
});
