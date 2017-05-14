import requests
import json

prefdict = {'deviceid': 'b75c8fc8-af9c-411c-b79d-f9059f158f31', 'tags': {'freefood': '1', 'facilities': '0' } }
r = requests.post('http://ec2-54-167-219-88.compute-1.amazonaws.com/post/prefs/', data=json.dumps(prefdict))
print r
print r.url
