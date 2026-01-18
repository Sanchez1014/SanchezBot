const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { readDB, writeDB } = require("../db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removeasset")
    .setDescription("Eliminar un asset del stock")
    .addStringOption(opt =>
      opt.setName("nombre")
        .setDescription("Nombre del asset a eliminar")
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const nombre = interaction.options.getString("nombre");
    const db = readDB();

    const index = db.assets.findIndex(a => a.nombre.toLowerCase() === nombre.toLowerCase());
    if (index === -1) {
      return interaction.reply({ content: "❌ Asset no encontrado.", ephemeral: true });
    }

    db.assets.splice(index, 1);
    writeDB(db);

    await interaction.reply({ content: `✅ Asset **${nombre}** eliminado.`, ephemeral: true });
  }
};
