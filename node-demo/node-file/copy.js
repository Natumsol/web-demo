var fs = require("fs");

function copy(src, dst) {
    // fs.writeFileSync(dst, fs.readFileSync(src)); 不适合拷贝大文件
    fs.createReadStream(src).pipe(fs.createWriteStream(dst));
}

function main(argv) {
    copy(argv[0], argv[1]);
}

main(process.argv.slice(2));