'use strict'

class LoginCookie {
    constructor(user, expire) {
        this.username = user;
        this.date_set = new Date();
        this.date_expire = expire;
    }
}

module.exports = LoginCookie;