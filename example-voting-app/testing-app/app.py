import os
import random
import time

import json
import requests

def get_random_in_range(start, end):
    return random.random() * (end - start) + start

def perform_vote():
    lat = get_random_in_range(-90.0, 90.0)
    lng = get_random_in_range(-180.0, 180.0)
    vote = random.choice(['a', 'b'])
    payload = {'vote': vote, 'location': json.dumps({'lat': round(lat, 5), 'lng': round(lng, 5)})}
    resp = requests.post('http://voting-app:80/', data=payload)
    print(resp.status_code)

if __name__ == "__main__":
    time.sleep(10) # wait 10 seconds to let other services to start
    while True:
        perform_vote()
        time.sleep(4) # wait 4 seconds between requests
