(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Fluxex = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/actions/api.js":[function(require,module,exports){
'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var yql = require('../services/yql');

module.exports = {
    search: function search(payload) {
        var p = payload.p * 1 || 0,
            start = p * 10,
            keyword = payload.q,
            self = this;

        if (!keyword) {
            return _promise2.default.resolve({});
        }

        return yql('select * from local.search where zip="94085" and query="' + keyword + '"').then(function (O) {
            return self.dispatch('UPDATE_SEARCH_RESULT', {
                keyword: keyword,
                offset: start,
                hits: O ? O.Result.length ? O.Result : [O.Result] : undefined
            });
        });
    }
};

},{"../services/yql":"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/services/yql.js","babel-runtime/core-js/promise":"babel-runtime/core-js/promise"}],"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/actions/page.js":[function(require,module,exports){
'use strict';

var apis = require('./api');

// All page actions here.
// A page action will prepare all required store for a page
// and update the page title.
var pages = {
    hello: function hello() {
        return this.dispatch('UPDATE_HELLO', 'hello is dated');
    },
    about: function about() {
        return this.dispatch('UPDATE_ABOUT', 'Peter is great.');
    }
};

module.exports = pages;

},{"./api":"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/actions/api.js"}],"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/components/About.jsx":[function(require,module,exports){
'use strict';

var React = require('react');
var Fluxex = require('fluxex');

var page = React.createClass({
    displayName: 'page',

    mixins: [Fluxex.mixin, require('fluxex/extra/storechange'), {
        listenStores: ['about']
    }],

    getStateFromStores: function getStateFromStores() {
        return {
            about: this.getStore('about').get()
        };
    },

    render: function render() {
        return React.createElement(
            'html',
            null,
            React.createElement(
                'head',
                null,
                React.createElement('meta', { charSet: 'utf-8' }),
                React.createElement('meta', { name: 'viewport', content: 'width=device-width, user-scalable=no' }),
                React.createElement(Fluxex.Title, null)
            ),
            React.createElement(
                'body',
                null,
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'div',
                        null,
                        'about !!  ' + this.state.about
                    ),
                    React.createElement('hr', null)
                )
            )
        );
    }
});

module.exports = page;

},{"fluxex":"fluxex","fluxex/extra/storechange":"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/node_modules/fluxex/extra/storechange.js","react":"react"}],"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/components/Hello.jsx":[function(require,module,exports){
'use strict';

var React = require('react');
var Fluxex = require('fluxex');

var page = React.createClass({
    displayName: 'page',

    mixins: [Fluxex.mixin, require('fluxex/extra/storechange'), require('fluxex/extra/routing').mixin, {
        listenStores: ['hello']
    }],

    getStateFromStores: function getStateFromStores() {
        return {
            hello: this.getStore('hello').get()
        };
    },

    render: function render() {
        return React.createElement(
            'html',
            null,
            React.createElement(
                'head',
                null,
                React.createElement('meta', { charSet: 'utf-8' }),
                React.createElement('meta', { name: 'viewport', content: 'width=device-width, user-scalable=no' }),
                React.createElement(Fluxex.Title, null)
            ),
            React.createElement(
                'body',
                null,
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'div',
                        null,
                        'Hello !!  ' + this.state.hello
                    ),
                    React.createElement('hr', null)
                )
            )
        );
    }
});

module.exports = page;

},{"fluxex":"fluxex","fluxex/extra/routing":"fluxex/extra/routing","fluxex/extra/storechange":"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/node_modules/fluxex/extra/storechange.js","react":"react"}],"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/components/Html.jsx":[function(require,module,exports){
'use strict';

var React = require('react');
var Fluxex = require('fluxex');

var About = require('./About.jsx');
var Hello = require('./Hello.jsx');

var Html = React.createClass({
    displayName: 'Html',

    mixins: [Fluxex.mixin, require('fluxex/extra/pjax'), require('fluxex/extra/storechange'), require('fluxex/extra/routing').mixin, {
        listenStores: ['page']
    }],
    getStateFromStores: function getStateFromStores() {
        return {
            // Used to determine routing
            routing: this.getStore('page')._get('routing')
        };
    },
    getInitialState: function getInitialState() {
        return {};
    },

    getPage: function getPage() {
        switch (this.state.routing.name) {
            case 'hello':
                return Hello;
            case 'about':
                return About;
            default:
                return Hello;
        }
    },
    render: function render() {
        console.log('this.state.routing: ', this.state.routing);
        var Page = this.getPage();
        return React.createElement(Page, null);
    }
});

module.exports = Html;

},{"./About.jsx":"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/components/About.jsx","./Hello.jsx":"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/components/Hello.jsx","fluxex":"fluxex","fluxex/extra/pjax":"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/node_modules/fluxex/extra/pjax.js","fluxex/extra/routing":"fluxex/extra/routing","fluxex/extra/storechange":"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/node_modules/fluxex/extra/storechange.js","react":"react"}],"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/fluxexapp.js":[function(require,module,exports){
'use strict';

require('babel-polyfill');

var commonStores = require('fluxex/extra/commonStores');
var page = require('./actions/page');

module.exports = require('fluxex').createApp({
    page: commonStores.page,
    about: require('./stores/about'),
    hello: require('./stores/hello')
}, require('./components/Html.jsx'), require('fluxex/extra/routing')({
    hello: {
        path: '/hello',
        method: 'get',
        action: page.hello
    },
    about: {
        path: '/about',
        method: 'get',
        action: page.about
    }
}));

},{"./actions/page":"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/actions/page.js","./components/Html.jsx":"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/components/Html.jsx","./stores/about":"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/stores/about.js","./stores/hello":"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/stores/hello.js","babel-polyfill":"babel-polyfill","fluxex":"fluxex","fluxex/extra/commonStores":"fluxex/extra/commonStores","fluxex/extra/routing":"fluxex/extra/routing"}],"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/node_modules/fluxex/extra/pjax.js":[function(require,module,exports){
// Use this mixin at HTML/BODY level to enable pjax behavior
// Your fluxexapp should provide routeToURL() for this mixin
// See routeToURL.js for more info
//
// To support IE8,
// You will need to npm install html5-history-api,
// then add require('fluxex/extra/history'); in your fluxexapp.js

module.exports = {
    componentDidMount: function () {
        /*global window,document*/
        var blockDoublePop = (document.readyState !== 'complete'),
            initState = JSON.stringify(this._getContext()._context),
            location = window.history.location || window.location,
            initUrl = location.href;

        window.addEventListener('load', function() {
            setTimeout(function () {
                blockDoublePop = false;
            }, 1);
        });

        window.addEventListener('popstate', function (E) {
            var state = E.state || ((location.href === initUrl) ? initState : undefined);

            if (blockDoublePop && (document.readyState === 'complete')) {
                return;
            }

            try {
                state = JSON.parse(state);
            } catch (E) {
                state = 0;
            }

            if (!state) {
                // NO STATE DATA....can not re-render, so reload.
                location.reload();
                return;
            }

            // Ya, trigger page restore by an anonymous action
            this.executeAction(function () {
                this._restore(state);
                this.dispatch('**UPDATEALL**');
                return Promise.resolve(true);
            }.bind(this._getContext()));
        }.bind(this));
    },

    handleClickLink: function (E) {
        var A = E.target.closest('a[href]') || E.target;
        var HREF = A.href;

        if (!HREF || HREF.match(/#/) || (A.target === '_blank')) {
            return;
        }

        if ((A.target === '_top') && (window.top !== window)) {
            return;
        }

        if ((A.target === '_parent') && (window.parent !== window)) {
            return;
        }

        E.preventDefault();
        E.stopPropagation();

        return this._getContext().routeToURL(HREF);
    }
};

},{}],"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/node_modules/fluxex/extra/storechange.js":[function(require,module,exports){
module.exports = {
    getInitialState: function () {
        if (!this.getStateFromStores) {
            throw new Error('You should provide getStateFromStores method for this component when using storechange mixin!');
        }

        // For .getInitialState(): must return an object or null
        return this.getStateFromStores() || {};
    },
    onStoreChange: function () {
        this.setState(this.getStateFromStores());
    }
};

},{}],"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/node_modules/iso-call/index.js":[function(require,module,exports){
module.exports = require('./lib/isocall');


},{"./lib/isocall":"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/node_modules/iso-call/lib/isocall.js"}],"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/node_modules/iso-call/lib/iso-config.js":[function(require,module,exports){
var isoreq = require('./iso-request-core');

/* eslint-disable no-underscore-dangle */
var requestConfigs;
var requestBaseUrl;

var _DEFAULT_ISO_REQUEST_RPC_ = '_DEFAULT_ISO_REQUEST_RPC_';
var _DEFAULT_BASEURL_ = '/_isoreq_/';

var defaultCfg = {
    _DEFAULT_ISO_REQUEST_RPC_: function (cfg) {
        var URL = requestConfigs[cfg.name];

        if (!URL) {
            return Promise.reject(new Error('call isocall.request() on api: "' + cfg.name + '" without URL!'));
        }

        return isoreq(Object.assign({url: URL}, cfg.cfg));
    }
};

var resetBaseURL = function () {
    requestBaseUrl = _DEFAULT_BASEURL_;
};

var resetConfigs = function (clean) {
    requestConfigs = clean ? {} : Object.assign({}, defaultCfg);
};

resetBaseURL();
resetConfigs();

module.exports = {
    _DEFAULT_ISO_REQUEST_RPC_: _DEFAULT_ISO_REQUEST_RPC_,

    resetConfigs: resetConfigs,
    resetBaseURL: resetBaseURL,

    addConfigs: function (cfgs) {
        Object.assign(requestConfigs, cfgs);
    },
    getConfigs: function () {
        return requestConfigs;
    },
    setBaseURL: function (url) {
        var exe = require('./iso-execute-server');
        if (exe.middlewareMounted && exe.middlewareMounted()) {
            console.warn('.setBaseURL() after .setupMiddleware() , this may cause client side call to wrong endpoint.');
        }
        requestBaseUrl = url;
    },
    getBaseURL: function () {
        return requestBaseUrl;
    }
};

},{"./iso-execute-server":"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/node_modules/iso-call/lib/iso-execute-client.js","./iso-request-core":"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/node_modules/iso-call/lib/iso-request-core.js"}],"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/node_modules/iso-call/lib/iso-execute-client.js":[function(require,module,exports){
var isoconfig = require('./iso-config');
var isoreq = require('./iso-request-core');

module.exports = {
    execute: function () {
        var name = arguments[0];
        if (!name) {
            return Promise.reject(new Error('iso-execute-client without name!'));
        }
        return isoreq(Object.assign({}, {
            method: 'PUT',
            body: Array.prototype.slice.call(arguments).slice(1),
            url: isoconfig.getBaseURL() + name,
            headers: {
                'content-type': 'application/json'
            },
            json: true
        })).then(function (R) {
            return R.body.rpc;
        });
    }
};

},{"./iso-config":"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/node_modules/iso-call/lib/iso-config.js","./iso-request-core":"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/node_modules/iso-call/lib/iso-request-core.js"}],"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/node_modules/iso-call/lib/iso-request-client.js":[function(require,module,exports){
var isoexe = require('./iso-execute-client');
var isocfg = require('./iso-config');

module.exports = {
    request: function (name, cfg) {
        if (!name) {
            return Promise.reject(new Error('iso-request-client without name!'));
        }

        /* eslint-disable no-underscore-dangle */
        return isoexe.execute(isocfg._DEFAULT_ISO_REQUEST_RPC_, {name: name, cfg: cfg});
    }
};

},{"./iso-config":"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/node_modules/iso-call/lib/iso-config.js","./iso-execute-client":"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/node_modules/iso-call/lib/iso-execute-client.js"}],"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/node_modules/iso-call/lib/iso-request-core.js":[function(require,module,exports){
var request = require('browser-request');

module.exports = function (opt) {
    if (!opt) {
        return Promise.reject(new Error('iso-request-core without input!'));
    }

    if (!opt.url) {
        return Promise.reject(new Error('iso-request-core without url, input:' + JSON.stringify(opt)));
    }

    return new Promise(function (resolve, reject) {
        request(opt, function (error, response, body) {
            var O = {
                error: error,
                response: response,
                body: body
            };

            // Prevent response.body == body double sized
            if (response) {
                delete response.body;
            }

            if (error) {
                return reject(O);
            }

            resolve(O);
        });
    });
};

},{"browser-request":"browser-request"}],"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/node_modules/iso-call/lib/isocall.js":[function(require,module,exports){
module.exports = Object.assign(
    require('./iso-config'),
    require('./iso-execute-server'),
    require('./iso-request-server')
);

},{"./iso-config":"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/node_modules/iso-call/lib/iso-config.js","./iso-execute-server":"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/node_modules/iso-call/lib/iso-execute-client.js","./iso-request-server":"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/node_modules/iso-call/lib/iso-request-client.js"}],"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/services/yql.js":[function(require,module,exports){
'use strict';

var isocall = require('iso-call');

module.exports = function (yql) {
    if (!yql) {
        throw new Error('call yql without yql statement!');
    }

    return isocall.request('yql', {
        qs: {
            q: yql,
            format: 'json'
        },
        rejectUnauthorized: false,
        json: true
    }).then(function (O) {
        if (O.body && O.body.query && O.body.query.hasOwnProperty('results')) {
            return O.body.query.results;
        } else {
            throw new Error({
                message: 'no query.results in response',
                request: O
            });
        }
    });
};

},{"iso-call":"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/node_modules/iso-call/index.js"}],"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/stores/about.js":[function(require,module,exports){
'use strict';

module.exports = {
    handle_UPDATE_ABOUT: function handle_UPDATE_ABOUT(data) {
        this._set('about', data);
        this.emitChange();
    },

    get: function get() {
        return this._get('about');
    }
};

},{}],"/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/stores/hello.js":[function(require,module,exports){
'use strict';

module.exports = {
    handle_UPDATE_HELLO: function handle_UPDATE_HELLO(data) {
        this._set('hello', data);
        this.emitChange();
    },

    get: function get() {
        return this._get('hello');
    }
};

},{}]},{},["/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/fluxexapp.js"])("/Users/peterchang/Desktop/node/test/react-fluxex-isomorphic-boilerplate/fluxexapp.js")
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhY3Rpb25zL2FwaS5qcyIsImFjdGlvbnMvcGFnZS5qcyIsImNvbXBvbmVudHMvQWJvdXQuanN4IiwiY29tcG9uZW50cy9IZWxsby5qc3giLCJjb21wb25lbnRzL0h0bWwuanN4IiwiZmx1eGV4YXBwLmpzIiwibm9kZV9tb2R1bGVzL2ZsdXhleC9leHRyYS9wamF4LmpzIiwibm9kZV9tb2R1bGVzL2ZsdXhleC9leHRyYS9zdG9yZWNoYW5nZS5qcyIsIm5vZGVfbW9kdWxlcy9pc28tY2FsbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pc28tY2FsbC9saWIvaXNvLWNvbmZpZy5qcyIsIm5vZGVfbW9kdWxlcy9pc28tY2FsbC9saWIvaXNvLWV4ZWN1dGUtY2xpZW50LmpzIiwibm9kZV9tb2R1bGVzL2lzby1jYWxsL2xpYi9pc28tcmVxdWVzdC1jbGllbnQuanMiLCJub2RlX21vZHVsZXMvaXNvLWNhbGwvbGliL2lzby1yZXF1ZXN0LWNvcmUuanMiLCJub2RlX21vZHVsZXMvaXNvLWNhbGwvbGliL2lzb2NhbGwuanMiLCJzZXJ2aWNlcy95cWwuanMiLCJzdG9yZXMvYWJvdXQuanMiLCJzdG9yZXMvaGVsbG8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFJLE1BQU0sUUFBUSxpQkFBUixDQUFWOztBQUVBLE9BQU8sT0FBUCxHQUFpQjtBQUNiLFlBQVEsZ0JBQVUsT0FBVixFQUFtQjtBQUN2QixZQUFJLElBQUksUUFBUSxDQUFSLEdBQVksQ0FBWixJQUFpQixDQUF6QjtBQUFBLFlBQ0ksUUFBUSxJQUFJLEVBRGhCO0FBQUEsWUFFSSxVQUFVLFFBQVEsQ0FGdEI7QUFBQSxZQUdJLE9BQU8sSUFIWDs7QUFLQSxZQUFJLENBQUMsT0FBTCxFQUFjO0FBQ1YsbUJBQU8sa0JBQVEsT0FBUixDQUFnQixFQUFoQixDQUFQO0FBQ0g7O0FBRUQsZUFBTyxJ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LFNBQTVCLENBQTlCLEVBQXNFO0FBQ2xFLG1CQUFPLEVBQUUsSUFBRixDQUFPLEtBQVAsQ0FBYSxPQUFwQjtBQUNILFNBRkQsTUFFTztBQUNILGtCQUFNLElBQUksS0FBSixDQUFVO0FBQ1oseUJBQVMsOEJBREc7QUFFWix5QkFBUztBQUZHLGFBQVYsQ0FBTjtBQUlIO0FBQ0osS0FoQk0sQ0FBUDtBQWlCSCxDQXRCRDs7O0FDSkE7O0FBRUEsT0FBTyxPQUFQLEdBQWlCO0FBQ2IseUJBQXFCLDZCQUFVLElBQVYsRUFBZ0I7QUFDakMsYUFBSyxJQUFMLENBQVUsT0FBVixFQUFtQixJQUFuQjtBQUNBLGFBQUssVUFBTDtBQUNILEtBSlk7O0FBTWIsU0FBSyxlQUFZO0FBQ2IsZUFBTyxLQUFLLElBQUwsQ0FBVSxPQUFWLENBQVA7QUFDSDtBQVJZLENBQWpCOzs7QUNGQTs7QUFFQSxPQUFPLE9BQVAsR0FBaUI7QUFDYix5QkFBcUIsNkJBQVUsSUFBVixFQUFnQjtBQUNqQyxhQUFLLElBQUwsQ0FBVSxPQUFWLEVBQW1CLElBQW5CO0FBQ0EsYUFBSyxVQUFMO0FBQ0gsS0FKWTs7QUFNYixTQUFLLGVBQVk7QUFDYixlQUFPLEtBQUssSUFBTCxDQUFVLE9BQVYsQ0FBUDtBQUNIO0FBUlksQ0FBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgeXFsID0gcmVxdWlyZSgnLi4vc2VydmljZXMveXFsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHNlYXJjaDogZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICAgICAgdmFyIHAgPSBwYXlsb2FkLnAgKiAxIHx8IDAsXG4gICAgICAgICAgICBzdGFydCA9IHAgKiAxMCxcbiAgICAgICAgICAgIGtleXdvcmQgPSBwYXlsb2FkLnEsXG4gICAgICAgICAgICBzZWxmID0gdGhpcztcblxuICAgICAgICBpZiAoIWtleXdvcmQpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe30pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHlxbCgnc2VsZWN0ICogZnJvbSBsb2NhbC5zZWFyY2ggd2hlcmUgemlwPVwiOTQwODVcIiBhbmQgcXVlcnk9XCInKyBrZXl3b3JkICsgJ1wiJykudGhlbihmdW5jdGlvbiAoTykge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuZGlzcGF0Y2goJ1VQREFURV9TRUFSQ0hfUkVTVUxUJywge1xuICAgICAgICAgICAgICAgIGtleXdvcmQ6IGtleXdvcmQsXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiBzdGFydCxcbiAgICAgICAgICAgICAgICBoaXRzOiBPID8gKE8uUmVzdWx0Lmxlbmd0aCA/IE8uUmVzdWx0IDogW08uUmVzdWx0XSkgOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuIiwidmFyIGFwaXMgPSByZXF1aXJlKCcuL2FwaScpO1xuXG4vLyBBbGwgcGFnZSBhY3Rpb25zIGhlcmUuXG4vLyBBIHBhZ2UgYWN0aW9uIHdpbGwgcHJlcGFyZSBhbGwgcmVxdWlyZWQgc3RvcmUgZm9yIGEgcGFnZVxuLy8gYW5kIHVwZGF0ZSB0aGUgcGFnZSB0aXRsZS5cbnZhciBwYWdlcyA9IHtcbiAgICBoZWxsbzogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kaXNwYXRjaCgnVVBEQVRFX0hFTExPJywgJ2hlbGxvIGlzIGRhdGVkJyk7XG4gICAgfSwgXG4gICAgYWJvdXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2goJ1VQREFURV9BQk9VVCcsICdQZXRlciBpcyBncmVhdC4nKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBhZ2VzO1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBGbHV4ZXggPSByZXF1aXJlKCdmbHV4ZXgnKTtcblxudmFyIHBhZ2UgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgbWl4aW5zOiBbXG4gICAgICAgIEZsdXhleC5taXhpbixcbiAgICAgICAgcmVxdWlyZSgnZmx1eGV4L2V4dHJhL3N0b3JlY2hhbmdlJyksXG4gICAgICAgIHtcbiAgICAgICAgICAgIGxpc3RlblN0b3JlczogW1xuICAgICAgICAgICAgICAgICdhYm91dCdcbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIF0sXG5cbiAgICBnZXRTdGF0ZUZyb21TdG9yZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFib3V0OiB0aGlzLmdldFN0b3JlKCdhYm91dCcpLmdldCgpLFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgPGh0bWw+XG4gICAgICAgICA8aGVhZD5cbiAgICAgICAgICA8bWV0YSBjaGFyU2V0PVwidXRmLThcIiAvPlxuICAgICAgICAgIDxtZXRhIG5hbWU9XCJ2aWV3cG9ydFwiIGNvbnRlbnQ9XCJ3aWR0aD1kZXZpY2Utd2lkdGgsIHVzZXItc2NhbGFibGU9bm9cIiAvPlxuICAgICAgICAgIDxGbHV4ZXguVGl0bGUgLz5cbiAgICAgICAgIDwvaGVhZD5cbiAgICAgICAgIDxib2R5PlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2PnsnYWJvdXQgISEgICcgKyB0aGlzLnN0YXRlLmFib3V0fTwvZGl2PlxuICAgICAgICAgICAgICAgIDxoci8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgIDwvYm9keT5cbiAgICAgICAgPC9odG1sPiBcbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBwYWdlO1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBGbHV4ZXggPSByZXF1aXJlKCdmbHV4ZXgnKTtcblxudmFyIHBhZ2UgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgbWl4aW5zOiBbXG4gICAgICAgIEZsdXhleC5taXhpbixcbiAgICAgICAgcmVxdWlyZSgnZmx1eGV4L2V4dHJhL3N0b3JlY2hhbmdlJyksXG4gICAgICAgIHJlcXVpcmUoJ2ZsdXhleC9leHRyYS9yb3V0aW5nJykubWl4aW4sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGxpc3RlblN0b3JlczogW1xuICAgICAgICAgICAgICAgICdoZWxsbydcbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIF0sXG5cbiAgICBnZXRTdGF0ZUZyb21TdG9yZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGhlbGxvOiB0aGlzLmdldFN0b3JlKCdoZWxsbycpLmdldCgpLFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgPGh0bWw+XG4gICAgICAgICA8aGVhZD5cbiAgICAgICAgICA8bWV0YSBjaGFyU2V0PVwidXRmLThcIiAvPlxuICAgICAgICAgIDxtZXRhIG5hbWU9XCJ2aWV3cG9ydFwiIGNvbnRlbnQ9XCJ3aWR0aD1kZXZpY2Utd2lkdGgsIHVzZXItc2NhbGFibGU9bm9cIiAvPlxuICAgICAgICAgIDxGbHV4ZXguVGl0bGUgLz5cbiAgICAgICAgIDwvaGVhZD5cbiAgICAgICAgIDxib2R5PlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2PnsnSGVsbG8gISEgICcgKyB0aGlzLnN0YXRlLmhlbGxvfTwvZGl2PlxuICAgICAgICAgICAgICAgIDxoci8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgIDwvYm9keT5cbiAgICAgICAgPC9odG1sPiBcbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBwYWdlO1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBGbHV4ZXggPSByZXF1aXJlKCdmbHV4ZXgnKTtcblxudmFyIEFib3V0ID0gcmVxdWlyZSgnLi9BYm91dC5qc3gnKTtcbnZhciBIZWxsbyA9IHJlcXVpcmUoJy4vSGVsbG8uanN4Jyk7XG5cbnZhciBIdG1sID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIG1peGluczogW1xuICAgICAgICBGbHV4ZXgubWl4aW4sXG4gICAgICAgIHJlcXVpcmUoJ2ZsdXhleC9leHRyYS9wamF4JyksXG4gICAgICAgIHJlcXVpcmUoJ2ZsdXhleC9leHRyYS9zdG9yZWNoYW5nZScpLFxuICAgICAgICByZXF1aXJlKCdmbHV4ZXgvZXh0cmEvcm91dGluZycpLm1peGluLFxuICAgICAgICB7XG4gICAgICAgICAgICBsaXN0ZW5TdG9yZXM6IFtcbiAgICAgICAgICAgICAgICAncGFnZSdcbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIF0sXG4gICAgZ2V0U3RhdGVGcm9tU3RvcmVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAvLyBVc2VkIHRvIGRldGVybWluZSByb3V0aW5nXG4gICAgICAgICAgICByb3V0aW5nOiB0aGlzLmdldFN0b3JlKCdwYWdlJykuX2dldCgncm91dGluZycpXG4gICAgICAgIH07XG4gICAgfSxcbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG5cbiAgICBnZXRQYWdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5zdGF0ZS5yb3V0aW5nLm5hbWUpIHtcbiAgICAgICAgY2FzZSAnaGVsbG8nOlxuICAgICAgICAgICAgcmV0dXJuIEhlbGxvO1xuICAgICAgICBjYXNlICdhYm91dCc6XG4gICAgICAgICAgICByZXR1cm4gQWJvdXQ7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gSGVsbG87XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZygndGhpcy5zdGF0ZS5yb3V0aW5nOiAnLCB0aGlzLnN0YXRlLnJvdXRpbmcpO1xuICAgICAgICB2YXIgUGFnZSA9IHRoaXMuZ2V0UGFnZSgpO1xuICAgICAgICByZXR1cm4gPFBhZ2UvPjtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBIdG1sO1xuIiwicmVxdWlyZSgnYmFiZWwtcG9seWZpbGwnKTtcblxudmFyIGNvbW1vblN0b3JlcyA9IHJlcXVpcmUoJ2ZsdXhleC9leHRyYS9jb21tb25TdG9yZXMnKTtcbnZhciBwYWdlID0gcmVxdWlyZSgnLi9hY3Rpb25zL3BhZ2UnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJ2ZsdXhleCcpLmNyZWF0ZUFwcCh7XG4gICAgcGFnZTogY29tbW9uU3RvcmVzLnBhZ2UsXG4gICAgYWJvdXQ6IHJlcXVpcmUoJy4vc3RvcmVzL2Fib3V0JyksXG4gICAgaGVsbG86IHJlcXVpcmUoJy4vc3RvcmVzL2hlbGxvJylcbn0sIHJlcXVpcmUoJy4vY29tcG9uZW50cy9IdG1sLmpzeCcpLCBcbiAgICByZXF1aXJlKCdmbHV4ZXgvZXh0cmEvcm91dGluZycpKHtcbiAgICAgICAgaGVsbG86IHtcbiAgICAgICAgICAgIHBhdGg6ICcvaGVsbG8nLFxuICAgICAgICAgICAgbWV0aG9kOiAnZ2V0JyxcbiAgICAgICAgICAgIGFjdGlvbjogcGFnZS5oZWxsb1xuICAgICAgICB9ICwgXG4gICAgICAgIGFib3V0OiB7XG4gICAgICAgICAgICBwYXRoOiAnL2Fib3V0JyxcbiAgICAgICAgICAgIG1ldGhvZDogJ2dldCcsXG4gICAgICAgICAgICBhY3Rpb246IHBhZ2UuYWJvdXRcbiAgICAgICAgfVxuICAgIH0pKTtcbiIsIi8vIFVzZSB0aGlzIG1peGluIGF0IEhUTUwvQk9EWSBsZXZlbCB0byBlbmFibGUgcGpheCBiZWhhdmlvclxuLy8gWW91ciBmbHV4ZXhhcHAgc2hvdWxkIHByb3ZpZGUgcm91dGVUb1VSTCgpIGZvciB0aGlzIG1peGluXG4vLyBTZWUgcm91dGVUb1VSTC5qcyBmb3IgbW9yZSBpbmZvXG4vL1xuLy8gVG8gc3VwcG9ydCBJRTgsXG4vLyBZb3Ugd2lsbCBuZWVkIHRvIG5wbSBpbnN0YWxsIGh0bWw1LWhpc3RvcnktYXBpLFxuLy8gdGhlbiBhZGQgcmVxdWlyZSgnZmx1eGV4L2V4dHJhL2hpc3RvcnknKTsgaW4geW91ciBmbHV4ZXhhcHAuanNcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLypnbG9iYWwgd2luZG93LGRvY3VtZW50Ki9cbiAgICAgICAgdmFyIGJsb2NrRG91YmxlUG9wID0gKGRvY3VtZW50LnJlYWR5U3RhdGUgIT09ICdjb21wbGV0ZScpLFxuICAgICAgICAgICAgaW5pdFN0YXRlID0gSlNPTi5zdHJpbmdpZnkodGhpcy5fZ2V0Q29udGV4dCgpLl9jb250ZXh0KSxcbiAgICAgICAgICAgIGxvY2F0aW9uID0gd2luZG93Lmhpc3RvcnkubG9jYXRpb24gfHwgd2luZG93LmxvY2F0aW9uLFxuICAgICAgICAgICAgaW5pdFVybCA9IGxvY2F0aW9uLmhyZWY7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGJsb2NrRG91YmxlUG9wID0gZmFsc2U7XG4gICAgICAgICAgICB9LCAxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgZnVuY3Rpb24gKEUpIHtcbiAgICAgICAgICAgIHZhciBzdGF0ZSA9IEUuc3RhdGUgfHwgKChsb2NhdGlvbi5ocmVmID09PSBpbml0VXJsKSA/IGluaXRTdGF0ZSA6IHVuZGVmaW5lZCk7XG5cbiAgICAgICAgICAgIGlmIChibG9ja0RvdWJsZVBvcCAmJiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgc3RhdGUgPSBKU09OLnBhcnNlKHN0YXRlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKEUpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghc3RhdGUpIHtcbiAgICAgICAgICAgICAgICAvLyBOTyBTVEFURSBEQVRBLi4uLmNhbiBub3QgcmUtcmVuZGVyLCBzbyByZWxvYWQuXG4gICAgICAgICAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBZYSwgdHJpZ2dlciBwYWdlIHJlc3RvcmUgYnkgYW4gYW5vbnltb3VzIGFjdGlvblxuICAgICAgICAgICAgdGhpcy5leGVjdXRlQWN0aW9uKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXN0b3JlKHN0YXRlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoKCcqKlVQREFURUFMTCoqJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzLl9nZXRDb250ZXh0KCkpKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgaGFuZGxlQ2xpY2tMaW5rOiBmdW5jdGlvbiAoRSkge1xuICAgICAgICB2YXIgQSA9IEUudGFyZ2V0LmNsb3Nlc3QoJ2FbaHJlZl0nKSB8fCBFLnRhcmdldDtcbiAgICAgICAgdmFyIEhSRUYgPSBBLmhyZWY7XG5cbiAgICAgICAgaWYgKCFIUkVGIHx8IEhSRUYubWF0Y2goLyMvKSB8fCAoQS50YXJnZXQgPT09ICdfYmxhbmsnKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKChBLnRhcmdldCA9PT0gJ190b3AnKSAmJiAod2luZG93LnRvcCAhPT0gd2luZG93KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKChBLnRhcmdldCA9PT0gJ19wYXJlbnQnKSAmJiAod2luZG93LnBhcmVudCAhPT0gd2luZG93KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgRS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBFLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRDb250ZXh0KCkucm91dGVUb1VSTChIUkVGKTtcbiAgICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5nZXRTdGF0ZUZyb21TdG9yZXMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignWW91IHNob3VsZCBwcm92aWRlIGdldFN0YXRlRnJvbVN0b3JlcyBtZXRob2QgZm9yIHRoaXMgY29tcG9uZW50IHdoZW4gdXNpbmcgc3RvcmVjaGFuZ2UgbWl4aW4hJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGb3IgLmdldEluaXRpYWxTdGF0ZSgpOiBtdXN0IHJldHVybiBhbiBvYmplY3Qgb3IgbnVsbFxuICAgICAgICByZXR1cm4gdGhpcy5nZXRTdGF0ZUZyb21TdG9yZXMoKSB8fCB7fTtcbiAgICB9LFxuICAgIG9uU3RvcmVDaGFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldFN0YXRlRnJvbVN0b3JlcygpKTtcbiAgICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9pc29jYWxsJyk7XG5cbiIsInZhciBpc29yZXEgPSByZXF1aXJlKCcuL2lzby1yZXF1ZXN0LWNvcmUnKTtcblxuLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZXJzY29yZS1kYW5nbGUgKi9cbnZhciByZXF1ZXN0Q29uZmlncztcbnZhciByZXF1ZXN0QmFzZVVybDtcblxudmFyIF9ERUZBVUxUX0lTT19SRVFVRVNUX1JQQ18gPSAnX0RFRkFVTFRfSVNPX1JFUVVFU1RfUlBDXyc7XG52YXIgX0RFRkFVTFRfQkFTRVVSTF8gPSAnL19pc29yZXFfLyc7XG5cbnZhciBkZWZhdWx0Q2ZnID0ge1xuICAgIF9ERUZBVUxUX0lTT19SRVFVRVNUX1JQQ186IGZ1bmN0aW9uIChjZmcpIHtcbiAgICAgICAgdmFyIFVSTCA9IHJlcXVlc3RDb25maWdzW2NmZy5uYW1lXTtcblxuICAgICAgICBpZiAoIVVSTCkge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignY2FsbCBpc29jYWxsLnJlcXVlc3QoKSBvbiBhcGk6IFwiJyArIGNmZy5uYW1lICsgJ1wiIHdpdGhvdXQgVVJMIScpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpc29yZXEoT2JqZWN0LmFzc2lnbih7dXJsOiBVUkx9LCBjZmcuY2ZnKSk7XG4gICAgfVxufTtcblxudmFyIHJlc2V0QmFzZVVSTCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXF1ZXN0QmFzZVVybCA9IF9ERUZBVUxUX0JBU0VVUkxfO1xufTtcblxudmFyIHJlc2V0Q29uZmlncyA9IGZ1bmN0aW9uIChjbGVhbikge1xuICAgIHJlcXVlc3RDb25maWdzID0gY2xlYW4gPyB7fSA6IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRDZmcpO1xufTtcblxucmVzZXRCYXNlVVJMKCk7XG5yZXNldENvbmZpZ3MoKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgX0RFRkFVTFRfSVNPX1JFUVVFU1RfUlBDXzogX0RFRkFVTFRfSVNPX1JFUVVFU1RfUlBDXyxcblxuICAgIHJlc2V0Q29uZmlnczogcmVzZXRDb25maWdzLFxuICAgIHJlc2V0QmFzZVVSTDogcmVzZXRCYXNlVVJMLFxuXG4gICAgYWRkQ29uZmlnczogZnVuY3Rpb24gKGNmZ3MpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyZXF1ZXN0Q29uZmlncywgY2Zncyk7XG4gICAgfSxcbiAgICBnZXRDb25maWdzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiByZXF1ZXN0Q29uZmlncztcbiAgICB9LFxuICAgIHNldEJhc2VVUkw6IGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgdmFyIGV4ZSA9IHJlcXVpcmUoJy4vaXNvLWV4ZWN1dGUtc2VydmVyJyk7XG4gICAgICAgIGlmIChleGUubWlkZGxld2FyZU1vdW50ZWQgJiYgZXhlLm1pZGRsZXdhcmVNb3VudGVkKCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignLnNldEJhc2VVUkwoKSBhZnRlciAuc2V0dXBNaWRkbGV3YXJlKCkgLCB0aGlzIG1heSBjYXVzZSBjbGllbnQgc2lkZSBjYWxsIHRvIHdyb25nIGVuZHBvaW50LicpO1xuICAgICAgICB9XG4gICAgICAgIHJlcXVlc3RCYXNlVXJsID0gdXJsO1xuICAgIH0sXG4gICAgZ2V0QmFzZVVSTDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcmVxdWVzdEJhc2VVcmw7XG4gICAgfVxufTtcbiIsInZhciBpc29jb25maWcgPSByZXF1aXJlKCcuL2lzby1jb25maWcnKTtcbnZhciBpc29yZXEgPSByZXF1aXJlKCcuL2lzby1yZXF1ZXN0LWNvcmUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZXhlY3V0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbmFtZSA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdpc28tZXhlY3V0ZS1jbGllbnQgd2l0aG91dCBuYW1lIScpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXNvcmVxKE9iamVjdC5hc3NpZ24oe30sIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgICAgICBib2R5OiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLnNsaWNlKDEpLFxuICAgICAgICAgICAgdXJsOiBpc29jb25maWcuZ2V0QmFzZVVSTCgpICsgbmFtZSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAganNvbjogdHJ1ZVxuICAgICAgICB9KSkudGhlbihmdW5jdGlvbiAoUikge1xuICAgICAgICAgICAgcmV0dXJuIFIuYm9keS5ycGM7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iLCJ2YXIgaXNvZXhlID0gcmVxdWlyZSgnLi9pc28tZXhlY3V0ZS1jbGllbnQnKTtcbnZhciBpc29jZmcgPSByZXF1aXJlKCcuL2lzby1jb25maWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcmVxdWVzdDogZnVuY3Rpb24gKG5hbWUsIGNmZykge1xuICAgICAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ2lzby1yZXF1ZXN0LWNsaWVudCB3aXRob3V0IG5hbWUhJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZXJzY29yZS1kYW5nbGUgKi9cbiAgICAgICAgcmV0dXJuIGlzb2V4ZS5leGVjdXRlKGlzb2NmZy5fREVGQVVMVF9JU09fUkVRVUVTVF9SUENfLCB7bmFtZTogbmFtZSwgY2ZnOiBjZmd9KTtcbiAgICB9XG59O1xuIiwidmFyIHJlcXVlc3QgPSByZXF1aXJlKCdicm93c2VyLXJlcXVlc3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3B0KSB7XG4gICAgaWYgKCFvcHQpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignaXNvLXJlcXVlc3QtY29yZSB3aXRob3V0IGlucHV0IScpKTtcbiAgICB9XG5cbiAgICBpZiAoIW9wdC51cmwpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignaXNvLXJlcXVlc3QtY29yZSB3aXRob3V0IHVybCwgaW5wdXQ6JyArIEpTT04uc3RyaW5naWZ5KG9wdCkpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZXF1ZXN0KG9wdCwgZnVuY3Rpb24gKGVycm9yLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgICAgICAgdmFyIE8gPSB7XG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNlOiByZXNwb25zZSxcbiAgICAgICAgICAgICAgICBib2R5OiBib2R5XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBQcmV2ZW50IHJlc3BvbnNlLmJvZHkgPT0gYm9keSBkb3VibGUgc2l6ZWRcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSByZXNwb25zZS5ib2R5O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KE8pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXNvbHZlKE8pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oXG4gICAgcmVxdWlyZSgnLi9pc28tY29uZmlnJyksXG4gICAgcmVxdWlyZSgnLi9pc28tZXhlY3V0ZS1zZXJ2ZXInKSxcbiAgICByZXF1aXJlKCcuL2lzby1yZXF1ZXN0LXNlcnZlcicpXG4pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNvY2FsbCA9IHJlcXVpcmUoJ2lzby1jYWxsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHlxbCkge1xuICAgIGlmICgheXFsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY2FsbCB5cWwgd2l0aG91dCB5cWwgc3RhdGVtZW50IScpO1xuICAgIH1cblxuICAgIHJldHVybiBpc29jYWxsLnJlcXVlc3QoJ3lxbCcsIHtcbiAgICAgICAgcXM6IHtcbiAgICAgICAgICAgIHE6IHlxbCxcbiAgICAgICAgICAgIGZvcm1hdDogJ2pzb24nXG4gICAgICAgIH0sXG4gICAgICAgIHJlamVjdFVuYXV0aG9yaXplZCA6IGZhbHNlLFxuICAgICAgICBqc29uOiB0cnVlXG4gICAgfSkudGhlbihmdW5jdGlvbiAoTykge1xuICAgICAgICBpZiAoTy5ib2R5ICYmIE8uYm9keS5xdWVyeSAmJiBPLmJvZHkucXVlcnkuaGFzT3duUHJvcGVydHkoJ3Jlc3VsdHMnKSkge1xuICAgICAgICAgICAgcmV0dXJuIE8uYm9keS5xdWVyeS5yZXN1bHRzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnbm8gcXVlcnkucmVzdWx0cyBpbiByZXNwb25zZScsXG4gICAgICAgICAgICAgICAgcmVxdWVzdDogT1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGhhbmRsZV9VUERBVEVfQUJPVVQ6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHRoaXMuX3NldCgnYWJvdXQnLCBkYXRhKTtcbiAgICAgICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gICAgfSxcblxuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0KCdhYm91dCcpO1xuICAgIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGhhbmRsZV9VUERBVEVfSEVMTE86IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHRoaXMuX3NldCgnaGVsbG8nLCBkYXRhKTtcbiAgICAgICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gICAgfSxcblxuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0KCdoZWxsbycpO1xuICAgIH1cbn07XG4iXX0=
