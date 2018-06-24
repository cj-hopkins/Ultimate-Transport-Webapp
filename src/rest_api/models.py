from django.db import models

# class Meta:
#     db_table = 'stops'


class Stop(models.Model):
    stop_id = models.CharField(primary_key=True, max_length=200)
    stop_name = models.CharField(max_length=200)
    stop_lat = models.FloatField()
    stop_long = models.FloatField()

    def __str__(self):
        return "id: {}\nname: {}\nlat: {}\nlong: {}".format(self.stop_id,
                                                            self.stop_name,
                                                            self.stop_lat,
                                                            self.stop_long)


class Weather(models.Model):
    ID = models.IntegerField()
    Date = models.DateTimeField(primary_key=True)
    Ind_Rain = models.IntegerField()
    Rain = models.FloatField()
    Ind_Air_Temp = models.IntegerField()
    Air_Temp = models.FloatField()
    Ind_Wetb_Temp = models.IntegerField()
    Wet_Bulb_Temp = models.FloatField()
    Dew_Point = models.FloatField()
    Vapour_Pressure = models.FloatField()
    Rel_Humidity = models.IntegerField()
    Mean_Sea_Level = models.FloatField()

    def __str__(self):
        return "id: {}\ndate: {}\nind_rain: {}\nrain: {}\nind_air_temp: \
        {}\nair_temp: {}\nind_wetb_temp: {}\nwet_bulb_temp: {}\ndew_point: \
        {}\nvapour_pressure: {}\nrel_humidity: {}\nmean_sea_level: \
    {}\n".format(self.ID,
                 self.Date,
                 self.Ind_Rain,
                 self.Rain,
                 self.Ind_Air_Temp,
                 self.Air_Temp,
                 self.Ind_Wetb_Temp,
                 self.Wet_Bulb_Temp,
                 self.Dew_Point,
                 self.Vapour_Pressure,
                 self.Rel_Humidity,
                 self.Mean_Sea_Level,
                 )
