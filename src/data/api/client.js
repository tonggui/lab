import Axios from "axios";
import { isPlainObject, pick } from "lodash";
// import { ENV } from '@sgfe/eproduct/env';
// import apiLogInterceptor from '@/common/apiLogInterceptor';
// import { poiId } from '@/common/constants';
import { stringify, parse } from "qs";
const isLocal = process.env.NODE_ENV === "development";
const baseUrl = isLocal ? "/api/reuse/sc/product/" : "/reuse/sc/product/";

const axiosInstance = Axios.create({
  baseURL: baseUrl,
  timeout: 20000,
  withCredentials: true,
  validateStatus: status => status >= 200 && status <= 299
});

// axiosInstance.interceptors.response.use(
//   apiLogInterceptor,
//   (error) => {
//     if (error.response) apiLogInterceptor(error.response);
//     return Promise.reject(error);
//   },
// );

const transform = (params, type) => {
  type = type || "urlencoded";
  if (type === "urlencoded") {
    return stringify(params);
  }
  if (type === "form") {
    return Object.entries(params).reduce((form, [key, value]) => {
      form.append(key, value);
      return form;
    }, new FormData());
  } else return params;
};

const combineArguments = (method, params = {}, options = {}) => {
  // 纯数据节点需要做空值过滤，避免后端接口无法处理的问题
  if (isPlainObject(params)) {
    params = Object.entries(params)
      .filter(arr => arr[1] !== undefined && arr[1] !== null)
      .reduce((map, arr) => {
        map[arr[0]] = arr[1];
        return map;
      }, {});
  }
  if (["GET", "HEAD", "DELETE", "JSONP"].indexOf(method.toUpperCase()) > -1) {
    return [
      {
        params,
        ...options
      }
    ];
  } else {
    return [transform(params, options.type), options];
  }
};

// 请求函数
const request = (method = "post", url = "", params = {}, options = {}) =>
  new Promise((resolve, reject) => {
    const searchParams = parse(window.location.search, {
      ignoreQueryPrefix: true
    });
    const baseParams = pick(searchParams, "wmPoiId");
    const args = combineArguments(
      method,
      { ...baseParams, ...params },
      options
    );
    axiosInstance[method](url, ...args).then(
      response => {
        const { data = {} } = response;
        const { code, msg } = data;
        if (code === 0) {
          return resolve(data.data);
        }
        if (code !== undefined) {
          /* eslint-disable-next-line */
      return reject({
            code,
            message: msg
          });
        }
        return resolve(data);
  }, () => reject({ code: 'unknown', message: '网络错误，请重试！' })); // eslint-disable-line
  });

const apiClient = Object.create(null);

["get", "post", "put", "patch", "delete", "head", "jsonp"].forEach(method => {
  apiClient[method] = function(...rest) {
    console.log(...[].concat(method, rest));
    return request(method, ...rest);
  };
});

export default apiClient;
