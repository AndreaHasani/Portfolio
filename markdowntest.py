import mistune
from lxml import html

renderer = mistune.Renderer(hard_wrap=True)
markdown2html = mistune.Markdown(renderer=renderer)

with open("./templates/blog/posts/post1.md", 'r') as post:
    data = post.read()
    body = markdown2html(data)


doc = html.fromstring(body)
print(doc.xpath("//p[1]/text()"))
