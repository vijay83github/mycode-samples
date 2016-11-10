define(['backbone'], function() {

    quova.platform.view.BaseView = Backbone.View.extend({
        clear: function() {
            this.model.clear();
        },

        goToParentWindow: function(evt) {
            var aEle = $(evt.currentTarget);
            if(aEle.attr("href") &&  aEle.attr("href") != "") {
                if(aEle.attr("href").toLowerCase().indexOf("mailto:") >= 0) {
                    return;
                }

               evt.preventDefault();
               parent.window.location = location.protocol + '//' + location.host + aEle.attr("href");
            }
        }
    });

    return quova.platform.view.BaseView;

});