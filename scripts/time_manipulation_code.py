import pandas as pd
import numpy as np 
import datetime

response_json = [
    {
        "number": 0,
        "timeofday": "2018-07-25T12:00:00Z",
        "temperature": 19,
        "description": "few clouds",
        "icon": "02d",
        "rain": "0"
    },
    {
        "number": 1,
        "timeofday": "2018-07-25T15:00:00Z",
        "temperature": 19,
        "description": "few clouds",
        "icon": "02d",
        "rain": "0"
    },
    {
        "number": 2,
        "timeofday": "2018-07-25T18:00:00Z",
        "temperature": 18,
        "description": "clear sky",
        "icon": "01d",
        "rain": "0"
    },
    {
        "number": 3,
        "timeofday": "2018-07-25T21:00:00Z",
        "temperature": 17,
        "description": "clear sky",
        "icon": "01n",
        "rain": "0"
    },
    {
        "number": 4,
        "timeofday": "2018-07-26T00:00:00Z",
        "temperature": 16,
        "description": "clear sky",
        "icon": "01n",
        "rain": "0"
    },
    {
        "number": 5,
        "timeofday": "2018-07-26T03:00:00Z",
        "temperature": 15,
        "description": "clear sky",
        "icon": "01n",
        "rain": "0"
    },
    {
        "number": 6,
        "timeofday": "2018-07-26T06:00:00Z",
        "temperature": 15,
        "description": "clear sky",
        "icon": "01d",
        "rain": "0"
    },
    {
        "number": 7,
        "timeofday": "2018-07-26T09:00:00Z",
        "temperature": 17,
        "description": "clear sky",
        "icon": "01d",
        "rain": "0"
    },
    {
        "number": 8,
        "timeofday": "2018-07-26T12:00:00Z",
        "temperature": 18,
        "description": "scattered clouds",
        "icon": "03d",
        "rain": "0"
    },
    {
        "number": 9,
        "timeofday": "2018-07-26T15:00:00Z",
        "temperature": 18,
        "description": "broken clouds",
        "icon": "04d",
        "rain": "0"
    },
    {
        "number": 10,
        "timeofday": "2018-07-26T18:00:00Z",
        "temperature": 18,
        "description": "few clouds",
        "icon": "02d",
        "rain": "0"
    },
    {
        "number": 11,
        "timeofday": "2018-07-26T21:00:00Z",
        "temperature": 18,
        "description": "scattered clouds",
        "icon": "03n",
        "rain": "0"
    },
    {
        "number": 12,
        "timeofday": "2018-07-27T00:00:00Z",
        "temperature": 17,
        "description": "broken clouds",
        "icon": "04n",
        "rain": "0"
    },
    {
        "number": 13,
        "timeofday": "2018-07-27T03:00:00Z",
        "temperature": 17,
        "description": "light rain",
        "icon": "10n",
        "rain": "0.06"
    },
    {
        "number": 14,
        "timeofday": "2018-07-27T06:00:00Z",
        "temperature": 17,
        "description": "light rain",
        "icon": "10d",
        "rain": "0.015"
    },
    {
        "number": 15,
        "timeofday": "2018-07-27T09:00:00Z",
        "temperature": 17,
        "description": "broken clouds",
        "icon": "04d",
        "rain": "0"
    },
    {
        "number": 16,
        "timeofday": "2018-07-27T12:00:00Z",
        "temperature": 18,
        "description": "broken clouds",
        "icon": "04d",
        "rain": "0"
    },
    {
        "number": 17,
        "timeofday": "2018-07-27T15:00:00Z",
        "temperature": 18,
        "description": "broken clouds",
        "icon": "04d",
        "rain": "0"
    },
    {
        "number": 18,
        "timeofday": "2018-07-27T18:00:00Z",
        "temperature": 18,
        "description": "broken clouds",
        "icon": "04d",
        "rain": "0"
    },
    {
        "number": 19,
        "timeofday": "2018-07-27T21:00:00Z",
        "temperature": 17,
        "description": "overcast clouds",
        "icon": "04n",
        "rain": "0"
    },
    {
        "number": 20,
        "timeofday": "2018-07-28T00:00:00Z",
        "temperature": 17,
        "description": "light rain",
        "icon": "10n",
        "rain": "0.015"
    },
    {
        "number": 21,
        "timeofday": "2018-07-28T03:00:00Z",
        "temperature": 16,
        "description": "light rain",
        "icon": "10n",
        "rain": "0.285"
    },
    {
        "number": 22,
        "timeofday": "2018-07-28T06:00:00Z",
        "temperature": 13,
        "description": "light rain",
        "icon": "10d",
        "rain": "1.47"
    },
    {
        "number": 23,
        "timeofday": "2018-07-28T09:00:00Z",
        "temperature": 14,
        "description": "clear sky",
        "icon": "01d",
        "rain": "0"
    },
    {
        "number": 24,
        "timeofday": "2018-07-28T12:00:00Z",
        "temperature": 16,
        "description": "light rain",
        "icon": "10d",
        "rain": "0.0050000000000001"
    },
    {
        "number": 25,
        "timeofday": "2018-07-28T15:00:00Z",
        "temperature": 15,
        "description": "light rain",
        "icon": "10d",
        "rain": "0.68"
    },
    {
        "number": 26,
        "timeofday": "2018-07-28T18:00:00Z",
        "temperature": 16,
        "description": "light rain",
        "icon": "10d",
        "rain": "0.99"
    },
    {
        "number": 27,
        "timeofday": "2018-07-28T21:00:00Z",
        "temperature": 15,
        "description": "light rain",
        "icon": "10n",
        "rain": "0.0099999999999998"
    },
    {
        "number": 28,
        "timeofday": "2018-07-29T00:00:00Z",
        "temperature": 14,
        "description": "clear sky",
        "icon": "01n",
        "rain": "0"
    },
    {
        "number": 29,
        "timeofday": "2018-07-29T03:00:00Z",
        "temperature": 14,
        "description": "few clouds",
        "icon": "02n",
        "rain": "0"
    },
    {
        "number": 30,
        "timeofday": "2018-07-29T06:00:00Z",
        "temperature": 15,
        "description": "light rain",
        "icon": "10d",
        "rain": "0.93"
    },
    {
        "number": 31,
        "timeofday": "2018-07-29T09:00:00Z",
        "temperature": 16,
        "description": "light rain",
        "icon": "10d",
        "rain": "1.8"
    },
    {
        "number": 32,
        "timeofday": "2018-07-29T12:00:00Z",
        "temperature": 17,
        "description": "light rain",
        "icon": "10d",
        "rain": "2.51"
    },
    {
        "number": 33,
        "timeofday": "2018-07-29T15:00:00Z",
        "temperature": 18,
        "description": "light rain",
        "icon": "10d",
        "rain": "0.3"
    },
    {
        "number": 34,
        "timeofday": "2018-07-29T18:00:00Z",
        "temperature": 18,
        "description": "clear sky",
        "icon": "01d",
        "rain": "0"
    },
    {
        "number": 35,
        "timeofday": "2018-07-29T21:00:00Z",
        "temperature": 17,
        "description": "clear sky",
        "icon": "01n",
        "rain": "0"
    },
    {
        "number": 36,
        "timeofday": "2018-07-30T00:00:00Z",
        "temperature": 16,
        "description": "clear sky",
        "icon": "01n",
        "rain": "0"
    },
    {
        "number": 37,
        "timeofday": "2018-07-30T03:00:00Z",
        "temperature": 15,
        "description": "clear sky",
        "icon": "01n",
        "rain": "0"
    },
    {
        "number": 38,
        "timeofday": "2018-07-30T06:00:00Z",
        "temperature": 15,
        "description": "clear sky",
        "icon": "01d",
        "rain": "0"
    },
    {
        "number": 39,
        "timeofday": "2018-07-30T09:00:00Z",
        "temperature": 16,
        "description": "clear sky",
        "icon": "02d",
        "rain": "0"
    }
]

def make_time_type(time):
    return pd.to_datetime(time , format='%Y-%m-%dT%H:00:00Z')
    
print('string_time', '\t\t',
           'date_time_format' , '\t',
           'date', '\t',
           'hour', '\t',
            'day_of_week', '\t'  )
for i in range(40):
    response_time = response_json[i]['timeofday']
    formatted_time= make_time_type(response_time)
    
    print(  response_time, '\t',
            formatted_time , '\t',
            formatted_time.day, '\t',
            formatted_time.hour, '\t' ,
            formatted_time.dayofweek, '\t' )


front_end_time = 60323  #random time for testing

tomorrow = datetime.date.today() + datetime.timedelta(days=1)  # get tomorrows date (for testing)
tomorrow_epoch = tomorrow.strftime('%s') #convert to epoch (this format needed for function belo)

front_end_date = tomorrow_epoch


def get_temp_and_rain(response,seconds_past_midnight, epoch_time):
    """
    response: json from the getFiveDayWeather view in Django
    seconds_past_midnight:Time chosen (current time or from Django)
    epoch_time:Date chosen (from calendar)
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
    
    seconds_past_midnight_1970 =  pd.to_datetime(front_end_time,unit='s')  # seconds past midnight to dt object
    nearest_hour = seconds_past_midnight_1970.hour                         # get hour
    nearest_hour_multiple3 = round_hour_nearest_3_hour(nearest_hour)       # get nearest 3 hour interval
    
    epoch_dt_format = pd.to_datetime(epoch_time, unit='s')  # epoch time to dt object 
    day_of_month_chosen = epoch_dt_format.day               # get day

    for i in range(len(response)):    
        entry = response[i]
        time_for_entry =response[i]['timeofday']            #time in tring format
        formatted_time= pd.to_datetime(time_for_entry, format='%Y-%m-%dT%H:00:00Z') # dt object
        day_of_month = formatted_time.day
        hour = formatted_time.hour
        day_of_week =formatted_time.dayofweek
        
        res = {}                             # initialise empty dictionary
        res['day_of_month'] = day_of_month   # store day of month and time
        res['hour'] = hour 
        
        if  day_of_month== day_of_month_chosen and hour==  nearest_hour_multiple3:
            res['temp'] =  entry['temperature'] 
            res['rain'] =  entry['rain']    

            return res
    return res
       
            
relevant_weather= get_temp_and_rain(response_json,front_end_time, front_end_date )        
print(relevant_weather)
print()
print('temp',relevant_weather['temp'])
print('rain',relevant_weather['rain'])
