const supportDB = require('../../database/support.json');

module.exports = {
    name: 'guildMemberUpdate',

    async execute(oldMember, newMember) {
        const rolesIDs = Object.values(supportDB);

        for (const roleID of rolesIDs) {
            const lostRole = oldMember.roles.cache.has(roleID) && !newMember.roles.cache.has(roleID);

            if (lostRole) {
                const role = newMember.guild.roles.cache.get(roleID);

                newMember.guild.channels.cache
                    .find(c => c.name === 'soporte-log')
                    ?.send(`El rol de soporte **${role.name}** ha quedado libre.`);
            }
        }
    }
};