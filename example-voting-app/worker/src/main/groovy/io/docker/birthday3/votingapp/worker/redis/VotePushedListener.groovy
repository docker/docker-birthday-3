package io.docker.birthday3.votingapp.worker.redis

import io.docker.birthday3.votingapp.worker.Worker
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.redis.connection.Message
import org.springframework.data.redis.connection.MessageListener
import org.springframework.stereotype.Component

@Component
class VotePushedListener implements MessageListener {

    String list

    @Autowired
    Worker worker

    @Override
    void onMessage(Message message, byte[] pattern) {
        String eventList = new String(message.body)
        if (list.equalsIgnoreCase(eventList)) {
            worker.transferVote()
        }
    }
}
