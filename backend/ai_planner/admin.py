from django.contrib import admin
from .models import AIHistory

@admin.register(AIHistory)
class AIHistoryAdmin(admin.ModelAdmin):
    list_display = ("user", "prompt", "created_at")
    search_fields = ("prompt", "generated_output")
    list_filter = ("created_at",)
