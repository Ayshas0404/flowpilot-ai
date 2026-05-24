from rest_framework import serializers
from .models import AIHistory


class AIHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = AIHistory
        fields = ["id", "prompt", "generated_output", "created_at"]
        read_only_fields = ["id", "generated_output", "created_at"]


class AIGenerateSerializer(serializers.Serializer):
    prompt = serializers.CharField(max_length=1000)
