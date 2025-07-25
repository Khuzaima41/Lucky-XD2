const { malvin } = require('../malvin');

malvin({
    pattern: "admin",
    alias: ["takeadmin", "makeadmin"],
    desc: "Make yourself admin (only bot owner can use)",
    category: "owner",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, sender, isBotAdmins, isGroup, reply }) => {
    // Check: Must be a group
    if (!isGroup) return reply("❌ This command can only be used in groups.");

    // Check: Bot must be admin
    if (!isBotAdmins) return reply("❌ I need to be an admin to perform this action.");

    // Normalize function to handle number and jid formats
    const normalizeJid = (jid) => jid.includes('@') ? jid : `${jid}@s.whatsapp.net`;

    // Only allow you (bot owner) to use
    const BOT_OWNER = normalizeJid("923044003007");  // 👈 YOUR NUMBER ONLY
    const senderJid = normalizeJid(sender);

    if (senderJid !== BOT_OWNER) {
        return reply("🚫 Only the bot owner is allowed to use this command.");
    }

    try {
        const groupMetadata = await conn.groupMetadata(from);
        const userInfo = groupMetadata.participants.find(p => p.id === senderJid);

        if (userInfo?.admin) {
            return reply("ℹ️ You're already an admin in this group.");
        }

        // Promote the owner to admin
        await conn.groupParticipantsUpdate(from, [senderJid], "promote");
        return reply("✅ You have been promoted to admin successfully!");
    } catch (error) {
        console.error("Admin Command Error:", error);
        return reply("❌ Error: Could not promote you to admin.");
    }
});
