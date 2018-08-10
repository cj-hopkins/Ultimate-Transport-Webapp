import os
import pickle
import pandas as pd
import sklearn

current_file_path = __file__
current_file_dir = os.path.dirname(__file__)

def parseRequest(route, direction):
    parseDir = lambda x: '1' if x == 'I' else '2'
    key = "bus{}_d{}.pkl".format(route, parseDir(direction))
    model_path = os.path.join(current_file_dir, "objects/picklefiles/{}".format(key))
    print(key)
    return model_path

def createStopArray(route, direction):
    pass

def makePrediction(model_path):
    # print("isRaining", isRaining)
    # df_test = pd.DataFrame([[isRaining,'20',1,0, 0, 1,0,0]]) #5-7pm
    #['raining','air_temp','weekday','10am-1pm', '1pm-5pm', '5pm-7pm', '8am-10am','before_8am']
    # cols_names = ['dayofservice','tripid'] + list(X_test.columns)
    # df_test.columns = cols_names
    # df_test.set_index(['dayofservice','tripid'], inplace=True)
    # result = rf_model.predict(df_test) # prediction for time between stops 
    rf_model = pickle.load(open(model_path, "rb"))

    # totalSeconds = result[0] * numStops
    # seconds = int(round((totalSeconds % 60), 0))
    # minutes = int(totalSeconds // 60)
    # result = '{} minutes, {} seconds'.format(abs(minutes), abs(seconds))
    # print(result)
    # return [result]
    # multiply this num by the number of points bewteen start and destination - then divide by 60 for the time
    

    
    

