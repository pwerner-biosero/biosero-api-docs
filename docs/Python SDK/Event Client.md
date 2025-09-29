# Event Client

The `EventClient` class provides a streamlined interface for publishing events to the Biosero Data Services API. It handles event message formatting, transmission, and supports both synchronous and asynchronous operations for laboratory event tracking and audit trails.

## Overview

The Event Client is designed to interact with the Biosero Event Service, providing methods to:
- Publish laboratory events for audit and tracking
- Support both synchronous and asynchronous event publishing
- Handle event message serialization and validation
- Manage HTTP client connections efficiently
- Provide server time synchronization

## Class Definition

```python
class EventClient:
    def __init__(self, url: Optional[str] = None, url_provider: Optional[Callable[[], str]] = None, http_client: Optional[requests.Session] = None):
        """
        Initialize the Event Client with connection configuration.
        
        Args:
            url (str, optional): Direct base URL for the API
            url_provider (callable, optional): Function that returns the base URL
            http_client (requests.Session, optional): Pre-configured HTTP client
            
        Raises:
            ValueError: If none of the required parameters are provided
        """
```

## Initialization Options

The EventClient supports three different initialization patterns:

### Direct URL
```python
client = EventClient(url="https://api.example.com")
```

### URL Provider Function
```python
def get_api_url():
    return "https://api.example.com"

client = EventClient(url_provider=get_api_url)
```

### Pre-configured HTTP Client
```python
session = requests.Session()
session.base_url = "https://api.example.com"
client = EventClient(http_client=session)
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

## Best Practices

### 1. Event Design
Structure events for maximum utility:

```python
# Good - descriptive topic with hierarchical structure
topic = "sample.processing.completed"

# Better - include action and outcome
topic = "sample.quality_control.passed"

# Best - specific and actionable
topic = "sample.dna_extraction.quality_approved"
```

### 2. Efficient Data Packaging
Include relevant context without excessive detail:

```python
# Good event data
data = {
    "operator": "lab_tech_1",
    "duration_minutes": 45,
    "status": "completed"
}

# Avoid excessive detail that should be in separate systems
# data = {"operator": "lab_tech_1", "operator_full_name": "John Smith", 
#         "operator_employee_id": "EMP001", ...}  # Too much detail
```

### 3. Asynchronous Publishing for High Throughput
Use async methods for high-volume event publishing:

```python
async def publish_batch_events(events):
    client = EventClient(url="https://api.example.com")
    
    async with httpx.AsyncClient() as async_client:
        tasks = [
            client.publish_async(event, async_client) 
            for event in events
        ]
        results = await asyncio.gather(*tasks)
    
    return results
```

### 4. Event Correlation
Use trace IDs to correlate related events:

```python
batch_id = "batch_123"

# Start event
start_event = EventMessage(
    topic="batch.processing.started",
    subjects=[batch_id],
    source_trace_ids=[batch_id],
    data={"sample_count": 24}
)

# Progress events with same trace ID
progress_event = EventMessage(
    topic="batch.processing.progress",
    subjects=[batch_id],
    source_trace_ids=[batch_id],
    data={"completed_samples": 12, "progress_percent": 50}
)
```

## Integration Examples

### Laboratory Workflow Event Tracking
```python
class WorkflowEventTracker:
    def __init__(self, api_url):
        self.event_client = EventClient(url=api_url)
    
    def track_sample_received(self, sample_id, operator):
        event = EventMessage(
            topic="sample.received",
            subjects=[sample_id],
            data={
                "operator": operator,
                "received_at": datetime.utcnow().isoformat(),
                "status": "pending_processing"
            },
            tags=["sample", "intake"]
        )
        return self.event_client.publish_event(event)
    
    def track_processing_completed(self, sample_id, results):
        event = EventMessage(
            topic="sample.processing.completed",
            subjects=[sample_id],
            data={
                "results": results,
                "quality_score": results.get("quality_score"),
                "processing_time": results.get("duration")
            },
            tags=["sample", "processing", "completed"]
        )
        return self.event_client.publish_event(event)
```

### Equipment Monitoring System
```python
class EquipmentMonitor:
    def __init__(self, api_url):
        self.event_client = EventClient(url=api_url)
    
    async def monitor_equipment_status(self, equipment_id, status_data):
        event = EventMessage(
            topic=f"equipment.{equipment_id}.status",
            subjects=[equipment_id],
            data=status_data,
            tags=["equipment", "monitoring", "status"]
        )
        
        async with httpx.AsyncClient() as client:
            await self.event_client.publish_async(event, client)
    
    def report_maintenance_event(self, equipment_id, maintenance_type):
        event = EventMessage(
            topic="equipment.maintenance.scheduled",
            subjects=[equipment_id],
            data={
                "maintenance_type": maintenance_type,
                "scheduled_date": datetime.utcnow().isoformat(),
                "priority": "routine"
            },
            tags=["equipment", "maintenance"]
        )
        return self.event_client.publish_event(event)
```

### Audit Trail Generation
```python
class AuditTracker:
    def __init__(self, api_url):
        self.event_client = EventClient(url=api_url)
    
    def log_user_action(self, user_id, action, resource_id, details=None):
        event = EventMessage(
            topic=f"user.action.{action}",
            subjects=[resource_id],
            data={
                "user_id": user_id,
                "action": action,
                "timestamp": datetime.utcnow().isoformat(),
                "details": details or {}
            },
            tags=["audit", "user_action", action]
        )
        return self.event_client.publish_event(event)
    
    def log_system_event(self, event_type, system_component, details):
        event = EventMessage(
            topic=f"system.{event_type}",
            subjects=[system_component],
            data={
                "component": system_component,
                "event_type": event_type,
                "details": details,
                "timestamp": datetime.utcnow().isoformat()
            },
            tags=["system", "audit", event_type]
        )
        return self.event_client.publish_event(event)
```

## HttpClientHelper Utility

The Event Client includes a helper class for HTTP client configuration:

### `HttpClientHelper.configure_http_client(url)`
Creates a configured requests.Session with appropriate headers.

### `HttpClientHelper.configure_http_client_with_provider(url_provider)`
Creates a configured session using a URL provider function.

**Example:**
```python
# Direct configuration
session = HttpClientHelper.configure_http_client("https://api.example.com")

# Provider-based configuration
def get_url():
    return "https://api.example.com"

session = HttpClientHelper.configure_http_client_with_provider(get_url)
```

## Performance Considerations

1. **Async for High Volume**: Use `publish_async()` for high-throughput scenarios
2. **Connection Reuse**: HTTP connections are reused through the internal session
3. **Payload Optimization**: None values are automatically removed to reduce size
4. **Batch Processing**: Group related events for efficient transmission
5. **Error Resilience**: Implement retry logic for critical events

## Thread Safety

The EventClient uses requests.Session internally, which is generally thread-safe. For high-concurrency scenarios, consider:
- Creating separate client instances per thread
- Using async methods with proper async context management
- Implementing connection pooling for very high throughput

## API Versioning

The Event Client uses API version 2.0:
- **Endpoint**: `/api/v2.0/EventService`
- **Consistent interface**: All event publishing uses the same endpoint

---

*This client provides essential event publishing capabilities for laboratory audit trails, monitoring, and workflow tracking in the Biosero ecosystem.*