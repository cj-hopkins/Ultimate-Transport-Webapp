from django.db import models

# class Meta: 
#     db_table = 'stops'

class Stop(models.Model):
    stop_id = models.IntegerField(primary_key=True)
    stop_name = models.CharField(max_length=200)
    stop_lat = models.FloatField(max_length=200)
    stop_long = models.FloatField()

    def __str__(self):
        return "id: {}\nname: {}\nlat: {}\nlong: {}".format(self.stop_id,
                                                            self.stop_name,
                                                            self.stop_lat,
                                                            self.stop_long)
