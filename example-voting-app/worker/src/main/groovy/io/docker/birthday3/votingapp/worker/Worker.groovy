package io.docker.birthday3.votingapp.worker

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service

@Service
class Worker {

    @Autowired
    StringRedisTemplate voteTemplate

    @Autowired
    VoteRepository voteRepository

    @Autowired
    ObjectMapper objectMapper

    void transferVote() {
        String voteData = voteTemplate.boundListOps('votes').leftPop()
        Vote vote = objectMapper.readValue(voteData, Vote)
        voteRepository.save(vote)
    }

}
