import { isMedicine } from "@/common/constants";

import {
  fetchModProductSellStatus,
  fetchModProductStock,
  fetchModProductSellTime,
  fetchModProductCategory,
  fetchModProductSkuPrice,
  fetchProductList as productList,
  fetchDownloadList,
  fetchSearchSuggestion as searchSuggestion,
  fetchDownloadProducts,
  fetchHotRecommend as hotRecommend,
  fetchViolationInfo as violationInfo,
  postReorderSpuSequence,
  updateSpuSequence as uss,
  fetchPageData as fpd
} from "../api/poiApi";

import {
  fetchMedicineList,
  postMedicineDownloadExcelRequest,
  fetchSearchMedicineSuggestion
} from "../api/medicineApi";

export const fetchModSku = (skuId, params) => {
  if ("price" in params) {
    return fetchModProductSkuPrice({
      skuId,
      ...params
    });
  }
  if ("stock" in params) {
    return fetchModProductStock({
      skuIds: skuId,
      ...params
    });
  }
  return Promise.resolve();
};

export const fetchModProduct = params => {
  if ("sellStatus" in params) {
    const { sellStatus, ...rest } = params;
    return fetchModProductSellStatus({
      ...rest,
      sellstatus: sellStatus
    });
  }
  if ("stock" in params) {
    return fetchModProductStock(params);
  }
  if ("shippingTimeX" in params) {
    return fetchModProductSellTime(params);
  }
  if ("tagIds" in params) {
    return fetchModProductCategory(params);
  }
  throw Error("fetchModProduct接口参数错误");
};

export const fetchProductList = params => {
  if (isMedicine) {
    return fetchMedicineList(params);
  } else {
    return productList(params);
  }
};

export const postDownloadExcelRequest = params => {
  if (isMedicine) {
    return postMedicineDownloadExcelRequest(params);
  } else {
    return fetchDownloadProducts(params);
  }
};

export const fetchSearchSuggestion = (poiId, keyword) => {
  if (isMedicine) {
    return fetchSearchMedicineSuggestion(poiId, keyword);
  } else {
    return searchSuggestion(poiId, keyword);
  }
};

export const fetchDownloadTaskList = (params = {}) =>
  fetchDownloadList({
    ...params,
    type: isMedicine ? 3 : 6
  });

export const fetchHotRecommend = params =>
  hotRecommend(params).then(data => +data.switchCode === 1);

export const fetchViolationInfo = params =>
  violationInfo(params).then(data => +data.data);

export const updateSpuSequence = async (poiId, tagId, spuId, sequence) => {
  try {
    await postReorderSpuSequence(poiId, tagId);
  } finally {
    await uss(poiId, tagId, spuId, sequence);
  }
};

export const fetchPageData = params =>
  fpd(params).then(data => {
    data.hasTransitionProduct = data.hasTransitionProduct === 1;
    data.associateSwitch = data.associateSwitch === 1;
    data.packetSupport = data.packetSupport === 1;
    data.uncompletedStatus = data.uncompletedStatus === 1;
    data.monitorTipStatus = data.monitorTipStatus === 1;
    return data;
  });

export {
  fetchTipList,
  fetchPoiType,
  fetchTagList,
  fetchPoiAuditInfo,
  fetchPoiRCTip,
  fetchSubmitPoiAudit,
  fetchCategoryList,
  fetchAgreementInfo,
  postAgreementConfirm,
  fetchDeleteProduct,
  fetchEvaluation,
  fetchEvaluationSubmit,
  postProductSortInfo,
  fetchProductSortInfo,
  fetchPackBagPrice,
  postPackBagPrice,
  searchPicture,
  saveProductTag,
  deleteTag,
  deleteTagAndProduct,
  changeTagLevel,
  toggleProductToTop,
  getProductListOnSorting,
  updateTagSequence,
  toggleTagToTop,
  toggleTagSortInfo
} from "../api/poiApi";
