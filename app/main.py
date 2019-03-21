from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify
from flask import make_response
from readability import Document
import json
import redis
import requests

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

@app.route('/api/save/', methods = ['POST'])
def save():
    data = request.get_json()

    hostname = list(data.keys())[0]
    highlight_id = list(data[hostname])[0]
    body = json.dumps(data[hostname][highlight_id])

    if hostname and highlight_id and body:
        try:
            if not cache.hexists(hostname, highlight_id):
                cache.hset(hostname, highlight_id, body)
                return cache.hget(hostname, highlight_id).decode("utf-8")
            else:
                return cache.hget(hostname, highlight_id).decode("utf-8")
        except:
            return "Error saving data: %s" % highlight_id

@app.route('/api/get/', methods = ['POST'])
def get():
    data = request.get_json()

    hostname = data['hostname']

    if hostname:
        try:
            body = jsonify(cache.hgetall(hostname))
        except:
            return "Error getting data: %s" % hostname

    response = make_response(body)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

@app.route('/api/delete/', methods = ['POST'])
def delete():
    data = request.get_json()
    # return jsonify(data)

    hostname = data['hostname']
    highlight_id = data['highlight_id']

    if hostname and highlight_id:
        try:
            cache.hdel(hostname, highlight_id)
        except:
            return "Error getting data: %s" % hostname

    return "Deleted highlight: %s" % highlight_id

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, ssl_context=('cert.pem', 'key.pem'))
