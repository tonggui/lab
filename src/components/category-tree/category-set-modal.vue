<template>
  <Modal
    :value="visible"
    :title="title"
    :width="620"
    class="cate-modal"
    :class="{ 'no-padding-top': showNewSecondMsg }"
    @on-cancel="handleCancel"
    @on-ok="onConfirm"
  >
    <Alert
      v-show="showNewSecondMsg"
      message="该分类中的商品将默认转移至二级分类"
      type="warning"
      showIcon
    />
    <div class="form-item" v-if="itemNewType">
      <span
        class="form-item-label label-no-pad-top"
        :class="{ 'large-label': itemParentTag }"
      >
        分类级别：
      </span>
      <RadioGroup v-model="newType" @change="handleChangeType">
        <Radio :label="1">新建一级分类</Radio>
        <Radio :label="2">新建二级分类</Radio>
      </RadioGroup>
    </div>
    <div class="form-item" v-if="itemParentTag">
      <span
        class="form-item-label"
        :class="{
          'label-no-pad-top': type === 'NEW_SECOND',
          'large-label': itemParentTag
        }"
      >
        归属的一级分类：
      </span>
      <div class="form-item-control-wrapper">
        <span v-if="type === 'NEW_SECOND'">{{ parentName }}</span>
        <Select
          v-else
          :value="parentId"
          @change="handleSelectionChange"
          style="width: 200px;"
        >
          <Option
            v-for="(item, index) in listSource"
            :key="index"
            :value="item.id || ''"
            :disabled="item.productCount !== 0 && !item.subTags.length"
            >{{ name }}</Option
          >
        </Select>
      </div>
    </div>
    <template v-if="itemCateName">
      <div class="form-item">
        <span class="form-item-label" :class="{ 'large-label': itemParentTag }">
          分类名称：
        </span>
        <div class="form-item-control-wrapper">
          <Input
            v-model="catename"
            @change="handleInputChange"
            placeholder="四个字以内展示最佳"
            :maxLength="8"
            style="width: 200px;"
          />
        </div>
      </div>
      <div class="form-item" v-if="isMedicine">
        <span class="form-item-label" :class="{ 'large-label': itemParentTag }">
          分类Code：
        </span>
        <div class="form-item-control-wrapper">
          <Input
            v-model="appTagCode"
            @change="handleCodeChange"
            placeholder=""
            style="width: 200px;"
          />
        </div>
      </div>
    </template>
    <div v-if="!isMedicine && itemSellTime" class="form-item">
      <span class="form-item-label" :class="{ 'large-label': itemParentTag }">
        限时置顶：
      </span>
      <div class="form-item-control-wrapper">
        <span class="sell-time-tip">
          根据该品类的热销时段进行设置，有利于提高单量，促进转化
        </span>
        <br />
        <RadioGroup v-model="topFlag" @change="handleSwitchPeriod">
          <Radio :label="0">关</Radio>
          <Radio :label="1">开</Radio>
        </RadioGroup>
        <PeriodWeekTime
          v-if="topFlag === 1"
          :value="days"
          :labels="SELL_TIME_WEEKS"
          style="margin-top: 10px"
          @change="handleTimeZoneChange"
        />
      </div>
    </div>
    <RadioGroup
      v-if="itemDelete"
      :value="delType"
      @change="handleSwitchDelType"
    >
      <Radio
        style="display: block; height: 30px; line-height: 30px;"
        :value="1"
      >
        {{
          setLevel === 0
            ? "同时删除分类中的商品及二级分类"
            : "同时删除分类中的商品"
        }}
      </Radio>
      <br />
      <Radio
        style="display: block; height: 30px; line-height: 30px;"
        :value="2"
      >
        仅删除分类(商品将全部被移入“未分类”中(不含多分类商品))
      </Radio>
    </RadioGroup>
  </Modal>
</template>
<script>
import PeriodWeekTime from "@components/period-week-time";
import isPlainObject from "lodash/isPlainObject";
import { validate } from "@sgfe/product-validate";
import {
  validateTimezones,
  convertTimezoneToCompareMode
} from "@/components/sell-time/utils";
import { MODAL_TITLE } from "./constants";
import { isMedicine } from "@/common/constants";
const SELL_TIME_WEEKS = [
  "周一",
  "周二",
  "周三",
  "周四",
  "周五",
  "周六",
  "周日"
];

const validateDuplicatedName = (catename, list = []) => {
  let code = 0;
  list.every(l => {
    const subTags = l.subTags || [];
    if (l.name === catename) {
      code = 1;
      return false;
    } else if (subTags.length) {
      subTags.every(s => {
        if (s.name === catename) {
          code = 1;
          return false;
        }
        return true;
      });
    }
    return true;
  });
  return code;
};

const convertTimezoneToSubmitMode = (isOpen, days) => {
  if (!isOpen) return { top_flag: 0 };
  const timezones = {};
  days.forEach(d => {
    if (d.timezone.length) {
      timezones[d.day + 1] = [];
      d.timezone.forEach(zone => {
        const arr = zone.split("-");
        timezones[d.day + 1].push({
          start: arr[0],
          end: arr[1]
        });
      });
    }
  });
  return { top_flag: 1, time_zone: JSON.stringify(timezones) };
};

const convertTimezoneToDays = (timeZone = "") => {
  const arr = [];
  if (timeZone) {
    const tz = JSON.parse(timeZone);
    const keysOfTimeZone = Object.keys(tz);

    for (let i = 0; i < 7; i++) {
      const obj = { day: i, timezone: [] };
      if (keysOfTimeZone.includes(String(i + 1))) {
        tz[i + 1].forEach(z => {
          obj.timezone.push(`${z.start}-${z.end}`);
        });
      }
      arr.push(obj);
    }
    return arr;
  }
  return [
    { day: 0, timezone: [] },
    { day: 1, timezone: [] },
    { day: 2, timezone: [] },
    { day: 3, timezone: [] },
    { day: 4, timezone: [] },
    { day: 5, timezone: [] },
    { day: 6, timezone: [] }
  ];
};
export default {
  name: "category-set-modal",
  props: {
    list: {
      type: Array,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      default: null
    },
    setModalStatus: {
      type: Function,
      required: true
    },
    close: {
      type: Function,
      required: true
    },
    saveProductTag: {
      type: Function,
      required: true
    },
    deleteTagAndProduct: {
      type: Function,
      required: true
    },
    changeTagLevel: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      title: MODAL_TITLE[this.typeSelf],
      setLevel: null,
      // eslint-disable-next-line react/no-unused-state
      newType: 1,
      catename: "",
      appTagCode: "",
      topFlag: 1,
      delType: 1,
      days: [
        { day: 0, timezone: [] },
        { day: 1, timezone: [] },
        { day: 2, timezone: [] },
        { day: 3, timezone: [] },
        { day: 4, timezone: [] },
        { day: 5, timezone: [] },
        { day: 6, timezone: [] }
      ],
      id: null,
      parentId: null,
      itemNewType: true,
      itemParentTag: false,
      itemCateName: true,
      itemSellTime: true,
      itemDelete: false,
      SELL_TIME_WEEKS,
      isMedicine
    };
  },
  watch: {
    type: {
      immediate: true,
      handler(type) {
        this.typeSelf = type;
        // eslint-disable-next-line no-unused-vars
        let obj = {
          type,
          lastType: type,
          title: MODAL_TITLE[type]
        };
        if (this.options && isPlainObject(this.options)) {
          const {
            level,
            category: {
              id = "",
              name = "",
              appTagCode = "",
              topFlag = 0,
              productCount = 0,
              subTags = []
            }
          } = this.options;
          obj = Object.assign({}, obj, {
            setLevel: level,
            id: type === "NEW_SECOND" ? "" : id,
            parentId: type === "NEW_SECOND" ? id : "",
            catename: type === "NEW_SECOND" ? "" : name,
            parentName: type === "NEW_SECOND" ? name : "",
            appTagCode: type === "NEW_SECOND" ? "" : appTagCode,
            topFlag,
            productCount,
            hasSubTags: !!(subTags && subTags.length !== 0)
          });
          if (Number(topFlag) === 1 && this.options.category) {
            const days = convertTimezoneToDays(
              this.options.category.timeZone || ""
            );
            obj = Object.assign({}, obj, { days });
          }
        }

        switch (type) {
          case "NEW":
            obj = Object.assign({}, obj, {
              itemNewType: true,
              itemParentTag: false,
              itemCateName: true,
              itemSellTime: true,
              itemDelete: false
            });
            break;
          case "EDIT_FIRST":
            obj = Object.assign({}, obj, {
              itemNewType: false,
              itemParentTag: false,
              itemCateName: true,
              itemSellTime: true,
              itemDelete: false
            });
            break;
          case "SET_SELLTIME":
            obj = Object.assign({}, obj, {
              itemNewType: false,
              itemParentTag: false,
              itemCateName: true,
              itemSellTime: true,
              itemDelete: false
            });
            break;
          case "TO_SECOND":
            obj = Object.assign({}, obj, {
              itemNewType: false,
              itemParentTag: true,
              itemCateName: false,
              itemSellTime: false,
              itemDelete: false
            });
            break;
          case "NEW_SECOND":
            obj = Object.assign({}, obj, {
              itemNewType: false,
              itemParentTag: true,
              itemCateName: true,
              itemSellTime: false,
              itemDelete: false
            });
            break;
          case "DEL_FIRST":
            obj = Object.assign({}, obj, {
              itemNewType: false,
              itemParentTag: false,
              itemCateName: false,
              itemSellTime: false,
              itemDelete: true
            });
            break;
          case "EDIT_SECOND":
            obj = Object.assign({}, obj, {
              itemNewType: false,
              itemParentTag: false,
              itemCateName: true,
              itemSellTime: false,
              itemDelete: false
            });
            break;
          case "DEL_SECOND":
            obj = Object.assign({}, obj, {
              itemNewType: false,
              itemParentTag: false,
              itemCateName: false,
              itemSellTime: false,
              itemDelete: true
            });
            break;
          default:
        }

        Object.keys(obj).forEach(it => {
          this[it] = obj[it];
        });
      }
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  computed: {
    showNewSecondMsg() {
      return (
        this.type === "NEW_SECOND" &&
        this.productCount !== 0 &&
        !this.hasSubTags
      );
    }
  },
  methods: {
    handleCancel() {
      this.setModalStatus(false);
      this.timer = setTimeout(() => {
        const obj = {
          newType: 1,
          catename: "",
          topFlag: 1,
          days: [
            { day: 0, timezone: [] },
            { day: 1, timezone: [] },
            { day: 2, timezone: [] },
            { day: 3, timezone: [] },
            { day: 4, timezone: [] },
            { day: 5, timezone: [] },
            { day: 6, timezone: [] }
          ],
          parentName: "",
          parentId: null,
          id: null,
          type: "NEW",
          appTagCode: "",
          title: MODAL_TITLE.NEW,
          setLevel: null,
          itemNewType: true,
          itemParentTag: false,
          itemCateName: true,
          itemSellTime: true,
          itemDelete: false
        };
        obj.keys().forEach(it => {
          this[it] = obj[it];
        });
        this.$nextTick(() => {
          this.close();
        });
      }, 1000);
    },

    async onConfirm() {
      const {
        list,
        newType,
        catename,
        topFlag,
        days,
        parentId,
        id,
        delType,
        appTagCode,
        type,
        itemNewType,
        itemParentTag,
        itemCateName,
        itemSellTime,
        itemDelete
      } = this;
      const params = {
        tagInfo: {
          id: id || "",
          name: "",
          sequence: 0,
          description: "",
          level: type === "NEW_SECOND" ? 2 : 1,
          parentId: 0,
          top_flag: null,
          time_zone: "{}"
        },
        tagId: id,
        delType: 1
      };

      if (itemNewType) {
        console.log("选择了新建一级分类");
        params.tagInfo.level = newType;
      }

      if (itemParentTag) {
        if (type !== "NEW_SECOND" && !parentId) {
          this.$Message.warning("请选择归属的一级分类");
          return;
        }
        params.tagInfo.parentId = parentId;
      }

      if (itemCateName) {
        if (!catename) {
          this.$Message.warning("分类名称不能为空");
          return;
        } else {
          if (type === "NEW" || type === "NEW_SECOND") {
            const resultCode = validateDuplicatedName(catename, list);
            if (resultCode === 1) {
              this.$Message.warning(`分类名称已存在：${catename}`);
              return;
            }
          }
          const resultReg = validate("tagName", catename);
          if (resultReg.code) {
            this.$Message.warning(resultReg.msg);
            return;
          }
        }
        params.tagInfo.name = catename;
        params.tagInfo.appTagCode = appTagCode;
      }

      if (!isMedicine && itemSellTime) {
        if (topFlag === 1) {
          const error = validateTimezones(
            true,
            convertTimezoneToCompareMode(days)
          );
          if (error) {
            this.$Message.warning(error);
            return;
          }
        }
        params.tagInfo = Object.assign(
          {},
          params.tagInfo,
          convertTimezoneToSubmitMode(topFlag === 1, days)
        );
      }

      if (itemDelete) {
        params.tagId = id;
        params.delType = delType;
      }

      try {
        if (
          type === "NEW" ||
          type === "EDIT_FIRST" ||
          type === "SET_SELLTIME" ||
          type === "NEW_SECOND" ||
          type === "EDIT_SECOND"
        ) {
          await this.props.saveProductTag(JSON.stringify([params.tagInfo]));
        } else if (type === "TO_SECOND") {
          await this.props.changeTagLevel(
            params.tagId,
            params.tagInfo.parentId
          );
        } else {
          await this.props.deleteTagAndProduct(delType, params.tagId);
        }
        this.handleCancel();
      } catch (err) {
        this.$Message.error(err.message || err.msg || "操作失败");
      }
    },

    handleChangeType(e) {
      const newType = e.target.value;
      this.newType = newType;
      this.itemParentTag = newType === 2;
      this.itemSellTime = newType === 1;
    },

    handleSwitchPeriod(e) {
      this.topFlag = e.target.value;
    },

    handleSwitchDelType(e) {
      this.delType = e.target.value;
    },

    handleTimeZoneChange(days) {
      this.days = days;
    },

    handleSelectionChange(val) {
      this.parentId = val;
    },

    handleInputChange(e) {
      this.catename = e.target.value;
    },

    handleCodeChange(e) {
      this.appTagCode = e.target.value;
    }
  },
  components: {
    PeriodWeekTime
  }
};
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
