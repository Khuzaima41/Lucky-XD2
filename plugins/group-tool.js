const { malvin } = require('../malvin');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Your WhatsApp number in international format (without +)
const BOT_OWNER = "923044003007";

// 🔸 Remove only non-admin members
malvin({
  pattern: "removemembers",
  alias: ["kickall", "endgc", "endgroup"],
  desc: "Remove all non-admin members from the group.",
  react: "🚫",
  category: "group",
  filename: __filename,
}, async (conn, mek, m, {
  from, groupMetadata, groupAdmins, isBotAdmins, senderNumber, reply, isGroup
}) => {
  if (!isGroup) return reply("❌ This command is only for groups.");
  if (senderNumber !== BOT_OWNER) return reply("🚫 Only the bot owner can use this command.");
  if (!isBotAdmins) return reply("⚠️ I need admin rights to remove members.");

  const members = groupMetadata.participants;
  const toRemove = members.filter(p => !groupAdmins.includes(p.id));

  if (toRemove.length === 0) return reply("✅ No non-admins to remove.");
  reply(`Removing ${toRemove.length} non-admins...`);

  for (let p of toRemove) {
    try {
      await conn.groupParticipantsUpdate(from, [p.id], "remove");
      await sleep(2000);
    } catch (e) {
      console.error(`Failed to remove ${p.id}:`, e);
    }
  }

  reply("✅ Done removing non-admins.");
});

// 🔸 Remove only admin members (excluding bot and owner)
malvin({
  pattern: "removeadmins",
  alias: ["kickadmins", "kickall3", "deladmins"],
  desc: "Remove all admins except bot and owner.",
  react: "⚠️",
  category: "group",
  filename: __filename,
}, async (conn, mek, m, {
  from, isGroup, senderNumber, groupMetadata, groupAdmins, isBotAdmins, reply
}) => {
  if (!isGroup) return reply("❌ This command is only for groups.");
  if (senderNumber !== BOT_OWNER) return reply("🚫 Only the bot owner can use this command.");
  if (!isBotAdmins) return reply("⚠️ I need admin rights to remove admins.");

  const adminsToRemove = groupMetadata.participants.filter(p =>
    groupAdmins.includes(p.id) &&
    p.id !== conn.user.id && p.id !== `${BOT_OWNER}@s.whatsapp.net`
  );

  if (adminsToRemove.length === 0) return reply("✅ No admins to remove.");

  reply(`Removing ${adminsToRemove.length} admins (excluding bot/owner)...`);
  for (let p of adminsToRemove) {
    try {
      await conn.groupParticipantsUpdate(from, [p.id], "remove");
      await sleep(2000);
    } catch (e) {
      console.error(`Failed to remove ${p.id}:`, e);
    }
  }

  reply("✅ Done removing admins.");
});

// 🔸 Remove all members (admins + users), except bot & owner
malvin({
  pattern: "removeall2",
  alias: ["kickall2", "endgc2", "endgroup2"],
  desc: "Remove all members (admins and non-admins), except bot & owner.",
  react: "❌",
  category: "group",
  filename: __filename,
}, async (conn, mek, m, {
  from, isGroup, senderNumber, groupMetadata, isBotAdmins, reply
}) => {
  if (!isGroup) return reply("❌ This command is only for groups.");
  if (senderNumber !== BOT_OWNER) return reply("🚫 Only the bot owner can use this command.");
  if (!isBotAdmins) return reply("⚠️ I need admin rights to remove members.");

  const toRemove = groupMetadata.participants.filter(p =>
    p.id !== conn.user.id && p.id !== `${BOT_OWNER}@s.whatsapp.net`
  );

  if (toRemove.length === 0) return reply("✅ No members to remove.");

  reply(`Removing ${toRemove.length} members (excluding bot/owner)...`);
  for (let p of toRemove) {
    try {
      await conn.groupParticipantsUpdate(from, [p.id], "remove");
      await sleep(2000);
    } catch (e) {
      console.error(`Failed to remove ${p.id}:`, e);
    }
  }

  reply("✅ Done removing all members.");
});
