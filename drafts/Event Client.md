
# Event Client

The `EventClient` class provides a streamlined interface for publishing events to the Biosero Data Services API. It handles event message formatting, transmission, and supports both synchronous and asynchronous operations for laboratory event tracking and audit trails.

## Overview

The Event Client is designed to interact with the Biosero Event Service, providing methods to:
- Publish laboratory events for audit and tracking
- Support both synchronous and asynchronous event publishing
- Handle event message serialization and validation
- Manage HTTP client connections efficiently
- Provide server time synchronization


## Initialization Options

The EventClient supports three different initialization patterns:

### Direct URL
```python
client = EventClient(url="https://api.example.com")
```

## Event Publishing

### `publish_event(event_message)`

Publishes an event message synchronously to the Event Service.

**Parameters:**
- `event_message` (EventMessage): Event message object containing all event details

**Returns:**
- `dict`: JSON response from the API containing publication confirmation

**Example:**
```python
from biosero.datamodels.events import EventMessage
from datetime import datetime

# Create event message
event = EventMessage(
    topic="sample.processed",
    subjects=["sample-123"],
    data={
        "operator": "lab_tech_1",
        "processing_time": "00:45:30",
        "status": "completed"
    },
    tags=["laboratory", "processing"],
    created_date_utc=datetime.utcnow()
)

# Publish event
client = EventClient(url="https://api.example.com")
result = client.publish_event(event)
print(f"Event published: {result}")
```

**API Endpoint:** `POST /api/v2.0/EventService`

**Data Processing:**
- Automatically converts EventMessage objects to dictionary format
- Removes None values to optimize payload size
- Handles JSON serialization and HTTP transmission

### `publish_async(event_message, client)`

Publishes an event message asynchronously using an httpx.AsyncClient.

**Parameters:**
- `event_message` (EventMessage): Event message object to publish
- `client` (httpx.AsyncClient): Async HTTP client for the request

**Returns:**
- `str`: Raw response content from the API

**Example:**
```python
import asyncio
import httpx
from biosero.datamodels.events import EventMessage

async def publish_event_async():
    event = EventMessage(
        topic="equipment.maintenance",
        subjects=["robot-arm-1"],
        data={
            "maintenance_type": "scheduled",
            "duration": "02:00:00",
            "technician": "tech_007"
        }
    )
    
    event_client = EventClient(url="https://api.example.com")
    
    async with httpx.AsyncClient() as async_client:
        result = await event_client.publish_async(event, async_client)
        print(f"Async event published: {result}")

# Run async function
asyncio.run(publish_event_async())
```

**API Endpoint:** `POST /api/v2.0/EventService`

## Utility Methods

### `get_server_time()`

Retrieves the current server time for event timestamping.

**Returns:**
- `datetime`: Current server timestamp

**Example:**
```python
server_time = client.get_server_time()
print(f"Server time: {server_time}")

# Use for event timestamping
event.created_date_utc = server_time
```

### `remove_none_values(d)`

Helper method that removes None values from dictionaries before API transmission.

**Parameters:**
- `d` (dict): Dictionary to clean

**Returns:**
- `dict`: Dictionary with None values removed

**Example:**
```python
data = {"name": "sample", "value": None, "type": "biological"}
cleaned = client.remove_none_values(data)
# Result: {"name": "sample", "type": "biological"}
```

## Resource Management

### Automatic Cleanup
The EventClient implements automatic resource cleanup through the `__del__` method:

```python
client = EventClient(url="https://api.example.com")
# Client automatically cleans up HTTP connections when garbage collected
```

### Manual Resource Management
For explicit control over resource cleanup:

```python
client = EventClient(url="https://api.example.com")
try:
    # Use client
    client.publish_event(event)
finally:
    # Manual cleanup if needed
    if hasattr(client._http_client, 'close'):
        client._http_client.close()
```

## Error Handling

The Event Client implements robust error handling:

### HTTP Error Handling
- All methods call `response.raise_for_status()` to handle HTTP errors
- Network errors are propagated as requests/httpx exceptions
- Invalid parameters cause ValueError exceptions

### Example Error Handling
```python
try:
    result = client.publish_event(event_message)
except requests.exceptions.HTTPError as e:
    print(f"HTTP error publishing event: {e}")
except requests.exceptions.RequestException as e:
    print(f"Network error: {e}")
except ValueError as e:
    print(f"Invalid configuration: {e}")
```

## Event Message Structure

### Required Fields
EventMessage objects should contain:
- **topic**: Event category/type (e.g., "sample.processed")
- **subjects**: List of identifiers related to the event
- **data**: Dictionary containing event-specific information

### Optional Fields
- **tags**: List of classification tags
- **created_date_utc**: Timestamp (auto-generated if not provided)
- **source_trace_ids**: Correlation identifiers
- **organization_id**: Organization context
- **user_id**: User performing the action

### Example Event Types

#### Sample Processing Event
```python
event = EventMessage(
    topic="sample.processing.started",
    subjects=["sample-123", "batch-456"],
    data={
        "workflow": "DNA_Extraction",
        "operator": "lab_tech_1",
        "equipment": "robot-arm-2",
        "estimated_completion": "2023-10-15T14:30:00Z"
    },
    tags=["processing", "dna", "automated"]
)
```

#### Equipment Status Event
```python
event = EventMessage(
    topic="equipment.status.changed",
    subjects=["centrifuge-001"],
    data={
        "previous_status": "idle",
        "new_status": "running",
        "speed_rpm": 3000,
        "temperature": 4.0
    },
    tags=["equipment", "status", "centrifuge"]
)
```

#### Quality Control Event
```python
event = EventMessage(
    topic="quality.check.completed",
    subjects=["qc-batch-789"],
    data={
        "passed": True,
        "score": 98.5,
        "criteria": "contamination_check",
        "notes": "All samples passed contamination screening"
    },
    tags=["quality", "validation", "contamination"]
)
```

*This client provides essential event publishing capabilities for laboratory audit trails, monitoring, and workflow tracking in the Biosero ecosystem.*