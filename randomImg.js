module.exports.action = async (event) => {
    if (event.content == ('精选图')) {
        bot.sendGroup(event.groupId, `[CQ:image,file=https://sese.iw233.top/iapi.php?sort=cdnrandom]`);
    } else if (event.content.includes('随机图')) {
        const match = event.content.match(/随机图\s*(.*)/);
        let params;
        if (!match[1]) {
            params = 'all'
        } else {
            params = match[1];
        }
        bot.sendGroup(event.groupId, `[CQ:image,file=https://api.anosu.top/img?sort=${params}]`);
    }
}