# Accessioning Client

The `AccessioningClient` class provides a comprehensive interface for registering and managing laboratory identities in the Biosero Data Services API. It handles identity registration, removal, and batch operations for laboratory asset management.

## Overview

The Accessioning Client is designed to interact with the Biosero Accessioning Service, providing methods to:
- Register individual laboratory identities
- Remove identities from the system
- Perform batch registration of multiple identities
- Manage identity properties and metadata

## Class Definition


## Context Management

The `AccessioningClient` supports Python's context manager protocol for automatic resource cleanup:

```python
with AccessioningClient("https://api.example.com") as client:
    client.register(identity, event_context)
```

## Identity Management

### `register(identity, event_context)`

Registers a single laboratory identity in the system.

**Parameters:**
- `identity` (Identity): An Identity object containing the item information and properties
- `event_context` (Any): Event context object containing metadata about the registration

**Returns:**
- `dict`: JSON response from the API containing registration details

**Raises:**
- `TypeError`: If identity is not an instance of Identity
- `TypeError`: If identity.properties is not an instance of ParameterCollection
- `Exception`: If the API request fails (non-200 status code)

**Example:**
```python
from biosero.datamodels.resources import Identity
from biosero.datamodels.parameters import ParameterCollection, Parameter

# Create identity with parameters
identity = Identity(
    identifier="sample-123",
    name="Test Sample",
    typeId="sample",
    properties=ParameterCollection()
)

# Add parameters to the identity
identity.properties.append(Parameter(
    name="Volume",
    value="100",
    valueType="Double"
))

# Create event context
event_context = EventContext(
    ActorId ="lab_tech_1",
    Start=datetime.datetime.now().isoformat()
)

# Register the identity
with AccessioningClient("https://api.example.com") as client:
    result = client.register(identity, event_context)
    print(f"Registration successful: {result}")
```

**API Endpoint:** `POST /api/v2.0/AccessioningService/RegisterIdentity`

**Data Transformation:**
The method automatically converts:
- `Identity` objects to dictionary format
- `ParameterCollection` properties to a list of parameter dictionaries
- Each parameter includes name, value, and valueType fields

### `remove(identifier)`

Removes an identity from the system by its identifier.

**Parameters:**
- `identifier` (str): The unique identifier of the item to remove

**Raises:**
- `Exception`: If the API request fails (non-200 status code)

**Example:**
```python
with AccessioningClient("https://api.example.com") as client:
    client.remove("sample-123")
    print("Identity removed successfully")
```

**API Endpoint:** `DELETE /api/v2.0/AccessioningService/RemoveIdentity?Identifier={identifier}`

### `register_many(identities, event_context)`

Registers multiple laboratory identities in a single batch operation.

**Parameters:**
- `identities` (List[Identity]): A list of Identity objects to register
- `event_context` (Any): Event context object containing metadata about the batch registration

**Returns:**
- `dict`: JSON response from the API containing batch registration details

**Raises:**
- `TypeError`: If identities is not a list
- `TypeError`: If any item in identities is not an instance of Identity
- `TypeError`: If any identity.properties is not an instance of ParameterCollection
- `Exception`: If the API request fails (non-200 status code)

**Example:**
```python
# Create multiple identities
identities = []
for i in range(5):
    identity = Identity(
        identifier=f"sample-{i}",
        name=f"Test Sample {i}",
        typeId="sample",
        properties=ParameterCollection()
    )
    
    # Add volume parameter
    identity.properties.append(Parameter(
        name="Volume",
        value=str(100 + i * 10),
        valueType="Double"
    ))
    
    identities.append(identity)

# Create event context for batch operation
event_context = EventContext(
    ActorId ="lab_tech_1",
    Start=datetime.datetime.now().isoformat()
)


# Register all identities
with AccessioningClient("https://api.example.com") as client:
    result = client.register_many(identities, event_context)
    print(f"Batch registration successful: {result}")
```

**API Endpoint:** `POST /api/v2.0/AccessioningService/RegisterIdentities`

**Data Transformation:**
The method automatically converts:
- List of `Identity` objects to list of dictionaries
- Each identity's `ParameterCollection` to parameter dictionaries
- Event context to filtered dictionary (removes None values)

## Error Handling

The Accessioning Client implements comprehensive error handling:

### Type Validation
- Validates that `identity` parameters are `Identity` instances
- Ensures `identities` parameters are lists of `Identity` instances  
- Verifies that `identity.properties` are `ParameterCollection` instances

### HTTP Error Handling
- Raises exceptions for non-200 HTTP status codes
- Includes status code and reason in exception messages
- Automatically handles URL encoding for identifiers

### Example Error Handling
```python
try:
    with AccessioningClient("https://api.example.com") as client:
        result = client.register(identity, event_context)
except TypeError as e:
    print(f"Type error: {e}")
except Exception as e:
    print(f"API error: {e}")
```

## Data Requirements

### Identity Structure
Identities must be properly structured `Identity` objects with:
- **identifier**: Unique string identifier
- **name**: Human-readable name
- **typeId**: Type classification
- **properties**: `ParameterCollection` containing metadata

### Parameter Collection
Properties must be `ParameterCollection` instances containing:
- **Parameter objects** with name, value, and valueType
- Proper value types (String, Numeric, Boolean, etc.)

### Event Context
Event context objects should contain:
- User information
- Station/location data
- Timestamp information
- Any relevant metadata

## Best Practices

### 1. Use Context Managers
Always use the client within a context manager:

```python
with AccessioningClient("https://api.example.com") as client:
    # Your operations here
    pass
```

### 2. Batch Operations
For multiple identities, use `register_many()` instead of multiple `register()` calls:

```python
# Efficient - single API call
client.register_many(identities, event_context)

# Inefficient - multiple API calls
for identity in identities:
    client.register(identity, event_context)
```

### 3. Proper Error Handling
Implement comprehensive error handling:

```python
try:
    result = client.register(identity, event_context)
except TypeError as e:
    # Handle type validation errors
    print(f"Invalid data type: {e}")
except Exception as e:
    # Handle API errors
    print(f"Registration failed: {e}")
```

### 4. Parameter Management
Ensure parameters have proper types and values:

```python
# Good - explicit value type
parameter = Parameter(
    name="Temperature",
    value="25.5",
    valueType="Double"
)

# Better - use appropriate data types
parameter = Parameter(
    name="IsActive",
    value="true",
    valueType="Double"
)
```

## Data Models

The Accessioning Client works with several data models:

- **Identity**: Core identity objects with properties
- **ParameterCollection**: Collections of metadata parameters
- **Parameter**: Individual property/metadata items
- **Event Context**: Contextual information for operations

## Thread Safety

The `AccessioningClient` uses a `requests.Session` object internally. While generally thread-safe for reading operations, it's recommended to create separate client instances for different threads when performing write operations.

## Performance Considerations

1. **Batch Operations**: Use `register_many()` for bulk operations to reduce network overhead
2. **Session Reuse**: The client reuses HTTP connections through the internal session
3. **Data Validation**: Type checking occurs before API calls to catch errors early
4. **Memory Management**: Use context managers to ensure proper resource cleanup

## Integration Examples

### Laboratory Sample Registration
```python
def register_sample_batch(sample_data, user_id):
    identities = []
    
    for sample in sample_data:
        identity = Identity(
            identifier=sample['barcode'],
            name=sample['name'],
            typeId='sample',
            properties=ParameterCollection()
        )
        
        # Add sample properties
        for prop_name, prop_value in sample['properties'].items():
            identity.properties.append(Parameter(
                name=prop_name,
                value=str(prop_value),
                valueType='String'
            ))
        
        identities.append(identity)
    
    # Register batch
    event_context = EventContext(ActorId=user_id, Start=datetime.now())
    
    with AccessioningClient(API_BASE_URL) as client:
        return client.register_many(identities, event_context)
```

### Equipment Registration
```python
def register_equipment(equipment_info):
    identity = Identity(
        identifier=equipment_info['serial_number'],
        name=equipment_info['name'],
        typeId='equipment',
        properties=ParameterCollection()
    )
    
    # Add equipment-specific parameters
    identity.properties.append(Parameter(
        name="Manufacturer",
        value=equipment_info['manufacturer'],
        valueType="String"
    ))
    
    identity.properties.append(Parameter(
        name="Model",
        value=equipment_info['model'],
        valueType="String"
    ))
    
    event_context = EventContext(
        ActorId="system",
        Start=datetime.datetime.now().isoformat()
    )
    
    with AccessioningClient(API_BASE_URL) as client:
        return client.register(identity, event_context)
```

## API Versioning

The Accessioning Client currently uses API version 2.0:
- **Registration endpoints**: `/api/v2.0/AccessioningService/`
- **Future compatibility**: Designed to support version updates

---

*This client provides essential functionality for laboratory identity management and is a core component of the Biosero Data Services ecosystem.*