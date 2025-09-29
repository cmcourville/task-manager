# Test Directory Structure

This directory contains all test files for the Task Manager application.

## Directory Structure

```
__tests__/
├── setup.ts                 # Test setup and configuration
├── unit/                    # Unit tests for individual functions/components
│   ├── types.test.ts       # Tests for type definitions
│   └── data.test.ts        # Tests for data functions
├── integration/             # Integration tests for component interactions
│   └── components.test.tsx  # Tests for React components
├── e2e/                     # End-to-end tests (future)
└── README.md               # This file
```

## Test Types

### Unit Tests (`unit/`)
- Test individual functions, utilities, and pure logic
- Fast execution, no external dependencies
- Examples: data calculations, type validation, utility functions

### Integration Tests (`integration/`)
- Test component interactions and data flow
- May include mocked dependencies
- Examples: component rendering with data, user interactions

### End-to-End Tests (`e2e/`)
- Test complete user workflows
- Full application testing with real browser
- Examples: complete task assignment flow, navigation between pages

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run tests once (CI mode)
npm run test:run

# Run tests with coverage
npm run test:coverage
```

## Test Configuration

- **Vitest**: Fast unit test runner
- **@testing-library/react**: React component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers for DOM testing
- **jsdom**: DOM environment for testing

## Writing Tests

### Unit Test Example
```typescript
import { describe, it, expect } from 'vitest'
import { calculateStatistics } from '@/lib/data'

describe('calculateStatistics', () => {
  it('should calculate correct totals', () => {
    const tasks = [/* test data */]
    const result = calculateStatistics([], tasks)
    expect(result.totalTasks).toBe(1)
  })
})
```

### Integration Test Example
```typescript
import { render, screen } from '@testing-library/react'
import { MyComponent } from '@/components/MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

## Best Practices

1. **Test Naming**: Use descriptive test names that explain what is being tested
2. **Arrange-Act-Assert**: Structure tests with clear setup, execution, and verification
3. **Isolation**: Each test should be independent and not rely on other tests
4. **Coverage**: Aim for high test coverage of critical business logic
5. **Mocking**: Mock external dependencies and APIs appropriately
6. **Data**: Use consistent test data and avoid hardcoded values when possible
