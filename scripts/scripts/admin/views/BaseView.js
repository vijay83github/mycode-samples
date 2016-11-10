define([], function() {

    quova.platform.admin.views.BaseView = Backbone.View.extend({
        clear: function() {
            this.model.clear();
        }
    });

    return quova.platform.admin.views.BaseView;

});