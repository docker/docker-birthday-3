package io.docker.birthday3.votingapp.worker

import org.mockito.invocation.InvocationOnMock
import org.mockito.stubbing.Answer
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.SpringApplicationConfiguration
import org.springframework.data.redis.core.BoundListOperations
import org.springframework.data.redis.core.ListOperations
import org.springframework.data.redis.core.StringRedisTemplate
import spock.lang.Specification

import static org.mockito.Matchers.any
import static org.mockito.Matchers.anyString
import static org.mockito.Mockito.doAnswer
import static org.mockito.Mockito.doReturn
import static org.mockito.Mockito.verify

@SpringApplicationConfiguration([MockApplicationConfiguration])
class WorkerSpec extends Specification {

    @Autowired
    StringRedisTemplate voteTemplate

    @Autowired
    VoteRepository voteRepository

    @Autowired
    Worker worker

    void "Transfer vote"() {
        given:
        final String voterId = '738a9f'
        final String vote = 'Groovy'

        and:

        BoundListOperations listOperations = Mock()
        1 * listOperations.leftPop() >> /{"voter_id": "${voterId}", "vote": "${vote}"}/

        and:
        doReturn(listOperations).when(voteTemplate).boundListOps('votes')

        and:
        doAnswer(new Answer() {

            @Override
            Object answer(InvocationOnMock invocation) throws Throwable {
                Vote voteData = invocation.getArgumentAt(0, Vote)
                assert voterId == voteData.voterId
                assert vote == voteData.vote
                return null
            }

        }).when(voteRepository).save(any(Vote))

        when:
        worker.transferVote()

        then:
        ({ verify(voteTemplate).boundListOps(anyString()); true }).call()
        ({ verify(voteRepository).save(any(Vote)); true }).call()
    }

}
