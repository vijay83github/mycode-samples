define([
  "text!admin.templates/configListTemplate.html",
  //"backbone",
  "datatables",
  "jquery.i18n",
  //"protocol",
  //"jquery.cookie",
  "datatables.plugins.fnFindCellRowIndexes",
  'datatables.plugins.fnPaginationWithNumbers',
  'admin.collection.configCollection'
], function(tmpl) {
  quova.platform.admin.views.ConfigListView = Backbone.View.extend({
      
      el                : "#admin-content-div",
      timeoutCounter    : 0,
      configCollection  : null,
      // load_indicator : null,

      initialize: function() {
      debug.debug("configListView.initialize");
      },

      events: {
        "click #newConfigBtn" : function() {
          quova.platform.admin.router.Router.navigate(
            "config",
            {trigger: true});
        }
      },

      render: function() {
        var self = this;

        // has the list been fetched yet?
        if (this.configCollection === null) {
          this.initConfigCollection();
        }

        // load page template
        $(this.el).html(_.template(tmpl));

        /*
        // set the load indicator
        this.load_indicator = $("#accounts .account-list-loader");

        // turn on wait indicator
        this.showWaitIndicator();
        */
      },


      initConfigCollection: function() {
        var self = this;
        delete this.configCollection;
        this.configCollection = null;

        debug.debug("configListView.initConfigCollection");
        var configCollection = new quova.platform.admin.collections.ConfigCollection();

        configCollection.fetch({
          success: function(resp) {
            debug.debug("configListView.initConfigCollection fetch successful");
            self.configCollection = configCollection;
            self._createTable();
            //self.hideWaitIndicator();
          },
          error: function() {
            debug.debug("configListView.initConfigCollection fetch failed " + arguments[1].statusText);
            self.configCollection = null;
            //self.hideWaitIndicator();
          }
        });
      },

      _createTable: function() {
        var self = this;

        // retrieve the list of accounts from the global object
        this.listColumns = this.configCollection.getColumns();
        debug.debug("ConfigListView._createTable");

        var tableEl = this.$el.find('#config-list-table');

        // need to pass in the data to my dataTable as JSON
        var listData = this.configCollection.toJSON();

        // create the UI grid containing the list of Configurations
        var paginate_oLanguage = {
          oPaginate : {
            sFirst    : "",
            sLast     : "",
            sNext     : "",
            sPrevious : ""
          }
        };

        /**
        *
        * Hack Together new JSON field
        *
        **/
        
        var lenListData = listData.length;
        for (var i = 0 ; i < lenListData; i ++){
          listData[i].sampleWebsiteURL_reg   = window.location.origin + "/apps/registration?CL=" + listData[i].category;
          listData[i].sampleWebsiteURL_login = window.location.origin + "/apps/login?CL=" + listData[i].category;
        }
        console.log(listData);
        /* End Hacking
        ------------------------------------------------------------*/

        this.configTable = tableEl.dataTable( {
          "aaData"          : listData,
          "aoColumns"       : self.listColumns,
          "aaSorting"       : [[0,'asc']],
          "sAjaxDataProp"   : "configs",
          "sScrollY"        : "350px",
          "sPaginationType" : "input",     // let user enter a page number
          "oLanguage"       : paginate_oLanguage,    // overwrite text for pagination buttons
          "bLengthChange"   : false, // turn off the ability for the user to select the number of rows to disiplay
          "iDisplayLength"  : 15,   // number of rows to display in the table
          "bJQueryUI"       : true,      // enable ThemeRoller
          "bProcessing"     : true,     // enable spinner
          "fnRowCallback": function( nRow, aData, iDataIndex ) {
            // callback when row has been updated
            //debug.debug("configListView.fnRowCallback called: ",nRow," ", aData, " ", iDataIndex);
            // does this row already have a link?
            var hasLink = $('a', nRow);

            var hrefLinkReg   = window.location.origin + "/apps/registration?CL=" + aData.category;
            var hrefLinkLogin = window.location.origin + "/apps/login?CL=" + aData.category;

            if (hasLink.length === 0) {
              $('td:eq(0)', nRow).wrapInner('<a class="horizon_config" />');
              $('td:eq(1)', nRow).wrapInner('<a href=' + hrefLinkLogin + '/>');
              $('td:eq(2)', nRow).wrapInner('<a href=' + hrefLinkReg + '/>');
            }
          }
        } );
       

        // set up click handler on the row links
        tableEl.on("click", '.horizon_config',  function(event, data) {
          var rows = $(this).parents('tr');
          var theTable = self.configTable;
          var tableRow = theTable.fnGetData(rows[0]); // this is the model for the row
          debug.debug("modify config: " + tableRow.category + "; id: " + tableRow.id);

          // open the detail view
          quova.platform.admin.router.Router.navigate(
            //"config/"+tableRow.id,
            "config/"+tableRow.category,
            {trigger: true});
        });
      }

    });

    return quova.platform.admin.views.ConfigListView;
});