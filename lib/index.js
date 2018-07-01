import qs from "qs"
import fetchJsonp from "fetch-jsonp"
import axios from "axios"
import curry from 'curry'
let request;
let baseURL = ''; //给jsonp用的

function _get(url, arg) {
    request = request ? request : axios;
    return request({
        method: 'get',
        url: url + (arg ? ('?' + qs.stringify(arg)) : ''),
    })
}

function _post(url, arg) {
    request = request ? request : axios;
    return request({
        method: 'post',
        url: url,
        data: arg,
    })
}

function _jsonp(url, arg) {
    url = baseURL + url;
    return fetchJsonp(url + (arg ? ('?' + qs.stringify(arg)) : ''))
}

function _local(res) {
    return new Promise((resolve) => {
        resolve({
            data: {
                data: res
            }
        })
    });
}

function _wrapRes(p) {
    return new Promise((resolve) => {
        p.then((res) => {
                return res.data
            })
            .then((data) => {
                resolve(data.data)
            })
            .catch(e => {
                console.error(e)
            })
    })
}

function _genRequest(method, urls) {
    let _obj = {};
    for (let item in urls) {
        _obj[item] = function (arg) {
            return _wrapRes(method(urls[item], arg));
        }
    }
    return _obj
}
const _c_genRequest = curry(_genRequest);
export const post = _c_genRequest(_post)
export const get = _c_genRequest(_get)
export const jsonp = _c_genRequest(_jsonp)
export const local = _c_genRequest(_local)

//compose
export function all(getUrls, postUrls, fetchJsonpUrls) {
    const _obj = {
        ...get(getUrls),
        ...post(postUrls),
        ...jsonp(fetchJsonpUrls)
    }
    return _obj;
}

export function init(axiosArg) {
    baseURL = axiosArg && axiosArg.baseURL
    request = axios.create(axiosArg)
}