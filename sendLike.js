module.exports.action = async function(event) {

    let $message = ''; 
    let $count = 0; 

    if (event.content) {

        for (let i = 0; i < 5; i++) {
            const result = await bot.sendlike(event.userId, 10); 
            if (result.status === 'ok') {
                $count += 10; 
                $message += `${i + 1}.成功点赞+${$count}!\n`;
            } else {
                $message += `${result.message}`;
                break;

            }
        }

        $message += `总共成功点了 ${$count * 1} 个赞! 记得回赞哦。`;
        const message_id = await bot.sendGroup(event.groupId, `${bot.at(event.userId)}\n${$message}`);
        setTimeout(async () => {  
        await bot.recall(message_id);
        }, 5000);

    }
};