/**
 * Note: quova namespaces will be retired. Use 'horizon' namespace for new development
 *
 * Set up quova namespaces
 */
var quova = ( function(ns) {
    'use strict';

    ns.platform = {
        app: {
            common: {},
            account: {},
            registration: {},
            portal: {}
        },
        model: {
            portal: {
                account: {}
            },
            registration: {}
        },

        view: {
            common: {},
            account: {},
            portal: {
                account: {},
                documentation: {},
                extensions: {}
            },
            registration: {}
        },
        router: {
            registration:{}
        }
    };

    return ns;
} )(window.quova || {});

/**
 * Set up horizon namespaces
 */
var horizon = ( function(ns) {
    'use strict';

    ns = {
        app: {
            common: {},
            account: {},
            registration: {},
            portal: {}
        },
        collection: {},
        model: {
            portal: {
                account: {}
            },
            registration: {}
        },

        view: {
            common: {},
            account: {},
            portal: {
                account: {},
                documentation: {},
                extensions: {}
            },
            registration: {}
        },
        router: {
            registration:{}
        }
    };

    return ns;
} )(window.horizon || {});