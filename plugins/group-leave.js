const { sleep } = require('../lib/functions');
const config = require('../settings');
const { malvin, commands } = require('../malvin');

malvin({
    pattern: "leave",
    alias: ["left", "leftgc", "leavegc"],
    desc: "Leave the group",
    react: "🎉",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup, reply
}) => {
    try {
        if (!isGroup) {
            return reply("❌ This command can only be used in groups.");
        }

        const sender = m.sender.split("@")[0]; // clean sender number
        const botOwner = "923044003007"; // your number without @s.whatsapp.net

        if (sender !== botOwner) {
            return reply("❌ Only the bot owner can use this command.");
        }

        reply("Leaving group...");
        await sleep(1500);
        await conn.groupLeave(from);
    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e}`);
    }
});
