# Query Client

The `QueryClient` class provides a comprehensive interface for querying data from the Biosero Data Services API. It handles HTTP communication, response parsing, and data model conversion for various resource types.

## Overview

The Query Client is designed to interact with the Biosero Data Services API, providing methods to:
- Retrieve and manage identity information
- Query location and container data
- Access event history
- Retrieve workflow process information
- Search materials and samples


## Context Management

The `QueryClient` supports Python's context manager protocol for automatic resource cleanup:

```python
with QueryClient("https://api.example.com") as client:
    identity = client.get_identity("item-123")
```

## Identity Management

### `get_identity(item_id)`

Retrieves the identity of an item by its identifier.

**Parameters:**
- `item_id` (str): The ID of the item to retrieve the identity for

**Returns:**
- `Identity`: The identity object with properties as a `ParameterCollection`, or `None` if not found (404 response)

**Example:**
```python
client = QueryClient("https://api.example.com")
identity = client.get_identity("sample-123")
if identity:
    print(f"Identity: {identity.name}")
    print(f"Properties: {identity.properties}")
```

**API Endpoint:** `GET /api/v2.0/QueryService/Identity?id={item_id}`

### `get_child_identities(parent_type_id, limit, offset)`

Retrieves child identities of a parent item with pagination support.

**Parameters:**
- `parent_type_id` (str): The ID of the parent item
- `limit` (int): Maximum number of child identities to retrieve
- `offset` (int): Number of child identities to skip (for pagination)

**Returns:**
- `List[Identity]`: List of child identity objects, each with properties as a `ParameterCollection`

**Example:**
```python
children = client.get_child_identities("parent-123", limit=50, offset=0)
for child in children:
    print(f"Child: {child.name}")
```

**API Endpoint:** `GET /api/v2.0/QueryService/ChildIdentities?parentTypeId={parent_type_id}&limit={limit}&offset={offset}`

### `remove_identity(item_id)`

Removes an identity from the system.

**Parameters:**
- `item_id` (str): The ID of the item to remove

**Returns:**
- `bool`: `True` if successful

**Example:**
```python
success = client.remove_identity("item-to-delete")
if success:
    print("Identity removed successfully")
```

**API Endpoint:** `DELETE /api/v3.0/identities/{item_id}`

### `get_parameter_value_from_identity(identity, parameter_name)`

Helper method to retrieve a specific parameter value from an Identity object.

**Parameters:**
- `identity` (Identity): The Identity object containing parameters
- `parameter_name` (str): Name of the parameter to retrieve

**Returns:**
- `Any`: The parameter value if found, otherwise `None`

**Example:**
```python
identity = client.get_identity("sample-123")
volume = client.get_parameter_value_from_identity(identity, "Volume")
print(f"Sample volume: {volume}")
```

## Location and Container Operations

### `get_location(item_id)`

Retrieves the location information for a specific item.

**Parameters:**
- `item_id` (str): The ID of the item to get location for

**Returns:**
- `Location`: Location object containing position information

**Example:**
```python
location = client.get_location("container-123")
print(f"Location: {location}")
```

**API Endpoint:** `GET /api/v2.0/QueryService/Location?itemId={item_id}`

### `get_items_at_location(location_id, limit, offset)`

Retrieves all items present at a specific location.

**Parameters:**
- `location_id` (str): The ID of the location to query
- `limit` (int): Maximum number of items to retrieve
- `offset` (int): Number of items to skip (for pagination)

**Returns:**
- `List[Identity]`: List of Identity objects representing items at the location

**Example:**
```python
items = client.get_items_at_location("freezer-A1", limit=100, offset=0)
for item in items:
    print(f"Item at location: {item.name}")
```

**API Endpoint:** `GET /api/v2.0/QueryService/ItemsAtLocation?locationId={location_id}&limit={limit}&offset={offset}`

### `get_materials_in_container(container_id)`

Retrieves all materials present in a specific container.

**Parameters:**
- `container_id` (str): The ID of the container to query

**Returns:**
- `List[MaterialInContainerSearchResult]`: List of materials in the container

**Example:**
```python
materials = client.get_materials_in_container("plate-456")
for material in materials:
    print(f"Material: {material.name}")
```

**API Endpoint:** `GET /api/v2.0/QueryService/MaterialsInContainer?containerId={container_id}`

### `get_net_volume(container_id)`

Retrieves the net volume measurement for a container.

**Parameters:**
- `container_id` (str): The ID of the container

**Returns:**
- `Volume`: Volume measurement object

**Example:**
```python
volume = client.get_net_volume("container-789")
print(f"Net volume: {volume.value} {volume.unit}")
```

**API Endpoint:** `GET /api/v2.0/QueryService/NetVolume?containerId={container_id}`

## Event Management

### `get_events(search_parameters, limit, offset)`

Retrieves events based on search criteria with pagination support.

**Parameters:**
- `search_parameters`: Object containing event search criteria
- `limit` (int): Maximum number of events to retrieve
- `offset` (int): Number of events to skip (for pagination)

**Returns:**
- `List[EventMessage]`: List of event message objects, or `None` if no events found (204 response)

**Example:**
```python
# Assuming you have a search parameters object
search_params = EventSearchParameters(
    topic="sample_transfer",
    start_date="2023-01-01",
    end_date="2023-12-31"
)

events = client.get_events(search_params, limit=100, offset=0)
if events:
    for event in events:
        print(f"Event: {event.topic} at {event.created_date_utc}")
```

**API Endpoint:** `POST /api/v2.0/QueryService/Events?limit={limit}&offset={offset}`

**Note:** This method automatically converts camelCase response fields to PascalCase to match the `EventMessage` data model expectations.

## Workflow Management

### `get_workflow_process(workflow_process_id)`

Retrieves a workflow process by its identifier.

**Parameters:**
- `workflow_process_id` (int): The ID of the workflow process

**Returns:**
- `WorkflowProcess`: The workflow process object

**Example:**
```python
workflow = client.get_workflow_process(12345)
print(f"Workflow: {workflow.name}")
print(f"Status: {workflow.status}")
```

**API Endpoint:** `GET /api/v3.0/orders/{workflow_process_id}/workflow-processes`

## Error Handling

The Query Client implements several error handling strategies:

1. **HTTP Status Codes**: Methods raise exceptions for HTTP errors using `response.raise_for_status()`
2. **404 Handling**: `get_identity()` returns `None` for 404 responses instead of raising an exception
3. **Empty Results**: `get_events()` returns `None` for 204 (No Content) responses

## Data Models

The Query Client works with several data models from the `biosero.datamodels` package:

- **Identity**: Represents an item's identity with properties as a `ParameterCollection`
- **EventMessage**: Represents system events with metadata
- **Location**: Represents spatial location information
- **Volume/Weight**: Represents measurement data
- **WorkflowProcess**: Represents workflow execution information
- **MaterialInContainerSearchResult**: Represents materials found in containers
- **Parameter/ParameterCollection**: Represents item properties and metadata

## Thread Safety

The `QueryClient` uses a `requests.Session` object internally. While `requests.Session` is generally thread-safe for reading operations, it's recommended to create separate client instances for different threads when performing write operations.

## Performance Considerations

1. **Session Reuse**: The client reuses HTTP connections through the internal session
2. **Pagination**: Use appropriate page sizes to balance memory usage and network efficiency
3. **Caching**: Consider implementing client-side caching for frequently accessed, static data
4. **Connection Pooling**: The underlying requests session provides connection pooling automatically
