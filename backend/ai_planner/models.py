from django.db import models
from django.conf import settings


class AIHistory(models.Model):
    """Stores AI sprint planner prompts and responses."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="ai_history"
    )
    prompt = models.TextField()
    generated_output = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "AI Histories"

    def __str__(self):
        return f"AI Plan: {self.prompt[:50]}"
