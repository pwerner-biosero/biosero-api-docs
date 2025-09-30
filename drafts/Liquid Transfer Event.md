# Liquid Transfer Event

The `LiquidTransferEvent` class represents a comprehensive data model for capturing detailed information about liquid transfer operations in laboratory automation systems. It provides structured recording of transfer parameters, equipment details, and execution results for audit trails and process optimization.

## Overview

The Liquid Transfer Event is designed to capture:
- **Transfer Details** - Source, destination, and volume information
- **Equipment Tracking** - Device, pipette, and tip information
- **Process Parameters** - Transfer techniques and liquid properties
- **Quality Assurance** - Error tracking and validation data
- **Audit Information** - Operator details and timestamps

## Class Definition

```python
@dataclass
class LiquidTransferEvent:
    # Required Fields
    SourceIdentifier: str
    DestinationIdentifier: str
    ActualTransferVolume: Volume
    TimeStamp: datetime
    
    # Optional Fields with defaults
    TransferError: Optional[bool] = False
    TransferErrorDescription: Optional[str] = None
    # ... additional optional fields
```

## Required Fields

### Core Transfer Information

#### `SourceIdentifier: str`
Unique identifier of the source container or location.

**Example:**
```python
source = "plate-A1-well-01"  # Specific well location
source = "reservoir-buffer-01"  # Reagent reservoir
source = "tube-sample-123"  # Sample tube
```

#### `DestinationIdentifier: str`
Unique identifier of the destination container or location.

**Example:**
```python
destination = "plate-B2-well-05"  # Target well
destination = "reaction-tube-456"  # Reaction vessel
destination = "waste-container-01"  # Waste disposal
```

#### `ActualTransferVolume: Volume`
The actual volume that was transferred, measured by the system.

**Example:**
```python
from biosero.datamodels.measurement import Volume

actual_volume = Volume(value=100.5, unit=VolumeUnit.uL)
```

#### `TimeStamp: datetime`
Timestamp when the transfer was executed.

**Example:**
```python
from datetime import datetime

timestamp = datetime.utcnow()  # Current UTC time
timestamp = datetime(2023, 10, 15, 14, 30, 45)  # Specific time
```

## Optional Fields

### Error Tracking

#### `TransferError: Optional[bool] = False`
Indicates whether an error occurred during the transfer.

#### `TransferErrorDescription: Optional[str] = None`
Detailed description of any transfer error that occurred.

**Example:**
```python
transfer_error = True
error_description = "Insufficient volume in source container"
```

### Transfer Parameters

#### `TransferType: Optional[str] = None`
Type or category of the transfer operation.

**Example:**
```python
transfer_type = "aspirate_dispense"  # Standard pipetting
transfer_type = "positive_displacement"  # Specialized technique
transfer_type = "acoustic_droplet"  # Acoustic liquid handling
```

#### `IntendedTransferVolume: Optional[Volume] = None`
The volume that was intended to be transferred (vs. actual).

**Example:**
```python
intended_volume = Volume(value=100.0, unit=VolumeUnit.uL)
actual_volume = Volume(value=99.8, unit=VolumeUnit.uL)  # Slight variance
```

### Equipment Information

#### `TransferDeviceIdentifier: Optional[str] = None`
Identifier of the device that performed the transfer.

**Example:**
```python
device_id = "liquid-handler-01"
device_id = "pipette-robot-arm-2"
device_id = "acoustic-dispenser-main"
```

#### `PipetteMandrelIdentifier: Optional[str] = None`
Identifier of the specific mandrel used on the pipette.

**Example:**
```python
mandrel_id = "mandrel-8ch-1000uL"
mandrel_id = "single-channel-mandrel-01"
```

#### `PipetteTipTypeIdentifier: Optional[str] = None`
Type or model of pipette tip used.

**Example:**
```python
tip_type = "1000uL-filtered-tips"
tip_type = "low-retention-200uL"
tip_type = "conductive-tips-10uL"
```

#### `PipetteTipLocationInBox: Optional[str] = None`
Specific location within the tip box where the tip was located.

**Example:**
```python
tip_location = "A1"  # Row A, Column 1
tip_location = "H12"  # Last position in 96-tip box
```

#### `PipetteTipBoxIdentifier: Optional[str] = None`
Identifier of the tip box or lot number.

**Example:**
```python
tip_box = "tip-box-lot-TB20231015"
tip_box = "filtered-tips-box-001"
```

### Process Details

#### `OperatorIdentifier: Optional[str] = None`
Identifier of the operator (manual transfer) or run setup person (automated).

**Example:**
```python
operator = "lab_tech_001"  # Manual operation
operator = "automation_setup_user_42"  # Automated setup
```

#### `PipetteTechnique: Optional[str] = None`
Additional information about how the transfer was performed.

**Example:**
```python
technique = "slow_speed_aspirate,bottom_offset_1mm"
technique = "pre_wet_tip,follow_liquid_surface"
technique = "reverse_pipetting,extra_volume_20uL"
```

### Liquid Properties

#### `LiquidTypeSpecified: Optional[str] = None`
Type of liquid as defined for the dispenser.

**Example:**
```python
liquid_type = "aqueous_buffer"
liquid_type = "organic_solvent"
liquid_type = "cell_culture_media"
```

#### `LiquidTypeCalibrationUsed: Optional[str] = None`
Calibration profile used by the dispenser for this liquid type.

**Example:**
```python
calibration = "water_calibration_v2.1"
calibration = "viscous_liquid_profile"
calibration = "low_surface_tension_cal"
```

#### `DropSize: Optional[Volume] = None`
Size of individual drops for multi-drop dispensing (e.g., acoustic dispensers).

**Example:**
```python
drop_size = Volume(value=2.5, unit="nL")  # Acoustic dispenser
drop_size = Volume(value=0.1, unit="µL")  # Micro-dispenser
```

## Methods

### `__post_init__()`
Validates required fields after object initialization.

**Validation:**
- Ensures `ActualTransferVolume` is a `Volume` instance
- Ensures `TimeStamp` is a `datetime` instance

**Example:**
```python
# This will raise TypeError
event = LiquidTransferEvent(
    SourceIdentifier="source-01",
    DestinationIdentifier="dest-01", 
    ActualTransferVolume=Volume(value=0.1, unit=),  # Should be Volume object
    TimeStamp=datetime.utcnow()
)
```

### `to_dict()`
Converts the event object to a dictionary suitable for JSON serialization.

**Features:**
- Converts `Volume` objects to dictionaries
- Formats timestamps in ISO format with milliseconds
- Handles None values appropriately

**Example:**
```python
event = LiquidTransferEvent(
    SourceIdentifier="source-01",
    DestinationIdentifier="dest-01",
    ActualTransferVolume=Volume(100.0, "µL"),
    TimeStamp=datetime.utcnow()
)

event_dict = event.to_dict()
# Result: {"SourceIdentifier": "source-01", "ActualTransferVolume": {"value": 100.0, "unit": "µL"}, ...}
```

### `__str__()`
Returns a human-readable string representation of the event.

**Example:**
```python
print(event)
# Output: LiquidTransferEvent(SourceIdentifier=source-01, DestinationIdentifier=dest-01, ...)
```

## Usage Examples

### Basic Liquid Transfer
```python
from datetime import datetime
from biosero.datamodels.measurement import Volume
from biosero.datamodels.events import LiquidTransferEvent

# Simple transfer event
transfer_event = LiquidTransferEvent(
    SourceIdentifier="reagent-reservoir-A1",
    DestinationIdentifier="plate-001-well-A01",
    ActualTransferVolume=Volume(value=50.0, unit="µL"),
    TimeStamp=datetime.utcnow(),
    TransferType="aspirate_dispense",
    TransferDeviceIdentifier="liquid-handler-main"
)
```

### Detailed Pipetting Operation
```python
# Comprehensive transfer with full equipment tracking
detailed_transfer = LiquidTransferEvent(
    SourceIdentifier="sample-tube-123",
    DestinationIdentifier="pcr-plate-001-A01",
    ActualTransferVolume=Volume(value=25.2, unit="µL"),
    IntendedTransferVolume=Volume(value=25.0, unit="µL"),
    TimeStamp=datetime.utcnow(),
    
    # Equipment details
    TransferDeviceIdentifier="hamilton-star-01",
    PipetteMandrelIdentifier="8ch-50uL-mandrel",
    PipetteTipTypeIdentifier="filtered-tips-50uL",
    PipetteTipLocationInBox="A1",
    PipetteTipBoxIdentifier="tips-lot-20231015",
    
    # Process parameters
    TransferType="standard_pipetting",
    PipetteTechnique="pre_wet,slow_aspirate,bottom_offset_2mm",
    OperatorIdentifier="lab_tech_smith",
    
    # Liquid properties
    LiquidTypeSpecified="biological_sample",
    LiquidTypeCalibrationUsed="viscous_calibration_v1.2"
)
```

### Error Tracking Example
```python
# Transfer with error
error_transfer = LiquidTransferEvent(
    SourceIdentifier="empty-well-B05",
    DestinationIdentifier="destination-well-C03",
    ActualTransferVolume=Volume(value=0.0, unit="µL"),
    TimeStamp=datetime.utcnow(),
    
    # Error information
    TransferError=True,
    TransferErrorDescription="Insufficient liquid in source well - aspiration failed",
    IntendedTransferVolume=Volume(value=100.0, unit="µL"),
    TransferDeviceIdentifier="pipette-station-02"
)
```

### Acoustic Dispenser Operation
```python
# High-precision acoustic dispensing
acoustic_transfer = LiquidTransferEvent(
    SourceIdentifier="compound-library-well-A01",
    DestinationIdentifier="assay-plate-384-A01", 
    ActualTransferVolume=Volume(value=100.0, unit="nL"),
    TimeStamp=datetime.utcnow(),
    
    # Acoustic-specific details
    TransferType="acoustic_droplet_ejection",
    TransferDeviceIdentifier="echo-525-main",
    DropSize=Volume(value=2.5, unit="nL"),
    LiquidTypeSpecified="dmso_compound",
    LiquidTypeCalibrationUsed="echo_dmso_calibration"
)
```

## Integration with Event Publishing

### Publishing Transfer Events
```python
from biosero.datamodels.clients import EventClient
from biosero.datamodels.events import EventMessage

def publish_transfer_event(transfer_event: LiquidTransferEvent):
    # Create event message
    event_message = EventMessage(
        topic="liquid.transfer.completed",
        subjects=[
            transfer_event.SourceIdentifier,
            transfer_event.DestinationIdentifier
        ],
        data=transfer_event.to_dict(),
        tags=["liquid_handling", "transfer", "automation"]
    )
    
    # Publish to event service
    event_client = EventClient(url="https://api.example.com")
    result = event_client.publish_event(event_message)
    return result
```

### Batch Transfer Tracking
```python
def track_batch_transfers(transfers: List[LiquidTransferEvent]):
    event_client = EventClient(url="https://api.example.com")
    
    for transfer in transfers:
        # Create individual transfer event
        event_message = EventMessage(
            topic="liquid.transfer.executed",
            subjects=[transfer.SourceIdentifier, transfer.DestinationIdentifier],
            data=transfer.to_dict(),
            tags=["batch_transfer", "liquid_handling"]
        )
        
        try:
            event_client.publish_event(event_message)
        except Exception as e:
            print(f"Failed to publish transfer event: {e}")
```

## Data Analysis and Reporting

### Transfer Volume Analysis
```python
def analyze_transfer_accuracy(transfers: List[LiquidTransferEvent]):
    accuracy_data = []
    
    for transfer in transfers:
        if transfer.IntendedTransferVolume and transfer.ActualTransferVolume:
            intended = transfer.IntendedTransferVolume.value
            actual = transfer.ActualTransferVolume.value
            
            accuracy = (actual / intended) * 100 if intended > 0 else 0
            variance = abs(actual - intended)
            
            accuracy_data.append({
                "transfer_id": f"{transfer.SourceIdentifier}->{transfer.DestinationIdentifier}",
                "intended_volume": intended,
                "actual_volume": actual,
                "accuracy_percent": accuracy,
                "variance": variance,
                "device": transfer.TransferDeviceIdentifier,
                "timestamp": transfer.TimeStamp
            })
    
    return accuracy_data
```

### Equipment Performance Monitoring
```python
def monitor_equipment_performance(transfers: List[LiquidTransferEvent]):
    device_stats = {}
    
    for transfer in transfers:
        device = transfer.TransferDeviceIdentifier
        if device not in device_stats:
            device_stats[device] = {
                "total_transfers": 0,
                "error_count": 0,
                "total_volume": 0.0
            }
        
        device_stats[device]["total_transfers"] += 1
        if transfer.TransferError:
            device_stats[device]["error_count"] += 1
        device_stats[device]["total_volume"] += transfer.ActualTransferVolume.value
    
    # Calculate error rates
    for device, stats in device_stats.items():
        stats["error_rate"] = (stats["error_count"] / stats["total_transfers"]) * 100
    
    return device_stats
```

## Best Practices

### 1. Complete Equipment Tracking
Always capture equipment details for troubleshooting:

```python
# Good - comprehensive equipment tracking
transfer = LiquidTransferEvent(
    # ... required fields ...
    TransferDeviceIdentifier="hamilton-star-01",
    PipetteMandrelIdentifier="8ch-1000uL", 
    PipetteTipTypeIdentifier="filtered-tips-1000uL",
    PipetteTipBoxIdentifier="tips-lot-20231015"
)
```

### 2. Error Documentation
Provide detailed error descriptions:

```python
# Good error tracking
if transfer_failed:
    transfer.TransferError = True
    transfer.TransferErrorDescription = "Clot detected during aspiration - volume insufficient"
```

### 3. Technique Documentation
Record specific pipetting techniques:

```python
# Document special techniques
transfer.PipetteTechnique = "reverse_pipetting,extra_volume_50uL,slow_dispense_speed"
```

### 4. Calibration Tracking
Track calibration usage for compliance:

```python
# Track calibrations used
transfer.LiquidTypeCalibrationUsed = "aqueous_buffer_cal_v2.3_validated_20231001"
```

## Validation and Quality Control

### Data Validation
```python
def validate_transfer_event(transfer: LiquidTransferEvent) -> List[str]:
    errors = []
    
    # Check volume consistency
    if transfer.IntendedTransferVolume and transfer.ActualTransferVolume:
        variance = abs(transfer.IntendedTransferVolume.value - transfer.ActualTransferVolume.value)
        if variance > (transfer.IntendedTransferVolume.value * 0.1):  # 10% tolerance
            errors.append("Volume variance exceeds 10% tolerance")
    
    # Check for missing operator in manual operations
    if transfer.TransferType == "manual" and not transfer.OperatorIdentifier:
        errors.append("Manual transfer missing operator identifier")
    
    # Validate timestamp
    if transfer.TimeStamp > datetime.utcnow():
        errors.append("Transfer timestamp is in the future")
    
    return errors
```

## Performance Considerations

1. **Memory Efficiency**: Use appropriate Volume units to avoid precision loss
2. **Serialization**: The `to_dict()` method handles complex object serialization
3. **Validation**: Post-init validation catches errors early
4. **String Representation**: Efficient string formatting for logging

## Compliance and Audit

The LiquidTransferEvent provides comprehensive audit trails for:
- **Regulatory Compliance**: Complete transfer documentation
- **Quality Control**: Volume accuracy tracking
- **Equipment Validation**: Device and calibration tracking
- **Process Optimization**: Performance analysis and improvement

---

*This data model ensures comprehensive tracking of liquid transfer operations, supporting both automated and manual laboratory processes with full audit capabilities.*