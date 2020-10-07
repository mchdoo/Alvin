const Discord = require('discord.js');
require('dotenv').config();

const client = new Discord.Client();

const prefix = '.';

var servers = {};

var version = '2.4.1';

const cheerio = require('cheerio');

const request = require('request');

const ytdl = require('ytdl-core')

const fs = require('fs');

const { Server } = require('http');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log(client.user.username + ' se conectó');
    client.user.setActivity('Among Us');
});

// mensaje de bienvenida y de salida de servidor


client.on('guildMemberAdd', function(member){
  member.guild.channels.cache.get('761655292810231860').send(`Bienvenid@ al server, **${member}**!!\n Para saber cuales son mis comandos usa '.comandos'.` ); 
});

client.on('guildMemberRemove', function(member){
  member.guild.channels.cache.get('761655292810231860').send(`**${member}** se fue del server ... :(`); 
});

// commandos (mensajes con prefijo)

client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(" ");
    const command = args.shift().toLowerCase();

    if(command === 'help'){
       client.commands.get('help').execute(message, args);
    }else if(command === 'perfil'){
       client.commands.get('perfil').execute(message, args);
    }
});

client.on('message', message =>{
 
  let args = message.content.substring(prefix.length).split(" ");
  let embed = new Discord.MessageEmbed();
  //let messageReaction = new Discord.MessageReaction();

  switch(args[0]){
    case 'info':
      if(args[1] === 'version'){
        message.channel.send('Mi versión actual es: ***' + version + '***... Pero todavía estoy en dessarollo :blush:');
      } else if (args[1] === 'autor') {
          message.channel.send('Mi autor es Pedro Machado.')
      } else {
        message.reply('El comando "info" solo funciona con **"version"** o **"autor"** al lado.')
      }
    break;
    case 'comandos':
      //let embed = new Discord.MessageEmbed()
      embed
        .setTitle('Comandos de Alvin')
        .addField('Comandos con prefijo:', fs.readFileSync('./texts/comandosconprefijo.txt'))
        .addField('Comandos interactivos o sin prefijos:', 'Estos son los comandos que no requieren un prefijo (".") al principio. \n En realidad no tienen ningun proposito, pero hacen que sea mas divertido. Estos comandos son: ***hola***, ***chau***, ***te amo***, ***te odio*** y ***como estas.***')
        .setFooter('Acordate de que antes de poner cualquier comando tenes que poner un punto. \n ej: ".help".', client.user.avatarURL())
        .setColor(0x57b6ff)
        .setThumbnail(client.user.avatarURL())
        message.channel.send(embed);
    break;
    case 'poll':
      //let embed = new Discord.MessageEmbed()
      embed
      .setColor('RED')
      .setTitle('ARGUMENTO INVALIDO')
      .addField('Iniciar encuesta:', 'Para iniciar una encuesta tenés que escribir una encuesta de dos opciones.\n (obviamente con el prefijo ".poll" al principio).')
      if(!args[1]) message.channel.send(embed);

      let msgArgs = args.slice(1).join(' ');

      message.channel.send('**' + message.author.username + '** pregunta:\n 📄 ***' + msgArgs + '***').then(messageReaction => {
        messageReaction.react('👍');
        messageReaction.react('👎');
        message.delete({timeout: 3000}).catch(console.error);
      })
    break;
    case 'kick':
      const user = message.mentions.users.first();

      if(user){
       const member = message.guild.member(user);
       
       if(member){
         member.kick('Te echó ' + message.author + ' ... :(').then(() =>{
          //message.reply(`${user.username} fue echado con exito.`)
         }).catch(err =>{
           message.reply('No pude echar al jugador.')
           console.log(err);
         });
       }else{
         message.reply('Este/a jugador/a no esta en el servidor.')
       }
      }else{
         message.reply('Para completar el comando "kick" necesito que especifiques un usuario.')
      }
    break;
    case 'imagen':
    image(message, args);
    break;
    case 'avances':
      embed
      .setTitle('Avances Alvin')
      .addField('En proceso', 'Actualmente trabajando en la funcionalidad "Musica", que va a servir para reproducir musica mientras se juega.')
      .setFooter('Usá ".comandos" para ver todos mis comandos disponibles!', client.user.avatarURL())
      .setColor('YELLOW')
      message.channel.send(embed);
    break;
    case 'p':

      function play(connection, message){
        
        var server = servers[message.guild.id];
        
        server.dispatcher = connection.play(ytdl(server.queue[0], {filter:"audioonly"}));

        server.queue.shift();
        
        server.dispatcher.on("end", function(){
          if(server.queue[0]){
            play(connection, message);
          }else{
            connection.disconnect();
          }
        });
      }

      if(!args[0]){
        message.reply('para poder poner la cancion, necesito que me des un link.');
        return;
      }
      if(!message.member.voice.channel){
        message.reply('para que pueda poner musica necesito que estes en un canal de voz');
        return;
      }
      if(!servers[message.guild.id]) servers[message.guild.id] = {
        queue: []

      }

      var server = servers[message.guild.id];

      server.queue.push(args[1]);

      if(!message.guild.voiceConnection) message.member.voice.channel.join().then(function(connection){
        play(connection, message);
      })
    break;
    case 'stop':
      var server = servers[message.guild.id];
        if(server.dispatcher) server.dispatcher.end();
    break;
    case 'stop':
      if(message.guild.voiceConnection){
        for(var i = server.queue.length -1; 1 >= 0; i--){
          server.queue.splice(i, 1);
        }

        server.dispatcher.end();
        console.log('stopped the queue')
      }
      if(message.guild.connection) message.guild.voiceConnection.disconnect();
    break;
      
  }
});

function image(message, args) {

  var search = args.slice(1).join(" ");

  var options = {
    url: "http://results.dogpile.com/serp?qc=images&q=" + search,
    method: 'GET',
    headers: {
      'Accept': 'text/html',
      'User-Agent': 'Chrome'
    }
  };

  request(options, function (error, response, responseBody) {
    if (error) {
      return;
    }


    $ = cheerio.load(responseBody);


    var links = $(".image a.link");

    var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));

    if (!urls.length) {

      return;
    }

    // Send result
    message.channel.send(urls[Math.floor(Math.random() * urls.length)]);
  });
}

// mensajes sin prefijo

client.on('message', msg =>{
    if (msg.author == client.user){return}
    let message = msg.content.toLowerCase()
    if(message.includes('te odio alvin')){
        msg.react('😥');
    }
});

client.on('message', msg =>{
    if (msg.author == client.user){return}
    let message = msg.content.toLowerCase()
    if(message.includes('te amo alvin')){
        msg.channel.send(':kiss:');
    }
});

client.on('message', msg => {
    var Mensajes = [`Chau!!!`, "Hasta pronto!", "Nos vemos...", "Te voy a estar esperando!"];
    var aleatorio = Math.floor(Math.random()*(Mensajes.length));
    if (msg.author == client.user){return}
    let message = msg.content.toLowerCase()
    if (message.includes("chau") ) {
      msg.channel.send(Mensajes[aleatorio]);
    }
  });

  client.on('message', msg => {
    var Mensajes = [`Hola!`, "Buenos dias/tardes/noches!", "Hola, que gusto verte!"];
    var aleatorio = Math.floor(Math.random()*(Mensajes.length));
    if (msg.author == client.user){return}
    let message = msg.content.toLowerCase()
    if (message.startsWith("hola") ) {
      msg.channel.send(Mensajes[aleatorio]);
    }
  });

  client.on('message', msg => {
    var Mensajes = [`Todo perfecto!`, "Bien :)", "Hoy fue un día duro en el trabajo... pero todo bien!", "Todo bien, todo correcto..."];
    var aleatorio = Math.floor(Math.random()*(Mensajes.length));
    if (msg.author == client.user){return}
    let message = msg.content.toLowerCase()
    if (message.includes("como estas") ) {
      msg.channel.send(Mensajes[aleatorio]);
    }
  });

//client.login(process.env.TOKEN);
//client.login('NzYxNjUyNzM1MjI1MjMzNDU4.X3duYg._9YqfzHMFRF062HZX-a548Ptdbw');
client.login();