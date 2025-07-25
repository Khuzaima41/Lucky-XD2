const { malvin } = require("../malvin");

malvin({
  pattern: "vv",
  alias: ["viewonce", "retrive"],
  react: "🐳",
  desc: "Retrieve quoted view-once image/video/audio",
  category: "owner",
  filename: __filename
},
async (client, message, match, { from, sender, reply }) => {
  try {
    const botOwner = "923044003007@s.whatsapp.net";

    // Restrict usage to only the bot owner
    if (sender !== botOwner) {
      return reply("❌ You are not authorized to use this command.");
    }

    // Must be replying to a view-once message
    if (!match.quoted) {
      return client.sendMessage(from, {
        text: "🍁 Please reply to a view-once image, video, or audio message!"
      }, { quoted: message });
    }

    const buffer = await match.quoted.download();
    const mtype = match.quoted.mtype;
    const options = { quoted: message };

    let content = {};
    switch (mtype) {
      case "imageMessage":
        content = {
          image: buffer,
          caption: match.quoted.text || "",
          mimetype: match.quoted.mimetype || "image/jpeg"
        };
        break;
      case "videoMessage":
        content = {
          video: buffer,
          caption: match.quoted.text || "",
          mimetype: match.quoted.mimetype || "video/mp4"
        };
        break;
      case "audioMessage":
        content = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: match.quoted.ptt || false
        };
        break;
      default:
        return client.sendMessage(from, {
          text: "❌ Only image, video, and audio view-once messages are supported."
        }, { quoted: message });
    }

    await client.sendMessage(from, content, options);

  } catch (error) {
    console.error("vv Error:", error);
    await client.sendMessage(from, {
      text: "❌ Error retrieving view-once message:\n" + error.message
    }, { quoted: message });
  }
});
