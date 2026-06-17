#!/bin/bash

DATE=$(date +%Y-%m-%d)
BACKUP_DIR="/backups"
LOG="/var/log/backup.log"

SERVERS=("192.168.56.11" "192.168.56.12" "192.168.56.13")
NAMES=("web-server-1" "web-server-2" "app-server")

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting backup" >> "$LOG"

for i in "${!SERVERS[@]}"; do
    SERVER="${SERVERS[$i]}"
    NAME="${NAMES[$i]}"
    DEST="$BACKUP_DIR/$NAME/$DATE"

    mkdir -p "$DEST/home_devops" "$DEST/etc"

    rsync -avz --delete --ignore-errors \
        --exclude="shadow" --exclude="shadow-" \
        --exclude="gshadow" --exclude="gshadow-" \
        --exclude="ssl/private" \
        devops@$SERVER:/home/devops/ "$DEST/home_devops/" >> "$LOG" 2>&1

    rsync -avz --delete --ignore-errors \
        --exclude="shadow" --exclude="shadow-" \
        --exclude="gshadow" --exclude="gshadow-" \
        --exclude="ssl/private" \
        devops@$SERVER:/etc/ "$DEST/etc/" >> "$LOG" 2>&1

    EXIT_CODE=$?

    if [ $EXIT_CODE -eq 0 ] || [ $EXIT_CODE -eq 23 ]; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$NAME] Backup completed successfully" >> "$LOG"
    else
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$NAME] Backup FAILED with code $EXIT_CODE" >> "$LOG"
    fi
done

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backup finished" >> "$LOG"
