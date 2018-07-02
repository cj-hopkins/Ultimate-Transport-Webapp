from django.db import models

# class Meta:
#     db_table = 'stops'

class Stop(models.Model):
    identifier = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=200)
    lat = models.FloatField()
    lon = models.FloatField()

    def __str__(self):
        return "id: {}\nname: {}\nlat: {}\nlong: {}".format(self.identifier,
                                                            self.name,
                                                            self.lat,
                                                            self.lon)


class Route(models.Model):
    route = models.CharField(primary_key=True, max_length=200)

class Composite(models.Model):

    # stop_id = models.ForeignKey(Stop, on_delete=models.CASCADE)
    # name = models.CharField(max_length=50, primary_key=True)
    # stop = models.ForeignKey(Stop, primary_key=True, on_delete=models.CASCADE)
    identifier = models.IntegerField(primary_key=True)
    stop_id = models.IntegerField()
    name = models.CharField(max_length=50)
    route_direction = models.CharField(max_length=1)
    sequence = models.FloatField()
    is_stage_point = models.CharField(max_length=1)
    stage_number = models.FloatField()
    journey_pattern_id = models.CharField(max_length=50)
    rtpi_destination = models.CharField(max_length=50)
    rtpi_origin = models.CharField(max_length=50)
    rtpi_via = models.CharField(max_length=50)
    sequence_number = models.IntegerField()
    fare = models.FloatField()
    stop_lat = models.FloatField()
    stop_lon = models.FloatField()


# ID,NAME,ROUTE_DIRECTION,SEQUENCE,IS_STAGE_POINT,STAGE_NUMBER,JOURNEY_PATTERN_ID,RTPI_DESTINATION,RTPI_ORGIN,RTPI_VIA,SEQUENCE_NUMBER,FARE

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
