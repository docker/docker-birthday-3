from flask import Flask
from flask import render_template
from flask import request
from flask import make_response
from flask import jsonify
from utils import connect_to_redis
from textblob import TextBlob
import os
import socket
import random
import json

option_a = os.getenv('OPTION_A', "One")
option_b = os.getenv('OPTION_B', "Two")

hostname = socket.gethostname()

redis = connect_to_redis("redis")
app = Flask(__name__)


@app.route("/", methods=['POST','GET'])
def hello():
    voter_id = request.cookies.get('voter_id')
    if not voter_id:
        voter_id = hex(random.getrandbits(64))[2:-1]

    vote = None
    comment = None
    
    if request.method == 'POST':
        vote = request.form['vote']
        comment = request.form['comment']
        data = json.dumps({'voter_id': voter_id, 'vote': vote, 'comment': comment})
        redis.rpush('votes', data)

    resp = make_response(render_template(
        'index.html',
        option_a=option_a,
        option_b=option_b,
        comment=comment,
        hostname=hostname,
        vote=vote,
    ))
    resp.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0';
    resp.set_cookie('voter_id', voter_id)
    return resp

@app.route('/api/sentiment',methods=['POST'])
def sentiment():
    text = TextBlob(request.form['comment'])
    response = {'polarity' : text.polarity , 'subjectivity' : text.subjectivity}
    return jsonify(response)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80, debug=True)
