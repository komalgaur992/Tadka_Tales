import os
import openai
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Set API key (from environment variable)
openai.api_key = os.getenv("OPENAI_API_KEY")

class VoiceAssistantView(APIView):
    """
    View to handle user input and return AI-generated cooking steps or answers.
    """

    def post(self, request):
        user_input = request.data.get("query", "").strip()

        if not user_input:
            return Response({
                "status": "error",
                "message": "Query is required",
                "response": None
            }, status=status.HTTP_400_BAD_REQUEST, content_type="application/json")

        try:
            # Call OpenAI API
            completion = openai.ChatCompletion.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful cooking assistant for Indian recipes. Explain step-by-step in simple language."},
                    {"role": "user", "content": user_input}
                ],
                temperature=0.7
            )

            reply = completion.choices[0].message["content"]

            return Response({
                "status": "success",
                "message": "Cooking instructions fetched successfully",
                "response": reply
            }, status=status.HTTP_200_OK, content_type="application/json")

        except Exception as e:
            return Response({
                "status": "error",
                "message": str(e),
                "response": None
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR, content_type="application/json")
