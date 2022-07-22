const readline = require("readline");
const fs = require("fs");
const path = require("path");

let dir_path = "./"; //文件夹地址
let orgExt = ""; //原后缀
let newExt = ""; //新后缀

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//判断文件和文件夹
let isFile = (fileName) => {
  return fs.lstatSync(fileName).isFile();
};

/**
 * 批量修改后缀名
 * dir 路径
 * orgExt 原后缀
 * newExt 新后缀
 */
const reName = (dir, orgExt, newExt) => {
  const dir_path = path.resolve(dir);
  const fileList = fs.readdirSync(dir_path);
  for (let i = 0; i < fileList.length; i++) {
    let file = fileList[i];
    file = path.join(dir, file);
    if (isFile(file)) {
      if (file.split(".")[1] != orgExt) continue;

      let parsed = path.parse(file);
      let oldFileName = parsed.name + "." + orgExt;
      let newFileName = parsed.name + "." + newExt;
      try {
        fs.renameSync(
          path.join(parsed.dir, oldFileName),
          path.join(parsed.dir, newFileName)
        );
        console.log(
          `${path.join(parsed.dir, oldFileName)} ========> ${path.join(
            parsed.dir,
            newFileName
          )}`
        );
      } catch (error) {
        throw error;
      }
    } else {
      reName(file, orgExt, newExt);
    }
  }
};

rl.question(`请输入文件夹地址: `, (res1) => {
  console.log(`文件夹地址是: ${res1}!`);
  dir_path = res1;

  rl.question(`文件原后缀是: `, (res2) => {
    orgExt = res2;

    rl.question(`文件新后缀是: `, (res3) => {
      newExt = res3;

      reName(dir_path, orgExt, newExt);
      rl.close();
    });
  });
});
