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
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario");
    const file = interaction.options.getAttachment("archivo");

    const content =
      "## 💜 **Entrega Oficial – Sánchez Shop**\n\n" +
      "Gracias por confiar en nuestro trabajo. Tu compra ha sido procesada correctamente y procedemos a entregarte tu archivo digital.\n\n" +
      "📦 **Detalles de la entrega:**\n" +
      "• Estado: **Entregado correctamente  +
      "En **Sánchez Shop** trabajamos con seriedad, calidad y compromiso. Cada entrega es revisada manualmente para garantizar que recibas exactamente lo que pagaste.\n\n" +
      "Si necesitas soporte, ajustes, actualizaciones o tienes alguna duda, puedes abrir un ticket en cualquier momento. Nuestro equipo estará disponible para ayudarte.\n\n" +
      "💎 *Gracias por elegir calidad. Gracias por elegir Sánchez Shop.*";

    try {
      await user.send({
        content,
        files: [file.url]
      });

      await interaction.reply({
        content: `✅ Asset enviado correctamente a **${user.tag}**`,
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