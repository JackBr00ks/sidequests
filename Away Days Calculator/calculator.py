from datetime import datetime, timedelta
import pandas as pd

def calculate_days_in_europe(travel_dates, arrival_dates):
    current_date = datetime.now().date()
    count = 0
    
    for travel_date, arrival_date in zip(travel_dates, arrival_dates):
        travel_date_obj = datetime.strptime(travel_date, "%d/%m/%y").date()
        arrival_date_obj = datetime.strptime(arrival_date, "%d/%m/%y").date()
        days_since_travel = (current_date - travel_date_obj).days
        days_since_arrival = (current_date - arrival_date_obj).days
        
        if days_since_travel <= 180 or days_since_arrival <= 180:
            count += 1
    
    return count

# Read travel and arrival dates from Excel file
file_path = input("Enter the file path of the Excel calendar: ")
travel_df = pd.read_excel(file_path, sheet_name="Sheet1", usecols=["Travel Date"])
arrival_df = pd.read_excel(file_path, sheet_name="Sheet1", usecols=["Arrival Date"])

# Convert DataFrame columns to list
travel_dates = travel_df["Travel Date"].tolist()
arrival_dates = arrival_df["Arrival Date"].tolist()

days_in_europe = calculate_days_in_europe(travel_dates, arrival_dates)
print(f"You have been in Europe for {days_in_europe} days within the last 180 days.")
