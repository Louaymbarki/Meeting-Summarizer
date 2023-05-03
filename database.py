import sqlite3

def create_connection(db_file):
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        print(f'Successfully connected to {db_file}')
    except sqlite3.Error as e:
        print(e)

    if conn:
        conn.close()

if __name__ == '__main__':
    create_connection('meeting_database.db')