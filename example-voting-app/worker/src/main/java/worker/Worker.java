package worker;

import java.sql.SQLException;

import org.json.JSONObject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.connection.StringRedisConnection;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@SpringBootApplication
@EnableScheduling
public class Worker {

  private JdbcTemplate jdbcTemplate;

  private RedisTemplate<String, String> redisTemplate;

  public Worker(JdbcTemplate jdbcTemplate, RedisTemplate<String, String> redisTemplate) {
    this.jdbcTemplate = jdbcTemplate;
    this.redisTemplate = redisTemplate;
  }

  public static void main(String[] args) {
    SpringApplication.run(Worker.class, args);
  }

  @Scheduled(cron = "* * * * * *")
  public void job() {
    try {

      System.err.println("Watching vote queue");
      String voteJSON = this.redisTemplate.execute((RedisCallback<String>)(connection) -> {
          StringRedisConnection stringRedisConn = (StringRedisConnection)connection;
          return stringRedisConn.bLPop(0, "votes").get(1);
        });
      JSONObject voteData = new JSONObject(voteJSON);
      String voterID = voteData.getString("voter_id");
      String vote = voteData.getString("vote");

      System.err.printf("Processing vote for '%s' by '%s'\n", vote, voterID);
      updateVote(voterID, vote);
    } catch (SQLException e) {
      e.printStackTrace();
      System.exit(1);
    }
  }

  private void updateVote(String voterID, String vote) throws SQLException {
    try {
      this.jdbcTemplate.update("INSERT INTO votes (id, vote) VALUES (?, ?)", voterID, vote);
    } catch (DataAccessException e) {
      this.jdbcTemplate.update("UPDATE votes SET vote = ? WHERE id = ?", vote, voterID);
    }
  }

}
