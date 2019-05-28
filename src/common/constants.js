import { getUrlParam } from "@utiljs/param";

export const getQueryObj = (url = window.location.href) => {
  const search = url.substring(url.lastIndexOf("?") + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
};

const getParam = key =>
  decodeURIComponent(getUrlParam(key, window.location.href));
export const getPoiId = () =>
  window.wmPoiId || getParam("wmPoiId") || undefined;
export const getRouterTagId = () => getParam("routerTagId") || undefined;
export const getIsSingle = () => getParam("from") === "single" && !!getPoiId();

export const poiId = getPoiId();

export const routerTagId = getRouterTagId();

export const isSingle = getIsSingle();
