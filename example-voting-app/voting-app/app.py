from flask import Flask
from flask import render_template
from flask import request
from flask import make_response
from utils import connect_to_redis
import os
import socket
import random
import json

hostname = socket.gethostname()

redis = connect_to_redis("redis")
app = Flask(__name__)


@app.route("/", methods=['POST','GET'])
def hello():
    voter_id = request.cookies.get('voter_id')
    if not voter_id:
        voter_id = hex(random.getrandbits(64))[2:-1]

    vote = None
    username = ''
    if request.method == 'POST':
        username = request.form['username']
        data = json.dumps({'voter_id': voter_id, 'username': username})
        redis.rpush('votes', data)

    resp = make_response(render_template(
        'index.html',
        hostname=hostname,
        username=username,
        voter_id=voter_id
    ))
    resp.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0';
    resp.set_cookie('voter_id', voter_id)
    return resp


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80, debug=True)
