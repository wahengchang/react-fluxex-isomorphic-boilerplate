var apis = require('./api');

// All page actions here.
// A page action will prepare all required store for a page
// and update the page title.
var pages = {
    hello: function () {
        return this.dispatch('UPDATE_HELLO', 'hello is dated');
    }, 
    about: function () {
        return this.dispatch('UPDATE_ABOUT', 'Peter is great.');
    }
};

module.exports = pages;
