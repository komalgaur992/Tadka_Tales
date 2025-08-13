from rest_framework import serializers


class VoiceAssistantRequestSerializer(serializers.Serializer):
    query = serializers.CharField(max_length=500)
