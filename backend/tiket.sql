IF NOT EXISTS (SELECT name
FROM sys.databases
WHERE name = 'TICKET')
BEGIN
    CREATE DATABASE TICKET
END
GO
USE TICKET
GO

select *
from users;

use master;
GO
drop database TICKET;
GO

-- alter table users
-- add role NVARCHAR(50) DEFAULT 'user';

UPDATE users 
SET role = 'user' 
WHERE id = 1;

-- -- Bảng CATEGORY
-- CREATE TABLE CATEGORY (
--     categoryID INT PRIMARY KEY,
--     categoryName NVARCHAR(255),
--     description NVARCHAR(255)
-- );

-- -- Bảng USER
-- CREATE TABLE USERS(
--     userID INT IDENTITY(1,1) PRIMARY KEY,
--     fullName NVARCHAR(255),
--     email NVARCHAR(255) UNIQUE,
--     phoneNumber INT,
--     password NVARCHAR(255),
--     role NVARCHAR(50),
--     dob DATE,
--     gender NVARCHAR(10),
--     avatar VARBINARY(MAX),
--     status VARCHAR(50),
--     createdAt DATETIME,
--     updatedAt DATETIME
-- );

-- -- Bảng Bank
-- CREATE TABLE Bank (
--     bankID INT PRIMARY KEY,
--     bankName NVARCHAR(255),
--     shortName NVARCHAR(50)
-- );

-- -- Bảng PAYMENT_METHOD
-- CREATE TABLE PAYMENT_METHOD (
--     paymentMethodID INT PRIMARY KEY,
--     pamentMethodName NVARCHAR(100),
--     status NVARCHAR(50)
-- );

-- -- Bảng Event Organizer
-- CREATE TABLE Event_Organizer (
--     organizerID INT PRIMARY KEY,
--     accountHolder NVARCHAR(255),
--     accountNumber DECIMAL,  
--     bankID INT,
--     TIN NVARCHAR(255),
--     bussinessType NVARCHAR(100)
-- );

-- -- Bảng EVENT
-- CREATE TABLE EVENT (
--     eventID INT IDENTITY(1,1) PRIMARY KEY,
--     eventName NVARCHAR(255),
--     formatType NVARCHAR(50), -- Online/Offline
--     location NVARCHAR(255),
--     startDate DATETIME,
--     endDate DATETIME,
--     description NVARCHAR(255),
--     organizerID INT,
--     categoryID INT
-- );

-- -- Bảng TICKET_CLASS
-- CREATE TABLE TICKET_CLASS (
--     ticketClassID INT IDENTITY(1,1) PRIMARY KEY,
--     ticketClassName NVARCHAR(100),
--     quantity INT,
--     price DECIMAL(10,2),
--     eventID INT,
--     salesStartTime DATETIME,
--     salesEndTime DATETIME,
--     status NVARCHAR(50)
-- );

-- -- Bảng ORDER
-- CREATE TABLE ORDERS (
--     orderID INT IDENTITY(1,1) PRIMARY KEY,
--     paymentMethodID INT,
--     orderStatus NVARCHAR(50),
--     userID INT
-- );

-- -- Bảng TICKET
-- CREATE TABLE TICKET (
--     ticketID INT IDENTITY(1,1) PRIMARY KEY,
--     ticketClassID INT,
--     orderID INT
-- );


-- INSERT INTO CATEGORY (categoryID, categoryName, description) VALUES
-- (1, N'Nhạc sống', N'Sự kiện âm nhạc trực tiếp'),
-- (2, N'Nghệ thuật', N'Sân khấu, kịch, múa đương đại'),
-- (3, N'Thể thao', N'Sự kiện thể thao ngoài trời');

-- INSERT INTO USERS (fullName, email, phoneNumber, password, role, dob, gender, avatar, status, createdAt, updatedAt) VALUES
-- (N'Nguyễn Văn A', 'a@example.com', 901234567, 'hashed_pass_1', N'admin', '1990-01-01', N'Nam', NULL, 'active', GETDATE(), GETDATE()),
-- (N'Trần Thị B', 'b@example.com', 912345678, 'hashed_pass_2', N'user', '1992-05-10', N'Nữ', NULL, 'active', GETDATE(), GETDATE()),
-- (N'Nguyễn Văn C', 'c@example.com', 901234567, 'hashed_pass_3', N'user', '1993-01-01', N'Nam', NULL, 'active', GETDATE(), GETDATE()),
-- (N'Trần Thị D', 'd@example.com', 912345678, 'hashed_pass_4', N'user', '1996-05-10', N'Nữ', NULL, 'active', GETDATE(), GETDATE()),
-- (N'Nguyễn Văn E', 'e@example.com', 901234567, 'hashed_pass_5', N'user', '1996-01-01', N'Nam', NULL, 'active', GETDATE(), GETDATE()),
-- (N'Trần Thị F', 'f@example.com', 912345678, 'hashed_pass_6', N'user', '1994-05-10', N'Nữ', NULL, 'active', GETDATE(), GETDATE()),
-- (N'Nguyễn Văn G', 'g@example.com', 901234567, 'hashed_pass_7', N'user', '1998-01-01', N'Nam', NULL, 'active', GETDATE(), GETDATE()),
-- (N'Trần Thị H', 'h@example.com', 912345678, 'hashed_pass_8', N'user', '1993-05-10', N'Nữ', NULL, 'active', GETDATE(), GETDATE()),
-- (N'Nguyễn Văn K', 'k@example.com', 901234567, 'hashed_pass_9', N'user', '1996-01-01', N'Nam', NULL, 'active', GETDATE(), GETDATE()),
-- (N'Trần Thị J', 'j@example.com', 912345678, 'hashed_pass_10', N'user', '1998-05-10', N'Nữ', NULL, 'active', GETDATE(), GETDATE());

-- INSERT INTO Bank (bankID, bankName, shortName) VALUES
-- (1, N'Ngân hàng Ngoại thương Việt Nam', N'VCB'),
-- (2, N'Ngân hàng Công thương Việt Nam', N'VietinBank');

-- INSERT INTO PAYMENT_METHOD (paymentMethodID, pamentMethodName, status) VALUES
-- (1, N'Chuyển khoản ngân hàng', N'active'),
-- (2, N'Ví điện tử', N'active');

-- INSERT INTO Event_Organizer (organizerID, accountHolder, accountNumber, bankID, TIN, bussinessType) VALUES
-- (1, N'Công ty TNHH Âm nhạc A', 123456789, 1, N'0312345678', N'Tổ chức sự kiện'),
-- (2, N'Công ty TNHH Thể thao B', 987654321, 2, N'0309876543', N'Thể thao và giải trí'),
-- (3, N'Công ty TNHH Nghệ thuật C', 555666777, 1, N'0301234567', N'Nghệ thuật biểu diễn'),
-- (4, N'Công ty TNHH Giải trí D', 222333444, 2, N'0307654321', N'Tổ chức sự kiện và giải trí'),
-- (5, N'Công ty TNHH Triển lãm E', 777888999, 1, N'0301122334', N'Triển lãm và hội chợ'),
-- (6, N'Công ty TNHH Công nghệ F', 111222333, 2, N'0311987654', N'Công nghệ và đào tạo');

-- INSERT INTO EVENT (eventName, formatType, location, startDate, endDate, description, organizerID, categoryID) VALUES
-- (N'Live Concert Đà Nẵng', N'Offline', N'Đà Nẵng', '2025-09-01 18:00:00', '2025-09-01 22:00:00', N'Hòa nhạc hoành tráng', 1, 1),
-- (N'Giải chạy TP.HCM', N'Offline', N'TP. HCM', '2025-10-10 06:00:00', '2025-10-10 11:00:00', N'Chạy bộ cộng đồng', 2, 3),
-- (N'Vở kịch Hà Nội', N'Offline', N'Hà Nội', '2025-09-15 19:00:00', '2025-09-15 21:00:00', N'Biểu diễn sân khấu kịch hiện đại', 3, 2),
-- (N'Lễ hội văn hóa trực tuyến', N'Online', N'Trực tuyến', '2025-09-20 09:00:00', '2025-09-20 12:00:00', N'Sự kiện livestream giới thiệu văn hóa các vùng miền', 4, 2),
-- (N'Hội chợ công nghệ 2025', N'Offline', N'TP. HCM', '2025-11-01 08:00:00', '2025-11-03 17:00:00', N'Triển lãm công nghệ và sản phẩm mới', 6, 2),
-- (N'Lễ hội mùa hè', N'Offline', N'Hội An', '2025-08-20 15:00:00', '2025-08-20 22:00:00', N'Sự kiện văn hóa nghệ thuật ngoài trời', 5, 1);
-- INSERT INTO TICKET_CLASS (ticketClassName, quantity, price, eventID, salesStartTime, salesEndTime, status) VALUES
-- (N'VIP', 100, 500000, 1, '2025-08-01 00:00:00', '2025-08-31 23:59:59', N'available'),
-- (N'Thường', 300, 200000, 1, '2025-08-01 00:00:00', '2025-08-31 23:59:59', N'available'),
-- (N'Gói tiêu chuẩn', 200, 150000, 2, '2025-08-05 00:00:00', '2025-10-09 23:59:59', N'available');

-- INSERT INTO ORDERS (paymentMethodID, orderStatus, userID) VALUES
-- (1, N'paid', 1),
-- (2, N'pending', 2),
-- (1, N'paid', 3),
-- (2, N'paid', 4),
-- (2, N'pending', 5),
-- (1, N'paid', 6),
-- (2, N'paid', 7);

-- INSERT INTO TICKET (ticketClassID, orderID) VALUES
-- (1, 1),
-- (2, 1),
-- (3, 2),
-- (1, 3),
-- (2, 3),
-- (3, 4),
-- (2, 5),
-- (1, 6),
-- (2, 7);

use master;
go
ALTER DATABASE TICKET
SET SINGLE_USER
WITH
ROLLBACK IMMEDIATE;
drop database TICKET;
go
