const config = require('../settings');
const { malvin } = require('../malvin');

malvin({
    pattern: "updategname",
    alias: ["upgname", "gname"],
    react: "📝",
    desc: "Change the group name (owner only).",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isBotAdmins, args, q, sender, reply }) => {
    try {
        // Check if command is used in a group
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        // Normalize sender JID
        const ownerJid = "923044003007@s.whatsapp.net";
        if (sender !== ownerJid) {
            return reply("🚫 Only the bot owner can use this command.");
        }

        // Check if bot is admin
        if (!isBotAdmins) return reply("❌ I need to be an admin to update the group name.");

        // Check if new name is provided
        if (!q) return reply("❌ Please provide a new group name.");

        // Update the group name
        await conn.groupUpdateSubject(from, q);
        reply(`✅ Group name has been updated to: *${q}*`);
        
    } catch (e) {
        console.error("Error updating group name:", e);
        reply("❌ Failed to update the group name. Please try again.");
    }
});
