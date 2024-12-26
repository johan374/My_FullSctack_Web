#!/usr/bin/env bash
# This shebang line specifies that the script should be executed using bash from wherever it's installed in the environment

# exit on error
set -o errexit
# This tells bash to exit immediately if any command returns an error (non-zero exit status)
# This prevents running further commands if something fails (like if pip install fails)

pip install -r requirements.txt
# Installs all Python packages listed in requirements.txt
# Common packages might include Django, database drivers, etc.
# If any package fails to install, the script will stop here due to errexit

python manage.py collectstatic --no-input
# Gathers all static files (CSS, JS, images) from all Django apps
# Places them in the STATIC_ROOT directory specified in Django settings
# --no-input flag prevents any prompts, making it suitable for automated deployment
# If static file collection fails, script stops here

python manage.py migrate
# Runs all pending database migrations
# Updates database schema to match your Django models
# This should run after pip install (in case new migrations were installed)
# If migrations fail, the script stops here