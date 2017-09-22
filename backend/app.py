from flask import Flask, jsonify
from datetime import datetime, timedelta
from DBManager import DBManager
from Scraper import Scraper
from multiprocessing.pool import ThreadPool

import requests
import json
import time

app = Flask(__name__)

apiUrl = "http://ergast.com/api/f1/current"


@app.route('/')
def homepage():
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
        return jsonify(get_standings_from_api(None))

    # Obtaining the expiry date of the cached standings data
    refresh_date_raw = standings_json["expiryDate"]
    refresh_date = datetime.strptime(refresh_date_raw,
                                     '%Y-%m-%dT%H:%M:%SZ')
    refresh_date = refresh_date + timedelta(hours=2)

    # Check to obtain from cache or refresh from API and re-cache based on
    # cache's expiry date
    if datetime.utcnow() > refresh_date:
        print("Cached standings file out of date.")
        return jsonify(get_standings_from_api(standings_json))
    else:
        print("Obtained standings from cached file")
        return jsonify(standings_json)


# Obtaining the drivers and constructors standings data from Ergast API and
# caching to database
def get_standings_from_api(old_standings_json):
    # Obtaining drivers json from API
    new_standings_json = {}
    drivers_standings = requests.get(apiUrl + '/driverStandings.json')
    driver_json = drivers_standings.json()
    new_standings_json["driver_standings"] = driver_json

    # Checking if API standings are updated after race has ended
    if old_standings_json is not None:

        old_round = int(old_standings_json["driver_standings"]["MRData"]
                        ["StandingsTable"]["StandingsLists"][0]["round"])
        new_round = int(new_standings_json["driver_standings"]["MRData"]
                        ["StandingsTable"]["StandingsLists"][0]["round"])

        # If API standings are not yet updated, return old standings data with
        # the same expiry so this check will be conducted again next time
        if old_round == new_round:
            print("API standings are not yet updated. Using old cached data.")
            return old_standings_json

    # Obtaining Constructors json from API
    constructor_standings = requests.get(apiUrl + '/constructorStandings.json')
    constructor_json = constructor_standings.json()
    new_standings_json["constructor_standings"] = constructor_json

    # Adding expiry date to standings json file to aid Caching
    # by finding next race to add expiry info to json
    schedule_json = json.loads(get_schedule().data)
    races_json = schedule_json["MRData"]["RaceTable"]["Races"]
    curr_date = datetime.utcnow()

    for race in races_json:

        # Obtain race date and time
        race_date_raw = race["date"] + "T" + race["time"]
        race_date = datetime.strptime(race_date_raw, '%Y-%m-%dT%H:%M:%SZ')

        # If race date has not elapsed for the current race in the ordered
        # list, then set json to be that race date
        if curr_date < race_date:
            new_standings_json["expiryDate"] = race_date.strftime(
                '%Y-%m-%dT%H:%M:%SZ')
            break

    # Update cached standings file in database
    DBManager.update_standings_entry(new_standings_json)

    print("Updated standings from API")
    return new_standings_json


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
        "Malaysia": "https://www.imageupload.co.uk/images/2017/07/28/"
                    "malaysian.jpg",
        "Japan": "https://www.imageupload.co.uk/images/2017/07/28/"
                 "japanese.jpg",
        "USA": "https://www.imageupload.co.uk/images/2017/07/28/"
               "american2.jpg",
        "Mexico": "https://www.imageupload.co.uk/images/2017/07/28/"
                  "mexican297780.png",
        "Brazil": "https://www.imageupload.co.uk/images/2017/07/28/"
                  "brazilian.jpg",
        "UAE": "https://www.imageupload.co.uk/images/2017/07/28/uae2.jpg",
    }

    race_list = new_schedule_data["MRData"]["RaceTable"]["Races"]

    for track in race_list:
        track_country = track["Circuit"]["Location"]["country"]
        image_url = track_image_url.get(track_country
                                        , "https://www.imageupload.co.uk/"
                                          "image/DPb2")
        track["Circuit"]["imageURL"] = image_url

    return new_schedule_data


# Get session results from cache or scraper
def get_session_results(url, race_country, session_name, year):

    # Obtain cached results from database
    entry = DBManager.get_session_results_entry(race_country, session_name)

    # Check if valid using year/season and if empty. If valid, return
    if entry:
        cached_session_results = entry[0][0]
        if cached_session_results:
            json_year = cached_session_results['year']
            if json_year == year:
                print(session_name + " results obtained from cache")
                return cached_session_results

    # Otherwise, scrape
    session_results = {}


    if session_name[:2] == 'fp':
        session_results = Scraper.scrape_practice_results(url)

    elif session_name[0] == 'q':
        session_results = Scraper.scrape_qualifying_results(url)

    else:
        session_results = Scraper.scrape_race_results(url)

    # Add year to showtimes data to depict season
    session_results['year'] = year

    # Update cached showtimes file in database
    DBManager.update_session_results_entry(race_country,
                                           session_name,
                                           session_results)

    print("Showtimes obtained from website")
    return session_results


@app.route('/get_results/<string:season>/<string:race_country>')
def get_results(season, race_country):
    # Constructing URLs---------------------------------------------------------

    # Constructing URL to scrape results
    # e.g. http://www.skysports.com/f1/grandprix/australia/results/2017/
    #                                                               qualifying-1

    # url only work with lowercase countries
    race_country = race_country.lower()

    # Special case
    if race_country == "uae":
        race_country = "unitedarabemirates"

    url = "http://www.skysports.com/f1/grandprix/"
    url += race_country + "/results/" + season + "/"

    # Practice results URL
    p1_url = url + "/practice-1"
    p2_url = url + "/practice-2"
    p3_url = url + "/practice-3"

    # Qualifying results URL
    q1_url = url + "/qualifying-1"
    q2_url = url + "/qualifying-2"
    q3_url = url + "/qualifying-3"

    # Race results URL
    race_url = url + "/race"

    # Generating a results URL list
    sessions = ["fp1", "fp2", "fp3", "q1", "q2", "q3", "race"]
    urls = [p1_url, p2_url, p3_url, q1_url, q2_url, q3_url, race_url]

    # Constructing URL to scrape showtimes
    # e.g. "http://www.skysports.com/watch/f1-on-sky/grand-prix/italy"

    # Special case
    if race_country == "unitedarabemirates":
        race_country = "abu-dhabi"

    showtimes_url = "http://www.skysports.com/watch/f1-on-sky/grand-prix/"
    showtimes_url += race_country

    # Scraping and populating results JSON--------------------------------------
    results_json = {}
    pool = ThreadPool(processes=9)

    # Obtain showtimes for all sessions
    # TODO: Extract to Function that decides to get form cache of scrape rather
    # TODO: than placing that logic within the scraping function below
    showtimes_json = Scraper.scrape_showtimes(season, url, race_country)

    # Calculating the next session's ID(can have value in range 0-7). Tells
    # us the max session we need to obtain results for to avoid redundant
    # scraping/reading from cache when weekend is in progress.
    # TODO: Replace IDs and sessions with an enum class
    next_session_id = 0

    # By default, all sessions need to be obtained from cache in case weekend
    # has elapsed. So set the id to be the maximum.
    if not showtimes_json:
        next_session_id = 7

    # If weekend is in progress or hasn't started, can prune sessions to be
    # obtained from cache/website
    else:
        curr_timestamp = datetime.utcnow()
        for st in showtimes_json:
            if st in sessions:
                next_session_id += 1
                session_time_raw = showtimes_json[st]
                session_time = datetime.strptime(session_time_raw,
                                                 '%Y-%m-%dT%H:%M:%S')

                # If session hasn't elapsed. This is the next session as we are
                # iterating in ascending order of sessions in list so break
                if session_time > curr_timestamp:
                    break

    # Submitting tasks to execute concurrently
    tasks = []
    for i in range(next_session_id):

        session_name = sessions[i]

        # ID: 0-2 = practice. 3-5 = qualifying. 6 = race
        practice_id = 3
        qualifying_id = 6

        # If session is practice
        if i < practice_id:
            tasks.append(pool.apply_async(get_session_results, (urls[i],
                                                                race_country,
                                                                session_name,
                                                                season)))

        # If session is qualifying
        elif i < qualifying_id:
            tasks.append(pool.apply_async(get_session_results, (urls[i],
                                                                race_country,
                                                                session_name,
                                                                season)))

        # If session is race
        else:
            tasks.append(pool.apply_async(get_session_results, (urls[i],
                                                                race_country,
                                                                session_name,
                                                                season)))

    # Waiting for executing tasks to obtain JSON results and then populating
    # results JSON with the obtained results------------------------------------
    for i in range(len(sessions)):

        # If session has been submitted to be scraped
        if i < len(tasks):
            get = tasks[i].get()
            results_json[sessions[i]] = get

        else:
            results_json[sessions[i]] = ""

    # Obtain latest session based on results published. Cannot use
    # next_session_id as we could be waiting for current session results to be
    # published after it has elapsed which that variable doesnt account for.
    latest_session = "fp1"
    for session in results_json:

        session_data = results_json[session]["timesheet"]

        if session_data:
            latest_session = session
        else:
            break

    if latest_session == "race":
        results_json["latestSessionType"] = latest_session
        results_json["latestSessionNum"] = "1"
    else:
        results_json["latestSessionType"] = latest_session[:-1]
        results_json["latestSessionNum"] = latest_session[-1:]

    results_json.update(showtimes_json)

    pool.close()
    return jsonify(results_json)


# Tester function for quick debugging
@app.route('/test')
def test():
    return jsonify(get_standings_from_api(None))


if __name__ == '__main__':
    app.run()
