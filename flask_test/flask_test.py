from flask import Flask, render_template, request, url_for
from werkzeug.contrib.fixers import ProxyFix
import dbutils.DBUtils as dbu
import json
from config import dbpath

# Create the application.
app = Flask(__name__)

# Store database connection and cursor
app.config['DB_CONN'] = None
app.config['DB_CUR']  = None
app.config['DB_INIT'] = False
app.config['DB_USERS_REQD_FIELDS'] = ['uid', 'fname', 'lname', 'cyear', 'netid', 'email']
app.config['DB_EVENTS_REQD_FIELDS'] = ['latitude', 'longitude', 'title', 'description', 'cat', 'oid', 'netid', 'stime', 'dur']

def dbinit():
    if not app.config['DB_INIT']:
        app.config['DB_CONN'], app.config['DB_CUR'] = dbu.DBConnect(dbpath)
        app.config['DB_INIT'] = True
        print app.config['DB_CONN'], app.config['DB_CUR']
        dbu.DBInitResetTables(app.config['DB_CONN'], app.config['DB_CUR'])
        print "Database initialized."
        

@app.route('/')
@app.route('/indexblah')
def index():
    """ Displays the index page accessible at '/'
    """
    #return render_template('index.html')
    return "hi"

@app.route('/post/', methods=['POST'])
def postcall():
    #return request.form['key1'] + request.form['key2']
    print request.get_json()
    print request.url
    return "You posted: " + request.get_json()

@app.route('/post/newuser/', methods=['POST'])
def postnewuser():
    postedjson = request.data
    #postedjson = request.get_json()
    #print postedjson
    #print request.url
    #print request
    #print request.get_json()
    #print request.data
    #usrdict = json.loads(postedjson)
    usrdict = json.loads(postedjson)
    for attrib in app.config['DB_USERS_REQD_FIELDS']:
        if attrib not in usrdict:
            return 'ERROR: no %s value received' % (attrib)
    uid = usrdict['uid']
    fname = usrdict['fname']
    lname = usrdict['lname']
    cyear = usrdict['cyear']
    netid = usrdict['netid']
    email = usrdict['email']
    if not app.config['DB_INIT']:
        dbinit()
    dbu.DBAddUser(app.config['DB_CONN'], app.config['DB_CUR'], uid, fname, lname, cyear, netid, email)
    return "%s" % (uid)

@app.route('/post/newevent/', methods=['POST'])
def postnewevent():
    #postedjson = request.get_json()
    print request.url
    postedjson = request.data
    eventdict = json.loads(postedjson)
    for attrib in app.config['DB_EVENTS_REQD_FIELDS']:
        if attrib not in eventdict:
            return 'ERROR: no %s value received' % (attrib)
    lat = eventdict['latitude']
    lon = eventdict['longitude']
    title = eventdict['title']
    desc = eventdict['description']
    cat = eventdict['cat']
    oid = eventdict['oid']
    netid = eventdict['netid']
    stime = eventdict['stime']
    dur = eventdict['dur']
    if not app.config['DB_INIT']:
        dbinit()
    eventid = dbu.DBAddEvent(app.config['DB_CONN'], app.config['DB_CUR'], lon, lat, title, desc, cat, oid, netid, stime, dur)
    return "%s" % (eventid)

@app.route('/get/', methods=['GET'])
def getcall():
    firstitem = request.args.get('key1','[default]')
    print firstitem
    return "you want: " + firstitem

@app.route('/get/userinfo/', methods=['GET'])
def getuserinfo():
    uid = request.args.get('uid','')
    if uid == '':
        return "ERROR: no userid provided"
    desiredfield = request.args.get('desired','')
    if desiredfield == '':
        return "ERROR: no desired field provided"
    print "Get %s of user %s" % (desiredfield, uid)
    if not app.config['DB_INIT']:
        dbinit()
    res = dbu.DBGetUserField(app.config['DB_CONN'], app.config['DB_CUR'], desiredfield, uid)
    if res is None:
        return "ERROR: %s not a valid field or %s not a valid uid" % (desiredfield, uid)
    return res
    #if desiredfield == 'fname':
    #    return dbu.DBGetUserFname(app.config['DB_CONN'], app.config['DB_CUR'], int(firstitem))
    #if desiredfield == 'lname':
    #    return dbu.DBGetUserLname(app.config['DB_CONN'], app.config['DB_CUR'], int(firstitem))
    #if desiredfield == 'cyear':
    #    return dbu.DBGetUserCyear(app.config['DB_CONN'], app.config['DB_CUR'], int(firstitem))
    #return "%s not a valid field" % desiredfield

@app.route('/get/allactive/', methods=['GET'])
def getallactiveevents():
    if not app.config['DB_INIT']:
        dbinit()
    eventlst = dbu.DBGetAllActiveEvents(app.config['DB_CONN'], app.config['DB_CUR'])
    eventlstjson = json.dumps(eventlst)
    return eventlstjson

@app.route('/user/<username>')
def varcall(username):
    return 'Your username: ' + username

app.wsgi_app = ProxyFix(app.wsgi_app)

if __name__ == '__main__':
    app.debug=True
#    global conn, cur
#    conn, cur = dbu.DBConnect('atown.db')
#    dbu.DBInitResetTables(conn, cur)
    app.run()
