from locust import HttpLocust, TaskSet

import random


def vote(l):
    vote = random.choice(['a', 'b'])
    l.client.post('/', data={"vote": vote})

class UserBehavior(TaskSet):
    tasks = {vote:1}

class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    host = "http://192.168.99.100"
