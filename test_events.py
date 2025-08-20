#!/usr/bin/env python3
import requests
import json

def test_create_draft_event():
    url = "http://localhost:5000/api/events"
    data = {
        'title': 'My Draft Event',
        'description': 'This is a test draft event',
        'status': 'draft'
    }
    
    try:
        response = requests.post(url, data=data)
        print(f"Create Draft - Status: {response.status_code}")
        if response.status_code == 201:
            print("✅ Draft event created successfully")
            return response.json()
        else:
            print(f"❌ Failed to create draft: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_get_events():
    url = "http://localhost:5000/api/events"
    
    try:
        response = requests.get(url)
        print(f"Get Events - Status: {response.status_code}")
        if response.status_code == 200:
            events = response.json()
            print(f"✅ Found {len(events)} events")
            for event in events:
                status = event.get('status', 'unknown')
                title = event.get('title', 'Untitled')
                print(f"  - {title} ({status})")
            return events
        else:
            print(f"❌ Failed to get events: {response.text}")
            return []
    except Exception as e:
        print(f"❌ Error: {e}")
        return []

if __name__ == "__main__":
    print("🧪 Testing Event API...")
    print("=" * 40)
    
    # Test initial state
    print("1. Getting initial events:")
    test_get_events()
    
    print("\n2. Creating draft event:")
    draft_result = test_create_draft_event()
    
    print("\n3. Getting events after creating draft:")
    test_get_events()
    
    print("\n✅ Test completed!")
