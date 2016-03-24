from flask import Flask, flash, redirect, url_for, render_template, make_response

import requests
import db
import os
import socket
from db import Db
from form import VoteForm
from flask import request
from flask_bootstrap import Bootstrap

voting_host = os.getenv("TESTAPP_VOTING_HOST", "localhost")
voting_port = os.getenv("TESTAPP_VOTING_PORT", "5000")
voting_ip = socket.gethostbyname(voting_host)

db_host = os.getenv("TESTAPP_POSTGRES_HOST", "localhost")
db_port = int(os.getenv("TESTAPP_POSTGRES_PORT", "5003"))
db_user = os.getenv("TESTAPP_POSTGRES_USER", "postgres")
db_password = os.getenv("TESTAPP_POSTGRES_PASSWORD", "")
db_table = os.getenv("TESTAPP_POSTGRES_TABLE", "postgres")

db = Db(db_host, db_port, db_user, db_password, db_table)

app = Flask(__name__)
app.secret_key = 'a_very_secret_key'
Bootstrap(app)

@app.route("/", methods=['GET', "POST"])
def index():
    form = VoteForm()

    if request.method == "POST":
        if form.validate():
            flash("voting %d times for option %s" % (form.amount.data, form.option.data), "success")
            for i in range(0, form.amount.data):
                requests.post("http://%s:%s/" % (voting_ip, voting_port), data={"vote": form.option.data})
        else:
            flash("failed to validate form", "success")

    return make_response(render_template(
        'index.html',
        target_host=voting_host,
        target_port=voting_port,
        target_ip=voting_ip,
        votes_a=db.get_votes("a"),
        votes_b=db.get_votes("b"),
        form=form
    ))


@app.route("/vote/<opt>")
def vote(opt):
    flash('Voting for option ' + opt, "success")
    requests.post("http://%s:%s/" % (voting_ip, voting_port), data={"vote": opt})
    return redirect(url_for('index'))


@app.route("/clear/<opt>")
def clear(opt):
    flash('Clearing option ' + opt, "success")
    db.clear_votes(opt)
    return redirect(url_for('index'))


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80, debug=True)
