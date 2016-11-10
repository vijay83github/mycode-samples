define([
    'backbone',
    'models/registration/productModel'
],
    function() {
        horizon.model.registration.ReturnCustomerRegModel = Backbone.Model.extend({
            entityType: 'user',

            url: function(){
                var uriComponents = "CL=" + this.prodId +
                    "&un=" + encodeURIComponent(this.username) +
                    "&tk=" + this.token+
                    "&active=" + this.activateAccount+
                    "&sendActivationEmail=" + this.sendActivationEmail;

                return "/apps/registrationeu/updateuser/?" +  uriComponents;
            },


            initialize: function(options) {
                var ProductCollection =  Backbone.Collection.extend({
                    model: quova.platform.model.registration.ProductModel });

                this.productModel = new quova.platform.model.registration.ProductModel();

                this.productCollection = new ProductCollection();

                this.productCollection.add(this.productModel, {silent: true});
            },

            toJSON: function() {
                var payload = {};
                payload[this.entityType] = {};
                payload[this.entityType].products = this.productCollection.toJSON();

                return payload;
            },

            clear: function() {
                this.productModel.destroy();
                this.destroy();
            }

        });
});
