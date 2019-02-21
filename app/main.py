from flask import Flask
from flask import render_template
from flask import request

app = Flask(__name__)

@app.route('/')
def newspaper():
    page = request.args.get('page')
    if page:
        return render_template('home.html', page=page)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
