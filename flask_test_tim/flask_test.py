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
    postedjson = request.get_json()
    print request.url
    usrdict = json.loads(postedjson)
    if 'fname' not in usrdict:
        return 'ERROR: no fname value received'
    if 'lname' not in usrdict:
        return 'ERROR: no lname value received'
    if 'userid' not in usrdict:
        return 'ERROR: no userid value received'
    if 'cyear' not in usrdict:
        return 'ERROR: no cyear value received'
    fname = usrdict['fname']
    lname = usrdict['lname']
    uid = usrdict['userid']
    cyear = usrdict['cyear']
    print app.config['DB_INIT']
    print dbpath
    if not app.config['DB_INIT']:
        print "in here"
        conn, cur = dbu.DBConnect(dbpath)
        app.config['DB_CONN'] = conn
        app.config['DB_CUR'] = cur
        app.config['DB_INIT'] = True
        print conn, cur
        print app.config['DB_CONN'], app.config['DB_CUR']
        dbu.DBInitResetTables(app.config['DB_CONN'], app.config['DB_CUR'])
        app.config['DB_INIT'] = True
    print app.config['DB_INIT']
    dbu.DBAddUser(app.config['DB_CONN'], app.config['DB_CUR'], uid, fname, lname, cyear)
    return "Query executed: added user %d" % (uid)

@app.route('/get/', methods=['GET'])
def getcall():
    firstitem = request.args.get('key1','[default]')
    print firstitem
    return "you want: " + firstitem

@app.route('/get/userinfo/', methods=['GET'])
def getuserinfo():
    firstitem = request.args.get('userid','')
    if firstitem == '':
        return "ERROR: no userid provided"
    desiredfield = request.args.get('desired','')
    if desiredfield == '':
        return "ERROR: no desired field provided"
    print "Get %s of user %s" % (desiredfield, firstitem)
    if not app.config['DB_INIT']:
        conn, cur = dbu.DBConnect(dbpath)
        app.config['DB_CONN'] = conn
        app.config['DB_CUR'] = cur
        dbu.DBInitResetTables(app.config['DB_CONN'], app.config['DB_CUR'])
        app.config['DB_INIT'] = True
    if desiredfield == 'fname':
        return dbu.DBGetUserFname(app.config['DB_CONN'], app.config['DB_CUR'], int(firstitem))
    if desiredfield == 'lname':
        return dbu.DBGetUserLname(app.config['DB_CONN'], app.config['DB_CUR'], int(firstitem))
    if desiredfield == 'cyear':
        return dbu.DBGetUserCyear(app.config['DB_CONN'], app.config['DB_CUR'], int(firstitem))
    return "%s not a valid field" % desiredfield


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
