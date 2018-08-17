from django.test import Client, TestCase
from rest_api.models import Stop, Route, Composite


class basicTestCase(TestCase):
    client = Client()

    def test_index_page_load(self, **kwargs):
        response = basicTestCase.client.get('')
        self.assertEqual(response.status_code, 200)

    def test_stops_request(self, **kwargs):
        response = basicTestCase.client.get('/api')
        self.assertEqual(response.status_code, 301)

    def test_composite_table(self, **kwargs):
        objects = Composite.objects.all()
        isSuccessful = True if objects is not None else False
        self.assertEqual(isSuccessful, True)

    def test_composite_url(self, **kwargs):
        response = basicTestCase.client.get('/api/getRouteStopComposite')
        self.assertEqual(response.status_code, 200)

    def test_getStopsForRoute(self, **kwargs):
        response = basicTestCase.client.post('/api/getStopsForRoute',
                                             {'route': '31',
                                              'direction': 'I'})
        self.assertEqual(response.status_code, 200)

    def test_getStopsForTimetable(self, **kwargs):
        response = basicTestCase.client.get('/api/getTimeTable')
        print(response.data)

    def test_googleJourneyPrediction(self, **kwargs):
        response = basicTestCase.client.post('/api/getMultiRoutePrediction',
            {'busRoutes': [{'route': '61', 'stops': 22, 'headsign': 'Eden Quay', 
            'start': {'lat': 53.2953534, 'lng': -6.246183999999971}, 
            'finish': {'lat': 53.3477632, 'lng': -6.25843789999999}}], 
            'isDefaultTime': True, 'direction': 'I'})
        self.assertEqual(response.status_code, 200)

    def test_realTimeStops(self, **kwargs):
        response = basicTestCase.client.get('/api/getAllStopNumbers')
        print("REALTIME", response.json())
        self.assertEqual(len(response.json()), 4629)

    def test_currentWeather(self, **kwargs):
        response = basicTestCase.client.get('/api/getCurrentWeather')
        self.assertEqual(response.status_code, 200)

    def test_fiveDayWeather(self, **kwargs):
        response = basicTestCase.client.get('/api/getFiveDayWeather')
        self.assertEqual(response.json().length, 40)

    def test_numberOfRoutes(self, **kwargs):
        response = basicTestCase.client.get('/api/getRouteStopComposite')
        print(response.data)
        self.assertEqual(len(response.json()), 129)

    def test_timetable(self, **kwargs):
        response = basicTestCase.client.get('/api/getTimeTable',
            {'lineid':'14', 'direction': 1, 'stop':6041, 'weekday':1, 'saturday':0, 'sunday':0})
        self.assertEqual(response.data.status_code, 200)

    def test_routeJourneyPrediction(self, **kwargs):
        response = basicTestCase.client.get('/api/getModelPrediction',
            {'route':'14', 'start':6041, 'finish':248, 'direction':'I', 'selectedTime':60670,
            'selectedDate':1, 'isDefaultTime': True})
        self.assertEqual(response.status_code, 200)
