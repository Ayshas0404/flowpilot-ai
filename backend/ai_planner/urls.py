from django.urls import path
from .views import AIGenerateView, AIHistoryListView

urlpatterns = [
    path("generate/", AIGenerateView.as_view(), name="ai-generate"),
    path("history/", AIHistoryListView.as_view(), name="ai-history"),
]
