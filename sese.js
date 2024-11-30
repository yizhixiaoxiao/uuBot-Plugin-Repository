const axios = require('axios');

// 默认配置；
let globalParams = {
    ai: false,
    state: 0,
    r18: 0,
    model: 1,
};

const handleCommand = (event) => {
    if (event.content.includes('see')) {
        // 匹配指令，格式为 'se key value'
        const match = event.content.match(/^see\s(\w+)\s(.*)$/);

        if (match) {
            const param = match[1]; // 获取参数名，如 r18 或 state
            const value = match[2];

            // 更新全局配置
            if (globalParams.hasOwnProperty(param)) {
                globalParams[param] = value;
                // 返回成功更新的消息
                bot.sendGroup(event.groupId, `已更新 ${param} 为 ${value}`);
            } else {
                // 如果参数名无效，返回错误消息
                bot.sendGroup(event.groupId, `无效的参数: ${param}`);
            }
        } else {
            // 如果指令格式不正确，返回提示消息
            bot.sendGroup(event.groupId, '无效的指令格式，请使用 "see 参数 值" 的格式');
        }
    }
};

const handleImg = async (event, size , imgData) => {
    if (imgData.data.length > 0) {
        const { title, author, r18, tags, urls, pid, aiType } = imgData.data[0];
        let lurl = urls.regular;
        let lsize = Number(size);
        const tagsString = tags.join('、');

        try {
            const res = await axios.get(`http://localhost:3000/handle?url=${lurl}&size=${lsize}`);
            const image = await res.data.url;
            let messages = `标题: ${title}\n作者: ${author}\npid: ${pid}\nr18: ${r18 ? '是' : '否'}\ntags: ${tagsString}\nAI: ${aiType ? '是' : '否'}\n点阵: ${size}\nurl: ${lurl}\n[CQ:image,file=base64://${image}]`;
            const message_id = await bot.sendGroup(event.groupId, messages);
            setTimeout(async () => {
                await bot.recall(message_id);
            }, 5000);
        } catch (e) {
            console.error('获取图片信息失败:', error.request.data);
            bot.sendGroup(event.groupId, '图片请求失败，请稍后再试。');
        }
    } else {
        bot.sendGroup(event.groupId, '解构图片数据失败，请重试');
    }
};

module.exports.action = async (event) => {
    handleCommand(event);

    const PixelCraft = async (event) => {
        const searchParams = event.content.match(/^涩涩\s*(\d+)?\s*(.*)$/);
        if (searchParams) {
            let size;
            let paramsTags = [];
            // 如果存在自定义size，默认10
            searchParams[1] ? size = parseInt(searchParams[1], 10) : size = 10;
            const additionalTags = searchParams[2].split(/\s+/).filter(tag => tag.length > 0);
            paramsTags = paramsTags.concat(additionalTags);  // 合并标签
            let data = { r18: 1, tag: paramsTags, proxy: 'i.yuki.sh', size: 'regular' };
            try {
                // 发送请求
                const res = await axios.post('https://api.lolicon.app/setu/v2', data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const imgUrl = await res.data;
                await handleImg(event , size , imgUrl);
            } catch (e) {
                console.error('请求失败:', e);
                await bot.sendGroup(event.groupId, '请求数据失败');
            }
        }
    }

    const fetchSeseImages = async () => {
        const searchParams = event.content.match(/^sese\s*(\d+)?\s*(.*)$/);

        if (searchParams) {
            let quantity = 1;  // 默认数量为1
            let paramsTags = [];

            // 如果存在数字（第一个参数是数字）
            if (searchParams[1]) {
                quantity = parseInt(searchParams[1], 10);  // 解析数字
            }

            // 获取所有标签（匹配剩余部分）
            const additionalTags = searchParams[2].split(/\s+/).filter(tag => tag.length > 0);  // 使用空格分隔标签，并过滤掉空字符串
            paramsTags = paramsTags.concat(additionalTags);  // 合并标签

            // 如果没有标签，给一个默认标签（例如 "heisi"）
            if (paramsTags.length === 0) {
                paramsTags.push('heisi');  // 给定默认标签
            }

            let data = { r18: globalParams.r18, tag: paramsTags, proxy: 'i.yuki.sh', num: quantity, excludeAI: globalParams.ai };

            try {
                // 发送请求
                const res = await axios.post('https://api.lolicon.app/setu/v2', data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const images = res.data.data;

                // 如果返回数据存在并且是数组
                if (images && images.length > 0) {
                    // 逐条发送图片信息
                    for (const image of images) {
                        const { title, author, r18, tags, urls, pid, aiType } = image;
                        const tagsString = tags.join('、');  // 标签数组转换为字符串

                        // 构建每条消息
                        const message = `标题: ${title}\n作者: ${author}\npid: ${pid}\nr18: ${r18 ? '是' : '否'}\ntags: ${tagsString}\nAI: ${aiType ? '是' : '否'}\nurl: ${urls.original}\n`;

                        // 发送每一条消息
                        await bot.sendGroup(event.groupId, message);
                    }
                } else {
                    // 如果没有找到数据
                    await bot.sendGroup(event.groupId, '未找到相关图片');
                }
            } catch (error) {
                console.error('请求失败:', error);
                await bot.sendGroup(event.groupId, '请求数据失败');
            }

        } else {
            await bot.sendGroup(event.groupId, 'tag匹配失败');
        }
    };



    if (globalParams.state) {
        if (event.content.includes('涩涩')) {
            PixelCraft(event);
        }
        else if (event.content.includes('sese')) {
            fetchSeseImages();
        }
    } else {
        bot.sendGroup(event.groupId, '功能已关闭');
    }
};












