from groq import Groq

from app.core.config import settings


def get_groq_client():
    if not settings.groq_api_key:
        return None

    return Groq(api_key=settings.groq_api_key)


def generate_explanation(prompt: str) -> str:
    client = get_groq_client()

    if client is None:
        return "Groq API key is not configured."

    response = client.chat.completions.create(
        model=settings.groq_model,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a railway maintenance planning assistant. "
                    "Explain maintenance priorities and schedules clearly "
                    "for railway planners."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=0.2,
    )

    return response.choices[0].message.content