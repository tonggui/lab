import {
  searchCategory as sCate,
  searchBrand as sBrand
} from "../api/commonApi";

export {
  fetchCities,
  uploadImageFile,
  uploadPicContent
} from "../api/commonApi";

export const searchCategory = search =>
  sCate(search).then(data => {
    // 只保留叶子节点
    const result = data.leafCategoryList || [].filter(v => v.isLeaf === 1);
    return result.map(v => ({
      id: v.categoryId,
      name: v.categoryName,
      idPath: v.idPath
        ? v.idPath
            .split(",")
            .map(id => +id)
            .filter(id => !!id)
        : [],
      namePath: v.categoryNamePath ? v.categoryNamePath.split(",") : [],
      level: v.level
    }));
  });

export const searchBrand = search =>
  sBrand(search).then(data => {
    // 只保留叶子节点
    const result = data.list || [];
    return result.filter(v => !!v.brandId);
  });
