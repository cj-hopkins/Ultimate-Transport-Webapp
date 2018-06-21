from rest_framework import serializers
from .models import Stop


class StopSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'stop_id',
            'stop_name',
            'stop_lat',
            'stop_long',
        )
        model = Stop
