from flask import Flask, jsonify
from datetime import datetime
from DBManager import DBManager

import requests
import json

app = Flask(__name__)

apiUrl = "http://ergast.com/api/f1/current/"
dbManager = None


@app.route('/')
def homepage():
    return "Backend for F1 Portal app"


# Obtaining the drivers standings data
@app.route('/get_drivers')
def get_drivers():

    # Obtaining cached drivers standings data from database
    entry = dbManager.get_standings_entry()
    driver_data = entry[0][0]

    # If standings data not in database, refresh from API and store in DB
    if driver_data == '':
        print("Cached Standings file not found.")
        return jsonify(get_drivers_from_api())

    # Obtaining the expiry date of the cached standings data
    driver_data_expiry = driver_data["expiryDate"]
    refresh_date = datetime.strptime(driver_data_expiry, '%Y-%m-%d')

    # Check to obtain from cache or refresh data based on cache's expiry info
    if datetime.now() >= refresh_date:
        print("Cached Standings file out of date.")
        return jsonify(get_drivers_from_api())
    else:
        print("Obtained driver standing details from cached file")
        return jsonify(driver_data)


# Obtaining the drivers standings data from the Ergast API
def get_drivers_from_api():

    # Obtaining json from API
    drivers_standings = requests.get(apiUrl + 'driverStandings.json')
    data = drivers_standings.json()

    # Adding expiry date to drivers standings json file to aid Caching
    # by finding next race to add expiry info to json
    race_schedule = json.loads(get_schedule().data)
    # print(race_schedule["MRData"])
    races_json = race_schedule["MRData"]["RaceTable"]["Races"]
    curr_date = datetime.now()
    for r_json in races_json:
        date_json = r_json["date"]
        race_date = datetime.strptime(date_json, '%Y-%m-%d')
        if curr_date < race_date:
            data["expiryDate"] = race_date.strftime('%Y-%m-%d')
            break

    dbManager.update_standings_entry(data)
    print("Updated standings from API")
    return data


@app.route('/get_constructors')
def get_constructors():
    constructors_standings = requests.get(apiUrl + 'constructorStandings.json')
    return constructors_standings.text


@app.route('/get_schedule')
def get_schedule():

    # Obtaining cached schedule data from database
    entry = dbManager.get_schedule_entry()
    schedule_data = entry[0][0]

    # If standings data not in database, refresh from API and store in DB
    if schedule_data == '':
        print("Cached Schedule file not found.")
        return jsonify(get_schedule_from_api())

    # If data isn't for the current season, update it
    json_season = int(schedule_data["MRData"]["RaceTable"]["season"])
    current_season = datetime.now().year
    if json_season != current_season:
        print("Cached Schedule file out of date. "
              "Cached season = " + str(json_season) +
              ", Current season = " + str(current_season))
        return jsonify(get_schedule_from_api())

    print("Obtained season schedule from cached file")
    return jsonify(schedule_data)


def get_schedule_from_api():

    response = requests.get("http://ergast.com/api/f1/current.json")
    new_schedule_data = response.json()
    dbManager.update_schedule_entry(new_schedule_data)
    print("Updated season schedule for new season from API")

    return new_schedule_data

if __name__ == '__main__':
    dbManager = DBManager()
    app.run()
