from django.urls import path
# from .views import ThingSpeakCSVView
from . import views

urlpatterns = [
    path('fetch-thingspeak-data/', views.fetch_thingspeak_data, name='fetch-thingspeak-data'),
#     path('fetch-data/',ThingSpeakCSVView.as_view(),name='fetch_data'),
# ]
]