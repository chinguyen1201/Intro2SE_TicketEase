-- TicketEase Database Mock Data Insert Script
-- Based on SQLModel definitions and frontend virtual data
-- Created: 2025-08-22

USE TICKET;
GO


-- Disable foreign key constraints temporarily for easier insertion
EXEC sp_msforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL'

-- Clear existing data (in proper order to avoid FK violations)
DELETE FROM tickets;
DELETE FROM orders;
DELETE FROM event_seats;
DELETE FROM ticket_classes;
DELETE FROM events;
DELETE FROM event_organizers;
DELETE FROM jwt_tokens;
DELETE FROM payment_method;
DELETE FROM banks;
DELETE FROM categories;

-- Reset identity columns
IF EXISTS(SELECT 1
FROM sys.identity_columns
WHERE OBJECT_NAME(object_id) = 'categories')
    DBCC CHECKIDENT('categories', RESEED, 0);
IF EXISTS(SELECT 1
FROM sys.identity_columns
WHERE OBJECT_NAME(object_id) = 'banks')
    DBCC CHECKIDENT('banks', RESEED, 0);
IF EXISTS(SELECT 1
FROM sys.identity_columns
WHERE OBJECT_NAME(object_id) = 'payment_method')
    DBCC CHECKIDENT('payment_method', RESEED, 0);
-- IF EXISTS(SELECT 1
-- FROM sys.identity_columns
-- WHERE OBJECT_NAME(object_id) = 'users')
--     DBCC CHECKIDENT('users', RESEED, 0);
IF EXISTS(SELECT 1
FROM sys.identity_columns
WHERE OBJECT_NAME(object_id) = 'event_organizers')
    DBCC CHECKIDENT('event_organizers', RESEED, 0);
IF EXISTS(SELECT 1
FROM sys.identity_columns
WHERE OBJECT_NAME(object_id) = 'events')
    DBCC CHECKIDENT('events', RESEED, 0);
IF EXISTS(SELECT 1
FROM sys.identity_columns
WHERE OBJECT_NAME(object_id) = 'ticket_classes')
    DBCC CHECKIDENT('ticket_classes', RESEED, 0);
IF EXISTS(SELECT 1
FROM sys.identity_columns
WHERE OBJECT_NAME(object_id) = 'orders')
    DBCC CHECKIDENT('orders', RESEED, 0);
IF EXISTS(SELECT 1
FROM sys.identity_columns
WHERE OBJECT_NAME(object_id) = 'tickets')
    DBCC CHECKIDENT('tickets', RESEED, 0);
IF EXISTS(SELECT 1
FROM sys.identity_columns
WHERE OBJECT_NAME(object_id) = 'event_seats')
    DBCC CHECKIDENT('event_seats', RESEED, 0);
IF EXISTS(SELECT 1
FROM sys.identity_columns
WHERE OBJECT_NAME(object_id) = 'jwt_tokens')
    DBCC CHECKIDENT('jwt_tokens', RESEED, 0);

-- =============================================
-- CREATE/ALTER TABLE STRUCTURE TO MATCH MODELS
-- =============================================

-- Ensure CATEGORIES table has all required columns
IF NOT EXISTS (SELECT *
FROM sys.tables
WHERE name = 'categories')
BEGIN
    CREATE TABLE categories
    (
        id int IDENTITY(1,1) PRIMARY KEY,
        name nvarchar(100) NOT NULL,
        description nvarchar(255)
    );
END
ELSE
BEGIN
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('categories') AND name = 'name')
        ALTER TABLE categories ADD name nvarchar(100) NOT NULL DEFAULT '';
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('categories') AND name = 'description')
        ALTER TABLE categories ADD description nvarchar(255);
END

-- Ensure BANKS table has all required columns  
IF NOT EXISTS (SELECT *
FROM sys.tables
WHERE name = 'banks')
BEGIN
    CREATE TABLE banks
    (
        id int IDENTITY(1,1) PRIMARY KEY,
        name nvarchar(255) NOT NULL,
        short_name nvarchar(50) NOT NULL
    );
END
ELSE
BEGIN
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('banks') AND name = 'name')
        ALTER TABLE banks ADD name nvarchar(255) NOT NULL DEFAULT '';
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('banks') AND name = 'short_name')
        ALTER TABLE banks ADD short_name nvarchar(50) NOT NULL DEFAULT '';
END

-- Ensure PAYMENT_METHOD table has all required columns
IF NOT EXISTS (SELECT *
FROM sys.tables
WHERE name = 'payment_method')
BEGIN
    CREATE TABLE payment_method
    (
        id int IDENTITY(1,1) PRIMARY KEY,
        name nvarchar(100) NOT NULL,
        description nvarchar(255),
        status nvarchar(20) NOT NULL
    );
END
ELSE
BEGIN
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('payment_method') AND name = 'name')
        ALTER TABLE payment_method ADD name nvarchar(100) NOT NULL DEFAULT '';
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('payment_method') AND name = 'description')
        ALTER TABLE payment_method ADD description nvarchar(255);
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('payment_method') AND name = 'status')
        ALTER TABLE payment_method ADD status nvarchar(20) NOT NULL DEFAULT 'active';
END

-- Ensure EVENT_ORGANIZERS table has all required columns
IF NOT EXISTS (SELECT *
FROM sys.tables
WHERE name = 'event_organizers')
BEGIN
    CREATE TABLE event_organizers
    (
        id int IDENTITY(1,1) PRIMARY KEY,
        user_id int,
        name nvarchar(255) NOT NULL,
        tin nvarchar(20) NOT NULL,
        bank_id int,
        payment_method_id int,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (bank_id) REFERENCES banks(id),
        FOREIGN KEY (payment_method_id) REFERENCES payment_method(id)
    );
END
ELSE
BEGIN
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('event_organizers') AND name = 'user_id')
        ALTER TABLE event_organizers ADD user_id int;
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('event_organizers') AND name = 'name')
        ALTER TABLE event_organizers ADD name nvarchar(255) NOT NULL DEFAULT '';
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('event_organizers') AND name = 'tin')
        ALTER TABLE event_organizers ADD tin nvarchar(20) NOT NULL DEFAULT '';
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('event_organizers') AND name = 'bank_id')
        ALTER TABLE event_organizers ADD bank_id int;
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('event_organizers') AND name = 'payment_method_id')
        ALTER TABLE event_organizers ADD payment_method_id int;
END

select *
from event_organizers;

-- Ensure EVENTS table has all required columns
IF NOT EXISTS (SELECT *
FROM sys.tables
WHERE name = 'events')
BEGIN
    CREATE TABLE events
    (
        id int IDENTITY(1,1) PRIMARY KEY,
        name nvarchar(255) NOT NULL,
        description nvarchar(255),
        start_date nvarchar(10) NOT NULL,
        end_date nvarchar(10) NOT NULL,
        start_date_time nvarchar(5) NOT NULL,
        end_date_time nvarchar(5) NOT NULL,
        location nvarchar(255) NOT NULL,
        organizer_id int,
        category_id int,
        status nvarchar(20),
        censored_status nvarchar(20) DEFAULT 'Pending',
        censored_at nvarchar(19),
        created_at nvarchar(19) DEFAULT CONVERT(varchar(19), GETDATE(), 120),
        updated_at nvarchar(19) DEFAULT CONVERT(varchar(19), GETDATE(), 120),
        FOREIGN KEY (organizer_id) REFERENCES event_organizers(id),
        FOREIGN KEY (category_id) REFERENCES categories(id)
    );
END
ELSE
BEGIN
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('events') AND name = 'name')
        ALTER TABLE events ADD name nvarchar(255) NOT NULL DEFAULT '';
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('events') AND name = 'description')
        ALTER TABLE events ADD description nvarchar(255);
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('events') AND name = 'start_date')
        ALTER TABLE events ADD start_date nvarchar(10) NOT NULL DEFAULT '2025-01-01';
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('events') AND name = 'end_date')
        ALTER TABLE events ADD end_date nvarchar(10) NOT NULL DEFAULT '2025-01-01';
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('events') AND name = 'start_date_time')
        ALTER TABLE events ADD start_date_time nvarchar(5) NOT NULL DEFAULT '00:00';
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('events') AND name = 'end_date_time')
        ALTER TABLE events ADD end_date_time nvarchar(5) NOT NULL DEFAULT '23:59';
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('events') AND name = 'location')
        ALTER TABLE events ADD location nvarchar(255) NOT NULL DEFAULT '';
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('events') AND name = 'organizer_id')
        ALTER TABLE events ADD organizer_id int;
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('events') AND name = 'category_id')
        ALTER TABLE events ADD category_id int;
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('events') AND name = 'status')
        ALTER TABLE events ADD status nvarchar(20);
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('events') AND name = 'censored_status')
        ALTER TABLE events ADD censored_status nvarchar(20) DEFAULT 'Pending';
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('events') AND name = 'censored_at')
        ALTER TABLE events ADD censored_at nvarchar(19);
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('events') AND name = 'created_at')
        ALTER TABLE events ADD created_at nvarchar(19) DEFAULT CONVERT(varchar(19), GETDATE(), 120);
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('events') AND name = 'updated_at')
        ALTER TABLE events ADD updated_at nvarchar(19) DEFAULT CONVERT(varchar(19), GETDATE(), 120);
END

-- Ensure TICKET_CLASSES table has all required columns
IF NOT EXISTS (SELECT *
FROM sys.tables
WHERE name = 'ticket_classes')
BEGIN
    CREATE TABLE ticket_classes
    (
        id int IDENTITY(1,1) PRIMARY KEY,
        event_id int,
        name nvarchar(255) NOT NULL,
        description nvarchar(255),
        price float DEFAULT 0.0,
        quantity int DEFAULT 0,
        sales_start_time nvarchar(10),
        sales_end_time nvarchar(10),
        status nvarchar(20),
        FOREIGN KEY (event_id) REFERENCES events(id)
    );
END
ELSE
BEGIN
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('ticket_classes') AND name = 'event_id')
        ALTER TABLE ticket_classes ADD event_id int;
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('ticket_classes') AND name = 'name')
        ALTER TABLE ticket_classes ADD name nvarchar(255) NOT NULL DEFAULT '';
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('ticket_classes') AND name = 'description')
        ALTER TABLE ticket_classes ADD description nvarchar(255);
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('ticket_classes') AND name = 'price')
        ALTER TABLE ticket_classes ADD price float DEFAULT 0.0;
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('ticket_classes') AND name = 'quantity')
        ALTER TABLE ticket_classes ADD quantity int DEFAULT 0;
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('ticket_classes') AND name = 'sales_start_time')
        ALTER TABLE ticket_classes ADD sales_start_time nvarchar(10);
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('ticket_classes') AND name = 'sales_end_time')
        ALTER TABLE ticket_classes ADD sales_end_time nvarchar(10);
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('ticket_classes') AND name = 'status')
        ALTER TABLE ticket_classes ADD status nvarchar(20);
END

-- Ensure EVENT_SEATS table has all required columns
IF NOT EXISTS (SELECT *
FROM sys.tables
WHERE name = 'event_seats')
BEGIN
    CREATE TABLE event_seats
    (
        id int IDENTITY(1,1) PRIMARY KEY,
        event_id int,
        user_id int NULL,
        seat_number nvarchar(10) NOT NULL,
        status nvarchar(20) NOT NULL,
        FOREIGN KEY (event_id) REFERENCES events(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
END
ELSE
BEGIN
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('event_seats') AND name = 'event_id')
        ALTER TABLE event_seats ADD event_id int;
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('event_seats') AND name = 'user_id')
        ALTER TABLE event_seats ADD user_id int NULL;
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('event_seats') AND name = 'seat_number')
        ALTER TABLE event_seats ADD seat_number nvarchar(10) NOT NULL DEFAULT '';
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('event_seats') AND name = 'status')
        ALTER TABLE event_seats ADD status nvarchar(20) NOT NULL DEFAULT 'available';

    -- Ensure user_id column allows NULL values if it already exists
    IF EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('event_seats') AND name = 'user_id' AND is_nullable = 0)
        ALTER TABLE event_seats ALTER COLUMN user_id int NULL;
END

-- Ensure ORDERS table has all required columns
IF NOT EXISTS (SELECT *
FROM sys.tables
WHERE name = 'orders')
BEGIN
    CREATE TABLE orders
    (
        id int IDENTITY(1,1) PRIMARY KEY,
        user_id int,
        payment_method_id int,
        total_amount float DEFAULT 0.0,
        status nvarchar(20),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (payment_method_id) REFERENCES payment_method(id)
    );
END
ELSE
BEGIN
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('orders') AND name = 'user_id')
        ALTER TABLE orders ADD user_id int;
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('orders') AND name = 'payment_method_id')
        ALTER TABLE orders ADD payment_method_id int;
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('orders') AND name = 'total_amount')
        ALTER TABLE orders ADD total_amount float DEFAULT 0.0;
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('orders') AND name = 'status')
        ALTER TABLE orders ADD status nvarchar(20);
END

-- Ensure TICKETS table has all required columns
IF NOT EXISTS (SELECT *
FROM sys.tables
WHERE name = 'tickets')
BEGIN
    CREATE TABLE tickets
    (
        ticket_id int IDENTITY(1,1) PRIMARY KEY,
        ticket_class_id int,
        order_id int,
        user_id int,
        seat_id int,
        FOREIGN KEY (ticket_class_id) REFERENCES ticket_classes(id),
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (seat_id) REFERENCES event_seats(id)
    );
END
ELSE
BEGIN
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('tickets') AND name = 'ticket_class_id')
        ALTER TABLE tickets ADD ticket_class_id int;
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('tickets') AND name = 'order_id')
        ALTER TABLE tickets ADD order_id int;
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('tickets') AND name = 'user_id')
        ALTER TABLE tickets ADD user_id int;
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('tickets') AND name = 'seat_id')
        ALTER TABLE tickets ADD seat_id int;
END

-- Ensure JWT_TOKENS table has all required columns  
IF NOT EXISTS (SELECT *
FROM sys.tables
WHERE name = 'jwt_tokens')
BEGIN
    CREATE TABLE jwt_tokens
    (
        id int IDENTITY(1,1) PRIMARY KEY,
        user_id int,
        token nvarchar(500) NOT NULL,
        created_at nvarchar(19) DEFAULT CONVERT(varchar(19), GETDATE(), 120),
        expires_at nvarchar(19),
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
END
ELSE
BEGIN
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('jwt_tokens') AND name = 'user_id')
        ALTER TABLE jwt_tokens ADD user_id int;
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('jwt_tokens') AND name = 'token')
        ALTER TABLE jwt_tokens ADD token nvarchar(500) NOT NULL DEFAULT '';
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('jwt_tokens') AND name = 'created_at')
        ALTER TABLE jwt_tokens ADD created_at nvarchar(19) DEFAULT CONVERT(varchar(19), GETDATE(), 120);
    IF NOT EXISTS (SELECT *
    FROM sys.columns
    WHERE object_id = OBJECT_ID('jwt_tokens') AND name = 'expires_at')
        ALTER TABLE jwt_tokens ADD expires_at nvarchar(19);
END

-- =============================================
-- INSERT CATEGORIES
-- =============================================
INSERT INTO categories
    (name, description)
VALUES
    (N'Âm nhạc', N'Các sự kiện liên quan đến âm nhạc và biểu diễn'),
    (N'Hội thảo', N'Các buổi hội thảo và trao đổi chuyên môn'),
    (N'Thể thao', N'Các sự kiện thể thao và giải trí'),
    (N'Nghệ thuật', N'Triển lãm và biểu diễn nghệ thuật'),
    (N'Công nghệ', N'Hội thảo và sự kiện công nghệ'),
    (N'Giải trí', N'Các sự kiện giải trí và vui chơi');

-- =============================================
-- INSERT BANKS
-- =============================================
INSERT INTO banks
    (name, short_name)
VALUES
    (N'Ngân hàng TMCP Công thương Việt Nam', 'VietinBank'),
    (N'Ngân hàng TMCP Ngoại thương Việt Nam', 'Vietcombank'),
    (N'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam', 'BIDV'),
    (N'Ngân hàng Nông nghiệp và Phát triển Nông thôn', 'Agribank'),
    (N'Ngân hàng TMCP Kỹ thương Việt Nam', 'Techcombank'),
    (N'Ngân hang TMCP Tiên Phong', 'TPBank'),
    (N'Ngân hàng TMCP Sài Gòn', 'SCB'),
    (N'Ngân hàng TMCP Á Châu', 'ACB');

-- =============================================
-- INSERT PAYMENT METHODS
-- =============================================
INSERT INTO payment_method
    (name, description, status)
VALUES
    (N'Chuyển khoản ngân hàng', N'Thanh toán qua chuyển khoản ngân hàng', 'active'),
    (N'Ví điện tử MoMo', N'Thanh toán qua ví điện tử MoMo', 'active'),
    (N'Ví điện tử ZaloPay', N'Thanh toán qua ví điện tử ZaloPay', 'active'),
    (N'Thẻ tín dụng/Thẻ ghi nợ', N'Thanh toán bằng thẻ tín dụng hoặc thẻ ghi nợ', 'active'),
    (N'Thanh toán khi nhận vé', N'Thanh toán trực tiếp khi nhận vé', 'active'),
    ('PayPal', N'Thanh toán qua PayPal', 'inactive');

-- =============================================
-- INSERT EVENT ORGANIZERS
-- =============================================

INSERT INTO event_organizers
    (user_id, name, tin, bank_id, payment_method_id)
VALUES
    (2, N'EventPro Entertainment', '0123456789012', 1, 1),
    -- organizer user
    (5, N'Minh Events & Productions', '0987654321098', 2, 2),
    -- minh_organizer user  
    (1, N'Admin Events Co.', '1111111111111', 3, 1);
-- admin user

-- =============================================
-- INSERT EVENTS (Based on frontend mock data)
-- =============================================

INSERT INTO events
    (name, description, start_date, end_date, start_date_time, end_date_time, location, organizer_id, category_id, status, censored_status, censored_at, created_at, updated_at)
VALUES

    -- Main event from ticketService.js and ticketSelectionSlice.jsx
    (N'[BẾN THÀNH] Đêm nhạc Bùi Lan Hương - Hà Lê',
        N'Đêm nhạc đặc biệt với sự tham gia của ca sĩ Bùi Lan Hương và Hà Lê tại Nhà hát Bến Thành',
        '2025-08-06', '2025-08-06', '20:00', '22:30',
        N'Lầu 3, Nhà hát Bến Thành, Số 6, Mạc Đĩnh Chi, Phường Phạm Ngũ Lão, Quận 1, Thành phố Hồ Chí Minh',
        1, 1, 'upcoming', 'approved', '2025-07-01 09:00:00', '2025-07-15 14:30:00', '2025-07-20 16:45:00'),

    -- Event from PurchaseHistoryPage.jsx
    ('TROPICAL PURPLE PARTY',
        N'Bữa tiệc nhiệt đới với âm nhạc sôi động và không gian tuyệt vời',
        '2025-08-07', '2025-08-07', '17:30', '23:00',
        N'Lầu 3, Nhà hát Bến Thành, Số 6, Mạc Đĩnh Chi, Phường Phạm Ngũ Lão, Quận 1, Thành phố Hồ Chí Minh',
        2, 6, 'upcoming', 'approved', '2025-07-05 10:15:00', '2025-07-10 11:20:00', '2025-07-25 09:30:00'),

    -- Additional events for testing
    (N'Hội thảo Công nghệ 2025',
        N'Hội thảo về các xu hướng công nghệ mới nhất và đột phá trong AI',
        '2025-09-15', '2025-09-15', '08:00', '17:00',
        N'Trung tâm Hội nghị SECC, Quận 7, TP.HCM',
        3, 5, 'upcoming', 'pending', NULL, '2025-08-01 10:00:00', '2025-08-01 10:00:00'),

    (N'Triển lãm Nghệ thuật Đương đại',
        N'Triển lãm các tác phẩm nghệ thuật đương đại của các nghệ sĩ trẻ Việt Nam',
        '2025-10-01', '2025-10-07', '09:00', '21:00',
        N'Bảo tàng Mỹ thuật TP.HCM, Quận 1',
        2, 4, 'upcoming', 'approved', '2025-08-15 14:00:00', '2025-08-10 08:00:00', '2025-08-20 16:30:00'),

    (N'Giải bóng đá phong trào',
        N'Giải bóng đá phong trào dành cho các đội nghiệp dư tại TP.HCM',
        '2025-11-20', '2025-11-22', '07:00', '18:00',
        N'Sân vận động Thống Nhất, Quận 1, TP.HCM',
        1, 3, 'upcoming', 'approved', '2025-08-22 11:00:00', '2025-08-18 09:15:00', '2025-08-22 11:00:00');

-- =============================================
-- INSERT TICKET CLASSES (Based on getMockTickets from ticketService.js)
-- =============================================

-- Ticket classes for "[BẾN THÀNH] Đêm nhạc Bùi Lan Hương - Hà Lê" (Event ID: 1)
INSERT INTO ticket_classes
    (event_id, name, description, price, quantity, sales_start_time, sales_end_time, status)
VALUES
    (1, N'Vé VIP', N'Ghế hạng thương gia, có đồ ăn nhẹ', 2500000, 50, '2025-07-15', '2025-08-06', 'available'),
    (1, N'Vé thường', N'Ghế thường, không bao gồm đồ ăn', 800000, 200, '2025-07-15', '2025-08-06', 'available'),
    (1, N'Vé sinh viên', N'Dành cho sinh viên có thẻ, giá ưu đãi', 500000, 100, '2025-07-15', '2025-08-06', 'available'),

    -- Legacy ticket classes from ticketSelectionSlice.jsx
    (1, N'Phụ thu Tân Định', N'Vé có phụ thu khu vực Tân Định', 1000000, 75, '2025-07-15', '2025-08-06', 'available'),
    (1, N'Phụ thu An Đông', N'Vé có phụ thu khu vực An Đông', 700000, 120, '2025-07-15', '2025-08-06', 'available'),
    (1, N'Phụ thu Bình Tây 1', N'Vé có phụ thu khu vực Bình Tây', 500000, 150, '2025-07-15', '2025-08-06', 'available');

-- Ticket classes for "TROPICAL PURPLE PARTY" (Event ID: 2)
INSERT INTO ticket_classes
    (event_id, name, description, price, quantity, sales_start_time, sales_end_time, status)
VALUES
    (2, 'Early Bird', N'Vé bán sớm với giá ưu đãi', 299000, 100, '2025-07-10', '2025-08-07', 'available'),
    (2, 'Regular', N'Vé thường với đầy đủ quyền lợi', 399000, 300, '2025-07-10', '2025-08-07', 'available'),
    (2, 'VIP Table', N'Bàn VIP với dịch vụ cao cấp', 1200000, 20, '2025-07-10', '2025-08-07', 'available');

-- Ticket classes for other events
INSERT INTO ticket_classes
    (event_id, name, description, price, quantity, sales_start_time, sales_end_time, status)
VALUES
    (3, N'Vé tham dự', N'Vé tham dự hội thảo bao gồm tài liệu và coffee break', 150000, 500, '2025-08-01', '2025-09-15', 'available'),
    (3, N'Vé VIP', N'Vé VIP bao gồm ăn trưa và networking session', 350000, 100, '2025-08-01', '2025-09-15', 'available'),

    (4, N'Vé tham quan', N'Vé tham quan triển lãm nghệ thuật', 50000, 1000, '2025-08-10', '2025-10-07', 'available'),
    (4, N'Vé hướng dẫn', N'Vé có hướng dẫn viên và catalogue', 120000, 200, '2025-08-10', '2025-10-07', 'available'),

    (5, N'Vé khán giả', N'Vé xem giải bóng đá phong trào', 30000, 2000, '2025-08-18', '2025-11-22', 'available'),
    (5, N'Vé VIP', N'Vé VIP khu vực đặc biệt', 100000, 300, '2025-08-18', '2025-11-22', 'available');

-- =============================================
-- INSERT EVENT SEATS (Based on SeatSelector component)
-- =============================================

-- Seats for Event 1 - "[BẾN THÀNH] Đêm nhạc Bùi Lan Hương - Hà Lê"
-- VIP Section (Rows A-C)
INSERT INTO event_seats
    (event_id, user_id, seat_number, status)
VALUES
    -- Row A (VIP) - Some occupied seats from SeatSelector mock data
    (1, NULL, 'A1', 'available'),
    (1, 4, 'A2', 'booked'),
    (1, NULL, 'A3', 'available'),
    (1, NULL, 'A4', 'available'),
    (1, NULL, 'A5', 'available'),
    (1, NULL, 'A6', 'available'),
    (1, NULL, 'A7', 'available'),
    (1, NULL, 'A8', 'available'),
    (1, NULL, 'A9', 'available'),
    (1, NULL, 'A10', 'available'),

    -- Row B (VIP) - Some occupied seats
    (1, NULL, 'B1', 'available'),
    (1, NULL, 'B2', 'available'),
    (1, NULL, 'B3', 'available'),
    (1, NULL, 'B4', 'available'),
    (1, 6, 'B5', 'booked'),
    (1, NULL, 'B6', 'available'),
    (1, NULL, 'B7', 'available'),
    (1, NULL, 'B8', 'available'),
    (1, NULL, 'B9', 'available'),
    (1, NULL, 'B10', 'available'),

    -- Row C (Premium)  
    (1, NULL, 'C1', 'available'),
    (1, NULL, 'C2', 'available'),
    (1, 4, 'C3', 'booked'),
    (1, 4, 'C4', 'booked'),
    (1, NULL, 'C5', 'available'),
    (1, NULL, 'C6', 'available'),
    (1, NULL, 'C7', 'available'),
    (1, NULL, 'C8', 'available'),
    (1, NULL, 'C9', 'available'),
    (1, NULL, 'C10', 'available'),
    (1, NULL, 'C11', 'available'),
    (1, NULL, 'C12', 'available'),

    -- Standard section (Rows D-H) - Sample seats
    (1, NULL, 'D1', 'available'),
    (1, NULL, 'D2', 'available'),
    (1, NULL, 'D3', 'available'),
    (1, NULL, 'D4', 'available'),
    (1, NULL, 'D5', 'available'),
    (1, NULL, 'D6', 'available'),
    (1, NULL, 'D7', 'available'),
    (1, 6, 'D8', 'booked'),
    (1, NULL, 'D9', 'available'),
    (1, NULL, 'D10', 'available'),
    (1, NULL, 'D11', 'available'),
    (1, NULL, 'D12', 'available'),
    (1, NULL, 'D13', 'available'),
    (1, NULL, 'D14', 'available'),

    -- Additional rows (sample data)
    (1, NULL, 'E1', 'available'),
    (1, NULL, 'E2', 'available'),
    (1, NULL, 'E3', 'available'),
    (1, NULL, 'E4', 'available'),
    (1, NULL, 'E5', 'available'),
    (1, NULL, 'E6', 'available'),
    (1, NULL, 'E7', 'available'),
    (1, NULL, 'E8', 'available'),
    (1, NULL, 'E9', 'available'),
    (1, 3, 'E10', 'booked'),
    (1, NULL, 'E11', 'available'),
    (1, NULL, 'E12', 'available'),
    (1, NULL, 'E13', 'available'),
    (1, NULL, 'E14', 'available');

-- Add some seats for Event 2 as well  
INSERT INTO event_seats
    (event_id, user_id, seat_number, status)
VALUES
    (2, NULL, 'A1', 'available'),
    (2, NULL, 'A2', 'available'),
    (2, NULL, 'A3', 'available'),
    (2, NULL, 'A4', 'available'),
    (2, NULL, 'A5', 'available'),
    (2, 4, 'A6', 'booked'),
    (2, NULL, 'A7', 'available'),
    (2, NULL, 'A8', 'available'),
    (2, NULL, 'B1', 'available'),
    (2, NULL, 'B2', 'available'),
    (2, NULL, 'B3', 'available'),
    (2, NULL, 'B4', 'available'),
    (2, NULL, 'B5', 'available'),
    (2, NULL, 'B6', 'available'),
    (2, 6, 'B7', 'booked'),
    (2, NULL, 'B8', 'available');

-- =============================================
-- INSERT ORDERS (Sample purchase history)
-- =============================================
INSERT INTO orders
    (user_id, payment_method_id, total_amount, status)
VALUES
    -- Customer orders
    (4, 1, 1600000, 'completed'),
    -- QuynhChi bought 2 regular tickets for Event 1
    (6, 2, 2500000, 'completed'),
    -- Linh bought 1 VIP ticket for Event 1  
    (3, 1, 798000, 'completed'),
    -- Customer1 bought tickets for Event 2
    (4, 3, 150000, 'pending'),
    -- QuynhChi has pending order for Event 3
    (6, 1, 399000, 'completed');
-- Linh bought regular ticket for Event 2

-- =============================================
-- INSERT TICKETS (Individual tickets based on orders)
-- =============================================
INSERT INTO tickets
    (ticket_class_id, order_id, user_id, seat_id)
VALUES
    -- Order 1: QuynhChi - 2 regular tickets for Event 1 
    (2, 1, 4, 25),
    -- C3 seat (seat_id 25 corresponds to C3)
    (2, 1, 4, 26),
    -- C4 seat (seat_id 26 corresponds to C4)

    -- Order 2: Linh - 1 VIP ticket for Event 1
    (1, 2, 6, 15),
    -- B5 seat (seat_id 15 corresponds to B5)

    -- Order 3: Customer1 - tickets for Event 2 
    (7, 3, 3, 68),
    -- A6 seat for Event 2 (seat_id 68)

    -- Order 4: QuynhChi - pending ticket for Event 3
    (12, 4, 4, NULL),
    -- No seat assigned yet (conference style)

    -- Order 5: Linh - regular ticket for Event 2
    (8, 5, 6, 79);
-- B7 seat for Event 2 (seat_id 79)

-- =============================================
-- INSERT JWT TOKENS (Active sessions - for testing)
-- =============================================
INSERT INTO jwt_tokens
    (user_id, token, created_at, expires_at)
VALUES
    (1, 'admin_jwt_fake_token_2', '2025-08-22 10:00:00', '2025-08-22 18:00:00'),
    (2, 'organizer_jwt_fake_token_1', '2025-08-22 11:00:00', '2025-08-22 19:00:00'),
    (3, 'customer_jwt_fake_token_3', '2025-08-22 12:00:00', '2025-08-22 20:00:00'),
    (4, 'quynhchi_jwt_fake_token_4', '2025-08-22 13:00:00', '2025-08-22 21:00:00');

-- =============================================
-- DATA VERIFICATION QUERIES
-- =============================================

-- Verify data insertion
PRINT 'Data insertion completed!'
PRINT 'Summary:'
    SELECT 'Categories' as TableName, COUNT(*) as RecordCount
    FROM categories
UNION ALL
    SELECT 'Users', COUNT(*)
    FROM users
UNION ALL
    SELECT 'Events', COUNT(*)
    FROM events
UNION ALL
    SELECT 'Ticket Classes', COUNT(*)
    FROM ticket_classes
UNION ALL
    SELECT 'Event Seats', COUNT(*)
    FROM event_seats
UNION ALL
    SELECT 'Orders', COUNT(*)
    FROM orders
UNION ALL
    SELECT 'Tickets', COUNT(*)
    FROM tickets
UNION ALL
    SELECT 'Event Organizers', COUNT(*)
    FROM event_organizers
UNION ALL
    SELECT 'Payment Methods', COUNT(*)
    FROM payment_method
UNION ALL
    SELECT 'Banks', COUNT(*)
    FROM banks
UNION ALL
    SELECT 'JWT Tokens', COUNT(*)
    FROM jwt_tokens;

-- Re-enable foreign key constraints
EXEC sp_msforeachtable 'ALTER TABLE ? WITH CHECK CHECK CONSTRAINT ALL'

PRINT 'Mock data insertion script completed successfully!'
PRINT 'Database is ready for testing with realistic data based on frontend mock data.'


-- Home Page Events Mock Data Insert Script
-- Based on Home.jsx demo data and SeatSelector component layout
-- Created: 2025-08-23

USE TICKET;
GO

-- Disable foreign key constraints temporarily for easier insertion
EXEC sp_msforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL'

-- Add poster column to events table if it doesn't exist
IF NOT EXISTS (SELECT *
FROM sys.columns
WHERE object_id = OBJECT_ID('events') AND name = 'poster')
BEGIN
    ALTER TABLE events ADD poster nvarchar(500) NULL;
    PRINT 'Added poster column to events table';
END

delete from events;
delete from event_seats;
go

-- =============================================
-- INSERT HOME PAGE EVENTS WITH POSTERS
-- =============================================

-- Special Events (8 events)
INSERT INTO events
    (name, description, start_date, end_date, start_date_time, end_date_time, location, poster, organizer_id, category_id, status, censored_status, censored_at, created_at, updated_at)
VALUES
    (N'WOODRUFF P.S. - Special Concert', N'Đêm nhạc đặc biệt với nghệ sĩ quốc tế WOODRUFF P.S.', '2025-09-15', '2025-09-15', '20:00', '23:00', N'QK7 Stadium, Quận 7, TP.HCM', 'https://picsum.photos/800/600?random=1', 1, 1, 'upcoming', 'approved', '2025-08-20 10:00:00', '2025-08-15 14:30:00', '2025-08-20 10:00:00'),
    (N'VOLUNTEERS NEEDED - Community Event', N'Sự kiện cộng đồng cần tình nguyện viên tham gia', '2025-09-16', '2025-09-16', '08:00', '17:00', N'Crescent Mall, Quận 7, TP.HCM', 'https://picsum.photos/800/600?random=2', 2, 6, 'upcoming', 'approved', '2025-08-20 11:00:00', '2025-08-16 09:15:00', '2025-08-20 11:00:00'),
    (N'MUSIC EVENT - Live Performance', N'Buổi biểu diễn âm nhạc trực tiếp với nhiều nghệ sĩ', '2025-09-17', '2025-09-17', '19:00', '22:30', N'Saigon Center, Quận 1, TP.HCM', 'https://picsum.photos/800/600?random=3', 1, 1, 'upcoming', 'approved', '2025-08-20 12:00:00', '2025-08-17 10:20:00', '2025-08-20 12:00:00'),
    (N'LIVE THE MUSIC - Festival', N'Lễ hội âm nhạc sống động với không khí tuyệt vời', '2025-09-18', '2025-09-20', '17:00', '23:59', N'Youth Theatre, Quận 1, TP.HCM', 'https://picsum.photos/800/600?random=4', 2, 1, 'upcoming', 'approved', '2025-08-20 13:00:00', '2025-08-18 11:45:00', '2025-08-20 13:00:00'),
    (N'BUSINESS CONF. - Professional Meeting', N'Hội nghị doanh nghiệp về xu hướng kinh doanh 2025', '2025-09-19', '2025-09-19', '08:30', '17:30', N'QK7 Stadium, Quận 7, TP.HCM', 'https://picsum.photos/800/600?random=5', 3, 2, 'upcoming', 'pending', NULL, '2025-08-19 08:00:00', '2025-08-19 08:00:00'),
    (N'WOODRUFF P.S. Encore - Special Return', N'Đêm diễn trở lại đặc biệt của WOODRUFF P.S.', '2025-09-21', '2025-09-21', '20:30', '23:30', N'Crescent Mall, Quận 7, TP.HCM', 'https://picsum.photos/800/600?random=6', 1, 1, 'upcoming', 'approved', '2025-08-20 14:00:00', '2025-08-20 12:30:00', '2025-08-20 14:00:00'),
    (N'VOLUNTEERS NEEDED - Environmental Action', N'Hoạt động bảo vệ môi trường cần tình nguyện viên', '2025-09-22', '2025-09-22', '06:00', '18:00', N'Saigon Center, Quận 1, TP.HCM', 'https://picsum.photos/800/600?random=7', 2, 6, 'upcoming', 'approved', '2025-08-20 15:00:00', '2025-08-21 07:15:00', '2025-08-20 15:00:00'),
    (N'MUSIC EVENT - Acoustic Night', N'Đêm nhạc acoustic với không gian ấm cúng', '2025-09-23', '2025-09-23', '19:30', '22:00', N'Youth Theatre, Quận 1, TP.HCM', 'https://picsum.photos/800/600?random=8', 1, 1, 'upcoming', 'approved', '2025-08-20 16:00:00', '2025-08-22 13:45:00', '2025-08-20 16:00:00');

-- Trending Events (8 events)  
INSERT INTO events
    (name, description, start_date, end_date, start_date_time, end_date_time, location, poster, organizer_id, category_id, status, censored_status, censored_at, created_at, updated_at)
VALUES
    (N'WOODRUFF P.S. - Trending Show', N'Show trending hot nhất của WOODRUFF P.S.', '2025-10-01', '2025-10-01', '20:00', '23:00', N'QK7 Stadium, Quận 7, TP.HCM', 'https://picsum.photos/800/600?random=9', 1, 1, 'upcoming', 'approved', '2025-08-22 10:00:00', '2025-08-20 16:30:00', '2025-08-22 10:00:00'),
    (N'VOLUNTEERS NEEDED - Youth Program', N'Chương trình dành cho thanh niên cần tình nguyện viên', '2025-10-02', '2025-10-02', '09:00', '16:00', N'Crescent Mall, Quận 7, TP.HCM', 'https://picsum.photos/800/600?random=10', 2, 6, 'upcoming', 'approved', '2025-08-22 11:00:00', '2025-08-21 14:20:00', '2025-08-22 11:00:00'),
    (N'MUSIC EVENT - Electronic Dance', N'Đêm nhạc điện tử sôi động với DJ hàng đầu', '2025-10-03', '2025-10-03', '21:00', '02:00', N'Saigon Center, Quận 1, TP.HCM', 'https://picsum.photos/800/600?random=11', 1, 1, 'upcoming', 'approved', '2025-08-22 12:00:00', '2025-08-21 18:10:00', '2025-08-22 12:00:00'),
    (N'LIVE THE MUSIC - Rock Festival', N'Lễ hội nhạc rock với ban nhạc nổi tiếng', '2025-10-04', '2025-10-06', '18:00', '23:59', N'Youth Theatre, Quận 1, TP.HCM', 'https://picsum.photos/800/600?random=12', 2, 1, 'upcoming', 'approved', '2025-08-22 13:00:00', '2025-08-22 09:30:00', '2025-08-22 13:00:00'),
    (N'BUSINESS CONF. - Digital Transformation', N'Hội thảo chuyển đổi số cho doanh nghiệp', '2025-10-05', '2025-10-05', '08:00', '17:00', N'QK7 Stadium, Quận 7, TP.HCM', 'https://picsum.photos/800/600?random=13', 3, 2, 'upcoming', 'pending', NULL, '2025-08-22 07:45:00', '2025-08-22 07:45:00'),
    (N'WOODRUFF P.S. - VIP Experience', N'Trải nghiệm VIP độc quyền với WOODRUFF P.S.', '2025-10-07', '2025-10-07', '19:00', '22:30', N'Crescent Mall, Quận 7, TP.HCM', 'https://picsum.photos/800/600?random=14', 1, 1, 'upcoming', 'approved', '2025-08-22 14:00:00', '2025-08-22 11:15:00', '2025-08-22 14:00:00'),
    (N'VOLUNTEERS NEEDED - Education Support', N'Hỗ trợ giáo dục cho trẻ em vùng khó khăn', '2025-10-08', '2025-10-08', '07:00', '17:00', N'Saigon Center, Quận 1, TP.HCM', 'https://picsum.photos/800/600?random=15', 2, 6, 'upcoming', 'approved', '2025-08-22 15:00:00', '2025-08-22 12:40:00', '2025-08-22 15:00:00'),
    (N'MUSIC EVENT - Jazz Night', N'Đêm nhạc jazz với nghệ sĩ tài năng', '2025-10-09', '2025-10-09', '20:00', '23:00', N'Youth Theatre, Quận 1, TP.HCM', 'https://picsum.photos/800/600?random=16', 1, 1, 'upcoming', 'approved', '2025-08-22 16:00:00', '2025-08-22 15:20:00', '2025-08-22 16:00:00');

-- Live Music Events (8 events)
INSERT INTO events
    (name, description, start_date, end_date, start_date_time, end_date_time, location, poster, organizer_id, category_id, status, censored_status, censored_at, created_at, updated_at)
VALUES
    (N'WOODRUFF P.S. - Live Concert Series', N'Chuỗi concert trực tiếp của WOODRUFF P.S.', '2025-10-15', '2025-10-15', '20:00', '23:00', N'QK7 Stadium, Quận 7, TP.HCM', 'https://picsum.photos/800/600?random=17', 1, 1, 'upcoming', 'approved', '2025-08-23 10:00:00', '2025-08-22 17:30:00', '2025-08-23 10:00:00'),
    (N'VOLUNTEERS NEEDED - Music Workshop', N'Workshop âm nhạc cần tình nguyện viên hỗ trợ', '2025-10-16', '2025-10-16', '14:00', '18:00', N'Crescent Mall, Quận 7, TP.HCM', 'https://picsum.photos/800/600?random=18', 2, 1, 'upcoming', 'approved', '2025-08-23 11:00:00', '2025-08-22 19:45:00', '2025-08-23 11:00:00'),
    (N'MUSIC EVENT - Band Competition', N'Cuộc thi ban nhạc với nhiều thể loại', '2025-10-17', '2025-10-17', '18:00', '23:00', N'Saigon Center, Quận 1, TP.HCM', 'https://picsum.photos/800/600?random=19', 1, 1, 'upcoming', 'approved', '2025-08-23 12:00:00', '2025-08-23 08:15:00', '2025-08-23 12:00:00'),
    (N'LIVE THE MUSIC - Indie Festival', N'Lễ hội nhạc indie với nghệ sĩ độc lập', '2025-10-18', '2025-10-20', '17:00', '23:30', N'Youth Theatre, Quận 1, TP.HCM', 'https://picsum.photos/800/600?random=20', 2, 1, 'upcoming', 'approved', '2025-08-23 13:00:00', '2025-08-23 09:20:00', '2025-08-23 13:00:00'),
    (N'BUSINESS CONF. - Music Industry', N'Hội thảo về ngành công nghiệp âm nhạc', '2025-10-19', '2025-10-19', '09:00', '17:00', N'QK7 Stadium, Quận 7, TP.HCM', 'https://picsum.photos/800/600?random=21', 3, 2, 'upcoming', 'pending', NULL, '2025-08-23 06:30:00', '2025-08-23 06:30:00'),
    (N'WOODRUFF P.S. - Unplugged Session', N'Phiên unplugged đặc biệt của WOODRUFF P.S.', '2025-10-21', '2025-10-21', '19:30', '22:00', N'Crescent Mall, Quận 7, TP.HCM', 'https://picsum.photos/800/600?random=22', 1, 1, 'upcoming', 'approved', '2025-08-23 14:00:00', '2025-08-23 10:45:00', '2025-08-23 14:00:00'),
    (N'VOLUNTEERS NEEDED - Sound Engineering', N'Tuyển tình nguyện viên hỗ trợ kỹ thuật âm thanh', '2025-10-22', '2025-10-22', '12:00', '20:00', N'Saigon Center, Quận 1, TP.HCM', 'https://picsum.photos/800/600?random=23', 2, 1, 'upcoming', 'approved', '2025-08-23 15:00:00', '2025-08-23 11:30:00', '2025-08-23 15:00:00'),
    (N'MUSIC EVENT - Classical Evening', N'Buổi tối nhạc cổ điển trang trọng', '2025-10-23', '2025-10-23', '19:00', '21:30', N'Youth Theatre, Quận 1, TP.HCM', 'https://picsum.photos/800/600?random=24', 1, 1, 'upcoming', 'approved', '2025-08-23 16:00:00', '2025-08-23 13:15:00', '2025-08-23 16:00:00');

-- Stage & Arts Events (8 events)
INSERT INTO events
    (name, description, start_date, end_date, start_date_time, end_date_time, location, poster, organizer_id, category_id, status, censored_status, censored_at, created_at, updated_at)
VALUES
    (N'WOODRUFF P.S. - Theatrical Performance', N'Buổi biểu diễn sân khấu của WOODRUFF P.S.', '2025-11-01', '2025-11-01', '19:30', '22:00', N'QK7 Stadium, Quận 7, TP.HCM', 'https://picsum.photos/800/600?random=25', 1, 4, 'upcoming', 'approved', '2025-08-23 17:00:00', '2025-08-23 14:20:00', '2025-08-23 17:00:00'),
    (N'VOLUNTEERS NEEDED - Art Installation', N'Cần tình nguyện viên lắp đặt tác phẩm nghệ thuật', '2025-11-02', '2025-11-02', '08:00', '18:00', N'Crescent Mall, Quận 7, TP.HCM', 'https://picsum.photos/800/600?random=26', 2, 4, 'upcoming', 'approved', '2025-08-23 18:00:00', '2025-08-23 15:40:00', '2025-08-23 18:00:00'),
    (N'MUSIC EVENT - Opera Night', N'Đêm opera với nghệ sĩ hàng đầu', '2025-11-03', '2025-11-03', '20:00', '23:00', N'Saigon Center, Quận 1, TP.HCM', 'https://picsum.photos/800/600?random=27', 1, 4, 'upcoming', 'approved', '2025-08-23 19:00:00', '2025-08-23 16:10:00', '2025-08-23 19:00:00'),
    (N'LIVE THE MUSIC - Dance Performance', N'Buổi biểu diễn múa kết hợp âm nhạc', '2025-11-04', '2025-11-06', '19:00', '22:00', N'Youth Theatre, Quận 1, TP.HCM', 'https://picsum.photos/800/600?random=28', 2, 4, 'upcoming', 'approved', '2025-08-23 20:00:00', '2025-08-23 17:25:00', '2025-08-23 20:00:00'),
    (N'BUSINESS CONF. - Arts Management', N'Hội thảo quản lý nghệ thuật và sáng tạo', '2025-11-05', '2025-11-05', '09:00', '17:30', N'QK7 Stadium, Quận 7, TP.HCM', 'https://picsum.photos/800/600?random=29', 3, 2, 'upcoming', 'pending', NULL, '2025-08-23 05:45:00', '2025-08-23 05:45:00'),
    (N'WOODRUFF P.S. - Gallery Exhibition', N'Triển lãm gallery của WOODRUFF P.S.', '2025-11-07', '2025-11-09', '10:00', '20:00', N'Crescent Mall, Quận 7, TP.HCM', 'https://picsum.photos/800/600?random=30', 1, 4, 'upcoming', 'approved', '2025-08-23 21:00:00', '2025-08-23 18:50:00', '2025-08-23 21:00:00'),
    (N'VOLUNTEERS NEEDED - Stage Setup', N'Hỗ trợ dựng sân khấu cho sự kiện lớn', '2025-11-08', '2025-11-08', '06:00', '22:00', N'Saigon Center, Quận 1, TP.HCM', 'https://picsum.photos/800/600?random=31', 2, 4, 'upcoming', 'approved', '2025-08-23 22:00:00', '2025-08-23 19:30:00', '2025-08-23 22:00:00'),
    (N'MUSIC EVENT - Contemporary Arts', N'Sự kiện nghệ thuật đương đại kết hợp âm nhạc', '2025-11-09', '2025-11-09', '18:30', '22:30', N'Youth Theatre, Quận 1, TP.HCM', 'https://picsum.photos/800/600?random=32', 1, 4, 'upcoming', 'approved', '2025-08-23 23:00:00', '2025-08-23 20:15:00', '2025-08-23 23:00:00');

-- Other Genre Events (8 events)
INSERT INTO events
    (name, description, start_date, end_date, start_date_time, end_date_time, location, poster, organizer_id, category_id, status, censored_status, censored_at, created_at, updated_at)
VALUES
    (N'WOODRUFF P.S. - Multi-Genre Show', N'Show đa thể loại của WOODRUFF P.S.', '2025-11-15', '2025-11-15', '19:00', '23:00', N'QK7 Stadium, Quận 7, TP.HCM', 'https://picsum.photos/800/600?random=33', 1, 6, 'upcoming', 'approved', '2025-08-23 10:30:00', '2025-08-23 21:40:00', '2025-08-23 10:30:00'),
    (N'VOLUNTEERS NEEDED - Community Fair', N'Hội chợ cộng đồng cần tình nguyện viên', '2025-11-16', '2025-11-16', '07:00', '19:00', N'Crescent Mall, Quận 7, TP.HCM', 'https://picsum.photos/800/600?random=34', 2, 6, 'upcoming', 'approved', '2025-08-23 11:30:00', '2025-08-23 22:20:00', '2025-08-23 11:30:00'),
    (N'MUSIC EVENT - World Music', N'Đêm nhạc thế giới với nhiều quốc gia', '2025-11-17', '2025-11-17', '20:00', '23:30', N'Saigon Center, Quận 1, TP.HCM', 'https://picsum.photos/800/600?random=35', 1, 1, 'upcoming', 'approved', '2025-08-23 12:30:00', '2025-08-23 23:05:00', '2025-08-23 12:30:00'),
    (N'LIVE THE MUSIC - Fusion Festival', N'Lễ hội âm nhạc fusion độc đáo', '2025-11-18', '2025-11-20', '16:00', '23:59', N'Youth Theatre, Quận 1, TP.HCM', 'https://picsum.photos/800/600?random=36', 2, 1, 'upcoming', 'approved', '2025-08-23 13:30:00', '2025-08-23 21:50:00', '2025-08-23 13:30:00'),
    (N'BUSINESS CONF. - Innovation Summit', N'Hội nghị đỉnh cao về đổi mới sáng tạo', '2025-11-19', '2025-11-19', '08:30', '18:00', N'QK7 Stadium, Quận 7, TP.HCM', 'https://picsum.photos/800/600?random=37', 3, 5, 'upcoming', 'pending', NULL, '2025-08-23 04:15:00', '2025-08-23 04:15:00'),
    (N'WOODRUFF P.S. - Experimental Show', N'Show thử nghiệm mới của WOODRUFF P.S.', '2025-11-21', '2025-11-21', '20:30', '23:00', N'Crescent Mall, Quận 7, TP.HCM', 'https://picsum.photos/800/600?random=38', 1, 6, 'upcoming', 'approved', '2025-08-23 14:30:00', '2025-08-23 22:35:00', '2025-08-23 14:30:00'),
    (N'VOLUNTEERS NEEDED - Tech Support', N'Hỗ trợ kỹ thuật cho các sự kiện', '2025-11-22', '2025-11-22', '08:00', '20:00', N'Saigon Center, Quận 1, TP.HCM', 'https://picsum.photos/800/600?random=39', 2, 5, 'upcoming', 'approved', '2025-08-23 15:30:00', '2025-08-23 23:10:00', '2025-08-23 15:30:00'),
    (N'MUSIC EVENT - Celebration Night', N'Đêm nhạc kỷ niệm và ăn mừng', '2025-11-23', '2025-11-23', '18:00', '24:00', N'Youth Theatre, Quận 1, TP.HCM', 'https://picsum.photos/800/600?random=40', 1, 6, 'upcoming', 'approved', '2025-08-23 16:30:00', '2025-08-23 23:45:00', '2025-08-23 16:30:00');

-- ...existing ticket classes and event seats code...
-- (giữ nguyên phần ticket classes và event seats)

-- =============================================
-- UPDATE EXISTING EVENTS WITH POSTERS (if any)
-- =============================================

-- Update existing events (IDs 1-5) with posters if they exist
UPDATE events SET poster = 'https://picsum.photos/800/600?random=101' WHERE id = 1;
UPDATE events SET poster = 'https://picsum.photos/800/600?random=102' WHERE id = 2;
UPDATE events SET poster = 'https://picsum.photos/800/600?random=103' WHERE id = 3;
UPDATE events SET poster = 'https://picsum.photos/800/600?random=104' WHERE id = 4;
UPDATE events SET poster = 'https://picsum.photos/800/600?random=105' WHERE id = 5;

-- Re-enable foreign key constraints
EXEC sp_msforeachtable 'ALTER TABLE ? WITH CHECK CHECK CONSTRAINT ALL'

PRINT 'Home Events with Posters insertion completed!'
PRINT 'All events now have random poster images from Picsum service.';

select *
from events;