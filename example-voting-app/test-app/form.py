from flask_wtf import Form
from wtforms import RadioField, IntegerField, SubmitField
from wtforms.validators import DataRequired

class VoteForm(Form):
    option = RadioField('Vote options', default="a", choices=[('a','Option A'),('b','Option B')])
    amount = IntegerField('Number of votes', default=10, validators=[DataRequired()])
    submit = SubmitField("Vote")