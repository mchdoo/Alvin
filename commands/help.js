const { DiscordAPIError } = require("discord.js")

const Discord = require('discord.js');

module.exports= {
    name: 'help',
    description: 'Contacto.',
    execute(message, args){
        const embed = new Discord.MessageEmbed()
        .setTitle('Autor:')
        .addField('Pedro Machado','Discord Profile: <@679734087845544008>')
        .addField('Contacto', '***Instagram:*** pedritohzz (DMs)')
        .setThumbnail('https://cdn.discordapp.com/avatars/679734087845544008/e9fe89581b5c12af7e7ff5a2f91b520e.webp')
        .setImage('https://i.pinimg.com/originals/32/a6/03/32a6034355c78487c95b5485dab0b941.jpg')
        .setColor(0x57b6ff)
        message.channel.send(embed);
    }
}