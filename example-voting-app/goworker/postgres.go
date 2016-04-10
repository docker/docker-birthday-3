package main

import (
	"database/sql"
	"flag"
	"log"
	"time"

	"github.com/golang/glog"

	_ "github.com/lib/pq"
)

var dburi = flag.String("dburi", "postgresql://postgres@db/postgres", "Postgres DB URI")

func openPostgres(dburi string, retry int) (db *sql.DB, err error) {
	db, err = sql.Open("postgres", dburi)
	if err != nil {
		return nil, err
	}

	t := NewBackoffTimer(time.Second, retry)
	defer t.Stop()

	for range t.C {
		if err = db.Ping(); err == nil {
			glog.Infof("Connected to %s!", dburi)
			return db, nil
		}

		glog.Infof("DB %s unavailable: %v", dburi, err)
	}

	return nil, err
}

func initDB() *sql.DB {
	db, err := openPostgres(*dburi, 5)
	if err != nil {
		log.Fatal(err)
	}

	if err = createVotesTable(db); err != nil {
		log.Fatal(err)
	}

	return db
}

func createVotesTable(db *sql.DB) error {
	s, err := db.Prepare("CREATE TABLE IF NOT EXISTS votes (id VARCHAR(255) NOT NULL UNIQUE, vote VARCHAR(255) NOT NULL)")
	if err != nil {
		return err
	}

	_, err = s.Exec()
	s.Close()
	return err
}
