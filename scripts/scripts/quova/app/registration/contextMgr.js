define(["jquery.cookie"], function() { 
    quova.platform.app.registration.ContextMgr = {
        env: "dev", // default to dev env
        attrs: {
            appName              : "registration",
            templateDir          : "templates",
            templateAttr         : "htmlTemplates",
            reservedFieldsAttr   : "reservedFields",
            sharedAppProperties  : "sharedAppProperties",
            //iamProductCategory : "iamProductCategory",
            activateAccount      : "activateAccount",
            sendActivationEmail  : "sendActivationEmail",
            siteAnalytics        : "siteAnalytics",
            googleAnalytics      : "googleAnalytics"
        },

        init: function(params) {
            this.setProductId(params.productId);
            this.setCustomResourceUrl(params.customResourceUrl);
        },

        setDebugLevel: function() {
            //var env = this.env = "stage";
            var env = this.env = $.cookie('env') || "";
            //debug.info("set debug level: ", this.env);

            var level = 0;  // see nothing

            if(env == "dev") {
                level = 5; // see everything
            } else if(env == "qa" || env == "stage") {
                level = 3;  // see info, warnings and errors
            }

            debug.setLevel(level);
        },

        /**
         * set product Id retrieved from cookies
         * @param productId
         */
        setProductId: function(productId) {
            this.productId = productId;
        },

        /**
         * set custom resources retrieved from cookies
         * @param customResourceUrl
         */
        setCustomResourceUrl: function(customResourceUrl) {
            this.customResourceUrl = customResourceUrl;
        },

        /**
         * set product data getting retrieved from product properties
         * @param productData
         */
        setProductData: function(productConfigData) {
            this.productData = productConfigData;

            this.productObject = $.parseJSON(this.productData["jsonConfig"]) || null;
            // this.regObject = this.productObject[this.attrs.appName] || null;

            /*=============================================
            =            Recreate Original Json 
            =        (standin for this.productObject)           
            =============================================*/

            //recreate expected JSON from new redis schema
            var redisJson = {

                        login: {},
                        registration: {
                            htmlTemplates: {
                                formTemplates: {},
                                introTemplate: {}
                            },
                            reservedFields: {},
                            siteAnalytics: {}
                        },
                        returnCustomerRegistration: {
                            htmlTemplates:{
                                formTemplates: {}
                            }
                        },
                        sharedAppProperties: {}

                    };

            //login*********************************************************************************************************
            redisJson.login.showRegistrationLink = (this.productData.loginShowRegistrationLink === "true");

            //registration *************************************************************************************************
            var registration                     = redisJson.registration;

            registration.activateAccount     = !this.productData.registrationSendActivationEmail;
            registration.pageSubTitle        = this.productData.registrationPageSubTitle;
            registration.pageTitle           = this.productData.registrationPageTitle;
            registration.sendActivationEmail = this.productData.registrationSendActivationEmail;
            registration.tabLabel            = this.productData.registrationTabLabel;

            registration.htmlTemplates.formTemplates.files           = this.productData.formTemplatesFiles;
            registration.htmlTemplates.formTemplates.width           = this.productData.formTemplatesWidth;
            registration.htmlTemplates.introTemplate.fileName        = this.productData.introTemplateFilename;
            registration.htmlTemplates.introTemplate.placementOnLeft = (this.productData.introTemplatePlaceOnLeft === 'true');
            registration.htmlTemplates.introTemplate.width           = this.productData.introTemplateWidth;

            registration.reservedFields.useEmailForUsername = (this.productData.registrationUseEmailForUsername === 'true');
            registration.siteAnalytics.googleAnalytics      = true;

            //return customer registration WHAT IS THIS?!?! ******************************************************************
            var customerRegistration = redisJson.returnCustomerRegistration;

            customerRegistration.activateAccount     = true;
            customerRegistration.sendActivationEmail = false;
            customerRegistration.submitButtonLabel   = "Accept";

            //customerRegistration.htmlTemplates.formTemplates.files     = "whatever";
            //customerRegistration.htmlTemplates.formTemplates.pageTitle = "The hell is this";
            //customerRegistration.htmlTemplates.formTemplates.width     = "810px";


            //shared app properties ******************************************************************************************
            var sharedProperties = redisJson.sharedAppProperties;

            sharedProperties.iamProductCategory = this.productData.iamCategory;
            sharedProperties.includeNeustarLogo = (this.productData.includeNeustarLogo === "true");
            sharedProperties.logoHref           = this.productData.logoHref;
            sharedProperties.logoSourceUrl      = this.productData.logoSourceUrl;
            sharedProperties.logoTooltip        = this.productData.logoTooltip;

            /*-----  End Recreation ------*/

            //console.log("redisJson");
            //console.log(JSON.stringify(redisJson));

            //apply Recreation
            this.productObject = redisJson;

            //console.log("this produt object")
            //console.log(JSON.stringify(this.productObject));

            this.regObject = this.productObject[this.attrs.appName] || null;

        },

        getProductId: function() {
            return this.productId;
        },

        /*getCustomResourceUrl: function() {
            return this.customResourceUrl
        },*/

        getRegFormWidth: function() {
            return this.regObject[this.attrs.templateAttr].formTemplates.width || "";
        },

        getProductTemplateUrl: function() {

            //---- get logo url ----
            var category    = this.productData.category;
            var filename    = this.productData.formTemplatesFiles;

            if(typeof(filename) === 'undefined');{
            	var deferred    = $.Deferred();

                if (!window.location.origin) {
                  window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
                }
                var promise = $.get(window.location.origin + "/apps/admin/file",
                       {
                        category: category,
                        filename: filename
                       });

                promise.done(function(templateUrl){
                   
                    deferred.resolve(templateUrl);

                });

                return deferred.promise();            	
            }
            return null;           
            // return this.customResourceUrl + this.productId + "/registrationTemplate.html" ;
        },

        getProductConfigUrl: function() {
            // does this need to be appended?
            if (!window.location.origin) {
              window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
            }
            return window.location.origin + "/apps/admin/config/"+ this.productId;
        },

        getSubmitButtonLabel: function() {
            return this.regObject["submitLabel"] ||
                $.i18n.prop("quova.platform.registration.regView.reg_submit_button");
        },

        getProductPageInfo: function() {
            var regPageSettings = this.productObject[this.attrs.appName];
            var logoInfo = this.productObject[this.attrs.sharedAppProperties];
            var pageInfo = {
                pageTitle: regPageSettings.pageTitle,
                pageSubTitle: regPageSettings.pageSubTitle,
                tabLabel: regPageSettings.tabLabel,
                logoHref: "",
                logoSourceUrl: "/apps/resources/images/themes/neustar/logo.png",
                logoTooltip: ""
            };

            if(!logoInfo) {
                debug.warn("Page attributes not defined.");
                return pageInfo;
            }

            $.extend(pageInfo, logoInfo);

            return pageInfo;
        },

        getProductFormTemplates: function() {
            debug.debug("this.attrs.templateAttr", this.attrs.templateAttr);
            return this.regObject[this.attrs.templateAttr].formTemplates.files;
        },

        getProductIntroTemplate: function() {
            return this.regObject[this.attrs.templateAttr].introTemplate;
        },

        hasRegistration: function(){
            return this.regObject != null;
        },

        includeNeustarLogo: function(){
            return (this.productObject[this.attrs.sharedAppProperties] &&
                        typeof this.productObject[this.attrs.sharedAppProperties].includeNeustarLogo != "undefined")?
                this.productObject[this.attrs.sharedAppProperties].includeNeustarLogo : true;
        },

        showProductOverview: function() {
            return this.regObject["showProductOverview"];
        },

        getReservedFieldsInfo: function() {
            return this.regObject[this.attrs.reservedFieldsAttr];
        },

        getUserLogoElement: function(){

            //---- get logo url ----
            var category    = this.productData.category;
            var logoHref    = this.productData.logoHref;
            var logoSource  = this.productData.logoSourceUrl;
            var deferred    = $.Deferred();

            if (!window.location.origin) {
               window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
            }

            var promise = $.get(window.location.origin + "/apps/admin/file",
                   {
                    category: category,
                    filename: logoSource
                   });

            promise.done(function(logoUrl){
               
                //---- Create anchor element ----
                var anchor  = document.createElement('a');
                anchor.href = logoHref;

                //---- Create image element ----
                var img   = document.createElement('img');
                img.src   = logoUrl;
                img.setAttribute("style", "max-height:70px; max-width:800px");

                //---- Combine elements ----
                anchor.appendChild(img);

                deferred.resolve(anchor);

            });

            return deferred.promise();

        },

        getRegIntroTemplate: function(){

            var category = this.productData.category;
            var fileName = this.productData.introTemplateFilename;

            var deferred    = $.Deferred();

            if (!window.location.origin) {
               window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
            }

            var promise = $.get(window.location.origin + "/apps/admin/file",
                   {
                    category: category,
                    filename: fileName
                   });

            promise.done(function(templateUrl){
               
                deferred.resolve(templateUrl);

            });

            return deferred.promise();

        },

        activateAccount: function() {
            debug.debug("this.regObject[this.attrs.activateAccount]", this.regObject[this.attrs.activateAccount]);
            return (typeof this.regObject[this.attrs.activateAccount] != "undefined")?
                this.regObject[this.attrs.activateAccount] : true;
        },

        iamProductCategory: function() {
            return (this.productObject[this.attrs.sharedAppProperties] &&
                typeof this.productObject[this.attrs.sharedAppProperties].iamProductCategory != "undefined")?
                    this.productObject[this.attrs.sharedAppProperties].iamProductCategory : "";
        },

        sendActivationEmail: function() {
            return (typeof this.regObject[this.attrs.sendActivationEmail] != "undefined")?
                this.regObject[this.attrs.sendActivationEmail] : false;
        },

        hasGoogleAnalytics: function() {
            return (this.regObject[this.attrs.siteAnalytics] &&
                this.regObject[this.attrs.siteAnalytics][this.attrs.googleAnalytics]) || false;
        },

        /*registrationPageViewed: function() {
            if(this.pageIdOrVirName && this.pageIdOrVirName.length) {
                debug.debug("Page view is recorded.");
                ocdnlPGA_4neustar.onDivDisplay(this.pageIdOrVirName);
            }
        },*/

        registrationSuccess: function() {
            debug.debug("User registered successfully is recorded.");
            document.pageIdOrVirtualName = "";
            //ocdnlPGA_4neustar.onDivDisplay("/ipintelligence/signup/signup_confirmation/CL="+this.productId);
        }
    };

    return quova.platform.app.registration.ContextMgr;

});
