import psycopg2
import json
import os

# ID fields --------------------------------------------------------------------
schedule_id = "schedule"
standings_id = "standings"

# SQL queries ------------------------------------------------------------------
CREATE_PORTAL_TABLE = '''
    CREATE TABLE portaltable
    (ID              TEXT PRIMARY KEY,
    jsonData        JSONB);
    '''

CREATE_PORTALTABLE_ENTRY = '''
    INSERT INTO portaltable VALUES (%s, %s)
    '''

UPDATE_PORTALTABLE_ENTRY = '''
    UPDATE portaltable SET jsonData = %s WHERE ID = %s
    '''

GET_PORTALTABLE_ENTRY = '''
    SELECT jsonData FROM portaltable WHERE id= %s
    '''

UPDATE_SHOWTIMES_ENTRY = '''
    UPDATE showtimes SET showtimes_data = %s WHERE grandprix = %s
    '''
INSERT_SHOWTIMES_ENTRY = '''
    INSERT INTO showtimes(grandprix, showtimes_data)
           VALUES(%s, %s)
           ON CONFLICT DO NOTHING
    '''

GET_SHOWTIMES_ENTRY = '''
    SELECT showtimes_data FROM showtimes WHERE grandprix = %s
    '''


# Private methods to manage connections ----------------------------------------
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


# Class to manage entries ------------------------------------------------------
class DBManager:
    @staticmethod
    def create_portal_table():
        conn, cur = establish_connection()
        cur.execute(CREATE_PORTAL_TABLE)
        close_connection(conn, cur)

    # Standings ----------------------------------------------------------------
    @staticmethod
    def create_standings_entry(data):
        conn, cur = establish_connection()
        cur.execute(CREATE_PORTALTABLE_ENTRY, (standings_id, json.dumps(data)))
        close_connection(conn, cur)

    @staticmethod
    def update_standings_entry(data):
        conn, cur = establish_connection()
        cur.execute(UPDATE_PORTALTABLE_ENTRY, (json.dumps(data), standings_id))
        close_connection(conn, cur)

    @staticmethod
    def get_standings_entry():
        conn, cur = establish_connection()
        cur.execute(GET_PORTALTABLE_ENTRY, (standings_id,))
        result = cur.fetchall()
        close_connection(conn, cur)
        return result

    # Schedule -----------------------------------------------------------------
    @staticmethod
    def create_schedule_entry(data):
        conn, cur = establish_connection()
        cur.execute(CREATE_PORTALTABLE_ENTRY, (schedule_id, json.dumps(data)))
        close_connection(conn, cur)

    @staticmethod
    def update_schedule_entry(data):
        conn, cur = establish_connection()
        cur.execute(UPDATE_PORTALTABLE_ENTRY, (json.dumps(data), schedule_id))
        close_connection(conn, cur)

    @staticmethod
    def get_schedule_entry():
        conn, cur = establish_connection()
        cur.execute(GET_PORTALTABLE_ENTRY, (schedule_id,))
        result = cur.fetchall()
        close_connection(conn, cur)
        return result

    # Showtimes ----------------------------------------------------------------
    @staticmethod
    def update_showtimes_entry(race_country, data):
        conn, cur = establish_connection()

        # Update or insert if race_country doesn't exist. Only one succeeds
        cur.execute(UPDATE_SHOWTIMES_ENTRY, (json.dumps(data), race_country))
        cur.execute(INSERT_SHOWTIMES_ENTRY, (race_country, json.dumps(data)))

        close_connection(conn, cur)

    @staticmethod
    def get_showtimes_entry(race_country):
        conn, cur = establish_connection()
        cur.execute(GET_SHOWTIMES_ENTRY, (race_country,))
        result = cur.fetchall()
        close_connection(conn, cur)
        return result


if __name__ == '__main__':
    print("Shouldn't open DBManager!")
    exit()
