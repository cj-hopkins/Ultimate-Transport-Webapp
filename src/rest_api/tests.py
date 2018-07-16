from django.test import TestCase, Client
from rest_api.models import Stop, Route, Composite
import unittest


class basicTestCase(TestCase):
    client = Client()

    def test_index_page_load(self):
        response = basicTestCase.client.get('')
        self.assertEqual(response.status_code, 800)

    def test_stops_request(self):
        response = basicTestCase.client.get('/api')
        self.assertEqual(response.status_code, 301)

    def test_composite_table(self):
        objects = Composite.objects.all()
        isSuccessful = True if objects is not None else False
        self.assertEqual(isSuccessful, True)

    def test_composite_url(self):
        response = basicTestCase.client.get('/api/getRouteStopComposite')
        self.assertEqual(response.status_code, 200)

    def test_getStopsForRoute(self):
        response = basicTestCase.client.post('/api/getStopsForRoute',
                                             {'route': '31',
                                              'direction': 'I'})
        self.assertEqual(response.status_code, 200)
