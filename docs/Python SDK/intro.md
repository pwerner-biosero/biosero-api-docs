# Python SDK Overview

Welcome to the Biosero Data Services Python SDK documentation. This SDK provides a comprehensive Python interface for interacting with Biosero Data Services.

## Key Features

- **Pythonic Interface**: Clean, intuitive Python APIs following PEP 8 conventions
- **Async Support**: Full asyncio support for high-performance applications
- **Type Hints**: Complete type annotations for better IDE support and code quality
- **Context Managers**: Automatic resource cleanup with context manager support
- **Comprehensive Coverage**: Complete access to all Data Services endpoints
- **Event-Driven Architecture**: Rich event handling and publishing capabilities

## Getting Started

### Prerequisites

- **Python 3.8+** - The SDK requires Python 3.8 or later
- **pip** - Package installer for Python
- **Active Biosero License** - Contact Biosero for licensing information

### Obtaining the SDK

The Python SDK is distributed as a wheel (.whl) file directly from Biosero. To obtain the latest version:

1. Contact your Biosero representative or support team
2. Request the Python SDK wheel file for your version of Data Services
3. Download the provided `.whl` file to your local machine

### Installation

The Python SDK is provided by Biosero as a wheel (.whl) file. Contact your Biosero representative to obtain the latest version.

```bash
# Install the provided wheel file
pip install biosero_datamodels-1.0.0-py3-none-any.whl

# Or install with dependencies
pip install biosero_datamodels-1.0.0-py3-none-any.whl[all]

# For development installations
pip install -e biosero_datamodels-1.0.0-py3-none-any.whl
```

> **Note**: Replace `biosero_datamodels-1.0.0-py3-none-any.whl` with the actual filename provided by Biosero.

### Basic Usage

```python
from biosero.datamodels.clients import QueryClient

# Create a client instance
with QueryClient("http://localhost:8105/api/v2.0/") as client:
    # Query for an identity
    identity = client.get_identity("SAMPLE-123")
    if identity:
        print(f"Found identity: {identity.name}")
```

## Architecture

The Python SDK is built on:
- **Python 3.8+** - Modern Python features and performance
- **Requests** - Reliable HTTP communication
- **Pydantic** - Data validation and serialization
- **Context Managers** - Automatic resource management

## Client Libraries

- **[Query Client](./Query%20Client)** - Query and retrieve data from the system
- **[Order Client](./Order%20Client)** - Manage orders and workflows
- **[Order Scheduler](./Order%20Scheduler)** - Advanced workflow orchestration
- **Accessioning Client** - Identity management and registration *(coming soon)*
- **Event Client** - Event publishing and audit trails *(coming soon)*

## Data Models

- **Liquid Transfer Event** - Liquid handling operations *(coming soon)*
- **Location Changed Event** - Item movement tracking *(coming soon)*
- **Module Status Update Event** - Equipment status monitoring *(coming soon)*

## Support

For additional support and documentation, visit:
- [Biosero Support Portal](https://support.biosero.com)
- [Developer Documentation](https://docs.biosero.com)