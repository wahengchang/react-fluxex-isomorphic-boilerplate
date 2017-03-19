'use strict';

module.exports = {
    handle_UPDATE_HELLO: function (data) {
        this._set('hello', data);
        this.emitChange();
    },

    get: function () {
        return this._get('hello');
    }
};
