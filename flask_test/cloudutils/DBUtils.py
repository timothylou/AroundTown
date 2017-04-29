import sqlite3
import uuid
from datetime import datetime

USERS_COLUMNS = ['userid', 'firstname', 'lastname', 'classyear', 'netid', 'email']
EVENTS_COLUMNS = ['eventid', 'latitude', 'longitude', 'title', 'description', 'category', 'ownerid', 'netid', 'starttime', 'duration', 'status']
#PREFS_COLUMNS = ['userid', 'freefood', 'facility', 'recruiting', 'studybreak', 'movie', 'busypacked', 'firesafety'] # add location prefs later

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
    drop_q3 = '''DROP TABLE IF EXISTS preferences'''
    print drop_q3
    cur.execute(drop_q3)
    conn.commit()
    create_q = '''CREATE TABLE users(userid varchar(50), firstname varchar(20), 
    lastname varchar(20), classyear int, netid varchar(20), email varchar(30))'''
    print create_q
    cur.execute(create_q)
    create_q2 = '''CREATE TABLE events(eventid varchar(36), longitude double, latitude double,
    title varchar(30), description text, category varchar(20), ownerid varchar(36), netid varchar(20), starttime datetime, duration int, status int)'''
    print create_q2
    cur.execute(create_q2)
    #create_q3 = '''CREATE TABLE preferences(userid varchar(50), freefood boolean, facility boolean, recruiting boolean, studybreak boolean, 
    #movie boolean, busypacked boolean, firesafety boolean)'''
    #print create_q3
    #cur.execute(create_q3)
    conn.commit()

def DBAddEvent(conn, cur, lon, lat, title, desc, cat, oid, netid, stime, dur):
    eventid = str(uuid.uuid4())
    insert_q = '''INSERT INTO events VALUES('%s', %f, %f, '%s', '%s', '%s', '%s', '%s', '%s', %d, 1)''' % (eventid, lon, lat, title, desc, cat, oid, netid, stime, dur)
    insert_q_actual = 'INSERT INTO events VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)' 
    print insert_q
    cur.execute(insert_q_actual, (eventid, lon, lat, title, desc, cat, oid, netid, stime, dur))
    conn.commit()
    return eventid

def DBAddUser(conn, cur, uid, fname, lname, cyear, netid, email):
    #uid = str(uuid.uuid4())
    insert_q = '''INSERT INTO users VALUES('%s', '%s', '%s', %d, '%s', '%s')''' % (uid, fname, lname, cyear, netid, email)
    insert_q_actual = 'INSERT INTO users VALUES(?, ?, ?, ?, ?, ?)'
    print insert_q
    cur.execute(insert_q_actual, (uid, fname, lname, cyear, netid, email))
    conn.commit()
    return uid

# unused
def DBGetUserField(conn, cur, fieldname, uid):
    if fieldname in USERS_COLUMNS:
        select_q = '''SELECT %s FROM users WHERE userid = '%s';''' % (fieldname, uid)
        select_q_actual = 'SELECT %s FROM users WHERE userid = ?' % (fieldname)
        print select_q
        cur.execute(select_q_actual, (uid,))
        res = cur.fetchone()
        return res[0]
    return None

# unused
def DBGetEventField(conn, cur, fieldname, eid):
    if fieldname in EVENTS_COLUMNS:
        select_q = '''SELECT %s FROM events WHERE eventid = '%s';''' % (fieldname, eid)
        select_q_actual = 'SELECT %s FROM events WHERE eventid = ?' % (fieldname)
        print select_q
        cur.execute(select_q_actual, (eid,))
        res = cur.fetchone()
        return res[0]
    return None

# unused
def DBSetEventStatus(conn, cur, eid, newstatus):
    update_q = '''UPDATE events SET status = %d WHERE eventid = '%s';''' % (newstatus, eid)
    print update_q
    cur.execute(update_q)
    conn.commit()

def DBGetAllActiveEvents(conn, cur):
    attribsToReturn = ['eventid', 'latitude', 'longitude', 'title', 'description', 'category', 'ownerid', 'netid', 'starttime', 'duration']
    select_q = 'SELECT ' + ', '.join(attribsToReturn) + ' FROM events WHERE status = 1' 
    #select_q = '''SELECT eventid, latitude, longitude, title, description, category, ownerid, netid, starttime, duration FROM events WHERE status = 1'''
    print select_q
    cur.execute(select_q)
    rows = cur.fetchall()
    res = []
    for ev in rows:
        curreventdict = {}
        for i in range(len(attribsToReturn)):
            curreventdict[attribsToReturn[i]] = ev[i]
        res.append(curreventdict)
    #print res
    return res

def DBRefreshStatus(conn, cur):
    beg = datetime.utcfromtimestamp(0)
    currUTCmilli = (datetime.utcnow()-beg).total_seconds()*1000
    update_q = 'UPDATE events SET status = 0 WHERE %d > (starttime + duration*60*1000)' % ( currUTCmilli )
    print update_q
    cur.execute(update_q)
    conn.commit()
    
    
def DBClose(conn):
    conn.close()