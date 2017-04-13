import sqlite3
import uuid

USERS_COLUMNS = ['userid', 'firstname', 'lastname', 'classyear', 'netid']
EVENTS_COLUMNS = ['eventid', 'latitude', 'longitude', 'title', 'description', 'category', 'ownerid', 'netid', 'starttime', 'duration']

def DBConnect(dbName):
    conn = sqlite3.connect(dbName, check_same_thread=False)
    cur = conn.cursor()
    return conn, cur

def DBInitResetTables(conn, cur):
    drop_q = '''DROP TABLE IF EXISTS users'''
    print drop_q
    cur.execute(drop_q)
    drop_q2 = '''DROP TABLE IF EXISTS events'''
    print drop_q2
    cur.execute(drop_q2)
    conn.commit()
    create_q = '''CREATE TABLE users(userid varchar(36), firstname varchar(20), 
    lastname varchar(20), classyear int, netid varchar(20))'''
    print create_q
    cur.execute(create_q)
    create_q2 = '''CREATE TABLE events(eventid varchar(36), longitude double, latitude double,
    title varchar(30), description text, category int, ownerid varchar(36), netid varchar(20), starttime datetime, duration int)'''
    print create_q2
    cur.execute(create_q2)
    conn.commit()

def DBAddEvent(conn, cur, lon, lat, title, desc, cat, oid, netid, stime, dur):
    eventid = str(uuid.uuid4())
    insert_q = '''INSERT INTO events VALUES('%s', %f, %f, '%s', '%s', %d, '%s', '%s', '%s', %d)''' % (eventid, lon, lat, title, desc, cat, oid, netid, stime, dur)
    print insert_q
    cur.execute(insert_q)
    conn.commit()
    return eventid

def DBAddUser(conn, cur, fname, lname, cyear, netid):
    uid = str(uuid.uuid4())
    insert_q = '''INSERT INTO users VALUES('%s', '%s', '%s', %d, '%s')''' % (uid, fname, lname, cyear, netid)
    print insert_q
    cur.execute(insert_q)
    conn.commit()
    return uid

def DBGetUserField(conn, cur, fieldname, uid):
    if fieldname in USERS_COLUMNS:
        select_q = '''SELECT %s FROM users WHERE userid = '%s';''' % (fieldname, uid)
        print select_q
        cur.execute(select_q)
        res = cur.fetchone()
        return res[0]
    return None

def DBGetUserFname(conn, cur, uid):
    select_q = '''SELECT firstName FROM users WHERE userid = %s''' % uid
    print select_q
    cur.execute(select_q)
    fname = cur.fetchone()
    return fname[0]

def DBGetUserLname(conn, cur, uid):
    select_q = '''SELECT lastName FROM users WHERE userid = %s''' % uid
    print select_q
    cur.execute(select_q)
    fname = cur.fetchone()
    return fname[0]

def DBGetUserCyear(conn, cur, uid):
    select_q = '''SELECT classYear FROM users WHERE userid = %s''' % uid
    print select_q
    cur.execute(select_q)
    fname = cur.fetchone()
    return fname[0]
    
def DBClose(conn):
    conn.close()
