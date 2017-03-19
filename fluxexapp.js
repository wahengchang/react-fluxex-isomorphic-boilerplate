require('babel-polyfill');

var commonStores = require('fluxex/extra/commonStores');
var page = require('./actions/page');


module.exports = require('fluxex').createApp({
    page: commonStores.page,
    search: require('./stores/search'),
    about: require('./stores/about'),
    hello: require('./stores/hello')
}, require('./components/Html.jsx'), 
    require('fluxex/extra/routing')({
        search: {
            path: '/search',
            method: 'get',
            action: page.search
        } , 
        hello: {
            path: '/hello',
            method: 'get',
            action: page.hello
        } , 
        about: {
            path: '/about',
            method: 'get',
            action: page.about
        }
    }));
