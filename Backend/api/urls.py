from django.urls import path
# from .views import ThingSpeakCSVView
from . import views

urlpatterns = [
    path('fetch-thingspeak-data/', views.fetch_thingspeak_data, name='fetch-thingspeak-data'),
    path('ask-gemini/', views.ask_gemini, name="ask-gemini"),
#     path('fetch-data/',ThingSpeakCSVView.as_view(),name='fetch_data'),
# ]
]