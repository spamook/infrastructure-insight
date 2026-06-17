#!/bin/bash


SERVER_NAME=$1
DATE=$2
BACKUP_DIR="/backups"
LOG="/var/log/backup.log"

if [ -z "$SERVER_NAME" ] || [ -z "$DATE" ]; then
    echo "Usage: $0 <server-name> <date>"
    echo "Example: $0 web-server-1 2026-06-08"
    exit 1
fi

declare -A SERVER_IPS
SERVER_IPS["web-server-1"]="192.168.56.11"
SERVER_IPS["web-server-2"]="192.168.56.12"
SERVER_IPS["app-server"]="192.168.56.13"

SERVER_IP="${SERVER_IPS[$SERVER_NAME]}"

if [ -z "$SERVER_IP" ]; then
    echo "Unknown server: $SERVER_NAME"
    echo "Available: web-server-1, web-server-2, app-server"
    exit 1
fi

SOURCE="$BACKUP_DIR/$SERVER_NAME/$DATE"

if [ ! -d "$SOURCE" ]; then
    echo "Backup not found: $SOURCE"
    echo "Available backups:"
    ls "$BACKUP_DIR/$SERVER_NAME/" 2>/dev/null || echo "  No backups found for $SERVER_NAME"
    exit 1
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting restore: $SERVER_NAME from $DATE" >> "$LOG"

rsync -avz "$SOURCE/home_devops/" devops@$SERVER_IP:/home/devops/ >> "$LOG" 2>&1
rsync -avz "$SOURCE/etc/" devops@$SERVER_IP:/etc/ >> "$LOG" 2>&1

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Restore complete: $SERVER_NAME" >> "$LOG"
echo "Restore complete. Check $LOG for details."
