const { SlashCommandBuilder } = require('discord.js');
const creditDB = require('../database/credit.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('credit')
        .setDescription('Ver tu crédito en Robux.'),

    async execute(interaction) {

        const credit = creditDB[interaction.user.id] || 0;

        await interaction.reply({
            content: 'Te envié tu crédito por mensaje privado.',
            ephemeral: true
        });

        interaction.user.send(`Tu crédito disponible es: ${credit} Robux.`);
    }
};