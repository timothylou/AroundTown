import requests
import json


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

def OSPushNotification(appid, auth, oid, lat, lon, title, tagslist):
    rurl = 'https://onesignal.com/api/v1/notifications'
    rheaders = {'Content-Type': 'application/json; charset=utf-8', 'Authorization': auth}
    rdata = {'app_id': appid, 'filters': [{'field': 'location', 'lat': str(lat), 'long': str(lon), 'radius': str(1000)}], 'contents': {'en': 'Nearby: ' + title}}
    #rdata = {'app_id': appid, 'filters': [], 'contents': {'en': 'Nearby:' + title}}
    #rdata = {'app_id': appid, 'filters': [{'field': 'location', 'lat': str(lat), 'long': str(lon), 'radius': str(1000)}], 'contents': {'en': 'Nearby: ' + title}}
    rdata['filters'].append({'field': 'tag', 'key': 'uid', 'relation': '!=', 'value': oid})
    rdata['filters'].append({'field': 'tag', 'key': 'active_status', 'relation': '=', 'value': 'true'})
    for tag in tagslist:
        rdata['filters'].append({'operator': 'OR'})
        rdata['filters'].append({'field': 'tag', 'key': 'uid', 'relation': '!=', 'value': oid})
        rdata['filters'].append({'field': 'tag', 'key': tag, 'relation': '=', 'value': 'true'})
        rdata['filters'].append({'field': 'tag', 'key': 'active_status', 'relation': '=', 'value': 'true'})
        #rdata['filters'].append({'field': 'tag', 'key': 'uid', 'relation': '!=', 'value': oid})
    print rdata
    req = requests.post(rurl, headers=rheaders, data=json.dumps(rdata))
    print req.url
    print req.reason, req.status_code
    
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