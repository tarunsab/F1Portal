from flask import Flask, jsonify
from datetime import datetime
from DBManager import DBManager

import requests
import json

app = Flask(__name__)

apiUrl = "http://ergast.com/api/f1/current"


@app.route('/')
def homepage():
    get_standings_from_api()
    return "Backend for F1 Portal app"


# Obtaining the drivers and constructors standings data
@app.route('/get_standings')
def get_standings():
    # Obtaining cached standings data from database
    entry = DBManager.get_standings_entry()
    standings_json = entry[0][0]

    # If standings data not in database, refresh from API and cache in DB
    if standings_json == '':
        print("Cached Standings file not found.")
        return jsonify(get_standings_from_api())

    # Obtaining the expiry date of the cached standings data
    refresh_date_raw = standings_json["expiryDate"]
    refresh_date = datetime.strptime(refresh_date_raw, '%Y-%m-%d')

    # Check to obtain from cache or refresh from API and re-cache based on
    # cache's expiry date
    if datetime.now() >= refresh_date:
        print("Cached standings file out of date.")
        return jsonify(get_standings_from_api())
    else:
        print("Obtained standings from cached file")
        return jsonify(standings_json)


# Obtaining the drivers and constructors standings data from Ergast API and
# caching to database
def get_standings_from_api():
    # Obtaining drivers and constructors json from API
    standings_json = {}

    drivers_standings = requests.get(apiUrl + '/driverStandings.json')
    driver_json = drivers_standings.json()
    standings_json["driver_standings"] = driver_json

    constructor_standings = requests.get(apiUrl + '/constructorStandings.json')
    constructor_json = constructor_standings.json()
    standings_json["constructor_standings"] = constructor_json

    # Adding expiry date to standings json file to aid Caching
    # by finding next race to add expiry info to json
    schedule_json = json.loads(get_schedule().data)
    races_json = schedule_json["MRData"]["RaceTable"]["Races"]
    curr_date = datetime.now()

    for race in races_json:

        # Obtain race date
        race_date_raw = race["date"]
        race_date = datetime.strptime(race_date_raw, '%Y-%m-%d')

        # If race date has not elapsed for the current race in the ordered
        # list, then set json to be that race date
        if curr_date < race_date:
            standings_json["expiryDate"] = race_date.strftime('%Y-%m-%d')
            break

    # Update cached standings file in database
    DBManager.update_standings_entry(standings_json)

    print("Updated standings from API")
    return standings_json


# Obtaining the current season's race schedule
@app.route('/get_schedule')
def get_schedule():
    # Obtaining cached schedule data from database
    entry = DBManager.get_schedule_entry()
    schedule_data = entry[0][0]

    # If standings data not in database, refresh from API and cache in DB
    if schedule_data == '':
        print("Cached Schedule file not found.")
        return jsonify(get_schedule_from_api())

    # If data isn't for the current season, update it from API and re-cache
    # in database
    json_season = int(schedule_data["MRData"]["RaceTable"]["season"])
    current_season = datetime.now().year
    if json_season != current_season:
        print("Cached Schedule file out of date. "
              "Cached season = " + str(json_season) +
              ", Current season = " + str(current_season))
        return jsonify(get_schedule_from_api())

    # Otherwise, return cached data
    print("Obtained season schedule from cached file")
    return jsonify(schedule_data)


# Obtaining the current season's race schedule from ErgastAPI and caching it
# in the database
def get_schedule_from_api():
    # Obtain cached race schedule form API
    response = requests.get(apiUrl + ".json")
    new_schedule_data = response.json()

    # Add image per track to data
    new_schedule_data = add_images_to_schedule(new_schedule_data)

    # Cache new data in database
    DBManager.update_schedule_entry(new_schedule_data)

    print("Updated season schedule for new season from API")
    return new_schedule_data


# Adding track images to every race in the season schedule/calendar
def add_images_to_schedule(new_schedule_data):
    track_image_url = {
        "Australia": "https://www.imageupload.co.uk/images/2017/07/28/"
                     "australian.jpg",
        "China": "https://www.imageupload.co.uk/images/2017/07/28/"
                 "chinese.jpg",
        "Bahrain": "https://www.imageupload.co.uk/images/2017/07/28/"
                   "bahrain.jpg",
        "Russia": "https://www.imageupload.co.uk/images/2017/07/28/"
                  "russian.jpg",
        "Spain": "https://www.imageupload.co.uk/images/2017/07/28/"
                 "spanish.jpg",
        "Monaco": "https://www.imageupload.co.uk/images/2017/07/28/"
                  "monaco.jpg",
        "Canada": "https://www.imageupload.co.uk/images/2017/07/28/"
                  "canadian.jpg",
        "Azerbaijan": "https://www.imageupload.co.uk/images/2017/07/28/"
                      "azerbaijan.jpg",
        "Austria": "https://www.imageupload.co.uk/images/2017/07/28/"
                   "austrian.jpg",
        "UK": "https://www.imageupload.co.uk/images/2017/07/28/"
              "british.jpg",
        "Hungary": "https://www.imageupload.co.uk/images/2017/07/28/"
                   "hungary.jpg",
        "Belgium": "https://www.imageupload.co.uk/images/2017/07/28/"
                   "belgian.jpg",
        "Italy": "https://www.imageupload.co.uk/images/2017/07/28/"
                 "italian.jpg",
        "Singapore": "https://www.imageupload.co.uk/images/2017/07/28/"
                     "singapore.jpg",
        "Malaysia": "https://www.imageupload.co.uk/image/DPbz",
        "Japan": "https://www.imageupload.co.uk/images/2017/07/28/"
                 "japanese.jpg",
        "America": "https://www.imageupload.co.uk/images/2017/07/28/"
                   "american2.jpg",
        "Mexico": "https://www.imageupload.co.uk/images/2017/07/28/"
                  "mexican2.jpg",
        "Brazil": "https://www.imageupload.co.uk/images/2017/07/28/"
                  "brazilian.jpg",
        "UAE": "https://www.imageupload.co.uk/images/2017/07/28/"
               "uae.jpg",
    }

    race_list = new_schedule_data["MRData"]["RaceTable"]["Races"]

    for track in race_list:
        track_country = track["Circuit"]["Location"]["country"]
        image_url = track_image_url.get(track_country
                                        ,"https://www.imageupload.co.uk/image/DPb2")
        track["Circuit"]["imageURL"] = image_url

    return new_schedule_data


# Tester function for quick debugging
def test():
    # get_schedule_from_api()
    pass


if __name__ == '__main__':
    app.run()
    # test()
