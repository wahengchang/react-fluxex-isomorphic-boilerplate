var apis = require('./api');

// All page actions here.
// A page action will prepare all required store for a page
// and update the page title.
var pages = {
    search: function () {
        this.dispatch('UPDATE_TITLE', 'Search:' + this.getStore('page').getQuery().q);
        return this.executeAction(apis.search, this.getStore('page').getQuery());
    }, 
    hello: function () {
        return this.dispatch('UPDATE_HELLO', 'hello is dated');
    }, 
    about: function () {
        return this.dispatch('UPDATE_ABOUT', 'Peter is great.');
    }
};

module.exports = pages;
