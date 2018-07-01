"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.local = exports.jsonp = exports.get = exports.post = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.all = all;
exports.init = init;

var _qs = require("qs");

var _qs2 = _interopRequireDefault(_qs);

var _fetchJsonp = require("fetch-jsonp");

var _fetchJsonp2 = _interopRequireDefault(_fetchJsonp);

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _curry = require("curry");

var _curry2 = _interopRequireDefault(_curry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = void 0;
var baseURL = ''; //给jsonp用的

function _get(url, arg) {
    request = request ? request : _axios2.default;
    return request({
        method: 'get',
        url: url + (arg ? '?' + _qs2.default.stringify(arg) : '')
    });
}

function _post(url, arg) {
    request = request ? request : _axios2.default;
    return request({
        method: 'post',
        url: url,
        data: arg
    });
}

function _jsonp(url, arg) {
    url = baseURL + url;
    return (0, _fetchJsonp2.default)(url + (arg ? '?' + _qs2.default.stringify(arg) : ''));
}

function _local(res) {
    return new Promise(function (resolve) {
        resolve({
            data: {
                data: res
            }
        });
    });
}

function _wrapRes(p) {
    return new Promise(function (resolve) {
        p.then(function (res) {
            return res.data;
        }).then(function (data) {
            resolve(data.data);
        }).catch(function (e) {
            console.error(e);
        });
    });
}

function _genRequest(method, urls) {
    var _obj = {};

    var _loop = function _loop(item) {
        _obj[item] = function (arg) {
            return _wrapRes(method(urls[item], arg));
        };
    };

    for (var item in urls) {
        _loop(item);
    }
    return _obj;
}
var _c_genRequest = (0, _curry2.default)(_genRequest);
var post = exports.post = _c_genRequest(_post);
var get = exports.get = _c_genRequest(_get);
var jsonp = exports.jsonp = _c_genRequest(_jsonp);
var local = exports.local = _c_genRequest(_local);

//compose
function all(getUrls, postUrls, fetchJsonpUrls) {
    var _obj = _extends({}, get(getUrls), post(postUrls), jsonp(fetchJsonpUrls));
    return _obj;
}

function init(axiosArg) {
    baseURL = axiosArg && axiosArg.baseURL;
    request = _axios2.default.create(axiosArg);
}

