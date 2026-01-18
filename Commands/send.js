const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("send")
    .setDescription("Enviar un asset por DM")
    .addUserOption(opt =>
      opt.setName("usuario")
        .setDescription("Usuario que recibe el asset")
        .setRequired(true))
    .addAttachmentOption(opt =>
      opt.setName("archivo")
        .setDescription("Archivo del asset")
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario");
    const file = interaction.options.getAttachment("archivo");

    try {
      await user.send({
        content: "🎁 **Has recibido un asset**\nGracias por comprar ❤️",
        files: [file.url]
      });

      await interaction.reply({
        content: `✅ Asset enviado a **${user.tag}**`,
        ephemeral: true
      });
    } catch (err) {
      await interaction.reply({
        content: "❌ No se pudo enviar DM (DMs cerrados)",
        ephemeral: true
      });
    }
  }
};
