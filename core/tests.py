from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status


class PingAPITestCase(APITestCase):
    """
    Test cases for the ping API endpoint.
    """
    
    def test_ping_endpoint(self):
        """
        Test that the ping endpoint returns a successful response.
        """
        url = reverse('ping')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        self.assertEqual(response.data['message'], 'pong')
        self.assertIn('timestamp', response.data)
        self.assertEqual(response.data['server'], 'Tadka Backend API')
