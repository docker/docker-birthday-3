package io.docker.birthday3.votingapp.worker

import com.fasterxml.jackson.databind.ObjectMapper
import io.docker.birthday3.votingapp.worker.redis.VotePushedListener
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.redis.connection.RedisConnectionFactory
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.data.redis.listener.PatternTopic
import org.springframework.data.redis.listener.RedisMessageListenerContainer
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer

@Configuration
class RedisConfiguration {

    @Bean
    ObjectMapper objectMapper() {
        return new ObjectMapper()
    }

    @Bean
    RedisConnectionFactory redisConnectionFactory() {
        JedisConnectionFactory connectionFactory = new JedisConnectionFactory()
        connectionFactory.hostName = 'redis'
        connectionFactory.usePool = true
        return connectionFactory
    }

    @Bean
    RedisTemplate voteTemplate() {
        StringRedisTemplate template = new StringRedisTemplate()
        template.connectionFactory = redisConnectionFactory()
        template.enableTransactionSupport = true
        template.stringSerializer = new Jackson2JsonRedisSerializer(Vote)
        return template
    }

    @Bean
    VotePushedListener votePushedListener() {
        new VotePushedListener(list: 'votes')
    }

    @Bean
    RedisMessageListenerContainer redisMessageListenerContainer() {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer()
        container.connectionFactory = redisConnectionFactory()

        container.addMessageListener(votePushedListener(), new PatternTopic('__key*__:*push'))
        return container
    }

}
