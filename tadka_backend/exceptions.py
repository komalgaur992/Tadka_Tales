from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        custom_response = {
            'status_code': response.status_code,
            'error': {
                'message': '',
                'details': response.data
            }
        }

        if response.status_code == status.HTTP_400_BAD_REQUEST:
            custom_response['error']['message'] = 'Invalid input provided.'
        elif response.status_code == status.HTTP_401_UNAUTHORIZED:
            custom_response['error']['message'] = 'Authentication credentials were not provided or are invalid.'
        elif response.status_code == status.HTTP_403_FORBIDDEN:
            custom_response['error']['message'] = 'You do not have permission to perform this action.'
        elif response.status_code == status.HTTP_404_NOT_FOUND:
            custom_response['error']['message'] = 'The requested resource was not found.'
        elif response.status_code >= 500:
            custom_response['error']['message'] = 'A server error occurred. Please try again later.'
        else:
            custom_response['error']['message'] = 'An unexpected error occurred.'

        response.data = custom_response

    return response
