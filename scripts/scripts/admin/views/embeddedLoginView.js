define([
    'text!admin.templates/embeddedLoginTemplate.html' /*,
    'text!admin.templates/neuviewTemplate.html' */
],function(embedTemplate /*, neuviewTemplate */){
	quova.platform.admin.views.EmbeddedLoginView = Backbone.View.extend({
        //tagName: "div",
        className: "finish-embedded-view",
		model: null,

		initialize: function(options) {
			this.model = options.model;
		},

        events: {
            /*'click .finish-popup-close-button': function(evt){
                evt.preventDefault();
                $.fancybox.close();
            }*/
        },

        render: function() {
            var self = this;
	        var formData = {
		        data: this.model.attributes
	        };
            self.$el.html(_.template(embedTemplate));

	        /*
	        var encodeTmpl = _.escape(neuviewTemplate);
            $(".finish-popup-code").html(_.template(encodeTmpl));
            */
        }

	});

    return quova.platform.admin.views.EmbeddedLoginView;

});