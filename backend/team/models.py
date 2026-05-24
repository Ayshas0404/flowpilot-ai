from django.db import models
from django.conf import settings


class TeamMember(models.Model):
    ROLE_CHOICES = [
        ("admin", "Admin"),
        ("member", "Member"),
        ("viewer", "Viewer"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="memberships"
    )
    project = models.ForeignKey(
        "projects.Project", on_delete=models.CASCADE, related_name="members"
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="member")
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "project")
        ordering = ["-joined_at"]

    def __str__(self):
        return f"{self.user.email} - {self.project.title} ({self.role})"
