/*
 * @description
 *   Please write the tagApi script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-05-27)
 */
import apiClient from "./client";

export const fetchTagList = params =>
  apiClient.post("retail/r/tagList", params).then(data => data || {});
