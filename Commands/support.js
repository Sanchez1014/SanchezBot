const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const supportDB = require('../database/support.json');
const supportVC = require('../database/supportVC.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription('Asignar automáticamente un rol de soporte disponible.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario que recibirá el rol de soporte')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {

        const staffRole = interaction.guild.roles.cache.find(r => r.name === "Staff");

        if (
            !interaction.member.permissions.has("Administrator") &&
            !interaction.member.roles.cache.has(staffRole?.id)
        ) {
            return interaction.reply({
                content: 'No tienes permisos para usar este comando.',
                ephemeral: true
            });
        }

        const user = interaction.options.getUser('usuario');
        const member = await interaction.guild.members.fetch(user.id);

        const rolesIDs = Object.values(supportDB);
        const roles = rolesIDs.map(id => interaction.guild.roles.cache.get(id));
        const sorted = roles.sort((a, b) => a.members.size - b.members.size);
        const selected = sorted.find(r => r.members.size === 0);

        if (!selected) {
            return interaction.reply({
                content: 'En este momento todos los soportes están ocupados.',
                ephemeral: true
            });
        }

        await member.roles.add(selected);

        let assignedVC;

        if (selected.id === supportDB.role1) assignedVC = supportVC.vc1;
        if (selected.id === supportDB.role2) assignedVC = supportVC.vc2;
        if (selected.id === supportDB.role3) assignedVC = supportVC.vc3;

        const vcChannel = interaction.guild.channels.cache.get(assignedVC);

        if (vcChannel) {
            member.send(
                `Se te ha otorgado soporte.\nCanal de soporte: 🛍️ Sanchez Shop › #${vcChannel.name}`
            ).catch(() => {});
        } else {
            member.send(
                `Se te ha otorgado soporte.\nNo se encontró un canal de voz asignado.`
            ).catch(() => {});
        }

        await interaction.reply({
            content: 'Soporte será brindado lo más antes posible.',
            ephemeral: true
        });

        interaction.channel.send({
            content: `— ${user.username} ha sido asignado al soporte (${selected.name})`
        }).then(msg => {
            setTimeout(() => msg.delete().catch(() => {}), 5000);
        });
    }
};