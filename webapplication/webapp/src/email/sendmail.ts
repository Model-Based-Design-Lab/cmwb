import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import requireText from 'require-text'
import { Logger } from 'winston'
// import { logger } from './config/winston'
import { BASE_PATH, BASE_URL, MAIL_HOST, MAIL_HOST_PORT } from '../config/config'
import { logger } from '../config/winston'

var transporter: Mail

export function setupSMTP(logger: Logger) {

    transporter = nodemailer.createTransport({
        host: MAIL_HOST,
        port: MAIL_HOST_PORT,
        secure: false
    })

    transporter.verify(function(error, _success){
        if(error){
            logger.error('SMTP verification failed')
            logger.error(`Error type: ${error.name}`)
            logger.error(`SMTP log: ${error}`)
        }
        else {
            logger.info('SMTP set up OK')
        }
    })
}


function sendHTMLEmail(htmlBodyTemplate: string, data: any, subject: string, recipientEmail: string) {

    var htmlBody = htmlBodyTemplate
    for (const [key, value] of Object.entries(data)) {
        const strValue = value as string
        const find = `%${key}%`
        const re = new RegExp(find, 'g')    
        htmlBody = htmlBody.replace(re, strValue)
    }

    
    const mailOptions = {
        from: 'noreply@tue.nl',
        to: recipientEmail,
        subject: subject,
        html: htmlBody
    }  

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            logger.error("Error in send mail.")
            logger.error("Error type:", error.name)
            logger.error("SMTP log:", error)
        }
        else {
            logger.info('Mail message sent: ' + info.response)
        }
    })
}

const makeLink = (userId: string, verificationToken: string) => `${BASE_URL}${BASE_PATH}/authentication/verify?userId=${userId}&token=${verificationToken}`


export function sendVerificationEmail(recipientEmail: string, recipientName: string, userId: string, verificationToken: string) {

    const verificationTemplate = requireText('./templates/verifyEmail.html', require)
    const data = {
        name: recipientName,
        email: recipientEmail,
        link: makeLink(userId, verificationToken)
    }

    sendHTMLEmail(verificationTemplate, data, "Computational Modeling Email Verification", recipientEmail)

}

export function sendResetPasswordEmail(recipientEmail: string, recipientName: string, userId: string, verificationToken: string) {

    const resetPasswordTemplate = requireText('./templates/resetPasswordEmail.html', require)
    const data = {
        name: recipientName,
        email: recipientEmail,
        link: makeLink(userId, verificationToken)
    }

    sendHTMLEmail(resetPasswordTemplate, data, "Computational Modeling Password Reset", recipientEmail)

}
