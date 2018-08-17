from django.test import Client, SimpleTestCase

# from rest_api.models import Stop, Route, Composite
# import unittest


class basicTestCase(SimpleTestCase):
    client = Client()

    def test_index_page_load(self, **kwargs):
        response = basicTestCase.client.get('')
        self.assertEqual(response.status_code, 200)

    # def test_stops_request(self):
    #     response = basicTestCase.client.get('/api')
    #     self.assertEqual(response.status_code, 301)

    # def test_composite_table(self):
    #     objects = Composite.objects.all()
    #     isSuccessful = True if objects is not None else False
    #     self.assertEqual(isSuccessful, True)

    # def test_composite_url(self):
    #     response = basicTestCase.client.get('/api/getRouteStopComposite')
    #     self.assertEqual(response.status_code, 200)

    # def test_getStopsForRoute(self):
    #     response = basicTestCase.client.post('/api/getStopsForRoute',
    #                                          {'route': '31',
    #                                           'direction': 'I'})
    #     self.assertEqual(response.status_code, 200)

    # def test_getStopsForTimetable(self):
    #     response = basicTestCase.client.get('/api/getTimeTable')
    #     print(response.data)

    # def test_googleJourneyPrediction(self):
    #     response = basicTestCase.client.post('/api/getMultiRoutePrediction',
    #         {'busRoutes': [{'route': '61', 'stops': 22, 'headsign': 'Eden Quay', 
    #         'start': {'lat': 53.2953534, 'lng': -6.246183999999971}, 
    #         'finish': {'lat': 53.3477632, 'lng': -6.25843789999999}}], 
    #         'isDefaultTime': True, 'direction': 'I'})
    #     self.assertEqual(response.status_code, 200)

    # def test_realTimeStops(self):
    #     response = basicTestCase.client.get('/api/getAllStopNumbers')
    #     self.assertEqual(response.length, 4629)

    # def test_currentWeather(self):
    #     response = basicTestCase.client.get('/api/getCurrentWeather')
    #     self.assertEqual(response.status_code, 200)

    # def test_fiveDayWeather(self):
    #     response = basicTestCase.client.get('/api/getFiveDayWeather')
    #     self.assertEqual(response.length, 40)

    # def test_numberOfRoutes(self):
    #     response = basicTestCase.client.get('/api/getRouteStopComposite')
    #     self.assertEqual(response.length, 129)

    # def test_timetable(self):
    #     response = basicTestCase.client.get('/api/getTimeTable',
    #         {'lineid':'14', 'direction': 1, 'stop':6041, 'weekday':1, 'saturday':0, 'sunday':0})
    #     self.assertEqual(response.status_code, 200)

    # def test_routeJourneyPrediction(self):
    #     response = basicTestCase.client.get('/api/getModelPrediction',
    #         {'route':'14', 'start':6041, 'finish':248, 'direction':'I', 'selectedTime':60670,
    #         'selectedDate':1, 'isDefaultTime': True})
    #     self.assertEqual(response.status_code, 200)
