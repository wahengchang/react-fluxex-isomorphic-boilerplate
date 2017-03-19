var React = require('react');
var Fluxex = require('fluxex');
// var Results = require('./Results.jsx');
// var SearchBox = require('./SearchBox.jsx');

var About = require('./About.jsx');
var Hello = require('./Hello.jsx');

var Html = React.createClass({
    mixins: [
        Fluxex.mixin,
        require('fluxex/extra/pjax'),
        require('fluxex/extra/storechange'),
        require('fluxex/extra/routing').mixin,
        {
            listenStores: [
                'page'
            ]
        }
    ],
    getStateFromStores: function () {
        return {
            // Used to determine routing
            routing: this.getStore('page')._get('routing')
        };
    },
    getInitialState: function () {
        return {};
    },

    getPage: function () {
        switch (this.state.routing.name) {
        case 'hello':
            return Hello;
        case 'about':
            return About;
        default:
            return Hello;
        }
    },
    render: function () {
        console.log('this.state.routing: ', this.state.routing);
        var Page = this.getPage();
        return <Page/>;
    }
});

module.exports = Html;
