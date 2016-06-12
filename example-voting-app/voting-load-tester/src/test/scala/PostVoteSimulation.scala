package loadtests

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._

class PostVoteSimulation extends Simulation {
  
  val baseUrl = scala.util.Properties.envOrElse("BASEURL", "http://localhost:5000");
  
  val rampUpTimeSecs = 20
  val testTimeSecs   = 60
  val noOfUsers      = 2000
  val minWaitMs      = 1000 milliseconds
  val maxWaitMs      = 3000 milliseconds

  val serviceHttpConf = http
    .baseURL(baseUrl)
    .acceptHeader("text/html")
    .userAgentHeader("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116")
    .acceptLanguageHeader("en-US,en;q=0.8,pt;q=0.6")
  
  val feeder = Array(
      Map("option" -> "a"),
      Map("option" -> "b")
      ).random;

  val scn = scenario("Mixed Votes Option with A and B")
    .feed(feeder)
    .exec(
      http("request_1")
        .get("/")
        .check(status.is(_ => 200))
    )
    .pause(minWaitMs, maxWaitMs)
    .exec(
      http("request_2")
        .post("/")
        .formParam("vote", "${option}")
        .check(status.is(_ => 200))
    )
    .pause(minWaitMs, maxWaitMs)

  setUp(
    scn.inject(rampUsers(noOfUsers) over rampUpTimeSecs)
  ).protocols(serviceHttpConf)

}