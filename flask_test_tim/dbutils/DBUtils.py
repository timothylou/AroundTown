import sqlite3

def DBConnect(dbName):
    conn = sqlite3.connect(dbName, check_same_thread=False)
    cur = conn.cursor()
    return conn, cur

def DBInitResetTables(conn, cur):
    drop_q = '''DROP TABLE IF EXISTS users'''
    print drop_q
    cur.execute(drop_q)
    drop_q2 = '''DROP TABLE IF EXISTS pins'''
    print drop_q2
    cur.execute(drop_q2)
    conn.commit()
    create_q = '''CREATE TABLE users(userid integer, firstName varchar(20), 
    lastName varchar(20), classYear int)'''
    print create_q
    cur.execute(create_q)
    create_q2 = '''CREATE TABLE pins(longitude double, latitude double,
    descrip text, ownerid integer, label varchar(10), starttime datetime )'''
    print create_q2
    cur.execute(create_q2)
    conn.commit()

def DBAddEvent(conn, cur, lon, lat, desc, oid, label, stime):
    insert_q = '''INSERT INTO pins VALUES(%f, %f, '%s', %d, '%s', %s)''' % (lon, lat, desc, oid, label, stime)
    print insert_q
    cur.execute(insert_q)
    conn.commit()

def DBAddUser(conn, cur, uid, fname, lname, cyear):
    insert_q = '''INSERT INTO users VALUES(%d, '%s', '%s', %d)''' % (uid, fname, lname, cyear)
    print insert_q
    cur.execute(insert_q)
    conn.commit()

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
