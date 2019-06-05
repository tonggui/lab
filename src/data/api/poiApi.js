import client from "./client";

/**
 * 获取门店类型
 * 1.商超&成人用品；2.果蔬生鲜；3.其他；4.服装鞋帽；5.美妆；6.日用品；7.母婴；
 * @param poiId 门店ID
 * @returns {*}
 */
export const fetchPoiType = params =>
  client.post("retail/r/marketTagInfo", params).then(data => {
    data.showSubmitPic = !!data.showSubmitPic;
    return data;
  });

/**
 * 获取店内分类列表
 * @param poiId
 * @returns {*}
 */
export const fetchTagList = params =>
  client.post("retail/r/tagList", params).then(data => data || {});

/**
 * 获取门店信息列表
 * @param poiId
 */
export const fetchTipList = params =>
  client.post("retail/r/poiCategory/info", params).then(tips =>
    (tips || []).map((tip, index) => ({
      opreationText: tip.link ? "去查看" : "",
      closable: true,
      id: `MESSAGE_${index}`,
      ...tip
    }))
  );

/**
 * 获取门店审核状态
 * @param poiId
 */
export const fetchPoiAuditInfo = params =>
  client.post("food/r/getWmPoiAuditInfo", params).then(data => data || {});

/**
 * 获取门店是否需要风控提示
 * @param poiId
 */
export const fetchPoiRCTip = params =>
  client
    .post("food/r/hasRiskStopSellProducts", params)
    .then(data => !!data)
    .catch(() => false);

/**
 * 获取列表页的开关数据
 * @param poiId
 */
export const fetchPageData = params =>
  client.post("retail/r/listPageModel", params);

export const fetchSubmitPoiAudit = params =>
  client.get("food/w/createTask", params);

export const fetchDownloadProducts = params =>
  client.post("food/r/downloadProductByExcel", params);

export const fetchCategoryList = params =>
  client.post("retail/r/tagList", params).then(data => data || {});

export const fetchProductList = params =>
  client.post("retail/r/searchByCond", params).then(data => {
    const { productList = [], ...rest } = data || {};
    return {
      ...rest,
      productList: productList.map(({ wmProductSkus, ...others }) => ({
        ...others,
        wmProductSkus: wmProductSkus || []
      }))
    };
  });

/**
 * 获取门店的签署协议信息
 * @param poiId
 * @return {*}
 */
export const fetchAgreementInfo = params =>
  client
    .post("retail/r/getProductAgreementConfirmation", params)
    .then(
      ({
        agreementUrl,
        signed,
        supermarketChain,
        signRequired,
        ...others
      }) => ({
        ...others,
        url: agreementUrl,
        signed,
        isMultiple: supermarketChain,
        required: signRequired
      })
    );

/**
 * 提交门店签署协议确认
 * @param poiId
 * @return {*}
 */
export const postAgreementConfirm = params =>
  client.post("retail/w/submitAgreement", params);

/**
 * 列表查询推荐
 */
export const fetchSearchSuggestion = (poiId, keyword) =>
  client
    .post("retail/r/searchSug", {
      wm_poi_id: poiId,
      keyword
    })
    .then(data => (data || {}).list || []);

// 删除商品
export const fetchDeleteProduct = params =>
  client.post("food/w/batchDelete", params);

export const fetchModProductSellStatus = params =>
  client.post("retail/w/batchSetSellStatus", params);

export const fetchModProductStock = params =>
  client.post("retail/w/batchUpdateSkuStock", params);

export const fetchModProductSellTime = params =>
  client.post("food/w/batchUpdateSkuShippingTimeX", params);

export const fetchModProductCategory = params =>
  client.post("retail/w/batchUpdateMultiTag", params);

export const fetchModProductSkuPrice = params =>
  client.post("retail/w/updatePrice", params);

export const fetchEvaluation = params =>
  client.get("feedback/r/getFeedbackRecord", params);

export const fetchEvaluationSubmit = params =>
  client.post("feedback/w/likePage", params);

export const fetchHotRecommend = params =>
  client.post("retail/r/getScPoiHotSalesSwitch", params);

export const fetchViolationInfo = params =>
  client.post("inspection/r/haveProducts", params);

export const fetchDownloadList = params => client.post("task/r/list", params);

/**
 * 排序商品
 */
export const updateSpuSequence = (poiId, tagId, spuId, sequence) =>
  client.post("food/w/updateSpuSequence", {
    wmPoiId: poiId,
    tagId,
    spuId,
    sequence
  });

/**
 * 更新商品的排序状态
 */
export const postProductSortInfo = (poiId, tagId, smart, topCount) =>
  client.post("retail/w/skuSortRule", {
    wmPoiId: poiId,
    tagId: tagId || -1,
    sortType: smart ? 2 : 1,
    topCount
  });

/**
 * 重新刷新列表排序字段
 * TODO 推动后端调整，前端不需感知的接口流程
 */
export const postReorderSpuSequence = (poiId, tagId) =>
  client.post("food/w/reorderSpuSequence", {
    wmPoiId: poiId,
    tagId: tagId || -1
  });

/**
 * 拉取商品的排序状态
 */
export const fetchProductSortInfo = (poiId, tagId) => {
  tagId = tagId || -1;
  return client
    .post("retail/r/skuSortRule", {
      wmPoiId: poiId,
      tagId
    })
    .then(({ sortType, topCount, ...rest }) => ({
      ...rest,
      tagId,
      smart: sortType === 2,
      top: topCount
    }));
};

/**
 * 商品置顶/取消
 * @params:
 * type: 操作类型，1-置顶；2-取消；
 * tagId: 分类id；
 * spuId；
 */
export const toggleProductToTop = (type, tagId, spuId, seq) =>
  client.post("retail/w/spuToTop", {
    type,
    tagId,
    spuId,
    seq
  });

// 排序状态下根据分类查询商品
export const getProductListOnSorting = params =>
  client.post("retail/r/searchByTag", params);

/**
 * 排序店内分类
 * @param tagIds: 要更新为的顺序的tagId的拼接字符串
 */
export const updateTagSequence = tagIds =>
  client.post("food/w/batchUpdateTagSequence", {
    tagIds
  });

/**
 *  店内分类置顶／取消
 * @param type: 1-置顶；2-取消；
 * @param tagId：分类id；
 */
export const toggleTagToTop = (type, tagId, seq) =>
  client.post("retail/w/tag/toTop", {
    type,
    tagId,
    seq
  });

/**
 * 保存店内分类智能排序开关
 * @param type: 1-打开；2-关闭；
 */
export const toggleTagSortInfo = type =>
  client.post("retail/w/tag/smartSortSwitch", {
    type
  });

// 获取打包袋价格信息
const NONE_LABEL = {
  label: "无",
  value: -1
};
export const fetchPackBagPrice = poiId =>
  client
    .post("packageprice/r/get", {
      wmPoiId: poiId
    })
    .then(({ packagePayType, packagePrice, packagePriceRange, ...others }) => ({
      ...others,
      packagePriceRange: [NONE_LABEL].concat(...packagePriceRange),
      packagePrice: packagePayType === 0 ? NONE_LABEL.value : packagePrice
    }));

// 设置打包袋价格信息
export const postPackBagPrice = (poiId, price) =>
  client.post("packageprice/w/update", {
    wmPoiId: poiId,
    packetPayType: price === NONE_LABEL.value ? 0 : 1,
    packetPrice: price === NONE_LABEL.value ? 0 : price
  });

// 查询图片
export const searchPicture = (keyWord, pageNum = 1, pageSize) =>
  client
    .get("food/r/selectPicture", {
      keyWord,
      pageNum,
      pageSize
    })
    .then(data => data.pps);

/**
 * 新建、修改一级分类、二级分类
 * wmPoiId: 门店id,
 * tagInfo: {
 *  id: "", // 修改一级、二级分类时，传一级、二级分类id；
 *  name: "分类名称",
 *  sequence: 0,
 *  description: "",
 *  level: 1, // 1-新建、修改一级分类；2-二级分类；
 *  parentId: 0, // 0-新建、修改一级分类时传0，修改二级分类时也传0；新建二级分类时传对应一级分类id；
 *  top_flag: 1, // 1-限时置顶；0-不限时置顶；null-新建二级分类；
 *  time_zone: "{}" // JSON字符串，top_flag为0或null时传空对象字符串，内部结构如下：
 * }
 * time_zone: {
 *  "2": [{ // 周二
 *    "start": "12:45",
 *    "end": "12:46"
 *  }, {
 *    "start": "12:47",
 *    "end": "12:48"
 *  }],
 *  "3": [{
 *    "start": "12:45",
 *    "end": "12:46"
 *  }, {
 *    "start": "12:47",
 *    "end": "12:48"
 *  }]
 * }
 */
export const saveProductTag = tagInfo =>
  client.post("food/w/saveWmProductTag", {
    tagInfo
  });

/**
 * 删除一级、二级分类
 * wmPoiId: 门店id,
 * tagId: 要删除的一级分类id，或要删除的二级分类id,
 */
export const deleteTag = tagId =>
  client.post("food/w/deleteTag", {
    tagId
  });

/**
 * 删除分类
 * @param: type: 操作类型：1-删除分类中的商品及二级分类；2-仅删除分类；
 * @param: tagId: 分类id；
 */
export const deleteTagAndProduct = (type, tagId) =>
  client.post("retail/w/tag/delete", {
    type,
    tagId
  });

/**
 * 一级分类调整为二级，二级分类调整为一级
 * wmPoiId: 门店id,
 * tagId: 当前要操作的一级分类id, 或要操作的二级分类id,
 * parentId: 要调整为其二级的一级分类id, 或调整为一级分类时传0,
 */
export const changeTagLevel = (tagId, parentId) =>
  client.post("food/w/changeTagLevel", {
    tagId,
    parentId
  });
