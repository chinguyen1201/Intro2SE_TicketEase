# Seat Selection Feature Documentation

## Overview
The seat selection feature has been successfully integrated into the TicketSelectionPage, providing customers with an interactive interface to choose their specific seats for events.

## Components Implemented

### 1. SeatSelector Component (`/features/customer/components/SeatSelector.jsx`)

**Features:**
- **Interactive Seat Map**: Visual representation of venue seating with different sections (VIP, Premium, Standard)
- **Real-time Availability**: Shows occupied, available, and selected seats with different colors
- **Quantity Validation**: Ensures customers select exactly the number of seats matching their ticket quantity
- **Hover Effects**: Visual feedback when hovering over seats
- **Multiple Venue Layouts**: Supports different venue configurations (theater, default)

**Key Functions:**
- `handleSeatClick()`: Manages seat selection/deselection
- `generateSeatLayout()`: Creates venue-specific seating arrangements
- `getSeatStatusClass()`: Returns appropriate CSS classes for seat states

### 2. Redux State Management Updates

**New State Properties:**
```javascript
selectedSeats: {} // Format: { ticketId: [array of seat IDs] }
```

**New Actions:**
- `setSelectedSeats`: Save selected seats for a ticket type
- `clearSelectedSeats`: Clear seat selections

### 3. Enhanced TicketSelectionPage

**New Features:**
- **Seat Selection Buttons**: Appear after selecting ticket quantities
- **Selected Seats Display**: Shows chosen seats for each ticket type
- **Validation**: Ensures all tickets have corresponding seat selections
- **Modal Integration**: Opens seat selector in overlay modal

## User Flow

1. **Select Ticket Quantity**: Customer chooses number of tickets for each type
2. **Choose Seats**: "Chọn ghế ngồi" button appears, opening seat map modal
3. **Interactive Selection**: Click seats on visual map (limited by quantity)
4. **Confirmation**: Seat selections are saved and displayed
5. **Proceed**: Continue to order summary with seat information included

## Technical Implementation

### Seat Status Legend:
- 🟢 **Available**: Can be selected
- 🔵 **Selected**: Currently chosen by user
- 🔴 **Occupied**: Already sold/unavailable
- ⚪ **Hover**: Preview selection

### Seat ID Format:
- **Pattern**: `[Row Letter][Seat Number]` (e.g., "A1", "B5", "C12")
- **Sections**: Different pricing tiers with distinct row ranges

### Validation Rules:
- Must select exactly the quantity of seats matching ticket count
- Cannot select occupied seats
- Cannot exceed available seats per section

## Styling & UX

- **Dark Theme**: Consistent with app's black/gray color scheme
- **Color Coding**: Emerald for available, blue for selected, red for occupied
- **Responsive Design**: Works on mobile and desktop
- **Loading States**: Shows progress during seat operations
- **Error Handling**: Clear feedback for invalid selections

## Future Enhancements

1. **Backend Integration**: Connect to real seat availability API
2. **Seat Pricing**: Different prices for premium seat locations
3. **Group Selection**: Smart grouping for adjacent seats
4. **Accessibility**: Screen reader support and keyboard navigation
5. **Seat Recommendations**: Suggest best available seats

## Usage Example

```javascript
// In TicketSelectionPage
const handleSeatSelection = (ticketType) => {
  const quantity = ticketQuantities[ticketType.id] || 0;
  if (quantity === 0) {
    alert('Please select ticket quantity first');
    return;
  }
  setCurrentTicketForSeats(ticketType);
  setSeatSelectorOpen(true);
};

// Redux state update
dispatch(setSelectedSeats({
  ticketId: ticketType.id,
  seats: ['A1', 'A2', 'A3'] // Selected seat IDs
}));
```

The seat selection feature is now fully functional and integrated with the Redux state management system!
