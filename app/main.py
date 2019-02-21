from flask import Flask
from flask import render_template
from flask import request

app = Flask(__name__)

@app.route('/')
def newspaper():
    page = request.args.get('page')
    title = ''
    if page:
        return render_template('home.html', tite=title, page=page)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
