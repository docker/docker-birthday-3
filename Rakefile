task default: :generate_documentation

desc 'Generates the documentation'
task generate_documentation: :link_graph
task generate_documentation: :boundaries

task :link_graph do
  render ['--link-graph'], 'tutorial-images/link_graph.svg'
end

task :boundaries do
  render ['--boundaries'], 'tutorial-images/boundaries.svg'
end

def render(options=['--link-graph'], output='img/output.svg')
  chain = ['cat example-voting-app/docker-compose.yml',
    "docker run -i funkwerk/compose_plantuml #{options * ' '}",
    "docker run -i think/plantuml > #{output}"]
  sh chain.join '|'
end
