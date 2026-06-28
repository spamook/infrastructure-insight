#!/bin/bash


TEMPLATE="/vagrant/load-balancer/nginx.conf.template"
CONF="/etc/nginx/conf.d/lb.conf"
LOG="/var/log/adaptive_lb.log"
METRICS_PORT=3001

IP1="192.168.56.11"
IP2="192.168.56.12"

get_score() {
    local ip=$1
    local json
    json=$(curl -sf --max-time 3 "http://$ip:$METRICS_PORT/metrics")
    if [ $? -ne 0 ] || [ -z "$json" ]; then
        echo "999"; return
    fi
    local load1 ram_used ram_total
    load1=$(echo "$json"    | jq -r '.cpu.loadAvg[0]')
    ram_used=$(echo "$json" | jq -r '.ram.used')
    ram_total=$(echo "$json"| jq -r '.ram.total')
    if [ -z "$load1" ] || [ "$load1" = "null" ]; then
        echo "999"; return
    fi
    python3 -c "
load  = float('$load1')
used  = float('$ram_used')
total = float('$ram_total') or 1
ram_pct = (used / total) * 100
print(round(load * 50 + ram_pct, 1))
"
}

SCORE1=$(get_score "$IP1")
SCORE2=$(get_score "$IP2")

TS=$(date '+%Y-%m-%d %H:%M:%S')
echo "[$TS] scores  -> web1=$SCORE1  web2=$SCORE2" >> "$LOG"

read W1 W2 < <(python3 -c "
s1, s2 = float('$SCORE1'), float('$SCORE2')
if s1 == 999 and s2 == 999: print(1, 1)
elif s1 == 999:              print(1, 10)
elif s2 == 999:              print(10, 1)
else:
    total = s1 + s2 or 1
    w1 = max(1, round((s2 / total) * 10))
    w2 = max(1, round((s1 / total) * 10))
    print(w1, w2)
")

echo "[$TS] weights -> web1=$W1  web2=$W2" >> "$LOG"

sed -e "s/WEB1_WEIGHT/$W1/g" \
    -e "s/WEB2_WEIGHT/$W2/g" \
    "$TEMPLATE" | sudo tee "$CONF" > /dev/null

if sudo nginx -t 2>/dev/null; then
    sudo nginx -s reload
    echo "[$TS] nginx reloaded (web1=$W1 web2=$W2)" >> "$LOG"
else
    echo "[$TS] ERROR: nginx config test failed!" >> "$LOG"
fi
