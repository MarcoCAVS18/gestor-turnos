# Firebase Firestore Database Structure

## Collections Overview

The app uses the following Firestore collections:

1. **users** - User profiles and settings
2. **works** - All jobs (both regular and delivery)
3. **shifts** - All shifts (both regular and delivery)
4. **stats** - (Future) Pre-calculated statistics

---

## Collection: `users`

Path: `/users/{userId}`

### Document Structure

```javascript
{
  // User Identity
  email: string,
  displayName: string,
  photoURL?: string,          // Firebase Storage path to profile photo
  createdAt: Timestamp,
  updatedAt: Timestamp,

  // User Settings
  settings: {
    // Theme
    primaryColor: string,     // Hex color (default: '#EC4899')
    userEmoji: string,        // User's emoji (default: '😊')

    // Work Configuration
    defaultDiscount: number,  // Percentage (default: 15)
    weeklyHoursGoal: number | null,

    // Features
    deliveryEnabled: boolean, // Enable delivery tracking
    smokoEnabled: boolean,    // Enable break tracking
    smokoMinutes: number,     // Break duration (default: 30)

    // Shift Time Ranges
    shiftRanges: {
      dayStart: number,       // Hour (default: 6)
      dayEnd: number,         // Hour (default: 14)
      afternoonStart: number, // Hour (default: 14)
      afternoonEnd: number,   // Hour (default: 20)
      nightStart: number      // Hour (default: 20)
    }
  }
}
```

---

## Collection: `works`

Path: `/works/{workId}`

### Document Structure

All works (jobs) are stored in a single collection with a `type` field to differentiate.

#### Regular Work

```javascript
{
  // Identity
  userId: string,           // References /users/{userId}
  name: string,             // Company/job name
  description?: string,     // Optional description
  type: 'regular',
  active: boolean,          // Is this work active?

  // Display
  color: string,            // Hex color for UI

  // Payment Configuration
  baseRate: number,         // Base hourly rate
  rates: {
    day: number,            // Day shift rate
    afternoon: number,      // Afternoon shift rate
    night: number,          // Night shift rate
    saturday: number,       // Saturday rate
    sunday: number,         // Sunday rate
    holidays: number        // Holiday rate
  },

  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### Delivery Work

```javascript
{
  // Identity
  userId: string,           // References /users/{userId}
  name: string,             // Work name (e.g., "Uber Eats", "DoorDash")
  type: 'delivery',
  active: boolean,

  // Delivery-Specific
  platform: string,         // Platform name
  vehicle: string,          // Vehicle type (e.g., "Bicycle", "Motorcycle", "Car")
  avatarColor: string,      // Hex color for UI (default: '#10B981')

  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## Collection: `shifts`

Path: `/shifts/{shiftId}`

### Document Structure

All shifts are stored in a single collection with a `type` field to differentiate.

#### Regular Shift

```javascript
{
  // References
  userId: string,           // References /users/{userId}
  workId: string,           // References /works/{workId}
  type: 'regular',

  // Scheduling
  date: string,             // ISO date string (YYYY-MM-DD) - main date field
  startDate: string,        // ISO date string (YYYY-MM-DD)
  endDate: string,          // ISO date string (YYYY-MM-DD)
  startTime: string,        // Time in HH:mm format
  endTime: string,          // Time in HH:mm format
  crossesMidnight: boolean, // Does shift cross midnight?

  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### Delivery Shift

```javascript
{
  // References
  userId: string,           // References /users/{userId}
  workId: string,           // References /works/{workId}
  type: 'delivery',

  // Scheduling
  date: string,             // ISO date string (YYYY-MM-DD) - main date field
  startDate: string,        // ISO date string (YYYY-MM-DD)
  endDate: string,          // ISO date string (YYYY-MM-DD)
  startTime: string,        // Time in HH:mm format
  endTime: string,          // Time in HH:mm format
  crossesMidnight: boolean, // Does shift cross midnight?

  // Earnings
  baseEarnings: number,     // Earnings without tips
  tips: number,             // Tips received
  totalEarnings: number,    // baseEarnings + tips
  netEarnings: number,      // totalEarnings - fuelExpense

  // Delivery Details
  orderCount: number,       // Number of orders/deliveries
  kilometers: number,       // Distance traveled
  fuelExpense: number,      // Fuel cost
  platform: string,         // Platform name (copied from work)
  vehicle: string,          // Vehicle used (copied from work)

  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## Queries Used

### Get User's Regular Works
```javascript
query(worksRef,
  where('userId', '==', userUid),
  where('type', '==', 'regular'),
  orderBy('name', 'asc')
)
```

### Get User's Delivery Works
```javascript
query(worksRef,
  where('userId', '==', userUid),
  where('type', '==', 'delivery'),
  orderBy('createdAt', 'desc')
)
```

### Get User's Regular Shifts
```javascript
query(shiftsRef,
  where('userId', '==', userUid),
  where('type', '==', 'regular'),
  orderBy('date', 'desc')
)
```

### Get User's Delivery Shifts
```javascript
query(shiftsRef,
  where('userId', '==', userUid),
  where('type', '==', 'delivery'),
  orderBy('date', 'desc')
)
```

---

## Important Notes

1. **Timestamps**: All dates use JavaScript `new Date()` objects which Firestore stores as Timestamp type
2. **Date Fields**: Use ISO date strings (YYYY-MM-DD) for all date fields to ensure consistent sorting and filtering
3. **Type Field**: Essential for filtering regular vs delivery items in both works and shifts collections
4. **UserID**: Every document must have a userId field for security rules and data isolation
5. **Calculated Fields**: `totalEarnings` and `netEarnings` are calculated and stored (denormalized) for query performance

---

## Firestore Security Rules Required

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Works collection
    match /works/{workId} {
      allow read, write: if request.auth != null &&
                           request.resource.data.userId == request.auth.uid;
    }

    // Shifts collection
    match /shifts/{shiftId} {
      allow read, write: if request.auth != null &&
                           request.resource.data.userId == request.auth.uid;
    }
  }
}
```
