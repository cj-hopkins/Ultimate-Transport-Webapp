from rest_api.nnPrediction import NNModel
import datetime
import pandas as pd
import numpy as np

def get_time_and_date_df(selectedTime,selectedDate, nn_model,stopDf):
    '''Returns a dataframe of same length as stopDf with time and date in binary list 
    
    Keyword arguments: 
    selectedTime -- seconds past midnight 
    selectedDate -- epoch time (seconds past 1 Jan 1970)
    nn_model -- nn_object
    stopDf -- data frame of stops chosen
    '''
    
    hour = selectedTime // 3600
    day = datetime.datetime.fromtimestamp(int(selectedDate)/1000).strftime("%A")
    timeDf = nn_model.createTimeDf(hour, day)
    time_list_repeated = np.tile(np.array(timeDf), (stopDf.shape[0], 1 ))
    df_time_list_repeated = pd.DataFrame(time_list_repeated, index=range(time_list_repeated.shape[0] ),columns=nn_model.timeIntervals)
    return df_time_list_repeated 
    