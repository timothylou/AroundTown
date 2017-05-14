# External module imports
from flask import Flask, render_template, request, url_for
from apscheduler.schedulers.background import BackgroundScheduler
import requests
from werkzeug.contrib.fixers import ProxyFix
import json
import logging
from geopy.distance import vincenty

# Internal module imports
import cloudutils.DBUtils as dbu
import cloudutils.OneSignalUtils as osu
from config import dbpath
from config import coord_to_college_map
from config import radius_college_map

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
app.config['DB_EVENTS_REQD_FIELDS'] = ['latitude', 'longitude', 'title', 'description', 'cat', 'catname', 'catdisplayname', 'oid', 'netid', 'stime', 'dur']
app.config['DB_EVENTS_VALID_FIELDS'] = ['eventid', 'latitude', 'longitude', 'title', 'description', 'category', 'ownerid', 'netid', 'starttime', 'duration', 'status']
app.config['DB_EVENTVOTE_REQD_FIELDS'] = ['eventid', 'upvotechange', 'downvotechange']
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

# Event-refreshing job to run periodically in background
def refreshRecache(conn, cur):
    dbu.DBRefreshStatus(conn, cur)
    eventlst = dbu.DBGetAllActiveEvents(conn, cur)
    app.config['EVENTS_LIST'] = json.dumps(eventlst)
        
dbinit()

# Schedule event refresh
logging.basicConfig()
scheduler = BackgroundScheduler()
scheduler.start()
scheduler.add_job(
    refreshRecache, 'interval',
    seconds=30,
    args=[app.config['DB_CONN'], app.config['DB_CUR']],
    id='refresh_event_statuses',
    replace_existing=True
)

# Add new user to database
@app.route('/post/newuser/', methods=['POST'])
def postnewuser():
    postedjson = request.data
    try:
        usrdict = json.loads(postedjson)
    except:
        return 'ERROR: could not parse json'
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
    return "Success"

# Edit details of an existing user
@app.route('/edit/existinguser/', methods=['POST'])
def editexistinguser():
    postedjson = request.data
    try:
        usrdict = json.loads(postedjson)
    except:
        return "ERROR: could not parse json"
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
    dbu.DBEditUser(app.config['DB_CONN'], app.config['DB_CUR'], uid, fname, lname, cyear, netid, email)
    return "Success"

# Add new event to the map; send appropriate notifications
@app.route('/post/newevent/', methods=['POST'])
def postnewevent():
    print request.url
    postedjson = request.data
    try:
        eventdict = json.loads(postedjson)
    except:
        return "ERROR: could not parse json"
    for attrib in app.config['DB_EVENTS_REQD_FIELDS']:
        if attrib not in eventdict:
            return 'ERROR: no %s value received' % (attrib)
    lat = eventdict['latitude']
    lon = eventdict['longitude']
    title = eventdict['title']
    desc = eventdict['description']
    cat = eventdict['cat']
    catname = eventdict['catname']
    catdisplayname = eventdict['catdisplayname']
    oid = eventdict['oid']
    netid = eventdict['netid']
    stime = eventdict['stime']
    dur = eventdict['dur']
    if not app.config['DB_INIT']:
        dbinit()
    # add event to database
    eventid = dbu.DBAddEvent(app.config['DB_CONN'], app.config['DB_CUR'], lon, lat, title, desc, cat, oid, netid, stime, dur)
    # get active event list from database
    eventlst = dbu.DBGetAllActiveEvents(app.config['DB_CONN'], app.config['DB_CUR'])
    # update cached eventlist
    app.config['EVENTS_LIST'] = json.dumps(eventlst)
    taglist = [catname]
    # add res colleges to taglist if new event falls within any
    for college, coord in coord_to_college_map.iteritems():
        print "dist between", college, "and pin is", vincenty(coord, (lat, lon)).meters
        if vincenty(coord, (lat, lon)).meters < radius_college_map[college]:
            taglist.append(college)
            print college, "appended to taglist"
    # send notification to correct audience
    osu.OSPushNotification(app.config['OS_APP_ID'], app.config['OS_AUTH'], oid, lat, lon, title, catdisplayname, dur, taglist)
    return "%s" % (eventid)

# Post preferences to OneSignal
@app.route('/post/prefs/', methods=['POST'])
def postprefs():
    postedjson = request.data
    try:
        infodict = json.loads(postedjson)
    except:
        return "ERROR: could not parse json"
    print postedjson
    for attrib in app.config['OS_TAGS_REQD_FIELDS']:
        if attrib not in infodict:
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
    print "Posting to", deviceid, "tags:", tagdict
    osu.OSPutTags(app.config['OS_APP_ID'], app.config['OS_AUTH'], deviceid, userid, locprefs)
    return "Success"

# Get user information of a user given a userid
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

# Get event information given an eventid
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

# Return list of all active events
@app.route('/get/allactive/', methods=['GET'])
def getallactiveevents():
    return app.config['EVENTS_LIST']

# Delete event
@app.route('/post/deleteevent/', methods=['POST'])
def deleteevent():
    postedjson = request.data
    try:
        deletedict = json.loads(postedjson)
    except:
        return 'ERROR: could not parse json'
    for attrib in app.config['DB_DELETEEVENT_REQD_FIELDS']:
        if attrib not in deletedict:
            return 'ERROR: no %s value received!' % (attrib)
    eventid = deletedict['eventid']
    print "Deleting event with eid %s" % (eventid)
    dbu.DBSetEventStatus(app.config['DB_CONN'], app.config['DB_CUR'], eventid, 0)
    print "Done"
    eventlst = dbu.DBGetAllActiveEvents(app.config['DB_CONN'], app.config['DB_CUR'])
    app.config['EVENTS_LIST'] = json.dumps(eventlst)
    return "Success"

# Logout user
@app.route('/logout/', methods=['POST'])
def loguserout():
    postedjson = request.data
    try:
        logoutdict = json.loads(postedjson)
    except:
        return 'ERROR: could not parse json'
    for attrib in app.config['OS_LOGOUT_REQD_FIELDS']:
        if attrib not in logoutdict:
            return 'ERROR: no %s value received' % (attrib)
    deviceid = logoutdict['deviceid']
    print "deactivating device " + deviceid
    osu.OSDeactivateStatus(app.config['OS_APP_ID'], app.config['OS_AUTH'], deviceid)
    return "Success"

# Turn on mute notifications mode for user
@app.route('/muteall/', methods=['POST'])
def mutenotifs():
    postedjson = request.data
    try:
        mutedict = json.loads(postedjson)
    except:
        return 'ERROR: could not parse json'
    if 'deviceid' not in mutedict:
        return 'ERROR: no deviceid value received'
    deviceid = mutedict['deviceid']
    print "muting notifications for device " + deviceid
    osu.OSDeactivateStatus(app.config['OS_APP_ID'], app.config['OS_AUTH'], deviceid)
    return "Success"

# Turn on notifications mode for user
@app.route('/unmuteall/', methods=['POST'])
def unmutenotifs():
    postedjson = request.data
    try:
        unmutedict = json.loads(postedjson)
    except:
        return 'ERROR: could not parse json'
    if 'deviceid' not in unmutedict:
        return 'ERROR: no deviceid value received'
    deviceid = unmutedict['deviceid']
    print "unmuting notifications for device " + deviceid
    osu.OSActivateStatus(app.config['OS_APP_ID'], app.config['OS_AUTH'], deviceid)
    return "Success"

# Vote for event
@app.route('/vote/', methods=['POST'])
def voteevent():
    postedjson = request.data
    try:
        votedict = json.loads(postedjson)
    except:
        return 'ERROR: could not parse json'
    for attrib in app.config['DB_EVENTVOTE_REQD_FIELDS']:
        if attrib not in votedict:
            return 'ERROR: no %s value received' % (attrib)
    eventid = votedict['eventid']
    upvotechange = votedict['upvotechange']
    downvotechange = votedict['downvotechange']
    dbu.DBUpdateVoteStatus(app.config['DB_CONN'], app.config['DB_CUR'], eventid, upvotechange, downvotechange)
    eventlst = dbu.DBGetAllActiveEvents(app.config['DB_CONN'], app.config['DB_CUR'])
    app.config['EVENTS_LIST'] = json.dumps(eventlst)
    return "Success"
    
# Configuration adjustments
app.wsgi_app = ProxyFix(app.wsgi_app)

if __name__ == '__main__':
    app.debug=True
    app.run()
