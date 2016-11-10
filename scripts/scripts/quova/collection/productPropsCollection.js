define(['backbone', 'models/productPropsModel'],function() {

    horizon.collection.ProductPropsCollection = Backbone.Collection.extend({
        model: horizon.model.ProductPropsModel,

        url: function() {
            //return "https://s3-us-west-2.amazonaws.com/nexgen-horizon-dev/properties.json";
            // return "/apps/pc/products/properties.json";
        },

        defaults: {
        },

        parse: function(data){
            debug.debug("ProductPropsCollection", data);
            return data.products;
        }


    });

    //return quova.platform.model.registration.ProductModel;
});