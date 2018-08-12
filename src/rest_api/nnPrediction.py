import os
import pickle
import pandas as pd
import numpy as np
import math
import sklearn
from rest_api.models import Composite 

class NNModel:

    current_file_path = __file__
    current_file_dir = os.path.dirname(__file__)

    def __init__(self, route, direction, startStop, finishStop, stops, rain):
        self.route = route
        self.direction = direction
        self.startStop = startStop
        self.finishStop = finishStop
        self.stops = stops
        self.dayArray = ['Friday', 'Monday', 'Saturday', 'Sunday','Thursday', 'Tuesday', 'Wednesday']
        self.rainOptions = ['Precipitation_Moderate','Precipitation_None', 'Precipitation_Slight']
        self.timeIntervals = ['day_Friday', 'day_Monday', 'day_Saturday','day_Sunday', 'day_Thursday','day_Tuesday', 'day_Wednesday','time_interval_midnight-1am', 'time_interval_1-2am','time_interval_2-3am', 'time_interval_3-4am', 'time_interval_4-5am','time_interval_5-6am', 'time_interval_6-7am','time_interval_7-8am','time_interval_8-9am', 'time_interval_9-10am', 'time_interval_10-11am','time_interval_11-12midday', 'time_interval_12-1pm','time_interval_1-2pm', 'time_interval_2-3pm', 'time_interval_3-4pm','time_interval_4-5pm', 'time_interval_5-6pm','time_interval_6-7pm','time_interval_7-8pm', 'time_interval_8-9pm', 'time_interval_9-10pm','time_interval_10-11pm']
        
    def parseRequest(self, route, direction):
        parseDir = lambda x: '1' if x == 'I' else '2'
        key = "bus{}_d{}.pkl".format(route, parseDir(direction))
        model_path = os.path.join(NNModel.current_file_dir, "objects/picklefiles/{}".format(key))
        print(key)
        return model_path

    # def createStopArray(self, route, direction, startStop, finishStop, numStopsInJourney, numStopsInRoute, df = None ):
    def createStopDf(self):
        
        stopsInJourney = [i for i in self.stops if 
            self.startStop['sequence_number'] <= i['sequence_number'] <= self.finishStop['sequence_number']]
        stopsInJourney = sorted(stopsInJourney, key = lambda x: x['sequence_number'])
        self.stopsInJourney = stopsInJourney

        columnsList = [i for i in range(len(self.stops) * 2)]
        df = pd.DataFrame(columns=columnsList)

        for i in range(len(self.stopsInJourney) - 1):
            item = self.stopsInJourney[i]
            nextItem = self.stopsInJourney[i + 1]
        
            startSeqIndex = next((index for (index, stop) in enumerate(self.stops) if stop["sequence_number"] == item['sequence_number']), None)
            finishSeqIndex = next((index for (index, stop) in enumerate(self.stops) if stop["sequence_number"] == nextItem['sequence_number']), None)
            print(startSeqIndex, finishSeqIndex)

            row = [0 for i in range(len(self.stops) * 2)]
            row[startSeqIndex] = 1
            row[finishSeqIndex] = 1
            df.loc[i] = row
        return df

    def createTimeDf(self, hour, day):
        # 7 days + 23 hour ranges
        print(hour)
        columnsList = [i for i in range(30)]
        df = pd.DataFrame(columns=columnsList)
        timeRow = [0 for i in range(23)]
        dayRow = [0 for i in range(7)]
        dayIndex = self.dayArray.index(day)
        dayRow[dayIndex] = 1
        timeRow[hour - 1] = 1
        dayRow.extend(i for i in timeRow)
        self.timeRow = dayRow
        return dayRow
      
    def createRainArray (self, rain):
        rain_arr = [0 for i in range(len(self.rainOptions))]
        rain_arr[self.rainOptions.index(rain)]=1
        return rain_arr

    def calculateDistances(self):
        distances = []
        radius_earth = 6371
        print("stops length", len(self.stopsInJourney))
        for i in range(len(self.stopsInJourney) - 1):
            item = self.stopsInJourney[i]
            nextItem = self.stopsInJourney[i + 1]
            theta1 = np.deg2rad(item['stop_lon'])
            theta2 = np.deg2rad(nextItem['stop_lon'])
            phi1 = np.deg2rad(90 - item['stop_lat'])
            phi2 = np.deg2rad(90 - nextItem['stop_lat'])
            distance = math.acos(math.sin(phi1) * math.sin(phi2) * math.cos(
                theta1 - theta2) + math.cos(phi1) * math.cos(phi2)) * radius_earth
            # print(distance)
            distances.append(distance * 1000)
        return distances
            

    def makePrediction(self, model_path):
        # print("isRaining", isRaining)
        # df_test = pd.DataFrame([[isRaining,'20',1,0, 0, 1,0,0]]) #5-7pm
        #['raining','air_temp','weekday','10am-1pm', '1pm-5pm', '5pm-7pm', '8am-10am','before_8am']
        # cols_names = ['dayofservice','tripid'] + list(X_test.columns)
        # df_test.columns = cols_names
        # df_test.set_index(['dayofservice','tripid'], inplace=True)
        # result = rf_model.predict(df_test) # prediction for time between stops 
        nn_model = pickle.load(open(model_path, "rb"))
        # startCols = createStopArray()
        # finishCols = createStopArray()

        # totalSeconds = result[0] * numStops
        # seconds = int(round((totalSeconds % 60), 0))
        # minutes = int(totalSeconds // 60)
        # result = '{} minutes, {} seconds'.format(abs(minutes), abs(seconds))
        # print(result)
        # return [result]
        # multiply this num by the number of points bewteen start and destination - then divide by 60 for the time
        
