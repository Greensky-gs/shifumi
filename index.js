const Discord = require('discord.js'); //get module for client and embeds

const client = new Discord.Client(); //Create a new client

const configs = {
  prefix: '!', //place here the prefix of your bot
  token: 'Secret token of your bot goes here'
};

client.on('message', (message) => {
  if (!message.content.startsWith(configs.prefix) || message.author.bot) return; //stop command if the content not starts with the prefix, or he is a bot. Additonal add if command is ran un direct messages. Just add this : || !message.guild
  
  var args = message.content.slice(configs.prefix.length).trim().split(' '); //get args
  const commandName = args.shift().toLowerCase(); //get the name of the command ran by user
  
  if (commandName === 'shifumi') /* If the command is shifumi */ {
    const signs = [
      {name: 'rock', value: '0', emoji: '✊'},
      {name: 'paper', value: '1', emoji: '📜'},
      {name: 'cisors', value: '2', emoji: '✂'}
    ];
    
    const botSign = signs[Math.floor(Math.random() * signs.length)];
    message.channel.send(new Discord.MessageEmbed()
      .setTitle("Sign")
      .setDescription(`Choose your sign, ✊ for rock, 📜 for paper and ✂ for cisors`)
      .setColor('ORANGE')
      .setTimestamp()
    ).then((msg) => {
       signs.forEach(/* don't forget async statement */async(sign) => {
          await msg.react(sign.emoji);
       });
       const collector = msg.createReactionCollector((reaction, user) => signs.find(x => x.emoji === reaction) && user.id === message.author.id, { time: 12000 });
       collector.on('collect', (reaction, user) => {
          const userSign = signs.find((sign) => sign.emoji === reaction.emoji.name);
          let rep;
          if (botSign.value === userSign.value) rep = 'tie';
          if (botSign.value === '0' && userSign.value === '1') {
            rep = 'user';
          } else if (botSign.value === '0' && userSign.value === '2') {
              rep = 'bot';
          };
         if (botSign.value === '1' && userSign.value === '0') {
            rep = 'bot';
          } else if (botSign.value === '1' && userSign.value === '2') {
              rep = 'user';
          };
         if (botSign.value === '2' && userSign.value === '1') {
            rep = 'bot';
          } else if (botSign.value === '2' && userSign.value === '0') {
              rep = 'user';
          };
         
         const embed = new Discord.MessageEmbed()
         .setTitle("Shifumi")
         .setAuthor(`${message.author.username} ${userSign} VS ${botSign} ${client.user.username}`)
         .setTimestamp()
         
         if (rep === 'user') {
          embed.setDescription(`You win !`)
          embed.setColor('GREEN');
          //you can add additional code (like earn 50 coins)
         } else if (rep === 'bot') {
          embed.setDescription("You loose");
          embed.setColor('RED')
          //also can add additional code
         } else {
           embed.setDescription(`Tie !`)
           embed.setColor('ORANGE')
         }
         message.channel.send(embed);
         collector.stop();
       });
      
        collector.on('end', (collected) => {
          msg.delete().catch(() => {});
          if (!collected.size) message.channel.send(":x: | You haven't reacted to message").catch(() => {});
        });
    });
  };
});

client.login(configs.token);
