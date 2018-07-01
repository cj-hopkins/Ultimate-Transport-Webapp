from rest_framework import serializers
from .models import Stop, Route, Composite


class StopSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'stop',
            'name',
            'lat',
            'lon',
        )
        model = Stop


class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'route',
        )
        model = Route

class RouteStopSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'stop_id',
            'route_direction',
            'sequence',
            'is_stage_point',
            'stage_number',
            'journey_pattern_id',
            'rtpi_destination',
            'rtpi_origin',
            'rtpi_via',
            'sequence_number',
            'fare',
        )
        model = Composite
