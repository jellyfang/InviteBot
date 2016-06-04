var builder = require('botbuilder')
var prompts = require('../prompts')
var http = require('http')

module.exports = {
	addDialogs: addDialogs
}


function addDialogs(bot) {
	bot.add('/intro', [
		function (session) {
            console.log('STEP 1 - INTRO')

            // set the first run so the bot alternates to intro instead
            session.userData.firstRun = true

            // who's talking?
            console.log('User name: ', session.message.from.name)
            console.log('User FB id: ', session.message.from.address)
            console.log('User Bot id: ', session.message.from.id)
            console.log('User data: ', session.userData)

            // send an image message
            var snap = new builder.Message()
                .addAttachment({
                    contentUrl: "http://media1.popsugar-assets.com/files/2012/05/20/2/192/1922398/75f51984d7df610b_8693004e9eca11e18bb812313804a181_7.xxxlarge/i/Jason-Derulo-stayed-busy-studio.jpeg",
                    contentType: "image/jpeg"
                })
            session.send(snap)

            // create custom intro message
			var username = session.message.from.name.split(' ')[0]
			var introMessage = `Yo, ${username}! My new album 'Accelerate' is coming out soon, do you want me to send it to you before I send it to everyone else?`

            // create intro actions
            var introActions = {
                    "type": "Message",
                    "attachments": [
                        {
                           "text": introMessage,
                            "actions": [
                                {
                                    "title": "Yes!",
                                    "message": "yes"
                                },
                                {
                                    "title": "I have a secret code :)",
                                    "message": "verify"
                                }
                            ]
                        }
                    ]
                }

            // reply back with intro
			builder.Prompts.text(session, welcomeActions)
		},
		function (session, results, next) {
            console.log('STEP 2 - WELCOME')

            // what did user decide
            console.log(results)

            if (results.response=='yes') {
                // user now opted in
                session.userData.optin = true
                session.replaceDialog('/shareCode')
            } else if (results.response=='verify') {
                session.replaceDialog('/verifyCode')
            } else {
                session.replaceDialog('/optout')
            }
		},
	])
}



