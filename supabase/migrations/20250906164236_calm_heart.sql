-- Online Library Management System Database Schema
-- Created for DBMS Project

-- Create database
CREATE DATABASE IF NOT EXISTS library_management;
USE library_management;

-- Users table for authentication and user management
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('user', 'librarian') DEFAULT 'user',
    membership_date DATE DEFAULT (CURRENT_DATE),
    phone VARCHAR(20),
    address TEXT,
    fine_amount DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Books table for book catalog management
CREATE TABLE books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    category VARCHAR(100) NOT NULL,
    publisher VARCHAR(255),
    publish_year YEAR,
    total_copies INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    location VARCHAR(50),
    description TEXT,
    cover_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_title (title),
    INDEX idx_author (author),
    INDEX idx_category (category),
    INDEX idx_isbn (isbn)
);

-- Transactions table for book issue/return tracking
CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE NULL,
    status ENUM('issued', 'returned', 'overdue') DEFAULT 'issued',
    fine_amount DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_book_id (book_id),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date)
);

-- Insert sample users
INSERT INTO users (email, password, name, role, phone, address, fine_amount) VALUES
('john.doe@email.com', 'password123', 'John Doe', 'user', '+1-555-0123', '123 Main St, City, State 12345', 0.00),
('librarian@library.com', 'admin123', 'Sarah Wilson', 'librarian', '+1-555-0124', '456 Oak Ave, City, State 12345', 0.00),
('alice.smith@email.com', 'password123', 'Alice Smith', 'user', '+1-555-0125', '789 Pine St, City, State 12345', 5.50);

-- Insert sample books
INSERT INTO books (title, author, isbn, category, publisher, publish_year, total_copies, available_copies, location, description, cover_url) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', '978-0-7432-7356-5', 'Fiction', 'Scribner', 1925, 5, 3, 'A-001-01', 'A classic American novel about the Jazz Age and the American Dream.', 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'),
('To Kill a Mockingbird', 'Harper Lee', '978-0-06-112008-4', 'Fiction', 'J.B. Lippincott & Co.', 1960, 4, 2, 'A-001-02', 'A gripping tale of racial injustice and childhood innocence in the American South.', 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'),
('Introduction to Algorithms', 'Thomas H. Cormen', '978-0-262-03384-8', 'Computer Science', 'MIT Press', 2009, 3, 1, 'C-005-12', 'Comprehensive guide to algorithms and data structures for computer science.', 'https://images.pexels.com/photos/2228555/pexels-photo-2228555.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'),
('Clean Code', 'Robert C. Martin', '978-0-13-235088-4', 'Computer Science', 'Prentice Hall', 2008, 6, 4, 'C-005-08', 'A handbook of agile software craftsmanship and best practices.', 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'),
('Sapiens', 'Yuval Noah Harari', '978-0-06-231609-7', 'History', 'Harper', 2014, 4, 3, 'H-003-15', 'A brief history of humankind from the Stone Age to the present.', 'https://images.pexels.com/photos/1261427/pexels-photo-1261427.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'),
('The Midnight Library', 'Matt Haig', '978-0-525-55948-1', 'Fiction', 'Viking', 2020, 8, 6, 'A-002-22', 'A philosophical novel about life, regret, and infinite possibilities.', 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop');

-- Insert sample transactions
INSERT INTO transactions (user_id, book_id, issue_date, due_date, status, fine_amount) VALUES
(1, 1, '2024-11-01', '2024-11-15', 'issued', 0.00),
(1, 3, '2024-10-20', '2024-11-03', 'returned', 1.00),
(3, 2, '2024-10-15', '2024-10-29', 'overdue', 5.50);

-- Update return date for returned transaction
UPDATE transactions SET return_date = '2024-11-05' WHERE id = 2;

-- Stored procedures for common operations

-- Procedure to issue a book
DELIMITER //
CREATE PROCEDURE IssueBook(
    IN p_user_id INT,
    IN p_book_id INT,
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_available_copies INT;
    DECLARE v_existing_transaction INT DEFAULT 0;
    
    -- Check if book is available
    SELECT available_copies INTO v_available_copies 
    FROM books WHERE id = p_book_id;
    
    -- Check if user already has this book
    SELECT COUNT(*) INTO v_existing_transaction 
    FROM transactions 
    WHERE user_id = p_user_id AND book_id = p_book_id AND status IN ('issued', 'overdue');
    
    IF v_available_copies <= 0 THEN
        SET p_success = FALSE;
        SET p_message = 'Book not available';
    ELSEIF v_existing_transaction > 0 THEN
        SET p_success = FALSE;
        SET p_message = 'User already has this book';
    ELSE
        -- Issue the book
        INSERT INTO transactions (user_id, book_id, issue_date, due_date, status)
        VALUES (p_user_id, p_book_id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY), 'issued');
        
        -- Update available copies
        UPDATE books SET available_copies = available_copies - 1 WHERE id = p_book_id;
        
        SET p_success = TRUE;
        SET p_message = 'Book issued successfully';
    END IF;
END //
DELIMITER ;

-- Procedure to return a book
DELIMITER //
CREATE PROCEDURE ReturnBook(
    IN p_transaction_id INT,
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(255),
    OUT p_fine_amount DECIMAL(10,2)
)
BEGIN
    DECLARE v_book_id INT;
    DECLARE v_user_id INT;
    DECLARE v_due_date DATE;
    DECLARE v_days_overdue INT DEFAULT 0;
    
    -- Get transaction details
    SELECT book_id, user_id, due_date 
    INTO v_book_id, v_user_id, v_due_date
    FROM transactions 
    WHERE id = p_transaction_id AND status IN ('issued', 'overdue');
    
    IF v_book_id IS NULL THEN
        SET p_success = FALSE;
        SET p_message = 'Transaction not found or already returned';
        SET p_fine_amount = 0.00;
    ELSE
        -- Calculate fine if overdue
        SET v_days_overdue = GREATEST(0, DATEDIFF(CURDATE(), v_due_date));
        SET p_fine_amount = v_days_overdue * 0.50;
        
        -- Update transaction
        UPDATE transactions 
        SET return_date = CURDATE(), 
            status = 'returned', 
            fine_amount = p_fine_amount
        WHERE id = p_transaction_id;
        
        -- Update book availability
        UPDATE books SET available_copies = available_copies + 1 WHERE id = v_book_id;
        
        -- Update user fine amount
        UPDATE users SET fine_amount = fine_amount + p_fine_amount WHERE id = v_user_id;
        
        SET p_success = TRUE;
        SET p_message = 'Book returned successfully';
    END IF;
END //
DELIMITER ;

-- Function to calculate fine
DELIMITER //
CREATE FUNCTION CalculateFine(p_due_date DATE, p_return_date DATE) 
RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_days_overdue INT;
    DECLARE v_fine DECIMAL(10,2);
    
    IF p_return_date IS NULL THEN
        SET p_return_date = CURDATE();
    END IF;
    
    SET v_days_overdue = GREATEST(0, DATEDIFF(p_return_date, p_due_date));
    SET v_fine = v_days_overdue * 0.50;
    
    RETURN v_fine;
END //
DELIMITER ;

-- View for book availability
CREATE VIEW book_availability AS
SELECT 
    b.id,
    b.title,
    b.author,
    b.category,
    b.total_copies,
    b.available_copies,
    (b.total_copies - b.available_copies) as issued_copies,
    CASE 
        WHEN b.available_copies > 0 THEN 'Available'
        ELSE 'Not Available'
    END as availability_status
FROM books b;

-- View for overdue books
CREATE VIEW overdue_books AS
SELECT 
    t.id as transaction_id,
    u.name as user_name,
    u.email as user_email,
    b.title as book_title,
    b.author as book_author,
    t.issue_date,
    t.due_date,
    DATEDIFF(CURDATE(), t.due_date) as days_overdue,
    CalculateFine(t.due_date, CURDATE()) as current_fine
FROM transactions t
JOIN users u ON t.user_id = u.id
JOIN books b ON t.book_id = b.id
WHERE t.status = 'overdue' OR (t.status = 'issued' AND t.due_date < CURDATE());

-- Trigger to automatically update overdue status
DELIMITER //
CREATE TRIGGER update_overdue_status
BEFORE UPDATE ON transactions
FOR EACH ROW
BEGIN
    IF NEW.status = 'issued' AND NEW.due_date < CURDATE() THEN
        SET NEW.status = 'overdue';
    END IF;
END //
DELIMITER ;

-- Create indexes for better performance
CREATE INDEX idx_transactions_user_book ON transactions(user_id, book_id);
CREATE INDEX idx_transactions_dates ON transactions(issue_date, due_date, return_date);
CREATE INDEX idx_books_search ON books(title, author, category);