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
        
    def parseRequest(self, route, direction):
        parseDir = lambda x: '1' if x == 'I' else '2'
        key = "bus{}_d{}.pkl".format(route, parseDir(direction))
        model_path = os.path.join(NNModel.current_file_dir, "objects/picklefiles/{}".format(key))
        print(key)
        return model_path

    # def createStopArray(self, route, direction, startStop, finishStop, numStopsInJourney, numStopsInRoute, df = None ):
    def createStopDf(self):
        columnsList = [i for i in range(len(self.stops) * 2)]
        df = pd.DataFrame(columns=columnsList)
        stopsInJourney = []
        for index, item in enumerate(self.stops):
            # print(item['sequence_number'])
            if item['stop_id'] == self.startStop['stop_id']:
                startIndex = index
                stopsInJourney.append(item)
            elif self.startStop['sequence_number'] < item['sequence_number'] <= self.finishStop['sequence_number']:
                stopsInJourney.append(item)
        # print(stopsInJourney)
        # print(startIndex, finishIndex)
        df = pd.DataFrame(columns=columnsList)
        self.stopsInJourney = stopsInJourney
        # for i in stopsInJourney:
        print("START", startIndex)
        #     print(i['location_text'], i['stop_id'], i['sequence_number'])
        # print("DF SHAPE", df.shape)
        count = 0
        # populate the df
        # print("Len sto(startIndex + len(self.stops)) + index + 1ps", len(self.stops))
        print(len(stopsInJourney))
        for i in self.stopsInJourney:
            print(i)
        print("STOPS", len(self.stops))
        for index in range(len(stopsInJourney)):
            # * 2 because we need columns for start and finish
            startRow = [0 for i in range(len(self.stops))]
            finishRow = [0 for i in range(len(self.stops))]
            # print(len(finishRow))
            startRow[startIndex + index] = 1
            finishRow[startIndex + index + 1] = 1
            startRow.extend(finishRow)
            # print(startRow, finishRow)
            # print(startRow)
            df.loc[count] = startRow
            count += 1
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
        
