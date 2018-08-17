""" Get prediction using neural network model"""
from rest_api.models import Modelstops

import os
import pickle
import pandas as pd
import numpy as np
import math
from functools import reduce

class NNModel:
    """Constructor for dataframe to pass to NN Model"""

    current_file_path = __file__
    current_file_dir = os.path.dirname(__file__)

    def __init__(self, route, direction, startStop, finishStop, stops):
        self.route = route
        self.direction = direction
        self.startStop = startStop
        self.finishStop = finishStop
        self.stops = stops
        self.dayArray = ['Friday', 'Monday', 'Saturday', 'Sunday','Thursday', 'Tuesday', 'Wednesday']
        self.rainOptions = ['Precipitation_Moderate','Precipitation_None', 'Precipitation_Slight']
        self.timeIntervals = ['day_Friday', 'day_Monday', 'day_Saturday','day_Sunday', 'day_Thursday','day_Tuesday', 'day_Wednesday','time_interval_midnight-1am', 'time_interval_1-2am','time_interval_2-3am', 'time_interval_3-4am', 'time_interval_4-5am','time_interval_5-6am', 'time_interval_6-7am','time_interval_7-8am','time_interval_8-9am', 'time_interval_9-10am', 'time_interval_10-11am','time_interval_11-12midday', 'time_interval_12-1pm','time_interval_1-2pm', 'time_interval_2-3pm', 'time_interval_3-4pm','time_interval_4-5pm', 'time_interval_5-6pm','time_interval_6-7pm','time_interval_7-8pm', 'time_interval_8-9pm', 'time_interval_9-10pm','time_interval_10-11pm']
        self.stopsDf = None
        self.finalStops = None
        self.stopsInJourney = None
        self.timeRow = None


    def parseRequest(self, route, direction):
        """ Derive the route and direction from the pickle file 

        Keyword arguments:
        route -- bus number, e.g. 46A
        direction -- can be 1 or 2, i.e. inbound or outbound
        """
        
        parseDir = lambda x: '1' if x == 'I' else '2'
        key = "bus{}_d{}.pkl".format(route.upper(), parseDir(direction))
        model_path = os.path.join(NNModel.current_file_dir, "objects/picklefiles/{}".format(key))
        return model_path

    
    def createStopDf(self):
        """ Create a dataframe with all stops for a particular route """
        
        stopsInJourney = [i for i in self.stops if 
            (i['sequence_number'] >= self.startStop['sequence_number'])
            or (i['sequence_number'] <= self.finishStop['sequence_number'])]
        stopsInJourney = sorted(stopsInJourney, key = lambda x: x['sequence_number'])
        self.stopsInJourney = stopsInJourney

        convertDir = lambda x: 2 if x == 'I' else 1
        stopsColsList = sorted(Modelstops.objects
                .filter(route=self.route)
                .filter(direction=convertDir(self.direction))
                .values()[0]['stopids']
                .split(' ')
                , key=lambda x: int(x)
            )
        
        startColsList = ["start_stoppointid_{}".format(i) for i in stopsColsList]
        endColsList = ["end_point_{}".format(i) for i in stopsColsList]
        startColsList.extend(endColsList)
        df = pd.DataFrame(columns=startColsList)
        stopsColsList = [int(i) for i in stopsColsList]
        finalStops = []

        for i in range(len(self.stopsInJourney) - 1):
            item = self.stopsInJourney[i]
            nextItem = self.stopsInJourney[i + 1]
        
            startStopId = next((stop['stop_id'] for (index, stop) in enumerate(self.stops) if stop["sequence_number"] == item['sequence_number']), None)
            finishStopId = next((stop['stop_id'] for (index, stop) in enumerate(self.stops) if stop["sequence_number"] == nextItem['sequence_number']), None)
            try:
                startIndex = stopsColsList.index(int(startStopId))
                currentStop = next((stop for (index, stop) in enumerate(self.stops) if stop["stop_id"] == startStopId), None)
                finalStops.append(currentStop)
            except ValueError as e:
                print(e)
            try:
                finishIndex = stopsColsList.index(int(finishStopId))
            except ValueError as e:
                print(e)
                continue
                
            row = [0 for i in range(len(stopsColsList) * 2)]
            row[startIndex] = 1
            row[len(stopsColsList) + finishIndex] = 1
            df.loc[i] = row

        self.stopsDf = df
        df = df.reset_index()
        self.finalStops = finalStops
        return df

    
    def createTimeDf(self, hour, day):
        """ Create dataframe of time and day 
    
        Keyword arguments:
        hour -- whole number between 1 and 23 for all hours in the day
        day -- whole number between 1 and 7 for day of the week
        """
        # 7 days + 23 hour ranges
        timeRow = [0 for i in range(23)]
        dayRow = [0 for i in range(7)]
        dayIndex = self.dayArray.index(day)
        dayRow[dayIndex] = 1
        timeRow[hour - 1] = 1
        dayRow.extend(i for i in timeRow)
        self.timeRow = dayRow
        return dayRow
    
    
    def createRainArray (self, rain):
        """ Create array for rain options 
        Keyword arguments:
        rain -- float to describe amount of rain in millimetres
        """
        
        rain_arr = [0 for i in range(len(self.rainOptions))]
        rain_arr[self.rainOptions.index(rain)]=1
        return rain_arr

    
    def calculateDistances(self):
        """ Calculate distance between all stops in a route """
        
        distances = []
        radius_earth = 6371
        for i in range(len(self.finalStops) - 1):
            item = self.finalStops[i]
            nextItem = self.finalStops[i + 1]
            theta1 = np.deg2rad(float(item['stop_lon']))
            theta2 = np.deg2rad(float(nextItem['stop_lon']))
            phi1 = np.deg2rad(90 - float(item['stop_lat']))
            phi2 = np.deg2rad(90 - float(nextItem['stop_lat']))
            if item['stop_lon'] =='0.0' or nextItem['stop_lon'] =='0.0':
                distance= 0 
            else:
                distance = math.acos(math.sin(phi1) * math.sin(phi2) * math.cos(
                theta1 - theta2) + math.cos(phi1) * math.cos(phi2)) * radius_earth
            distances.append(distance)
        distances.append(0)
        return distances
            

    def makePrediction(self, model_path, df):
        """ Make a prediction of the journey time based on the dataframe that has been created with all values
        from __init__, i.e. route, direction, startStop, finishStop, stops, dayArray, rainOptions, timeIntervals.
        Try/catch block to adjust dataframe size if new stops were added
        
        Keyword arguments:
        model_path -- name of the pickle file for specified bus route, defined in parseRequest above
        df -- dataframe that has been created from all functions above
        """
        
        nn_model = pickle.load(open(model_path, "rb"))
        try:
            result = nn_model.predict(df)
            totalSum = reduce(lambda x, acc: x+acc, result)
        except ValueError as e:
            dimensions = [int(s) for s in str(e).split() if s.isdigit()]
            our_df_size, model_df_size  = dimensions[0] , dimensions[1]
            if our_df_size > model_df_size:
                num_cols_to_remove = our_df_size - model_df_size
                df = df.iloc[:, :-(num_cols_to_remove)]
            else:
                num_cols_to_add =  model_df_size - our_df_size 
                num_rows_our_df = df.shape[0]
                cols_zeros =pd.DataFrame(np.zeros((num_rows_our_df, num_cols_to_add )))
                df = pd.concat([df,cols_zeros], axis=1)
                
                
        result = nn_model.predict(df)
        totalSum = reduce(lambda x, acc: x+acc, result)
        time = abs(totalSum/60)
        print ("NN MODEL", time)
        return time
