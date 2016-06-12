package main

import (
	"flag"
	"log"
	"time"

	"github.com/garyburd/redigo/redis"
	"github.com/golang/glog"
)

const queueName = "votes"

var redisuri = flag.String("redisuri", "redis://redis:6479", "Redis URI")

func openRedis(uri string, retry int) (c redis.Conn, err error) {
	t := NewBackoffTimer(time.Second, retry)
	defer t.Stop()

	for range t.C {
		if c, err = redis.DialURL(uri); err == nil {
			glog.Infof("Connected to %s!", uri)
			return c, nil
		}

		glog.Infof("Redis %s unavailable: %v", uri, err)
	}

	return nil, err
}

func initRedis() redis.Conn {
	conn, err := openRedis(*redisuri, 5)
	if err != nil {
		log.Fatal(err)
	}

	return conn
}
