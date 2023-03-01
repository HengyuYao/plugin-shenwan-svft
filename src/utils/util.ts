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