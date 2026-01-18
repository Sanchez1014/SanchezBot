require("dotenv").config();
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ]
});

client.commands = new Collection();

const commandsPath = "./Commands"; // <-- AQUI cambia a Commands

if (!fs.existsSync(commandsPath)) {
  console.log("⚠️ No se encontró la carpeta Commands. No se cargaron comandos.");
} else {
  const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`${commandsPath}/${file}`);

    if (!command.data || !command.execute) {
      console.log(`⚠️ Comando inválido: ${file}`);
      continue;
    }

    client.commands.set(command.data.name, command);
  }
}

client.once("ready", () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

client.on("channelCreate", async (channel) => {
  if (!channel.isTextBased()) return;
  if (!channel.name.startsWith("ticket-")) return;

  try {
    const owner = channel.permissionOverwrites.cache.find(o => o.type === "member");
    const userId = owner ? owner.id : null;
    const mention = userId ? `<@${userId}>` : "";

    await channel.send({
      content: `💜 Ticket Recibido – Sánchez Shop
Gracias por contactar a nuestro equipo.
Tu ticket ha sido abierto correctamente y ya está en nuestra fila de atención.
${mention}`
    });
  } catch (err) {
    console.log("No pude enviar el mensaje al ticket:", err);
  }
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    interaction.reply({ content: "❌ Error al ejecutar el comando", ephemeral: true });
  }
});

client.on("guildMemberUpdate", (...args) =>
  require("./events/guild/roleUpdate").execute(...args)
);

client.login(process.env.TOKEN);
