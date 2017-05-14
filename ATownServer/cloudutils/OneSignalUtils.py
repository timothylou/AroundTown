import requests
import json

# Post preferences of user to OneSignal
def OSPutTags(appid, auth, deviceid, userid, tagsdict):
    rurl = 'https://onesignal.com/api/v1/players/%s' % (deviceid)
    rheaders = {'Content-Type': 'application/json', 'Authorization': auth}
    tagsdict['uid'] = userid
    tagsdict['active_status'] = 'true'
    rdata = {'app_id': appid, 'tags': tagsdict}
    print rdata
    req = requests.put(rurl, headers=rheaders, data=json.dumps(rdata))
    print req.url
    print req.reason, req.status_code

# Send out push notification to users in radius or matching tags in tagslist
def OSPushNotification(appid, auth, oid, lat, lon, title, catdisplayname, dur, tagslist):
    rurl = 'https://onesignal.com/api/v1/notifications'
    rheaders = {'Content-Type': 'application/json; charset=utf-8', 'Authorization': auth}
    rdata = {'app_id': appid, 'android_group': 'atown', 'android_group_message': {'en': '$[notif_count] new hoots'}, 'ttl': dur*60, 'filters': [{'field': 'location', 'lat': str(lat), 'long': str(lon), 'radius': str(200)}], 'contents': {'en': catdisplayname + ' nearby: ' + title}}
    rdata['filters'].append({'field': 'tag', 'key': 'uid', 'relation': '!=', 'value': oid})
    rdata['filters'].append({'field': 'tag', 'key': 'active_status', 'relation': '=', 'value': 'true'})
    for tag in tagslist:
        rdata['filters'].append({'operator': 'OR'})
        rdata['filters'].append({'field': 'tag', 'key': 'uid', 'relation': '!=', 'value': oid})
        rdata['filters'].append({'field': 'tag', 'key': tag, 'relation': '=', 'value': 'true'})
        rdata['filters'].append({'field': 'tag', 'key': 'active_status', 'relation': '=', 'value': 'true'})
    print rdata
    req = requests.post(rurl, headers=rheaders, data=json.dumps(rdata))
    print req.url
    print req.reason, req.status_code

# Mute notifications
def OSDeactivateStatus(appid, auth, deviceid):
    rurl = 'https://onesignal.com/api/v1/players/%s' % (deviceid)
    rheaders = {'Content-Type': 'application/json', 'Authorization': auth}
    offstatus = {}
    offstatus['active_status'] = 'false'
    rdata = {'app_id': appid, 'tags': offstatus}
    print rdata
    req = requests.put(rurl, headers=rheaders, data=json.dumps(rdata))
    print req.url
    print req.reason, req.status_code

# Unmute notifications
def OSActivateStatus(appid, auth, deviceid):
    rurl = 'https://onesignal.com/api/v1/players/%s' % (deviceid)
    rheaders = {'Content-Type': 'application/json', 'Authorization': auth}
    onstatus = {}
    onstatus['active_status'] = 'true'
    rdata = {'app_id': appid, 'tags': onstatus}
    print rdata
    req = requests.put(rurl, headers=rheaders, data=json.dumps(rdata))
    print req.url
    print req.reason, req.status_code
