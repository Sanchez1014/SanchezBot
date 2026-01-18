const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const creditDB = require('../database/credit.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resetcredit')
        .setDescription('Reiniciar el crédito de un usuario a 0.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario cuyo crédito será reiniciado')
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

        creditDB[user.id] = 0;

        fs.writeFileSync('./database/credit.json', JSON.stringify(creditDB, null, 2));

        interaction.reply({
            content: `El crédito de ${user.username} ha sido reiniciado a 0 Robux.`,
            ephemeral: true
        });
    }
};