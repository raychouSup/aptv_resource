const { count } = require("node:console");
const { readFile, writeFile } = require("node:fs/promises");
const { resolve } = require("node:path");

// 根据电视台分类  
async function logFile() {
  try {
    const filePath = resolve("./tv.m3u");
    const contents = await readFile(filePath, { encoding: "utf8" });
    const lines = contents.split("\n");
    let newLines =[ lines[0]]; //第一行不处理 直接写入
    // 根据电视台名字分类
    // 一个电视台最多五个直播源
    const length = lines.length;
    const countMap = new Map()
    let pointer = 1;
    while (pointer < length) {
      const cur = lines[pointer];
      const idx = cur.indexOf(",");
      if (idx < 0) continue;
      const curChannel = cur.slice(idx + 1);
      const curCount = countMap.get(curChannel) ?? 0 
      if(curCount>=5){
        pointer += 2;
        continue
      }
      const groupTitleStr = `group-title="${curChannel}"`;
      const newInfo = cur.slice(0, idx) + groupTitleStr;
      newLines.push([newInfo, curChannel].join(","), lines[pointer + 1]);
      countMap.set(curChannel,curCount+1)
      pointer += 2;
      continue;
    }
    writeFile('tv8.m3u',newLines.join('\n'))
  } catch (err) {
    console.error(err.message);
  }
}
logFile();
