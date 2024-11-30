const axios = require('axios');
module.exports.action = async (event) => {
    const res = await axios.get('https://moe.jitsu.top/img/', {
        params: { sort: 'r18', type: 'json', proxy: 'i.yuki.sh' },
    });
    const data = res.data;
    await bot.sendGroup(event.groupId, `这是您刮刮乐的结果: https://koalastothemax.com/?${data.pics}`);
};