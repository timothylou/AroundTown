import requests
import json

payload = {'key1': 'value1', 'key2': 'value2'}
r = requests.get('https://api.github.com/events',params=payload)
print r.url
#print r.text

r = requests.get('https://api.github.com/events')
print r.url
#print r.text[r.text.find('payload'):]
#print r.json()

r = requests.get('http://127.0.0.1:5000')
print r.url
print r.text

r = requests.post('http://127.0.0.1:5000/post/', json = json.dumps({'omg':'it worked'}))
print r.url
print r.text

r = requests.get('http://127.0.0.1:5000/get/', params=payload)
print r.url
print r.text

r = requests.get('http://127.0.0.1:5000/user/timothy')
print r.url
print r.text

usrdict = {'fname': 'Tim', 'lname': 'Lou', 'cyear': 2019, 'userid': 1}
r = requests.post('http://127.0.0.1:5000/post/newuser/', json=json.dumps(usrdict))
print r.url
print r.text

usrdict2 = {'fname': 'Karen', 'lname': 'Zhang', 'cyear': 2019, 'userid': 2}
r = requests.post('http://127.0.0.1:5000/post/newuser/', json=json.dumps(usrdict2))
print r.url
print r.text

payload2 = {'userid': 1, 'desired': 'fname'}
r = requests.get('http://127.0.0.1:5000/get/userinfo/', params = payload2)
print r.url
print r.text


payload3 = {'userid': 1, 'desired': 'lname'}
r = requests.get('http://127.0.0.1:5000/get/userinfo/', params = payload3)
print r.url
print r.text

payload4 = {'userid': 1, 'desired': 'notvalidfield'}
r = requests.get('http://127.0.0.1:5000/get/userinfo/', params = payload4)
print r.url
print r.text

'''Coordinate: {lat: 1212, lon: 123123}
Title: 'blah',
Description: 'blah' '''
