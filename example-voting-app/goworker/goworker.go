package main

import (
	"database/sql"
	"encoding/json"
	"flag"

	"github.com/garyburd/redigo/redis"
	"github.com/golang/glog"
)

func init() {
	glog.CopyStandardLogTo("INFO")
}

func main() {
	flag.Parse()

	vch := make(chan *Vote)

	redisConn := initRedis()
	defer redisConn.Close()

	db := initDB()
	defer db.Close()

	done := make(chan struct{})

	go read(redisConn, vch)
	go update(db, vch, done)

	<-done
	glog.Info("Done!")
}

func read(conn redis.Conn, vch chan<- *Vote) {
	for {
		result, err := redis.Strings(conn.Do("BLPOP", queueName, 0))
		if err != nil {
			glog.Warning(err, result)
			continue
		} else if len(result) != 2 {
			glog.Warningf("Involid value popped: %v", result)
			continue
		}

		var vote Vote
		if err := json.Unmarshal([]byte(result[1]), &vote); err != nil {
			glog.Warningf("Invalid JSON: %s", result[1])
			continue
		}

		vch <- &vote
	}
}

func update(db *sql.DB, vch <-chan *Vote, done chan<- struct{}) {
	for vote := range vch {
		if err := vote.Insert(db); err == nil {
			glog.Infof("Inserted %s.", vote)
			continue
		}

		if err := vote.Update(db); err == nil {
			glog.Infof("Updated %s.", vote)
			continue
		} else {
			glog.Warning(err)
		}
	}

	close(done)
}
