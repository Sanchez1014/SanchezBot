const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { readDB, writeDB } = require("../db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("editasset")
    .setDescription("Editar un asset del stock")
    .addStringOption(opt =>
      opt.setName("nombre")
        .setDescription("Nombre del asset a editar")
        .setRequired(true))
    .addIntegerOption(opt =>
      opt.setName("precio")
        .setDescription("Nuevo precio (opcional)")
        .setRequired(false))
    .addStringOption(opt =>
      opt.setName("descripcion")
        .setDescription("Nueva descripción (opcional)")
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const nombre = interaction.options.getString("nombre");
    const precio = interaction.options.getInteger("precio");
    const descripcion = interaction.options.getString("descripcion");

    const db = readDB();
    const asset = db.assets.find(a => a.nombre.toLowerCase() === nombre.toLowerCase());

    if (!asset) {
      return interaction.reply({ content: "❌ Asset no encontrado.", ephemeral: true });
    }

    if (precio) asset.precio = precio;
    if (descripcion) asset.descripcion = descripcion;

    writeDB(db);

    await interaction.reply({ content: `✅ Asset **${nombre}** actualizado.`, ephemeral: true });
  }
};
