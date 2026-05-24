from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import AIHistory
from .serializers import AIHistorySerializer, AIGenerateSerializer
from .services import generate_sprint_plan


class AIGenerateView(APIView):
    """Generate an AI sprint plan from a project goal."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AIGenerateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        prompt = serializer.validated_data["prompt"]
        output = generate_sprint_plan(prompt)

        # Save to history
        history = AIHistory.objects.create(
            user=request.user,
            prompt=prompt,
            generated_output=output,
        )

        return Response(
            AIHistorySerializer(history).data,
            status=status.HTTP_201_CREATED,
        )


class AIHistoryListView(generics.ListAPIView):
    """List all past AI-generated plans for the current user."""
    serializer_class = AIHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AIHistory.objects.filter(user=self.request.user)
