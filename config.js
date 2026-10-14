// 生命同行营第二期 / Life Together 网站设置（Site settings）
window.CONFIG = {
  // 1 = 日历上显示所有已经生成的内容（包括未来的日期）
  // 0 = 只显示截至今天为止的内容；今天的内容到 publishTime 才发布
  isAllContentDisplayed: 0,

  // isAllContentDisplayed = 0 时，当天内容的发布时间（24 小时制，"22:00" = 晚上 10:00）
  publishTime: "22:00",

  // 用哪个时区判断“今天”和发布时间。
  // "America/Toronto" = 所有读者都按多伦多时间同时看到；"" = 按每位读者自己设备的本地时间
  timeZone: "America/Toronto"
};
