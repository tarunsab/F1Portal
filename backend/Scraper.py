from pprint import pprint
from datetime import *
from dateutil.parser import *
from bs4 import BeautifulSoup
from urllib.request import urlopen


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
            entry["time"] = timeJSON

            # Scraping points gained from the race for the driver
            pointsJSON = otherObj[7].get_text()
            entry["pointsGained"] = pointsJSON

            race_json["timesheet"].append(entry)

        return race_json

    @staticmethod
    def scrape_showtimes(url, year):

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

                session_name = session_name.replace("practice 1", "fp1")
                session_name = session_name.replace("practice 2", "fp2")
                session_name = session_name.replace("practice 3", "fp3")

                session_name = session_name.replace("qualifying 1", "q1")
                session_name = session_name.replace("qualifying 2", "q2")
                session_name = session_name.replace("qualifying 3", "q3")

                session_name = session_name.replace(" ", "_")

                # Obtaining session time, e.g. 09:00:00
                session_time_obj = c.find('p', attrs={
                    'class': 'event-detail -center caption'})
                session_time_raw = session_time_obj.get_text()
                session_time = session_time_raw.split('(')[-1][:-1] + ":00"

                # Obtaining session iso datetime, e.g. 2017-08-25T09:00:00
                session_datetime = session_date + ' ' + session_time
                session_datetime = parse(
                    session_datetime).isoformat()

                # Populating results json with session name and datetime
                showtimes_json[session_name] = session_datetime

        return showtimes_json

    @staticmethod
    def test():
        string = "Fri 25th August-2017 09:00:00"
        string = parse(string).isoformat()
        print(string)


if __name__ == '__main__':
    Scraper.test()
    pass
