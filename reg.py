import SocketServer
import SimpleHTTPServer
import json
import sys
import re
from copy import deepcopy

courses = []
dist = ["la", "sa", "ha", "em", "ec", "qr", "stl", "stn"]
days = ["m", "t", "w", "th", "f", "mw", "mwf", "tth", "twth", "mtwth", "mtwthf"]


# CourseNumber Area Section Day Time Title Professors Building Room

# time( in hh:mm - hh:mm format), or the title, or a professor, or the building, or the room.
class Reply(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_GET(self):
        results = deepcopy(courses)
        queries = self.path.split("/")[1:]
        queries = [query.lower() for query in queries]
        if(len(queries)>0):
            for query in queries:
                if query in dist:
                    results = [result for result in results if result["area"].lower() == query]
                elif query in days:
                    results = [result for result in results if (result["classes"] and result["classes"][0]["days"].lower() == query)]
                elif len(query) == 3:
                    temp_res = []
                    if query.isalpha():
                        for result in results:
                            found = False
                            for listing in result["listings"]:
                                if listing["dept"].lower() == query:
                                    found = True
                            if found:
                                temp_res.append(result)

                    elif query.isdigit():
                        for result in results:
                            found = False
                            for listing in result["listings"]:
                                if listing["number"].lower() == query:
                                    found = True
                            if found:
                                temp_res.append(result)

                    results = temp_res
                elif len(query) > 3:

                    rexp = re.compile(query, re.IGNORECASE)
                    temp_res = []
                    for result in results:
                        found = False
                        if rexp.search(result["title"]):
                            found = True

                        for clas in result["classes"]:
                            if rexp.search(clas["time"]) or rexp.search(clas["bldg"]) or rexp.search(clas["roomnum"]):
                                found = True

                        for prof in result["profs"]:
                            if rexp.search(prof["name"]):
                                found = True

                        if found:
                            temp_res.append(result)
                    results = temp_res
                else:
                    results = []


        for result in results:
            dept = ""
            area = ""
            section = ""
            day = ""
            time = ""
            title = ""
            profs = ""
            bldg = ""
            room = ""

            dept += result["listings"][0]["dept"] + " " + result["listings"][0]["number"]

            for listing in result["listings"][1:]:
                dept += "/" + listing["dept"] + " " + listing["number"]

            area += result["area"]

            for clas in result["classes"]:
                section += clas["section"]
                day += clas["days"]
                time += clas["time"]

            title += result["title"]

            if result["profs"]:
                profs += result["profs"][0]["name"]
                for prof in result["profs"][1:]:
                    profs += "/" +  prof["name"]

            for clas in result["classes"]:
                bldg += clas["bldg"]
                room += clas["roomnum"]


            output = dept + " " + area + " " + section + " " + day + " " + time + " "+ title + " " + profs + " " + bldg + " " + room + "\n"
            self.wfile.write(output.encode("utf8"))
        if(not results):
            self.wfile.write("\n")


def main():
    # read and parse courses.json
    port = 8080
    ctr = 0
    if(len(sys.argv[1:])):
        port = int(sys.argv[1])
    global courses
    sections = ['L','C','S','U']
    with open('courses.json') as json_data:
        courses_data = json.load(json_data)

    for course in courses_data:

        prefilter = len(course["classes"])
        course["classes"] = [clas for clas in course["classes"] if clas["section"][0] in sections]
        if not(prefilter > 0 and not len(course["classes"])):
            for clas in course["classes"]:
                clas["time"] = clas["starttime"][:-3] + "-" + clas["endtime"][:-3]
            ndeepcopy = len(course["classes"])
            classes = course["classes"]
            course["classes"] = []
            if(ndeepcopy):
                for i in range(ndeepcopy):
                    class_temp = deepcopy(course)
                    class_temp["classes"].append(classes[i])
                    courses.append(class_temp)
            else:
                class_temp = deepcopy(course)
                courses.append(class_temp)
    SocketServer.ForkingTCPServer(('', port), Reply).serve_forever()

main()