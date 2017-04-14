import sqlite3
import uuid

USERS_COLUMNS = ['userid', 'firstname', 'lastname', 'classyear', 'netid', 'email']
EVENTS_COLUMNS = ['eventid', 'latitude', 'longitude', 'title', 'description', 'category', 'ownerid', 'netid', 'starttime', 'duration', 'status']

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
    create_q = '''CREATE TABLE users(userid varchar(50), firstname varchar(20), 
    lastname varchar(20), classyear int, netid varchar(20), email varchar(30))'''
    print create_q
    cur.execute(create_q)
    create_q2 = '''CREATE TABLE events(eventid varchar(36), longitude double, latitude double,
    title varchar(30), description text, category int, ownerid varchar(36), netid varchar(20), starttime datetime, duration int, status int)'''
    print create_q2
    cur.execute(create_q2)
    conn.commit()

def DBAddEvent(conn, cur, lon, lat, title, desc, cat, oid, netid, stime, dur):
    eventid = str(uuid.uuid4())
    insert_q = '''INSERT INTO events VALUES('%s', %f, %f, '%s', '%s', %d, '%s', '%s', '%s', %d, 1)''' % (eventid, lon, lat, title, desc, cat, oid, netid, stime, dur)
    print insert_q
    cur.execute(insert_q)
    conn.commit()
    return eventid

def DBAddUser(conn, cur, uid, fname, lname, cyear, netid, email):
    #uid = str(uuid.uuid4())
    insert_q = '''INSERT INTO users VALUES('%s', '%s', '%s', %d, '%s', '%s')''' % (uid, fname, lname, cyear, netid, email)
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

def DBGetEventField(conn, cur, fieldname, eid):
    if fieldname in EVENTS_COLUMNS:
        select_q = '''SELECT %s FROM events WHERE eventid = '%s';''' % (fieldname, eid)
        print select_q
        cur.execute(select_q)
        res = cur.fetchone()
        return res[0]
    return None

def DBSetEventStatus(conn, cur, eid, newstatus):
    update_q = '''UPDATE events SET status = %d WHERE eventid = '%s';''' % (newstatus, eid)
    print update_q
    cur.execute(update_q)
    conn.commit()

def DBGetAllActiveEvents(conn, cur):
    select_q = '''SELECT eventid, latitude, longitude, title, description, category, ownerid, netid, starttime, duration FROM events WHERE status = 1'''
    print select_q
    cur.execute(select_q)
    res = cur.fetchall()
    print res
    
    
def DBClose(conn):
    conn.close()
