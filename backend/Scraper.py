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
    def test():
        Scraper.scrape_qualifying_results(
            "http://www.skysports.com/f1/grandprix/"
            "china/results/2017/qualifying-1")


if __name__ == '__main__':
    Scraper.test()
