package io.docker.birthday3.votingapp

import io.docker.birthday3.votingapp.worker.Vote
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.redis.connection.RedisConnectionFactory
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer

@Configuration
class DatabaseConfiguration {

    @Bean
    RedisConnectionFactory redisConnectionFactory() {
        JedisConnectionFactory connectionFactory = JedisConnectionFactory()
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

}
