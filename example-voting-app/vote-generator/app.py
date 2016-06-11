from utils import connect_to_redis
import time
import json

redis = connect_to_redis("redis")

while True:
	voter_id = hex(random.getrandbits(64))[2:-1]
	rnd = random.randint(1, 10000)
	vote = None
	if (rnd % 2) == 0:
		vote = "a"
	else:
		vote = "b"
	data = json.dumps({'voter_id': voter_id, 'vote': vote})
	redis.rpush('votes', data)

	delay = random.randint(100, 10000) / 1000
	time.sleep(delay)
