import sqlite3
import uuid
from datetime import datetime
import math

# Define columns of database tables
USERS_COLUMNS = ['userid', 'firstname', 'lastname', 'classyear', 'netid', 'email']
EVENTS_COLUMNS = ['eventid', 'latitude', 'longitude', 'title', 'description', 'category', 'ownerid', 'netid', 'starttime', 'duration', 'upvotes', 'downvotes', 'status']

# Connect to the SQLite DB
def DBConnect(dbName):
    conn = sqlite3.connect(dbName, check_same_thread=False)
    cur = conn.cursor()
    return conn, cur

# Delete preexisting tables and create again
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
    lastname varchar(20), classyear varchar(15), netid varchar(20), email varchar(40))'''
    print create_q
    cur.execute(create_q)
    create_q2 = '''CREATE TABLE events(eventid varchar(36), longitude double, latitude double,
    title varchar(30), description text, category varchar(20), ownerid varchar(36), netid varchar(20), starttime datetime, duration int, upvotes int, downvotes int, status int)'''
    print create_q2
    cur.execute(create_q2)
    conn.commit()

# Add an event to the database
def DBAddEvent(conn, cur, lon, lat, title, desc, cat, oid, netid, stime, dur):
    eventid = str(uuid.uuid4())
    insert_q = '''INSERT INTO events VALUES('%s', %f, %f, '%s', '%s', '%s', '%s', '%s', '%s', %d,0, 0, 1)''' % (eventid, lon, lat, title.encode('ascii','replace'), desc.encode('ascii','replace'), cat, oid, netid, stime, dur)
    insert_q_actual = 'INSERT INTO events VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 1)' 
    print insert_q
    cur.execute(insert_q_actual, (eventid, lon, lat, title, desc, cat, oid, netid, stime, dur))
    conn.commit()
    return eventid

# Add a user to the database
def DBAddUser(conn, cur, uid, fname, lname, cyear, netid, email):
    insert_q = '''INSERT INTO users VALUES('%s', '%s', '%s', '%s', '%s', '%s')''' % (uid, fname, lname, cyear, netid, email)
    insert_q_actual = 'INSERT INTO users VALUES(?, ?, ?, ?, ?, ?)'
    print insert_q
    cur.execute(insert_q_actual, (uid, fname, lname, cyear, netid, email))
    conn.commit()
    return uid

# Edit user in database
def DBEditUser(conn, cur, uid, fname, lname, cyear, netid, email):
    update_q = 'UPDATE users SET firstname = ?, lastname = ?, classyear = ?, netid = ?, email = ? WHERE userid = ?'
    print update_q, netid, email
    cur.execute(update_q, (fname, lname, cyear, netid, email, uid))
    conn.commit()
    return uid

# Get a particular user field given the userid
def DBGetUserField(conn, cur, fieldname, uid):
    if fieldname in USERS_COLUMNS:
        select_q = '''SELECT %s FROM users WHERE userid = '%s';''' % (fieldname, uid)
        select_q_actual = 'SELECT %s FROM users WHERE userid = ?' % (fieldname)
        print select_q
        cur.execute(select_q_actual, (uid,))
        res = cur.fetchone()
        return res[0]
    return None

# Get a particular event field given the eventid
def DBGetEventField(conn, cur, fieldname, eid):
    if fieldname in EVENTS_COLUMNS:
        select_q = '''SELECT %s FROM events WHERE eventid = '%s';''' % (fieldname, eid)
        select_q_actual = 'SELECT %s FROM events WHERE eventid = ?' % (fieldname)
        print select_q
        cur.execute(select_q_actual, (eid,))
        res = cur.fetchone()
        return res[0]
    return None

# Set the event status to 0 or 1
def DBSetEventStatus(conn, cur, eid, newstatus):
    update_q = '''UPDATE events SET status = ? WHERE eventid = ?;'''
    print update_q, eid, newstatus
    cur.execute(update_q, (newstatus, eid))
    conn.commit()

# Update the number of up/down votes on an event
def DBUpdateVoteStatus(conn, cur, eid, upvotechange, downvotechange):
    update_q = '''UPDATE events SET upvotes = upvotes + ?, downvotes = downvotes + ? WHERE eventid = ?'''
    print update_q, eid, upvotechange, downvotechange
    cur.execute(update_q, (upvotechange, downvotechange, eid))
    conn.commit()
    # if more than certain number of downvotes, remove event
    if downvotechange > 0:
        numdownvotes = DBGetEventField(conn, cur, 'downvotes', eid)
        if numdownvotes >= 2:
            print "Too many downvotes. Deactivating event."
            DBSetEventStatus(conn, cur, eid, 0)

# Return list of all active events
def DBGetAllActiveEvents(conn, cur):
    attribsToReturn = ['eventid', 'latitude', 'longitude', 'title', 'description', 'category', 'ownerid', 'netid', 'starttime', 'duration', 'upvotes', 'downvotes']
    select_q = 'SELECT ' + ', '.join(attribsToReturn) + ' FROM events WHERE status = 1' 
    print select_q
    cur.execute(select_q)
    rows = cur.fetchall()
    res = []
    beg = datetime.utcfromtimestamp(0)
    currt = (datetime.utcnow()-beg).total_seconds()*1000
    for ev in rows:
        curreventdict = {}
        for i in range(len(attribsToReturn)):
            curreventdict[attribsToReturn[i]] = ev[i]
        # Calculate time ago and time remaining for event
        curreventdict['timeago'] = math.ceil((currt - ev[8])/60000)
        curreventdict['timeremaining'] = math.floor((ev[8] + ev[9]*60000 - currt)/60000)
        res.append(curreventdict)
    return res

# Set events that have expired to inactive status
def DBRefreshStatus(conn, cur):
    beg = datetime.utcfromtimestamp(0)
    currUTCmilli = (datetime.utcnow()-beg).total_seconds()*1000
    update_q = 'UPDATE events SET status = 0 WHERE %d > (starttime + duration*60*1000)' % ( currUTCmilli )
    print update_q
    cur.execute(update_q)
    conn.commit()
    
# Close the DB connection
def DBClose(conn):
    conn.close()
