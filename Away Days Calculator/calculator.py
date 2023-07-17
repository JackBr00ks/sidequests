from datetime import datetime, timedelta
import pandas as pd

def calculate_days_in_europe(travel_dates, return_dates):
    current_date = datetime.now().date()
    count = 0
    
    for travel_date, return_date in zip(travel_dates, return_dates):
        travel_date_obj = datetime.strptime(travel_date, "%Y-%m-%d").date()
        return_date_obj = datetime.strptime(return_date, "%Y-%m-%d").date()
        
        # Calculate the start and end dates of the last 180 days
        start_date = current_date - timedelta(days=180)
        end_date = current_date
        
        # Check if the trip falls within the last 180 days
        if start_date <= return_date_obj <= end_date:
            duration = (min(return_date_obj, end_date) - max(travel_date_obj, start_date)).days + 1
            count += duration
    
    return count

# Replace the file path with the actual path to your Excel file
file_path = "/Users/jackbrooks/Documents/Projects/sidequests/Away Days Calculator/Dates.xlsx"
travel_df = pd.read_excel(file_path, sheet_name="Sheet1", usecols=["Travel Date"])
return_df = pd.read_excel(file_path, sheet_name="Sheet1", usecols=["Return Date"])

# Convert DataFrame columns to string format
travel_dates = travel_df["Travel Date"].astype(str).tolist()
return_dates = return_df["Return Date"].astype(str).tolist()

days_in_europe = calculate_days_in_europe(travel_dates, return_dates)
print(f"You have been in Europe for {days_in_europe} days within the last 180 days.")
