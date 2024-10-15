const { readFile, writeFile } = require("node:fs/promises");
const { resolve } = require("node:path");
const handleTitle = (title) => {
  if (title.includes("CCTV")) {
    return 'group-title="央视"';
  } else if (title.includes("卫视")) {
    return 'group-title="卫视"';
  }
  {
    return 'group-title="其他"';
  }
};
async function logFile() {
  try {
    const filePath = resolve("./tv.m3u");
    const contents = await readFile(filePath, { encoding: "utf8" });
    const lines = contents.split("\n");
    let newLines = [];
    let settedChannels = [];

    const length = lines.length;
    let pointer = 0;
    while (pointer < length) {
      //
      const cur = lines[pointer];
      if (cur.includes("x-tvg-url")) {
        newLines.push(cur);
        pointer += 1;
        continue;
      }
      //   console.log(cur.indexOf(','))
      const idx = cur.indexOf(",");
      if (idx < 0) continue;
      //   const [info, curChannel] = cur.slice(idx);
      const curChannel = cur.slice(idx + 1);
      if (!curChannel) continue;
      if (settedChannels.includes(curChannel)) {
        pointer += 2;
        continue;
      }
      // 处理频道 设置分组
      const groupTitleStr = handleTitle(curChannel);
      const newInfo = cur.slice(0, idx) + groupTitleStr;
      newLines.push([newInfo, curChannel].join(","), lines[pointer + 1]);
      settedChannels.push(curChannel);
      pointer += 2;
      continue;

    }
    console.log(newLines);
    writeFile('tv6.m3u',newLines.join('\n'))
  } catch (err) {
    console.error(err.message);
  }
}
logFile();
