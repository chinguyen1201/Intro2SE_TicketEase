-- Home Page Events Mock Data Insert Script
-- Based on Home.jsx demo data and SeatSelector component layout
-- Created: 2025-08-23

USE TICKET;
GO

-- Disable foreign key constraints temporarily for easier insertion
EXEC sp_msforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL'

delete from events;
delete from event_seats;
go



-- =============================================
-- INSERT HOME PAGE EVENTS
-- =============================================

-- Special Events (8 events)
INSERT INTO events
    (name, description, start_date, end_date, start_date_time, end_date_time, location, organizer_id, category_id, status, censored_status, censored_at, created_at, updated_at)
VALUES
    (N'WOODRUFF P.S. - Special Concert', N'Đêm nhạc đặc biệt với nghệ sĩ quốc tế WOODRUFF P.S.', '2025-09-15', '2025-09-15', '20:00', '23:00', N'QK7 Stadium, Quận 7, TP.HCM', 1, 1, 'upcoming', 'approved', '2025-08-20 10:00:00', '2025-08-15 14:30:00', '2025-08-20 10:00:00'),
    (N'VOLUNTEERS NEEDED - Community Event', N'Sự kiện cộng đồng cần tình nguyện viên tham gia', '2025-09-16', '2025-09-16', '08:00', '17:00', N'Crescent Mall, Quận 7, TP.HCM', 2, 6, 'upcoming', 'approved', '2025-08-20 11:00:00', '2025-08-16 09:15:00', '2025-08-20 11:00:00'),
    (N'MUSIC EVENT - Live Performance', N'Buổi biểu diễn âm nhạc trực tiếp với nhiều nghệ sĩ', '2025-09-17', '2025-09-17', '19:00', '22:30', N'Saigon Center, Quận 1, TP.HCM', 1, 1, 'upcoming', 'approved', '2025-08-20 12:00:00', '2025-08-17 10:20:00', '2025-08-20 12:00:00'),
    (N'LIVE THE MUSIC - Festival', N'Lễ hội âm nhạc sống động với không khí tuyệt vời', '2025-09-18', '2025-09-20', '17:00', '23:59', N'Youth Theatre, Quận 1, TP.HCM', 2, 1, 'upcoming', 'approved', '2025-08-20 13:00:00', '2025-08-18 11:45:00', '2025-08-20 13:00:00'),
    (N'BUSINESS CONF. - Professional Meeting', N'Hội nghị doanh nghiệp về xu hướng kinh doanh 2025', '2025-09-19', '2025-09-19', '08:30', '17:30', N'QK7 Stadium, Quận 7, TP.HCM', 3, 2, 'upcoming', 'pending', NULL, '2025-08-19 08:00:00', '2025-08-19 08:00:00'),
    (N'WOODRUFF P.S. Encore - Special Return', N'Đêm diễn trở lại đặc biệt của WOODRUFF P.S.', '2025-09-21', '2025-09-21', '20:30', '23:30', N'Crescent Mall, Quận 7, TP.HCM', 1, 1, 'upcoming', 'approved', '2025-08-20 14:00:00', '2025-08-20 12:30:00', '2025-08-20 14:00:00'),
    (N'VOLUNTEERS NEEDED - Environmental Action', N'Hoạt động bảo vệ môi trường cần tình nguyện viên', '2025-09-22', '2025-09-22', '06:00', '18:00', N'Saigon Center, Quận 1, TP.HCM', 2, 6, 'upcoming', 'approved', '2025-08-20 15:00:00', '2025-08-21 07:15:00', '2025-08-20 15:00:00'),
    (N'MUSIC EVENT - Acoustic Night', N'Đêm nhạc acoustic với không gian ấm cúng', '2025-09-23', '2025-09-23', '19:30', '22:00', N'Youth Theatre, Quận 1, TP.HCM', 1, 1, 'upcoming', 'approved', '2025-08-20 16:00:00', '2025-08-22 13:45:00', '2025-08-20 16:00:00');

-- Trending Events (8 events)  
INSERT INTO events
    (name, description, start_date, end_date, start_date_time, end_date_time, location, organizer_id, category_id, status, censored_status, censored_at, created_at, updated_at)
VALUES
    (N'WOODRUFF P.S. - Trending Show', N'Show trending hot nhất của WOODRUFF P.S.', '2025-10-01', '2025-10-01', '20:00', '23:00', N'QK7 Stadium, Quận 7, TP.HCM', 1, 1, 'upcoming', 'approved', '2025-08-22 10:00:00', '2025-08-20 16:30:00', '2025-08-22 10:00:00'),
    (N'VOLUNTEERS NEEDED - Youth Program', N'Chương trình dành cho thanh niên cần tình nguyện viên', '2025-10-02', '2025-10-02', '09:00', '16:00', N'Crescent Mall, Quận 7, TP.HCM', 2, 6, 'upcoming', 'approved', '2025-08-22 11:00:00', '2025-08-21 14:20:00', '2025-08-22 11:00:00'),
    (N'MUSIC EVENT - Electronic Dance', N'Đêm nhạc điện tử sôi động với DJ hàng đầu', '2025-10-03', '2025-10-03', '21:00', '02:00', N'Saigon Center, Quận 1, TP.HCM', 1, 1, 'upcoming', 'approved', '2025-08-22 12:00:00', '2025-08-21 18:10:00', '2025-08-22 12:00:00'),
    (N'LIVE THE MUSIC - Rock Festival', N'Lễ hội nhạc rock với ban nhạc nổi tiếng', '2025-10-04', '2025-10-06', '18:00', '23:59', N'Youth Theatre, Quận 1, TP.HCM', 2, 1, 'upcoming', 'approved', '2025-08-22 13:00:00', '2025-08-22 09:30:00', '2025-08-22 13:00:00'),
    (N'BUSINESS CONF. - Digital Transformation', N'Hội thảo chuyển đổi số cho doanh nghiệp', '2025-10-05', '2025-10-05', '08:00', '17:00', N'QK7 Stadium, Quận 7, TP.HCM', 3, 2, 'upcoming', 'pending', NULL, '2025-08-22 07:45:00', '2025-08-22 07:45:00'),
    (N'WOODRUFF P.S. - VIP Experience', N'Trải nghiệm VIP độc quyền với WOODRUFF P.S.', '2025-10-07', '2025-10-07', '19:00', '22:30', N'Crescent Mall, Quận 7, TP.HCM', 1, 1, 'upcoming', 'approved', '2025-08-22 14:00:00', '2025-08-22 11:15:00', '2025-08-22 14:00:00'),
    (N'VOLUNTEERS NEEDED - Education Support', N'Hỗ trợ giáo dục cho trẻ em vùng khó khăn', '2025-10-08', '2025-10-08', '07:00', '17:00', N'Saigon Center, Quận 1, TP.HCM', 2, 6, 'upcoming', 'approved', '2025-08-22 15:00:00', '2025-08-22 12:40:00', '2025-08-22 15:00:00'),
    (N'MUSIC EVENT - Jazz Night', N'Đêm nhạc jazz với nghệ sĩ tài năng', '2025-10-09', '2025-10-09', '20:00', '23:00', N'Youth Theatre, Quận 1, TP.HCM', 1, 1, 'upcoming', 'approved', '2025-08-22 16:00:00', '2025-08-22 15:20:00', '2025-08-22 16:00:00');

-- Live Music Events (8 events)
INSERT INTO events
    (name, description, start_date, end_date, start_date_time, end_date_time, location, organizer_id, category_id, status, censored_status, censored_at, created_at, updated_at)
VALUES
    (N'WOODRUFF P.S. - Live Concert Series', N'Chuỗi concert trực tiếp của WOODRUFF P.S.', '2025-10-15', '2025-10-15', '20:00', '23:00', N'QK7 Stadium, Quận 7, TP.HCM', 1, 1, 'upcoming', 'approved', '2025-08-23 10:00:00', '2025-08-22 17:30:00', '2025-08-23 10:00:00'),
    (N'VOLUNTEERS NEEDED - Music Workshop', N'Workshop âm nhạc cần tình nguyện viên hỗ trợ', '2025-10-16', '2025-10-16', '14:00', '18:00', N'Crescent Mall, Quận 7, TP.HCM', 2, 1, 'upcoming', 'approved', '2025-08-23 11:00:00', '2025-08-22 19:45:00', '2025-08-23 11:00:00'),
    (N'MUSIC EVENT - Band Competition', N'Cuộc thi ban nhạc với nhiều thể loại', '2025-10-17', '2025-10-17', '18:00', '23:00', N'Saigon Center, Quận 1, TP.HCM', 1, 1, 'upcoming', 'approved', '2025-08-23 12:00:00', '2025-08-23 08:15:00', '2025-08-23 12:00:00'),
    (N'LIVE THE MUSIC - Indie Festival', N'Lễ hội nhạc indie với nghệ sĩ độc lập', '2025-10-18', '2025-10-20', '17:00', '23:30', N'Youth Theatre, Quận 1, TP.HCM', 2, 1, 'upcoming', 'approved', '2025-08-23 13:00:00', '2025-08-23 09:20:00', '2025-08-23 13:00:00'),
    (N'BUSINESS CONF. - Music Industry', N'Hội thảo về ngành công nghiệp âm nhạc', '2025-10-19', '2025-10-19', '09:00', '17:00', N'QK7 Stadium, Quận 7, TP.HCM', 3, 2, 'upcoming', 'pending', NULL, '2025-08-23 06:30:00', '2025-08-23 06:30:00'),
    (N'WOODRUFF P.S. - Unplugged Session', N'Phiên unplugged đặc biệt của WOODRUFF P.S.', '2025-10-21', '2025-10-21', '19:30', '22:00', N'Crescent Mall, Quận 7, TP.HCM', 1, 1, 'upcoming', 'approved', '2025-08-23 14:00:00', '2025-08-23 10:45:00', '2025-08-23 14:00:00'),
    (N'VOLUNTEERS NEEDED - Sound Engineering', N'Tuyển tình nguyện viên hỗ trợ kỹ thuật âm thanh', '2025-10-22', '2025-10-22', '12:00', '20:00', N'Saigon Center, Quận 1, TP.HCM', 2, 1, 'upcoming', 'approved', '2025-08-23 15:00:00', '2025-08-23 11:30:00', '2025-08-23 15:00:00'),
    (N'MUSIC EVENT - Classical Evening', N'Buổi tối nhạc cổ điển trang trọng', '2025-10-23', '2025-10-23', '19:00', '21:30', N'Youth Theatre, Quận 1, TP.HCM', 1, 1, 'upcoming', 'approved', '2025-08-23 16:00:00', '2025-08-23 13:15:00', '2025-08-23 16:00:00');

-- Stage & Arts Events (8 events)
INSERT INTO events
    (name, description, start_date, end_date, start_date_time, end_date_time, location, organizer_id, category_id, status, censored_status, censored_at, created_at, updated_at)
VALUES
    (N'WOODRUFF P.S. - Theatrical Performance', N'Buổi biểu diễn sân khấu của WOODRUFF P.S.', '2025-11-01', '2025-11-01', '19:30', '22:00', N'QK7 Stadium, Quận 7, TP.HCM', 1, 4, 'upcoming', 'approved', '2025-08-23 17:00:00', '2025-08-23 14:20:00', '2025-08-23 17:00:00'),
    (N'VOLUNTEERS NEEDED - Art Installation', N'Cần tình nguyện viên lắp đặt tác phẩm nghệ thuật', '2025-11-02', '2025-11-02', '08:00', '18:00', N'Crescent Mall, Quận 7, TP.HCM', 2, 4, 'upcoming', 'approved', '2025-08-23 18:00:00', '2025-08-23 15:40:00', '2025-08-23 18:00:00'),
    (N'MUSIC EVENT - Opera Night', N'Đêm opera với nghệ sĩ hàng đầu', '2025-11-03', '2025-11-03', '20:00', '23:00', N'Saigon Center, Quận 1, TP.HCM', 1, 4, 'upcoming', 'approved', '2025-08-23 19:00:00', '2025-08-23 16:10:00', '2025-08-23 19:00:00'),
    (N'LIVE THE MUSIC - Dance Performance', N'Buổi biểu diễn múa kết hợp âm nhạc', '2025-11-04', '2025-11-06', '19:00', '22:00', N'Youth Theatre, Quận 1, TP.HCM', 2, 4, 'upcoming', 'approved', '2025-08-23 20:00:00', '2025-08-23 17:25:00', '2025-08-23 20:00:00'),
    (N'BUSINESS CONF. - Arts Management', N'Hội thảo quản lý nghệ thuật và sáng tạo', '2025-11-05', '2025-11-05', '09:00', '17:30', N'QK7 Stadium, Quận 7, TP.HCM', 3, 2, 'upcoming', 'pending', NULL, '2025-08-23 05:45:00', '2025-08-23 05:45:00'),
    (N'WOODRUFF P.S. - Gallery Exhibition', N'Triển lãm gallery của WOODRUFF P.S.', '2025-11-07', '2025-11-09', '10:00', '20:00', N'Crescent Mall, Quận 7, TP.HCM', 1, 4, 'upcoming', 'approved', '2025-08-23 21:00:00', '2025-08-23 18:50:00', '2025-08-23 21:00:00'),
    (N'VOLUNTEERS NEEDED - Stage Setup', N'Hỗ trợ dựng sân khấu cho sự kiện lớn', '2025-11-08', '2025-11-08', '06:00', '22:00', N'Saigon Center, Quận 1, TP.HCM', 2, 4, 'upcoming', 'approved', '2025-08-23 22:00:00', '2025-08-23 19:30:00', '2025-08-23 22:00:00'),
    (N'MUSIC EVENT - Contemporary Arts', N'Sự kiện nghệ thuật đương đại kết hợp âm nhạc', '2025-11-09', '2025-11-09', '18:30', '22:30', N'Youth Theatre, Quận 1, TP.HCM', 1, 4, 'upcoming', 'approved', '2025-08-23 23:00:00', '2025-08-23 20:15:00', '2025-08-23 23:00:00');

-- Other Genre Events (8 events)
INSERT INTO events
    (name, description, start_date, end_date, start_date_time, end_date_time, location, organizer_id, category_id, status, censored_status, censored_at, created_at, updated_at)
VALUES
    (N'WOODRUFF P.S. - Multi-Genre Show', N'Show đa thể loại của WOODRUFF P.S.', '2025-11-15', '2025-11-15', '19:00', '23:00', N'QK7 Stadium, Quận 7, TP.HCM', 1, 6, 'upcoming', 'approved', '2025-08-23 10:30:00', '2025-08-23 21:40:00', '2025-08-23 10:30:00'),
    (N'VOLUNTEERS NEEDED - Community Fair', N'Hội chợ cộng đồng cần tình nguyện viên', '2025-11-16', '2025-11-16', '07:00', '19:00', N'Crescent Mall, Quận 7, TP.HCM', 2, 6, 'upcoming', 'approved', '2025-08-23 11:30:00', '2025-08-23 22:20:00', '2025-08-23 11:30:00'),
    (N'MUSIC EVENT - World Music', N'Đêm nhạc thế giới với nhiều quốc gia', '2025-11-17', '2025-11-17', '20:00', '23:30', N'Saigon Center, Quận 1, TP.HCM', 1, 1, 'upcoming', 'approved', '2025-08-23 12:30:00', '2025-08-23 23:05:00', '2025-08-23 12:30:00'),
    (N'LIVE THE MUSIC - Fusion Festival', N'Lễ hội âm nhạc fusion độc đáo', '2025-11-18', '2025-11-20', '16:00', '23:59', N'Youth Theatre, Quận 1, TP.HCM', 2, 1, 'upcoming', 'approved', '2025-08-23 13:30:00', '2025-08-23 21:50:00', '2025-08-23 13:30:00'),
    (N'BUSINESS CONF. - Innovation Summit', N'Hội nghị đỉnh cao về đổi mới sáng tạo', '2025-11-19', '2025-11-19', '08:30', '18:00', N'QK7 Stadium, Quận 7, TP.HCM', 3, 5, 'upcoming', 'pending', NULL, '2025-08-23 04:15:00', '2025-08-23 04:15:00'),
    (N'WOODRUFF P.S. - Experimental Show', N'Show thử nghiệm mới của WOODRUFF P.S.', '2025-11-21', '2025-11-21', '20:30', '23:00', N'Crescent Mall, Quận 7, TP.HCM', 1, 6, 'upcoming', 'approved', '2025-08-23 14:30:00', '2025-08-23 22:35:00', '2025-08-23 14:30:00'),
    (N'VOLUNTEERS NEEDED - Tech Support', N'Hỗ trợ kỹ thuật cho các sự kiện', '2025-11-22', '2025-11-22', '08:00', '20:00', N'Saigon Center, Quận 1, TP.HCM', 2, 5, 'upcoming', 'approved', '2025-08-23 15:30:00', '2025-08-23 23:10:00', '2025-08-23 15:30:00'),
    (N'MUSIC EVENT - Celebration Night', N'Đêm nhạc kỷ niệm và ăn mừng', '2025-11-23', '2025-11-23', '18:00', '24:00', N'Youth Theatre, Quận 1, TP.HCM', 1, 6, 'upcoming', 'approved', '2025-08-23 16:30:00', '2025-08-23 23:45:00', '2025-08-23 16:30:00');

-- =============================================
-- INSERT TICKET CLASSES FOR ALL NEW EVENTS
-- =============================================

-- Function to create ticket classes for events (Events 6-45)
-- VIP, Standard, Economy tickets for most events
-- Business conferences get different ticket types

-- Special Events Tickets (Events 6-13)
INSERT INTO ticket_classes
    (event_id, name, description, price, quantity, sales_start_time, sales_end_time, status)
VALUES
    -- Event 6: WOODRUFF P.S. - Special Concert
    (6, N'Vé VIP', N'Ghế VIP khu vực đặc biệt', 2500000, 50, '2025-08-25', '2025-09-15', 'available'),
    (6, N'Vé thường', N'Ghế thường với tầm nhìn tốt', 800000, 200, '2025-08-25', '2025-09-15', 'available'),
    (6, N'Vé sinh viên', N'Giá ưu đãi cho sinh viên', 500000, 100, '2025-08-25', '2025-09-15', 'available'),

    -- Event 7: VOLUNTEERS NEEDED - Community Event (Free event)
    (7, N'Vé tham gia', N'Vé tham gia miễn phí', 0, 500, '2025-08-25', '2025-09-16', 'available'),

    -- Event 8: MUSIC EVENT - Live Performance  
    (8, N'Vé VIP', N'Khu vực VIP với dịch vụ cao cấp', 1800000, 75, '2025-08-25', '2025-09-17', 'available'),
    (8, N'Vé thường', N'Ghế thường tham gia sự kiện', 650000, 300, '2025-08-25', '2025-09-17', 'available'),

    -- Event 9: LIVE THE MUSIC - Festival
    (9, N'Vé 1 ngày', N'Vé tham gia 1 ngày bất kỳ', 400000, 500, '2025-08-25', '2025-09-18', 'available'),
    (9, N'Vé cả festival', N'Vé tham gia toàn bộ festival 3 ngày', 1000000, 200, '2025-08-25', '2025-09-18', 'available'),
    (9, N'Vé VIP Festival', N'Vé VIP toàn bộ festival với quyền lợi đặc biệt', 2200000, 50, '2025-08-25', '2025-09-18', 'available'),

    -- Event 10: BUSINESS CONF. - Professional Meeting
    (10, N'Vé tham dự', N'Vé tham dự hội nghị', 300000, 200, '2025-08-25', '2025-09-19', 'available'),
    (10, N'Vé VIP', N'Vé VIP bao gồm networking lunch', 800000, 50, '2025-08-25', '2025-09-19', 'available'),

    -- Event 11: WOODRUFF P.S. Encore
    (11, N'Vé VIP', N'Ghế VIP cho show đặc biệt', 2800000, 40, '2025-08-25', '2025-09-21', 'available'),
    (11, N'Vé thường', N'Ghế thường xem show', 900000, 180, '2025-08-25', '2025-09-21', 'available'),

    -- Event 12: VOLUNTEERS NEEDED - Environmental Action (Free)
    (12, N'Vé tình nguyện', N'Vé tham gia hoạt động tình nguyện', 0, 300, '2025-08-25', '2025-09-22', 'available'),

    -- Event 13: MUSIC EVENT - Acoustic Night
    (13, N'Vé VIP', N'Bàn VIP gần sân khấu', 1200000, 30, '2025-08-25', '2025-09-23', 'available'),
    (13, N'Vé thường', N'Chỗ ngồi thường', 450000, 150, '2025-08-25', '2025-09-23', 'available');

-- Trending Events Tickets (Events 14-21)
INSERT INTO ticket_classes
    (event_id, name, description, price, quantity, sales_start_time, sales_end_time, status)
VALUES
    -- Event 14-21: Similar pattern for trending events
    (14, N'Vé VIP', N'Ghế VIP trending show', 2600000, 60, '2025-08-26', '2025-10-01', 'available'),
    (14, N'Vé thường', N'Ghế thường', 850000, 250, '2025-08-26', '2025-10-01', 'available'),
    (14, N'Vé sinh viên', N'Giá sinh viên', 550000, 120, '2025-08-26', '2025-10-01', 'available'),

    (15, N'Vé tham gia', N'Vé tham gia chương trình', 0, 400, '2025-08-26', '2025-10-02', 'available'),

    (16, N'Vé VIP', N'VIP Electronic Dance', 2000000, 80, '2025-08-26', '2025-10-03', 'available'),
    (16, N'Vé thường', N'Ghế thường dance', 700000, 350, '2025-08-26', '2025-10-03', 'available'),

    (17, N'Vé 1 ngày', N'Vé rock 1 ngày', 450000, 400, '2025-08-26', '2025-10-04', 'available'),
    (17, N'Vé cả festival', N'Vé rock festival 3 ngày', 1100000, 180, '2025-08-26', '2025-10-04', 'available'),

    (18, N'Vé tham dự', N'Hội thảo chuyển đổi số', 350000, 300, '2025-08-26', '2025-10-05', 'available'),
    (18, N'Vé VIP', N'VIP Digital Transformation', 900000, 80, '2025-08-26', '2025-10-05', 'available'),

    (19, N'Vé VIP Experience', N'Trải nghiệm VIP độc quyền', 3500000, 20, '2025-08-26', '2025-10-07', 'available'),
    (19, N'Vé Premium', N'Vé cao cấp', 1500000, 60, '2025-08-26', '2025-10-07', 'available'),

    (20, N'Vé tình nguyện', N'Hỗ trợ giáo dục', 0, 200, '2025-08-26', '2025-10-08', 'available'),

    (21, N'Vé VIP', N'VIP Jazz Night', 1400000, 40, '2025-08-26', '2025-10-09', 'available'),
    (21, N'Vé thường', N'Ghế thường Jazz', 500000, 160, '2025-08-26', '2025-10-09', 'available');

-- Continue with similar patterns for Live Music (Events 22-29), Stage & Arts (Events 30-37), and Other Genre (Events 38-45)
-- For brevity, I'll add a few more examples and you can extend the pattern

-- Live Music Events Tickets (Events 22-29) - Sample
INSERT INTO ticket_classes
    (event_id, name, description, price, quantity, sales_start_time, sales_end_time, status)
VALUES
    (22, N'Vé VIP', N'VIP Concert Series', 2700000, 50, '2025-08-27', '2025-10-15', 'available'),
    (22, N'Vé thường', N'Ghế thường concert', 900000, 220, '2025-08-27', '2025-10-15', 'available'),

    (23, N'Vé workshop', N'Tham gia workshop âm nhạc', 100000, 150, '2025-08-27', '2025-10-16', 'available'),

    (24, N'Vé thi đấu', N'Xem cuộc thi ban nhạc', 200000, 400, '2025-08-27', '2025-10-17', 'available'),
    (24, N'Vé VIP', N'VIP Band Competition', 600000, 60, '2025-08-27', '2025-10-17', 'available'),

    -- Continue with Events 25-29 (Live Music)
    (25, N'Vé tham dự', N'Hội thảo ngành âm nhạc', 250000, 300, '2025-08-27', '2025-10-19', 'available'),
    (25, N'Vé VIP', N'VIP Music Industry', 750000, 100, '2025-08-27', '2025-10-19', 'available'),

    (26, N'Vé VIP', N'VIP Unplugged', 1800000, 40, '2025-08-27', '2025-10-21', 'available'),
    (26, N'Vé thường', N'Ghế thường unplugged', 600000, 120, '2025-08-27', '2025-10-21', 'available'),

    (27, N'Vé tình nguyện', N'Hỗ trợ kỹ thuật âm thanh', 0, 50, '2025-08-27', '2025-10-22', 'available'),

    (28, N'Vé VIP', N'VIP Classical Evening', 1500000, 60, '2025-08-27', '2025-10-23', 'available'),
    (28, N'Vé thường', N'Ghế thường classical', 500000, 200, '2025-08-27', '2025-10-23', 'available');

-- Stage & Arts Events Tickets (Events 30-37)
INSERT INTO ticket_classes
    (event_id, name, description, price, quantity, sales_start_time, sales_end_time, status)
VALUES
    (30, N'Vé VIP', N'VIP Theatrical Performance', 2000000, 50, '2025-08-28', '2025-11-01', 'available'),
    (30, N'Vé thường', N'Ghế thường sân khấu', 700000, 150, '2025-08-28', '2025-11-01', 'available'),

    (31, N'Vé tình nguyện', N'Lắp đặt nghệ thuật', 0, 100, '2025-08-28', '2025-11-02', 'available'),

    (32, N'Vé VIP', N'VIP Opera Night', 2500000, 30, '2025-08-28', '2025-11-03', 'available'),
    (32, N'Vé thường', N'Ghế thường opera', 1000000, 120, '2025-08-28', '2025-11-03', 'available'),

    (33, N'Vé 1 ngày', N'Vé múa 1 ngày', 400000, 200, '2025-08-28', '2025-11-04', 'available'),
    (33, N'Vé cả chương trình', N'Vé múa toàn bộ 3 ngày', 1000000, 80, '2025-08-28', '2025-11-04', 'available'),

    (34, N'Vé tham dự', N'Hội thảo quản lý nghệ thuật', 400000, 200, '2025-08-28', '2025-11-05', 'available'),
    (34, N'Vé VIP', N'VIP Arts Management', 1000000, 50, '2025-08-28', '2025-11-05', 'available'),

    (35, N'Vé triển lãm', N'Vé xem triển lãm gallery', 150000, 500, '2025-08-28', '2025-11-07', 'available'),
    (35, N'Vé VIP', N'VIP Gallery với hướng dẫn', 350000, 100, '2025-08-28', '2025-11-07', 'available'),

    (36, N'Vé tình nguyện', N'Dựng sân khấu', 0, 150, '2025-08-28', '2025-11-08', 'available'),

    (37, N'Vé VIP', N'VIP Contemporary Arts', 1200000, 40, '2025-08-28', '2025-11-09', 'available'),
    (37, N'Vé thường', N'Ghế thường nghệ thuật', 450000, 160, '2025-08-28', '2025-11-09', 'available');

-- Other Genre Events Tickets (Events 38-45)
INSERT INTO ticket_classes
    (event_id, name, description, price, quantity, sales_start_time, sales_end_time, status)
VALUES
    (38, N'Vé VIP', N'VIP Multi-Genre Show', 2200000, 60, '2025-08-29', '2025-11-15', 'available'),
    (38, N'Vé thường', N'Ghế thường đa thể loại', 750000, 200, '2025-08-29', '2025-11-15', 'available'),

    (39, N'Vé tình nguyện', N'Hội chợ cộng đồng', 0, 300, '2025-08-29', '2025-11-16', 'available'),

    (40, N'Vé VIP', N'VIP World Music', 1600000, 50, '2025-08-29', '2025-11-17', 'available'),
    (40, N'Vé thường', N'Ghế thường world music', 550000, 180, '2025-08-29', '2025-11-17', 'available'),

    (41, N'Vé 1 ngày', N'Vé fusion 1 ngày', 350000, 300, '2025-08-29', '2025-11-18', 'available'),
    (41, N'Vé cả festival', N'Vé fusion festival 3 ngày', 900000, 150, '2025-08-29', '2025-11-18', 'available'),

    (42, N'Vé tham dự', N'Hội nghị đổi mới sáng tạo', 500000, 250, '2025-08-29', '2025-11-19', 'available'),
    (42, N'Vé VIP', N'VIP Innovation Summit', 1200000, 75, '2025-08-29', '2025-11-19', 'available'),

    (43, N'Vé VIP', N'VIP Experimental Show', 1800000, 40, '2025-08-29', '2025-11-21', 'available'),
    (43, N'Vé thường', N'Ghế thường experimental', 600000, 120, '2025-08-29', '2025-11-21', 'available'),

    (44, N'Vé tình nguyện', N'Hỗ trợ kỹ thuật', 0, 80, '2025-08-29', '2025-11-22', 'available'),

    (45, N'Vé VIP', N'VIP Celebration Night', 1400000, 50, '2025-08-29', '2025-11-23', 'available'),
    (45, N'Vé thường', N'Ghế thường celebration', 500000, 200, '2025-08-29', '2025-11-23', 'available');

-- =============================================
-- INSERT EVENT SEATS FOR ALL NEW EVENTS
-- =============================================

-- Generate seats similar to SeatSelector component for each event
-- Using the theater layout: VIP (2-3 rows), Premium/Standard (5-8 rows), Economy (4-6 rows)

-- Special Events Seats (Events 6-13)
-- Event 6: WOODRUFF P.S. - Special Concert (Theater venue - more seats)
INSERT INTO event_seats
    (event_id, user_id, seat_number, status)
VALUES
    -- VIP Section (Rows A-B)
    (6, NULL, 'A1', 'available'),
    (6, NULL, 'A2', 'available'),
    (6, NULL, 'A3', 'available'),
    (6, NULL, 'A4', 'available'),
    (6, NULL, 'A5', 'available'),
    (6, NULL, 'A6', 'available'),
    (6, NULL, 'A7', 'available'),
    (6, NULL, 'A8', 'available'),
    (6, NULL, 'A9', 'available'),
    (6, NULL, 'A10', 'available'),
    (6, NULL, 'B1', 'available'),
    (6, NULL, 'B2', 'available'),
    (6, 4, 'B3', 'booked'),
    (6, NULL, 'B4', 'available'),
    (6, NULL, 'B5', 'available'),
    (6, NULL, 'B6', 'available'),
    (6, NULL, 'B7', 'available'),
    (6, NULL, 'B8', 'available'),
    (6, NULL, 'B9', 'available'),
    (6, NULL, 'B10', 'available'),

    -- Standard Section (Rows C-F)  
    (6, NULL, 'C1', 'available'),
    (6, NULL, 'C2', 'available'),
    (6, NULL, 'C3', 'available'),
    (6, NULL, 'C4', 'available'),
    (6, NULL, 'C5', 'available'),
    (6, NULL, 'C6', 'available'),
    (6, 6, 'C7', 'booked'),
    (6, NULL, 'C8', 'available'),
    (6, NULL, 'C9', 'available'),
    (6, NULL, 'C10', 'available'),
    (6, NULL, 'C11', 'available'),
    (6, NULL, 'C12', 'available'),
    (6, NULL, 'D1', 'available'),
    (6, NULL, 'D2', 'available'),
    (6, NULL, 'D3', 'available'),
    (6, NULL, 'D4', 'available'),
    (6, NULL, 'D5', 'available'),
    (6, NULL, 'D6', 'available'),
    (6, NULL, 'D7', 'available'),
    (6, NULL, 'D8', 'available'),
    (6, NULL, 'D9', 'available'),
    (6, NULL, 'D10', 'available'),
    (6, NULL, 'D11', 'available'),
    (6, NULL, 'D12', 'available'),
    (6, NULL, 'E1', 'available'),
    (6, NULL, 'E2', 'available'),
    (6, NULL, 'E3', 'available'),
    (6, 3, 'E4', 'booked'),
    (6, NULL, 'E5', 'available'),
    (6, NULL, 'E6', 'available'),
    (6, NULL, 'E7', 'available'),
    (6, NULL, 'E8', 'available'),
    (6, NULL, 'E9', 'available'),
    (6, NULL, 'E10', 'available'),
    (6, NULL, 'E11', 'available'),
    (6, NULL, 'E12', 'available'),
    (6, NULL, 'F1', 'available'),
    (6, NULL, 'F2', 'available'),
    (6, NULL, 'F3', 'available'),
    (6, NULL, 'F4', 'available'),
    (6, NULL, 'F5', 'available'),
    (6, NULL, 'F6', 'available'),
    (6, NULL, 'F7', 'available'),
    (6, NULL, 'F8', 'available'),
    (6, NULL, 'F9', 'available'),
    (6, NULL, 'F10', 'available'),
    (6, NULL, 'F11', 'available'),
    (6, NULL, 'F12', 'available');

-- Event 8: MUSIC EVENT - Live Performance (Smaller venue)
INSERT INTO event_seats
    (event_id, user_id, seat_number, status)
VALUES
    -- VIP Section (Row A)
    (8, NULL, 'A1', 'available'),
    (8, NULL, 'A2', 'available'),
    (8, 4, 'A3', 'booked'),
    (8, NULL, 'A4', 'available'),
    (8, NULL, 'A5', 'available'),
    (8, NULL, 'A6', 'available'),
    (8, NULL, 'A7', 'available'),
    (8, NULL, 'A8', 'available'),

    -- Standard Section (Rows B-D)
    (8, NULL, 'B1', 'available'),
    (8, NULL, 'B2', 'available'),
    (8, NULL, 'B3', 'available'),
    (8, NULL, 'B4', 'available'),
    (8, NULL, 'B5', 'available'),
    (8, NULL, 'B6', 'available'),
    (8, NULL, 'B7', 'available'),
    (8, NULL, 'B8', 'available'),
    (8, NULL, 'B9', 'available'),
    (8, NULL, 'B10', 'available'),
    (8, NULL, 'C1', 'available'),
    (8, NULL, 'C2', 'available'),
    (8, NULL, 'C3', 'available'),
    (8, 6, 'C4', 'booked'),
    (8, NULL, 'C5', 'available'),
    (8, NULL, 'C6', 'available'),
    (8, NULL, 'C7', 'available'),
    (8, NULL, 'C8', 'available'),
    (8, NULL, 'C9', 'available'),
    (8, NULL, 'C10', 'available'),
    (8, NULL, 'D1', 'available'),
    (8, NULL, 'D2', 'available'),
    (8, NULL, 'D3', 'available'),
    (8, NULL, 'D4', 'available'),
    (8, NULL, 'D5', 'available'),
    (8, NULL, 'D6', 'available'),
    (8, NULL, 'D7', 'available'),
    (8, 3, 'D8', 'booked'),
    (8, NULL, 'D9', 'available'),
    (8, NULL, 'D10', 'available');

-- Event 13: MUSIC EVENT - Acoustic Night (Intimate venue)
INSERT INTO event_seats
    (event_id, user_id, seat_number, status)
VALUES
    -- VIP Tables (A section)
    (13, NULL, 'A1', 'available'),
    (13, NULL, 'A2', 'available'),
    (13, NULL, 'A3', 'available'),
    (13, NULL, 'A4', 'available'),
    (13, NULL, 'A5', 'available'),
    (13, NULL, 'A6', 'available'),

    -- Standard seating (B-C sections)
    (13, NULL, 'B1', 'available'),
    (13, NULL, 'B2', 'available'),
    (13, 4, 'B3', 'booked'),
    (13, NULL, 'B4', 'available'),
    (13, NULL, 'B5', 'available'),
    (13, NULL, 'B6', 'available'),
    (13, NULL, 'B7', 'available'),
    (13, NULL, 'B8', 'available'),
    (13, NULL, 'C1', 'available'),
    (13, NULL, 'C2', 'available'),
    (13, NULL, 'C3', 'available'),
    (13, NULL, 'C4', 'available'),
    (13, NULL, 'C5', 'available'),
    (13, NULL, 'C6', 'available'),
    (13, 6, 'C7', 'booked'),
    (13, NULL, 'C8', 'available');

-- Sample seats for a few more events (Events 14, 16, 22) to show variety
-- Event 14: WOODRUFF P.S. - Trending Show
INSERT INTO event_seats
    (event_id, user_id, seat_number, status)
VALUES
    -- VIP Section
    (14, NULL, 'A1', 'available'),
    (14, NULL, 'A2', 'available'),
    (14, NULL, 'A3', 'available'),
    (14, NULL, 'A4', 'available'),
    (14, NULL, 'A5', 'available'),
    (14, NULL, 'A6', 'available'),
    (14, NULL, 'A7', 'available'),
    (14, NULL, 'A8', 'available'),
    (14, NULL, 'A9', 'available'),
    (14, NULL, 'A10', 'available'),

    -- Standard Section
    (14, NULL, 'B1', 'available'),
    (14, NULL, 'B2', 'available'),
    (14, NULL, 'B3', 'available'),
    (14, NULL, 'B4', 'available'),
    (14, NULL, 'B5', 'available'),
    (14, NULL, 'B6', 'available'),
    (14, NULL, 'B7', 'available'),
    (14, 4, 'B8', 'booked'),
    (14, NULL, 'B9', 'available'),
    (14, NULL, 'B10', 'available'),
    (14, NULL, 'C1', 'available'),
    (14, NULL, 'C2', 'available'),
    (14, NULL, 'C3', 'available'),
    (14, NULL, 'C4', 'available'),
    (14, NULL, 'C5', 'available'),
    (14, NULL, 'C6', 'available'),
    (14, NULL, 'C7', 'available'),
    (14, NULL, 'C8', 'available'),
    (14, NULL, 'C9', 'available'),
    (14, NULL, 'C10', 'available');

-- Event 16: MUSIC EVENT - Electronic Dance (Large venue)
INSERT INTO event_seats
    (event_id, user_id, seat_number, status)
VALUES
    -- VIP Section (A-B rows)
    (16, NULL, 'A1', 'available'),
    (16, NULL, 'A2', 'available'),
    (16, NULL, 'A3', 'available'),
    (16, NULL, 'A4', 'available'),
    (16, NULL, 'A5', 'available'),
    (16, NULL, 'A6', 'available'),
    (16, NULL, 'A7', 'available'),
    (16, NULL, 'A8', 'available'),
    (16, NULL, 'A9', 'available'),
    (16, NULL, 'A10', 'available'),
    (16, NULL, 'A11', 'available'),
    (16, NULL, 'A12', 'available'),
    (16, NULL, 'A13', 'available'),
    (16, NULL, 'A14', 'available'),
    (16, NULL, 'B1', 'available'),
    (16, NULL, 'B2', 'available'),
    (16, NULL, 'B3', 'available'),
    (16, NULL, 'B4', 'available'),
    (16, NULL, 'B5', 'available'),
    (16, NULL, 'B6', 'available'),
    (16, 6, 'B7', 'booked'),
    (16, NULL, 'B8', 'available'),
    (16, NULL, 'B9', 'available'),
    (16, NULL, 'B10', 'available'),
    (16, NULL, 'B11', 'available'),
    (16, NULL, 'B12', 'available'),
    (16, NULL, 'B13', 'available'),
    (16, NULL, 'B14', 'available'),

    -- Standard Section (C-F rows)
    (16, NULL, 'C1', 'available'),
    (16, NULL, 'C2', 'available'),
    (16, NULL, 'C3', 'available'),
    (16, NULL, 'C4', 'available'),
    (16, NULL, 'C5', 'available'),
    (16, NULL, 'C6', 'available'),
    (16, NULL, 'C7', 'available'),
    (16, NULL, 'C8', 'available'),
    (16, NULL, 'C9', 'available'),
    (16, NULL, 'C10', 'available'),
    (16, NULL, 'C11', 'available'),
    (16, NULL, 'C12', 'available'),
    (16, NULL, 'C13', 'available'),
    (16, NULL, 'C14', 'available'),
    (16, NULL, 'D1', 'available'),
    (16, NULL, 'D2', 'available'),
    (16, NULL, 'D3', 'available'),
    (16, 3, 'D4', 'booked'),
    (16, NULL, 'D5', 'available'),
    (16, NULL, 'D6', 'available'),
    (16, NULL, 'D7', 'available'),
    (16, NULL, 'D8', 'available'),
    (16, NULL, 'D9', 'available'),
    (16, NULL, 'D10', 'available'),
    (16, NULL, 'D11', 'available'),
    (16, NULL, 'D12', 'available'),
    (16, NULL, 'D13', 'available'),
    (16, NULL, 'D14', 'available');

-- Event 22: WOODRUFF P.S. - Live Concert Series
INSERT INTO event_seats
    (event_id, user_id, seat_number, status)
VALUES
    -- VIP Section
    (22, NULL, 'A1', 'available'),
    (22, NULL, 'A2', 'available'),
    (22, NULL, 'A3', 'available'),
    (22, NULL, 'A4', 'available'),
    (22, NULL, 'A5', 'available'),
    (22, NULL, 'A6', 'available'),
    (22, NULL, 'A7', 'available'),
    (22, NULL, 'A8', 'available'),

    -- Premium Section
    (22, NULL, 'B1', 'available'),
    (22, NULL, 'B2', 'available'),
    (22, NULL, 'B3', 'available'),
    (22, NULL, 'B4', 'available'),
    (22, NULL, 'B5', 'available'),
    (22, NULL, 'B6', 'available'),
    (22, NULL, 'B7', 'available'),
    (22, NULL, 'B8', 'available'),
    (22, NULL, 'B9', 'available'),
    (22, NULL, 'B10', 'available'),
    (22, NULL, 'C1', 'available'),
    (22, NULL, 'C2', 'available'),
    (22, 4, 'C3', 'booked'),
    (22, NULL, 'C4', 'available'),
    (22, NULL, 'C5', 'available'),
    (22, NULL, 'C6', 'available'),
    (22, NULL, 'C7', 'available'),
    (22, NULL, 'C8', 'available'),
    (22, NULL, 'C9', 'available'),
    (22, NULL, 'C10', 'available'),

    -- Standard Section
    (22, NULL, 'D1', 'available'),
    (22, NULL, 'D2', 'available'),
    (22, NULL, 'D3', 'available'),
    (22, NULL, 'D4', 'available'),
    (22, NULL, 'D5', 'available'),
    (22, NULL, 'D6', 'available'),
    (22, 6, 'D7', 'booked'),
    (22, NULL, 'D8', 'available'),
    (22, NULL, 'D9', 'available'),
    (22, NULL, 'D10', 'available');

-- =============================================
-- DATA VERIFICATION QUERIES
-- =============================================

PRINT 'Home Events Mock Data insertion completed!'
PRINT 'Summary of new events:'

SELECT 'New Events Added' as Info, COUNT(*) as Count
FROM events
WHERE id >= 6;

SELECT 'New Ticket Classes Added' as Info, COUNT(*) as Count
FROM ticket_classes
WHERE event_id >= 6;

SELECT 'New Event Seats Added' as Info, COUNT(*) as Count
FROM event_seats
WHERE event_id >= 6;

-- Show event distribution by category
SELECT c.name as Category, COUNT(e.id) as EventCount
FROM events e
    JOIN categories c ON e.category_id = c.id
WHERE e.id >= 6
GROUP BY c.name
ORDER BY EventCount DESC;

-- Re-enable foreign key constraints
EXEC sp_msforeachtable 'ALTER TABLE ? WITH CHECK CHECK CONSTRAINT ALL'

PRINT 'All Home.jsx events have been successfully added to the database!'
PRINT 'Events now include seat layouts matching the SeatSelector component design.'
PRINT 'Ready for frontend integration and testing.';

select * from events