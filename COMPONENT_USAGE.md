# Component Usage Guide

This guide shows how to use the new reusable UI components added to the project.

## Badge Component

Used for status indicators, tags, and labels.

### Usage

```tsx
import Badge from '@/components/Badge'

// Success badge
<Badge variant="success">Active</Badge>

// Warning badge
<Badge variant="warning">Pending</Badge>

// Danger badge
<Badge variant="danger">Eliminated</Badge>

// Info badge
<Badge variant="info">Live</Badge>

// Neutral badge
<Badge variant="neutral">Completed</Badge>

// Different sizes
<Badge variant="success" size="sm">Small</Badge>
<Badge variant="success" size="md">Medium</Badge>
<Badge variant="success" size="lg">Large</Badge>
```

### Props

- `variant`: `'success' | 'warning' | 'danger' | 'info' | 'neutral'` (required)
- `size`: `'sm' | 'md' | 'lg'` (optional, default: `'md'`)
- `children`: React node to display
- `className`: Additional CSS classes (optional)

---

## Button Component

Reusable button with variants, sizes, and loading states.

### Usage

```tsx
import Button from '@/components/Button'

// Primary button
<Button variant="primary" onClick={handleClick}>
  Save Changes
</Button>

// Secondary button
<Button variant="secondary">Cancel</Button>

// Danger button
<Button variant="danger">Delete</Button>

// Ghost button
<Button variant="ghost">View More</Button>

// Gold button (CTA)
<Button variant="gold" size="lg">
  Get Started
</Button>

// With loading state
<Button variant="primary" isLoading={saving}>
  {saving ? 'Saving...' : 'Save'}
</Button>

// Full width
<Button variant="primary" fullWidth>
  Submit
</Button>

// Disabled
<Button variant="primary" disabled>
  Disabled
</Button>
```

### Props

- `variant`: `'primary' | 'secondary' | 'danger' | 'ghost' | 'gold'` (optional, default: `'primary'`)
- `size`: `'sm' | 'md' | 'lg'` (optional, default: `'md'`)
- `fullWidth`: boolean (optional, default: `false`)
- `isLoading`: boolean (optional, default: `false`)
- All standard button HTML attributes (`onClick`, `disabled`, `type`, etc.)

---

## Toast Notification System

Context-based toast notifications for user feedback.

### Usage

```tsx
'use client'

import { useToast } from '@/components/Toast'

export default function MyComponent() {
  const { showToast } = useToast()

  const handleSave = async () => {
    try {
      await saveData()
      showToast('Changes saved successfully!', 'success')
    } catch (error) {
      showToast('Failed to save changes', 'error')
    }
  }

  const handleWarning = () => {
    showToast('Please complete all required fields', 'warning')
  }

  const handleInfo = () => {
    showToast('This feature is coming soon', 'info')
  }

  return (
    <div>
      <Button onClick={handleSave}>Save</Button>
      <Button onClick={handleWarning}>Test Warning</Button>
      <Button onClick={handleInfo}>Test Info</Button>
    </div>
  )
}
```

### API

- `showToast(message: string, type?: 'success' | 'error' | 'warning' | 'info')` - Shows a toast notification
- Default type is `'info'`
- Toasts auto-dismiss after 5 seconds
- Users can manually dismiss by clicking the X button

**Note**: The `ToastProvider` is already added to the root layout, so you can use `useToast()` in any client component.

---

## Loading Skeletons

Pre-built skeleton loaders for common UI patterns.

### Usage

```tsx
import {
  Skeleton,
  LeagueCardSkeleton,
  EventCardSkeleton,
  TableSkeleton,
  DashboardSkeleton
} from '@/components/LoadingSkeleton'

// Basic skeleton
<Skeleton className="h-8 w-48" />

// League card skeleton
<LeagueCardSkeleton />

// Event card skeleton
<EventCardSkeleton />

// Table skeleton
<TableSkeleton rows={5} />

// Full dashboard skeleton
<DashboardSkeleton />
```

### Next.js Loading States

Create a `loading.tsx` file in your route folder:

```tsx
// app/dashboard/loading.tsx
import { DashboardSkeleton } from '@/components/LoadingSkeleton'

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <DashboardSkeleton />
    </div>
  )
}
```

---

## Error Boundaries

Global error boundary is already configured in `app/error.tsx`.

### Features

- User-friendly error message
- "Try Again" button to reset error boundary
- "Go to Dashboard" fallback link
- Shows error details in development mode
- Consistent styling with the rest of the app

---

## Accessibility Features

All components include:

- ✅ Proper ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Focus indicators with ring utilities
- ✅ Screen reader friendly
- ✅ Semantic HTML

### Focus Styles

Buttons and interactive elements use:
```css
focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900
```

---

## Mobile Responsive Patterns

### Responsive Table to Cards

Example from league details page:

```tsx
{/* Desktop Table */}
<div className="hidden md:block">
  <table>...</table>
</div>

{/* Mobile Cards */}
<div className="md:hidden">
  {items.map(item => (
    <div key={item.id} className="p-4 border-b">
      {/* Card layout */}
    </div>
  ))}
</div>
```

### Responsive Grid

```tsx
{/* 1 column on mobile, 2 on tablet, 3 on desktop */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

---

## Best Practices

1. **Use Badge for status indicators** - Replaces inline conditional className strings
2. **Use Button for all clickable actions** - Consistent styling and accessibility
3. **Show loading states** - Use `isLoading` prop or skeleton loaders
4. **Provide user feedback** - Use toasts for success/error messages
5. **Make it responsive** - Use mobile card layouts for tables
6. **Add ARIA labels** - Especially for icon-only buttons

---

## Migration Examples

### Before (Old Code)

```tsx
<button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
  Create League
</button>

<span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
  Active
</span>
```

### After (New Components)

```tsx
<Button variant="primary">Create League</Button>

<Badge variant="success">Active</Badge>
```

Much cleaner and more maintainable!
