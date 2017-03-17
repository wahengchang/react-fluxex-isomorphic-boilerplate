(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Fluxex = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/peterchang/Desktop/node/test/fluxex-boilerplate 2/components/Html.jsx":[function(require,module,exports){
'use strict';

var React = require('react');
var Fluxex = require('fluxex');
var Html = React.createClass({
    displayName: 'Html',

    mixins: [Fluxex.mixin, require('fluxex/extra/storechange'), { listenStores: ['product'] }],

    getStateFromStores: function getStateFromStores() {
        return this.getStore('product').getData();
    },

    handleClick: function handleClick() {
        var product = this.state;
        product.sold++;
        this.executeAction(function () {
            return this.dispatch('UPDATE_PRODUCT', product);
        });
    },

    render: function render() {
        return React.createElement(
            'html',
            null,
            React.createElement(
                'head',
                null,
                React.createElement('meta', { charSet: 'utf-8' })
            ),
            React.createElement(
                'body',
                { onClick: this.handleClick },
                React.createElement(
                    'ul',
                    null,
                    React.createElement(
                        'li',
                        null,
                        'Product: ',
                        this.state.title
                    ),
                    React.createElement(
                        'li',
                        null,
                        'Price: ',
                        this.state.price
                    ),
                    React.createElement(
                        'li',
                        null,
                        'Sold: ',
                        this.state.sold
                    )
                ),
                React.createElement(Fluxex.InitScript, null)
            )
        );
    }
});

module.exports = Html;

},{"fluxex":"fluxex","fluxex/extra/storechange":"/Users/peterchang/Desktop/node/test/fluxex-boilerplate 2/node_modules/fluxex/extra/storechange.js","react":"react"}],"/Users/peterchang/Desktop/node/test/fluxex-boilerplate 2/fluxexapp.js":[function(require,module,exports){
'use strict';

require('babel-polyfill');

module.exports = require('fluxex').createApp({
    product: require('./stores/product')
}, require('./components/Html.jsx'));

},{"./components/Html.jsx":"/Users/peterchang/Desktop/node/test/fluxex-boilerplate 2/components/Html.jsx","./stores/product":"/Users/peterchang/Desktop/node/test/fluxex-boilerplate 2/stores/product.js","babel-polyfill":"babel-polyfill","fluxex":"fluxex"}],"/Users/peterchang/Desktop/node/test/fluxex-boilerplate 2/node_modules/fluxex/extra/storechange.js":[function(require,module,exports){
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

},{}],"/Users/peterchang/Desktop/node/test/fluxex-boilerplate 2/stores/product.js":[function(require,module,exports){
'use strict';

module.exports = {
    handle_UPDATE_PRODUCT: function handle_UPDATE_PRODUCT(payload) {
        this._set('data', payload);
        this.emitChange();
    },

    getData: function getData() {
        return this._get('data');
    }
};

},{}]},{},["/Users/peterchang/Desktop/node/test/fluxex-boilerplate 2/fluxexapp.js"])("/Users/peterchang/Desktop/node/test/fluxex-boilerplate 2/fluxexapp.js")
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb21wb25lbnRzL0h0bWwuanN4IiwiZmx1eGV4YXBwLmpzIiwibm9kZV9tb2R1bGVzL2ZsdXhleC9leHRyYS9zdG9yZWNoYW5nZS5qcyIsInN0b3Jlcy9wcm9kdWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFJLFFBQVEsUUFBUSxPQUFSLENBQVo7QUFDQSxJQUFJLFNBQVMsUUFBUSxRQUFSLENBQWI7QUFDQSxJQUFJLE9BQU8sTUFBTSxXQUFOLENBQWtCO0FBQUE7O0FBQ3pCLFlBQVEsQ0FDSixPQUFPLEtBREgsRUFFSixRQUFRLDBCQUFSLENBRkksRUFHSixFQUFDLGNBQWMsQ0FBQyxTQUFELENBQWYsRUFISSxDQURpQjs7QUFPekIsd0JBQW9CLDhCQUFZO0FBQzVCLGVBQU8sS0FBSyxRQUFMLENBQWMsU0FBZCxFQUF5QixPQUF6QixFQUFQO0FBQ0gsS0FUd0I7O0FBV3pCLGlCQUFhLHVCQUFZO0FBQ3JCLFlBQUksVUFBVSxLQUFLLEtBQW5CO0FBQ0EsZ0JBQVEsSUFBUjtBQUNBLGFBQUssYUFBTCxDQUFtQixZQUFZO0FBQzNCLG1CQUFPLEtBQUssUUFBTCxDQUFjLGdCQUFkLEVBQWdDLE9BQWhDLENBQVA7QUFDSCxTQUZEO0FBR0gsS0FqQndCOztBQW1CekIsWUFBUSxrQkFBWTtBQUNoQixlQUNBO0FBQUE7QUFBQTtBQUNDO0FBQUE7QUFBQTtBQUNDLDhDQUFNLFNBQVEsT0FBZDtBQURELGFBREQ7QUFJQztBQUFBO0FBQUEsa0JBQU0sU0FBUyxLQUFLLFdBQXBCO0FBQ0M7QUFBQTtBQUFBO0FBQ0M7QUFBQTtBQUFBO0FBQUE7QUFBYyw2QkFBSyxLQUFMLENBQVc7QUFBekIscUJBREQ7QUFFQztBQUFBO0FBQUE7QUFBQTtBQUFZLDZCQUFLLEtBQUwsQ0FBVztBQUF2QixxQkFGRDtBQUdDO0FBQUE7QUFBQTtBQUFBO0FBQVcsNkJBQUssS0FBTCxDQUFXO0FBQXRCO0FBSEQsaUJBREQ7QUFNQSxvQ0FBQyxNQUFELENBQVEsVUFBUjtBQU5BO0FBSkQsU0FEQTtBQWVIO0FBbkN3QixDQUFsQixDQUFYOztBQXNDQSxPQUFPLE9BQVAsR0FBaUIsSUFBakI7Ozs7O0FDeENBLFFBQVEsZ0JBQVI7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFFBQVEsUUFBUixFQUFrQixTQUFsQixDQUE0QjtBQUN6QyxhQUFTLFFBQVEsa0JBQVI7QUFEZ0MsQ0FBNUIsRUFFZCxRQUFRLHVCQUFSLENBRmMsQ0FBakI7OztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7O0FBRUEsT0FBTyxPQUFQLEdBQWlCO0FBQ2IsMkJBQXVCLCtCQUFVLE9BQVYsRUFBbUI7QUFDdEMsYUFBSyxJQUFMLENBQVUsTUFBVixFQUFrQixPQUFsQjtBQUNBLGFBQUssVUFBTDtBQUNILEtBSlk7O0FBTWIsYUFBUyxtQkFBWTtBQUNqQixlQUFPLEtBQUssSUFBTCxDQUFVLE1BQVYsQ0FBUDtBQUNIO0FBUlksQ0FBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBGbHV4ZXggPSByZXF1aXJlKCdmbHV4ZXgnKTtcbnZhciBIdG1sID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIG1peGluczogW1xuICAgICAgICBGbHV4ZXgubWl4aW4sXG4gICAgICAgIHJlcXVpcmUoJ2ZsdXhleC9leHRyYS9zdG9yZWNoYW5nZScpLFxuICAgICAgICB7bGlzdGVuU3RvcmVzOiBbJ3Byb2R1Y3QnXX1cbiAgICBdLFxuXG4gICAgZ2V0U3RhdGVGcm9tU3RvcmVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFN0b3JlKCdwcm9kdWN0JykuZ2V0RGF0YSgpO1xuICAgIH0sXG5cbiAgICBoYW5kbGVDbGljazogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcHJvZHVjdCA9IHRoaXMuc3RhdGU7XG4gICAgICAgIHByb2R1Y3Quc29sZCsrO1xuICAgICAgICB0aGlzLmV4ZWN1dGVBY3Rpb24oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2goJ1VQREFURV9QUk9EVUNUJywgcHJvZHVjdCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgPGh0bWw+XG4gICAgICAgICA8aGVhZD5cbiAgICAgICAgICA8bWV0YSBjaGFyU2V0PVwidXRmLThcIiAvPlxuICAgICAgICAgPC9oZWFkPlxuICAgICAgICAgPGJvZHkgb25DbGljaz17dGhpcy5oYW5kbGVDbGlja30+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICA8bGk+UHJvZHVjdDoge3RoaXMuc3RhdGUudGl0bGV9PC9saT5cbiAgICAgICAgICAgPGxpPlByaWNlOiB7dGhpcy5zdGF0ZS5wcmljZX08L2xpPlxuICAgICAgICAgICA8bGk+U29sZDoge3RoaXMuc3RhdGUuc29sZH08L2xpPlxuICAgICAgICAgIDwvdWw+XG4gICAgICAgICA8Rmx1eGV4LkluaXRTY3JpcHQgLz5cbiAgICAgICAgIDwvYm9keT5cbiAgICAgICAgPC9odG1sPlxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEh0bWw7IiwicmVxdWlyZSgnYmFiZWwtcG9seWZpbGwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCdmbHV4ZXgnKS5jcmVhdGVBcHAoe1xuICAgIHByb2R1Y3Q6IHJlcXVpcmUoJy4vc3RvcmVzL3Byb2R1Y3QnKVxufSwgcmVxdWlyZSgnLi9jb21wb25lbnRzL0h0bWwuanN4JykpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5nZXRTdGF0ZUZyb21TdG9yZXMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignWW91IHNob3VsZCBwcm92aWRlIGdldFN0YXRlRnJvbVN0b3JlcyBtZXRob2QgZm9yIHRoaXMgY29tcG9uZW50IHdoZW4gdXNpbmcgc3RvcmVjaGFuZ2UgbWl4aW4hJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGb3IgLmdldEluaXRpYWxTdGF0ZSgpOiBtdXN0IHJldHVybiBhbiBvYmplY3Qgb3IgbnVsbFxuICAgICAgICByZXR1cm4gdGhpcy5nZXRTdGF0ZUZyb21TdG9yZXMoKSB8fCB7fTtcbiAgICB9LFxuICAgIG9uU3RvcmVDaGFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldFN0YXRlRnJvbVN0b3JlcygpKTtcbiAgICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBoYW5kbGVfVVBEQVRFX1BST0RVQ1Q6IGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgICAgIHRoaXMuX3NldCgnZGF0YScsIHBheWxvYWQpO1xuICAgICAgICB0aGlzLmVtaXRDaGFuZ2UoKTtcbiAgICB9LFxuXG4gICAgZ2V0RGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0KCdkYXRhJyk7XG4gICAgfVxufTtcbiJdfQ==
