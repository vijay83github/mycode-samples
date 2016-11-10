define([
	"jquery.i18n",
	"app.protocol"
], function() {
    quova.platform.view.ViewManager = {

        initialize: function() {
        	debug.debug("ViewManager.initialize");
            $.fn.serializeObject = function(){
               var o = {};
               var a = this.serializeArray();
               $.each(a, function() {
                   if (o[this.name] !== undefined) {
                       if (!o[this.name].push) {
                           o[this.name] = [o[this.name]];
                       }
                       o[this.name].push(this.value || '');
                   } else {
                       o[this.name] = this.value || '';
                   }
               });
               return o;
           };
        },

        close: function(view) {
            if(!view) return;

            view.$el.html("");
            view.unbind();

        },

        remove: function(view) {
            if(!view) return;

            view.remove();
            view.unbind();

        }
    };

    return quova.platform.view.ViewManager;
});