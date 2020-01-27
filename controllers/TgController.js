const { Users, Orders, Feedbacks } = require('../models')
const db = require('../models')

db.sequelize.getQueryInterface().showAllSchemas().then((tableObj) => {
	console.log('// Tables in database', '==========================')
	console.log(tableObj)
})

module.exports = {
	async updateUser (tgid, column, input) {
		try {
			let data = {}
			data[column] = input
			const result = await Users.update(
				data,
				{ where: { user_id: tgid } }
			)
			console.log('update', result)
			return result
		} catch (error) {
			console.log(error)
		}
	},
	async checkUser (tgid) {
		try {
			const users = await Users.findAll({
				raw: true,
				limit: 1,
				where: {
					user_id: tgid
				},
			})
			return users
		} catch (error) {
			console.log(
				'An error has occured while trying to fetch '+error
			)
		}
	},
	async onerecord () {
		try {
			const users = await Users.findAll({
				raw: true,
				limit: 10
			})
			return users
		} catch (error) {
			console.log(
				'An error has occured while trying to fetch the zakazs'
			)
		}
	},
	async newFeedback (tgid, meta) {
		try {			
			const fback = await Feedbacks.create({
				tgid: tgid,
				metadata: meta
			})
			return fback
		} catch (error) {
			console.log(
				'An error has occured while trying to fetch the zakazs'
			)
		}
	},
	async newOrder (tgid, meta) {
		try {
			const res = await Users.findAll({
				raw: true,
				limit: 1,
				where: {
					user_id: tgid
				},
			}).then( async (users) => {
				console.log('users1', users)
				const user = users[0]
				const metajson = JSON.stringify(meta)
				const result = await Orders.create({
					tgid: tgid,
					metadata: metajson,
					phone_number: user.phone_number,
					fio_vrach: user.fio,
					ostatus: 'NOT CONFIRMED'
				})
				return result
			})
			return res
		} catch (error) {
			console.log(
				'An error has occured while trying to fetch the zakazs'
			)
		}
	},
	async newUser (tgid, msg) {
		try {
			const created = await Users.findOrCreate({
				where: {//object containing fields to found
					user_id: tgid
				},
				defaults: {//object containing fields and values to apply
					tgid: tgid,
					username: msg.from.username,
					name: msg.from.first_name
				}
			})
			return created
			// const user = await Users.create({
			// 	tgid: tgid,
			// 	username: msg.from.username,
			// 	name: msg.from.first_name,
			// 	phone_number: msg.contact.phone_number
			// })
			// return user.id
		} catch (error) {
			console.log(
				'An error has occured while trying to fetch '+error
			)
		}
	}
}
