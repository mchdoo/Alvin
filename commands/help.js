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
        .setImage('https://lh3.googleusercontent.com/proxy/JFIsUwG_32GbRUtK8ttfUmqfKmDnb1k4y5D5tsRnwoLRqSQBV-AbL88Q_Lf9jdAGWDrCW_jN341SZiApLVqqHtAQBBtpo10AWq5nDbXwScLDYv-HsNOlkHVO3t90n5KhTQo')
        .setColor(0x57b6ff)
        message.channel.send(embed);
    }
}