const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { readDB, writeDB } = require("../db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addasset")
    .setDescription("Agregar un asset al stock")
    .addStringOption(opt =>
      opt.setName("nombre")
        .setDescription("Nombre del asset")
        .setRequired(true))
    .addIntegerOption(opt =>
      opt.setName("precio")
        .setDescription("Precio en robux")
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName("descripcion")
        .setDescription("Descripción del asset")
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const nombre = interaction.options.getString("nombre");
    const precio = interaction.options.getInteger("precio");
    const descripcion = interaction.options.getString("descripcion");

    const db = readDB();

    db.assets.push({
      id: Date.now().toString(),
      nombre,
      precio,
      descripcion
    });

    writeDB(db);

    await interaction.reply({
      content: `✅ Asset **${nombre}** agregado al stock.`,
      ephemeral: true
    });
  }
};
