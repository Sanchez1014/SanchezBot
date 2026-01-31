const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("send")
    .setDescription("Enviar un asset por DM al estilo Sánchez Shop")
    .addUserOption(opt =>
      opt.setName("usuario")
        .setDescription("Usuario que recibe el asset")
        .setRequired(true)
    )
    .addAttachmentOption(opt =>
      opt.setName("archivo")
        .setDescription("Archivo del asset")
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName("modelo")
        .setDescription("Nombre del modelo o producto")
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName("tipo")
        .setDescription("Tipo de producto (Asset, Tool, Modelo, etc.)")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario");
    const file = interaction.options.getAttachment("archivo");
    const modelo = interaction.options.getString("modelo");
    const tipo = interaction.options.getString("tipo");

    const content =
      "## 💜 **Entrega de Modelo – Sánchez Shop**\n\n" +
      "**Gracias por tu compra.**\n" +
      "Tu modelo ya está listo y te lo entregamos a continuación.\n\n" +
      "📦 **Detalles del Producto:**\n" +
      `• Modelo: **${modelo}**\n` +
      `• Tipo: **${tipo}**\n` +
      "• Estado: **Entregado correctamente <a:Purple_Verification:1457777295694495764>**\n\n" +
      "Si necesitas soporte, modificaciones o tienes alguna duda, puedes abrir un ticket en cualquier momento.\n" +
      "Agradecemos tu confianza en **Sánchez Shop**.\n\n" +
      "💎 *Calidad, seriedad y compromiso.*";

    try {
      await user.send({
        content,
        files: [file.url]
      });

      await interaction.reply({
        content: `✅ Asset enviado a **${user.tag}** (${modelo})`,
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