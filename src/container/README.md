# Container Module

This is a simple dependency injection container for JavaScript that supports Singleton, Transient, and Scoped services.
The container helps to manage the lifecycle of objects and services in an application, making it easier to manage
dependencies.

## Features

- **Singleton**: A service that is created once and shared throughout the application.
- **Transient**: A service that creates a new instance every time it's resolved.
- **Scoped**: A service that exists only within the context of a particular scope, allowing for isolated lifetimes.
- **Disposal**: Scoped services can be disposed of when the scope is no longer needed, ensuring proper resource cleanup.

## Usage

### 1. Register Services

#### Register Singleton Services

Singleton services are created once and shared across all requests.

```javascript
const container = new Container();

class MySingletonService {
}

container.registerSingleton(MySingletonService, new MySingletonService());
```

#### Register Transient Services

Transient services are created each time they are resolved.

```javascript
const container = new Container();

container.registerTransient(MySingletonService, () => new MySingletonService());
```

#### Register Scoped Services

Scoped services are tied to a specific scope and can be resolved within that scope only.

```javascript
const container = new Container();

container.registerScoped(MySingletonService, () => new MySingletonService());
```

### 2. Resolving Services

Services can be resolved using the `resolve` method. Depending on the type, the service may be resolved as a singleton,
transient, or scoped instance.

```javascript
const myService = container.resolve(MySingletonService);
```

### 3. Scopes

A scope allows you to isolate service instances. Scoped services will be resolved within the scope and are disposed of
when the scope is disposed.

```javascript
const container = new Container();

// Create a new scope
const scope = container.createScope();

// Register a scoped service
scope.registerScoped(MySingletonService, () => new MySingletonService());

// Resolve the scoped service
const myScopedService = scope.resolve(MySingletonService);

// Dispose of the scope
scope.dispose();
```

### 4. Disposal

Scoped services have a `dispose` method which is called when the scope is disposed. This is useful for cleaning up
resources such as database connections or file handles.

```javascript
class MyScopedService {
    dispose() {
        console.log('Disposed');
    }
}

container.registerScoped(MyScopedService, () => new MyScopedService());
const scope = container.createScope();
const service = scope.resolve(MyScopedService);

// Dispose of the scope, triggering the service's dispose method
scope.dispose();  // Outputs: Disposed
```

## API

### `registerSingleton(interfaceType, implementation)`

Registers a singleton service. The same instance will be returned each time the service is resolved.

- `interfaceType`: The service interface (class).
- `implementation`: The instance of the service.

### `registerTransient(interfaceType, factory)`

Registers a transient service. A new instance of the service will be created every time it is resolved.

- `interfaceType`: The service interface (class).
- `factory`: A factory function that returns the new instance of the service.

### `registerScoped(interfaceType, factory)`

Registers a scoped service. A new instance of the service will be created per scope.

- `interfaceType`: The service interface (class).
- `factory`: A factory function that returns the new instance of the service.

### `resolve(interfaceType)`

Resolves and returns an instance of the service.

- `interfaceType`: The service interface (class).

### `createScope()`

Creates a new scope. Scoped services can be resolved and disposed of within the scope.

### `dispose()`

Disposes of a scope, calling the `dispose` method on all scoped services.

