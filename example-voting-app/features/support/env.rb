require 'test/unit/assertions'

module ComposeWorld
  require 'docker'

  include Test::Unit::Assertions

  @@project = 'cucumber'

  def docker_compose(command)
    require 'open3'

    Open3.popen3("docker-compose --project #{@@project} #{command}") do |_stdin, stdout, stderr, wait_thr|
      exit_status = wait_thr.value

      assert_equal(exit_status.exitstatus, 0, "stderr: #{stderr}\nstdout: #{stdout}")
      return stdout
    end
  end

  def services
    candidates = Docker::Container.all
    candidates.select! { |service| service.info.key?('Labels') }
    candidates.select! { |service| service.info['Labels']['com.docker.compose.project'] == @@project }
    candidates
  end

  def services_by_name(name)
    candidates = services.select { |service| service.info['Labels']['com.docker.compose.service'] == name }
    assert_not_nil candidates
    candidates
  end

  def services_id(name)
    candidates = services.select { |service| service.info['Labels']['com.docker.compose.service'] == name }
    assert_not_nil candidates
    candidates.map { |service| service[:id] }
  end

  def service_logs(name)
    candidates = services.select { |service| service.info['Labels']['com.docker.compose.service'] == name }
    assert_not_nil candidates
    # TODO: not just logs for the first service and should use logs since last container start
    candidates.first.logs(stdout: true, stderr: true)
  end

  def eventually(timeout = 30, &block)
    assert_not_nil block
    error = nil
    start = Time.now
    while (Time.now - start) < timeout
      begin
        return block.call
      rescue Exception => assertion
        error = assertion
        sleep 0.1
      end
    end
    raise error
  end
end

World(Test::Unit::Assertions, ComposeWorld)

Before do
  docker_compose 'stop'
end
