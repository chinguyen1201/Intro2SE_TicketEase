// Seat Selection Component for Event Ticket Booking
import React, { useState, useEffect } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

const SeatSelector = ({
    ticketType,
    selectedQuantity,
    onSeatsChange,
    venue = 'default',
    isOpen,
    onClose
}) => {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [hoveredSeat, setHoveredSeat] = useState(null);

    // Generate seat layout based on venue type
    const generateSeatLayout = (venueType) => {
        switch (venueType) {
            case 'theater':
                return {
                    sections: [
                        { name: 'VIP', rows: 3, seatsPerRow: 10, startRow: 'A', price: 2500000 },
                        { name: 'Premium', rows: 5, seatsPerRow: 12, startRow: 'D', price: 1500000 },
                        { name: 'Standard', rows: 8, seatsPerRow: 14, startRow: 'I', price: 800000 }
                    ]
                };
            default:
                return {
                    sections: [
                        { name: 'VIP', rows: 2, seatsPerRow: 8, startRow: 'A', price: 2500000 },
                        { name: 'Standard', rows: 6, seatsPerRow: 10, startRow: 'C', price: 800000 },
                        { name: 'Economy', rows: 4, seatsPerRow: 12, startRow: 'I', price: 500000 }
                    ]
                };
        }
    };

    const seatLayout = generateSeatLayout(venue);

    // Sample occupied seats (in a real app, this would come from the backend)
    const occupiedSeats = [
        'A1', 'A2', 'B5', 'C3', 'C4', 'D8', 'E10', 'F2', 'G7', 'H12', 'I5', 'J9'
    ];

    // Generate seat ID from row and seat number
    const getSeatId = (rowLetter, seatNumber) => `${rowLetter}${seatNumber}`;

    // Check if seat is occupied
    const isSeatOccupied = (seatId) => occupiedSeats.includes(seatId);

    // Check if seat is selected
    const isSeatSelected = (seatId) => selectedSeats.includes(seatId);

    // Get seat status class
    const getSeatStatusClass = (seatId) => {
        if (isSeatOccupied(seatId)) return 'seat-occupied';
        if (isSeatSelected(seatId)) return 'seat-selected';
        if (hoveredSeat === seatId) return 'seat-hover';
        return 'seat-available';
    };

    // Handle seat click
    const handleSeatClick = (seatId) => {
        if (isSeatOccupied(seatId)) return;

        let newSelectedSeats;
        if (isSeatSelected(seatId)) {
            // Deselect seat
            newSelectedSeats = selectedSeats.filter(seat => seat !== seatId);
        } else {
            // Select seat (check if we can select more)
            if (selectedSeats.length >= selectedQuantity) {
                alert(`Bạn chỉ có thể chọn tối đa ${selectedQuantity} ghế cho loại vé này`);
                return;
            }
            newSelectedSeats = [...selectedSeats, seatId];
        }

        setSelectedSeats(newSelectedSeats);
        onSeatsChange(newSelectedSeats);
    };

    // Reset selected seats when quantity changes
    useEffect(() => {
        if (selectedSeats.length > selectedQuantity) {
            const trimmedSeats = selectedSeats.slice(0, selectedQuantity);
            setSelectedSeats(trimmedSeats);
            onSeatsChange(trimmedSeats);
        }
    }, [selectedQuantity]);

    // Clear selections when component closes
    useEffect(() => {
        if (!isOpen) {
            setSelectedSeats([]);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <div>
                        <h2 className="text-xl font-bold text-white">Chọn ghế ngồi</h2>
                        <p className="text-gray-400 mt-1">
                            Loại vé: {ticketType?.name} - Số lượng: {selectedQuantity}
                        </p>
                        <p className="text-sm text-emerald-400 mt-1">
                            Đã chọn: {selectedSeats.length}/{selectedQuantity} ghế
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Seat Map */}
                <div className="p-6">
                    {/* Stage indicator */}
                    <div className="text-center mb-8">
                        <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-2 px-8 rounded-lg inline-block font-semibold">
                            🎭 SÂN KHẤU 🎭
                        </div>
                    </div>

                    {/* Seat Legend */}
                    <div className="flex justify-center gap-6 mb-6 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                            <span className="text-gray-300">Có thể chọn</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-500 rounded"></div>
                            <span className="text-gray-300">Đã chọn</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-500 rounded"></div>
                            <span className="text-gray-300">Đã bán</span>
                        </div>
                    </div>

                    {/* Seat Sections */}
                    <div className="space-y-8">
                        {seatLayout.sections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="text-center">
                                {/* Section Header */}
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-emerald-400 mb-1">
                                        Khu vực {section.name}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        {section.price.toLocaleString('vi-VN')} VNĐ
                                    </p>
                                </div>

                                {/* Seat Rows */}
                                <div className="space-y-2">
                                    {Array.from({ length: section.rows }, (_, rowIndex) => {
                                        const rowLetter = String.fromCharCode(section.startRow.charCodeAt(0) + rowIndex);

                                        return (
                                            <div key={rowIndex} className="flex justify-center items-center gap-1">
                                                {/* Row Label */}
                                                <div className="w-8 text-gray-400 text-sm font-mono">
                                                    {rowLetter}
                                                </div>

                                                {/* Seats */}
                                                <div className="flex gap-1">
                                                    {Array.from({ length: section.seatsPerRow }, (_, seatIndex) => {
                                                        const seatNumber = seatIndex + 1;
                                                        const seatId = getSeatId(rowLetter, seatNumber);
                                                        const statusClass = getSeatStatusClass(seatId);

                                                        return (
                                                            <button
                                                                key={seatIndex}
                                                                className={`seat ${statusClass}`}
                                                                onClick={() => handleSeatClick(seatId)}
                                                                onMouseEnter={() => setHoveredSeat(seatId)}
                                                                onMouseLeave={() => setHoveredSeat(null)}
                                                                disabled={isSeatOccupied(seatId)}
                                                                title={`Ghế ${seatId} - ${section.name}`}
                                                            >
                                                                {isSeatSelected(seatId) && (
                                                                    <FiCheck size={10} className="text-white" />
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {/* Aisle space in the middle for larger rows */}
                                                {section.seatsPerRow > 10 && (
                                                    <div className="w-4"></div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-700 bg-gray-800">
                    <div className="text-sm text-gray-300">
                        <p>Ghế đã chọn: {selectedSeats.join(', ') || 'Chưa chọn ghế nào'}</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                setSelectedSeats([]);
                                onSeatsChange([]);
                            }}
                            className="px-4 py-2 text-gray-400 hover:text-white border border-gray-600 rounded-lg hover:bg-gray-700"
                        >
                            Xóa hết
                        </button>
                        <button
                            onClick={onClose}
                            disabled={selectedSeats.length !== selectedQuantity}
                            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium"
                        >
                            Xác nhận ({selectedSeats.length}/{selectedQuantity})
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .seat {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: 1px solid #374151;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 10px;
        }

        .seat-available {
          background-color: #10b981;
          border-color: #059669;
        }

        .seat-available:hover,
        .seat-hover {
          background-color: #34d399;
          transform: scale(1.1);
        }

        .seat-selected {
          background-color: #3b82f6;
          border-color: #2563eb;
        }

        .seat-occupied {
          background-color: #ef4444;
          border-color: #dc2626;
          cursor: not-allowed;
        }

        .seat-occupied:hover {
          transform: none;
        }
      `}</style>
        </div>
    );
};

export default SeatSelector;
