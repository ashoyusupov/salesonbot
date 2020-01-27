const TelegramBot  = require('node-telegram-bot-api')
const config = require('./config/config')
const { sequelize } = require('./models')
const TgController = require('./controllers/TgController')

const TOKEN = config.salesonbot.token

const bot = new TelegramBot(TOKEN,{
	webHook: {
		port: config.salesonbot.port,
		autoOpen: false
	}
})

const sessTg = {}
const saveDone = 'Запрос Создан'
const welcomeMessage = '<b>Добро пожаловать в Salesonbot!</b>\nВыберите язык:\n👇'
const library = {
	'startMessage': {
		'ru': 'Начни свой путь к мечте! Зарабатывай с нами!',
		'uz': 'Omadingiz biz bilan keladi! Pul topishni boshlang!',
	},
	'startButton': {
		'ru': '💵 Начать работать',
		'uz': '💵 Pul topish',
	},
	'cooperation': {
		'ru': '👨‍💻️ Сотрудничество',
		'uz': '👨‍💻️ Hamkorlik',		
	},
	'mydata': {
		'ru': 'ℹ️ Мои данные',
		'uz': 'ℹ️ Ma\'lumotim',		
	}
}

const formHeader = '<b>Добавление нового клиента</b>\nПожалуйста, заполните поля ниже\nЖирные пункты обязательны для заполнения\n👇\n\n'
const formFields = {
	'tovarimya': {
		'langRU': 'Имя и Фамилия клиента',
		'smile': '📝',
		'inputMess': '<b>Введите Имя и Фамилия клиента:</b>\n👇'
	},
}
const settFields = {
	'settingimya': {
		'langRU': 'Изменить ФИО',
		'smile': '📝',
		'inputMess': '<b>Введите Ваше ФИО:</b>\n👇'
	},
	'settingregion': {
		'langRU': 'Ваш Город',
		'smile': '🏙️',
		'inputMess': '<b>Выберите Ваш Город:</b>\n👇'
	},
	'instruction': {
		'langRU': 'Как это работает?',
		'smile': '📜',
		'inputMess': '<b>Скоро</b>'
	},
	'feedback': {
		'langRU': 'Оставить отзыв',
		'smile': '✍️',
		'inputMess': '<b>Введите ваш отзыв:</b>\n👇'
	},
}

const zakaztips = Object.keys(formFields)
const settTips = Object.keys(settFields)

const tipGruza = [
	'Авто, мототехника','Бытовая техника','ЖД перевозки',
	'Запчасти','Контейнерные перевозки','Личные вещи','Мебель','Металл','Наливной груз',
	'Негабаритные грузы','Оборудование','Опасные грузы','Пассажирские перевозки',
	'Перевозка животных','Переезд','Пиломатериал','Попутный груз','Продукты питания',
	'Прочие грузы','Стройматериалы','Сыпучий груз'
]

/*const regions = [
	'Беруни',	'Бустан',	'Кунград',	'Мангит',	'Муйнак',	'Нукус',	'Тахиаташ',	'Турткуль',	'Халкабад',	'Ходжейли',	'Чимбай',	'Шуманай',	'Андижан',	'Асака',	'Джалакудук',	'Карасу',	'Кургантепа',	'Мархамат',	'Пайтуг',	'Пахтаабад',	'Ханабад',	'Ходжаабад',	'Шахрихан',	'Алат',	'Бухара',	'Вабкент',	'Газли',	'Галаасия',	'Гиждуван',	'Каган',	'Каракуль',	'Караулбазар',	'Ромитан',	'Шафиркан',	'Гагарин',	'Галляарал',	'Даштабад',	'Джизак',	'Дустлик',	'Пахтакор',	'Бешкент',	'Гузар',	'Камаши',	'Карши',	'Касан',	'Китаб',	'Мубарек',	'Талимарджан',	'Чиракчи',	'Шахрисабз',	'Яккабаг',	'Янги-Нишан',	'Зарафшан',	'Кызылтепа',	'Навои',	'Нурата',	'Учкудук',	'Янгирабад',	'Касансай',	'Наманган',	'Пап',	'Туракурган',	'Учкурган',	'Хаккулабад',	'Чартак',	'Чуст',	'Акташ',	'Булунгур',	'Джамбай',	'Джума',	'Иштыхан',	'Каттакурган',	'Нурабад',	'Пайарык',	'Самарканд',	'Ургут',	'Челек',	'Байсун',	'Денау',	'Джаркурган',	'Кумкурган',	'Термез',	'Шаргунь',	'Шерабад',	'Шурчи',	'Бахт',	'Гулистан',	'Сырдарья',	'Ширин',	'Янгиер',	'Аккурган',	'Алмалык',	'Ангрен',	'Ахангаран',	'Бекабад',	'Бука',	'Газалкент',	'Дустабад',	'Келес',	'Нурафшон',	'Паркент',	'Пскент',	'Чиназ',	'Чирчик',	'Янгиабад',	'Янгиюль',	'Бешарык',	'Коканд',	'Кува',	'Кувасай',	'Маргилан',	'Риштан',	'Тинчлик',	'Фергана',	'Яйпан',	'Питнак',	'Ургенч',	'Хива',	'Ташкент'
]*/

const array_mainmenu = [
	[
		{
			text: '🇺🇿 O\'zbekcha',
			callback_data: 'lang_uz'
		}
	],
	[
		{
			text: '🇷🇺 Русский',
			callback_data: 'lang_ru'
		}
	]
]

const array_mainmenu_approved = [
	[
		{
			text: '🛒 Отправить клиента',
			callback_data: 'zakaz'
		}
	],
	[
		{
			text: '⚙ Настройки',
			callback_data: 'settings'
		}
	]
]

function buttonGen(formFields, tips, stype) {
	let buttonlist = []

	for (let i=0; i < tips.length; i+=2) {

		let subsitelist = []

		if (i % 2 === 0) {
			if (tips.hasOwnProperty(i)) {
				subsitelist.push({
					text: formFields[tips[i]]['smile']+' '+ formFields[tips[i]]['langRU'],
					callback_data: tips[i]
				})
			}
			if (tips.hasOwnProperty(i+1)) {
				subsitelist.push({
					text: formFields[tips[i+1]]['smile']+' '+ formFields[tips[i+1]]['langRU'],
					callback_data: tips[i+1]
				})
			}
		} else {
			subsitelist.push({
				text: formFields[tips[i+1]]['smile']+' '+ formFields[tips[i+1]]['langRU'],
				callback_data: tips[i+1]
			})
		}

		buttonlist.push(subsitelist)
	}
	if (stype!='setting') {
		if (tips.length>1) {
			buttonlist.push([{text: '✉️ Отправить клиента', callback_data: 'sozdatzakaz'}])
		}		
	}
	
	buttonlist.push([{text: '◀ Назад', callback_data: 'main'}])

	return buttonlist
}

const zakazMessage = (chat_id, sessionTg) => {
	return new Promise(function(resolve) {

		let temptext = formHeader
		for (let index in zakaztips) {			
			temptext += (typeof sessionTg[chat_id]['zakazData'][zakaztips[index]] === 'undefined' ? '🛑' : '✅' ) + 
			' <b>' + formFields[zakaztips[index]]['langRU'] + '</b>: <i>' + 
			(typeof sessionTg[chat_id]['zakazData'][zakaztips[index]] === 'undefined' ? ' нет инфо' : 
				(zakaztips[index]=='tovartip' ? tipGruza[sessionTg[chat_id]['zakazData'][zakaztips[index]]] : sessionTg[chat_id]['zakazData'][zakaztips[index]])) + '</i>\n'

			console.log(zakaztips[index])
		}
		

		resolve(temptext)

	})
}
const updateData = (chat_id, input, column) => {
	return new Promise(function(resolve) {
		
		let resultmessage = {}

		TgController.updateUser(chat_id, column, input).then( result => {
			console.log(result)
			if (result.length > 0) {
				resultmessage.check = true
				resultmessage.text = 'Изменения сохранены'
			} else {
				resultmessage.check = false
				resultmessage.text = 'Изменения не сохранены'
			}
			resolve(resultmessage)
		})

	})
}
const checkZakaz = (chat_id, query_id, sessionTg) => {
	return new Promise(function(resolve) {

		let temptext = 'Для создании заказа Вам необходимо заполнить:\n'
		let ctn = 0
		for (let index in zakaztips) {
			if (typeof sessionTg[chat_id]['zakazData'][zakaztips[index]] === 'undefined') {
				temptext += '⚠️ ' + formFields[zakaztips[index]]['langRU'] + '\n'
				ctn += 1
			}
		}
		
		let resultmessage = {}
		
		if (ctn>0) {
			resultmessage.check = false
			resultmessage.text = temptext
		} else {
			resultmessage.check = true
			resultmessage.text = saveDone
		}
		resolve(resultmessage)

	})
}

sequelize.sync({ force: false })
	.then(() => {
		console.log(`Server started on port ${config.salesonbot.port}`)
	})

bot.openWebHook()
bot.setWebHook(`${config.salesonbot.url}/bot${TOKEN}`)

let zakazMenu = buttonGen(formFields, zakaztips, 'zakaz')

bot.on('message', msg =>{
	console.log(msg)	
	
	if(!sessTg.hasOwnProperty(msg.chat.id)){
		sessTg[msg.chat.id] = {
			id: msg.chat.id
		}
	}
	console.log(sessTg)
	
	if (msg.chat.id>0 ) {
			
		if (msg.text=='/start') {

			TgController.checkUser(msg.chat.id).then( result => {
				console.log(result)
				if (result.length == 0) {
					TgController.newUser(msg.chat.id, msg).then( () => {						
						bot.sendMessage(msg.chat.id, welcomeMessage, {
							parse_mode : 'HTML',
							reply_markup: {
								inline_keyboard: array_mainmenu,
								remove_keyboard: true
							}
						})
					})
				} else {
					bot.sendMessage(msg.chat.id, welcomeMessage, {
						parse_mode : 'HTML',
						reply_markup: {
							inline_keyboard: array_mainmenu,
							remove_keyboard: true
						}
					})
				}
			})
			sessTg[msg.chat.id]['zakazStep'] = {}
			sessTg[msg.chat.id]['zakazData'] = {}
			sessTg[msg.chat.id]['language'] = 'ru'

		}

		if(sessTg[msg.chat.id].zakazStep == 'settingimya'){			

			updateData(msg.chat.id, msg.text, 'fio').then( res => {
				bot.sendMessage(msg.chat.id, res.text).then(() => {
					bot.sendMessage(msg.chat.id, 'Ваши Настройки', {
						parse_mode : 'HTML',
						reply_markup: {
							inline_keyboard: buttonGen(settFields, settTips, 'setting'),
							remove_keyboard: true
						}
					})
				})
			})
		}

		if(sessTg[msg.chat.id].zakazStep == 'settingregion'){

			updateData(msg.chat.id, msg.text, 'city').then( res => {
				bot.sendMessage(msg.chat.id, res.text).then(() => {
					bot.sendMessage(msg.chat.id, 'Ваши Настройки', {
						parse_mode : 'HTML',
						reply_markup: {
							inline_keyboard: buttonGen(settFields, settTips, 'setting'),
							remove_keyboard: true
						}
					})
				})
			})
		}

		if(sessTg[msg.chat.id].zakazStep == 'feedback'){

			TgController.newFeedback(msg.chat.id, msg.text).then(() => {
				bot.sendMessage(msg.chat.id, 'Отзыв создан').then(() => {
					bot.sendMessage(msg.chat.id, welcomeMessage, {
						parse_mode : 'HTML',
						reply_markup: {
							inline_keyboard: buttonGen(settFields, settTips, 'setting'),
							remove_keyboard: true
						}
					})
				})
			})
		}

	}

})

// let mtext = '<b>Добавить объявление о грузе</b>\nПожалуйста, заполните поля ниже\nЖирные пункты обязательны для заполнения\n👇\n'

bot.on('callback_query', async query => {
	// console.log(query)
	const { message: {chat/*, message_id, text */}} = query
	let qcallback = query.data.split('_')
	let sitelist = []
	//let regionlist = []

	if(!sessTg.hasOwnProperty(chat.id)){
		sessTg[chat.id] = {
			id: chat.id
		}
	}
	sessTg[chat.id]['zakazStep'] = qcallback[0]
	
	if(!sessTg[chat.id].hasOwnProperty('zakazData')){
		sessTg[chat.id]['zakazData'] = {}
	}
	let queryMess = qcallback[0]
	switch (queryMess) {
	case 'lang':

		updateData(chat.id, qcallback[1], 'language').then( () => {
			
			sessTg[chat.id]['language'] = qcallback[1]
			bot.sendMessage(chat.id, library.startMessage[qcallback[1]], {
				parse_mode : 'HTML',
				reply_markup: {
					inline_keyboard: [
						[
							{
								text: library.startButton[qcallback[1]],
								callback_data: 'startButton'
							}
						],
						[
							{
								text: library.cooperation[qcallback[1]],
								callback_data: 'cooperation'
							}
						],
						[
							{
								text: library.mydata[qcallback[1]],
								callback_data: 'mydata'
							}
						]
					],
					remove_keyboard: true
				}
			})
		
		})

		bot.answerCallbackQuery({ callback_query_id: query.id})

		break
	case 'startButton':
		bot.sendPhoto(chat.id,__dirname+'/pics/i.jfif',{
			disable_web_page_preview: true,
			caption: '📣 Участвуйте в конкурсе!',
			reply_markup: {				
				inline_keyboard: [
					[
						{
							text: 'Подписаться',
							url: 'https://t.me/joinchat/AAAAAD7nPclimW9nHkifZw'
						}
					],
					[
						{
							text: 'Подписаться 2',
							url: 'https://t.me/joinchat/AAAAAE3Wso_nrStU6dYaOw'
						}
					]
				]
			}
		})
		bot.answerCallbackQuery({ callback_query_id: query.id})
		break
	case 'cooperation':
		bot.sendMessage(chat.id, 'cooperation')
		bot.answerCallbackQuery({ callback_query_id: query.id})
		break
	case 'mydata':
		bot.sendMessage(chat.id, 'mydata')
		bot.answerCallbackQuery({ callback_query_id: query.id})
		break
	case 'sozdatzakaz':
		checkZakaz(chat.id, query.id, sessTg).then( restext => {
			if (restext.check) {
				console.log('newOrder', sessTg[chat.id]['zakazData'])
				TgController.newOrder(chat.id, sessTg[chat.id]['zakazData']).then((res) => {
					bot.sendMessage(70061654, '✅ Новый запрос #'+res.dataValues.order_id+': '+sessTg[chat.id]['zakazData'].tovarimya+'\n от '+res.dataValues.fio_vrach)
					bot.sendMessage(153022142, '✅ Новый запрос #'+res.dataValues.order_id+': '+sessTg[chat.id]['zakazData'].tovarimya+'\n от '+res.dataValues.fio_vrach)
					// bot.sendMessage(239764523, '✅ Новый запрос #'+res)
					bot.sendMessage(chat.id, welcomeMessage, {
						parse_mode : 'HTML',
						reply_markup: {
							inline_keyboard: array_mainmenu_approved,
							remove_keyboard: true
						}
					})
					sessTg[chat.id]['zakazStep'] = {}
					sessTg[chat.id]['zakazData'] = {}

					bot.answerCallbackQuery({
						callback_query_id: query.id,
						text: restext.text
					})
				})
			} else {
				bot.answerCallbackQuery({
					callback_query_id: query.id,
					text: restext.text,
					show_alert: true
				})
			}
		})
		break
	case 'instruction':
		bot.answerCallbackQuery({
			callback_query_id: query.id,
			text: 'Скоро',
			show_alert: true
		})
		break
	case 'main':
		TgController.checkUser(chat.id).then( result => {
			if (result.length == 0) {
				bot.sendMessage(chat.id, welcomeMessage, {
					parse_mode : 'HTML',
					reply_markup: {
						inline_keyboard: array_mainmenu,
						remove_keyboard: true
					}
				})
			} else {
				bot.sendMessage(chat.id, welcomeMessage, {
					parse_mode : 'HTML',
					reply_markup: {
						inline_keyboard: array_mainmenu_approved,
						remove_keyboard: true
					}
				})
			}
		})
		bot.answerCallbackQuery({ callback_query_id: query.id})
		break
	case 'zakaz': {

		zakazMessage(chat.id, sessTg).then( text => {
			bot.sendMessage(chat.id, text, {
				parse_mode : 'HTML',
				reply_markup: {
					inline_keyboard: zakazMenu,
					remove_keyboard: true
				}
			})
		})
		bot.answerCallbackQuery({ callback_query_id: query.id})		
		break
	}
	case 'tovarname':
	case 'tovarotkuda':
	case 'tovarkuda':
	case 'tovarobyom':
	case 'tovarves':
	case 'tovarimya':
		bot.sendMessage(chat.id, formFields[queryMess]['inputMess'], {
			parse_mode : 'HTML',
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: '◀ Назад',
							callback_data: 'zakaz'
						}
					]
				],
				remove_keyboard: true
			}
		})
		bot.answerCallbackQuery({ callback_query_id: query.id})
		break
	case 'registration':{
		bot.sendMessage(chat.id, 'Для регистрации, нажмите кнопку\n<b>📲 Отправить номер</b>', {
			parse_mode : 'HTML',
			reply_markup: {
				one_time_keyboard: true,
				resize_keyboard: true,
				keyboard: [[{
					text: '📲 Отправить номер',
					request_contact: true
				}]]
			}
		})

		bot.answerCallbackQuery({ callback_query_id: query.id})
		break
	}
	case 'tovarmobil':{
		bot.sendMessage(chat.id, formFields[queryMess]['inputMess'], {
			parse_mode : 'HTML',
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: '◀ Назад',
							callback_data: 'zakaz'
						}
					]
				],
				remove_keyboard: true
			}
		})
		let option = {
			parse_mode: 'HTML',
			reply_markup: {
				one_time_keyboard: true,
				resize_keyboard: true,
				keyboard: [[{
					text: '📲 Отправить номер',
					request_contact: true
				}]]
			}
		}
		bot.sendMessage(chat.id, 'Для отправки номер Телеграма, нажмите кнопку\n<b>📲 Отправить номер</b>', option)

		bot.answerCallbackQuery({ callback_query_id: query.id})
		break
	}
	case 'tovartip': {
		for (let index in tipGruza) {
			let subsitelist = []
			subsitelist.push({text: tipGruza[index],callback_data: 'forsave_tovartip_' + index })
			sitelist.push(subsitelist)
		}
		sitelist.push( [{text: '◀ Назад',callback_data: 'zakaz'}])

		bot.sendMessage(chat.id, formFields[queryMess]['inputMess'], {
			parse_mode : 'HTML',
			reply_markup: {
				inline_keyboard: sitelist,
				remove_keyboard: true
			}
		})
		bot.answerCallbackQuery({ callback_query_id: query.id})
		break
	}
	case 'forsave': {
		
		sessTg[chat.id]['zakazData'][qcallback[1]] = qcallback[2]

		zakazMessage(chat.id, sessTg).then( text => {
			bot.sendMessage(chat.id, text, {
				parse_mode : 'HTML',
				reply_markup: {
					inline_keyboard: zakazMenu,
					remove_keyboard: true
				}
			})
		})

		bot.answerCallbackQuery({ callback_query_id: query.id})
		break
	}
	case 'settings': {

		bot.sendMessage(chat.id, 'Ваши Настройки', {
			parse_mode : 'HTML',
			reply_markup: {
				inline_keyboard: buttonGen(settFields, settTips, 'setting'),
				remove_keyboard: true
			}
		})
		bot.answerCallbackQuery({ callback_query_id: query.id})		
		break
	}
	case 'settingimya':
	case 'settingregion':
		bot.sendMessage(chat.id, settFields[queryMess]['inputMess'], {
			parse_mode : 'HTML',
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: '◀ Назад',
							callback_data: 'settings'
						}
					]
				],
				remove_keyboard: true
			}
		})
		bot.answerCallbackQuery({ callback_query_id: query.id})
		break
	case 'feedback':
		bot.sendMessage(chat.id, '<b>Введите Ваш отзыв:</b>\n👇', {
			parse_mode : 'HTML',
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: '◀ Назад',
							callback_data: 'settings'
						}
					]
				],
				remove_keyboard: true
			}
		})
		bot.answerCallbackQuery({ callback_query_id: query.id})
		break
	default:
		break
	}
	console.log(sessTg)
})

bot.on('text', msg =>{
	for (let index in zakaztips) {
		if(sessTg[msg.chat.id].zakazStep == zakaztips[index]){
			sessTg[msg.chat.id]['zakazData'][zakaztips[index]] = msg.text
			
			if (zakaztips.length==1) {				

				TgController.newOrder(msg.chat.id, { tovarimya: msg.text } ).then((res) => {
					console.log('res3',)
					//bot.sendMessage(239764523, 'Новый запрос: ')
					bot.sendMessage(70061654, '✅ Новый запрос #'+res.dataValues.order_id+': '+msg.text+'\n от '+res.dataValues.fio_vrach)
					bot.sendMessage(153022142, '✅ Новый запрос #'+res.dataValues.order_id+': '+msg.text+'\n от '+res.dataValues.fio_vrach)
					bot.sendMessage(msg.chat.id, 'Ваш запрос принят ✅', {
						parse_mode : 'HTML',
						reply_markup: {
							inline_keyboard: [
								[
									{
										text: '◀ Назад',
										callback_data: 'main'
									}
								]
							],
							remove_keyboard: true
						}
					}).then(() => {
						sessTg[msg.chat.id]['zakazStep'] = {}
						sessTg[msg.chat.id]['zakazData'] = {}
					})
				})

			} else {
				zakazMessage(msg.chat.id, sessTg).then( text => {
					bot.sendMessage(msg.chat.id, text, {
						parse_mode : 'HTML',
						reply_markup: {
							inline_keyboard: zakazMenu,
							remove_keyboard: true
						}
					})
				})	
			}			
		}
	}
	console.log(sessTg)
})

bot.on('contact', msg =>{
	
	if(sessTg[msg.chat.id].zakazStep == 'tovarmobil'){
		sessTg[msg.chat.id]['zakazData'].tovarmobil = msg.contact.phone_number

		zakazMessage(msg.chat.id, sessTg).then( text => {
			bot.sendMessage(msg.chat.id, text, {
				parse_mode : 'HTML',
				reply_markup: {
					inline_keyboard: zakazMenu,
					remove_keyboard: true
				}
			})
		})
	}
	
	if(sessTg[msg.chat.id].zakazStep == 'registration'){

		TgController.newUser(msg.chat.id, msg).then(function(res) {
			if (res[1]) {
				TgController.checkUser(msg.chat.id).then( result => {
					bot.sendMessage(msg.chat.id, 'Регистрация успешна').then(() => {
						if (result.length == 0) {
							bot.sendMessage(msg.chat.id, welcomeMessage, {
								parse_mode : 'HTML',
								reply_markup: {
									inline_keyboard: array_mainmenu,
									remove_keyboard: true
								}
							})
						} else {
							bot.sendMessage(msg.chat.id, welcomeMessage, {
								parse_mode : 'HTML',
								reply_markup: {
									inline_keyboard: array_mainmenu_approved,
									remove_keyboard: true
								}
							})
						}
					})
				})
			} else {
				TgController.checkUser(msg.chat.id).then( result => {
					bot.sendMessage(msg.chat.id, 'Вы уже зарегистрированы').then(() => {
						if (result.length == 0) {
							bot.sendMessage(msg.chat.id, welcomeMessage, {
								parse_mode : 'HTML',
								reply_markup: {
									inline_keyboard: array_mainmenu,
									remove_keyboard: true
								}
							})
						} else {
							bot.sendMessage(msg.chat.id, welcomeMessage, {
								parse_mode : 'HTML',
								reply_markup: {
									inline_keyboard: array_mainmenu_approved,
									remove_keyboard: true
								}
							})
						}		
					})
				})
			}
		})		
	}
	
	console.log(sessTg)
})