package io.docker.birthday3.votingapp.worker

import com.fasterxml.jackson.databind.ObjectMapper

import static org.mockito.Mockito.mock

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.redis.core.StringRedisTemplate

@Configuration
class MockApplicationConfiguration {

    @Bean
    StringRedisTemplate voteTemplate() {
        return mock(StringRedisTemplate)
    }

    @Bean
    VoteRepository voteRepository() {
        return mock(VoteRepository)
    }

    @Bean
    ObjectMapper objectMapper() {
        return new ObjectMapper()
    }

    @Bean
    Worker worker() {
        return new Worker()
    }

}
