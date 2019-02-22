from flask import Flask
from flask import render_template
from flask import request
import requests
from readability import Document

app = Flask(__name__)

@app.route('/')
def newspaper():
    url = request.args.get('page')
    title = ''

    if url:
        try:
            response = requests.get(url, timeout=10)

            if response.ok:
                page = Document(response.text)

                title = page.title()
                page = page.summary(True)

                return render_template('home.html', title=title, page=page)

        except:
            print('Error processing URL: %s' % url)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
