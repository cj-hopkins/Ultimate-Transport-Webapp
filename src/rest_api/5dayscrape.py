import time
import urllib.request
import json
import csv
import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.dialects.mysql import mysqldb



def getJsonData():
    """ Gets JSON data from Open Weather API """
    
    apiKey = "2abe029b7b8d40e80d1ed447f4522f0d"
    file = urllib.request.urlopen('http://api.openweathermap.org/data/2.5/forecast?q=Dublin,ie&appid=' + apiKey +'&units=metric')
    # https://stackoverflow.com/questions/2835559/parsing-values-from-a-json-file
    str_file = file.read().decode('utf-8')
    data = json.loads(str_file)
    return data


def connectDB():
    """ Connect to our database """
    
    try:
        engine = create_engine("mysql+mysqldb://root:@127.0.0.1:3306/maindb", echo = False)
        return engine

    except Exception as e:
        print("Error:", type(e))
        print(e)


def createTable():
    """ Create table in database for five day weather forecast """
    
    sqlcreate = "CREATE TABLE FiveDayWeather (number INTEGER UNIQUE, timeofday TIMESTAMP,  temperature INTEGER, description VARCHAR (128), icon VARCHAR (128), rain VARCHAR (128))"
    
    try:
        engine.execute(sqlcreate)
        
    except Exception as e:
        print("Error2:", type(e))
        print(e)

        
def populateTable(data):
    """ Retrieve data from JSON and input into five day forecast table

    Keyword arguments:
    data -- weather information retrieved from the Open Weather API in JSON format
    """
    
    engine = connectDB()

    # Weather is provided in 3 hour intervals - i.e. 8 times per 24 hours. 8 * 5 days = 40 values
    for i in range(0,40,1):
        iD = i
        time = data['list'][i]['dt_txt']
        temperature = data['list'][i]['main']['temp']
        description = data['list'][i]['weather'][0]['description']
        icon = data['list'][i]['weather'][0]['icon']
        rain = data['list'][i]['rain']
        if not rain:
            rain = {"3h":0}
        #print("Rain is" + str(rain['3h']))
        sqlpopulate = "REPLACE INTO FiveDayWeather(number,timeofday,temperature,description,icon,rain) VALUES (" + str(iD) + ", '" + str(time) + "','"+ str(temperature) + "','" + str(description) +  "','" + str(icon) + "','" +  str(rain['3h']) + "');"

        try:
            engine.execute(sqlpopulate)

        except Exception as e:
            # if there is an error in carrying out the above, print the error
            print("Error3:", type(e))
            print(e)

if __name__ == '__main__':
    
    engine = connectDB()
    # starttime=time.time()        
    
    # while True: 
    createTable()

    data = getJsonData()
    populateTable(data)

        # time.sleep(3600.0 - ((time.time() - starttime) % 3600.0))
       