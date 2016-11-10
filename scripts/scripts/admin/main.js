require.config({
    paths: {
       // Require.js plugins
       // Major libraries
      'jquery'                                     : '../libs/jquery/jquery',
      'jquery.ui'                                  : '../libs/jquery/jquery-ui-1.8.18.custom.min',
      'underscore'                                 : '../libs/underscore/underscore',
      'backbone'                                   : '../libs/backbone/backbone',
      'jquery.i18n'                                : '../libs/jquery/jquery.i18n.properties',
      'text'                                       : '../libs/require/text',
      
      // Other libraries
      'json2'                                      : '../libs/json/json2',
      'jquery.activity-indicator'                  : '../libs/jquery/activity-indicator/jquery.activity-indicator',
      'jquery.additional-methods'                  : '../libs/jquery/additional-methods',
      'jquery.ba-postMessage'                      : '../libs/jquery/jquery.ba-postmessage.min',
      'jquery.cookie'                              : '../libs/jquery/jquery.cookie',
      'jquery.debug'                               : '../libs/jquery/ba-debug.min',
      'jquery.fancybox2'                           : '../libs/jquery/jquery.fancybox2',
      'jquery.formalize'                           : '../libs/jquery/jquery.formalize.min',
      'jquery.metadata'                            : '../libs/jquery/jquery.metadata',
      'jquery.validate'                            : '../libs/jquery/jquery.validate',
      'jquery.qtip'                                : '../libs/jquery/qtip/jquery.qtip',
      'jquery.smartwizard'                         : '../libs/jquery/smartwizard/jquery.smartWizard',
      'datejs'                                     : '../libs/date',

      // File Uploading
      // 'jquery.fileUpload'                          : '../libs/jquery/jquery.fileupload',
      // 'jquery.uploadiframeSupport'                 : '../libs/jquery/jquery.iframe-transport',
      // 'jquery.ui.widget'                           : '../libs/jquery/jquery.ui.widget',
      
      // data tables
      'datatables'                                 : '../libs/jquery/jquery.dataTables',
      'datatables.tabletools'                      : '../libs/jquery/dataTables/TableTools',
      'datatables.plugins'                         : '../libs/jquery/dataTables',
      'datatables.plugins.fnFindCellRowIndexes'    : '../libs/jquery/dataTables/fnFindCellRowIndexes',
      'datatables.plugins.fnPaginationWithNumbers' : '../libs/jquery/dataTables/fnPaginationWithNumbers',
      

      // Common helper classes
      'app.protocol'                               : '../quova/app/protocol',
      
      // Admin
      'admin.bootstrap'                            : './bootstrap',
      'admin.router'                               : 'router/router',
      
      // Models
      'admin.collection.configCollection'          : 'collections/configCollection',
      'admin.model.baseModel'                      : 'models/baseModel',
      'admin.model.configModel'                    : 'models/configModel',
      
      // Views
      'admin.views'                                : 'views',
      'admin.views.baseView'                       : 'views/BaseView',
      'admin.viewManager'                          : 'views/ViewManager',
      'admin.views.configListView'                 : 'views/configListView',
      'admin.views.configWizardView'               : 'views/configWizardView',
      'admin.views.embeddedLoginView'              : 'views/embeddedLoginView',
      
      // Templates
      'admin.templates'                            : './templates'
    },

  shim: {
    'jquery': {
      exports: "$"
    },
    'underscore': {
      exports: "_"
    },
    'backbone': {
      deps: ['jquery', "underscore"],
      exports: "Backbone"
    },

    'jquery.ui'                                  : {deps: ['jquery'] },
    'jquery.i18n'                                : {deps: ['jquery'] },
    'jquery.cookie'                              : {deps: ['jquery'] },
    'jquery.validate'                            : {deps: ['jquery'] },
    'jquery.smartwizard'                         : {deps: ['jquery'] },

    'jquery.fileUpload'                          : {deps: ['jquery', 'jquery.ui.widget'] },
    'jquery.uploadiframeSupport'                 : {deps: ['jquery'] },

    'viewManager'                                : {deps: ['jquery', 'admin.bootstrap', 'app.protocol'] },
    'app.protocol'                               : {deps: ['admin.bootstrap'] },
    'datatables.plugins.fnFindCellRowIndexes'    : {deps: [ 'datatables' ] },
    'datatables.plugins.fnPaginationWithNumbers' : {deps: [ 'datatables' ] },
    'datatables.tabletools'                      : {deps: [ 'datatables' ] }

  },
  urlArgs: "t=" +  (new Date()).getTime()

});

require([
  'jquery',
  'underscore',
  'backbone',
  //'jquery.ui',
  'admin.bootstrap',
  'admin.viewManager',
  'admin.router',
  'admin.views.configWizardView',
  'jquery.i18n',
  //'jquery.formalize',
  'jquery.debug'
], function($, _, Backbone, /*jui,*/  bootstrap, viewManager, appRouter) {
  $.i18n.properties({
    name     :'Messages',
    path     :'/apps/resources/bundle/',
    mode     :'both',
    language :'en',
    callback: function() {

      //debug.debug("main before initialize");

      // initialize view manager
      viewManager.initialize();

      // initialize the router
      appRouter.initialize();
    }
  });

});
