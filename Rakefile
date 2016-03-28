task default: :test

desc 'Tests the application'
task test: :format
task test: :rubocop
task test: :cucumber

task :cucumber do
  options = %w()
  options.push '--tags ~@skip' unless ENV['skipped']
  Dir.chdir('example-voting-app') do
    sh "cucumber #{options * ' '}"
  end
end

desc 'Checks ruby style'
task :rubocop do
  sh 'rubocop'
end

task :format do
  sh 'gherkin_format example-voting-app/features/*.feature'
end
