from flask import Flask
from flask import render_template
from flask import request
from flask import make_response
from utils import connect_to_redis
import os
import socket
import random
import json
import tweepy

option_a = os.getenv('OPTION_A', "Python")
option_b = os.getenv('OPTION_B', "JavaScript")
streamFilter = os.getenv('STREAM_FILTER', "#docker")

hostname = socket.gethostname()

redis = connect_to_redis("redis")
app = Flask(__name__)

auth = tweepy.OAuthHandler(os.getenv('TWITTER_CONSUMER_KEY'), os.getenv('TWITTER_CONSUMER_SECRET'))
auth.set_access_token(os.getenv('TWITTER_ACCESS_TOKEN'), os.getenv('TWITTER_ACCESS_SECRET'))

api = tweepy.API(auth)

#override tweepy.StreamListener to add logic to on_status
class DockerStreamListener(tweepy.StreamListener):
    def on_data(self, data):
        json_data = json.loads(data)
        text = json_data['text'].encode('UTF-8')
        if option_a in text:
            vote_data = json.dumps({'voter_id': str(json_data['user']['id']), 'vote': "a"})
            redis.rpush('votes', vote_data)
        elif option_b in text:
            vote_data = json.dumps({'voter_id': str(json_data['user']['id']), 'vote': "b"})
            redis.rpush('votes', vote_data)
    def on_error(self, status_code):
        print status_code
        if status_code == 420:
            #returning False in on_data disconnects the stream
            return False

dockerStreamListener = DockerStreamListener()
dockerStream = tweepy.Stream(auth = api.auth, listener=dockerStreamListener)
dockerStream.filter(track=[streamFilter], async=True)

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
        hostname=hostname,
        vote=vote,
    ))
    resp.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0';
    resp.set_cookie('voter_id', voter_id)
    return resp


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80, debug=True)
