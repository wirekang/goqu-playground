git clone --depth 1 "$REPO_URL" "$CLONE_DIR_NAME"

cd "$CLONE_DIR_NAME" || exit 1
NGINX_SERVER_NAME=$NGINX_SERVER_NAME docker compose up -d
cd ".." || exit 1

rm -rf "$CLONE_DIR_NAME"
