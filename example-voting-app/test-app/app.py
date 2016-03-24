from flask import Flask, flash, redirect, url_for, render_template, make_response

import requests
import votes
import os
import socket

target_host = os.getenv("TESTAPP_TARGET_HOST", "localhost")
target_port = os.getenv("TESTAPP_TARGET_PORT", "5000")
target_ip = socket.gethostbyname(target_host)

app = Flask(__name__)
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'


@app.route("/", methods=['GET'])
def index():
    return make_response(render_template(
        'index.html',
        target_host=target_host,
        target_port=target_port,
        target_ip=target_ip,
        votes_a=votes.get_votes("a"),
        votes_b=votes.get_votes("b")
    ))


@app.route("/vote/<opt>")
def vote(opt):
    flash('Voting for option ' + opt)
    requests.post("http://%s:%s/" % (target_ip, target_port), data={"vote": opt})
    return redirect(url_for('index'))

@app.route("/clear/<opt>")
def clear(opt):
    flash('Clearing option ' + opt)
    votes.clear_votes(opt)
    return redirect(url_for('index'))


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)
