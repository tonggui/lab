// 全部时间
export const TYPE_ALL = -1;
// 自定义时间
export const TYPE_CUSTOM = 0;

// 全部时间对应的特殊字符
export const ALL_TIME_VALUE = "-";

export const validateEachTimeItem = item => {
  const { start, end } = item;
  return !!start && !!end && end > start;
};

export const validateTimeIsCrossed = items => {
  for (let i = 0; i < items.length; i++) {
    const { start, end } = items[i];
    for (let j = 0; j < i; j++) {
      const { start: s, end: e } = items[j];
      if (!(start >= e || end <= s)) return false;
    }
  }
  return true;
};

export const validateTimezones = (isOpen, timezones) => {
  if (isOpen) {
    if (!timezones || Object.keys(timezones).length === 0) {
      return "至少选择1天";
    }

    // 记录空时间区间的数量，只有全部为空，才能定义为需要设置时间段
    let emptyTimezoneCount = 0;
    const items = Object.values(timezones);
    for (let i = 0; i < items.length; i++) {
      const list = items[i];
      if (!list || list.length === 0) emptyTimezoneCount += 1;
      if (!list.every(item => validateEachTimeItem(item)))
        return "时间段不能为空，且每个时间段结束时间需要晚于开始时间";
      if (!validateTimeIsCrossed(list)) return "时间段不允许重叠";
    }
    if (emptyTimezoneCount === items.length) return "至少设置一个时间段";
  }
  return false;
};

export const convertTimezoneToCompareMode = timezone =>
  timezone
    // .filter(item => item.timezone.length > 0)
    .reduce((map, items) => {
      map[Number(items.day + 1)] = items.timezone.map(item => {
        const [start, end] = item.split("-");
        return {
          start,
          end
        };
      });
      return map;
    }, {});

export const convertTimezoneToSubmitMode = (isCustomType, timezone) => {
  if (!isCustomType) return ALL_TIME_VALUE;
  const state = [[], [], [], [], [], [], []];
  timezone.forEach(item => {
    state[item.day] = item.timezone || [];
  });
  return JSON.stringify(state);
};

export const convertToInsideMode = (value = ALL_TIME_VALUE) => {
  const initState = {
    type: TYPE_ALL,
    days: [
      { day: 0, timezone: [] },
      { day: 1, timezone: [] },
      { day: 2, timezone: [] },
      { day: 3, timezone: [] },
      { day: 4, timezone: [] },
      { day: 5, timezone: [] },
      { day: 6, timezone: [] }
    ]
  };
  if (value !== ALL_TIME_VALUE) {
    initState.type = TYPE_CUSTOM;
    const timezones = JSON.parse(value);
    initState.days.forEach((item, idx) => {
      const val = timezones[idx] || [];
      if (val.length > 0) {
        item.timezone = val;
      }
    });
  }
  return initState;
};
