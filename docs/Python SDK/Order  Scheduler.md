# Order Scheduler

This document provides detailed information about the classes, functions, and modules used in the Python Workflow system.

## Core Classes

### OrderScheduler

The `OrderScheduler` class is the main interface for managing workflow execution and order scheduling in the Biosero Data Services system.

**Import Path:**
```python
from biosero.datamodels.restclients import OrderScheduler
```

**Constructor:**
```python
OrderScheduler(base_url: str, debug: demo = False)
```

**Parameters:**
- `base_url` (str): The base URL of the Data Services endpoint (e.g., "http://10.0.0.234:8105")
- `demo` (bool, optional): Enable demo mode. Demo mode has slightly enhanced visual logging in the console, however it      prevents certain async operations. Default is False.

**Key Methods:**

#### `initiate_workflow(workflow_template_name: str, wait: bool = False)`
Initiates a Master Order that acts as a parent order for all other orders in the workflow. This is an optional step.

**Parameters:**
- `workflow_template_name` (str): Name of the workflow template to use
- `wait` (bool, optional): Whether to wait for workflow initialization. Default is True.

**Returns:**
- `WorkflowOrder`: The initiated workflow order object

**Example:**
```python
scheduler = OrderScheduler("http://10.0.0.234:8105", True)
workflow_order = await scheduler.initiate_workflow(
    workflow_template_name="Cell Culture Workflow", 
    wait=False
)
workflow_id = workflow_order.identifier
```

#### `schedule_order(order: Order, wait: bool = True)`
Schedules an individual order within a workflow.

**Parameters:**
- `order` (Order): The order object to schedule
- `wait` (bool, optional): Whether to wait for order completion. Default is True.

**Returns:**
- `Order`: The  order object. This will allow you to extract the Order ID and use it as the Parent Identifier for all subesquent orders in the workflow.

**Example:**
```python
order = Order(
    templateName="Cell Prep",
    scheduledStartTime=datetime.now(),
    inputParameters=cell_prep_params,
    parentIdentifier=workflow_id
)

completed_order = await scheduler.schedule_order(order=order, wait=True)
```

#### `complete_workflow(workflow_order: WorkflowOrder)`
Marks a workflow as completed.

**Parameters:**
- `workflow_order` (WorkflowOrder): The workflow order to complete

**Example:**
```python
scheduler.complete_workflow(workflow_order)
```

#### `close()`
Closes the scheduler and releases resources. Should be called in a finally block.

**Example:**
```python
try:
    # ... workflow operations
finally:
    await scheduler.close()
```

### Order

The `Order` class is a dataclass that represents an individual task or step within a workflow. It contains comprehensive information about order execution, status, timing, and parameters.

**Import Path:**
```python
from biosero.datamodels.ordering import Order
```

**Dataclass Fields:**

#### Core Identification
- `identifier` (Optional[str]): Unique identifier for the order
- `parentIdentifier` (Optional[str]): ID of the parent workflow or order
- `sourceIdentifier` (Optional[str]): ID of the source that created this order
- `templateName` (Optional[str]): Name of the order template to execute

#### Scheduling and Execution
- `scheduledStartTime` (Optional[datetime]): When the order is scheduled to start
- `actualStartTime` (Optional[datetime]): When the order actually started execution
- `actualEndTime` (Optional[datetime]): When the order completed execution
- `estimatedDuration` (Optional[str]): Expected duration for order completion
- `schedulingStrategy` (Optional[SchedulingStrategy]): Strategy for scheduling this order
- `runAfterIdentifier` (Optional[str]): ID of order that must complete before this one

#### Status and State
- `status` (Optional[OrderStatus]): Current status of the order (Created, Running, Complete, etc.)
- `statusDetails` (Optional[str]): Additional details about the current status
- `state` (Optional[str]): Internal state information
- `validationErrors` (Optional[List[str]]): List of validation errors if any

#### Module Assignment
- `assignedTo` (Optional[str]): Module or resource assigned to execute this order
- `restrictToModuleIds` (Optional[str]): Comma-separated list of allowed module IDs
- `moduleRestrictionStrategy` (Optional[ModuleRestrictionStrategy]): How module restrictions are enforced

#### Parameters and Data
- `inputParameters` (Optional[List[Dict[str, Any]]]): Input parameters for the order
- `outputParameters` (Optional[List[Dict[str, Any]]]): Output parameters from execution
- `log` (Optional[str]): Execution log information

#### Metadata
- `creationTime` (Optional[datetime]): When the order was created
- `createdBy` (Optional[str]): User or system that created the order
- `notes` (Optional[str]): Additional notes or comments
- `priority` (Optional[OrderPriority]): Priority level (Elevated, Standard, Unknown)

**Key Methods:**

#### `get_input_parameter_value(key: str) -> Optional[Any]`
Retrieves the value of an input parameter by name.

**Parameters:**
- `key` (str): Name of the input parameter to retrieve

**Returns:**
- `Optional[Any]`: The parameter value, or None if not found

#### `get_output_parameter_value(key: str) -> Optional[Any]`
Retrieves the value of an output parameter by name.

**Parameters:**
- `key` (str): Name of the output parameter to retrieve

**Returns:**
- `Optional[Any]`: The parameter value, or None if not found

#### `from_dict(cls, data: dict) -> Order`
Class method to create an Order instance from a dictionary.

**Parameters:**
- `data` (dict): Dictionary containing order data with camelCase keys

**Returns:**
- `Order`: New Order instance populated from the dictionary

**Usage Example:**
```python
from datetime import datetime
from biosero.datamodels.ordering import Order
from biosero.datamodels.parameters import ParameterCollection, Parameter, ParameterValueType

# Create an order
order = Order(
    templateName="Cell Prep",
    scheduledStartTime=datetime.now(),
    inputParameters=[
        {"name": "Plate Count", "value": "4"},
        {"name": "Cell Type", "value": "HEK293"}
    ],
    parentIdentifier=workflow_id
)

# After execution, retrieve results
prepared_plates = order.get_output_parameter_value("Prepared Plates")
success = order.get_output_parameter_value("Success")
plate_count_input = order.get_input_parameter_value("Plate Count")
```

## Related Enums

### OrderStatus
Enumeration of possible order statuses:
- `Created` (1): Order has been created but not validated
- `Invalid` (2): Order failed validation
- `Validated` (3): Order passed validation
- `Scheduled` (4): Order is scheduled for execution
- `Running` (5): Order is currently executing
- `Paused` (6): Order execution is paused
- `Error` (7): Order encountered an error
- `Complete` (8): Order completed successfully
- `Canceled` (9): Order was canceled
- `Consolidated` (10): Order was consolidated with another
- `Unknown` (11): Status is unknown

### SchedulingStrategy
Enumeration of scheduling strategies:
- `ImmediateExecution` (1): Execute immediately when resources are available
- `FirstAvailableSlot` (2): Schedule for the first available time slot

### OrderPriority
Enumeration of order priorities:
- `Elevated` (-1): High priority order
- `Standard` (0): Normal priority order
- `Unknown` (1): Priority not specified

### ModuleRestrictionStrategy
Enumeration of module restriction strategies:
- `NoRestriction` (1): No module restrictions
- `UnlessBusy` (2): Restrict only if module is busy
- `UnlessError` (3): Restrict only if module has error
- `UnlessOffline` (4): Restrict only if module is offline
- `FullRestriction` (5): Full restriction regardless of module state

### ParameterCollection

A collection class for managing input and output parameters.

**Import Path:**
```python
from biosero.datamodels.parameters import ParameterCollection, Parameter, ParameterValueType
```

**Constructor:**
```python
ParameterCollection(parameters: List[Parameter])
```

**Example:**
```python
params = ParameterCollection([
    Parameter(name="Plate Count", value="4", valueType=ParameterValueType.STRING),
    Parameter(name="Cell Type", value="HEK293", valueType=ParameterValueType.STRING),
    Parameter(name="Cell Density", value="10000.0", valueType=ParameterValueType.STRING)
])
```

### Parameter

Represents a single parameter with name, value, and type information.

**Constructor:**
```python
Parameter(name: str, value: str, valueType: ParameterValueType)
```

**Parameters:**
- `name` (str): Parameter name
- `value` (str): Parameter value (always passed as string)
- `valueType` (ParameterValueType): Type enumeration for the parameter

### ParameterValueType

Enumeration of supported parameter value types.

**Values:**
- `ParameterValueType.STRING`: String values
- `ParameterValueType.INTEGER`: Integer values
- `ParameterValueType.FLOAT`: Floating-point values
- `ParameterValueType.BOOLEAN`: Boolean values

## Error Handling

### Common Exceptions

#### Workflow Initialization Errors
```python
try:
    workflow_order = await scheduler.initiate_workflow("Invalid Template")
except Exception as e:
    logger.error(f"Failed to initiate workflow: {e}")
```

#### Order Execution Errors
```python
if not order.get_output_parameter_value("Success"):
    raise Exception("Order execution failed")
```

#### Connection Errors
```python
try:
    scheduler = OrderScheduler("http://invalid-url:8105")
except Exception as e:
    logger.error(f"Failed to connect to Data Services: {e}")
```

## Configuration

### Data Services URL
The OrderScheduler requires a valid Data Services endpoint URL. This is typically configured in `config.ini`:

```ini
[DATA SERVICES]
url = http://10.0.0.234:8105
```

### Logging Configuration
The workflow uses rich logging for enhanced console output:

```python
import logging
from rich.logging import RichHandler

logging.basicConfig(
    level=logging.INFO,
    format="%(message)s",
    datefmt="[%X]",
    handlers=[RichHandler(rich_tracebacks=True)]
)
```

## Best Practices

### Resource Management
Always ensure the scheduler is properly closed:

```python
scheduler = OrderScheduler(url, debug=True)
try:
    # ... workflow operations
finally:
    await scheduler.close()
```

### Parameter Handling
Convert all parameter values to strings and use appropriate types:

```python
params = ParameterCollection([
    Parameter(name="Numeric Value", value=str(123.45), valueType=ParameterValueType.STRING),
    Parameter(name="JSON Data", value=json.dumps(data), valueType=ParameterValueType.STRING)
])
```

### Error Checking
Always check success parameters before proceeding:

```python
success = order.get_output_parameter_value("Success")
if not success:
    error_msg = order.get_output_parameter_value("Error Message")
    raise Exception(f"Order failed: {error_msg}")
```

## Examples

See the main `workflow.py` file for a complete example of using these APIs in a multi-step workflow.