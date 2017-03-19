var React = require('react');
var Fluxex = require('fluxex');

var page = React.createClass({
    mixins: [
        Fluxex.mixin,
        require('fluxex/extra/storechange'),
        {
            listenStores: [
                'about'
            ]
        }
    ],

    getStateFromStores: function () {
        return {
            about: this.getStore('about').get(),
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
                <div>{'about !!  ' + this.state.about}</div>
                <hr/>
            </div>
         </body>
        </html> 
        );
    }
});

module.exports = page;
