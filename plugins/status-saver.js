const { malvin } = require("../malvin");

// Replace this with your number (with @s.whatsapp.net)
const BOT_OWNER = "923044003007@s.whatsapp.net";

malvin({
  pattern: "send",
  alias: ["sendme", "save"],
  react: "📤",
  desc: "Forwards quoted message back to user (owner-only)",
  category: "utility",
  filename: __filename
}, async (client, message, match, { from }) => {
  try {
    // Allow only owner to use
    if (message.sender !== BOT_OWNER) {
      return await client.sendMessage(from, {
        text: "❌ *This command is restricted to the bot owner only.*"
      }, { quoted: message });
    }

    if (!match.quoted) {
      return await client.sendMessage(from, {
        text: "🍁 *Please reply to a message to send it back.*"
      }, { quoted: message });
    }

    const buffer = await match.quoted.download();
    const mtype = match.quoted.mtype;
    const options = { quoted: message };

    let messageContent = {};
    switch (mtype) {
      case "imageMessage":
        messageContent = {
          image: buffer,
          caption: match.quoted.text || "",
          mimetype: match.quoted.mimetype || "image/jpeg"
        };
        break;
      case "videoMessage":
        messageContent = {
          video: buffer,
          caption: match.quoted.text || "",
          mimetype: match.quoted.mimetype || "video/mp4"
        };
        break;
      case "audioMessage":
        messageContent = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: match.quoted.ptt || false
        };
        break;
      default:
        return await client.sendMessage(from, {
          text: "❌ *Only image, video, and audio messages are supported.*"
        }, { quoted: message });
    }

    await client.sendMessage(from, messageContent, options);

  } catch (error) {
    console.error("Forward Error:", error);
    await client.sendMessage(from, {
      text: "❌ *Error forwarding message:*\n" + error.message
    }, { quoted: message });
  }
});
