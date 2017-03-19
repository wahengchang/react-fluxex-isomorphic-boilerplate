var React = require('react');
var Fluxex = require('fluxex');

var page = React.createClass({
    mixins: [
        Fluxex.mixin,
        require('fluxex/extra/storechange'),
        require('fluxex/extra/routing').mixin,
        {
            listenStores: [
                'hello'
            ]
        }
    ],

    getStateFromStores: function () {
        return {
            hello: this.getStore('hello').get(),
        };
    },

    render: function () {
        return (
        <html>
         <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, user-scalable=no" />
          <Fluxex.Title />
         </head>
         <body>
            <div>
                <div>{'Hello !!  ' + this.state.hello}</div>
                <hr/>
            </div>
         </body>
        </html> 
        );
    }
});

module.exports = page;
