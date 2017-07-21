import psycopg2
import json
import os

CREATE_PORTAL_TABLE = '''
    CREATE TABLE portaltable
    (ID              TEXT PRIMARY KEY,
    jsonData        JSONB);
    '''

# Standings -----------------------------------------------------------------
CREATE_STANDINGS_ENTRY = '''
    INSERT INTO portaltable VALUES (%s, %s)
    '''

UPDATE_STANDINGS_ENTRY = '''
    UPDATE portaltable SET jsonData = %s WHERE ID = %s
    '''

GET_STANDINGS_ENTRY = '''
    SELECT jsonData FROM portaltable WHERE id='standings'
    '''

# Schedule -----------------------------------------------------------------
CREATE_SCHEDULE_ENTRY = '''
    INSERT INTO portaltable VALUES (%s, %s)
    '''

UPDATE_SCHEDULE_ENTRY = '''
    UPDATE portaltable SET jsonData = %s WHERE ID = %s
    '''

GET_SCHEDULE_ENTRY = '''
    SELECT jsonData FROM portaltable WHERE id='schedule'
    '''


def establish_connection():
    database = "d1v9krcmhtm93t"
    user = os.environ.get('DB_USR')
    password = os.environ.get('DB_PASS')
    host = "ec2-54-247-177-33.eu-west-1.compute.amazonaws.com"
    port = "5432"

    try:
        conn = psycopg2.connect(database=database
                                , user=user
                                , password=password
                                , host=host
                                , port=port
                                )
        conn.autocommit = True
        cur = conn.cursor()
        return conn, cur

    except Exception as e:
        message = e.message + "\nFailed to establish connection. " \
                              "Check connection string."
        exit(message)


def close_connection(cnxn, cursor):
    try:
        cursor.close()
        cnxn.close()

    except Exception as e:
        message = e.message + "\nFailed to close connection."
        exit(message)


class DBManager:
    def create_portal_table(self):
        conn, cur = establish_connection()
        cur.execute(CREATE_PORTAL_TABLE)
        close_connection(conn, cur)

    # Standings ----------------------------------------------------------------
    def create_standings_entry(self, data):
        conn, cur = establish_connection()
        cur.execute(CREATE_STANDINGS_ENTRY, ("standings", json.dumps(data)))
        close_connection(conn, cur)

    def update_standings_entry(self, data):
        conn, cur = establish_connection()
        cur.execute(UPDATE_STANDINGS_ENTRY, (json.dumps(data), "standings"))
        close_connection(conn, cur)

    def get_standings_entry(self):
        conn, cur = establish_connection()
        cur.execute(GET_STANDINGS_ENTRY)
        result = cur.fetchall()
        close_connection(conn, cur)
        return result

    # Schedule -----------------------------------------------------------------
    def create_schedule_entry(self, data):
        conn, cur = establish_connection()
        cur.execute(CREATE_SCHEDULE_ENTRY, ("schedule", json.dumps(data)))
        close_connection(conn, cur)

    def update_schedule_entry(self, data):
        conn, cur = establish_connection()
        cur.execute(UPDATE_SCHEDULE_ENTRY, (json.dumps(data), "schedule"))
        close_connection(conn, cur)

    def get_schedule_entry(self):
        conn, cur = establish_connection()
        cur.execute(GET_SCHEDULE_ENTRY)
        result = cur.fetchall()
        close_connection(conn, cur)
        return result


if __name__ == '__main__':
    print("Shouldn't open DBManager!")
    exit()
