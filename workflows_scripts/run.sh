cd "$CLONE_DIR_NAME" || exit 1
NGINX_SERVER_NAME=$NGINX_SERVER_NAME docker compose up -d
cd ".." || exit 1

rm -rf "$CLONE_DIR_NAME"
