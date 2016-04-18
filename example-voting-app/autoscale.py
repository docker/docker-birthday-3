from docker import Client
from docker.utils import kwargs_from_env

from subprocess import call


cli = Client(**kwargs_from_env(assert_hostname=False))

def scale(container, cpu_usage, scale_dict):
    scale_num = scale_dict[container]

    if (cpu_usage > 30):
        print("Will scale [%s] to %d instances." % (container, scale_num+1))
        call(["docker-compose", "scale", "%s=%s" % (container, str(scale_num+1))])
        return "scaled";
    elif (cpu_usage < 5 and scale_num > 1):
        print("Will reduce [%s] to %d instances." % (container, scale_num-1))
        call(["docker-compose", "scale", "%s=%s" % (container, str(scale_num-1))])
        return "scaled";
    return "unscaled";

while True:
    # ls = [x for x in lst if (("a" in x) or ("b" in x))]
    # get names of all containers in an array
    container_list = [str(x["Names"][0]) for x in cli.containers()]
    # check only for voting-app or worker
    short_cont_list = [x[1:] for x in container_list if (("voting-app" in x) or ("worker" in x))]
    # keep the number of instances for each category to define the number to scale
    scale_dict = {}
    scale_dict["voting-app"] = len([x for x in short_cont_list if ("voting-app" in x)])
    scale_dict["worker"] = len([x for x in short_cont_list if ("worker" in x)])

    for container in short_cont_list:
        # gather cpu stats
        stats_obj = cli.stats(container, stream=False)
        cpuDelta = stats_obj['cpu_stats']['cpu_usage']['total_usage'] - stats_obj['precpu_stats']['cpu_usage']['total_usage']
        systemDelta = float(stats_obj['cpu_stats']['system_cpu_usage']) - float(stats_obj['precpu_stats']['system_cpu_usage'])
        cpu_usage = (cpuDelta/systemDelta) * float(len(stats_obj['cpu_stats']['cpu_usage']['percpu_usage'])) * 100.0
        # decide whether to scale
        scaled = ""
        if "voting-app" in container:
            scaled = scale("voting-app", cpu_usage, scale_dict)
        elif "worker" in container:
            scaled = scale("worker", cpu_usage, scale_dict)
        # if scaled break the loop to avoid scaling multiple times
        if scaled == "scaled":
            break
