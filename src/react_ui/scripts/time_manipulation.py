import pandas as pd
import numpy as np 
import datetime

time_front_end= 1532278966789
time_corrected = int(time_front_end/1000)

hour = datetime.datetime.fromtimestamp(time_corrected).strftime('%H')
dataframe1=pd.DataFrame([hour], dtype=int)
newdf =pd.cut(dataframe1[0], [4,7, 9, 12,16,18,23], labels=['before_8am','8am-10am','10am-1pm','1pm-5pm','5pm-7pm','after_7pm'])
df_dummies = pd.get_dummies(newdf)
df_better_format = df_dummies.loc[:, df_dummies.columns != 'after_7pm']

day_of_week = datetime.datetime.fromtimestamp(time_corrected).weekday()
is_a_weekday = day_of_week <5
dataframe2=pd.DataFrame([{'weekday':is_a_weekday}])
df_time_details = pd.concat([dataframe2, df_better_format], axis=1) 
print(df_time_details )