from django.test import TestCase, Client
import unittest

class basicTestCase(TestCase):
    client = Client()
    
    def test_index_page_load(self):
        response = basicTestCase.client.get('')
        self.assertEqual(response.status_code, 200)

    def test_stops_request(self):
        response = basicTestCase.client.get('/api')
        self.assertEqual(response.status_code, 200)
