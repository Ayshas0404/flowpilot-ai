from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import TeamMember

User = get_user_model()


class TeamMemberSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.get_full_name", read_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = TeamMember
        fields = ["id", "user", "user_name", "user_email", "project", "role", "joined_at"]
        read_only_fields = ["id", "joined_at"]
