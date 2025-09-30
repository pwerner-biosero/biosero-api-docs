# Module Status Update Event

The `ModuleStatusUpdateEvent` class represents a comprehensive data model for tracking the operational status and capabilities of laboratory automation modules. It provides structured reporting of module states, active operations, and system capabilities for real-time monitoring and orchestration.

## Overview

The Module Status Update Event is designed to capture:
- **Module Identification** - Unique identifiers and human-readable names
- **Operational Status** - Current state and availability
- **Active Operations** - Orders currently being processed
- **System Capabilities** - Available functions and simultaneous execution support
- **Equipment Associations** - Connected instruments and hardware
- **Visual Information** - Status images and indicators

## Class Definition

```python
@dataclass
class ModuleStatusUpdateEvent:
    # Required Fields
    Id: int
    ModuleIdentifier: str
    ModuleName: str
    Status: ModuleStatus
    
    # Optional Fields
    StatusDetails: Optional[str] = None
    Image: Optional[str] = None
    OrdersBeingProcessed: Optional[List[str]] = None
    AllowSimultaneousExecution: Optional[bool] = False
    InstrumentIdentifiers: Optional[List[str]] = None
    Capabilities: Optional[List[str]] = None
    
    # System Field
    ClassName: str = "Biosero.DataModels.Events.ModuleStatusUpdateEvent"
```

## Module Status Enumeration

The `ModuleStatus` enum defines the operational states of laboratory modules:

```python
class ModuleStatus(Enum):
    Ready = 0      # Module is available and ready for work
    Busy = 1       # Module is currently executing operations
    Error = 2      # Module has encountered an error condition
    Offline = 3    # Module is not available or disconnected
```

### Status Definitions

#### `Ready = 0`
Module is operational and available to accept new orders.
- All systems functioning normally
- No active operations in progress
- Ready to receive work assignments

#### `Busy = 1`
Module is currently executing one or more operations.
- Active processing in progress
- May accept additional work if simultaneous execution is enabled
- Normal operational state during workflow execution

#### `Error = 2`
Module has encountered an error and requires attention.
- System malfunction or operational failure
- Unable to process new orders
- May require manual intervention or reset

#### `Offline = 3`
Module is not available for operations.
- System powered down or disconnected
- Maintenance mode
- Communication failure

## Required Fields

### `Id: int`
Unique numeric identifier for the status update event.

**Example:**
```python
id = 12345  # Sequential event ID
id = int(time.time())  # Timestamp-based ID
```

### `ModuleIdentifier: str`
Unique string identifier for the module within the system.

**Examples:**
```python
module_id = "liquid-handler-001"
module_id = "incubator-37C-chamber-A"
module_id = "pipette-station-8channel"
module_id = "centrifuge-benchtop-main"
```

### `ModuleName: str`
Human-readable display name for the module.

**Examples:**
```python
module_name = "Hamilton STAR Liquid Handler"
module_name = "CO2 Incubator - Chamber A"
module_name = "8-Channel Pipette Station"
module_name = "Benchtop Centrifuge"
```

### `Status: ModuleStatus`
Current operational status of the module.

**Example:**
```python
status = ModuleStatus.Ready
status = ModuleStatus.Busy
status = ModuleStatus.Error
status = ModuleStatus.Offline
```

## Optional Fields

### `StatusDetails: Optional[str] = None`
Additional information about the current status.

**Examples:**
```python
# For Ready status
status_details = "All systems nominal, ready for operations"

# For Busy status
status_details = "Processing plate washing cycle - 45 seconds remaining"

# For Error status
status_details = "Pipette tip clog detected - manual intervention required"

# For Offline status
status_details = "Scheduled maintenance in progress"
```

### `Image: Optional[str] = None`
Base64-encoded image or URL to visual representation of module status.

**Examples:**
```python
# Base64 encoded image
image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="

# URL to status image
image = "https://api.example.com/module-images/liquid-handler-001/current-status.png"

# Local file path
image = "/system/images/module-status/ready-indicator.png"
```

### `OrdersBeingProcessed: Optional[List[str]] = None`
List of order identifiers currently being processed by the module.

**Examples:**
```python
# Single order
orders = ["order-12345"]

# Multiple concurrent orders
orders = ["order-12345", "order-12346", "order-12347"]

# No active orders
orders = []  # or None
```

### `AllowSimultaneousExecution: Optional[bool] = False`
Indicates whether the module can process multiple orders simultaneously.

**Examples:**
```python
# Module supports parallel processing
allow_simultaneous = True

# Module processes one order at a time
allow_simultaneous = False
```

### `InstrumentIdentifiers: Optional[List[str]] = None`
List of instrument identifiers associated with or controlled by this module.

**Examples:**
```python
# Single instrument
instruments = ["hamilton-star-serial-12345"]

# Multiple instruments
instruments = [
    "pipette-head-8channel", 
    "wash-station-main", 
    "tip-loading-station"
]

# Compound system
instruments = [
    "incubator-chamber-1",
    "incubator-chamber-2", 
    "co2-controller",
    "temperature-sensor-array"
]
```

### `Capabilities: Optional[List[str]] = None`
List of operational capabilities or functions supported by the module.

**Examples:**
```python
# Liquid handling capabilities
capabilities = [
    "aspirate", 
    "dispense", 
    "mix", 
    "serial_dilution",
    "plate_wash"
]

# Incubator capabilities
capabilities = [
    "temperature_control",
    "co2_control", 
    "humidity_control",
    "shaking",
    "door_control"
]

# Analysis capabilities
capabilities = [
    "absorbance_measurement",
    "fluorescence_detection",
    "luminescence_detection",
    "kinetic_analysis"
]
```

## Methods

### `to_dict()`
Converts the event object to a dictionary suitable for JSON serialization.

**Features:**
- Converts `ModuleStatus` enum to integer value
- Preserves all field values including None values
- Ready for JSON serialization

**Example:**
```python
event = ModuleStatusUpdateEvent(
    Id=12345,
    ModuleIdentifier="liquid-handler-001",
    ModuleName="Hamilton STAR",
    Status=ModuleStatus.Busy,
    OrdersBeingProcessed=["order-001", "order-002"]
)

event_dict = event.to_dict()
# Result: {
#     "Id": 12345,
#     "ModuleIdentifier": "liquid-handler-001",
#     "ModuleName": "Hamilton STAR",
#     "Status": 1,  # Enum converted to int
#     "OrdersBeingProcessed": ["order-001", "order-002"],
#     ...
# }
```

### `__str__()`
Returns a human-readable string representation of the event.

**Example:**
```python
print(event)
# Output: ModuleStatusUpdateEvent(Id=12345, ModuleIdentifier=liquid-handler-001, ModuleName=Hamilton STAR, Status=ModuleStatus.Busy, ...)
```

## Usage Examples

### Basic Status Update
```python
from biosero.datamodels.events import ModuleStatusUpdateEvent, ModuleStatus

# Simple status update
status_event = ModuleStatusUpdateEvent(
    Id=1001,
    ModuleIdentifier="pipette-station-001",
    ModuleName="8-Channel Pipette Station",
    Status=ModuleStatus.Ready,
    StatusDetails="All systems operational, ready for next task"
)
```

### Busy Module with Active Orders
```python
# Module processing multiple orders
busy_event = ModuleStatusUpdateEvent(
    Id=1002,
    ModuleIdentifier="liquid-handler-main",
    ModuleName="Hamilton STAR Liquid Handler",
    Status=ModuleStatus.Busy,
    StatusDetails="Processing serial dilutions - 3 minutes remaining",
    OrdersBeingProcessed=["order-12345", "order-12346"],
    AllowSimultaneousExecution=True,
    InstrumentIdentifiers=["hamilton-star-001", "wash-station-A"],
    Capabilities=["aspirate", "dispense", "mix", "wash"]
)
```

### Error Status with Details
```python
# Module in error state
error_event = ModuleStatusUpdateEvent(
    Id=1003,
    ModuleIdentifier="centrifuge-benchtop",
    ModuleName="Benchtop Centrifuge",
    Status=ModuleStatus.Error,
    StatusDetails="Rotor imbalance detected - check sample placement",
    OrdersBeingProcessed=["order-12347"],  # Order that caused error
    AllowSimultaneousExecution=False,
    Capabilities=["centrifuge", "rotor_detection", "speed_control"]
)
```

### Offline Module
```python
# Module offline for maintenance
offline_event = ModuleStatusUpdateEvent(
    Id=1004,
    ModuleIdentifier="incubator-co2-main",
    ModuleName="CO2 Incubator - Main Chamber",
    Status=ModuleStatus.Offline,
    StatusDetails="Scheduled maintenance - CO2 calibration in progress",
    AllowSimultaneousExecution=False,
    InstrumentIdentifiers=["co2-sensor-001", "temp-controller-A"],
    Capabilities=["temperature_control", "co2_control", "door_control"]
)
```

### Complex Multi-Instrument Module
```python
# Sophisticated analysis module
analysis_event = ModuleStatusUpdateEvent(
    Id=1005,
    ModuleIdentifier="microplate-reader-001",
    ModuleName="Multi-Mode Microplate Reader",
    Status=ModuleStatus.Busy,
    StatusDetails="Running kinetic assay - 15 timepoints remaining",
    Image="data:image/png;base64,iVBORw0KGgoAAAANSUhE...",
    OrdersBeingProcessed=["assay-order-789"],
    AllowSimultaneousExecution=False,
    InstrumentIdentifiers=[
        "optical-head-absorbance",
        "optical-head-fluorescence", 
        "plate-transport-system",
        "temperature-control-unit"
    ],
    Capabilities=[
        "absorbance_measurement",
        "fluorescence_detection",
        "luminescence_detection", 
        "kinetic_analysis",
        "endpoint_analysis",
        "temperature_control"
    ]
)
```

## Integration with Event Publishing

### Publishing Status Updates
```python
from biosero.datamodels.clients import EventClient
from biosero.datamodels.events import EventMessage

def publish_module_status(status_event: ModuleStatusUpdateEvent):
    # Create event message
    event_message = EventMessage(
        topic=f"module.status.{status_event.Status.name.lower()}",
        subjects=[status_event.ModuleIdentifier],
        data=status_event.to_dict(),
        tags=["module_status", "automation", status_event.Status.name.lower()]
    )
    
    # Publish to event service
    event_client = EventClient(url="https://api.example.com")
    result = event_client.publish_event(event_message)
    return result
```

### Status Change Monitoring
```python
def monitor_status_changes(previous_status: ModuleStatus, current_event: ModuleStatusUpdateEvent):
    """Monitor and react to status changes"""
    
    current_status = current_event.Status
    
    # Status change detection
    if previous_status != current_status:
        # Publish status change event
        change_event = EventMessage(
            topic="module.status.changed",
            subjects=[current_event.ModuleIdentifier],
            data={
                "previous_status": previous_status.name,
                "current_status": current_status.name,
                "module_details": current_event.to_dict()
            },
            tags=["status_change", "module_monitoring"]
        )
        
        # Handle specific transitions
        if current_status == ModuleStatus.Error:
            handle_module_error(current_event)
        elif current_status == ModuleStatus.Offline:
            handle_module_offline(current_event) 
        elif previous_status == ModuleStatus.Error and current_status == ModuleStatus.Ready:
            handle_error_recovery(current_event)

def handle_module_error(event: ModuleStatusUpdateEvent):
    """Handle module error conditions"""
    print(f"ERROR: Module {event.ModuleName} encountered error: {event.StatusDetails}")
    
    # Stop any active orders
    if event.OrdersBeingProcessed:
        for order_id in event.OrdersBeingProcessed:
            print(f"Stopping order {order_id} due to module error")

def handle_module_offline(event: ModuleStatusUpdateEvent):
    """Handle module going offline"""
    print(f"Module {event.ModuleName} is now offline: {event.StatusDetails}")

def handle_error_recovery(event: ModuleStatusUpdateEvent):
    """Handle module recovery from error state"""
    print(f"Module {event.ModuleName} has recovered and is ready for operations")
```

## System Integration Applications

### Module Dashboard
```python
class ModuleDashboard:
    def __init__(self):
        self.module_states = {}
        self.status_history = []
    
    def update_module_status(self, status_event: ModuleStatusUpdateEvent):
        module_id = status_event.ModuleIdentifier
        
        # Store current state
        self.module_states[module_id] = {
            "name": status_event.ModuleName,
            "status": status_event.Status,
            "details": status_event.StatusDetails,
            "active_orders": status_event.OrdersBeingProcessed or [],
            "capabilities": status_event.Capabilities or [],
            "last_update": status_event.Id
        }
        
        # Add to history
        self.status_history.append(status_event.to_dict())
        
        # Trim history to last 1000 events
        if len(self.status_history) > 1000:
            self.status_history = self.status_history[-1000:]
    
    def get_system_overview(self):
        """Get overview of all module statuses"""
        overview = {
            "total_modules": len(self.module_states),
            "ready": 0,
            "busy": 0,
            "error": 0,
            "offline": 0,
            "active_orders": set()
        }
        
        for module_state in self.module_states.values():
            status_name = module_state["status"].name.lower()
            overview[status_name] += 1
            
            # Collect all active orders
            for order in module_state["active_orders"]:
                overview["active_orders"].add(order)
        
        overview["active_orders"] = len(overview["active_orders"])
        return overview
    
    def get_available_modules(self, required_capability: str = None):
        """Get modules available for work"""
        available = []
        
        for module_id, state in self.module_states.items():
            if state["status"] == ModuleStatus.Ready:
                if not required_capability or required_capability in state["capabilities"]:
                    available.append({
                        "module_id": module_id,
                        "name": state["name"],
                        "capabilities": state["capabilities"]
                    })
        
        return available
```

### Workflow Orchestration
```python
class WorkflowOrchestrator:
    def __init__(self):
        self.module_manager = ModuleDashboard()
        self.pending_orders = []
    
    def assign_order_to_module(self, order_id: str, required_capabilities: List[str]):
        """Assign order to available module with required capabilities"""
        
        # Find available modules with required capabilities
        suitable_modules = []
        for module_id, state in self.module_manager.module_states.items():
            if state["status"] == ModuleStatus.Ready:
                module_caps = set(state.get("capabilities", []))
                required_caps = set(required_capabilities)
                
                if required_caps.issubset(module_caps):
                    suitable_modules.append(module_id)
        
        if suitable_modules:
            # Assign to first available module (could implement load balancing)
            selected_module = suitable_modules[0]
            print(f"Assigning order {order_id} to module {selected_module}")
            return selected_module
        else:
            # No suitable modules available
            self.pending_orders.append({
                "order_id": order_id,
                "required_capabilities": required_capabilities
            })
            print(f"Order {order_id} queued - no suitable modules available")
            return None
    
    def process_status_update(self, status_event: ModuleStatusUpdateEvent):
        """Process module status update and check for pending orders"""
        
        # Update module state
        self.module_manager.update_module_status(status_event)
        
        # If module became ready, check for pending orders
        if status_event.Status == ModuleStatus.Ready:
            self.check_pending_orders()
    
    def check_pending_orders(self):
        """Check if any pending orders can now be assigned"""
        remaining_orders = []
        
        for pending in self.pending_orders:
            assigned_module = self.assign_order_to_module(
                pending["order_id"], 
                pending["required_capabilities"]
            )
            
            if not assigned_module:
                remaining_orders.append(pending)
        
        self.pending_orders = remaining_orders
```

### Performance Analytics
```python
class ModulePerformanceAnalyzer:
    def __init__(self):
        self.status_events = []
        self.performance_metrics = {}
    
    def add_status_event(self, event: ModuleStatusUpdateEvent):
        self.status_events.append(event)
        self.update_performance_metrics(event)
    
    def update_performance_metrics(self, event: ModuleStatusUpdateEvent):
        module_id = event.ModuleIdentifier
        
        if module_id not in self.performance_metrics:
            self.performance_metrics[module_id] = {
                "total_updates": 0,
                "status_counts": {status.name: 0 for status in ModuleStatus},
                "error_events": [],
                "utilization_periods": []
            }
        
        metrics = self.performance_metrics[module_id]
        metrics["total_updates"] += 1
        metrics["status_counts"][event.Status.name] += 1
        
        if event.Status == ModuleStatus.Error:
            metrics["error_events"].append({
                "event_id": event.Id,
                "error_details": event.StatusDetails,
                "active_orders": event.OrdersBeingProcessed
            })
    
    def calculate_utilization(self, module_id: str, time_period_hours: int = 24):
        """Calculate module utilization over specified period"""
        if module_id not in self.performance_metrics:
            return 0.0
        
        metrics = self.performance_metrics[module_id]
        total_updates = metrics["total_updates"]
        busy_count = metrics["status_counts"]["Busy"]
        
        if total_updates == 0:
            return 0.0
        
        return (busy_count / total_updates) * 100
    
    def get_error_rate(self, module_id: str):
        """Calculate error rate for module"""
        if module_id not in self.performance_metrics:
            return 0.0
        
        metrics = self.performance_metrics[module_id]
        total_updates = metrics["total_updates"]
        error_count = metrics["status_counts"]["Error"]
        
        if total_updates == 0:
            return 0.0
        
        return (error_count / total_updates) * 100
```

## Best Practices

### 1. Consistent Status Reporting
Report status changes promptly and accurately:

```python
# Good - immediate status reporting
def start_operation(module_id: str, order_id: str):
    status_event = ModuleStatusUpdateEvent(
        Id=generate_event_id(),
        ModuleIdentifier=module_id,
        ModuleName=get_module_name(module_id),
        Status=ModuleStatus.Busy,
        StatusDetails=f"Starting operation for order {order_id}",
        OrdersBeingProcessed=[order_id]
    )
    publish_module_status(status_event)
```

### 2. Detailed Error Reporting
Provide comprehensive error information:

```python
# Good - detailed error reporting
def report_error(module_id: str, error_details: str, affected_orders: List[str]):
    error_event = ModuleStatusUpdateEvent(
        Id=generate_event_id(),
        ModuleIdentifier=module_id,
        ModuleName=get_module_name(module_id),
        Status=ModuleStatus.Error,
        StatusDetails=f"Error: {error_details} - Manual intervention required",
        OrdersBeingProcessed=affected_orders
    )
    publish_module_status(error_event)
```

### 3. Capability Documentation
Maintain accurate capability lists:

```python
# Good - comprehensive capability documentation
capabilities = [
    "aspirate_0.5uL_to_1000uL",
    "dispense_0.5uL_to_1000uL", 
    "mix_10_to_100_cycles",
    "serial_dilution_1:2_to_1:1000",
    "plate_wash_96_well",
    "tip_pickup_1000uL_filtered"
]
```

### 4. Performance Monitoring
Track module performance over time:

```python
# Good - continuous performance tracking
def track_module_performance():
    analyzer = ModulePerformanceAnalyzer()
    
    # Regular performance reports
    for module_id in get_all_module_ids():
        utilization = analyzer.calculate_utilization(module_id)
        error_rate = analyzer.get_error_rate(module_id)
        
        print(f"Module {module_id}: {utilization:.1f}% utilization, {error_rate:.2f}% error rate")
```

## Validation and Quality Control

### Data Validation
```python
def validate_status_event(event: ModuleStatusUpdateEvent) -> List[str]:
    errors = []
    
    # Check required fields
    if not event.ModuleIdentifier or not event.ModuleIdentifier.strip():
        errors.append("ModuleIdentifier is required and cannot be empty")
    
    if not event.ModuleName or not event.ModuleName.strip():
        errors.append("ModuleName is required and cannot be empty")
    
    if event.Id <= 0:
        errors.append("Id must be positive integer")
    
    # Validate status-specific requirements
    if event.Status == ModuleStatus.Busy and not event.OrdersBeingProcessed:
        errors.append("Busy modules should specify OrdersBeingProcessed")
    
    if event.Status == ModuleStatus.Error and not event.StatusDetails:
        errors.append("Error status requires StatusDetails")
    
    return errors
```

## Performance Considerations

1. **Event Frequency**: Balance update frequency with system load
2. **Data Size**: Keep capability lists and status details concise
3. **Serialization**: Efficient enum to integer conversion
4. **History Management**: Implement retention policies for status history

## Compliance and Audit

The ModuleStatusUpdateEvent provides audit trails for:
- **Equipment Validation**: Operational status documentation
- **Process Compliance**: Order execution tracking
- **System Monitoring**: Performance and availability metrics
- **Error Analysis**: Failure patterns and resolution tracking

---

*This data model ensures comprehensive monitoring of laboratory automation modules, supporting both real-time operations and long-term performance analysis with full audit capabilities.*