import os
import pickle
import pandas as pd
import sklearn

current_file_path = __file__
current_file_dir = os.path.dirname(__file__)
model_path = os.path.join(current_file_dir, "objects/new_46a_file.pkl")
rf_model = pickle.load(open(model_path, "rb"))

# with open('./objects/new_46a_file.pkl','rb') as f:
#     rf_model = pickle.load(f)

def getPrediction(numStops):
    df_test = pd.DataFrame([[True,'20',1,0, 0, 1,0,0]]) #5-7pm
    #['raining','air_temp','weekday','10am-1pm', '1pm-5pm', '5pm-7pm', '8am-10am','before_8am']
    # cols_names = ['dayofservice','tripid'] + list(X_test.columns)
    # df_test.columns = cols_names
    # df_test.set_index(['dayofservice','tripid'], inplace=True)
    result = rf_model.predict(df_test) # prediction for time between stops 
    return result * numStops
    # multiply this num by the number of points bewteen start and destination - then divide by 60 for the time
    

    
    
