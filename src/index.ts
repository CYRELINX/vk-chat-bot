import { VK, Keyboard, IMessageContextSendOptions, ContextDefaultState, MessageContext, VKAppPayloadContext, KeyboardBuilder } from 'vk-io';
import { HearManager } from '@vk-io/hear';
import { PrismaClient } from '@prisma/client'
import {
    QuestionManager,
    IQuestionMessageContext
} from 'vk-io-question';
import { randomInt } from 'crypto';
import { timeStamp } from 'console';
import { registerUserRoutes } from './engine/player'
import { InitGameRoutes } from './engine/init';
import { send } from 'process';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { env } from 'process';
const Fuse = require("fuse.js")
const natural = require('natural');
const translate = require('secret-package-for-my-own-use');
dotenv.config()
export const token: string = String(process.env.token)
export const root: number = Number(process.env.root) //root user
export const chat_id: number = Number(process.env.chat_id) //chat for logs
export const group_id: number = Number(process.env.group_id)//clear chat group
export const timer_text = { answerTimeLimit: 300_000 } // ожидать пять минут
export const answerTimeLimit = 300_000 // ожидать пять минут
//авторизация
export const vk = new VK({ token: token, /*pollingGroupId: group_id,*/ apiMode: "sequential", apiLimit: 1 });
//инициализация
const questionManager = new QuestionManager();
const hearManager = new HearManager<IQuestionMessageContext>();
export const prisma = new PrismaClient()

export const tokenizer = new natural.AggressiveTokenizerRu()
export const tokenizer_sentence = new natural.SentenceTokenizer()
/*prisma.$use(async (params, next) => {
	console.log('This is middleware!')
	// Modify or interrogate params here
	console.log(params)
	return next(params)
})*/

//настройка
vk.updates.use(questionManager.middleware);
vk.updates.on('message_new', hearManager.middleware);

//регистрация роутов из других классов
InitGameRoutes(hearManager)
registerUserRoutes(hearManager)
function deleteDuplicate(a: any){a=a.toString().replace(/ /g,",");a=a.replace(/[ ]/g,"").split(",");for(var b: any =[],c=0;c<a.length;c++)-1==b.indexOf(a[c])&&b.push(a[c]);b=b.join(", ");return b=b.replace(/,/g," ")};
//миддлевар для предварительной обработки сообщений
vk.updates.on('message_new', async (context: any, next: any) => {
	if (context.isOutbox == false) {
		const data_old = Date.now()
        let count = 0
        let count_circle = 0
		const sentence: Array<string> = tokenizer_sentence.tokenize(context.text.toLowerCase())
		
        //const temp: Array<string> = context.text.toLowerCase().replace(/[^а-яА-Я ]/g, "").split(/(?:,| )+/)
		const word_dictionary = await prisma.dictionary.findMany()
		const options = { includeScore: true, location: 2, threshold: 0.6, distance: 1, ignoreFieldNorm: true, keys: ['name'] }
		const fuse = new Fuse(word_dictionary, options)
		let ans: string = ''
		let finres: string = ''
		for (const stce in sentence) {
			const temp: Array<string> = tokenizer.tokenize(sentence[stce])
			if (temp.length > 1) {
				for (let j = 0; j < temp.length-1; j++) {
					const word = temp[j].toLowerCase()
					const finder = fuse.search(word)
					let clear: Array<string> = []
					for (const i in finder) {
						if (finder[i].score == finder[0].score) {
							clear.push(finder[i].item.name)
						}
					}
					const corrector = clear.length > 1 ? clear[randomInt(0, clear.length+1)] : finder[0].item.name
					finres += `${corrector} `
					const find_one = await prisma.word_Couple.findMany({ where: { name_word_first: corrector }})
					if (find_one.length >= 1) {
						ans += find_one.length > 1 ? `${find_one[randomInt(0, find_one.length)].name_word_first} ${find_one[randomInt(0, find_one.length)].name_word_second} ` : `${find_one[0].name_word_first} ${find_one[0].name_word_second} `
						count++
					}
					count_circle++
				}   
			} else {
				const word = context.text.toLowerCase()
				const finder = fuse.search(word)
				let clear: Array<string> = []
				for (const i in finder) {
					if (finder[i].score == finder[0].score) {
						clear.push(finder[i].item.name)
					}
				}
				const corrector = clear.length > 1 ? clear[randomInt(0, clear.length+1)] : finder[0].item.name	
				finres += `${corrector} `	
				const find_one = await prisma.word_Couple.findMany({ where: { name_word_first: corrector }})
				if (find_one.length >= 1) {
					ans += find_one.length > 1 ? `${find_one[randomInt(0, find_one.length)].name_word_first} ${find_one[randomInt(0, find_one.length)].name_word_second} ` : `${find_one[0].name_word_first} ${find_one[0].name_word_second} `
					count++
				}
				count_circle++
			}
			try {
				const res = await translate(`${ans ? ans : "Я не понимаю"}`, { from: 'auto', to: 'en', autoCorrect: true });
				if (res.text == "I don't understand") { console.log(`Получено сообщение: ${context.text}, но ответ не найден`); return }
				const fin = await translate(`${res.text ? res.text : "Я не понимаю"}`, { from: 'en', to: 'ru', autoCorrect: true });
				console.log(` Получено сообщение: [${context.text}] \n Исправление ошибок: [${finres}] \n Сгенерирован ответ: [${deleteDuplicate(fin.text)}] \n Количество итераций: [${count_circle}] \n Затраченно времени: [${(Date.now() - data_old)/1000} сек.]\n\n`)
				await context.send(`${deleteDuplicate(fin.text)}`)
			} catch {
				console.log(`Авария, Получено сообщение: ${context.text} Сгенерирован ответ: ${deleteDuplicate(ans)}, Сложность: ${count_circle} Затраченно времени: ${(Date.now() - data_old)/1000} сек.`)
				await context.send(`${deleteDuplicate(ans)}`)
			}
		}
	}
	return next();
})
vk.updates.on('message_event', async (context: any, next: any) => { 
	//const data = await Book_Random_String('./src/book/tom1-7.txt')
	//context.answer({type: 'show_snackbar', text: `🔔 ${data.slice(0,80)}`})
	return next();
})
vk.updates.start().then(() => {
	console.log('LongPool server up!')
}).catch(console.log);