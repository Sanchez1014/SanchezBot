const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const creditDB = require('../database/credit.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removecredit')
        .setDescription('Remover crédito en Robux a un usuario.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario al que se le removerá crédito')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('cantidad')
                .setDescription('Cantidad de Robux a remover')
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
        const amount = interaction.options.getInteger('cantidad');

        const current = creditDB[user.id] || 0;
        const updated = Math.max(current - amount, 0);

        creditDB[user.id] = updated;

        fs.writeFileSync('./database/credit.json', JSON.stringify(creditDB, null, 2));

        interaction.reply({
            content: `Crédito actualizado: ${user.username} ahora tiene ${updated} Robux.`,
            ephemeral: true
        });
    }
};