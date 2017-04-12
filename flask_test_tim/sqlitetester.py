import sqlite3

conn = sqlite3.connect('/home/ubuntu/flask_test/atown.db')
cur = conn.cursor()
cur.execute('CREATE TABLE blah(blah varchar(2))')
conn.commit()
