import pandas as pd
import numpy as np 
import datetime
import time
from rest_api.nnPrediction import NNModel
from .models import Currentweather, FiveDayWeather

def get_temp_and_rain_using_response(response,seconds_past_midnight, epoch_time):
    """ Function to get temperature and rain based on time selected by the user
    
    Keyword arguments:
    response -- json from the getFiveDayWeather view in Django
    seconds_past_midnight -- Time chosen (current time or from Django)
    epoch_time -- Date chosen (from calendar)
    """
    def round_hour_nearest_3_hour(x):
        """
        Rounds to nearest 3 hour (also handles the edge case of 23:00)
        """
        if x==23:
            ans= 0
        else:
            ans= int(3 * round(x/3))
        return ans
    
    seconds_past_midnight_1970 =  pd.to_datetime(seconds_past_midnight,unit='s')  # seconds past midnight to dt 
    nearest_hour = seconds_past_midnight_1970.hour                         # get hour
    nearest_hour_multiple3 = round_hour_nearest_3_hour(nearest_hour)       # get nearest 3 hour interval
    
    epoch_dt_format = pd.to_datetime(epoch_time, unit='s')  # epoch time to dt object 
    day_of_month_chosen = epoch_dt_format.day               # get day

    for i in range(len(response)):    
        entry = response[i]
        time_for_entry =response[i]['timeofday']            #time in tring format
        formatted_time= pd.to_datetime(time_for_entry, format='%Y-%m-%dT%H:00:00Z') # dt object
        day_of_month = formatted_time.day
        hour = formatted_time.hour             # hour of response(will be in multiple of 3)
        day_of_week =formatted_time.dayofweek
        
        keys_for_dictionary = ['temp','rain','description']  # store relevant weather in dictionary
        
        res = {key: None for key in keys_for_dictionary}     # fill dictionary with Nones 
        
        if  day_of_month== day_of_month_chosen and hour==  nearest_hour_multiple3:
            res['temp'] =  entry['temperature'] 
            res['rain'] =  entry['rain']
            res['description'] =  entry['description'] 
            
            return res  #if there's weather info return it else return dictionary of Nones
    return res

def getWeatherForPrediction(isDefaultTime , selectedTime, selectedDate):
    '''Returns a dictionary of rain and time 
    
    Keyword arguments: 
    isDefaultTime -- boolean value
    selectedTime -- seconds past midnight 
    selectedDate -- epoch time (seconds past 1 Jan 1970)
    '''
    def getRainCategoryFuture(chosenTime, chosenDate):
        """ Returns category for rain for future selected time
        Keyword arguments:
        chosenTime -- time in seconds past midnight
        chosenDate -- unix time seconds past epoch
        """
        future_weather = FiveDayWeather.objects.values()
        relevant_weather= get_temp_and_rain_using_response(future_weather ,chosenTime, chosenDate )
        rain_now = pd.cut(pd.DataFrame([float(relevant_weather['rain'] )])[0], bins= [0,0.01,0.5,20], include_lowest=True, labels = ['Precipitation_None', 'Precipitation_Slight', 'Precipitation_Moderate'])
        return rain_now.iloc[0]  
  
    def getTempNotNow(chosenTime, chosenDate):
        """ Returns future temperature from five day forecast using inputs of time and date """
        future_weather = FiveDayWeather.objects.values()
        relevant_weather= get_temp_and_rain_using_response(future_weather ,chosenTime, chosenDate )
        return relevant_weather['temp']

    def getWeatherNow():
        """ Returns current weather using first value from the five day weather forecast"""
        weather = Currentweather.objects.values()[0]
        weather_most_recent_entry = FiveDayWeather.objects.values().first()
        rain_now = pd.cut(pd.DataFrame([float(weather_most_recent_entry['rain'] )])[0], bins= [0,0.01,0.5,20], include_lowest=True, labels = ['Precipitation_None', 'Precipitation_Slight', 'Precipitation_Moderate'])
        weather_now_dict = {'rain':rain_now.iloc[0] ,'temperature':weather['temperature']}  
        return weather_now_dict

    
    current_time = time.time()
    epoch = datetime.datetime.utcfromtimestamp(0)
    time_in_5days_since_epoch = (datetime.datetime.now() + datetime.timedelta(days=5) - epoch).total_seconds() 

    if (not isDefaultTime) and (int(selectedDate) < time_in_5days_since_epoch): # within next 5 days but not now
        rain =  getRainCategoryFuture(selectedTime,selectedDate)
        temp = getTempNotNow(selectedTime,selectedDate)
    else:
        now = getWeatherNow()
        rain =  now['rain']  #use current weather if now or more than 5 days into future
        temp = now['temperature'] 
        
    return {'rain':rain,'temp':temp}
  
  
def create_weather_df(rain, temp, stopDf, nn_model):
    '''Creates a df for weather of same size size as stopDf by repeating values
    
    To get rain in correct format, perform one-hot encoding on Precipitation description. 
    '''
    rain_list = nn_model.createRainArray(rain)
    rain_list_repeated= np.tile(np.array(rain_list ), (stopDf.shape[0], 1 ))
    df_rain_list_repeated = pd.DataFrame(rain_list_repeated , index=range(rain_list_repeated.shape[0] ),
                          columns=nn_model.rainOptions)
    df_temp_repeated = pd.Series(np.tile([temp], stopDf.shape[0] )).to_frame()
    df_temp_repeated .columns = ['Temperature']
    combined_df = pd.concat([df_temp_repeated ,df_rain_list_repeated], axis=1)
    return combined_df 
  
  
  
  