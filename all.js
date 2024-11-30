/**
 * 处理事件, 返回 true 表示继续执行后续的事件处理流程，返回 false 则表示中断事件处理流程
 * @param event
 */
const axios = require('axios');
let maoniang = 0;

// 切换模式
const changeModule = (event) => {
    if (event.content.includes('猫娘模式')) {
        maoniang = 1;
        bot.sendGroup(event.groupId, '切换至猫娘模式');
    } else if (event.content.includes('普通模式')) {
        maoniang = 0;
        bot.sendGroup(event.groupId, '切换至普通模式');
    }
    return true;
}
module.exports.action = async (event) => {
    changeModule(event);
    if (event.content.includes(`[CQ:at,qq=${event.botId},name=${event.botName}]`)) {
        const match = event.content.match(/\[CQ:at,qq=(\d+),name=(.*)\]\s*(.*)/);
        if (!match[3]) {
            bot.sendGroup(event.groupId, '干嘛呀~');
            return 0;
        }
        if (maoniang) {
            // 猫娘ai
            const res = await axios.get(`https://api.mhimg.cn/api/gpt_aimaoniang/?prompt=${match[3]}`);
            await bot.sendGroup(event.groupId, res.data);
            return 0;
        } else {
            const res = await axios.get(`http://ranyu.sbs/API/chat.php?content=${match[3]}`);
            await bot.sendGroup(event.groupId, res.data);
            return 0;
        }
    }
    return true;
}