from flask import Flask
from flask import render_template
from flask import request
import redis
import requests
from readability import Document

app = Flask(__name__)

cache = redis.Redis(host='127.0.0.1', port=6379)

@app.route('/')
def main():
    url = request.args.get('url')
    title = ''

    if not url:
        return "?url=&lt;url&gt; pls"

    else:
        try:
            if cache.hexists('page', url):
                rt = cache.hget('page', url).decode("utf-8")
            else:
                response = requests.get(url, timeout=15)

                if response.ok:
                    cache.hset('page', url, response.text)
                    rt = response.text
        except:
            return "Error processing URL: %s" % url

    doc = Document(rt)
    title = doc.title()
    page = doc.summary(True)

    return render_template('home.html', title=title, page=page)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
