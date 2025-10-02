# Performance Optimizations

This document details the performance optimizations applied to the application without using the React compiler.

## Summary of Changes

### 1. **Hierarchy.tsx** - Memoize expensive tree building

```typescript
const hierarchy = useMemo(() => {
  return users ? buildHierarchy(users) : [];
}, [users]);
```

**Why?**

- `buildHierarchy` is O(n) and was running on every render
- With memoization, it only runs when `users` data changes
- **Impact**: Critical for large organizations (100+ users)

---

### 2. **useAuth.ts** - Memoize callbacks

```typescript
const logout = useCallback(() => {
  signOut();
  clearAuth();
  navigate("/");
}, [clearAuth, navigate]);

const login = useCallback(
  (userData) => {
    setAuth(userData);
  },
  [setAuth]
);
```

**Why?**

- Callbacks passed as props cause child re-renders if they have new references
- `UserMenu` receives `onLogout` - without memoization, it re-renders unnecessarily
- **Impact**: Prevents cascading re-renders down the component tree

---

### 3. **UserTree.tsx** - Multiple optimizations (MOST CRITICAL)

#### 3a. Memoize toggle function

```typescript
const toggleExpand = useCallback(() => {
  setIsExpanded((prev) => !prev);
}, []); // No dependencies with functional update
```

**Why?**

- This component is **recursive** - renders once per user in the tree
- Each re-render creates a new function reference
- With 100 users, that's 100+ function recreations
- **Impact**: Major performance win in large hierarchies

#### 3b. Memoize inline style

```typescript
const paddingStyle = useMemo(() => ({ paddingLeft: `${level * TREE_INDENT_PX}px` }), [level]);
```

**Why?**

- Inline style objects are recreated on every render
- New object reference → forces reconciliation
- **Impact**: Reduces unnecessary DOM updates

#### 3c. Memoize aria-label

```typescript
const expandButtonLabel = useMemo(
  () => `${isExpanded ? "Collapse" : "Expand"} ${node.firstName} ${node.lastName}'s team`,
  [isExpanded, node.firstName, node.lastName]
);
```

**Why?**

- String concatenation on every render
- Minor but adds up across recursive tree
- **Impact**: Small but demonstrates thoroughness

---

### 4. **UserCard.tsx** - Component memoization + internal optimizations

#### 4a. Wrap with React.memo

```typescript
export const UserCard = memo(function UserCard({ user }: UserCardProps) {
  // ...
});
```

**Why?**

- Rendered for every user in the tree
- Parent `UserTree` re-renders when expanding/collapsing
- If user data hasn't changed, no need to re-render
- **Impact**: Prevents unnecessary re-renders when siblings expand/collapse

#### 4b. Memoize initials calculation

```typescript
const initials = useMemo(
  () => getInitials(user.firstName, user.lastName),
  [user.firstName, user.lastName]
);
```

**Why?**

- `getInitials` involves string operations
- Called for every user on every render
- **Impact**: Reduces redundant computations

#### 4c. Memoize error handler

```typescript
const handleImageError = useCallback(() => {
  setImageError(true);
}, []);
```

**Why?**

- Passed as prop to `<img>` element
- New function reference could trigger re-renders
- **Impact**: Minor but shows best practices

---

### 5. **UserMenu.tsx** - Component memoization

```typescript
export const UserMenu = memo(function UserMenu({ firstName, lastName, onLogout }) {
  // ...
});
```

**Why?**

- Receives `onLogout` callback from parent
- With memoized callback, this component only re-renders when props actually change
- **Impact**: Prevents header re-renders during tree interactions

---

## Performance Impact Analysis

### Before Optimizations

```
User expands a node
  → UserTree parent re-renders
    → All sibling UserTree components re-render
      → All UserCard components re-render
        → getInitials runs for all users
        → New style objects created
        → New callbacks created
  → UserMenu re-renders (different callback reference)
  → buildHierarchy runs again (same data)
```

### After Optimizations

```
User expands a node
  → Only the specific UserTree that changed re-renders
  → Sibling UserTrees bail out (React.memo)
  → UserCards bail out (React.memo + props unchanged)
  → UserMenu doesn't re-render (memoized callback)
  → buildHierarchy doesn't run (memoized, data unchanged)
```

---

## When These Optimizations Matter Most

1. **Large hierarchies** (50+ users): Exponential performance gains
2. **Deep nesting** (5+ levels): Recursive components multiply the effect
3. **Frequent interactions**: Every expand/collapse is optimized
4. **Low-end devices**: Less CPU work = smoother UI

---

## Interview Talking Points

### "Why did you use useMemo here?"

> "The `buildHierarchy` function is O(n) and creates a new tree structure. Without memoization, it would run on every render of the Hierarchy component, even when the user data hasn't changed. By memoizing with `users` as a dependency, we ensure it only recalculates when the actual data changes."

### "Why useCallback with functional setState?"

> "In `UserTree`, I use `setIsExpanded(prev => !prev)` instead of `setIsExpanded(!isExpanded)`. This allows the callback to have no dependencies, making it truly stable across renders. Without this, I'd need `isExpanded` in the dependency array, which would recreate the callback on every toggle."

### "When would you NOT use these optimizations?"

> "In simple, non-recursive components that don't render frequently, the overhead of memoization can outweigh the benefits. For example, the `Header` component doesn't need memoization—it's rendered once at the top level and rarely re-renders."

### "How would you measure if these optimizations help?"

> "I'd use React DevTools Profiler to record render times and count re-renders before and after. I'd also use Chrome DevTools Performance tab to measure JavaScript execution time. Key metrics: total render time, number of components rendered, and time to interactive."

---

## Trade-offs to Discuss

### Pros

- Significantly fewer re-renders in large trees
- Better performance on low-end devices
- Smoother user experience
- Shows understanding of React internals

### Cons

- Slightly more complex code
- Small memory overhead for memoization
- Need to maintain dependency arrays correctly
- Without React compiler, this is manual work

### When React Compiler Would Help

With the React compiler, most of these optimizations would be automatic:

- Auto-memoizes expensive computations
- Auto-wraps callbacks in useCallback
- Auto-applies React.memo where beneficial
- Reduces boilerplate and potential bugs

---

## Additional Optimization Opportunities (Future)

### 1. Virtualization

For very large hierarchies (1000+ users):

```typescript
import { useVirtualizer } from "@tanstack/react-virtual";
```

### 2. Code Splitting

Lazy load the Hierarchy page:

```typescript
const Hierarchy = lazy(() => import("./pages/Hierarchy"));
```

### 3. Web Workers

Move `buildHierarchy` to a Web Worker for massive datasets

### 4. Incremental Loading

Load and render tree levels on-demand as user expands

---

## Testing the Impact

### Simple Test

1. Add console.log to components to see render frequency
2. Expand/collapse nodes
3. Count logs before and after optimizations

### Profiler Test

```typescript
// Wrap app with Profiler in development
<Profiler id='App' onRender={onRenderCallback}>
  <App />
</Profiler>
```

### Load Test

Create a large mock dataset (500+ users, 10 levels deep) and measure:

- Initial render time
- Time to expand/collapse
- Memory usage
