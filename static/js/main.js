(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Fluxex = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/peterchang/Desktop/node/test/test/actions/api.js":[function(require,module,exports){
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

},{"../services/yql":"/Users/peterchang/Desktop/node/test/test/services/yql.js","babel-runtime/core-js/promise":"babel-runtime/core-js/promise"}],"/Users/peterchang/Desktop/node/test/test/actions/page.js":[function(require,module,exports){
'use strict';

var apis = require('./api');

// All page actions here.
// A page action will prepare all required store for a page
// and update the page title.
var pages = {
    search: function search() {
        this.dispatch('UPDATE_TITLE', 'Search:' + this.getStore('page').getQuery().q);
        return this.executeAction(apis.search, this.getStore('page').getQuery());
    }
};

module.exports = pages;

},{"./api":"/Users/peterchang/Desktop/node/test/test/actions/api.js"}],"/Users/peterchang/Desktop/node/test/test/actions/routing.js":[function(require,module,exports){
'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var page = require('./page'),
    router = require('routes')();

router.addRoute('/search', ['search', page.search]);

// The single routing action can be used at both server/client side.
module.exports = function () {
    var path = this.getStore('page')._get('url').pathname,
        match = router.match(path);

    if (!match) {
        return _promise2.default.reject(new Error('no matched route for:' + path));
    }

    this.dispatch('UPDATE_ROUTING', {
        name: match.fn[0],
        params: match.params
    });

    return this.executeAction(match.fn[1]);
};

},{"./page":"/Users/peterchang/Desktop/node/test/test/actions/page.js","babel-runtime/core-js/promise":"babel-runtime/core-js/promise","routes":"/Users/peterchang/Desktop/node/test/test/node_modules/routes/dist/routes.js"}],"/Users/peterchang/Desktop/node/test/test/components/Html.jsx":[function(require,module,exports){
'use strict';

var React = require('react');
var Fluxex = require('fluxex');
var Results = require('./Results.jsx');
var SearchBox = require('./SearchBox.jsx');

var Html = React.createClass({
  displayName: 'Html',

  mixins: [Fluxex.mixin, require('fluxex/extra/pjax')],

  getInitialState: function getInitialState() {
    return {};
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
        { onClick: this.handleClickLink },
        React.createElement(SearchBox, null),
        'Sample Search:',
        React.createElement(
          'ul',
          null,
          React.createElement(
            'li',
            null,
            React.createElement(
              'a',
              { href: '/search?q=apple' },
              'Apple'
            )
          ),
          React.createElement(
            'li',
            null,
            React.createElement(
              'a',
              { href: '/search?q=banana' },
              'Banana'
            )
          ),
          React.createElement(
            'li',
            null,
            React.createElement(
              'a',
              { href: '/search?q=orange' },
              'Orange'
            )
          )
        ),
        React.createElement(Results, null),
        React.createElement(Fluxex.InitScript, null)
      )
    );
  }
});

module.exports = Html;

},{"./Results.jsx":"/Users/peterchang/Desktop/node/test/test/components/Results.jsx","./SearchBox.jsx":"/Users/peterchang/Desktop/node/test/test/components/SearchBox.jsx","fluxex":"fluxex","fluxex/extra/pjax":"/Users/peterchang/Desktop/node/test/test/node_modules/fluxex/extra/pjax.js","react":"react"}],"/Users/peterchang/Desktop/node/test/test/components/Results.jsx":[function(require,module,exports){
'use strict';

var React = require('react');
var Fluxex = require('fluxex');

var Results = React.createClass({
    displayName: 'Results',

    mixins: [Fluxex.mixin, require('fluxex/extra/storechange'), { listenStores: ['search'] }],

    getStateFromStores: function getStateFromStores() {
        return this.getStore('search').getResult();
    },

    render: function render() {
        var hits = [],
            I,
            P;

        if (!this.state.hits) {
            return React.createElement(
                'h1',
                null,
                'Search keyword: \'' + this.state.keyword + '\' not found!'
            );
        }

        for (I in this.state.hits) {
            P = this.state.hits[I];

            hits.push(React.createElement(
                'li',
                { key: P.id },
                React.createElement(
                    'h5',
                    null,
                    React.createElement(
                        'a',
                        { href: P.Url },
                        P.Title
                    )
                ),
                React.createElement(
                    'ul',
                    null,
                    React.createElement(
                        'li',
                        null,
                        'Distance: ',
                        P.Distance
                    ),
                    React.createElement(
                        'li',
                        null,
                        'Rating: ',
                        P.Rating.AverageRating
                    ),
                    React.createElement(
                        'li',
                        null,
                        'Address: ',
                        React.createElement(
                            'a',
                            { href: P.MapUrl },
                            P.Address,
                            ' ',
                            P.City,
                            ' ',
                            P.State
                        )
                    )
                )
            ));
        }

        return React.createElement(
            'div',
            null,
            React.createElement(
                'h1',
                null,
                'Search keyword: \'' + this.state.keyword + '\''
            ),
            React.createElement(
                'ul',
                null,
                hits
            )
        );
    }
});

module.exports = Results;

},{"fluxex":"fluxex","fluxex/extra/storechange":"/Users/peterchang/Desktop/node/test/test/node_modules/fluxex/extra/storechange.js","react":"react"}],"/Users/peterchang/Desktop/node/test/test/components/SearchBox.jsx":[function(require,module,exports){
'use strict';

var React = require('react');
var Fluxex = require('fluxex');

var SearchBox = React.createClass({
    displayName: 'SearchBox',

    mixins: [Fluxex.mixin, require('fluxex/extra/storechange'), { listenStores: ['search'] }],

    getStateFromStores: function getStateFromStores() {
        return this.getStore('search').getQuery();
    },

    handleChange: function handleChange(E) {
        this.setState({ keyword: E.target.value });
        this._getContext().routeToURL(this.getStore('page').getURL({ q: E.target.value }));
    },

    render: function render() {
        return React.createElement(
            'form',
            null,
            React.createElement('input', { type: 'text', onChange: this.handleChange, value: this.state.keyword }),
            React.createElement('input', { type: 'submit', value: 'Search!' })
        );
    }
});

module.exports = SearchBox;

},{"fluxex":"fluxex","fluxex/extra/storechange":"/Users/peterchang/Desktop/node/test/test/node_modules/fluxex/extra/storechange.js","react":"react"}],"/Users/peterchang/Desktop/node/test/test/fluxexapp.js":[function(require,module,exports){
'use strict';

require('babel-polyfill');

var commonStores = require('fluxex/extra/commonStores');

module.exports = require('fluxex').createApp({
    page: commonStores.page,
    search: require('./stores/search')
}, require('./components/Html.jsx'), {
    routing: require('./actions/routing'),
    routeToURL: require('fluxex/extra/routeToURL')
});

},{"./actions/routing":"/Users/peterchang/Desktop/node/test/test/actions/routing.js","./components/Html.jsx":"/Users/peterchang/Desktop/node/test/test/components/Html.jsx","./stores/search":"/Users/peterchang/Desktop/node/test/test/stores/search.js","babel-polyfill":"babel-polyfill","fluxex":"fluxex","fluxex/extra/commonStores":"fluxex/extra/commonStores","fluxex/extra/routeToURL":"/Users/peterchang/Desktop/node/test/test/node_modules/fluxex/extra/routeToURL.js"}],"/Users/peterchang/Desktop/node/test/test/node_modules/fluxex/extra/pjax.js":[function(require,module,exports){
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

},{}],"/Users/peterchang/Desktop/node/test/test/node_modules/fluxex/extra/routeToURL.js":[function(require,module,exports){
// Fluxex extra action
// you should attach a `routing()` action creator on your fluxexapp
// For most case you will not require this file directly
// See routing.js for more info
//
// you should attach a `redirect()` method on your fluxexapp
// see redirect.js for more info
//
// To support IE8,
// You will need to npm install html5-history-api,
// then add require('fluxex/extra/history'); in your fluxexapp.js

module.exports = function (url) {
    // Try to route
    return this.dispatch('UPDATE_URL', url).then(function () {
        // Run action to update page stores
        return this.executeAction(this.routing);
    }.bind(this)).then(function () {
        // Success, trigger page refresh
        this.getStore('page').emitChange();

        // update url to history
        /*global window*/
        window.history.pushState(
            JSON.stringify(this._context),
            undefined,
            this.getStore('page').getURL()
        );

        // scroll window to top to simulate non-pjax click
        window.scrollTo( 0, 0);
    }.bind(this))['catch'](function (E) {
        if (console && console.log) {
            console.log('Pjax failed! Failback to page loading....');
            console.log(E.stack || E);
        }

        // pjax failed, go to url...
        this.redirect(url);
    }.bind(this));
};

},{}],"/Users/peterchang/Desktop/node/test/test/node_modules/fluxex/extra/storechange.js":[function(require,module,exports){
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

},{}],"/Users/peterchang/Desktop/node/test/test/node_modules/iso-call/index.js":[function(require,module,exports){
module.exports = require('./lib/isocall');


},{"./lib/isocall":"/Users/peterchang/Desktop/node/test/test/node_modules/iso-call/lib/isocall.js"}],"/Users/peterchang/Desktop/node/test/test/node_modules/iso-call/lib/iso-config.js":[function(require,module,exports){
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

},{"./iso-execute-server":"/Users/peterchang/Desktop/node/test/test/node_modules/iso-call/lib/iso-execute-client.js","./iso-request-core":"/Users/peterchang/Desktop/node/test/test/node_modules/iso-call/lib/iso-request-core.js"}],"/Users/peterchang/Desktop/node/test/test/node_modules/iso-call/lib/iso-execute-client.js":[function(require,module,exports){
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

},{"./iso-config":"/Users/peterchang/Desktop/node/test/test/node_modules/iso-call/lib/iso-config.js","./iso-request-core":"/Users/peterchang/Desktop/node/test/test/node_modules/iso-call/lib/iso-request-core.js"}],"/Users/peterchang/Desktop/node/test/test/node_modules/iso-call/lib/iso-request-client.js":[function(require,module,exports){
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

},{"./iso-config":"/Users/peterchang/Desktop/node/test/test/node_modules/iso-call/lib/iso-config.js","./iso-execute-client":"/Users/peterchang/Desktop/node/test/test/node_modules/iso-call/lib/iso-execute-client.js"}],"/Users/peterchang/Desktop/node/test/test/node_modules/iso-call/lib/iso-request-core.js":[function(require,module,exports){
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

},{"browser-request":"browser-request"}],"/Users/peterchang/Desktop/node/test/test/node_modules/iso-call/lib/isocall.js":[function(require,module,exports){
module.exports = Object.assign(
    require('./iso-config'),
    require('./iso-execute-server'),
    require('./iso-request-server')
);

},{"./iso-config":"/Users/peterchang/Desktop/node/test/test/node_modules/iso-call/lib/iso-config.js","./iso-execute-server":"/Users/peterchang/Desktop/node/test/test/node_modules/iso-call/lib/iso-execute-client.js","./iso-request-server":"/Users/peterchang/Desktop/node/test/test/node_modules/iso-call/lib/iso-request-client.js"}],"/Users/peterchang/Desktop/node/test/test/node_modules/routes/dist/routes.js":[function(require,module,exports){
(function (global){
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.routes=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

var localRoutes = [];


/**
 * Convert path to route object
 *
 * A string or RegExp should be passed,
 * will return { re, src, keys} obj
 *
 * @param  {String / RegExp} path
 * @return {Object}
 */

var Route = function(path){
  //using 'new' is optional

  var src, re, keys = [];

  if(path instanceof RegExp){
    re = path;
    src = path.toString();
  }else{
    re = pathToRegExp(path, keys);
    src = path;
  }

  return {
  	 re: re,
  	 src: path.toString(),
  	 keys: keys
  }
};

/**
 * Normalize the given path string,
 * returning a regular expression.
 *
 * An empty array should be passed,
 * which will contain the placeholder
 * key names. For example "/user/:id" will
 * then contain ["id"].
 *
 * @param  {String} path
 * @param  {Array} keys
 * @return {RegExp}
 */
var pathToRegExp = function (path, keys) {
	path = path
		.concat('/?')
		.replace(/\/\(/g, '(?:/')
		.replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?|\*/g, function(_, slash, format, key, capture, optional){
			if (_ === "*"){
				keys.push(undefined);
				return _;
			}

			keys.push(key);
			slash = slash || '';
			return ''
				+ (optional ? '' : slash)
				+ '(?:'
				+ (optional ? slash : '')
				+ (format || '') + (capture || '([^/]+?)') + ')'
				+ (optional || '');
		})
		.replace(/([\/.])/g, '\\$1')
		.replace(/\*/g, '(.*)');
	return new RegExp('^' + path + '$', 'i');
};

/**
 * Attempt to match the given request to
 * one of the routes. When successful
 * a  {fn, params, splats} obj is returned
 *
 * @param  {Array} routes
 * @param  {String} uri
 * @return {Object}
 */
var match = function (routes, uri, startAt) {
	var captures, i = startAt || 0;

	for (var len = routes.length; i < len; ++i) {
		var route = routes[i],
		    re = route.re,
		    keys = route.keys,
		    splats = [],
		    params = {};

		if (captures = uri.match(re)) {
			for (var j = 1, len = captures.length; j < len; ++j) {
				var key = keys[j-1],
					val = typeof captures[j] === 'string'
						? unescape(captures[j])
						: captures[j];
				if (key) {
					params[key] = val;
				} else {
					splats.push(val);
				}
			}
			return {
				params: params,
				splats: splats,
				route: route.src,
				next: i + 1
			};
		}
	}
};

/**
 * Default "normal" router constructor.
 * accepts path, fn tuples via addRoute
 * returns {fn, params, splats, route}
 *  via match
 *
 * @return {Object}
 */

var Router = function(){
  //using 'new' is optional
  return {
    routes: [],
    routeMap : {},
    addRoute: function(path, fn){
      if (!path) throw new Error(' route requires a path');
      if (!fn) throw new Error(' route ' + path.toString() + ' requires a callback');

      if (this.routeMap[path]) {
        throw new Error('path is already defined: ' + path);
      }

      var route = Route(path);
      route.fn = fn;

      this.routes.push(route);
      this.routeMap[path] = fn;
    },

    removeRoute: function(path) {
      if (!path) throw new Error(' route requires a path');
      if (!this.routeMap[path]) {
        throw new Error('path does not exist: ' + path);
      }

      var match;
      var newRoutes = [];

      // copy the routes excluding the route being removed
      for (var i = 0; i < this.routes.length; i++) {
        var route = this.routes[i];
        if (route.src !== path) {
          newRoutes.push(route);
        }
      }
      this.routes = newRoutes;
      delete this.routeMap[path];
    },

    match: function(pathname, startAt){
      var route = match(this.routes, pathname, startAt);
      if(route){
        route.fn = this.routeMap[route.route];
        route.next = this.match.bind(this, pathname, route.next)
      }
      return route;
    }
  }
};

Router.Route = Route
Router.pathToRegExp = pathToRegExp
Router.match = match
// back compat
Router.Router = Router

module.exports = Router

},{}]},{},[1])
(1)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],"/Users/peterchang/Desktop/node/test/test/services/yql.js":[function(require,module,exports){
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

},{"iso-call":"/Users/peterchang/Desktop/node/test/test/node_modules/iso-call/index.js"}],"/Users/peterchang/Desktop/node/test/test/stores/search.js":[function(require,module,exports){
'use strict';

module.exports = {
    handle_UPDATE_SEARCH_RESULT: function handle_UPDATE_SEARCH_RESULT(data) {
        this._set('data', data);
        this.emitChange();
    },

    getResult: function getResult() {
        return this._get('data');
    },

    getQuery: function getQuery() {
        return { keyword: this._get('data').keyword };
    }
};

},{}]},{},["/Users/peterchang/Desktop/node/test/test/fluxexapp.js"])("/Users/peterchang/Desktop/node/test/test/fluxexapp.js")
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhY3Rpb25zL2FwaS5qcyIsImFjdGlvbnMvcGFnZS5qcyIsImFjdGlvbnMvcm91dGluZy5qcyIsImNvbXBvbmVudHMvSHRtbC5qc3giLCJjb21wb25lbnRzL1Jlc3VsdHMuanN4IiwiY29tcG9uZW50cy9TZWFyY2hCb3guanN4IiwiZmx1eGV4YXBwLmpzIiwibm9kZV9tb2R1bGVzL2ZsdXhleC9leHRyYS9wamF4LmpzIiwibm9kZV9tb2R1bGVzL2ZsdXhleC9leHRyYS9yb3V0ZVRvVVJMLmpzIiwibm9kZV9tb2R1bGVzL2ZsdXhleC9leHRyYS9zdG9yZWNoYW5nZS5qcyIsIm5vZGVfbW9kdWxlcy9pc28tY2FsbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pc28tY2FsbC9saWIvaXNvLWNvbmZpZy5qcyIsIm5vZGVfbW9kdWxlcy9pc28tY2FsbC9saWIvaXNvLWV4ZWN1dGUtY2xpZW50LmpzIiwibm9kZV9tb2R1bGVzL2lzby1jYWxsL2xpYi9pc28tcmVxdWVzdC1jbGllbnQuanMiLCJub2RlX21vZHVsZXMvaXNvLWNhbGwvbGliL2lzby1yZXF1ZXN0LWNvcmUuanMiLCJub2RlX21vZHVsZXMvaXNvLWNhbGwvbGliL2lzb2NhbGwuanMiLCJub2RlX21vZHVsZXMvcm91dGVzL2Rpc3Qvcm91dGVzLmpzIiwic2VydmljZXMveXFsLmpzIiwic3RvcmVzL3NlYXJjaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOzs7Ozs7OztBQUVBLElBQUksTUFBTSxRQUFRLGlCQUFSLENBQVY7O0FBRUEsT0FBTyxPQUFQLEdBQWlCO0FBQ2IsWUFBUSxnQkFBVSxPQUFWLEVBQW1CO0FBQ3ZCLFlBQUksSUFBSSxRQUFRLENBQVIsR0FBWSxDQUFaLElBQWlCLENBQXpCO0FBQUEsWUFDSSxRQUFRLElBQUksRUFEaEI7QUFBQSxZQUVJLFVBQVUsUUFBUSxDQUZ0QjtBQUFBLFlBR0ksT0FBTyxJQUhYOztBQUtBLFlBQUksQ0FBQyxPQUFMLEVBQWM7QUFDVixtQkFBTyxrQkFBUSxPQUFSLENBQWdCLEVBQWhCLENBQVA7QUFDSDs7QUFFRCxlQUFPLElBQUksNkRBQTRELE9BQTVELEdBQXNFLEdBQTFFLEVBQStFLElBQS9FLENBQW9GLFVBQVUsQ0FBVixFQUFhO0FBQ3BHLG1CQUFPLEtBQUssUUFBTCxDQUFjLHNCQUFkLEVBQXNDO0FBQ3pDLHlCQUFTLE9BRGdDO0FBRXpDLHdCQUFRLEtBRmlDO0FBR3pDLHNCQUFNLElBQUssRUFBRSxNQUFGLENBQVMsTUFBVCxHQUFrQixFQUFFLE1BQXBCLEdBQTZCLENBQUMsRUFBRSxNQUFILENBQWxDLEdBQWdEO0FBSGIsYUFBdEMsQ0FBUDtBQUtILFNBTk0sQ0FBUDtBQU9IO0FBbEJZLENBQWpCOzs7OztBQ0pBLElBQUksT0FBTyxRQUFRLE9BQVIsQ0FBWDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFFBQVE7QUFDUixZQUFRLGtCQUFZO0FBQ2hCLGFBQUssUUFBTCxDQUFjLGNBQWQsRUFBOEIsWUFBWSxLQUFLLFFBQUwsQ0FBYyxNQUFkLEVBQXNCLFFBQXRCLEdBQWlDLENBQTNFO0FBQ0EsZUFBTyxLQUFLLGFBQUwsQ0FBbUIsS0FBSyxNQUF4QixFQUFnQyxLQUFLLFFBQUwsQ0FBYyxNQUFkLEVBQXNCLFFBQXRCLEVBQWhDLENBQVA7QUFDSDtBQUpPLENBQVo7O0FBT0EsT0FBTyxPQUFQLEdBQWlCLEtBQWpCOzs7QUNaQTs7Ozs7Ozs7QUFFQSxJQUFJLE9BQU8sUUFBUSxRQUFSLENBQVg7QUFBQSxJQUNJLFNBQVMsUUFBUSxRQUFSLEdBRGI7O0FBR0EsT0FBTyxRQUFQLENBQWdCLFNBQWhCLEVBQTJCLENBQUMsUUFBRCxFQUFXLEtBQUssTUFBaEIsQ0FBM0I7O0FBRUE7QUFDQSxPQUFPLE9BQVAsR0FBaUIsWUFBWTtBQUN6QixRQUFJLE9BQU8sS0FBSyxRQUFMLENBQWMsTUFBZCxFQUFzQixJQUF0QixDQUEyQixLQUEzQixFQUFrQyxRQUE3QztBQUFBLFFBQ0ksUUFBUSxPQUFPLEtBQVAsQ0FBYSxJQUFiLENBRFo7O0FBR0EsUUFBSSxDQUFDLEtBQUwsRUFBWTtBQUNSLGVBQU8sa0JBQVEsTUFBUixDQUFlLElBQUksS0FBSixDQUFVLDBCQUEwQixJQUFwQyxDQUFmLENBQVA7QUFDSDs7QUFFRCxTQUFLLFFBQUwsQ0FBYyxnQkFBZCxFQUFnQztBQUM1QixjQUFNLE1BQU0sRUFBTixDQUFTLENBQVQsQ0FEc0I7QUFFNUIsZ0JBQVEsTUFBTTtBQUZjLEtBQWhDOztBQUtBLFdBQU8sS0FBSyxhQUFMLENBQW1CLE1BQU0sRUFBTixDQUFTLENBQVQsQ0FBbkIsQ0FBUDtBQUNILENBZEQ7Ozs7O0FDUkEsSUFBSSxRQUFRLFFBQVEsT0FBUixDQUFaO0FBQ0EsSUFBSSxTQUFTLFFBQVEsUUFBUixDQUFiO0FBQ0EsSUFBSSxVQUFVLFFBQVEsZUFBUixDQUFkO0FBQ0EsSUFBSSxZQUFZLFFBQVEsaUJBQVIsQ0FBaEI7O0FBRUEsSUFBSSxPQUFPLE1BQU0sV0FBTixDQUFrQjtBQUFBOztBQUN6QixVQUFRLENBQ0osT0FBTyxLQURILEVBRUosUUFBUSxtQkFBUixDQUZJLENBRGlCOztBQU16QixtQkFBaUIsMkJBQVk7QUFDekIsV0FBTyxFQUFQO0FBQ0gsR0FSd0I7O0FBVXpCLFVBQVEsa0JBQVk7QUFDaEIsV0FDQTtBQUFBO0FBQUE7QUFDQztBQUFBO0FBQUE7QUFDQyxzQ0FBTSxTQUFRLE9BQWQsR0FERDtBQUVDLHNDQUFNLE1BQUssVUFBWCxFQUFzQixTQUFRLHNDQUE5QixHQUZEO0FBR0MsNEJBQUMsTUFBRCxDQUFRLEtBQVI7QUFIRCxPQUREO0FBTUM7QUFBQTtBQUFBLFVBQU0sU0FBUyxLQUFLLGVBQXBCO0FBQ0MsNEJBQUMsU0FBRCxPQUREO0FBQUE7QUFHQztBQUFBO0FBQUE7QUFDQztBQUFBO0FBQUE7QUFBSTtBQUFBO0FBQUEsZ0JBQUcsTUFBSyxpQkFBUjtBQUFBO0FBQUE7QUFBSixXQUREO0FBRUM7QUFBQTtBQUFBO0FBQUk7QUFBQTtBQUFBLGdCQUFHLE1BQUssa0JBQVI7QUFBQTtBQUFBO0FBQUosV0FGRDtBQUdDO0FBQUE7QUFBQTtBQUFJO0FBQUE7QUFBQSxnQkFBRyxNQUFLLGtCQUFSO0FBQUE7QUFBQTtBQUFKO0FBSEQsU0FIRDtBQVFDLDRCQUFDLE9BQUQsT0FSRDtBQVNDLDRCQUFDLE1BQUQsQ0FBUSxVQUFSO0FBVEQ7QUFORCxLQURBO0FBb0JIO0FBL0J3QixDQUFsQixDQUFYOztBQWtDQSxPQUFPLE9BQVAsR0FBaUIsSUFBakI7Ozs7O0FDdkNBLElBQUksUUFBUSxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUksU0FBUyxRQUFRLFFBQVIsQ0FBYjs7QUFFQSxJQUFJLFVBQVUsTUFBTSxXQUFOLENBQWtCO0FBQUE7O0FBQzVCLFlBQVEsQ0FDSixPQUFPLEtBREgsRUFFSixRQUFRLDBCQUFSLENBRkksRUFHSixFQUFDLGNBQWMsQ0FBQyxRQUFELENBQWYsRUFISSxDQURvQjs7QUFPNUIsd0JBQW9CLDhCQUFZO0FBQzVCLGVBQU8sS0FBSyxRQUFMLENBQWMsUUFBZCxFQUF3QixTQUF4QixFQUFQO0FBQ0gsS0FUMkI7O0FBVzVCLFlBQVEsa0JBQVk7QUFDaEIsWUFBSSxPQUFPLEVBQVg7QUFBQSxZQUFlLENBQWY7QUFBQSxZQUFrQixDQUFsQjs7QUFFQSxZQUFJLENBQUMsS0FBSyxLQUFMLENBQVcsSUFBaEIsRUFBc0I7QUFDbEIsbUJBQ0c7QUFBQTtBQUFBO0FBQUssdUNBQXVCLEtBQUssS0FBTCxDQUFXLE9BQWxDLEdBQTRDO0FBQWpELGFBREg7QUFHSDs7QUFFRCxhQUFLLENBQUwsSUFBVSxLQUFLLEtBQUwsQ0FBVyxJQUFyQixFQUEyQjtBQUN2QixnQkFBSSxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLENBQWhCLENBQUo7O0FBRUEsaUJBQUssSUFBTCxDQUNBO0FBQUE7QUFBQSxrQkFBSSxLQUFLLEVBQUUsRUFBWDtBQUNDO0FBQUE7QUFBQTtBQUFJO0FBQUE7QUFBQSwwQkFBRyxNQUFNLEVBQUUsR0FBWDtBQUFpQiwwQkFBRTtBQUFuQjtBQUFKLGlCQUREO0FBRUM7QUFBQTtBQUFBO0FBQ0M7QUFBQTtBQUFBO0FBQUE7QUFBZSwwQkFBRTtBQUFqQixxQkFERDtBQUVDO0FBQUE7QUFBQTtBQUFBO0FBQWEsMEJBQUUsTUFBRixDQUFTO0FBQXRCLHFCQUZEO0FBR0M7QUFBQTtBQUFBO0FBQUE7QUFBYTtBQUFBO0FBQUEsOEJBQUcsTUFBTSxFQUFFLE1BQVg7QUFBb0IsOEJBQUUsT0FBdEI7QUFBQTtBQUFnQyw4QkFBRSxJQUFsQztBQUFBO0FBQXlDLDhCQUFFO0FBQTNDO0FBQWI7QUFIRDtBQUZELGFBREE7QUFVSDs7QUFFRCxlQUNBO0FBQUE7QUFBQTtBQUNDO0FBQUE7QUFBQTtBQUFLLHVDQUF1QixLQUFLLEtBQUwsQ0FBVyxPQUFsQyxHQUE0QztBQUFqRCxhQUREO0FBRUM7QUFBQTtBQUFBO0FBQUs7QUFBTDtBQUZELFNBREE7QUFNSDtBQXpDMkIsQ0FBbEIsQ0FBZDs7QUE0Q0EsT0FBTyxPQUFQLEdBQWlCLE9BQWpCOzs7OztBQy9DQSxJQUFJLFFBQVEsUUFBUSxPQUFSLENBQVo7QUFDQSxJQUFJLFNBQVMsUUFBUSxRQUFSLENBQWI7O0FBRUEsSUFBSSxZQUFZLE1BQU0sV0FBTixDQUFrQjtBQUFBOztBQUM5QixZQUFRLENBQ0osT0FBTyxLQURILEVBRUosUUFBUSwwQkFBUixDQUZJLEVBR0osRUFBQyxjQUFjLENBQUMsUUFBRCxDQUFmLEVBSEksQ0FEc0I7O0FBTzlCLHdCQUFvQiw4QkFBWTtBQUM1QixlQUFPLEtBQUssUUFBTCxDQUFjLFFBQWQsRUFBd0IsUUFBeEIsRUFBUDtBQUNILEtBVDZCOztBQVc5QixrQkFBYyxzQkFBVSxDQUFWLEVBQWE7QUFDdkIsYUFBSyxRQUFMLENBQWMsRUFBQyxTQUFTLEVBQUUsTUFBRixDQUFTLEtBQW5CLEVBQWQ7QUFDQSxhQUFLLFdBQUwsR0FBbUIsVUFBbkIsQ0FBOEIsS0FBSyxRQUFMLENBQWMsTUFBZCxFQUFzQixNQUF0QixDQUE2QixFQUFDLEdBQUcsRUFBRSxNQUFGLENBQVMsS0FBYixFQUE3QixDQUE5QjtBQUNILEtBZDZCOztBQWdCOUIsWUFBUSxrQkFBWTtBQUNoQixlQUNBO0FBQUE7QUFBQTtBQUNDLDJDQUFPLE1BQUssTUFBWixFQUFtQixVQUFVLEtBQUssWUFBbEMsRUFBZ0QsT0FBTyxLQUFLLEtBQUwsQ0FBVyxPQUFsRSxHQUREO0FBRUMsMkNBQU8sTUFBSyxRQUFaLEVBQXFCLE9BQU0sU0FBM0I7QUFGRCxTQURBO0FBTUg7QUF2QjZCLENBQWxCLENBQWhCOztBQTBCQSxPQUFPLE9BQVAsR0FBaUIsU0FBakI7Ozs7O0FDN0JBLFFBQVEsZ0JBQVI7O0FBRUEsSUFBSSxlQUFlLFFBQVEsMkJBQVIsQ0FBbkI7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFFBQVEsUUFBUixFQUFrQixTQUFsQixDQUE0QjtBQUN6QyxVQUFNLGFBQWEsSUFEc0I7QUFFekMsWUFBUSxRQUFRLGlCQUFSO0FBRmlDLENBQTVCLEVBR2QsUUFBUSx1QkFBUixDQUhjLEVBR29CO0FBQ2pDLGFBQVMsUUFBUSxtQkFBUixDQUR3QjtBQUVqQyxnQkFBWSxRQUFRLHlCQUFSO0FBRnFCLENBSHBCLENBQWpCOzs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZMQTs7QUFFQSxJQUFJLFVBQVUsUUFBUSxVQUFSLENBQWQ7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFVBQVUsR0FBVixFQUFlO0FBQzVCLFFBQUksQ0FBQyxHQUFMLEVBQVU7QUFDTixjQUFNLElBQUksS0FBSixDQUFVLGlDQUFWLENBQU47QUFDSDs7QUFFRCxXQUFPLFFBQVEsT0FBUixDQUFnQixLQUFoQixFQUF1QjtBQUMxQixZQUFJO0FBQ0EsZUFBRyxHQURIO0FBRUEsb0JBQVE7QUFGUixTQURzQjtBQUsxQiw0QkFBcUIsS0FMSztBQU0xQixjQUFNO0FBTm9CLEtBQXZCLEVBT0osSUFQSSxDQU9DLFVBQVUsQ0FBVixFQUFhO0FBQ2pCLFlBQUksRUFBRSxJQUFGLElBQVUsRUFBRSxJQUFGLENBQU8sS0FBakIsSUFBMEIsRUFBRSxJQUFGLENBQU8sS0FBUCxDQUFhLGNBQWIsQ0FBNEIsU0FBNUIsQ0FBOUIsRUFBc0U7QUFDbEUsbUJBQU8sRUFBRSxJQUFGLENBQU8sS0FBUCxDQUFhLE9BQXBCO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsa0JBQU0sSUFBSSxLQUFKLENBQVU7QUFDWix5QkFBUyw4QkFERztBQUVaLHlCQUFTO0FBRkcsYUFBVixDQUFOO0FBSUg7QUFDSixLQWhCTSxDQUFQO0FBaUJILENBdEJEOzs7QUNKQTs7QUFFQSxPQUFPLE9BQVAsR0FBaUI7QUFDYixpQ0FBNkIscUNBQVUsSUFBVixFQUFnQjtBQUN6QyxhQUFLLElBQUwsQ0FBVSxNQUFWLEVBQWtCLElBQWxCO0FBQ0EsYUFBSyxVQUFMO0FBQ0gsS0FKWTs7QUFNYixlQUFXLHFCQUFZO0FBQ25CLGVBQU8sS0FBSyxJQUFMLENBQVUsTUFBVixDQUFQO0FBQ0gsS0FSWTs7QUFVYixjQUFVLG9CQUFZO0FBQ2xCLGVBQU8sRUFBQyxTQUFTLEtBQUssSUFBTCxDQUFVLE1BQVYsRUFBa0IsT0FBNUIsRUFBUDtBQUNIO0FBWlksQ0FBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgeXFsID0gcmVxdWlyZSgnLi4vc2VydmljZXMveXFsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHNlYXJjaDogZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICAgICAgdmFyIHAgPSBwYXlsb2FkLnAgKiAxIHx8IDAsXG4gICAgICAgICAgICBzdGFydCA9IHAgKiAxMCxcbiAgICAgICAgICAgIGtleXdvcmQgPSBwYXlsb2FkLnEsXG4gICAgICAgICAgICBzZWxmID0gdGhpcztcblxuICAgICAgICBpZiAoIWtleXdvcmQpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe30pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHlxbCgnc2VsZWN0ICogZnJvbSBsb2NhbC5zZWFyY2ggd2hlcmUgemlwPVwiOTQwODVcIiBhbmQgcXVlcnk9XCInKyBrZXl3b3JkICsgJ1wiJykudGhlbihmdW5jdGlvbiAoTykge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuZGlzcGF0Y2goJ1VQREFURV9TRUFSQ0hfUkVTVUxUJywge1xuICAgICAgICAgICAgICAgIGtleXdvcmQ6IGtleXdvcmQsXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiBzdGFydCxcbiAgICAgICAgICAgICAgICBoaXRzOiBPID8gKE8uUmVzdWx0Lmxlbmd0aCA/IE8uUmVzdWx0IDogW08uUmVzdWx0XSkgOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuIiwidmFyIGFwaXMgPSByZXF1aXJlKCcuL2FwaScpO1xuXG4vLyBBbGwgcGFnZSBhY3Rpb25zIGhlcmUuXG4vLyBBIHBhZ2UgYWN0aW9uIHdpbGwgcHJlcGFyZSBhbGwgcmVxdWlyZWQgc3RvcmUgZm9yIGEgcGFnZVxuLy8gYW5kIHVwZGF0ZSB0aGUgcGFnZSB0aXRsZS5cbnZhciBwYWdlcyA9IHtcbiAgICBzZWFyY2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5kaXNwYXRjaCgnVVBEQVRFX1RJVExFJywgJ1NlYXJjaDonICsgdGhpcy5nZXRTdG9yZSgncGFnZScpLmdldFF1ZXJ5KCkucSk7XG4gICAgICAgIHJldHVybiB0aGlzLmV4ZWN1dGVBY3Rpb24oYXBpcy5zZWFyY2gsIHRoaXMuZ2V0U3RvcmUoJ3BhZ2UnKS5nZXRRdWVyeSgpKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBhZ2VzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcGFnZSA9IHJlcXVpcmUoJy4vcGFnZScpLFxuICAgIHJvdXRlciA9IHJlcXVpcmUoJ3JvdXRlcycpKCk7XG5cbnJvdXRlci5hZGRSb3V0ZSgnL3NlYXJjaCcsIFsnc2VhcmNoJywgcGFnZS5zZWFyY2hdKTtcblxuLy8gVGhlIHNpbmdsZSByb3V0aW5nIGFjdGlvbiBjYW4gYmUgdXNlZCBhdCBib3RoIHNlcnZlci9jbGllbnQgc2lkZS5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwYXRoID0gdGhpcy5nZXRTdG9yZSgncGFnZScpLl9nZXQoJ3VybCcpLnBhdGhuYW1lLFxuICAgICAgICBtYXRjaCA9IHJvdXRlci5tYXRjaChwYXRoKTtcblxuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignbm8gbWF0Y2hlZCByb3V0ZSBmb3I6JyArIHBhdGgpKTtcbiAgICB9XG5cbiAgICB0aGlzLmRpc3BhdGNoKCdVUERBVEVfUk9VVElORycsIHtcbiAgICAgICAgbmFtZTogbWF0Y2guZm5bMF0sXG4gICAgICAgIHBhcmFtczogbWF0Y2gucGFyYW1zXG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcy5leGVjdXRlQWN0aW9uKG1hdGNoLmZuWzFdKTtcbn07XG4iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEZsdXhleCA9IHJlcXVpcmUoJ2ZsdXhleCcpO1xudmFyIFJlc3VsdHMgPSByZXF1aXJlKCcuL1Jlc3VsdHMuanN4Jyk7XG52YXIgU2VhcmNoQm94ID0gcmVxdWlyZSgnLi9TZWFyY2hCb3guanN4Jyk7XG5cbnZhciBIdG1sID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIG1peGluczogW1xuICAgICAgICBGbHV4ZXgubWl4aW4sXG4gICAgICAgIHJlcXVpcmUoJ2ZsdXhleC9leHRyYS9wamF4JylcbiAgICBdLFxuXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgIDxodG1sPlxuICAgICAgICAgPGhlYWQ+XG4gICAgICAgICAgPG1ldGEgY2hhclNldD1cInV0Zi04XCIgLz5cbiAgICAgICAgICA8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLCB1c2VyLXNjYWxhYmxlPW5vXCIgLz5cbiAgICAgICAgICA8Rmx1eGV4LlRpdGxlIC8+XG4gICAgICAgICA8L2hlYWQ+XG4gICAgICAgICA8Ym9keSBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrTGlua30+XG4gICAgICAgICAgPFNlYXJjaEJveCAvPlxuICAgICAgICAgIFNhbXBsZSBTZWFyY2g6XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICA8bGk+PGEgaHJlZj1cIi9zZWFyY2g/cT1hcHBsZVwiPkFwcGxlPC9hPjwvbGk+XG4gICAgICAgICAgIDxsaT48YSBocmVmPVwiL3NlYXJjaD9xPWJhbmFuYVwiPkJhbmFuYTwvYT48L2xpPlxuICAgICAgICAgICA8bGk+PGEgaHJlZj1cIi9zZWFyY2g/cT1vcmFuZ2VcIj5PcmFuZ2U8L2E+PC9saT5cbiAgICAgICAgICA8L3VsPlxuICAgICAgICAgIDxSZXN1bHRzIC8+XG4gICAgICAgICAgPEZsdXhleC5Jbml0U2NyaXB0IC8+XG4gICAgICAgICA8L2JvZHk+XG4gICAgICAgIDwvaHRtbD4gXG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gSHRtbDtcbiIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgRmx1eGV4ID0gcmVxdWlyZSgnZmx1eGV4Jyk7XG5cbnZhciBSZXN1bHRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIG1peGluczogW1xuICAgICAgICBGbHV4ZXgubWl4aW4sXG4gICAgICAgIHJlcXVpcmUoJ2ZsdXhleC9leHRyYS9zdG9yZWNoYW5nZScpLFxuICAgICAgICB7bGlzdGVuU3RvcmVzOiBbJ3NlYXJjaCddfVxuICAgIF0sXG5cbiAgICBnZXRTdGF0ZUZyb21TdG9yZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RvcmUoJ3NlYXJjaCcpLmdldFJlc3VsdCgpO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGhpdHMgPSBbXSwgSSwgUDtcblxuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuaGl0cykge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgIDxoMT57J1NlYXJjaCBrZXl3b3JkOiBcXCcnICsgdGhpcy5zdGF0ZS5rZXl3b3JkICsgJ1xcJyBub3QgZm91bmQhJ308L2gxPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoSSBpbiB0aGlzLnN0YXRlLmhpdHMpIHtcbiAgICAgICAgICAgIFAgPSB0aGlzLnN0YXRlLmhpdHNbSV07XG5cbiAgICAgICAgICAgIGhpdHMucHVzaChcbiAgICAgICAgICAgIDxsaSBrZXk9e1AuaWR9PlxuICAgICAgICAgICAgIDxoNT48YSBocmVmPXtQLlVybH0+e1AuVGl0bGV9PC9hPjwvaDU+XG4gICAgICAgICAgICAgPHVsPlxuICAgICAgICAgICAgICA8bGk+RGlzdGFuY2U6IHtQLkRpc3RhbmNlfTwvbGk+XG4gICAgICAgICAgICAgIDxsaT5SYXRpbmc6IHtQLlJhdGluZy5BdmVyYWdlUmF0aW5nfTwvbGk+XG4gICAgICAgICAgICAgIDxsaT5BZGRyZXNzOiA8YSBocmVmPXtQLk1hcFVybH0+e1AuQWRkcmVzc30ge1AuQ2l0eX0ge1AuU3RhdGV9PC9hPjwvbGk+XG4gICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgIDxoMT57J1NlYXJjaCBrZXl3b3JkOiBcXCcnICsgdGhpcy5zdGF0ZS5rZXl3b3JkICsgJ1xcJyd9PC9oMT5cbiAgICAgICAgIDx1bD57aGl0c308L3VsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZXN1bHRzO1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBGbHV4ZXggPSByZXF1aXJlKCdmbHV4ZXgnKTtcblxudmFyIFNlYXJjaEJveCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBtaXhpbnM6IFtcbiAgICAgICAgRmx1eGV4Lm1peGluLFxuICAgICAgICByZXF1aXJlKCdmbHV4ZXgvZXh0cmEvc3RvcmVjaGFuZ2UnKSxcbiAgICAgICAge2xpc3RlblN0b3JlczogWydzZWFyY2gnXX1cbiAgICBdLFxuXG4gICAgZ2V0U3RhdGVGcm9tU3RvcmVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFN0b3JlKCdzZWFyY2gnKS5nZXRRdWVyeSgpO1xuICAgIH0sXG5cbiAgICBoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uIChFKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2tleXdvcmQ6IEUudGFyZ2V0LnZhbHVlfSk7XG4gICAgICAgIHRoaXMuX2dldENvbnRleHQoKS5yb3V0ZVRvVVJMKHRoaXMuZ2V0U3RvcmUoJ3BhZ2UnKS5nZXRVUkwoe3E6IEUudGFyZ2V0LnZhbHVlfSkpO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgPGZvcm0+XG4gICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9IHZhbHVlPXt0aGlzLnN0YXRlLmtleXdvcmR9IC8+XG4gICAgICAgICA8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiU2VhcmNoIVwiIC8+XG4gICAgICAgIDwvZm9ybT5cbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZWFyY2hCb3g7XG4iLCJyZXF1aXJlKCdiYWJlbC1wb2x5ZmlsbCcpO1xuXG52YXIgY29tbW9uU3RvcmVzID0gcmVxdWlyZSgnZmx1eGV4L2V4dHJhL2NvbW1vblN0b3JlcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJ2ZsdXhleCcpLmNyZWF0ZUFwcCh7XG4gICAgcGFnZTogY29tbW9uU3RvcmVzLnBhZ2UsXG4gICAgc2VhcmNoOiByZXF1aXJlKCcuL3N0b3Jlcy9zZWFyY2gnKVxufSwgcmVxdWlyZSgnLi9jb21wb25lbnRzL0h0bWwuanN4JyksIHtcbiAgICByb3V0aW5nOiByZXF1aXJlKCcuL2FjdGlvbnMvcm91dGluZycpLFxuICAgIHJvdXRlVG9VUkw6IHJlcXVpcmUoJ2ZsdXhleC9leHRyYS9yb3V0ZVRvVVJMJylcbn0pO1xuIiwiLy8gVXNlIHRoaXMgbWl4aW4gYXQgSFRNTC9CT0RZIGxldmVsIHRvIGVuYWJsZSBwamF4IGJlaGF2aW9yXG4vLyBZb3VyIGZsdXhleGFwcCBzaG91bGQgcHJvdmlkZSByb3V0ZVRvVVJMKCkgZm9yIHRoaXMgbWl4aW5cbi8vIFNlZSByb3V0ZVRvVVJMLmpzIGZvciBtb3JlIGluZm9cbi8vXG4vLyBUbyBzdXBwb3J0IElFOCxcbi8vIFlvdSB3aWxsIG5lZWQgdG8gbnBtIGluc3RhbGwgaHRtbDUtaGlzdG9yeS1hcGksXG4vLyB0aGVuIGFkZCByZXF1aXJlKCdmbHV4ZXgvZXh0cmEvaGlzdG9yeScpOyBpbiB5b3VyIGZsdXhleGFwcC5qc1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvKmdsb2JhbCB3aW5kb3csZG9jdW1lbnQqL1xuICAgICAgICB2YXIgYmxvY2tEb3VibGVQb3AgPSAoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gJ2NvbXBsZXRlJyksXG4gICAgICAgICAgICBpbml0U3RhdGUgPSBKU09OLnN0cmluZ2lmeSh0aGlzLl9nZXRDb250ZXh0KCkuX2NvbnRleHQpLFxuICAgICAgICAgICAgbG9jYXRpb24gPSB3aW5kb3cuaGlzdG9yeS5sb2NhdGlvbiB8fCB3aW5kb3cubG9jYXRpb24sXG4gICAgICAgICAgICBpbml0VXJsID0gbG9jYXRpb24uaHJlZjtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgYmxvY2tEb3VibGVQb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIH0sIDEpO1xuICAgICAgICB9KTtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBmdW5jdGlvbiAoRSkge1xuICAgICAgICAgICAgdmFyIHN0YXRlID0gRS5zdGF0ZSB8fCAoKGxvY2F0aW9uLmhyZWYgPT09IGluaXRVcmwpID8gaW5pdFN0YXRlIDogdW5kZWZpbmVkKTtcblxuICAgICAgICAgICAgaWYgKGJsb2NrRG91YmxlUG9wICYmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IEpTT04ucGFyc2Uoc3RhdGUpO1xuICAgICAgICAgICAgfSBjYXRjaCAoRSkge1xuICAgICAgICAgICAgICAgIHN0YXRlID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFzdGF0ZSkge1xuICAgICAgICAgICAgICAgIC8vIE5PIFNUQVRFIERBVEEuLi4uY2FuIG5vdCByZS1yZW5kZXIsIHNvIHJlbG9hZC5cbiAgICAgICAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFlhLCB0cmlnZ2VyIHBhZ2UgcmVzdG9yZSBieSBhbiBhbm9ueW1vdXMgYWN0aW9uXG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVBY3Rpb24oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc3RvcmUoc3RhdGUpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2goJyoqVVBEQVRFQUxMKionKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMuX2dldENvbnRleHQoKSkpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICBoYW5kbGVDbGlja0xpbms6IGZ1bmN0aW9uIChFKSB7XG4gICAgICAgIHZhciBBID0gRS50YXJnZXQuY2xvc2VzdCgnYVtocmVmXScpIHx8IEUudGFyZ2V0O1xuICAgICAgICB2YXIgSFJFRiA9IEEuaHJlZjtcblxuICAgICAgICBpZiAoIUhSRUYgfHwgSFJFRi5tYXRjaCgvIy8pIHx8IChBLnRhcmdldCA9PT0gJ19ibGFuaycpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoKEEudGFyZ2V0ID09PSAnX3RvcCcpICYmICh3aW5kb3cudG9wICE9PSB3aW5kb3cpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoKEEudGFyZ2V0ID09PSAnX3BhcmVudCcpICYmICh3aW5kb3cucGFyZW50ICE9PSB3aW5kb3cpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBFLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIEUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldENvbnRleHQoKS5yb3V0ZVRvVVJMKEhSRUYpO1xuICAgIH1cbn07XG4iLCIvLyBGbHV4ZXggZXh0cmEgYWN0aW9uXG4vLyB5b3Ugc2hvdWxkIGF0dGFjaCBhIGByb3V0aW5nKClgIGFjdGlvbiBjcmVhdG9yIG9uIHlvdXIgZmx1eGV4YXBwXG4vLyBGb3IgbW9zdCBjYXNlIHlvdSB3aWxsIG5vdCByZXF1aXJlIHRoaXMgZmlsZSBkaXJlY3RseVxuLy8gU2VlIHJvdXRpbmcuanMgZm9yIG1vcmUgaW5mb1xuLy9cbi8vIHlvdSBzaG91bGQgYXR0YWNoIGEgYHJlZGlyZWN0KClgIG1ldGhvZCBvbiB5b3VyIGZsdXhleGFwcFxuLy8gc2VlIHJlZGlyZWN0LmpzIGZvciBtb3JlIGluZm9cbi8vXG4vLyBUbyBzdXBwb3J0IElFOCxcbi8vIFlvdSB3aWxsIG5lZWQgdG8gbnBtIGluc3RhbGwgaHRtbDUtaGlzdG9yeS1hcGksXG4vLyB0aGVuIGFkZCByZXF1aXJlKCdmbHV4ZXgvZXh0cmEvaGlzdG9yeScpOyBpbiB5b3VyIGZsdXhleGFwcC5qc1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgICAvLyBUcnkgdG8gcm91dGVcbiAgICByZXR1cm4gdGhpcy5kaXNwYXRjaCgnVVBEQVRFX1VSTCcsIHVybCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFJ1biBhY3Rpb24gdG8gdXBkYXRlIHBhZ2Ugc3RvcmVzXG4gICAgICAgIHJldHVybiB0aGlzLmV4ZWN1dGVBY3Rpb24odGhpcy5yb3V0aW5nKTtcbiAgICB9LmJpbmQodGhpcykpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBTdWNjZXNzLCB0cmlnZ2VyIHBhZ2UgcmVmcmVzaFxuICAgICAgICB0aGlzLmdldFN0b3JlKCdwYWdlJykuZW1pdENoYW5nZSgpO1xuXG4gICAgICAgIC8vIHVwZGF0ZSB1cmwgdG8gaGlzdG9yeVxuICAgICAgICAvKmdsb2JhbCB3aW5kb3cqL1xuICAgICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoXG4gICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh0aGlzLl9jb250ZXh0KSxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHRoaXMuZ2V0U3RvcmUoJ3BhZ2UnKS5nZXRVUkwoKVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIHNjcm9sbCB3aW5kb3cgdG8gdG9wIHRvIHNpbXVsYXRlIG5vbi1wamF4IGNsaWNrXG4gICAgICAgIHdpbmRvdy5zY3JvbGxUbyggMCwgMCk7XG4gICAgfS5iaW5kKHRoaXMpKVsnY2F0Y2gnXShmdW5jdGlvbiAoRSkge1xuICAgICAgICBpZiAoY29uc29sZSAmJiBjb25zb2xlLmxvZykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1BqYXggZmFpbGVkISBGYWlsYmFjayB0byBwYWdlIGxvYWRpbmcuLi4uJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhFLnN0YWNrIHx8IEUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcGpheCBmYWlsZWQsIGdvIHRvIHVybC4uLlxuICAgICAgICB0aGlzLnJlZGlyZWN0KHVybCk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmdldFN0YXRlRnJvbVN0b3Jlcykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3Ugc2hvdWxkIHByb3ZpZGUgZ2V0U3RhdGVGcm9tU3RvcmVzIG1ldGhvZCBmb3IgdGhpcyBjb21wb25lbnQgd2hlbiB1c2luZyBzdG9yZWNoYW5nZSBtaXhpbiEnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZvciAuZ2V0SW5pdGlhbFN0YXRlKCk6IG11c3QgcmV0dXJuIGFuIG9iamVjdCBvciBudWxsXG4gICAgICAgIHJldHVybiB0aGlzLmdldFN0YXRlRnJvbVN0b3JlcygpIHx8IHt9O1xuICAgIH0sXG4gICAgb25TdG9yZUNoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0U3RhdGVGcm9tU3RvcmVzKCkpO1xuICAgIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL2lzb2NhbGwnKTtcblxuIiwidmFyIGlzb3JlcSA9IHJlcXVpcmUoJy4vaXNvLXJlcXVlc3QtY29yZScpO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlcnNjb3JlLWRhbmdsZSAqL1xudmFyIHJlcXVlc3RDb25maWdzO1xudmFyIHJlcXVlc3RCYXNlVXJsO1xuXG52YXIgX0RFRkFVTFRfSVNPX1JFUVVFU1RfUlBDXyA9ICdfREVGQVVMVF9JU09fUkVRVUVTVF9SUENfJztcbnZhciBfREVGQVVMVF9CQVNFVVJMXyA9ICcvX2lzb3JlcV8vJztcblxudmFyIGRlZmF1bHRDZmcgPSB7XG4gICAgX0RFRkFVTFRfSVNPX1JFUVVFU1RfUlBDXzogZnVuY3Rpb24gKGNmZykge1xuICAgICAgICB2YXIgVVJMID0gcmVxdWVzdENvbmZpZ3NbY2ZnLm5hbWVdO1xuXG4gICAgICAgIGlmICghVVJMKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdjYWxsIGlzb2NhbGwucmVxdWVzdCgpIG9uIGFwaTogXCInICsgY2ZnLm5hbWUgKyAnXCIgd2l0aG91dCBVUkwhJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzb3JlcShPYmplY3QuYXNzaWduKHt1cmw6IFVSTH0sIGNmZy5jZmcpKTtcbiAgICB9XG59O1xuXG52YXIgcmVzZXRCYXNlVVJMID0gZnVuY3Rpb24gKCkge1xuICAgIHJlcXVlc3RCYXNlVXJsID0gX0RFRkFVTFRfQkFTRVVSTF87XG59O1xuXG52YXIgcmVzZXRDb25maWdzID0gZnVuY3Rpb24gKGNsZWFuKSB7XG4gICAgcmVxdWVzdENvbmZpZ3MgPSBjbGVhbiA/IHt9IDogT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdENmZyk7XG59O1xuXG5yZXNldEJhc2VVUkwoKTtcbnJlc2V0Q29uZmlncygpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBfREVGQVVMVF9JU09fUkVRVUVTVF9SUENfOiBfREVGQVVMVF9JU09fUkVRVUVTVF9SUENfLFxuXG4gICAgcmVzZXRDb25maWdzOiByZXNldENvbmZpZ3MsXG4gICAgcmVzZXRCYXNlVVJMOiByZXNldEJhc2VVUkwsXG5cbiAgICBhZGRDb25maWdzOiBmdW5jdGlvbiAoY2Zncykge1xuICAgICAgICBPYmplY3QuYXNzaWduKHJlcXVlc3RDb25maWdzLCBjZmdzKTtcbiAgICB9LFxuICAgIGdldENvbmZpZ3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHJlcXVlc3RDb25maWdzO1xuICAgIH0sXG4gICAgc2V0QmFzZVVSTDogZnVuY3Rpb24gKHVybCkge1xuICAgICAgICB2YXIgZXhlID0gcmVxdWlyZSgnLi9pc28tZXhlY3V0ZS1zZXJ2ZXInKTtcbiAgICAgICAgaWYgKGV4ZS5taWRkbGV3YXJlTW91bnRlZCAmJiBleGUubWlkZGxld2FyZU1vdW50ZWQoKSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCcuc2V0QmFzZVVSTCgpIGFmdGVyIC5zZXR1cE1pZGRsZXdhcmUoKSAsIHRoaXMgbWF5IGNhdXNlIGNsaWVudCBzaWRlIGNhbGwgdG8gd3JvbmcgZW5kcG9pbnQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmVxdWVzdEJhc2VVcmwgPSB1cmw7XG4gICAgfSxcbiAgICBnZXRCYXNlVVJMOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiByZXF1ZXN0QmFzZVVybDtcbiAgICB9XG59O1xuIiwidmFyIGlzb2NvbmZpZyA9IHJlcXVpcmUoJy4vaXNvLWNvbmZpZycpO1xudmFyIGlzb3JlcSA9IHJlcXVpcmUoJy4vaXNvLXJlcXVlc3QtY29yZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBleGVjdXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBuYW1lID0gYXJndW1lbnRzWzBdO1xuICAgICAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ2lzby1leGVjdXRlLWNsaWVudCB3aXRob3V0IG5hbWUhJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc29yZXEoT2JqZWN0LmFzc2lnbih7fSwge1xuICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgICAgICAgIGJvZHk6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykuc2xpY2UoMSksXG4gICAgICAgICAgICB1cmw6IGlzb2NvbmZpZy5nZXRCYXNlVVJMKCkgKyBuYW1lLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBqc29uOiB0cnVlXG4gICAgICAgIH0pKS50aGVuKGZ1bmN0aW9uIChSKSB7XG4gICAgICAgICAgICByZXR1cm4gUi5ib2R5LnJwYztcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiIsInZhciBpc29leGUgPSByZXF1aXJlKCcuL2lzby1leGVjdXRlLWNsaWVudCcpO1xudmFyIGlzb2NmZyA9IHJlcXVpcmUoJy4vaXNvLWNvbmZpZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICByZXF1ZXN0OiBmdW5jdGlvbiAobmFtZSwgY2ZnKSB7XG4gICAgICAgIGlmICghbmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignaXNvLXJlcXVlc3QtY2xpZW50IHdpdGhvdXQgbmFtZSEnKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlcnNjb3JlLWRhbmdsZSAqL1xuICAgICAgICByZXR1cm4gaXNvZXhlLmV4ZWN1dGUoaXNvY2ZnLl9ERUZBVUxUX0lTT19SRVFVRVNUX1JQQ18sIHtuYW1lOiBuYW1lLCBjZmc6IGNmZ30pO1xuICAgIH1cbn07XG4iLCJ2YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ2Jyb3dzZXItcmVxdWVzdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcHQpIHtcbiAgICBpZiAoIW9wdCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdpc28tcmVxdWVzdC1jb3JlIHdpdGhvdXQgaW5wdXQhJykpO1xuICAgIH1cblxuICAgIGlmICghb3B0LnVybCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdpc28tcmVxdWVzdC1jb3JlIHdpdGhvdXQgdXJsLCBpbnB1dDonICsgSlNPTi5zdHJpbmdpZnkob3B0KSkpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJlcXVlc3Qob3B0LCBmdW5jdGlvbiAoZXJyb3IsIHJlc3BvbnNlLCBib2R5KSB7XG4gICAgICAgICAgICB2YXIgTyA9IHtcbiAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3IsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2U6IHJlc3BvbnNlLFxuICAgICAgICAgICAgICAgIGJvZHk6IGJvZHlcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIFByZXZlbnQgcmVzcG9uc2UuYm9keSA9PSBib2R5IGRvdWJsZSBzaXplZFxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHJlc3BvbnNlLmJvZHk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoTyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlc29sdmUoTyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbihcbiAgICByZXF1aXJlKCcuL2lzby1jb25maWcnKSxcbiAgICByZXF1aXJlKCcuL2lzby1leGVjdXRlLXNlcnZlcicpLFxuICAgIHJlcXVpcmUoJy4vaXNvLXJlcXVlc3Qtc2VydmVyJylcbik7XG4iLCIhZnVuY3Rpb24oZSl7aWYoXCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMpbW9kdWxlLmV4cG9ydHM9ZSgpO2Vsc2UgaWYoXCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kKWRlZmluZShlKTtlbHNle3ZhciBmO1widW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/Zj13aW5kb3c6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGdsb2JhbD9mPWdsb2JhbDpcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZiYmKGY9c2VsZiksZi5yb3V0ZXM9ZSgpfX0oZnVuY3Rpb24oKXt2YXIgZGVmaW5lLG1vZHVsZSxleHBvcnRzO3JldHVybiAoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSh7MTpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG5cbnZhciBsb2NhbFJvdXRlcyA9IFtdO1xuXG5cbi8qKlxuICogQ29udmVydCBwYXRoIHRvIHJvdXRlIG9iamVjdFxuICpcbiAqIEEgc3RyaW5nIG9yIFJlZ0V4cCBzaG91bGQgYmUgcGFzc2VkLFxuICogd2lsbCByZXR1cm4geyByZSwgc3JjLCBrZXlzfSBvYmpcbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmcgLyBSZWdFeHB9IHBhdGhcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuXG52YXIgUm91dGUgPSBmdW5jdGlvbihwYXRoKXtcbiAgLy91c2luZyAnbmV3JyBpcyBvcHRpb25hbFxuXG4gIHZhciBzcmMsIHJlLCBrZXlzID0gW107XG5cbiAgaWYocGF0aCBpbnN0YW5jZW9mIFJlZ0V4cCl7XG4gICAgcmUgPSBwYXRoO1xuICAgIHNyYyA9IHBhdGgudG9TdHJpbmcoKTtcbiAgfWVsc2V7XG4gICAgcmUgPSBwYXRoVG9SZWdFeHAocGF0aCwga2V5cyk7XG4gICAgc3JjID0gcGF0aDtcbiAgfVxuXG4gIHJldHVybiB7XG4gIFx0IHJlOiByZSxcbiAgXHQgc3JjOiBwYXRoLnRvU3RyaW5nKCksXG4gIFx0IGtleXM6IGtleXNcbiAgfVxufTtcblxuLyoqXG4gKiBOb3JtYWxpemUgdGhlIGdpdmVuIHBhdGggc3RyaW5nLFxuICogcmV0dXJuaW5nIGEgcmVndWxhciBleHByZXNzaW9uLlxuICpcbiAqIEFuIGVtcHR5IGFycmF5IHNob3VsZCBiZSBwYXNzZWQsXG4gKiB3aGljaCB3aWxsIGNvbnRhaW4gdGhlIHBsYWNlaG9sZGVyXG4gKiBrZXkgbmFtZXMuIEZvciBleGFtcGxlIFwiL3VzZXIvOmlkXCIgd2lsbFxuICogdGhlbiBjb250YWluIFtcImlkXCJdLlxuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gcGF0aFxuICogQHBhcmFtICB7QXJyYXl9IGtleXNcbiAqIEByZXR1cm4ge1JlZ0V4cH1cbiAqL1xudmFyIHBhdGhUb1JlZ0V4cCA9IGZ1bmN0aW9uIChwYXRoLCBrZXlzKSB7XG5cdHBhdGggPSBwYXRoXG5cdFx0LmNvbmNhdCgnLz8nKVxuXHRcdC5yZXBsYWNlKC9cXC9cXCgvZywgJyg/Oi8nKVxuXHRcdC5yZXBsYWNlKC8oXFwvKT8oXFwuKT86KFxcdyspKD86KFxcKC4qP1xcKSkpPyhcXD8pP3xcXCovZywgZnVuY3Rpb24oXywgc2xhc2gsIGZvcm1hdCwga2V5LCBjYXB0dXJlLCBvcHRpb25hbCl7XG5cdFx0XHRpZiAoXyA9PT0gXCIqXCIpe1xuXHRcdFx0XHRrZXlzLnB1c2godW5kZWZpbmVkKTtcblx0XHRcdFx0cmV0dXJuIF87XG5cdFx0XHR9XG5cblx0XHRcdGtleXMucHVzaChrZXkpO1xuXHRcdFx0c2xhc2ggPSBzbGFzaCB8fCAnJztcblx0XHRcdHJldHVybiAnJ1xuXHRcdFx0XHQrIChvcHRpb25hbCA/ICcnIDogc2xhc2gpXG5cdFx0XHRcdCsgJyg/Oidcblx0XHRcdFx0KyAob3B0aW9uYWwgPyBzbGFzaCA6ICcnKVxuXHRcdFx0XHQrIChmb3JtYXQgfHwgJycpICsgKGNhcHR1cmUgfHwgJyhbXi9dKz8pJykgKyAnKSdcblx0XHRcdFx0KyAob3B0aW9uYWwgfHwgJycpO1xuXHRcdH0pXG5cdFx0LnJlcGxhY2UoLyhbXFwvLl0pL2csICdcXFxcJDEnKVxuXHRcdC5yZXBsYWNlKC9cXCovZywgJyguKiknKTtcblx0cmV0dXJuIG5ldyBSZWdFeHAoJ14nICsgcGF0aCArICckJywgJ2knKTtcbn07XG5cbi8qKlxuICogQXR0ZW1wdCB0byBtYXRjaCB0aGUgZ2l2ZW4gcmVxdWVzdCB0b1xuICogb25lIG9mIHRoZSByb3V0ZXMuIFdoZW4gc3VjY2Vzc2Z1bFxuICogYSAge2ZuLCBwYXJhbXMsIHNwbGF0c30gb2JqIGlzIHJldHVybmVkXG4gKlxuICogQHBhcmFtICB7QXJyYXl9IHJvdXRlc1xuICogQHBhcmFtICB7U3RyaW5nfSB1cmlcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xudmFyIG1hdGNoID0gZnVuY3Rpb24gKHJvdXRlcywgdXJpLCBzdGFydEF0KSB7XG5cdHZhciBjYXB0dXJlcywgaSA9IHN0YXJ0QXQgfHwgMDtcblxuXHRmb3IgKHZhciBsZW4gPSByb3V0ZXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcblx0XHR2YXIgcm91dGUgPSByb3V0ZXNbaV0sXG5cdFx0ICAgIHJlID0gcm91dGUucmUsXG5cdFx0ICAgIGtleXMgPSByb3V0ZS5rZXlzLFxuXHRcdCAgICBzcGxhdHMgPSBbXSxcblx0XHQgICAgcGFyYW1zID0ge307XG5cblx0XHRpZiAoY2FwdHVyZXMgPSB1cmkubWF0Y2gocmUpKSB7XG5cdFx0XHRmb3IgKHZhciBqID0gMSwgbGVuID0gY2FwdHVyZXMubGVuZ3RoOyBqIDwgbGVuOyArK2opIHtcblx0XHRcdFx0dmFyIGtleSA9IGtleXNbai0xXSxcblx0XHRcdFx0XHR2YWwgPSB0eXBlb2YgY2FwdHVyZXNbal0gPT09ICdzdHJpbmcnXG5cdFx0XHRcdFx0XHQ/IHVuZXNjYXBlKGNhcHR1cmVzW2pdKVxuXHRcdFx0XHRcdFx0OiBjYXB0dXJlc1tqXTtcblx0XHRcdFx0aWYgKGtleSkge1xuXHRcdFx0XHRcdHBhcmFtc1trZXldID0gdmFsO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNwbGF0cy5wdXNoKHZhbCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHBhcmFtczogcGFyYW1zLFxuXHRcdFx0XHRzcGxhdHM6IHNwbGF0cyxcblx0XHRcdFx0cm91dGU6IHJvdXRlLnNyYyxcblx0XHRcdFx0bmV4dDogaSArIDFcblx0XHRcdH07XG5cdFx0fVxuXHR9XG59O1xuXG4vKipcbiAqIERlZmF1bHQgXCJub3JtYWxcIiByb3V0ZXIgY29uc3RydWN0b3IuXG4gKiBhY2NlcHRzIHBhdGgsIGZuIHR1cGxlcyB2aWEgYWRkUm91dGVcbiAqIHJldHVybnMge2ZuLCBwYXJhbXMsIHNwbGF0cywgcm91dGV9XG4gKiAgdmlhIG1hdGNoXG4gKlxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5cbnZhciBSb3V0ZXIgPSBmdW5jdGlvbigpe1xuICAvL3VzaW5nICduZXcnIGlzIG9wdGlvbmFsXG4gIHJldHVybiB7XG4gICAgcm91dGVzOiBbXSxcbiAgICByb3V0ZU1hcCA6IHt9LFxuICAgIGFkZFJvdXRlOiBmdW5jdGlvbihwYXRoLCBmbil7XG4gICAgICBpZiAoIXBhdGgpIHRocm93IG5ldyBFcnJvcignIHJvdXRlIHJlcXVpcmVzIGEgcGF0aCcpO1xuICAgICAgaWYgKCFmbikgdGhyb3cgbmV3IEVycm9yKCcgcm91dGUgJyArIHBhdGgudG9TdHJpbmcoKSArICcgcmVxdWlyZXMgYSBjYWxsYmFjaycpO1xuXG4gICAgICBpZiAodGhpcy5yb3V0ZU1hcFtwYXRoXSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BhdGggaXMgYWxyZWFkeSBkZWZpbmVkOiAnICsgcGF0aCk7XG4gICAgICB9XG5cbiAgICAgIHZhciByb3V0ZSA9IFJvdXRlKHBhdGgpO1xuICAgICAgcm91dGUuZm4gPSBmbjtcblxuICAgICAgdGhpcy5yb3V0ZXMucHVzaChyb3V0ZSk7XG4gICAgICB0aGlzLnJvdXRlTWFwW3BhdGhdID0gZm47XG4gICAgfSxcblxuICAgIHJlbW92ZVJvdXRlOiBmdW5jdGlvbihwYXRoKSB7XG4gICAgICBpZiAoIXBhdGgpIHRocm93IG5ldyBFcnJvcignIHJvdXRlIHJlcXVpcmVzIGEgcGF0aCcpO1xuICAgICAgaWYgKCF0aGlzLnJvdXRlTWFwW3BhdGhdKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigncGF0aCBkb2VzIG5vdCBleGlzdDogJyArIHBhdGgpO1xuICAgICAgfVxuXG4gICAgICB2YXIgbWF0Y2g7XG4gICAgICB2YXIgbmV3Um91dGVzID0gW107XG5cbiAgICAgIC8vIGNvcHkgdGhlIHJvdXRlcyBleGNsdWRpbmcgdGhlIHJvdXRlIGJlaW5nIHJlbW92ZWRcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yb3V0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHJvdXRlID0gdGhpcy5yb3V0ZXNbaV07XG4gICAgICAgIGlmIChyb3V0ZS5zcmMgIT09IHBhdGgpIHtcbiAgICAgICAgICBuZXdSb3V0ZXMucHVzaChyb3V0ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMucm91dGVzID0gbmV3Um91dGVzO1xuICAgICAgZGVsZXRlIHRoaXMucm91dGVNYXBbcGF0aF07XG4gICAgfSxcblxuICAgIG1hdGNoOiBmdW5jdGlvbihwYXRobmFtZSwgc3RhcnRBdCl7XG4gICAgICB2YXIgcm91dGUgPSBtYXRjaCh0aGlzLnJvdXRlcywgcGF0aG5hbWUsIHN0YXJ0QXQpO1xuICAgICAgaWYocm91dGUpe1xuICAgICAgICByb3V0ZS5mbiA9IHRoaXMucm91dGVNYXBbcm91dGUucm91dGVdO1xuICAgICAgICByb3V0ZS5uZXh0ID0gdGhpcy5tYXRjaC5iaW5kKHRoaXMsIHBhdGhuYW1lLCByb3V0ZS5uZXh0KVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJvdXRlO1xuICAgIH1cbiAgfVxufTtcblxuUm91dGVyLlJvdXRlID0gUm91dGVcblJvdXRlci5wYXRoVG9SZWdFeHAgPSBwYXRoVG9SZWdFeHBcblJvdXRlci5tYXRjaCA9IG1hdGNoXG4vLyBiYWNrIGNvbXBhdFxuUm91dGVyLlJvdXRlciA9IFJvdXRlclxuXG5tb2R1bGUuZXhwb3J0cyA9IFJvdXRlclxuXG59LHt9XX0se30sWzFdKVxuKDEpXG59KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc29jYWxsID0gcmVxdWlyZSgnaXNvLWNhbGwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoeXFsKSB7XG4gICAgaWYgKCF5cWwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjYWxsIHlxbCB3aXRob3V0IHlxbCBzdGF0ZW1lbnQhJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGlzb2NhbGwucmVxdWVzdCgneXFsJywge1xuICAgICAgICBxczoge1xuICAgICAgICAgICAgcTogeXFsLFxuICAgICAgICAgICAgZm9ybWF0OiAnanNvbidcbiAgICAgICAgfSxcbiAgICAgICAgcmVqZWN0VW5hdXRob3JpemVkIDogZmFsc2UsXG4gICAgICAgIGpzb246IHRydWVcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChPKSB7XG4gICAgICAgIGlmIChPLmJvZHkgJiYgTy5ib2R5LnF1ZXJ5ICYmIE8uYm9keS5xdWVyeS5oYXNPd25Qcm9wZXJ0eSgncmVzdWx0cycpKSB7XG4gICAgICAgICAgICByZXR1cm4gTy5ib2R5LnF1ZXJ5LnJlc3VsdHM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3Ioe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdubyBxdWVyeS5yZXN1bHRzIGluIHJlc3BvbnNlJyxcbiAgICAgICAgICAgICAgICByZXF1ZXN0OiBPXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaGFuZGxlX1VQREFURV9TRUFSQ0hfUkVTVUxUOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICB0aGlzLl9zZXQoJ2RhdGEnLCBkYXRhKTtcbiAgICAgICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gICAgfSxcblxuICAgIGdldFJlc3VsdDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0KCdkYXRhJyk7XG4gICAgfSxcblxuICAgIGdldFF1ZXJ5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7a2V5d29yZDogdGhpcy5fZ2V0KCdkYXRhJykua2V5d29yZH07XG4gICAgfVxufTtcbiJdfQ==
