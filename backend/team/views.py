from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model

from .models import TeamMember
from .serializers import TeamMemberSerializer

User = get_user_model()


class TeamMemberViewSet(viewsets.ModelViewSet):
    serializer_class = TeamMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TeamMember.objects.filter(project__created_by=self.request.user)

    @action(detail=False, methods=["post"])
    def invite(self, request):
        """
        Invite a user to a project by email.
        Body: { "email": "...", "project": <id>, "role": "member" }
        If the user doesn't exist yet, we create a placeholder account
        so the member record can be created immediately.
        """
        email = request.data.get("email", "").strip().lower()
        project_id = request.data.get("project")
        role = request.data.get("role", "member")

        if not email:
            return Response(
                {"detail": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not project_id:
            return Response(
                {"detail": "Project is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verify the requesting user owns this project
        from projects.models import Project

        try:
            project = Project.objects.get(id=project_id, created_by=request.user)
        except Project.DoesNotExist:
            return Response(
                {"detail": "Project not found or you don't own it."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Find or create the user
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Create a placeholder account so the invite works immediately.
            # They can set their password later via registration/reset.
            username = email.split("@")[0]
            # Ensure unique username
            base_username = username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            user = User.objects.create_user(
                username=username,
                email=email,
                password=User.objects.make_random_password(),
                first_name=email.split("@")[0].title(),
            )

        # Check if already a member
        if TeamMember.objects.filter(user=user, project=project).exists():
            return Response(
                {"detail": f"{email} is already a member of this project."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        member = TeamMember.objects.create(user=user, project=project, role=role)
        serializer = self.get_serializer(member)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
