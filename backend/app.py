from flask import Flask
import requests

app = Flask(__name__)

apiUrl = "http://ergast.com/api/f1/current/"


@app.route('/')
def homepage():
    return "Backend for F1 Portal app"


@app.route('/get_drivers')
def get_drivers():
    drivers_standings = requests.get(apiUrl + 'driverStandings.json')
    return drivers_standings.text


@app.route('/get_constructors')
def get_constructors():
    constructors_standings = requests.get(apiUrl + 'constructorStandings.json')
    return constructors_standings.text


if __name__ == '__main__':
    app.run()
