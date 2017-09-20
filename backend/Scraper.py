import datetime
from pprint import pprint

from bs4 import BeautifulSoup
from dateutil.parser import *
from urllib.request import urlopen
from DBManager import DBManager



def calc_timedelta(fastest_time, driver_time):
    try:
        fastest = datetime.datetime.strptime(fastest_time, "%M:%S.%f")
        driver_best = datetime.datetime.strptime(driver_time, "%M:%S.%f")
        timedelta = driver_best - fastest
        timedelta_string = '+' + str(timedelta.seconds) + '.' \
                           + str(timedelta.microseconds)[0:3]
        return timedelta_string
    except ValueError:
        return ""


class Scraper:
    @staticmethod
    def scrape_practice_results(url):

        # JSON to be populated with scraped results
        practice_json = {"timesheet": []}

        # Opening provided URL to be scraped
        r = urlopen(url).read()
        soup = BeautifulSoup(r, "html.parser")

        # Finding table of session results as a list
        table = soup.find('table', attrs={'class': 'standing-table__table'})
        cells = table.findAll('tr', attrs={'class': 'standing-table__row'})

        # Fastest time of the session to calculate time delta
        fastest_time = ""

        # For each row in the results table
        for c in cells[1:]:
            entry = {}

            # Scraping name of driver
            nameObj = c.find('span')
            nameJSON = nameObj.get_text()
            entry["name"] = nameJSON

            # Find other elements
            otherObj = c.findAll('td')

            # Scraping team of driver
            teamJSON = otherObj[2].get_text()
            entry["team"] = teamJSON

            # Scraping position of driver in session
            posJSON = otherObj[0].get_text()
            entry["position"] = posJSON

            # Scraping best time for driver in session
            timeJSON = otherObj[3].get_text()
            entry["time"] = timeJSON
            if c == cells[1]:
                fastest_time = timeJSON

            # Calculating and adding time delta from fastest time to json
            entry["timedelta"] = calc_timedelta(fastest_time, timeJSON)

            # Adding add the scraped data as an entry to the timesheet JSON list
            practice_json["timesheet"].append(entry)

        return practice_json

    @staticmethod
    def scrape_qualifying_results(url):

        # JSON to be populated with scraped results
        qualifying_json = {"timesheet": []}

        # Opening provided URL to be scraped
        r = urlopen(url).read()
        soup = BeautifulSoup(r, "html.parser")

        # Finding table of session results as a list
        table = soup.find('table', attrs={'class': 'standing-table__table'})
        cells = table.findAll('tr', attrs={'class': 'standing-table__row'})

        # Fastest time of the session to calculate time delata
        fastest_time = ""

        # For each row in the results table
        for c in cells[1:]:
            entry = {}

            # Scraping name of driver
            nameObj = c.find('span')
            nameJSON = nameObj.get_text()
            entry["name"] = nameJSON

            # Find other elements
            otherObj = c.findAll('td')

            # Scraping team of driver
            teamJSON = otherObj[2].get_text()
            entry["team"] = teamJSON

            # Scraping position of driver in session
            otherObj = c.findAll('td')
            posJSON = otherObj[0].get_text()
            entry["position"] = posJSON

            # Scraping best time for driver in session
            timeJSON = otherObj[5].get_text()
            entry["time"] = timeJSON
            if c == cells[1]:
                fastest_time = timeJSON

            # Calculating and adding time delta from fastest time to json
            entry["timedelta"] = calc_timedelta(fastest_time, timeJSON)

            qualifying_json["timesheet"].append(entry)

        return qualifying_json

    @staticmethod
    def scrape_race_results(url):

        # JSON to be populated with scraped results
        race_json = {"timesheet": []}

        # Opening provided URL to be scraped
        r = urlopen(url).read()
        soup = BeautifulSoup(r, "html.parser")

        # Finding table of session results as a list
        table = soup.find('table', attrs={'class': 'standing-table__table'})
        cells = table.findAll('tr', attrs={'class': 'standing-table__row'})

        # For each row in the results table
        for c in cells[1:]:
            entry = {}

            # Scraping name of driver
            nameObj = c.find('span')
            nameJSON = nameObj.get_text()
            entry["name"] = nameJSON

            # Find other elements
            otherObj = c.findAll('td')

            # Scraping team of driver
            teamJSON = otherObj[2].get_text()
            entry["team"] = teamJSON

            # Scraping position of driver in session
            posJSON = otherObj[0].get_text()
            entry["position"] = posJSON

            # Scraping best time for driver in session
            timeJSON = otherObj[5].get_text()
            entry["timedelta"] = timeJSON

            # Scraping points gained from the race for the driver
            pointsJSON = otherObj[7].get_text()
            entry["pointsGained"] = pointsJSON

            race_json["timesheet"].append(entry)

        return race_json

    @staticmethod
    def scrape_showtimes(year, url, race_country):

        # Obtaining cached standings data from database
        entry = DBManager.get_showtimes_entry(race_country)

        # Check cached data exists and is from the current season to be
        # valid. If valid, then return
        if entry:
            cached_showtimes_data = entry[0][0]
            if cached_showtimes_data:
                json_year = cached_showtimes_data['year']
                if json_year == year:
                    print("Showtimes obtained from cache")
                    return cached_showtimes_data

        # JSON to be populated with scraped results
        showtimes_json = {}

        # Opening provided URL to be scraped
        r = urlopen(url).read()
        soup = BeautifulSoup(r, "html.parser")

        days = soup.findAll('h3', attrs={'class': 'text-h4 -rs-style20 box'})

        for d in days:

            # Obtaining day of race weekend
            session_date = d.get_text() + '-' + year

            # Finding table of session results as a list for the particular day
            day_sessions_obj = d.find_next_sibling()
            cells = day_sessions_obj.findAll('div', attrs={'class':
                                                    'event-group -layout2'})

            # For each row in the results table
            for c in cells:
                # Obtaining session name
                session_name_obj = c.find('strong')
                session_name_raw = session_name_obj.get_text()
                session_name = session_name_raw.split('- ')[-1]
                session_name = session_name.lower()

                session_name = session_name.replace("practice ", "fp")
                session_name = session_name.replace("qualifying ", "q")

                session_name = session_name.replace(" ", "_")

                # Obtaining session time, e.g. 09:00:00
                session_time_obj = c.find('p', attrs={
                    'class': 'event-detail -center caption'})
                session_time_raw = session_time_obj.get_text()
                session_time = session_time_raw.split('(')[-1][:-1] + ":00"

                # Obtaining session iso datetime, e.g. 2017-08-25T09:00:00
                session_datetime = session_date + ' ' + session_time
                session_datetime = parse(session_datetime).isoformat()

                # Populating results json with session name and datetime
                showtimes_json[session_name] = session_datetime

        if showtimes_json == {}:
            print("Showtimes unavailable as session has elapsed")
            return showtimes_json

        # Add year to showtimes data to depict season
        showtimes_json['year'] = year

        # Update cached showtimes file in database
        DBManager.update_showtimes_entry(race_country, showtimes_json)

        print("Showtimes obtained from website")
        return showtimes_json

    @staticmethod
    def test():
        json = Scraper.scrape_practice_results(
            "http://www.skysports.com/f1/grandprix/"
            "australia/results/2017/practice-1")
        # pprint(json)


if __name__ == '__main__':
    Scraper.test()
    pass
