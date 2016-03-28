Feature: Controlling
  As a DevOps,
  I want to test my docker orchestration
  so that I haven't broken anything once I change something

  Scenario: Startable
    When I start the application
    Then 5 services are available

  Scenario: Status
    When I start the application
    Then the exactly following services are available
      | Name       | Command        | Image            | Status | Ports        |
      | result-app | node server.js | ..._result-app   | Up...  | 0.0.0.0:5001 |
      | voting-app | python app.py  | ..._voting-app   | Up...  | 0.0.0.0:5000 |
      | worker     | java -jar ...  | manomarks/worker | Up...  |              |
      | redis      | ...redis...    | redis:alpine     | Up...  | 0.0.0.0:...  |
      | db         | ...postgres    | postgres:9.4     | Up...  |              |

  Scenario: Stoppable
    Given I started the application
    When I stop the application
    Then 0 services are available

  Scenario: Logging
    When I start the application
    Then the logs for worker contain
      """
      ...Connected to redis...
      """
    And the logs for voting-app contain
      """
      ...Connected to redis...
      """
    And the logs for result-app contain
      """
      ...Connected to db...
      """

  Scenario: Scalable
    Given I started the application
    When I scale the application with
      | Name   | Count |
      | worker | 10    |
    Then the following services are available
      | Name   | Count |
      | worker | 10    |
