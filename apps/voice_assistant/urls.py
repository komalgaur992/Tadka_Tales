from django.urls import path
from .views import VoiceAssistantView

urlpatterns = [
    path('chat/', VoiceAssistantView.as_view(), name='voice-assistant-chat'),
]
