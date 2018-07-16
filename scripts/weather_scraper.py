import time
import urllib.request
import json
import csv
import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.dialects.mysql import mysqldb

def get5DayJsonData():
    apiKey = "2abe029b7b8d40e80d1ed447f4522f0d"
    file = urllib.request.urlopen('http://api.openweathermap.org/data/2.5/forecast?q=Dublin,ie&appid=' + apiKey +'&units=metric')
    str_file = file.read().decode('utf-8')
    FiveDayData = json.loads(str_file)
    return FiveDayData

def getCurrentJsonData():
    apiKey = "2abe029b7b8d40e80d1ed447f4522f0d"
    file = urllib.request.urlopen('http://api.openweathermap.org/data/2.5/weather?q=Dublin,ie&appid=' + apiKey +'&units=metric')
    # https://stackoverflow.com/questions/2835559/parsing-values-from-a-json-file
    str_file = file.read().decode('utf-8')
    CurrentData = json.loads(str_file)
    return CurrentData


def connectDB():
    try:
        engine = create_engine("mysql+mysqldb://root:password@127.0.0.1:3306/maindb2", echo = False)
        return engine

    except Exception as e:
        print("Error:", type(e))
        print(e)


def create5DayTable():
    sqlcreate = "CREATE TABLE rest_api_fivedayweather (number INTEGER UNIQUE, timeofday TIMESTAMP,  temperature INTEGER, description VARCHAR (128), icon VARCHAR (128), rain VARCHAR (128))"
    
    try:
        engine.execute(sqlcreate)
        
    except Exception as e:
        print("Error2:", type(e))
        print(e)

def createCurrentTable():
    sqlcreate = "CREATE TABLE rest_api_currentweather (identifier INTEGER UNIQUE, temperature INTEGER NOT NULL, description VARCHAR (128), icon VARCHAR (128))"
    
    try:
        engine.execute(sqlcreate)
        
    except Exception as e:
        print("Error2:", type(e))
        print(e)

def populate5DayTable(FiveDayData):
    engine = connectDB()

    for i in range(0,40,1):
        iD = i
        time = FiveDayData['list'][i]['dt_txt']
        temperature = FiveDayData['list'][i]['main']['temp']
        description = FiveDayData['list'][i]['weather'][0]['description']
        icon = FiveDayData['list'][i]['weather'][0]['icon']
        rain = FiveDayData['list'][i]['rain']
        if not rain:
            rain = {"3h":0}
        #print("Rain is" + str(rain['3h']))
        sqlpopulate = "REPLACE INTO rest_api_fivedayweather VALUES (" + str(iD) + ",'" + str(time) + "','"+ str(temperature) + "','" + str(description) +  "','" + str(icon) + "','" +  str(rain['3h']) + "');"

        try:
            engine.execute(sqlpopulate)

        except Exception as e:
            # if there is an error in carrying out the above, print the error
            print("Error3:", type(e))
            print(e)

def populateCurrentTable(CurrentData):
    engine = connectDB()
    
    temperature = CurrentData['main']['temp']
    description = CurrentData['weather'][0]['description']
    icon = CurrentData['weather'][0]['icon']
    sqlpopulate = "REPLACE INTO rest_api_currentweather VALUES (" + str(1) + ", " + str(temperature) + ",'" + str(description) + "','" + str(icon) + "');"

    try:
        engine.execute(sqlpopulate)

    except Exception as e:
        # if there is an error in carrying out the above, print the error
        print("Error3:", type(e))
        print(e)

if __name__ == '__main__':
    
    engine = connectDB()
    starttime=time.time()        
    
    while True: 
       # create5DayTable()
       # createCurrentTable()

        CurrentData = getCurrentJsonData()
        FiveDayData = get5DayJsonData()
        populateCurrentTable(CurrentData)
        populate5DayTable(FiveDayData)

        time.sleep(3600.0 - ((time.time() - starttime) % 3600.0))
