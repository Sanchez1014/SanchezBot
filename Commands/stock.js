const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { readDB } = require("../db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stock")
    .setDescription("Te envía el stock por privado (DM)"),

  async execute(interaction) {
    const db = readDB();
    if (db.assets.length === 0) {
      return interaction.reply({ content: "📦 No hay assets en stock.", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle("🛒 Stock Disponible")
      .setDescription("Aquí está el stock actual (privado)")
      .setTimestamp();

    db.assets.forEach(a => {
      embed.addFields({
        name: `${a.nombre} — ${a.precio}R$`,
        value: `${a.descripcion}`,
        inline: false
      });
    });

    try {
      await interaction.user.send({ embeds: [embed] });
      await interaction.reply({ content: "📩 Te envié el stock por privado.", ephemeral: true });
    } catch (err) {
      await interaction.reply({ content: "❌ No pude enviarte el stock por DM. Activa tus DMs.", ephemeral: true });
    }
  }
};
