package main

import (
	"database/sql"
	"fmt"
)

type Vote struct {
	ID     string `json:"voter_id"`
	Choice string `json:"vote"`
}

func (v Vote) String() string {
	return fmt.Sprintf("['%s','%s']", v.ID, v.Choice)
}

func (v *Vote) Update(db *sql.DB) error {
	q := fmt.Sprintf("UPDATE votes SET vote = '%s' WHERE id = '%s'", v.Choice, v.ID)
	s, err := db.Prepare(q)
	if err != nil {
		return err
	}

	if _, err := s.Exec(); err != nil {
		return err
	}

	s.Close()
	return nil
}

func (v *Vote) Insert(db *sql.DB) error {
	q := fmt.Sprintf("INSERT INTO votes (id, vote) VALUES ('%s', '%s')", v.ID, v.Choice)
	s, err := db.Prepare(q)
	if err != nil {
		return err
	}

	if _, err := s.Exec(); err != nil {
		return err
	}

	s.Close()
	return nil
}
