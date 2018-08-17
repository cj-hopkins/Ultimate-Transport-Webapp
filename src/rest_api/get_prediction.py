import os
import pickle
import pandas as pd
import sklearn

current_file_path = __file__
current_file_dir = os.path.dirname(__file__)
model_path = os.path.join(current_file_dir, "objects/new_46a_file.pkl")
rf_model = pickle.load(open(model_path, "rb"))

def getPrediction(numStops, isRaining, temp,selectedTime):
    ''' Get basic prediction using number of stops, raining yes or no, temperature and selected time of day
    
    Keyword arguments:
    numStops -- the number of stops in the selected route
    isRaining -- binary value for whether it is raining or not, 0 or 1
    temp -- temperature in Dublin
    selectedTime -- time selected by the user on the frontend that they would like the prediction for
    '''
    
    print("isRaining", isRaining)
    df_test = pd.DataFrame([[isRaining,'20',1,0, 0, 1,0,0]]) #5-7pm
    #['raining','air_temp','weekday','10am-1pm', '1pm-5pm', '5pm-7pm', '8am-10am','before_8am']
    # cols_names = ['dayofservice','tripid'] + list(X_test.columns)
    # df_test.columns = cols_names
    # df_test.set_index(['dayofservice','tripid'], inplace=True)
    
    # prediction for time between stops 
    result = rf_model.predict(df_test)

    # time for the whole journey is prediction * number of stops in the route. Convert from seconds to hours and minutes
    totalSeconds = result[0] * numStops
    seconds = int(round((totalSeconds % 60), 0))
    minutes = int(totalSeconds // 60)
    hours = int(minutes // 60)
    if hours == 1:
        minutes = int(minutes - 60)
    elif hours == 2:
        minutes = int(minutes - 120)
    elif hours == 3:
        minutes = int(minutes - 180)
    result = '{} hours, {} minutes, {} seconds'.format(abs(hours), abs(minutes), abs(seconds))
    # print(result)
    return [result]
    # multiply this num by the number of points bewteen start and destination - then divide by 60 for the time
    

    
    
