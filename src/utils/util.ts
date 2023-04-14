// 日志输出方法
export function printLogs(message: string, data?: string | number | Record<string, any>) {
  if (data) {
    console.log(
      `【${new Date().toLocaleString()}】${message}：`,
      typeof data === "object" ? JSON.stringify(data) : data
    );
  } else {
    console.log(`【${new Date().toLocaleString()}】${message}`);
  }
}
// 设定事项序号的固定长度
const ITEM_NUMB_LEN = 5;

// 序号补零方法
export function handlePadNumbLength(numb) {
  let padString = numb;

  if (typeof numb === "number") {
    padString = Number.prototype.toString.call(numb);
  }

  return padString.padStart(ITEM_NUMB_LEN, "0");
}

export function formate(time) {
  const date  = new Date(time + 1000 * 60 * 60 * 8);
  if (date instanceof Date) {

    const Y = date.getUTCFullYear() + '-';
    const M = (date.getUTCMonth() + 1 < 10 ? '0' + (date.getUTCMonth() + 1) : (date.getUTCMonth() + 1)) + '-';
    const D = (date.getUTCDate() < 10 ? '0' + date.getUTCDate() : date.getUTCDate()) + ' ';
    const h = (date.getUTCHours() < 10 ? '0' + date.getUTCHours() : date.getUTCHours()) + ':';
    const m = (date.getUTCMinutes() < 10 ? '0' + date.getUTCMinutes() : date.getUTCMinutes()) + ':';
    const s = (date.getUTCSeconds() < 10 ? '0' + date.getUTCSeconds() : date.getUTCSeconds());

    return Y+M+D+h+m+s;
  }
}
