const { DiscordAPIError } = require("discord.js")

const Discord = require('discord.js');

module.exports= {
    name: 'perfil',
    description: 'Lista de comandos por los que puedo funcionar.',
    execute(message, args){
        const embed = new Discord.MessageEmbed()
        .setTitle('Informacion Jugador')
        .addField('Nombre del jugador', `${message.author.username}`)
        .addField('Discord Tag', `${message.author.discriminator}`)
        .setThumbnail(message.author.avatarURL())
        .setColor('YELLOW')
        message.channel.send(embed);
    }
}