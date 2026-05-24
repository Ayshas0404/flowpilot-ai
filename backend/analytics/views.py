from datetime import timedelta
from django.utils import timezone
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from projects.models import Project, Task

class AnalyticsView(APIView):
    """Return aggregated analytics data for the dashboard."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        projects = Project.objects.filter(created_by=user)
        tasks = Task.objects.filter(project__created_by=user)

        total_projects = projects.count()
        active_projects = projects.exclude(status="completed").count()
        total_tasks = tasks.count()
        completed_tasks = tasks.filter(status="done").count()
        completion_rate = round((completed_tasks / total_tasks * 100), 1) if total_tasks > 0 else 0

        # Pie Chart Data (Task Status Breakdown)
        todo = tasks.filter(status="todo").count()
        in_progress = tasks.filter(status="in_progress").count()
        review = tasks.filter(status="review").count()
        
        pie_data = [
            {"name": "To Do", "value": todo, "color": "#888888"},
            {"name": "In Progress", "value": in_progress, "color": "#3b82f6"},
            {"name": "In Review", "value": review, "color": "#f97316"},
            {"name": "Done", "value": completed_tasks, "color": "#22c55e"},
        ]

        # Filter out 0 value pie chart sections to avoid rendering empty slices
        pie_data = [p for p in pie_data if p["value"] > 0]
        if not pie_data:
             pie_data = [{"name": "No Tasks", "value": 1, "color": "#222222"}]

        # Productivity Chart Data (Last 7 Days)
        today = timezone.now().date()
        productivity_data = []
        for i in range(6, -1, -1):
            day = today - timedelta(days=i)
            day_name = day.strftime("%a")
            # tasks created that day
            tickets = tasks.filter(created_at__date=day).count()
            # Count tasks completed (marked done) that day
            productivity = tasks.filter(status="done", updated_at__date=day).count() * 10

            productivity_data.append({
                "name": day_name,
                "productivity": productivity,
                "tickets": tickets
            })

        # Sprint Velocity (Mocked grouping by weeks for recent tasks)
        velocity_data = [
            {"name": "Sprint 1", "completed": completed_tasks // 2, "added": total_tasks // 2},
            {"name": "Sprint 2", "completed": completed_tasks - (completed_tasks // 2), "added": total_tasks - (total_tasks // 2)},
        ]

        return Response({
            "total_projects": total_projects,
            "active_projects": active_projects,
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "completion_rate": completion_rate,
            "productivity_score": min(100, int(completion_rate * 1.1)),
            "pie_data": pie_data,
            "productivity_data": productivity_data,
            "velocity_data": velocity_data,
        })
