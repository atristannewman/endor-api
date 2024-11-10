function getCurrDateString() {
  const currDatetime = new Date();
  const fullDateString = `${currDatetime.getFullYear()}-${currDatetime.getMonth() + 1}-${currDatetime.getDate()}`;
  const fullTimeString = `${currDatetime.getHours()}:${currDatetime.getMinutes()}:${currDatetime.getSeconds()}`;
  const timezoneOffsetString = `${currDatetime.getTimezoneOffset()}`;
  const fullDatetimeString = `${fullDateString} ${fullTimeString} +${timezoneOffsetString}`;
  return fullDatetimeString;
}

module.exports = { getCurrDateString };
