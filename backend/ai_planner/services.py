"""
AI Sprint Planner Service.

This module contains the mock AI generation logic.
To swap in real OpenAI integration later, simply replace the
`generate_sprint_plan` function body with an OpenAI API call.
"""


def generate_sprint_plan(prompt: str) -> dict:
    """
    Generate a sprint plan from a project goal description.

    Currently returns mock data. To integrate real OpenAI:
    1. pip install openai
    2. Import and configure the OpenAI client
    3. Replace the return below with a chat completion call

    Example OpenAI integration:
        from openai import OpenAI
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a sprint planning assistant..."},
                {"role": "user", "content": prompt}
            ]
        )
        return json.loads(response.choices[0].message.content)
    """
    return {
        "goal": prompt,
        "sprints": [
            {
                "name": "Sprint 1: Foundation & Setup",
                "duration": "1 Week",
                "tasks": [
                    "Initialize repository and project framework",
                    "Configure database schema and run initial migrations",
                    "Setup CI/CD pipeline with GitHub Actions",
                    "Implement JWT-based authentication flow",
                    "Create base UI component library",
                ],
            },
            {
                "name": "Sprint 2: Core Features",
                "duration": "2 Weeks",
                "tasks": [
                    "Build project and task CRUD interfaces",
                    "Develop Kanban drag-and-drop board",
                    "Create real-time analytics dashboard",
                    "Integrate AI sprint planning module",
                    "Implement team member management",
                ],
            },
            {
                "name": "Sprint 3: Polish & Launch",
                "duration": "1 Week",
                "tasks": [
                    "Add end-to-end test coverage",
                    "Performance optimization and lazy loading",
                    "Responsive design QA across devices",
                    "Deploy frontend to Vercel, backend to Render",
                    "Write technical documentation and README",
                ],
            },
        ],
        "milestones": [
            "Auth & DB Ready (Day 3)",
            "Core MVP Complete (Day 14)",
            "Production Deploy (Day 21)",
        ],
        "estimated_total_duration": "4 Weeks",
    }
