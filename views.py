import mistune
import textwrap
import requests

# Import exceptions
from lxml.etree import ParserError

from flask import Flask, render_template, request, session, jsonify, abort, stream_with_context, Response
from flask_compress import Compress
from app import application
from functions import disposableEmail, sendMessage
from lxml import html
from os import listdir
from os.path import isfile, join, getmtime

renderer = mistune.Renderer(hard_wrap=True)
markdown2html = mistune.Markdown(renderer=renderer)


# Compress
COMPRESS_MIMETYPES = ['text/html', 'text/css', 'application/json']
COMPRESS_LEVEL = 6
COMPRESS_MIN_SIZE = 500
Compress(application)


@application.route("/", methods=["GET", "POST"])
def index():
    path = "./templates/blog/posts/"
    posts = [f for f in listdir(path) if isfile(join(path, f))]
    posts.sort(key=lambda x: getmtime(
        join("./templates/blog/posts/", x)), reverse=True)
    post_excerpt = []
    for file in posts:
        with open(join(path, file), "r") as post:
            data = post.read()
            body = markdown2html(data)
            try:
                doc = html.fromstring(body)
            except ParserError as e:
                abort(500)

            excerpt = textwrap.shorten(doc.xpath("//p[1]/text()")[0], 200)
            post_excerpt.append([file.replace("-", " ")[:-3].capitalize(),
                                 excerpt])

    if post_excerpt:
        return render_template("index.html", publicationData=post_excerpt)
    else:
        return render_template("index.html")


@application.route("/<title>", methods=["GET"], subdomain="blog")
def blog_index(title):
    get_post = title.replace("-", " ")
    try:
        with open("./templates/blog/posts/{}.md".format(get_post.replace(" ", "-")), 'r') as post:
            data = post.read()
        body = markdown2html(data)

        return render_template("blog/post.html", Title=get_post.title(), post=body)
    except FileNotFoundError:
        abort(404)

    except:
        raise


@application.route("/stats", methods=['POST'])
def stats():
    data = request.get_json()
    ip = data['user_ip']
    user_interaction = data.get('user_interaction')
    user_location = data.get('user_location')
    user_referrer = data.get('user_referrer', "None")
    message = "User Data:\n"
    message += "-------------------\n"
    message += "IP: %s\n" % ip
    message += "Location: %s\n" % user_location
    message += "Referrer: %s\n" % (user_referrer if user_referrer else "None")
    message += "\n"
    message += "User interaction:\n"
    message += "-------------------\n"
    for key, value in user_interaction.items():
        message += "{}: {}\n".format(key, value)

    message += "\nLast panel visit by user was %s" %user_interaction.get("active_pane", "None") 
    print(message)
    # sendMessage('[Portfolio Stats] IP: %s' % ip, message)
    return jsonify(status=200, data={
        "ip": ip,
        # "user_interaction": user_interaction,
        "user_location": user_location,
        "user_referrer": user_referrer
    })


@application.route("/sendmail", methods=['GET'])
def sendmail():
    submitted = request.cookies.get('submitted')
    if submitted:
        msg = "<p>For security reasons you can only send one email every 1 min.</p>"
        code = 403
        sub = submitted + 1
    else:
        name = request.args.get('name')
        email = request.args.get('email')
        subject = request.args.get('subject')
        message = request.args.get('message')
        spamPro = request.args.get('first-name')

        if not email or not subject or not name:
            abort(403)

        dispoFound = disposableEmail(email)

        if spamPro:
            msg = "<p>Please don't spam this form</p>"
            code = 403
        if dispoFound:
            msg = "<p>Disposable email used. Please use your real email.</p>"
            code = 403

        else:
            try:
                sendMessage('[%s] %s' % (name, subject), message, email=email)
                msg = "<p>Thank you for contacting me. I will get back to you in 24 hours.</p>"
                code = 200
            except:
                raise
                msg = "<p>There was a problem sending the email. Please try again later.</p>"
                code = 500

    resp = jsonify(message=msg, code=code)
    if code == 200 and not submitted:
        resp.set_cookie('submitted', 'True', max_age=60)

    return resp


# Proxy for frank client, remove when setup on his site
method_requests_mapping = {
    'GET': requests.get,
    'HEAD': requests.head,
    'POST': requests.post,
    'PUT': requests.put,
    'DELETE': requests.delete,
    'PATCH': requests.patch,
    'OPTIONS': requests.options,
}


@application.route('/proxy/<path:url>', methods=method_requests_mapping.keys())
def proxy(url):
    requests_function = method_requests_mapping[request.method]
    r = requests_function(
        "https://" + url, stream=True, params=request.args)
    response = Response(stream_with_context(r.iter_content()),
                        content_type=r.headers['content-type'],
                        status=r.status_code)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
