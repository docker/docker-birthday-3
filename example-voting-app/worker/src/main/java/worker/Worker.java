package worker;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.exceptions.JedisConnectionException;

import java.io.IOException;
import java.sql.*;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.json.JSONObject;
import us.monoid.json.JSONArray;
import us.monoid.json.JSONException;
import us.monoid.web.JSONResource;
import us.monoid.web.Resty;

class Worker {
  public static void main(String[] args) {
    try {
      Jedis redis = connectToRedis("redis");
      Connection dbConn = connectToDB("db");
      System.err.println("Watching vote queue");
      while (true) {
        String voteJSON = redis.blpop(0, "votes").get(1);
        JSONObject voteData = new JSONObject(voteJSON);
        String voterID = voteData.getString("voter_id");
        String username = voteData.getString("username");
        updateVotes(dbConn,username);
      }
    } catch (SQLException e) {
      e.printStackTrace();
      System.exit(1);
    }
  }
  static void updateVotes( Connection connection, String username){
    Map<String, Long> result = new HashMap<String, Long>();
    Resty r = new Resty();

    try {
      JSONArray userRepos = r.json("https://api.github.com/users/"+username+"/repos").array();
      for(int i =0; i<userRepos.length();i++){
        String languagesUrl = userRepos.getJSONObject(i).getString("languages_url");
        String repoName = userRepos.getJSONObject(i).getString("name");
        System.out.println(languagesUrl);
        us.monoid.json.JSONObject languages = r.json(languagesUrl).object();
        Iterator<String> languageNames = languages.keys();
        while (languageNames.hasNext()){
          String languageName = languageNames.next();
          System.err.printf("Processing votes for '%s' by '%s'\n", languageName, username);
          persistVote(connection,username, repoName, languageName, languages.getLong(languageName));
        }
      }
    } catch (IOException e) {
      e.printStackTrace();
    } catch (JSONException e) {
      e.printStackTrace();
    } catch (SQLException e) {
      e.printStackTrace();
    }
  }
  static void persistVote(Connection dbConn, String username, String repo, String language, Long counter) throws SQLException {
      PreparedStatement insert = dbConn.prepareStatement(
          "INSERT INTO votes (username, repo, language, counter) VALUES (?, ?, ?, ?)");
      insert.setString(1, username);
      insert.setString(2, repo);
      insert.setString(3, language);
      insert.setLong(4, counter);

      try {
        insert.executeUpdate();
      } catch (SQLException e) {
        PreparedStatement update = dbConn.prepareStatement(
            "UPDATE votes SET counter = ? WHERE username= ? and repo=? and language = ?");
        update.setLong(1, counter);
        update.setString(2, username);
        update.setString(3, repo);
        update.setString(4, language);
        update.executeUpdate();
      }
  }

  static Jedis connectToRedis(String host) {
    Jedis conn = new Jedis(host);

    while (true) {
      try {
        conn.keys("*");
        break;
      } catch (JedisConnectionException e) {
        System.err.println("Failed to connect to redis - retrying");
        sleep(1000);
      }
    }

    System.err.println("Connected to redis");
    return conn;
  }

  static Connection connectToDB(String host) throws SQLException {
    Connection conn = null;

    try {

      Class.forName("org.postgresql.Driver");
      String url = "jdbc:postgresql://" + host + "/postgres";

      while (conn == null) {
        try {
          conn = DriverManager.getConnection(url, "postgres", "");
        } catch (SQLException e) {
          System.err.println("Failed to connect to db - retrying");
          sleep(1000);
        }
      }
      PreparedStatement st = conn.prepareStatement(
        "CREATE TABLE IF NOT EXISTS votes (username VARCHAR(255) NOT NULL, repo VARCHAR(255) NOT NULL, language VARCHAR(255) NOT NULL, counter BIGINT NOT NULL, PRIMARY KEY(username, repo, language))");
      st.executeUpdate();

    } catch (ClassNotFoundException e) {
      e.printStackTrace();
      System.exit(1);
    }

    return conn;
  }

  static void sleep(long duration) {
    try {
      Thread.sleep(duration);
    } catch (InterruptedException e) {
      System.exit(1);
    }
  }
}
