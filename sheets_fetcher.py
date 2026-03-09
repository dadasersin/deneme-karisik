import requests
import sys

def fetch_sheets_data(spreadsheet_id, format='csv'):
    url = f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/export?format={format}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.text
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    sid = "1gTuwKDqDEy7kqWLizWR4Vs39UVwWdCxUwNguDoth6mM"
    data = fetch_sheets_data(sid)
    print(data)
