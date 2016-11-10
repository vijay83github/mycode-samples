define([
  //'jquery.i18n',
  //'backbone'
  'admin.views.configListView',
  'admin.views.configWizardView'
], function() {
  var appRouter = Backbone.Router.extend({
    initialize: function() {
      debug.debug("router.initialize");
    },

    routes: {
      'list'            : 'showConfigList',
      'config/:category': 'showConfigWizard',
      'config'          : 'showConfigWizard',
      //catch the rest
      '*actions'        : 'defaultAction'
    },

    defaultAction: function(actions){
      debug.debug("router.defaultAction");
      this.showConfigList();
    },

    showConfigList: function() {
      debug.debug("router.showConfigList: ");

      // close previous view of this page
      quova.platform.admin.views.ViewManager.close(this.configListView);

      // create the page content
      debug.debug("router.configListView: before view");
      this.configListView = new quova.platform.admin.views.ConfigListView({
      });
      this.configListView.render();
    },

    showConfigWizard: function(category) {
      debug.debug("router.showConfigWizard: ");

      // close previous view of this page
      quova.platform.admin.views.ViewManager.close(this.configWizardView);

      // create the page content
      debug.debug("router.configWizardView: before view");
      this.configWizardView = new quova.platform.admin.views.ConfigWizardView({
        category: category
      });
      this.configWizardView.render();
    }
  });

  var initialize = function() {
    quova.platform.admin.router.Router = new appRouter();
    Backbone.history.start();
  };

  return {
    initialize: initialize
  };
});
