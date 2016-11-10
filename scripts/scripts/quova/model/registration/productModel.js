define(['backbone'],
    function() {
        quova.platform.model.registration.ProductModel = Backbone.Model.extend({

            toJSON: function() {
                var clonedAttrs = _.clone(this.attributes);
                var name = clonedAttrs.name;
                delete clonedAttrs.name;

                return  {
                    name:   name,
                    fields: clonedAttrs
                };
            }
        });

        return quova.platform.model.registration.ProductModel;
});
