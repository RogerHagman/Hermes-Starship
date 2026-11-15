#!/bin/sh
# Makes the login for the boards: deploy/starship.htpasswd (git ignores it), one user.
#   sh deploy/make-htpasswd.sh <user>
# Asks for the password twice. Run it again to change the password. Needs openssl.
set -eu
user="${1:-}"
[ -n "$user" ] || { echo "usage: sh deploy/make-htpasswd.sh <user>" >&2; exit 2; }
case "$user" in *:*) echo "the user name can't contain ':'" >&2; exit 2;; esac
out="$(dirname "$0")/starship.htpasswd"
printf 'Password for %s: ' "$user" >&2; stty -echo 2>/dev/null || true; read -r pw; stty echo 2>/dev/null || true; echo >&2
printf 'Again: ' >&2; stty -echo 2>/dev/null || true; read -r pw2; stty echo 2>/dev/null || true; echo >&2
[ "$pw" = "$pw2" ] || { echo "the passwords don't match" >&2; exit 1; }
[ -n "$pw" ] || { echo "empty password" >&2; exit 1; }
hash="$(printf '%s' "$pw" | openssl passwd -apr1 -stdin)"
umask 077
printf '%s:%s\n' "$user" "$hash" > "$out"
# nginx in the container reads it as its own user, so it must be readable.
chmod 644 "$out"
echo "wrote $out"
