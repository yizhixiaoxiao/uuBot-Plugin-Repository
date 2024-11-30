const axios = require('axios');
module.exports.action = async (event) => {
    if (event.content) {
        try {
            const res = await axios.get('https://api.khkj6.com/kfc/');
            const data = await res.data;
            bot.sendGroup(event.groupId, data.msg.trim());
        } catch (error) {
            bot.sendGroup(event.groupId , `出错啦：${error}`);
        }
    }
}