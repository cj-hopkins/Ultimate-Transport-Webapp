from django.db import models

# class Meta:
#     db_table = 'stops'


class Stop(models.Model):
    stop_id = models.IntegerField(primary_key=True)
    stop_name = models.CharField(max_length=200)
    stop_lat = models.FloatField()
    stop_long = models.FloatField()

    def __str__(self):
        return "id: {}\nname: {}\nlat: {}\nlong: {}".format(self.stop_id,
                                                            self.stop_name,
                                                            self.stop_lat,
                                                            self.stop_long)


class Weather(models.Model):
    id = models.IntegerField()
    date = models.DateTimeField(primary_key=True)
    ind_rain = models.IntegerField()
    rain = models.FloatField()
    ind_air_temp = models.IntegerField()
    air_temp = models.FloatField()
    ind_wetb_temp = models.IntegerField()
    wet_bulb_temp = models.FloatField()
    dew_point = models.FloatField()
    vapour_pressure = models.FloatField()
    rel_humidity = models.IntegerField()
    mean_sea_level = models.FloatField()

    def __str__(self):
        return "id: {}\ndate: {}\nind_rain: {}\nrain: {}\nind_air_temp: \
        {}\nair_temp: {}\nind_wetb_temp: {}\nwet_bulb_temp: {}\ndew_point: \
        {}\nvapour_pressure: {}\nrel_humidity: {}\nmean_sea_level: {}\n".format(self.id,
                                                                                self.date,
                                                                                self.ind_rain,
                                                                                self.rain,
                                                                                self.ind_air_temp,
                                                                                self.air_temp,
                                                                                self.ind_wetb_temp,
                                                                                self.wet_bulb_temp,
                                                                                self.dew_point,
                                                                                self.vapour_pressure,
                                                                                self.rel_humidity,
                                                                                self.mean_sea_level,
                                                                                )
