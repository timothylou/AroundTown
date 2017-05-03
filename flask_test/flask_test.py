from flask import Flask, render_template, request, url_for
from apscheduler.schedulers.background import BackgroundScheduler

import requests
from werkzeug.contrib.fixers import ProxyFix
import cloudutils.DBUtils as dbu
import cloudutils.OneSignalUtils as osu
import json
from config import dbpath
import logging


# Create the application.
app = Flask(__name__)

# Store database connection and cursor
app.config['DB_CONN'] = None
app.config['DB_CUR']  = None
app.config['DB_INIT'] = False

# Cache events list
app.config['EVENTS_LIST'] = '{}'

# Store OneSignal constants
app.config['OS_APP_ID'] = '39b2daee-d8a9-4d37-aabb-63c5da1804fb'
app.config['OS_AUTH'] = 'Basic NzgwMWI2OTEtMjZmMS00OGViLWFkZTgtNDc3ZWNmZTI0MDEx'

# Configure valid fields
app.config['DB_USERS_REQD_FIELDS'] = ['uid', 'fname', 'lname', 'cyear', 'netid', 'email']
app.config['DB_USERS_VALID_FIELDS'] = ['userid', 'firstname', 'lastname', 'classyear', 'netid', 'email']
app.config['DB_EVENTS_REQD_FIELDS'] = ['latitude', 'longitude', 'title', 'description', 'cat', 'oid', 'netid', 'stime', 'dur']
app.config['DB_EVENTS_VALID_FIELDS'] = ['eventid', 'latitude', 'longitude', 'title', 'description', 'category', 'ownerid', 'netid', 'starttime', 'duration', 'status']
app.config['DB_DELETEEVENT_REQD_FIELDS'] = ['eventid']
app.config['OS_TAGS_REQD_FIELDS'] = ['deviceid', 'userid', 'tags']
app.config['OS_LOGOUT_REQD_FIELDS'] = ['deviceid']

# Initialize the database connection
def dbinit():
    if not app.config['DB_INIT']:
        app.config['DB_CONN'], app.config['DB_CUR'] = dbu.DBConnect(dbpath)
        app.config['DB_INIT'] = True
        print app.config['DB_CONN'], app.config['DB_CUR']
        dbu.DBInitResetTables(app.config['DB_CONN'], app.config['DB_CUR'])
        print "Database initialized."

# Function to run in background
def refreshRecache(conn, cur):
    dbu.DBRefreshStatus(conn, cur)
    eventlst = dbu.DBGetAllActiveEvents(conn, cur)
    app.config['EVENTS_LIST'] = json.dumps(eventlst)
        
dbinit()

# Schedule event status refresh
logging.basicConfig()
scheduler = BackgroundScheduler()
scheduler.start()
scheduler.add_job(
    refreshRecache, 'interval',
    seconds=15,
    args=[app.config['DB_CONN'], app.config['DB_CUR']],
    id='refresh_event_statuses',
    replace_existing=True
)
        
# testing function
@app.route('/')
@app.route('/indexblah')
def index():
    """ Displays the index page accessible at '/'
    """
    #return render_template('index.html')
    return "hi"

# testing function
@app.route('/post/', methods=['POST'])
def postcall():
    #return request.form['key1'] + request.form['key2']
    print request.get_json()
    print request.url
    return "You posted: " + request.get_json()

@app.route('/post/newuser/', methods=['POST'])
def postnewuser():
    postedjson = request.data
    # can use try catch loop for loads
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
    # update eventlist
    eventlst = dbu.DBGetAllActiveEvents(app.config['DB_CONN'], app.config['DB_CUR'])
    app.config['EVENTS_LIST'] = json.dumps(eventlst)
    # send notification to correct audience
    osu.OSPushNotification(app.config['OS_APP_ID'], app.config['OS_AUTH'], oid, lat, lon, title, [cat])
    return "%s" % (eventid)

@app.route('/post/prefs/', methods=['POST'])
def postprefs():
    print request.url
    postedjson = request.data
    infodict = json.loads(postedjson)
    print postedjson
    for attrib in app.config['OS_TAGS_REQD_FIELDS']:
        if attrib not in infodict:
            print "errorrrrrrrrr- -------------------------------------------"
            return 'ERROR: no %s value received' % (attrib)
    deviceid = infodict['deviceid']
    userid = infodict['userid']
    tagdict = infodict['tags']
    if 'location' not in tagdict:
        return 'ERROR: no location prefs received'
    if 'category' not in tagdict:
        return 'ERROR: no category prefs received'
    locprefs = tagdict['location']
    catprefs = tagdict['category']
    print "loc prefs", locprefs
    print "cat prefs", catprefs
    locprefs.update(catprefs)
    print "Posting to ", deviceid, "tags:", tagdict
    osu.OSPutTags(app.config['OS_APP_ID'], app.config['OS_AUTH'], deviceid, userid, locprefs)
    return "Success"
    
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
    if desiredfield not in app.config['DB_USERS_VALID_FIELDS']:
        return "ERROR: %s not a valid field" % (desiredfield)
    print "Get %s of user %s" % (desiredfield, uid)
    if not app.config['DB_INIT']:
        dbinit()
    res = dbu.DBGetUserField(app.config['DB_CONN'], app.config['DB_CUR'], desiredfield, uid)
    if res is None:
        return "ERROR: %s not a valid uid" % (uid)
    return res

@app.route('/get/eventinfo/', methods=['GET'])
def geteventinfo():
    eid = request.args.get('eid','')
    if eid == '':
        return "ERROR: no eventid provided"
    desiredfield = request.args.get('desired','')
    if desiredfield == '':
        return "ERROR: no desired field provided"
    if desiredfield not in app.config['DB_EVENTS_VALID_FIELDS']:
        return "ERROR: %s not a valid field" % (desiredfield)
    print "GET %s of event %s" % (desiredfield, eid)
    if not app.config['DB_INIT']:
        dbinit()
    res = dbu.DBGetEventField(app.config['DB_CONN'], app.config['DB_CUR'], desiredfield, eid)
    if res is None:
        return "ERROR: %s not a valid eid" % (eid)
    return res

@app.route('/get/allactive/', methods=['GET'])
def getallactiveevents():
    return app.config['EVENTS_LIST']

@app.route('/post/deleteevent/', methods=['POST'])
def deleteevent():
    postedjson = request.data
    deletedict = json.loads(postedjson)
    for attrib in app.config['DB_DELETEEVENT_REQD_FIELDS']:
        if attrib not in deletedict:
            return 'ERROR: no %s value received!' % (attrib)
    eventid = deletedict['eventid']
    dbu.DBSetEventStatus(app.config['DB_CONN'], app.config['DB_CUR'], eventid, 0)
    eventlst = dbu.DBGetAllActiveEvents(app.config['DB_CONN'], app.config['DB_CUR'])
    app.config['EVENTS_LIST'] = json.dumps(eventlst)
    return "Success"
    
@app.route('/logout/', methods=['POST'])
def loguserout():
    postedjson = request.data
    logoutdict = json.loads(postedjson)
    for attrib in app.config['OS_LOGOUT_REQD_FIELDS']:
        if attrib not in logoutdict:
            return 'ERROR: no %s value received' % (attrib)
    deviceid = logoutdict['deviceid']
    print "deactivating device " + deviceid
    osu.OSDeactivateStatus(app.config['OS_APP_ID'], app.config['OS_AUTH'], deviceid)
    return "Success"

@app.route('/user/<username>')
def varcall(username):
    return 'Your username: ' + username

app.wsgi_app = ProxyFix(app.wsgi_app)

if __name__ == '__main__':
    app.debug=True
    app.run()
