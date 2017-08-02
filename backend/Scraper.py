from bs4 import BeautifulSoup
from urllib.request import urlopen


class Scraper:
    @staticmethod
    def scrape_practice_results(practice_json, url):
        r = urlopen(url).read()
        soup = BeautifulSoup(r, "html.parser")

        table = soup.find('table', attrs={'class': 'standing-table__table'})
        cells = table.findAll('tr', attrs={'class': 'standing-table__row'})

        practice_json["timesheet"] = []

        for c in cells[1:]:
            entry = {}

            nameObj = c.find('span')
            nameJSON = nameObj.get_text()
            entry["name"] = nameJSON

            otherObj = c.findAll('td')
            posJSON = otherObj[0].get_text()
            entry["position"] = posJSON

            teamJSON = otherObj[2].get_text()
            entry["team"] = teamJSON

            timeJSON = otherObj[3].get_text()
            entry["time"] = timeJSON

            practice_json["timesheet"].append(entry)

        return practice_json

    @staticmethod
    def scrape_qualifying_results(practice_json, url):
        r = urlopen(url).read()
        soup = BeautifulSoup(r, "html.parser")

        table = soup.find('table', attrs={'class': 'standing-table__table'})
        cells = table.findAll('tr', attrs={'class': 'standing-table__row'})

        practice_json["timesheet"] = []

        for c in cells[1:]:
            entry = {}

            nameObj = c.find('span')
            nameJSON = nameObj.get_text()
            entry["name"] = nameJSON

            otherObj = c.findAll('td')
            posJSON = otherObj[0].get_text()
            entry["position"] = posJSON

            teamJSON = otherObj[2].get_text()
            entry["team"] = teamJSON

            timeJSON = otherObj[5].get_text()
            entry["time"] = timeJSON

            practice_json["timesheet"].append(entry)

        return practice_json

    @staticmethod
    def scrape_race_results(practice_json, url):
        r = urlopen(url).read()
        soup = BeautifulSoup(r, "html.parser")

        table = soup.find('table', attrs={'class': 'standing-table__table'})
        cells = table.findAll('tr', attrs={'class': 'standing-table__row'})

        practice_json["timesheet"] = []

        for c in cells[1:]:
            entry = {}

            nameObj = c.find('span')
            nameJSON = nameObj.get_text()
            entry["name"] = nameJSON

            otherObj = c.findAll('td')
            posJSON = otherObj[0].get_text()
            entry["position"] = posJSON

            teamJSON = otherObj[2].get_text()
            entry["team"] = teamJSON

            timeJSON = otherObj[5].get_text()
            entry["time"] = timeJSON

            practice_json["timesheet"].append(entry)

        return practice_json

if __name__ == '__main__':
    Scraper.scrape_qualifying_results({},
        "http://www.skysports.com/f1/grandprix/china/results/2017/qualifying-1")
