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
    location_text = models.CharField(max_length=50)
    address = models.CharField(max_length=50)
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

class Currentweather(models.Model):
    identifier = models.IntegerField(primary_key=True)
    temperature = models.IntegerField()
    description = models.CharField(max_length=128)
    icon = models.CharField(max_length=128)

# ID,NAME,ROUTE_DIRECTION,SEQUENCE,IS_STAGE_POINT,STAGE_NUMBER,JOURNEY_PATTERN_ID,RTPI_DESTINATION,RTPI_ORGIN,RTPI_VIA,SEQUENCE_NUMBER,FARE

class FiveDayWeather(models.Model):
    number = models.IntegerField()
    timeofday = models.DateTimeField(primary_key=True)
    temperature = models.IntegerField()
    description = models.CharField(max_length=128)
    icon = models.CharField(max_length=10)
    rain = models.CharField(max_length=32)

    def __str__(self):
        return "number : {}\ntimeofday: {}\ntemperature: {}\ndescription: {}\nicon: \
        {}\nrain: {}\n".format(self.number,
                 self.timeofday,
                 self.temperature,
                 self.description,
                 self.icon,
                 self.rain,
                 )
