import os
import pickle
import pandas as pd
import numpy as np
import sklearn
from rest_api.models import Composite 

class NNModel:

    current_file_path = __file__
    current_file_dir = os.path.dirname(__file__)

    def __init__(self, route, direction, startStop, finishStop, stops):
        self.route = route
        self.direction = direction
        self.startStop = startStop
        self.finishStop = finishStop
        self.stops = stops

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
            if item['stop_id'] == self.startStop:
                startIndex = index
                stopsInJourney.append(item)
            elif self.startStop < item['stop_id'] <= self.finishStop:
                stopsInJourney.append(item)
        # print(stopsInJourney)
        # print(startIndex, finishIndex)
        df = pd.DataFrame(columns=columnsList)
        # print("DF SHAPE", df.shape)
        count = 0
        for index in range(len(stopsInJourney)):
            row = [0 for i in range(len(self.stops) * 2)]
            row[startIndex + index] = 1
            row[(startIndex + index + 1) * 2] = 1
            df.loc[count] = row
            count += 1
        return df

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
        
        def createTimeDf(self, hour, day):
            pass