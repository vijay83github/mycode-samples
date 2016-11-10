define([
	'app.protocol',
	'admin.model.baseModel'],
	function() {
	quova.platform.admin.models.ConfigModel = quova.platform.admin.models.BaseModel.extend({

		type: 'POST',
		url: function() {
			return "/apps/admin/config/" + this.get("category");
			// return "knolas.dev.quova.com:8080/apps/admin/config/" + this.get("category");
		},
		// custom id attribute
		idAttribute: "category"
	});

	return quova.platform.admin.models.ConfigModel;
});
