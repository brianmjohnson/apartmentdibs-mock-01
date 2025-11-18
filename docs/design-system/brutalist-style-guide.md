# ApartmentDibs Brutalist Design System

## SECTION 1: QUICK REFERENCE (Lines 1-50)

### Design Philosophy

Raw functionality meets technical precision. Every element serves a purpose - no decoration, no embellishment. The brutalist aesthetic emphasizes stark contrast (near-black on white), monospace typography for controls, and sharp edges on interactive elements while containers remain soft.

### Core Principles

- **Function over form**: Every visual element must serve a purpose
- **High contrast**: Near-black primary on white (inverts in dark mode)
- **Sharp controls, soft containers**: Buttons use `rounded-none`, cards use `rounded-xl`
- **Monospace for interaction**: All headings, buttons, links use `font-mono`
- **No focus rings**: Clean, uncluttered interaction states via global CSS reset

### Essential Color Tokens

```
--primary:     oklch(0.141 0.005 285.823)  // Near-black
--secondary:   oklch(0.967 0.001 286.375)  // Light gray
--muted:       oklch(0.552 0.016 285.938)  // Medium gray (foreground)
--destructive: oklch(0.577 0.245 27.325)   // Red
--background:  oklch(1 0 0)                // Pure white
```

### Essential Typography

```css
/* Monospace: Headings, buttons, links, badges, titles */
font-family: var(--font-geist-mono);  /* Use: font-mono */

/* Sans-serif: Body text, descriptions, form inputs */
font-family: var(--font-geist-sans);  /* Use: font-geist */

/* Base size */
text-xs: 0.8125rem (13px)  /* Standard for buttons, badges */
```

### Essential Spacing

```css
gap-1.5  /* Tight: badges, inline elements */
gap-2    /* Small: button content, list items */
gap-6    /* Standard: card sections, form groups */
```

---

## SECTION 2: COMPONENT PATTERNS (Lines 51-150)

### Button Patterns

**Base classes**: `rounded-none font-mono text-xs`

| Variant | Classes | Hover State |
|---------|---------|-------------|
| default | `bg-primary text-primary-foreground` | `hover:bg-primary/90` |
| destructive | `bg-destructive text-white` | `hover:bg-destructive/90` |
| outline | `border border-primary underline-offset-1` | `hover:underline` |
| secondary | `bg-secondary text-secondary-foreground` | `hover:bg-primary/10` |
| ghost | (transparent) | `hover:bg-primary/10` |
| link | `underline-offset-1` | `hover:underline` |

**Sizes**:
- default: `h-[36px] px-2 py-2`
- sm: `h-8 gap-1.5 px-2`
- lg: `h-12 px-4`
- icon: `size-[36px]`

### Card Patterns

**Base**: `rounded-xl border text-card-foreground flex flex-col gap-6 pt-6`

- **CardTitle**: `font-semibold font-mono leading-none`
- **CardDescription**: `text-muted-foreground text-sm`
- **CardContent**: Minimal base (add `px-6` for horizontal padding)
- **CardFooter**: `flex items-center px-6`

### Input Patterns

**Base**: `rounded-lg bg-secondary h-10 px-3 py-1 text-base md:text-sm`

**Key behaviors**:
- Hover: `hover:bg-neutral-200/75 dark:hover:bg-input/50`
- Selection: `selection:bg-primary selection:text-primary-foreground`
- No focus ring (global CSS reset)
- Truncate long values: `truncate`

### Textarea Patterns

**Base**: `rounded-lg bg-secondary border-none min-h-[80px] px-3 py-2 text-sm`

Explicitly removes all focus indicators:
```css
outline-none focus:outline-none focus-visible:outline-none
ring-0 focus:ring-0 focus-visible:ring-0
```

### Select Patterns

**Trigger**: `rounded-lg bg-secondary border-transparent font-geist h-10 px-3 py-2`
**Content**: `rounded-lg border shadow-lg`
**Item**: Uses `font-geist` (sans-serif for readability in lists)

### Badge Patterns

**Base**: `font-mono text-xs px-2 py-0.5 h-6`

Note: Badges have no border-radius by default (inherits none)

### Dialog Patterns

**Content**: No explicit border-radius (raw modal)
**Title**: `text-xs font-medium font-mono`
**Description**: `text-muted-foreground text-xs`
**Close button**: Uses `variant="link" size="sm"`

### Layout Patterns

**Gap-based layouts** (NOT margin-based):
```tsx
// CORRECT: Use gap utilities
<div className="flex flex-col gap-6">
  <Component1 />
  <Component2 />
</div>

// AVOID: Margin on children
<div className="flex flex-col">
  <Component1 className="mb-6" />
  <Component2 />
</div>
```

### Form Patterns

```tsx
<div className="flex flex-col gap-6">
  <div className="flex flex-col gap-2">
    <Label className="font-mono text-xs">Field Name</Label>
    <Input />
  </div>
</div>
```

---

## SECTION 3: FULL SPECIFICATIONS (Lines 151+)

### Complete Color Token Reference

#### Light Mode

```css
:root {
  /* Core */
  --background: oklch(1 0 0);                    /* Pure white */
  --foreground: oklch(0.141 0.005 285.823);      /* Near-black */

  /* Cards & Popovers */
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.141 0.005 285.823);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.141 0.005 285.823);

  /* Primary (main actions) */
  --primary: oklch(0.141 0.005 285.823);         /* Near-black */
  --primary-foreground: oklch(1 0 0);            /* White */

  /* Secondary (subtle backgrounds) */
  --secondary: oklch(0.967 0.001 286.375);       /* Light gray */
  --secondary-foreground: oklch(0.21 0.006 285.885);

  /* Muted (disabled states, hints) */
  --muted: oklch(0.967 0.001 286.375);
  --muted-foreground: oklch(0.552 0.016 285.938);

  /* Accent (highlights) */
  --accent: oklch(0.967 0.001 286.375);
  --accent-foreground: oklch(0.21 0.006 285.885);

  /* Destructive (errors, deletions) */
  --destructive: oklch(0.577 0.245 27.325);      /* Red */

  /* Borders & Inputs */
  --border: oklch(0.92 0.004 286.32);
  --input: oklch(0.92 0.004 286.32);
  --ring: oklch(0.645 0.246 16.439);

  /* Brand colors */
  --brand: oklch(0.623 0.214 259.815);           /* Blue */
  --highlight: oklch(0.852 0.199 91.936);        /* Yellow */
  --background-marketing: oklch(0.9738 0.0045 78.3);
}
```

#### Dark Mode

```css
.dark {
  --background: oklch(0.141 0.005 285.823);      /* Near-black */
  --foreground: oklch(1 0 0);                    /* White */
  --card: oklch(0.21 0.006 285.885);
  --popover: oklch(0.21 0.006 285.885);
  --primary: oklch(0.37 0 0);
  --secondary: oklch(0.274 0.006 286.033);
  --muted: oklch(0.274 0.006 286.033);
  --muted-foreground: oklch(0.705 0.015 286.067);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0);                        /* White borders */
  --input: oklch(1 0 0 / 15%);
}
```

### Typography Scale

#### Font Families

```css
/* Monospace - Technical, code-like aesthetic */
--font-mono: var(--font-geist-mono);

/* Apply to: */
- Headings (h1-h6)
- Buttons
- Links
- Badges
- Card titles
- Dialog titles
```

```css
/* Sans-serif - Body text readability */
--font-geist: var(--font-geist-sans);

/* Apply to: */
- Body text
- Descriptions
- Form inputs
- Select items (for readability in lists)
- Paragraphs
```

#### Font Sizes

```css
text-xs:  0.8125rem (13px)  /* Buttons, badges, labels */
text-sm:  0.875rem (14px)   /* Descriptions, input text */
text-base: 1rem (16px)      /* Mobile input text */
```

### Border Radius Rules

The brutalist system uses contrasting border radii:

| Element Type | Radius | Tailwind Class | Rationale |
|--------------|--------|----------------|-----------|
| Buttons | 0 | `rounded-none` | Sharp, decisive, action-oriented |
| Badges | 0 | (default) | Matches button aesthetic |
| Inputs | 0.75rem | `rounded-lg` | Softer for text entry comfort |
| Textareas | 0.75rem | `rounded-lg` | Consistent with inputs |
| Selects | 0.75rem | `rounded-lg` | Consistent with inputs |
| Cards | 1.25rem | `rounded-xl` | Container softness |
| Dialogs | 0 | (none) | Raw modal appearance |
| Toasts | 0.75rem | (CSS var) | Consistent with inputs |

**Radius CSS Variables**:
```css
--radius: 0.75rem;
--radius-sm: calc(var(--radius) - 4px);  /* 8px */
--radius-md: calc(var(--radius) - 2px);  /* 10px */
--radius-lg: var(--radius);              /* 12px */
--radius-xl: calc(var(--radius) + 10px); /* 22px */
```

### Animation & Transition Patterns

#### Standard Transitions

```css
transition-[color,background-color]     /* Inputs, selects */
transition-[color,box-shadow]           /* Badges */
transition-all                          /* Buttons (full) */
```

#### Dialog Animations

```css
/* Entry */
data-[state=open]:animate-in
data-[state=open]:fade-in-0
data-[state=open]:zoom-in-95

/* Exit */
data-[state=closed]:animate-out
data-[state=closed]:fade-out-0
data-[state=closed]:zoom-out-95

/* Duration */
duration-200
```

### Shadow System

Brutalist design minimizes shadows. Use sparingly:

```css
/* Standard shadow (very subtle) */
.shadow-lg {
  box-shadow: 0 8px 20px 0 rgb(0 0 0 / 0.055);
}

/* No shadow */
box-shadow: none !important;  /* Applied to toasts, focus states */
```

### Focus State Management

**Global reset removes all focus rings**:

```css
input:focus,
textarea:focus,
select:focus,
button:focus,
[role="button"]:focus,
[role="tab"]:focus,
[role="menuitem"]:focus,
[role="option"]:focus,
[role="switch"]:focus,
[role="checkbox"]:focus,
[role="radio"]:focus {
  outline: none !important;
  box-shadow: none !important;
  ring: none !important;
}
```

This is intentional - the brutalist aesthetic values clean, uncluttered interaction states.

### Accessibility Requirements

Despite removing focus rings, maintain accessibility:

1. **Color contrast**: All text meets WCAG AA (4.5:1 for normal text)
2. **Interactive states**: Use `hover:` states consistently
3. **Disabled states**: `disabled:opacity-50 disabled:cursor-not-allowed`
4. **Error states**: `aria-invalid:border-destructive`
5. **Selection styling**: `selection:bg-primary selection:text-primary-foreground`

### Dark Mode Considerations

Key dark mode overrides:

```css
/* Background inversion */
.dark .bg-secondary       -> dark:bg-input/30
.dark .hover:bg-*         -> dark:hover:bg-input/50

/* Border color */
--border in dark mode is white (for visibility)

/* Input backgrounds use transparency */
--input: oklch(1 0 0 / 15%);
```

### Anti-Patterns (What NOT to Do)

#### Typography Anti-Patterns

```tsx
// WRONG: Sans-serif on buttons
<button className="font-sans">Click</button>

// WRONG: Monospace on body text
<p className="font-mono">Long paragraph of text...</p>

// CORRECT
<button className="font-mono">Click</button>
<p className="font-geist">Long paragraph of text...</p>
```

#### Spacing Anti-Patterns

```tsx
// WRONG: Using margins for layout
<div className="mb-4 mt-6">
  <Component />
</div>

// CORRECT: Using gap
<div className="flex flex-col gap-6">
  <Component />
</div>
```

#### Border Radius Anti-Patterns

```tsx
// WRONG: Rounded buttons
<Button className="rounded-lg">Submit</Button>

// WRONG: Sharp-edged cards
<Card className="rounded-none">Content</Card>

// CORRECT
<Button className="rounded-none">Submit</Button>  // Default behavior
<Card className="rounded-xl">Content</Card>       // Default behavior
```

#### Focus State Anti-Patterns

```tsx
// WRONG: Adding focus rings back
<Input className="focus:ring-2 focus:ring-primary" />

// WRONG: Adding shadows on focus
<Button className="focus:shadow-lg" />

// CORRECT: Let global CSS handle focus states
<Input />
<Button />
```

#### Color Anti-Patterns

```tsx
// WRONG: Custom colors outside the system
<div className="bg-blue-500 text-white">Custom</div>

// CORRECT: Use semantic tokens
<div className="bg-primary text-primary-foreground">Consistent</div>
```

### Code Examples

#### Standard Button Group

```tsx
<div className="flex gap-2">
  <Button>Primary Action</Button>
  <Button variant="outline">Secondary</Button>
  <Button variant="ghost">Tertiary</Button>
</div>
```

#### Form with Validation

```tsx
<form className="flex flex-col gap-6">
  <div className="flex flex-col gap-2">
    <Label className="font-mono text-xs">Email</Label>
    <Input
      type="email"
      placeholder="you@example.com"
      aria-invalid={errors.email ? "true" : undefined}
    />
    {errors.email && (
      <p className="text-destructive text-xs">{errors.email}</p>
    )}
  </div>

  <div className="flex flex-col gap-2">
    <Label className="font-mono text-xs">Message</Label>
    <Textarea placeholder="Your message..." />
  </div>

  <Button type="submit">Submit</Button>
</form>
```

#### Card with Actions

```tsx
<Card>
  <CardHeader>
    <CardTitle>Brutalist Card</CardTitle>
    <CardDescription>
      Functional design with purpose
    </CardDescription>
    <CardAction>
      <Button variant="ghost" size="icon">
        <MoreIcon />
      </Button>
    </CardAction>
  </CardHeader>
  <CardContent className="px-6">
    <p className="font-geist text-sm">
      Content goes here with proper spacing.
    </p>
  </CardContent>
  <CardFooter className="border-t">
    <Button variant="outline">Cancel</Button>
    <Button className="ml-auto">Confirm</Button>
  </CardFooter>
</Card>
```

#### Badge Variants

```tsx
<div className="flex gap-2">
  <Badge>Default</Badge>
  <Badge variant="secondary">Secondary</Badge>
  <Badge variant="outline">Outline</Badge>
  <Badge variant="destructive">Destructive</Badge>
</div>
```

#### Select Component

```tsx
<Select>
  <SelectTrigger className="w-[200px]">
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>
```

### Component Checklist

When creating new components, verify:

- [ ] Buttons use `rounded-none`
- [ ] Containers use `rounded-xl`
- [ ] Inputs/selects use `rounded-lg`
- [ ] Headings/titles use `font-mono`
- [ ] Body text uses `font-geist`
- [ ] Text size is `text-xs` for controls, `text-sm` for descriptions
- [ ] Spacing uses `gap-*` utilities
- [ ] No custom focus rings added
- [ ] Colors use semantic tokens only
- [ ] Hover states follow existing patterns
- [ ] Dark mode variants included where needed
