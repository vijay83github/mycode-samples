define(['admin.model.configModel'], function() {

  quova.platform.admin.collections.ConfigCollection = Backbone.Collection.extend({

    columns: [
      { mDataProp: "category", sTitle: "Product Id" , sWidth: "300px"  },
      { mDataProp: "sampleWebsiteURL_login", sTitle: "Sample Pages Login" },
      { mDataProp: "sampleWebsiteURL_reg", sTitle: "Sample Pages Registration" }
    ],

    model: quova.platform.admin.models.ConfigModel,

    // URL is used to "create" new models in this collection. It will be used in the call to the server.
    url: function() {
      debug.debug("configCollection.url");
      return "/apps/admin/config/";
    },

    parse: function(resp, xhr) {
      debug.debug("configCollection.parse returning data");
      return resp.configs;
    },

    getColumns: function() {
      return this.columns;
    }

    /*search: function (attribute, value) {
      return this.some(function(x) {
        return x.get(attribute) === value;
      });
    }*/

  });

  return quova.platform.admin.collections.ConfigCollection;
});