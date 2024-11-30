module.exports.action = async function (event) {
    const regex = /\[CQ:at,qq=(\d+),name=([^,]+)\]/;
    const matchResult = event.content.match(regex);
    if (matchResult) {
        const qq = matchResult[1];
        const content = event.content;

        // 根据包含的关键词执行操作
        switch (true) {
            case content.includes('香草泥'):
                bot.sendGroup(event.groupId, `[CQ:image,file=https://api.andeer.top/API/img_xiangcaoni.php?qq=${qq}]`);
                break;
            case content.includes('米哈游'):
                bot.sendGroup(event.groupId, `[CQ:image,file=https://api.andeer.top/API/img_mi.php?qq=${qq}]`);
                break;
            case content.includes('摸头'):
                bot.sendGroup(event.groupId, `[CQ:image,file=https://uapis.cn/api/mt?qq=${qq}]`);
                break;
            case content.includes('贴贴'):
                bot.sendGroup(event.groupId, `[CQ:image,file=https://api.andeer.top/API/gif_tietie.php?qq=${qq}]`);
                break;
            case content.includes('亲亲'):
                bot.sendGroup(event.groupId, `[CQ:image,file=https://api.andeer.top/API/img_kiss1.php?bqq=${event.userId}&cqq=${qq}]`);
                break;
            case content.includes('拳击'):
                bot.sendGroup(event.groupId, `[CQ:image,file=https://api.andeer.top/API/gif_beat.php?qq=${qq}]`);
                break;
            default:
                return false;
        }
    } else {
        return false;
    }
}