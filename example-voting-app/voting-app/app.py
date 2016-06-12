from flask import Flask
from flask import render_template
from flask import request
from flask import make_response
from utils import connect_to_redis
import os
import socket
import random
import json

option_a = os.getenv('OPTION_A', "C++")
option_b = os.getenv('OPTION_B', "Closure")
option_c = os.getenv('OPTION_C', "Go")
option_d = os.getenv('OPTION_D', "Java")
option_e = os.getenv('OPTION_E', "Javascript")
option_f = os.getenv('OPTION_F', "PHP")
option_g = os.getenv('OPTION_G', "Python")
option_h = os.getenv('OPTION_H', "Ruby")
option_i = os.getenv('OPTION_I', "Rust")
option_j = os.getenv('OPTION_J', "Scala")

hostname = socket.gethostname()

redis = connect_to_redis("redis")
app = Flask(__name__)


@app.route("/", methods=['POST','GET'])
def hello():
    voter_id = request.cookies.get('voter_id')
    if not voter_id:
        voter_id = hex(random.getrandbits(64))[2:-1]

    vote = None

    if request.method == 'POST':
        vote = request.form['vote']
        data = json.dumps({'voter_id': voter_id, 'vote': vote})
        redis.rpush('votes', data)

    resp = make_response(render_template(
        'index.html',
        option_a=option_a,
        option_b=option_b,
        option_c=option_c,
        option_d=option_d,
        option_e=option_e,
        option_f=option_f,
        option_g=option_g,
        option_h=option_h,
        option_i=option_i,
        option_j=option_j,
        hostname=hostname,
        vote=vote,
    ))
    resp.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0';
    resp.set_cookie('voter_id', voter_id)
    return resp


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80, debug=True)
