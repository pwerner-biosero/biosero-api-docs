# Order Client

The `OrderClient` class provides a comprehensive interface for managing laboratory orders and workflows in the Biosero Data Services API. It handles order creation, status management, template operations, and workflow execution tracking.

## Overview

The Order Client is designed to interact with the Biosero Order Service, providing methods to:
- Create and manage laboratory orders
- Track order execution and status
- Manage order templates
- Handle order assignments and state persistence
- Query orders by various criteria (status, date, assignment)

## Class Definition

```python
class OrderClient(IOrderClient):
    def __init__(self, url: str = None, url_provider: callable = None, http_client: requests.Session = None):
        """
        Initialize the Order Client with connection configuration.
        
        Args:
            url (str, optional): Direct base URL for the API
            url_provider (callable, optional): Function that returns the base URL
            http_client (requests.Session, optional): Pre-configured HTTP client
            
        Raises:
            ValueError: If none of the required parameters are provided
        """
```

## Initialization Options

The OrderClient supports three different initialization patterns:

### Direct URL
```python
client = OrderClient(url="https://api.example.com")
```

### URL Provider Function
```python
def get_api_url():
    return "https://api.example.com"

client = OrderClient(url_provider=get_api_url)
```

### Pre-configured HTTP Client
```python
session = requests.Session()
session.base_url = "https://api.example.com"
client = OrderClient(http_client=session)
```

## Resource Management

### `dispose()`
Properly closes the HTTP client connection.

```python
client = OrderClient(url="https://api.example.com")
try:
    # Use client
    pass
finally:
    client.dispose()
```

### `close()` (Async)
Asynchronous method to close the HTTP client.

```python
await client.close()
```

## Order Management

### `create_order(order)`

Creates a new order in the system.

**Parameters:**
- `order` (Order): Order object containing all order details

**Returns:**
- `str`: JSON response containing order creation details

**Example:**
```python
from biosero.datamodels.ordering import Order
from biosero.datamodels.parameters import ParameterCollection

# Create order
order = Order(
    template_name="Sample Processing",
    parameters=ParameterCollection(),
    priority=1
)

client = OrderClient(url="https://api.example.com")
result = client.create_order(order)
print(f"Order created: {result}")
```

**API Endpoint:** `POST /api/v2.0/OrderService/CreateOrder`

### `get_order(order_id)`

Retrieves a specific order by its identifier.

**Parameters:**
- `order_id` (str): Unique identifier of the order

**Returns:**
- `Order`: Complete order object with all details

**Example:**
```python
order = client.get_order("order-123")
print(f"Order status: {order.status}")
print(f"Created: {order.created_date}")
```

**API Endpoint:** `GET /api/v2.0/OrderService/Order?orderId={order_id}`

### `update_order(order)`

Updates an existing order with new information.

**Parameters:**
- `order` (Order): Updated order object

**Example:**
```python
order = client.get_order("order-123")
order.priority = 5
client.update_order(order)
```

**API Endpoint:** `POST /api/v2.0/OrderService/UpdateOrder`

## Order Status Management

### `get_order_status(order_id)`

Retrieves the current status of an order.

**Parameters:**
- `order_id` (str): Unique identifier of the order

**Returns:**
- `OrderStatus`: Enum value representing the current status

**Example:**
```python
status = client.get_order_status("order-123")
print(f"Current status: {status.name}")

# Check specific status
if status == OrderStatus.EXECUTING:
    print("Order is currently executing")
```

**API Endpoint:** `GET /api/v2.0/OrderService/OrderStatus?orderId={order_id}`

### `update_order_status(order_id, status, details)`

Updates the status of an order with additional details.

**Parameters:**
- `order_id` (str): Unique identifier of the order
- `status` (OrderStatus): New status for the order
- `details` (str): Additional information about the status change

**Example:**
```python
from biosero.datamodels.ordering import OrderStatus

client.update_order_status(
    order_id="order-123",
    status=OrderStatus.COMPLETED,
    details="Processing completed successfully"
)
```

**API Endpoint:** `POST /api/v2.0/OrderService/UpdateOrderStatus?orderId={order_id}&status={status}`

## Order Queries

### `get_orders(created_on_or_before, limit, offset)`

Retrieves orders created on or before a specific date with pagination.

**Parameters:**
- `created_on_or_before` (datetime): Date threshold for order retrieval
- `limit` (int): Maximum number of orders to return
- `offset` (int): Number of orders to skip (for pagination)

**Returns:**
- `List[Order]`: List of order objects

**Example:**
```python
from datetime import datetime, timedelta

# Get orders from the last week
cutoff_date = datetime.now() - timedelta(days=7)
orders = client.get_orders(cutoff_date, limit=100, offset=0)

for order in orders:
    print(f"Order {order.id}: {order.status}")
```

**API Endpoint:** `GET /api/v2.0/OrderService/Orders?createdOnOrBefore={date}&limit={limit}&offset={offset}`

### `get_completed_orders(limit, offset)`

Retrieves orders that have completed execution.

**Parameters:**
- `limit` (int): Maximum number of orders to return
- `offset` (int): Number of orders to skip

**Returns:**
- `List[Order]`: List of completed orders

**Example:**
```python
completed = client.get_completed_orders(limit=50, offset=0)
print(f"Found {len(completed)} completed orders")
```

**API Endpoint:** `GET /api/v2.0/OrderService/CompletedOrders?limit={limit}&offset={offset}`

### `get_executing_orders(limit, offset)`

Retrieves orders that are currently executing.

**Parameters:**
- `limit` (int): Maximum number of orders to return
- `offset` (int): Number of orders to skip

**Returns:**
- `List[Order]`: List of executing orders

**Example:**
```python
executing = client.get_executing_orders(limit=50, offset=0)
for order in executing:
    print(f"Executing: {order.id} - {order.template_name}")
```

**API Endpoint:** `GET /api/v2.0/OrderService/ExecutingOrders?limit={limit}&offset={offset}`

### `get_unassigned_orders(limit, offset)`

Retrieves orders that haven't been assigned to any equipment or resource.

**Parameters:**
- `limit` (int): Maximum number of orders to return
- `offset` (int): Number of orders to skip

**Returns:**
- `List[Order]`: List of unassigned orders

**Example:**
```python
unassigned = client.get_unassigned_orders(limit=50, offset=0)
print(f"Found {len(unassigned)} unassigned orders")
```

**API Endpoint:** `GET /api/v2.0/OrderService/UnassignedOrders?limit={limit}&offset={offset}`

## Order Template Management

### `get_order_templates(limit, offset)`

Retrieves available order templates with pagination.

**Parameters:**
- `limit` (int): Maximum number of templates to return
- `offset` (int): Number of templates to skip

**Returns:**
- `List[OrderTemplate]`: List of order template objects

**Example:**
```python
templates = client.get_order_templates(limit=20, offset=0)
for template in templates:
    print(f"Template: {template.name}")
    print(f"Description: {template.description}")
```

**API Endpoint:** `GET /api/v2.0/OrderService/OrderTemplates?limit={limit}&offset={offset}`

### `register_order_template(template)`

Registers a new order template in the system.

**Parameters:**
- `template` (OrderTemplate): Template object to register

**Example:**
```python
from biosero.datamodels.ordering import OrderTemplate

template = OrderTemplate(
    name="New Sample Processing",
    description="Template for processing biological samples",
    parameters=ParameterCollection()
)

client.register_order_template(template)
print("Template registered successfully")
```

**API Endpoint:** `POST /api/v2.0/OrderService/RegisterOrderTemplate`

### `delete_order_template(template_name)`

Removes an order template from the system.

**Parameters:**
- `template_name` (str): Name of the template to delete

**Example:**
```python
client.delete_order_template("Old Processing Template")
```

**API Endpoint:** `DELETE /api/v2.0/OrderService/DeleteOrderTemplate?templateName={template_name}`

## Order Assignment and State

### `try_assign_order(order_id, identifier_to_assign_to)`

Attempts to assign an order to a specific resource or equipment.

**Parameters:**
- `order_id` (str): Unique identifier of the order
- `identifier_to_assign_to` (str): Identifier of the resource to assign to

**Returns:**
- `bool`: True if assignment was successful

**Example:**
```python
success = client.try_assign_order("order-123", "robot-arm-1")
if success:
    print("Order assigned successfully")
else:
    print("Assignment failed - resource may be busy")
```

**API Endpoint:** `POST /api/v2.0/OrderService/TryAssignOrder?orderId={order_id}&to={identifier}`

### `persist_state(order_id, state)`

Saves the current state of an order for persistence across system restarts.

**Parameters:**
- `order_id` (str): Unique identifier of the order
- `state` (str): State data to persist

**Example:**
```python
state_data = json.dumps({
    "current_step": 3,
    "processed_samples": 15,
    "remaining_time": "00:45:00"
})

client.persist_state("order-123", state_data)
```

**API Endpoint:** `POST /api/v2.0/OrderService/PersistState?orderId={order_id}`

### `set_output_parameters(order_id, parameters)`

Sets output parameters for an order after processing.

**Parameters:**
- `order_id` (str): Unique identifier of the order
- `parameters` (Dict[str, str]): Dictionary of output parameters

**Example:**
```python
output_params = {
    "total_samples_processed": "24",
    "processing_time": "02:15:30",
    "quality_score": "98.5"
}

client.set_output_parameters("order-123", output_params)
```

**API Endpoint:** `POST /api/v2.0/OrderService/SetOutputParameters?orderId={order_id}`

## Utility Methods

### `get_parameter_value(parameters, name)`

Helper method to extract a specific parameter value from a parameter list.

**Parameters:**
- `parameters`: List of parameter dictionaries
- `name` (str): Name of the parameter to find

**Returns:**
- Value of the parameter if found, otherwise None

**Example:**
```python
order = client.get_order("order-123")
volume = client.get_parameter_value(order.parameters, "Volume")
print(f"Order volume: {volume}")
```

## Error Handling

The Order Client implements comprehensive error handling:

### HTTP Error Handling
- All methods call `response.raise_for_status()` to handle HTTP errors
- Network errors are propagated as requests exceptions
- Invalid parameters cause ValueError exceptions

### Example Error Handling
```python
try:
    order = client.create_order(my_order)
except requests.exceptions.HTTPError as e:
    print(f"HTTP error: {e}")
except requests.exceptions.RequestException as e:
    print(f"Network error: {e}")
except ValueError as e:
    print(f"Invalid parameter: {e}")
```

## Best Practices

### 1. Resource Management
Always properly dispose of the client:

```python
client = OrderClient(url="https://api.example.com")
try:
    # Your operations
    pass
finally:
    client.dispose()
```

### 2. Pagination for Large Datasets
Use pagination when retrieving large numbers of orders:

```python
def get_all_completed_orders():
    all_orders = []
    offset = 0
    limit = 100
    
    while True:
        orders = client.get_completed_orders(limit, offset)
        if not orders:
            break
        all_orders.extend(orders)
        offset += limit
    
    return all_orders
```

### 3. Status Monitoring
Implement polling for order status updates:

```python
import time

def wait_for_order_completion(order_id, timeout=3600):
    start_time = time.time()
    
    while time.time() - start_time < timeout:
        status = client.get_order_status(order_id)
        
        if status == OrderStatus.COMPLETED:
            return True
        elif status == OrderStatus.FAILED:
            return False
            
        time.sleep(10)  # Check every 10 seconds
    
    return False  # Timeout
```

### 4. Template Management
Cache templates to avoid repeated API calls:

```python
class OrderManager:
    def __init__(self, client):
        self.client = client
        self._template_cache = {}
    
    def get_template(self, name):
        if name not in self._template_cache:
            templates = self.client.get_order_templates(100, 0)
            for template in templates:
                self._template_cache[template.name] = template
        
        return self._template_cache.get(name)
```

## Integration Examples

### Laboratory Workflow Management
```python
def process_sample_batch(sample_ids, template_name):
    client = OrderClient(url=API_BASE_URL)
    
    try:
        # Create orders for each sample
        order_ids = []
        for sample_id in sample_ids:
            order = Order(
                template_name=template_name,
                parameters={"sample_id": sample_id},
                priority=1
            )
            
            result = client.create_order(order)
            order_ids.append(result['order_id'])
        
        # Monitor execution
        for order_id in order_ids:
            print(f"Created order: {order_id}")
            
        return order_ids
        
    finally:
        client.dispose()
```

### Order Status Dashboard
```python
def get_order_dashboard():
    client = OrderClient(url=API_BASE_URL)
    
    try:
        dashboard = {
            'executing': len(client.get_executing_orders(1000, 0)),
            'unassigned': len(client.get_unassigned_orders(1000, 0)),
            'completed_today': []
        }
        
        # Get today's completed orders
        today = datetime.now().replace(hour=23, minute=59, second=59)
        completed = client.get_completed_orders(100, 0)
        
        dashboard['completed_today'] = [
            order for order in completed 
            if order.completed_date and order.completed_date.date() == today.date()
        ]
        
        return dashboard
        
    finally:
        client.dispose()
```

## Data Models

The Order Client works with several key data models:

- **Order**: Core order objects with parameters, status, and execution details
- **OrderTemplate**: Reusable order definitions
- **OrderStatus**: Enum representing order lifecycle states
- **OrderDto**: Data transfer object for API communication
- **ParameterCollection**: Collections of order parameters

## Thread Safety

The OrderClient uses a requests.Session internally. While generally thread-safe for read operations, create separate client instances for different threads when performing write operations.

## Performance Considerations

1. **Connection Reuse**: HTTP connections are reused through the internal session
2. **Pagination**: Use appropriate page sizes for large queries
3. **Template Caching**: Cache frequently used templates client-side
4. **Status Polling**: Use reasonable intervals for status checking
5. **Resource Cleanup**: Always dispose of clients to free resources

## API Versioning

The Order Client uses API version 2.0:
- **Base path**: `/api/v2.0/OrderService/`
- **Consistent endpoints**: All operations use the same API version

---

*This client provides comprehensive order management functionality and is essential for laboratory workflow automation in the Biosero ecosystem.*