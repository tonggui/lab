import moment from "moment";

// 秒级别的时间戳转换成文字
export const formatTime = time => {
  const timeStamp = time * 1000;
  const date = moment(timeStamp);
  const today = moment().startOf("day");
  const yesterDay = today.clone().subtract(1, "day");
  const timeString = date.format("LT");
  let dateString = "";
  if (date.isSameOrAfter(today)) {
    dateString = "今天";
  } else if (date.isSameOrAfter(yesterDay)) {
    dateString = "昨天";
  } else {
    dateString = date.format("YYYY-MM-DD");
  }
  return [dateString, timeString].join(" ");
};
