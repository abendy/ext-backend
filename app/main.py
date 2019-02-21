from flask import Flask
from flask import render_template
from flask import request
import requests
from readability import Document

app = Flask(__name__)

@app.route('/')
def newspaper():
    page = request.args.get('page')
    if page:
        response = requests.get(page)
        doc = Document(response.text)

        page = doc.summary(True)

        return render_template('home.html', page=page)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
