/**
 * Created by pieter on 5/08/15.
 */

    /**
    Class that supports configuration settings in local storage: reading & writing
    class.read(key) = value
    class.write(key, value) = bool
     */
var ConfigSettings = function() {
    this.keys = ['url'];
    /*
    Internal object: {for key in keys: value}
     */
    this.settings = this.parseLocalStorage();
};

/**
Parse cityquest.settings in LocalStorage into an object. If empty, return the empty object.
 @return object
 */
ConfigSettings.prototype.parseLocalStorage = function() {
    var settings = {};
    var i = 0;
    if (localStorage.getItem('cityquest.settings') === null) {
        /* Nothing set */
        for (i = 0; i < this.keys.length; i++) {
            settings[this.keys[i]] = null
        }
        return settings;
    }
    var stored_settings = JSON.parse(localStorage.getItem('cityquest.settings'));
    for (i = 0; i < this.keys.length; i++) {
        if (typeof(stored_settings[this.keys[i]]) != 'undefined') {
            settings[this.keys[i]] = stored_settings[this.keys[i]];
        } else {
            settings[this.keys[i]] = null;
        }
    }
    return settings;
};

/**
Write this.settings to localstorage
 @return bool
 */
ConfigSettings.prototype.flushToLocalStorage = function() {
    var settings = JSON.stringify(this.settings);
    localStorage.setItem('cityquest.settings', settings);
    return true;
};

/**
Read a key from this.settings
 @param key
 @return string
 */
ConfigSettings.prototype.read = function(key) {
    if (typeof(this.settings[key]) != 'undefined') {
        return this.settings[key];
    } else {
        return null;
    }
};

/**
Write a key to this.settings. Check whether key is in this.keys; else error. Call this.flushToLocalStorage to make
changes permanent.
 @param key
 @param value
 @return bool
 */
ConfigSettings.prototype.write = function(key, value) {
    if (this.keys.indexOf(key) == -1) {
        throw "Error: attempt to write illegal key to cityquest.settings in localstorage!";
    }
    this.settings[key] = value;
    return this.flushToLocalStorage();
};