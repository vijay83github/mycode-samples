define([
    'model.baseModel',
    'model.reg.productModel',
    'app.protocol',
    'jquery.metadata'
],
    function() {
        quova.platform.model.registration.RegistrationModel = quova.platform.model.BaseModel.extend({
            entityType: "user",
            parseCallback: null,

            url: function() {
                // http://localhost:8080/apps/registration/createuser?CL=gp.od.dev.nsr&active=true&sendActivationEmail=true
                var params = "?CL="+this.productId;

                if(quova.platform.app.registration.ContextMgr.activateAccount() === true) {
                    params += "&active=true";  // activate the account upon user creation
                } else {
                    params += "&active=false"; // do not activate the account upon user creation
                }

                if(quova.platform.app.registration.ContextMgr.sendActivationEmail() === true) {
                    params += "&sendActivationEmail=true";
                } else {
                    params += "&sendActivationEmail=false";
                }

                return quova.platform.app.protocol.registration.CreateUser+params;
            },

            initialize: function() {
                this.productId = quova.platform.app.registration.ContextMgr.getProductId();
                var ProductCollection =  Backbone.Collection.extend({
                    model: quova.platform.model.registration.ProductModel });

                this.productModel = new quova.platform.model.registration.ProductModel({
                        name: quova.platform.app.registration.ContextMgr.iamProductCategory()
                });

                this.productCollection = new ProductCollection();

                this.productCollection.add(this.productModel, {silent: true});
            },

            toJSON: function() {
                var payload = {};
                var _attributes = _.clone(this.attributes);
                if(_attributes.confirmEmail) {
                    delete _attributes.confirmEmail;
                }
                if(_attributes.confirmPassword) {
                    delete _attributes.confirmPassword;
                }
                payload[this.entityType] = _attributes;
                payload[this.entityType].products =  _.clone(this.productCollection.toJSON());

                debug.debug("Registration POST payload", JSON.stringify(payload));

                return payload;
            },

            clear: function() {
                this.productModel.destroy();
                this.destroy();
            }

           /* parse: function(resp, xhr) {
              if(this.parseCallback != null) this.parseCallback(resp, xhr);
              return resp;
            }*/

        });
        return quova.platform.model.registration.RegistrationModel;
});
