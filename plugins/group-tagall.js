const { malvin } = require('../malvin');

malvin({
  pattern: "tagall",
  alias: ["gc_tagall"],
  desc: "Tag all group members with a custom or default message.",
  category: "group",
  use: ".tagall [message]",
  react: "📣",
  filename: __filename,
},
async (conn, mek, m, {
  from, isGroup, participants, reply, command, body
}) => {
  try {
    if (!isGroup) return reply("❌ This command is only for groups.");

    // ✅ Owner check using startsWith
    const ownerNumber = "923044003007";
    const senderNumber = m.sender.split("@")[0]; // Extract number from JID

    if (!senderNumber.startsWith(ownerNumber)) {
      return reply("🚫 Only the bot owner can use this command.");
    }

    const metadata = await conn.groupMetadata(from).catch(() => null);
    if (!metadata) return reply("❌ Could not get group info.");

    const groupName = metadata.subject || "Group";
    const totalMembers = participants?.length || 0;
    if (!totalMembers) return reply("❌ No members to tag.");

    // ✅ Extract message after command
    const msg = body.slice(body.indexOf(command) + command.length).trim() || "Hello everyone!";

    // ✅ Construct message with mentions
    let text = `*Group:* ${groupName}
*Total Members:* ${totalMembers}
*Message:* ${msg}\n\n`;

    for (const member of participants) {
      if (member?.id) {
        text += `@${member.id.split("@")[0]} `;
      }
    }

    await conn.sendMessage(from, {
      text,
      mentions: participants.map(p => p.id)
    }, { quoted: mek });

  } catch (err) {
    console.error("❌ TagAll Error:", err);
    reply("❌ Something went wrong.");
  }
});
