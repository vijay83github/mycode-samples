#!/bin/bash


service_stat=$(curl http://localhost:8080/accessmgmt/disableAllUsers)
echo $service_stat
fileName="/home/ubuntu/access_mgmt_status.txt"
echo $fileName
fileName_monthwise="/home/ubuntu/access_mgmt_status_$(date +'%m%Y').txt"
echo $service_stat > $fileName
echo $(date +'%m%d%Y %H:%M:%S') $service_stat >> $fileName_monthwise
stat_cnt=$(grep -c '200' $fileName)
if [ $stat_cnt -gt 0 ]; then
        cat $fileName | jq .| mail -s "Access termination catalog tasks have been closed." -t "NexGenCoreTeam@neustar.biz"
fi