define([
  'app.reg.router',
  'app.validator',
  'app.reg.validators',
  'jquery',
  'jquery.i18n',
  'jquery.formalize',
  'app.reg.contextMgr'
], function(appRouter, commonValidator, regValidators) {
    var initialize = function() {
        $.ajaxSetup({ cache: false });

        $.i18n.properties({
            name:'Messages',
            path:'/apps/resources/bundle/',
            mode:'both',
            language:'en',
            callback: function() {
                appRouter.initialize();
                commonValidator.initialize();
                regValidators.initialize();
            }
        });
    };

    return {
        initialize: initialize
    };
});
