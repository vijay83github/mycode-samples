define([], function() {
     quova.platform.model.BaseModel = Backbone.Model.extend({
        entityType: "",

        /**
         * Override Backbone.Model.toJSON function for adding entityType wrapper object
         */
        toJSON: function() {
            var payload = {};
            payload[this.entityType] = _.clone(this.attributes);

            return payload;
        },

        setEntityType: function(entityType) {
            this.entityType = entityType;
        },

        clear: function() {
            this.destroy();
        }

    });

    return quova.platform.model.BaseModel;
});