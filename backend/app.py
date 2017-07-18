# from urllib2 import urlopen
from urllib.request import urlopen
from flask import Flask, jsonify
from datetime import datetime
import requests, json

app = Flask(__name__)

apiUrl = "http://ergast.com/api/f1/current/"

@app.route('/')
def homepage():
    return "Backend for F1 Portal app"


#Obtaining the drivers standings data
@app.route('/get_drivers')
def get_drivers():

    #Obtain current cached file's expiry info
    try:
        with open('driver_data.json') as file:
            driver_data = json.load(file)
    except FileNotFoundError:
        return get_drivers_refresh()

    driver_data_expiry = driver_data["expiryDate"]
    refresh_date = datetime.strptime(driver_data_expiry, '%Y-%m-%d')

    #Check to obtain from cache or refresh data based on cache's expiry info
    if (datetime.now() >= refresh_date):
        return get_drivers_refresh()
    else:
        return jsonify(driver_data)


#Obtaining the drivers standings data from the Ergast API
def get_drivers_refresh():

    drivers_standings = requests.get(apiUrl + 'driverStandings.json')
    data = drivers_standings.json()

    #Adding expiry date to drivers standings json file to aid Caching
    #TODO: Update requirements.txt to add urlopen
    #TODO: Cache this to a json file too

    response = urlopen("http://ergast.com/api/f1/current.json")
    race_schedule = json.load(response)

    racesJson = race_schedule["MRData"]["RaceTable"]["Races"]
    curr_date = datetime.now()
    for rJson in racesJson:
        dateJson = rJson["date"]
        race_date = datetime.strptime(dateJson, '%Y-%m-%d')
        if (curr_date < race_date):
            data["expiryDate"] = race_date.strftime('%Y-%m-%d')
            break

    with open('driver_data.json', 'w') as file:
        json.dump(data, file)

    return str(data)


@app.route('/get_constructors')
def get_constructors():
    constructors_standings = requests.get(apiUrl + 'constructorStandings.json')
    return constructors_standings.text


if __name__ == '__main__':
    app.run()
