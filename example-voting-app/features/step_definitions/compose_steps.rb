Given(/^I started the application$/) do
  docker_compose 'up -d'
end

When(/^I start the application$/) do
  docker_compose 'up -d'
end

Given(/^I stopped the application$/) do
  docker_compose 'stop'
end

When(/^I stop the application$/) do
  docker_compose 'stop'
end

When(/^I scale the application with$/) do |table|
  scales = table.hashes.map do |row|
    assert row.key?('Name')
    assert row.key?('Count')

    "#{row['Name']}=#{row['Count']}"
  end

  docker_compose "scale #{scales * ' '}"
end

Then(/^the following services are available$/) do |table|
  check_services table
end

Then(/^the exactly following services are available$/) do |table|
  check_services table
  actual = services.map { |service| service.info['Labels']['com.docker.compose.service'] }.uniq.sort
  expected = table.hashes.map { |row| row['Name'] }.sort
  assert_equal(expected, actual, "expected #{expected}, but got #{actual}")
end

Then(/^(\d+) services are available$/) do |count|
  actual = services.map { |service| service.info['Labels']['com.docker.compose.service'] }.uniq.sort.length
  assert_equal(count.to_i, actual, "expected #{count}, but got #{actual} services")
end

def check_services(table)
  table.hashes.each do |row|
    assert row.key?('Name')
    services = services_by_name row['Name']
    service = services.first

    row.each do |key, value|
      next if key == 'Name'

      if key == 'Count'
        assert_equal(value.to_i, services.length, "Expected #{value} services, but got #{services.length}")
        next
      end
      assert(service.info.key?(key), "service #{service.info} should have key #{key}")
      actual = service.info[key]
      actual = actual.map { |port| format_port(port) } if key == 'Ports'
      actual = actual.join ', ' if actual.is_a? Array
      assert actual.match(value), "#{actual} should match #{value}"
    end
  end
end

Then(/^the logs for (.+) contain$/) do |service, string|
  matcher = to_regex string

  def check(service, matcher, string)
    actual = service_logs service
    assert actual.match(matcher), "#{actual} should contain #{string}"
  end

  eventually { check(service, matcher, string) }
end

def format_port(actual)
  return "#{actual['IP']}:#{actual['PublicPort']}" if actual.key? 'IP'

  actual['PublicPort'].to_s
end

def to_regex(matcher)
  "^#{matcher.gsub('.', '\.').gsub('\.\.\.', '.*')}$"
end
