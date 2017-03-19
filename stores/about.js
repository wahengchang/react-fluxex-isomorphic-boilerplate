'use strict';

module.exports = {
    handle_UPDATE_ABOUT: function (data) {
        this._set('about', data);
        this.emitChange();
    },

    get: function () {
        return this._get('about');
    }
};
