import requests
import json

#payload = {'key1': 'value1', 'key2': 'value2'}
#r = requests.get('https://api.github.com/events',params=payload)
#print r.url
#print r.text

#r = requests.get('https://api.github.com/events')
#print r.url
#print r.text[r.text.find('payload'):]
#print r.json()

print "Sanity Check: should return 'hi'"
r = requests.get('http://ec2-54-167-219-88.compute-1.amazonaws.com')
print r.url
print r.text
print

print "Standard random json dump"
r = requests.post('http://ec2-54-167-219-88.compute-1.amazonaws.com/post/', json = json.dumps({'omg':'it worked'}))
print r.url
print r.text
print

#r = requests.get('http://ec2-54-167-219-88.compute-1.amazonaws.com/get/', params=payload)
#print r.url
#print r.text

print "Check /user/timothy/ should return 'Your username: timothy'"
r = requests.get('http://ec2-54-167-219-88.compute-1.amazonaws.com/user/timothy')
print r.url
print r.text
print

print "Check posting user info"
usrdict = {'fname': 'Tim', 'lname': 'Lou', 'cyear': 2019, 'netid': 'tlou'}
r = requests.post('http://ec2-54-167-219-88.compute-1.amazonaws.com/post/newuser/', json=json.dumps(usrdict))
print r.url
uid_tim = r.text
print uid_tim
print

print "Check posting user info 2"
usrdict2 = {'fname': 'Karen', 'lname': 'Zhang', 'cyear': 2019, 'netid': 'kz7'}
r = requests.post('http://ec2-54-167-219-88.compute-1.amazonaws.com/post/newuser/', json=json.dumps(usrdict2))
print r.url
print r.text
print

print "Getting first name of userid associated with Tim"
payload2 = {'userid': uid_tim, 'desired': 'firstname'}
r = requests.get('http://ec2-54-167-219-88.compute-1.amazonaws.com/get/userinfo/', params = payload2)
print r.url
print r.text
print

print "Check posting event info"
eventdict = {'lat': 0.0, 'lon': 1.1, 'title': 'birthday party', 'desc': 'its lit', 'cat': 9, 'oid': uid_tim, 'netid': 'tlou', 'stime': '00:54', 'dur': 60}
r = requests.post('http://ec2-54-167-219-88.compute-1.amazonaws.com/post/newevent/', json=json.dumps(eventdict))
eventid = r.text
print eventid

#payload3 = {'userid': 1, 'desired': 'lname'}
#r = requests.get('http://ec2-54-167-219-88.compute-1.amazonaws.com/get/userinfo/', params = payload3)
#print r.url
#print r.text

#payload4 = {'userid': 1, 'desired': 'notvalidfield'}
#r = requests.get('http://ec2-54-167-219-88.compute-1.amazonaws.com/get/userinfo/', params = payload4)
#print r.url
#print r.text

'''Coordinate: {lat: 1212, lon: 123123}
Title: 'blah',
Description: 'blah' '''
