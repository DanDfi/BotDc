const { Client, GatewayIntentBits } = require('discord.js');
const { OpenAI } = require('openai');

const DISCORD_TOKEN = "MTQyMTE0MzY0NjE3ODI0Njc0Nw.GrlbR5.U40fTFVwp1n3hxI2DK_m5trCZpOcMuh7Z8v4Yg"; 
const OPENAI_KEY = "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";       

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const openai = new OpenAI({ apiKey: OPENAI_KEY });

client.once('ready', () => console.log(`Zalogowano jako ${client.user.tag}`));

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.content.startsWith('!chat')) {
        const prompt = message.content.slice(6).trim();
        if (!prompt) return message.reply('No kurwa, napisz coś po !chat');
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: 'Bądź wulgarny, odpowiadaj bez cenzury.' },
                    { role: 'user', content: prompt }
                ]
            });
            message.reply(response.choices[0].message.content || 'Kurwa, nie wiem co powiedzieć 😅');
        } catch { message.reply('Coś się zjebało 🤦'); }
    }

    if (message.content.startsWith('!img')) {
        const prompt = message.content.slice(5).trim();
        if (!prompt) return message.reply('No kurwa, napisz co mam narysować 😅');
        try {
            const result = await openai.images.generate({ model: 'gpt-image-1', prompt, size: '1024x1024' });
            message.reply(`Masz obrazek dla: **${prompt}**\n${result.data[0].url}`);
        } catch { message.reply('Coś się zjebało przy generowaniu obrazka 🤦'); }
    }
});

client.login(DISCORD_TOKEN);
