# Location Changed Event

The `LocationChangedEvent` class represents a data model for capturing location change operations in laboratory automation systems. It provides structured recording of item movements between containers, equipment, and storage locations for comprehensive tracking and audit trails.

## Overview

The Location Changed Event is designed to capture:
- **Item Movement Tracking** - Which item moved and where
- **Location Hierarchy** - Parent container relationships
- **Spatial Coordinates** - Precise positioning within containers
- **Temporal Information** - When the location change occurred
- **Audit Compliance** - Complete movement history for regulatory requirements

## Class Definition

```python
@dataclass
class LocationChangedEvent:
    # Required Fields
    ParentIdentifier: str
    ItemIdentifier: str
    
    # Optional Fields
    Coordinates: Optional[str] = None
    TimeStamp: Optional[datetime] = None
    
    # System Field
    ClassName: str = "Biosero.DataModels.Events.LocationChangedEvent"
```

## Required Fields

### `ParentIdentifier: str`
Unique identifier of the parent container or location where the item is now positioned.

**Examples:**
```python
parent = "incubator-A1"  # Equipment location
parent = "plate-PCR-001"  # Microplate container
parent = "rack-sample-storage-B2"  # Storage rack
parent = "freezer-minus80-compartment-3"  # Storage compartment
parent = "workstation-liquid-handler"  # Work area
```

### `ItemIdentifier: str`
Unique identifier of the item that changed location.

**Examples:**
```python
item = "sample-tube-12345"  # Sample tube
item = "reagent-vial-buffer-A"  # Reagent container
item = "tip-box-1000uL-lot-456"  # Consumable item
item = "plate-assay-20231015-001"  # Assay plate
item = "standard-reference-material"  # Reference item
```

## Optional Fields

### `Coordinates: Optional[str] = None`
Specific position coordinates within the parent container.

**Coordinate Formats:**
```python
# Well positions in plates
coordinates = "A1"  # 96-well plate position
coordinates = "H12"  # Last well in 96-well plate
coordinates = "A01"  # Zero-padded format

# Rack positions
coordinates = "1,2"  # Row 1, Column 2
coordinates = "A1"  # Alpha-numeric position

# 3D coordinates
coordinates = "10.5,25.0,5.2"  # X,Y,Z in mm
coordinates = "shelf-2-position-5"  # Descriptive coordinates

# Equipment-specific positions
coordinates = "slot-1"  # Equipment slot
coordinates = "position-A"  # Named position
```

### `TimeStamp: Optional[datetime] = None`
Timestamp when the location change occurred.

**Examples:**
```python
from datetime import datetime

timestamp = datetime.utcnow()  # Current UTC time
timestamp = datetime(2023, 10, 15, 14, 30, 45)  # Specific time
timestamp = datetime.now()  # Local time
```

## Methods

### `to_dict()`
Converts the event object to a dictionary suitable for JSON serialization.

**Example:**
```python
event = LocationChangedEvent(
    ParentIdentifier="plate-001",
    ItemIdentifier="sample-123",
    Coordinates="A1",
    TimeStamp=datetime.utcnow()
)

event_dict = event.to_dict()
# Result: {
#     "ParentIdentifier": "plate-001",
#     "ItemIdentifier": "sample-123", 
#     "Coordinates": "A1",
#     "TimeStamp": "2023-10-15T14:30:45.123456",
#     "ClassName": "Biosero.DataModels.Events.LocationChangedEvent"
# }
```

### `__str__()`
Returns a human-readable string representation of the event.

**Example:**
```python
print(event)
# Output: LocationChangedEvent(ParentIdentifier=plate-001, ItemIdentifier=sample-123, Coordinates=A1)
```

## Usage Examples

### Basic Location Change
```python
from datetime import datetime
from biosero.datamodels.events import LocationChangedEvent

# Simple location change event
location_event = LocationChangedEvent(
    ParentIdentifier="storage-rack-A1",
    ItemIdentifier="sample-tube-001",
    Coordinates="position-5",
    TimeStamp=datetime.utcnow()
)
```

### Plate-to-Plate Transfer
```python
# Moving sample from source plate to destination plate
plate_transfer = LocationChangedEvent(
    ParentIdentifier="assay-plate-destination-001",
    ItemIdentifier="sample-compound-456",
    Coordinates="B3",
    TimeStamp=datetime.utcnow()
)
```

### Equipment Loading
```python
# Loading plate into incubator
equipment_loading = LocationChangedEvent(
    ParentIdentifier="incubator-37C-chamber-1",
    ItemIdentifier="cell-culture-plate-789",
    Coordinates="shelf-2-position-A",
    TimeStamp=datetime.utcnow()
)
```

### Storage Operations
```python
# Moving samples to long-term storage
storage_event = LocationChangedEvent(
    ParentIdentifier="freezer-minus80-rack-B5",
    ItemIdentifier="dna-sample-library-001",
    Coordinates="A1",
    TimeStamp=datetime.utcnow()
)
```

### Robotic Arm Operations
```python
# Robot moving item between workstations
robotic_transfer = LocationChangedEvent(
    ParentIdentifier="liquid-handler-deck-position-2",
    ItemIdentifier="reagent-plate-buffers",
    Coordinates="deck-slot-2",
    TimeStamp=datetime.utcnow()
)
```

## Integration with Event Publishing

### Publishing Location Events
```python
from biosero.datamodels.clients import EventClient
from biosero.datamodels.events import EventMessage

def publish_location_change(location_event: LocationChangedEvent):
    # Create event message
    event_message = EventMessage(
        topic="location.item.moved",
        subjects=[
            location_event.ItemIdentifier,
            location_event.ParentIdentifier
        ],
        data=location_event.to_dict(),
        tags=["location", "movement", "tracking"]
    )
    
    # Publish to event service
    event_client = EventClient(url="https://api.example.com")
    result = event_client.publish_event(event_message)
    return result
```

### Batch Location Tracking
```python
def track_batch_movements(movements: List[LocationChangedEvent]):
    event_client = EventClient(url="https://api.example.com")
    
    for movement in movements:
        event_message = EventMessage(
            topic="location.batch.movement",
            subjects=[movement.ItemIdentifier],
            data=movement.to_dict(),
            tags=["batch_movement", "location_tracking"]
        )
        
        try:
            event_client.publish_event(event_message)
        except Exception as e:
            print(f"Failed to publish location event: {e}")
```

## Location Tracking Applications

### Inventory Management
```python
class InventoryTracker:
    def __init__(self, event_client):
        self.event_client = event_client
        self.location_history = {}
    
    def track_item_movement(self, item_id: str, new_parent: str, coordinates: str = None):
        # Create location change event
        location_event = LocationChangedEvent(
            ParentIdentifier=new_parent,
            ItemIdentifier=item_id,
            Coordinates=coordinates,
            TimeStamp=datetime.utcnow()
        )
        
        # Update local tracking
        self.location_history[item_id] = {
            "current_location": new_parent,
            "coordinates": coordinates,
            "last_moved": location_event.TimeStamp
        }
        
        # Publish event
        self.publish_location_change(location_event)
        
        return location_event
    
    def get_item_location(self, item_id: str):
        return self.location_history.get(item_id)
```

### Workflow Tracking
```python
class WorkflowLocationTracker:
    def __init__(self, workflow_id: str):
        self.workflow_id = workflow_id
        self.movement_log = []
    
    def log_workflow_movement(self, item_id: str, station: str, position: str):
        location_event = LocationChangedEvent(
            ParentIdentifier=f"workflow-{self.workflow_id}-{station}",
            ItemIdentifier=item_id,
            Coordinates=position,
            TimeStamp=datetime.utcnow()
        )
        
        self.movement_log.append(location_event)
        return location_event
    
    def get_movement_history(self):
        return [event.to_dict() for event in self.movement_log]
```

### Equipment Monitoring
```python
class EquipmentLocationMonitor:
    def __init__(self):
        self.equipment_contents = {}
    
    def track_equipment_loading(self, equipment_id: str, item_id: str, position: str):
        location_event = LocationChangedEvent(
            ParentIdentifier=equipment_id,
            ItemIdentifier=item_id,
            Coordinates=position,
            TimeStamp=datetime.utcnow()
        )
        
        # Update equipment contents
        if equipment_id not in self.equipment_contents:
            self.equipment_contents[equipment_id] = {}
        
        self.equipment_contents[equipment_id][position] = {
            "item_id": item_id,
            "loaded_at": location_event.TimeStamp
        }
        
        return location_event
    
    def get_equipment_contents(self, equipment_id: str):
        return self.equipment_contents.get(equipment_id, {})
```

## Data Analysis and Reporting

### Location History Analysis
```python
def analyze_item_movements(location_events: List[LocationChangedEvent]):
    movement_analysis = {}
    
    for event in location_events:
        item_id = event.ItemIdentifier
        
        if item_id not in movement_analysis:
            movement_analysis[item_id] = {
                "total_movements": 0,
                "locations_visited": set(),
                "first_seen": event.TimeStamp,
                "last_movement": event.TimeStamp,
                "movement_history": []
            }
        
        analysis = movement_analysis[item_id]
        analysis["total_movements"] += 1
        analysis["locations_visited"].add(event.ParentIdentifier)
        
        if event.TimeStamp:
            if event.TimeStamp < analysis["first_seen"]:
                analysis["first_seen"] = event.TimeStamp
            if event.TimeStamp > analysis["last_movement"]:
                analysis["last_movement"] = event.TimeStamp
        
        analysis["movement_history"].append({
            "parent": event.ParentIdentifier,
            "coordinates": event.Coordinates,
            "timestamp": event.TimeStamp
        })
    
    return movement_analysis
```

### Equipment Utilization Tracking
```python
def track_equipment_utilization(location_events: List[LocationChangedEvent]):
    equipment_usage = {}
    
    for event in location_events:
        equipment = event.ParentIdentifier
        
        if equipment not in equipment_usage:
            equipment_usage[equipment] = {
                "items_processed": set(),
                "total_movements": 0,
                "positions_used": set()
            }
        
        usage = equipment_usage[equipment]
        usage["items_processed"].add(event.ItemIdentifier)
        usage["total_movements"] += 1
        
        if event.Coordinates:
            usage["positions_used"].add(event.Coordinates)
    
    # Convert sets to counts for reporting
    for equipment, usage in equipment_usage.items():
        usage["unique_items"] = len(usage["items_processed"])
        usage["unique_positions"] = len(usage["positions_used"])
        del usage["items_processed"]  # Remove set for JSON serialization
        del usage["positions_used"]
    
    return equipment_usage
```

## Best Practices

### 1. Consistent Identifier Naming
Use consistent naming conventions for identifiers:

```python
# Good - consistent format
parent_id = "equipment-incubator-001"
item_id = "sample-tube-20231015-001"

# Better - hierarchical naming
parent_id = "lab-A.equipment.incubator-001" 
item_id = "project-123.sample.tube-001"
```

### 2. Coordinate Standardization
Standardize coordinate formats within your system:

```python
# For 96-well plates - always use consistent format
coordinates = "A01"  # Zero-padded
# OR
coordinates = "A1"   # No padding (but be consistent)

# For custom equipment - use descriptive names
coordinates = "left-chamber-position-1"
```

### 3. Timestamp Precision
Always include timestamps for audit trails:

```python
# Good - always include timestamp
location_event = LocationChangedEvent(
    ParentIdentifier="storage-rack",
    ItemIdentifier="sample-001",
    TimeStamp=datetime.utcnow()  # UTC for consistency
)
```

### 4. Event Correlation
Use consistent identifiers to correlate related events:

```python
# Track complete transfer workflow
source_removal = LocationChangedEvent(
    ParentIdentifier="removed-from-source",  # Special identifier
    ItemIdentifier="sample-001",
    TimeStamp=datetime.utcnow()
)

destination_placement = LocationChangedEvent(
    ParentIdentifier="destination-plate-001",
    ItemIdentifier="sample-001",
    Coordinates="A1",
    TimeStamp=datetime.utcnow()
)
```

## Validation and Quality Control

### Data Validation
```python
def validate_location_event(event: LocationChangedEvent) -> List[str]:
    errors = []
    
    # Check required fields
    if not event.ParentIdentifier or not event.ParentIdentifier.strip():
        errors.append("ParentIdentifier is required and cannot be empty")
    
    if not event.ItemIdentifier or not event.ItemIdentifier.strip():
        errors.append("ItemIdentifier is required and cannot be empty")
    
    # Validate timestamp if provided
    if event.TimeStamp and event.TimeStamp > datetime.utcnow():
        errors.append("TimeStamp cannot be in the future")
    
    # Validate coordinate format (example for plate wells)
    if event.Coordinates:
        import re
        if not re.match(r'^[A-H]\d{1,2}$', event.Coordinates):
            # This is just an example - adjust regex for your coordinate system
            pass  # Could add coordinate format validation
    
    return errors
```

### Location Consistency Checking
```python
def check_location_consistency(events: List[LocationChangedEvent]) -> Dict[str, List[str]]:
    issues = {}
    item_locations = {}
    
    # Sort events by timestamp
    sorted_events = sorted(
        [e for e in events if e.TimeStamp],
        key=lambda x: x.TimeStamp
    )
    
    for event in sorted_events:
        item_id = event.ItemIdentifier
        
        # Check for simultaneous locations (item in multiple places)
        if item_id in item_locations:
            prev_location = item_locations[item_id]
            if prev_location != event.ParentIdentifier:
                if item_id not in issues:
                    issues[item_id] = []
                issues[item_id].append(
                    f"Item moved from {prev_location} to {event.ParentIdentifier} at {event.TimeStamp}"
                )
        
        item_locations[item_id] = event.ParentIdentifier
    
    return issues
```

## Integration Examples

### Laboratory Information Management System (LIMS)
```python
class LIMSLocationIntegration:
    def __init__(self, lims_client, event_client):
        self.lims_client = lims_client
        self.event_client = event_client
    
    def sync_location_change(self, location_event: LocationChangedEvent):
        # Update LIMS with new location
        try:
            self.lims_client.update_item_location(
                item_id=location_event.ItemIdentifier,
                new_location=location_event.ParentIdentifier,
                coordinates=location_event.Coordinates
            )
            
            # Publish success event
            self.event_client.publish_event(EventMessage(
                topic="lims.location.updated",
                subjects=[location_event.ItemIdentifier],
                data=location_event.to_dict()
            ))
            
        except Exception as e:
            # Publish error event
            self.event_client.publish_event(EventMessage(
                topic="lims.location.update_failed",
                subjects=[location_event.ItemIdentifier],
                data={"error": str(e), "event": location_event.to_dict()}
            ))
```

### Automated Inventory System
```python
class AutomatedInventory:
    def __init__(self):
        self.current_locations = {}
        self.location_history = []
    
    def process_location_change(self, event: LocationChangedEvent):
        # Update current location
        self.current_locations[event.ItemIdentifier] = {
            "parent": event.ParentIdentifier,
            "coordinates": event.Coordinates,
            "timestamp": event.TimeStamp
        }
        
        # Add to history
        self.location_history.append(event)
        
        # Trigger automated actions
        self._check_automated_triggers(event)
    
    def _check_automated_triggers(self, event: LocationChangedEvent):
        # Example: Trigger alerts for specific locations
        if "freezer" in event.ParentIdentifier.lower():
            self._alert_cold_storage(event)
        
        if "waste" in event.ParentIdentifier.lower():
            self._track_waste_disposal(event)
    
    def get_item_current_location(self, item_id: str):
        return self.current_locations.get(item_id)
```

## Performance Considerations

1. **Memory Efficiency**: Simple data structure with minimal overhead
2. **Serialization**: Efficient dictionary conversion for API transmission
3. **Indexing**: Use item and parent identifiers for fast lookups
4. **Batch Processing**: Group related location changes for efficient processing

## Compliance and Audit

The LocationChangedEvent provides audit trails for:
- **Regulatory Compliance**: Complete item movement history
- **Chain of Custody**: Unbroken tracking of item locations
- **Inventory Control**: Real-time location awareness
- **Process Validation**: Movement pattern analysis

---

*This data model ensures comprehensive tracking of item movements within laboratory systems, supporting both automated equipment integration and manual inventory management with full audit capabilities.*