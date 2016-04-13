from flask import Flask
from flask import render_template
from flask import request
from flask import make_response
from utils import connect_to_redis
import os
import socket
import random
import json
# import pprint

option_a = os.getenv('OPTION_A', "JavaScript")
option_b = os.getenv('OPTION_B', "PHP")

programming_languages = {'cplusplus': 'C++', 'dotnet': '.NET', 'php': 'PHP', 'javascript': 'JavaScript', 'java': 'Java', 'pyhton': 'Python', 'perl': 'Perl'}

hostname = socket.gethostname()

redis = connect_to_redis("redis")
app = Flask(__name__)


@app.route("/", methods=['POST','GET'])
def hello():
    voter_id = request.cookies.get('voter_id')
    if not voter_id:
        voter_id = hex(random.getrandbits(64))[2:-1]

    vote = None
    voteKey = None

    if request.method == 'POST':
        voteKey = request.form['voteKey']
        vote = programming_languages[voteKey]
        data = json.dumps({'voter_id': voter_id, 'vote': vote})
        redis.rpush('votes', data)

    resp = make_response(render_template(
        'index.html',
        programming_languages=programming_languages,
        hostname=hostname,
        voteKey=voteKey,
        vote=vote
    ))
    resp.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0';
    resp.set_cookie('voter_id', voter_id)
    return resp

@app.route("/generate-random-votes", methods=['GET'])
def generate_random_votes():
    # how many random votes to generate
    total_votes_to_generate = int(request.args.get('count', 0))
    if total_votes_to_generate is 0:
        total_votes_to_generate = 100 # default

    random_votes = []
    
    while (total_votes_to_generate):
        # identify randomly generated voter id as multiplier of 1000
        voter_id = '#' + hex(random.getrandbits(64))[2:-1] # prepend with # to distinct as auto generated voter ids
        voteKey = random.choice(programming_languages.keys())
        vote = programming_languages[voteKey]

        # pprint.pprint(globals())
        # pprint.pprint(locals())

        jsonVote = {'voter_id': voter_id, 'vote': vote}
        data = json.dumps(jsonVote)
        redis.rpush('votes', data)

        random_votes.append(jsonVote)

        total_votes_to_generate = total_votes_to_generate - 1


	# dump(random_votes)
    resp = make_response(render_template(
        'generate-random-votes.html',
        random_votes=random_votes,
    ))

    resp.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0';
    return resp

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80, debug=True)
