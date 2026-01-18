const { SlashCommandBuilder } = require('discord.js');
const creditDB = require('../database/credit.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('checkcredit')
        .setDescription('Ver el crédito de un usuario.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario a revisar')
                .setRequired(true)
        ),

    async execute(interaction) {

        if (!interaction.member.permissions.has("Administrator")) {
            return interaction.reply({
                content: 'No tienes permisos para usar este comando.',
                ephemeral: true
            });
        }

        const user = interaction.options.getUser('usuario');
        const credit = creditDB[user.id] || 0;

        interaction.reply({
            content: `Crédito de ${user.username}: ${credit} Robux.`,
            ephemeral: true
        });
    }
};