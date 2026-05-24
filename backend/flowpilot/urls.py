"""FlowPilot AI URL Configuration."""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('projects.urls')),
    path('api/ai/', include('ai_planner.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/team/', include('team.urls')),
]
