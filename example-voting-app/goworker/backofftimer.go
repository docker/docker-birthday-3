package main

import (
	"time"
)

type BackoffTimer struct {
	C    <-chan time.Time
	t    *time.Timer
	done chan struct{}
}

func (t *BackoffTimer) Stop() {
	close(t.done)
	t.t.Stop()
}

func NewBackoffTimer(interval time.Duration, retry int) *BackoffTimer {
	ch := make(chan time.Time)
	t := &BackoffTimer{
		C:    ch,
		t:    time.NewTimer(interval),
		done: make(chan struct{}),
	}

	go func(v time.Duration, i int) {
		select {
		case ch <- time.Now():
		case <-t.done:
			return
		}

		for now := range t.t.C {
			if i == 0 {
				return
			}

			select {
			case ch <- now:
			case <-t.done:
				return
			}

			i--
			v *= 2
			t.t.Reset(v)
		}
	}(interval, retry)

	return t
}
