package io.docker.birthday3.votingapp.worker.redis

import io.docker.birthday3.votingapp.worker.Worker
import org.springframework.data.redis.connection.Message
import spock.lang.Specification

class VotePushedListenerSpec extends Specification {

    VotePushedListener listener

    Worker worker

    void setup() {
        listener = new VotePushedListener()

        worker = Mock()
        listener.worker = worker
    }

    void "Vote pushed"() {
        given:
        String list = 'votes'
        listener.list = list

        and:
        Message message = Mock()
        message.body >> list.bytes

        when:
        listener.onMessage(message, [] as byte[])

        then:
        1 * worker.transferVote()
    }

    void "Ignore push event to wrong list"() {
        given:
        String list = 'votes'
        listener.list = list

        and:
        Message message = Mock()
        message.body >> 'mylist'.bytes

        when:
        listener.onMessage(message, [] as byte[])

        then:
        0 * worker.transferVote()
    }

}
