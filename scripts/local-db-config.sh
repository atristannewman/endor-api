# Run these commands !!! one at a time !!! in bash terminal to configure local DB: 
# ---- Begin Setup ---- 
brew install postgresql@14
pg_ctl -D /opt/homebrew/var/postgresql@14 start
psql postgres 
CREATE ROLE localuser WITH LOGIN;
ALTER USER localuser WITH PASSWORD 'local123'; # We don't care about password strength for local (DONT USE THIS CONVENTION IN PROD)
ALTER ROLE localuser CREATEDB;
\q
psql postgres -U localuser
CREATE DATABASE flocklocal;
GRANT ALL PRIVILEGES ON DATABASE flocklocal TO localuser;
\q
# ---- End Setup ---- 

# Test the connection string with the following: 
pg_isready -d "postgres://localuser@localhost/flocklocal"

# Useful psql terminal commands for further validation: https://gist.github.com/Kartones/dd3ff5ec5ea238d4c546
