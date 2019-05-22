import requests
import smtplib

from email.mime.text import MIMEText
from email.utils import formatdate


def disposableEmail(email):
    if not email:
        return 0

    r = requests.get(
        "https://raw.githubusercontent.com/martenson/disposable-email-domains/master/disposable_email_blocklist.conf")
    print(type(r.text))
    urls = r.text.strip().split("\n")
    urlTest = email.split("@")
    if urlTest[-1] in urls:
        return 1
    else:
        return 0


def sendMessage(subject, message, fromEmail="email@andreahasani.com"):
    msg = MIMEText(message)
    msg['From'] = fromEmail
    msg['To'] = "email@andreahasani.com"
    msg['Subject'] = subject
    msg['Date'] = formatdate()
    msg['X-Domain'] = "andreahasani.com"
    msg['X-System'] = "python"

    server = smtplib.SMTP('172.17.0.1')
    server.sendmail(fromEmail, 'email@andreahasani.com', msg.as_string())
