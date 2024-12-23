from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework import status
import requests
from io import StringIO
import pandas as pd
from django.http import HttpResponse

@csrf_exempt
def fetch_thingspeak_data(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            channel_id = data.get('channel_id')
            api_key = data.get('api_key')

            if not channel_id or not api_key:
                return JsonResponse({'error': 'Missing channel_id or api_key'}, status=400)

            url = f'https://api.thingspeak.com/channels/{channel_id}/feeds.json?api_key={api_key}&results=100'
            response = requests.get(url)
            
            if response.status_code != 200:
                return JsonResponse({'error': 'Failed to fetch data from ThingSpeak'}, status=500)
            
            thingspeak_data = response.json()
            feeds = thingspeak_data.get('feeds', [])
            
            if not feeds:
                return JsonResponse({'feeds': []})

            # Convert to DataFrame for easier processing
            df = pd.DataFrame(feeds)

            # Data cleaning steps
            df.dropna(subset=['field1', 'field2'], inplace=True)  # Drop rows with missing key fields
            df['created_at'] = pd.to_datetime(df['created_at'])

            # Example: Filter out entries with 'NO' in field2
            df = df[~df['field2'].str.contains('NO', na=False)]

            # Convert back to JSON
            cleaned_data = df.to_dict(orient='records')

            return JsonResponse({'feeds': cleaned_data})
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)

        
        
# class ThingSpeakCSVView(APIView):
    # def get(self, request, *args, **kwargs):
    #     # Replace with your ThingSpeak API key and channel ID
    #     api_key = 'LNE70H5T7Z0OV014'
    #     channel_id = '2738955'
    #     url = f'https://api.thingspeak.com/channels/{channel_id}/feeds.csv?api_key={api_key}'

    #     try:
    #         response = requests.get(url)
    #         response.raise_for_status()  # Raise an exception for 4xx/5xx responses

    #         # Parse the CSV data using pandas
    #         csv_data = pd.read_csv(io.StringIO(response.text))

    #         # Drop completely empty columns and rows
    #         csv_data = csv_data.dropna(axis=1, how='all')  # Drop empty columns
    #         csv_data = csv_data.dropna(axis=0, how='all')  # Drop empty rows

    #         # Clean up any spaces in column names and values
    #         csv_data.columns = csv_data.columns.str.strip()
    #         for column in csv_data.columns:
    #             csv_data[column] = csv_data[column].str.strip() if csv_data[column].dtype == 'object' else csv_data[column]

    #         # Filter out rows where 'field1' or 'field2' are empty
    #         csv_data = csv_data[csv_data['field1'].notnull() & csv_data['field1'] != '']

    #         # Convert to list of dictionaries
    #         cleaned_data = csv_data.to_dict(orient='records')

    #         return Response(cleaned_data, status=status.HTTP_200_OK)

    #     except requests.exceptions.RequestException as e:
    #         return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)