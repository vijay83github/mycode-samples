define([
  
  "text!admin.templates/configWizardTemplate.html",
  "text!admin.templates/productConfigTemplate.html",
  "text!admin.templates/loginConfigTemplate.html",
  "text!admin.templates/registrationConfigTemplate.html",
  "text!admin.templates/productConfigUpdateTemplate.html",
  "text!admin.templates/loginConfigUpdateTemplate.html",
  "text!admin.templates/registrationConfigUpdateTemplate.html",
  "text!admin.templates/saveConfigTemplate.html",
  'text!admin.templates/neuviewTemplate.html',

  "admin.model.configModel",
  // "admin.views.embeddedLoginView",
  'jquery.smartwizard',
  "jquery.i18n",
  "jquery.validate",
  'jquery.fancybox2'
  
  // 'jquery.fileUpload',
  // 'jquery.uploadiframeSupport'

], function(tmplWiz, tmplProd, tmplLogin,tmplRegist, tmplProdUpd, tmplLoginUpd,tmplRegistUpd,tmplSave, neuviewTemplate) {
  quova.platform.admin.views.ConfigWizardView = Backbone.View.extend({
    
    el              : "#admin-content-div",
    model           : null,
    category        : null,
    isCreate        : true,
    isEmbeddedLogin : false,
    horizonAppsUrl  : "http://localhost:8080/apps/",
    hrefTmpl        : '<a href="<%-url%>" target="_blank"><%-url%></a>',

   /**
    *
    * Initiliaze model
    *
    **/

    initialize: function(options) {
      
      debug.debug("ConfigWizardView.initialize");
      this.model = new quova.platform.admin.models.ConfigModel();
      if (options.category) {
        this.category = options.category;
        this.isCreate = false;
      }

    },


    /**
    *
    * Events
    *
    **/

    events: {
      "change #use-default-template" : "_useDefaultTemplate",
      "change #api-key-checkbox"     : "togglePasswordHiding",

      /**
      
        TODO:
        - Debug
        - Causes multiple expansions after calling save & finish
      
      **/
      

      /* Expand Images on Hover
      // -----------------------------*/
      // "mouseenter #step-one-mini-img" : 'expandImage',
      // "mouseenter #step-three-top"    : 'expandImage',
      // "mouseenter #step-three-mid"    : 'expandImage',
      // "mouseenter #step-three-bottom" : 'expandImage',

      /* Contract Images on Leave
      // ----------------------------*/
      // "mouseleave #step-one-mini-img" : 'contractImage',
      // "mouseleave #step-three-top"    : 'contractImage',
      // "mouseleave #step-three-mid"    : 'contractImage',
      // "mouseleave #step-three-bottom" : 'contractImage'
    },

    togglePasswordHiding: function(event){
      if($('#api-key-checkbox').is(":checked")) {
        $('#service_api_secret').prop('type','text');
      }
      else{
        $('#service_api_secret').prop('type','password');
      }
    },

    expandImage: function(event){
      var $el = $('#' + event.srcElement.id);
      $el.animate({ margin: -25, width: "+=50", height: "+=50" });
    },

    contractImage: function(event){
      var $el = $('#' + event.srcElement.id);
      $el.animate({ margin:   0, width: "-=50", height: "-=50" });
    },

    /**
    *
    * Render
    *
    **/
    
    render: function() {
      debug.debug("ConfigWizardView.render");
      var self = this;

      // add the wizard view first
      $(this.el).html(_.template(tmplWiz));

      //If user is creating new page
      if (this.isCreate) {
        // add the steps from our templates
        $('#step-prod').html(_.template(tmplProd));
        $('#step-login').html(_.template(tmplLogin));
        $('#step-registration').html(_.template(tmplRegist));
        this._completeRender();
      }
      //else user is editing an existing Page
      else {
        this._fetchConfigData();
      }
    },

    _updateAppUrls: function(productId){
        this.$loginUrl = this.$el.find("#login-app-url");
        this.$regUrl   = this.$el.find("#reg-app-url");
        this.$prUrl    = this.$el.find("#pr-app-url");
        this.$loginUrl.html(_.template(this.hrefTmpl,
            {url:this.horizonAppsUrl+"login?CL="+productId}));
        this.$regUrl.html(_.template(this.hrefTmpl,
            {url:this.horizonAppsUrl+"registration?CL="+productId}));
        this.$prUrl.html(_.template(this.hrefTmpl,
            {url:this.horizonAppsUrl+"pr?CL="+productId}));
    },

    _useDefaultTemplate: function(evt){
        evt.preventDefault();
        if($(evt.currentTarget).is(':checked')){
            this.$el.find("#product_login_lTemplate").attr('disabled', 'disabled').val("");
        } else {
            this.$el.find("#product_login_lTemplate").removeAttr('disabled').val("");
        }
    },

    _fetchConfigData: function() {
      var self = this;

      this.isEmbeddedLogin = false;

      //set category so that model knows what to fetch
      this.model.set("category",this.category);

      this.model.fetch({
        success: function(resp, xhr) {
          debug.debug("configListView._fetchConfigData fetch successful");
          console.log(self.model);
          self._fillFormData();
        },
        error: function() {
          debug.debug("configListView._fetchConfigData fetch failed " + arguments[1].statusText);
          // If fetching fails, why take them to create a new one? Means there is a big issue.
          // self.isCreate = true;
          // $('#step-prod').html(_.template(tmplProd));
          // $('#step-login').html(_.template(tmplLogin));
          // $('#step-registration').html(_.template(tmplRegist));
          // self._completeRender();
        }
      });
    },

    _fillFormData: function() {
      var self = this;

      // Use the model data to fill in the form templates
      var formData = {
        data: this.model.attributes
      };
      
      // var jsonObj = JSON.parse(this.model.get("jsonConfig"));
      // formData.jsonObj = jsonObj;

      // fill Step templates with data
      $('#step-prod').html(_.template(tmplProdUpd, formData));
      $('#step-login').html(_.template(tmplLoginUpd, formData));

      // // need to process the filenames for registration step
      // var fileArray = [];
      // var files = "";
      // var fileObjArray = formData.jsonObj.registration.htmlTemplates.formTemplates.files;
      // if (fileObjArray.length > 0) {
      //   $.each(fileObjArray, function(index, object){
      //     fileArray.push(object.fileName);
      //   });
      //   files = fileArray.join(",");
      // }
      // formData.jsonObj.registration.htmlTemplates.formTemplates.files = files;

      $('#step-registration').html(_.template(tmplRegistUpd, formData));

      this._completeRender();
    },



    _completeRender: function() {
      var self = this;

      // wizard parameters
      var wizParams = {
        labelFinish   : "Save & Finish",
        onShowStep    : this._onShowStep,
        onLeaveStep   : this._onLeaveStep,
        onFinish      : this._onFinish,
        cycleSteps    : false,
        keyNavigation : false
      };
      if (!this.isCreate) {
        //wizParams.enableFinishButton = true;
        wizParams.enableAllSteps = true;
      }
      // construct the wizard
      this.wizard = $('#wizard').smartWizard(wizParams);
      debug.debug("ConfigWizardView.render after wizard");

      // I want a cancel button for my wizard, so add one!
      var cancelBtn = '<a href="#list" class="buttonCancel">Cancel</a>';
      var btn = $(cancelBtn).insertBefore($('#wizard .buttonFinish'));

        // validation - first step
        $("#new-product-form").validate({
          rules: {
            product_name: {
              required: true
            },
            apiKey: {
              required: true
            },
            secret: {
              required: true
              
            }
         },
          messages: {
            product_name: {
              required: "Product name cannot be blank"
            },
            apiKey: {
              required: "Enter the API Key"
            },
            secret: {
              required: "Enter the API Shared Secret value"
            }
          }
        });

        // validation - second step
        $("#new-login-form").validate({
          rules: {
            loginTargetUrl: {
              required: true
            }
          },
          messages: {
            loginTargetUrl: {
              required: "Enter the URL for the login Target Page"
            }
          }
        });
      },

    _onShowStep: function(obj) {
      var step_num= obj.attr('rel');
      debug.debug("_onShowStep: " + step_num);

      var self = quova.platform.admin.router.Router.configWizardView;

      // before we show the final step, we need to fill in the calculated values
      if (step_num == "4") {
        quova.platform.admin.router.Router.configWizardView._fillFormResults();
                self._updateAppUrls(self.$el.find("#product_name_create").val());
      }

            if(self.isCreate === true) {
                var prodName = self.$el.find("#product_name_create").val();

                if(step_num == "2") {
                    self.$el.find("#product_name_login").text(prodName);
                }

                if(step_num == "3") {
                    self.$el.find("#product_name_regist").text(prodName);
                }
            }

      return true;
    },

    _onLeaveStep: function(obj) {
      var step_num= obj.attr('rel');
      debug.debug("_onLeaveStep: " + step_num);

      switch (step_num) {

        case "1":
          if (! $("#new-product-form").valid()) {
            $('#wizard').smartWizard('setError',{stepnum:step_num,iserror:true});
            return false;
          } else {
            $('#wizard').smartWizard('setError',{stepnum:step_num,iserror:false});
          }
          break;
        
        case "2":
          if (! $("#new-login-form").valid()) {
            $('#wizard').smartWizard('setError',{stepnum:step_num,iserror:true});
            return false;
          } else {
            $('#wizard').smartWizard('setError',{stepnum:step_num,iserror:false});
          }
          break;
        
        case "3":

          if (! $("#new-registration-form").valid()) {
            $('#wizard').smartWizard('setError',{stepnum:step_num,iserror:true});
            return false;
          } else {
            $('#wizard').smartWizard('setError',{stepnum:step_num,iserror:false});
          }
          break;
        
      }
      return true;
    },

    _onFinish: function(obj) {
      var step_num= obj.attr('rel');
      debug.debug("_onFinish: " + step_num);

      var self = quova.platform.admin.router.Router.configWizardView;

      // validate all steps
      if (! $("#new-product-form").valid()) {
        $('#wizard').smartWizard('setError',{stepnum:1,iserror:true});
        return false;
      }
      if (! $("#new-login-form").valid()) {
        $('#wizard').smartWizard('setError',{stepnum:2,iserror:true});
        return false;
      }
      if (! $("#new-registration-form").valid()) {
        $('#wizard').smartWizard('setError',{stepnum:3,iserror:true});
        return false;
      }
      // no errors found
      $('#wizard').smartWizard('setError',{stepnum:1,iserror:false});
      $('#wizard').smartWizard('setError',{stepnum:2,iserror:false});
      $('#wizard').smartWizard('setError',{stepnum:3,iserror:false});

      // get the current form data
      self._fillFormResults();

      // submit the data to the server
      self._submitForm();

      return false;
    },

    _fillFormResults: function() {
      // for step 1, create the product data
      var dataProd = $("#new-product-form").serializeFormObject();
      var dataLogin = $("#new-login-form").serializeFormObject();
      var dataRegist = $("#new-registration-form").serializeFormObject();

      // save the product name
      this.productName = dataProd.product_name;

      // keep track of embedded login
      this.isEmbeddedLogin = dataLogin.product_login_embedded  == 'on' ? true : false;

      // fill model fields
      //this.model.set("embeddedLogin",dataLogin.product_login_embedded == 'on' ? true : false);
      this.model.set("registrationTargetUrl"  , dataRegist.registrationTargetUrl);
      this.model.set("loginTargetUrl"         , dataLogin.loginTargetUrl);
      this.model.set("passwordResetTargetUrl" , dataLogin.passwordResetTargetUrl);
      this.model.set("apiKey"                 , dataProd.apiKey);
      this.model.set("secret"                 , dataProd.secret);

      // Code for Flattened Data for Kenneth's Code

      this.model.set("includeNeustarLogo"              , dataProd.include_neustar_logo == 'on'? true : false );
      this.model.set("logoHref"                        , dataProd.product_logo_url );
      this.model.set("logoSourceUrl"                   , dataProd.product_logo_url_path );
      this.model.set("logoTooltip"                     , dataProd.product_logo_tooltip );
      this.model.set("loginShowRegistrationLink"       , dataLogin.product_reg_link == 'on' ? true : false );
      this.model.set("loginLeftPaneTemplate"           , dataLogin.useDefaultTemplate == 'on'? true : false );
      this.model.set("loginEmbeddedLogin"              , dataLogin.product_login_embedded  == 'on' ? true : false);
      this.model.set("registrationPageTitle"           , dataRegist.product_reg_pageTitle );
      this.model.set("registrationPageSubTitle"        , dataRegist.product_reg_pageSubTitle );
      this.model.set("registrationTabLabel"            , dataRegist.product_reg_tabLabel );
      this.model.set("registrationAuthnAfterReg"       , true );
      this.model.set("registrationSendActivationEmail" , dataRegist.product_reg_sendEmail == 'on' ? true : false );
      this.model.set("registrationUseEmailForUsername" , dataRegist.product_reg_usernameEmail == 'on' ? true : false );
      this.model.set("introTemplateFilename"           , dataRegist.product_introFilename );
      this.model.set("introTemplateWidth"              , dataRegist.product_introWidth );
      this.model.set("introTemplatePlaceOnLeft"        , dataRegist.product_introLeft == 'on' ? true : false );
      this.model.set("formTemplatesFiles"              , dataRegist.product_formFilename );
      this.model.set("formTemplatesWidth"              , dataRegist.product_formWidth );


      // construct the JSON data

      // this.jsonObj = {};
      // this.jsonObj[dataProd.product_name] = {

      //   'sharedAppProperties': {
      //     'includeNeustarLogo' : dataProd.include_neustar_logo == 'on'? true : false,
      //     'logoHref'           : dataProd.product_logo_url,
      //     'logoSourceUrl'      : dataProd.product_logo_url_path,
      //     'logoTooltip'        : dataProd.product_logo_tooltip
      //   },

      //   'login': {
      //     'showRegistrationLink' : dataLogin.product_reg_link == 'on' ? true : false,
      //     'leftPaneTemplate'     : dataLogin.product_login_lTemplate,
      //     'embeddedLogin'        : dataLogin.product_login_embedded  == 'on' ? true : false
      //   },

      //   'registration': {

      //     'pageTitle'           : dataRegist.product_reg_pageTitle,
      //     'pageSubTitle'        : dataRegist.product_reg_pageSubTitle,
      //     'tabLabel'            : dataRegist.product_reg_tabLabel,
      //     //'authnAfterReg'     : dataRegist.product_reg_authAfter,
      //     'authnAfterReg'       : true,  // set this value to true for now
      //     'sendActivationEmail' : dataRegist.product_reg_sendEmail == 'on' ? true : false,
      //     'reservedFields'      : {
      //       'useEmailForUsername' : dataRegist.product_reg_usernameEmail == 'on' ? true : false
      //     },

      //     'htmlTemplates': {
            
      //       'introTemplate': {
      //         'fileName'        : dataRegist.product_introFilename,
      //         'width'           : dataRegist.product_introWidth,
      //         'placementOnLeft' : dataRegist.product_introLeft == 'on' ? true : false
      //       },
      //       'formTemplates': {
      //         'files': dataRegist.product_formFilename,
      //         'width': dataRegist.product_formWidth
      //       }
      //     }
      //   }
      // };

      // set the model data
      // turn configuration into a string
      // var stringConfig = JSON.stringify(this.jsonObj[dataProd.product_name]);

      this.model.set("category", dataProd.product_name);
      // this.model.set("jsonConfig",stringConfig);

      // for step 2, create the service data
      //data = $("#new-service-form").serializeFormObject();

      var category = this.model.get("category");
      this.textObj = {
        //"environment": dataProd.service_env,
        "configuration":
            category + ".reg.target_url=" +  dataRegist.registrationTargetUrl + "\n" +
            category + ".login.target_url=" + dataLogin.loginTargetUrl + "\n" +
            category + ".pr.target_url=" + dataLogin.passwordResetTargetUrl + "\n" +
            category + ".apikey=" + dataProd.apiKey + "\n" +
            category + ".secret=" + dataProd.secret + "\n"
      };

      // set form fields
      var formData = {
        data: {
          // productJson: JSON.stringify(this.jsonObj, undefined, 4),
          serviceText: this.textObj
        }
      };

      // render step content
      $('#step-saveconf').html(_.template(tmplSave, formData));
    },

    _submitForm: function() {
      debug.debug("SourceCodeView:submitForm");
      console.log("attempting to submit");
      var self = this;

      // Fill single fields in model
      var fieldVal = $('#service_reg_callback').val();
      if (fieldVal === null) {
        this.model.set("registrationTargetUrl","");
      } else {
        this.model.set("registrationTargetUrl",fieldVal);
      }

      fieldVal = $('#service_pwreset_callback').val();
      if (fieldVal === null) {
        this.model.set("passwordResetTargetUrl","");
      } else {
        this.model.set("passwordResetTargetUrl",fieldVal);
      }

      //submit client configuration to the server
      this.model.save(this.model.attributes, {
        type: 'PUT',
        error: function() {
          debug.debug("Error saving configuration");
          $("#wizard").smartWizard('showMessage', 'Configuration could not be saved.');
        },
        success: function(model, resp) {
          debug.debug("Success saving configuration");
          console.log("success saving model", model);
          self._createEmbeddedView();
        }
      });



    },

    _createEmbeddedView: function() {
      var self = this;

      // Goes back to products list after successful save
      if (!this.isEmbeddedLogin) {
        this._gotoStart();
        return;
      }

      require(['admin.views/embeddedLoginView'], function(){
        var embedded = new quova.platform.admin.views.EmbeddedLoginView({model: self.model});
        self._showSuccess(embedded);
      });
    },

    /**
    *
    * Show Embeddable Code w/ Fancybox
    *
    **/
    
    _showSuccess: function(view) {
      var self = this;

      // show a popup with the copy/paste code
      $.fancybox(view.$el, {
        helpers : {
          overlay : {
            opacity: 0.6,
            css : {
              'background-color' : '#000000'
            },
                        closeClick: false
          }
        },
        wrapCSS        : "finish-popover",
        padding        : 5,
        width          : '350px',
        height         : '500px',
        topRatio       : 0.2,
        scrolling      : false,
        modal          : false,
        closeBtn       : true,
        closeClick     : false,
        transitionIn   : 'none',
        transitionOut  : 'none',
        autoDimensions : false, // based on content
        fixed          : true,
        mouseWheel     : false,
        beforeLoad: function() {
          //$.fancybox.showLoading();
          view.render();
        },
        afterShow: function(evt) {
          // show the contents of the popup
          var formData = {
            data: { category: self.category }
          };
          var tmpl = (_.template(neuviewTemplate,formData));
          var encodeTmpl = _.escape(tmpl);
          $(".finish-popup-code").html(encodeTmpl);

          $("body").css("overflow", "hidden");
          $(".fancybox-skin").append('<div class="fancybox-item fancybox-close" title="Close"></div>');
          $(".fancybox-skin .fancybox-close").on("click", function(evt) {
            evt.preventDefault();
            $.fancybox.close( true );
          });
        },
        afterClose: function() {
          $.fancybox.hideLoading();
          $("body").css("overflow", "auto");
          // call the finish step again
          self._gotoStart();
          //$("#wizard").smartWizard('goToStep', 4);
        }
      });
      //$.fancybox.showLoading();
    },

    /**
    *
    * Goes back to list of products. Only used by embeddedLogin function.
    *
    **/
    
    _gotoStart: function() {
      $("#wizard").smartWizard('showMessage', 'Configuration Saved');
      // go back to list
      quova.platform.admin.router.Router.navigate("list",
        {trigger: true});
    }

  });

    return quova.platform.admin.views.ConfigWizardView;
});