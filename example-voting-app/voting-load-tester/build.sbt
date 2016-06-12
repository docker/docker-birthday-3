name := "voting-load-tests"
version := "0.1.0"

scalaVersion := "2.11.7"

libraryDependencies += "io.gatling.highcharts" % "gatling-charts-highcharts" % "2.1.7" % "test"
libraryDependencies += "io.gatling" % "gatling-test-framework" % "2.1.7" % "test"

enablePlugins(GatlingPlugin)