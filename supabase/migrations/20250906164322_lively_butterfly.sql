-- Common SQL Queries for Library Management System

-- 1. User Authentication
-- Login query
SELECT id, email, name, role, phone, address, fine_amount, membership_date
FROM users 
WHERE email = ? AND password = ?;

-- Register new user
INSERT INTO users (email, password, name, phone, address, role) 
VALUES (?, ?, ?, ?, ?, 'user');

-- 2. Book Management Queries

-- Search books by title, author, or ISBN
SELECT * FROM books 
WHERE (title LIKE ? OR author LIKE ? OR isbn LIKE ?) 
AND (? = 'all' OR category = ?)
ORDER BY title;

-- Get all book categories
SELECT DISTINCT category FROM books ORDER BY category;

-- Get book by ID
SELECT * FROM books WHERE id = ?;

-- Add new book (librarian only)
INSERT INTO books (title, author, isbn, category, publisher, publish_year, total_copies, available_copies, location, description, cover_url)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- Update book information
UPDATE books 
SET title = ?, author = ?, isbn = ?, category = ?, publisher = ?, 
    publish_year = ?, total_copies = ?, location = ?, description = ?, cover_url = ?
WHERE id = ?;

-- Delete book
DELETE FROM books WHERE id = ?;

-- 3. Transaction Management Queries

-- Get user's current issued books
SELECT t.*, b.title, b.author, b.isbn 
FROM transactions t
JOIN books b ON t.book_id = b.id
WHERE t.user_id = ? AND t.status IN ('issued', 'overdue')
ORDER BY t.issue_date DESC;

-- Get user's transaction history
SELECT t.*, b.title, b.author, b.isbn 
FROM transactions t
JOIN books b ON t.book_id = b.id
WHERE t.user_id = ?
ORDER BY t.issue_date DESC;

-- Get all transactions (librarian view)
SELECT t.*, u.name as user_name, u.email, b.title, b.author 
FROM transactions t
JOIN users u ON t.user_id = u.id
JOIN books b ON t.book_id = b.id
ORDER BY t.issue_date DESC;

-- Issue a book
CALL IssueBook(?, ?, @success, @message);
SELECT @success as success, @message as message;

-- Return a book
CALL ReturnBook(?, @success, @message, @fine);
SELECT @success as success, @message as message, @fine as fine_amount;

-- 4. Fine Management Queries

-- Calculate current fine for a transaction
SELECT CalculateFine(due_date, CURDATE()) as current_fine
FROM transactions 
WHERE id = ? AND status IN ('issued', 'overdue');

-- Get all users with outstanding fines
SELECT u.id, u.name, u.email, u.fine_amount
FROM users u
WHERE u.fine_amount > 0
ORDER BY u.fine_amount DESC;

-- Update user fine amount
UPDATE users SET fine_amount = fine_amount + ? WHERE id = ?;

-- Pay fine (reduce fine amount)
UPDATE users SET fine_amount = GREATEST(0, fine_amount - ?) WHERE id = ?;

-- 5. Dashboard and Analytics Queries

-- Get dashboard statistics
SELECT 
    (SELECT COUNT(*) FROM books) as total_books,
    (SELECT COUNT(*) FROM users WHERE role = 'user') as total_users,
    (SELECT COUNT(*) FROM transactions WHERE status IN ('issued', 'overdue')) as active_transactions,
    (SELECT SUM(fine_amount) FROM users) as total_fines,
    (SELECT COUNT(*) FROM transactions WHERE status = 'overdue') as overdue_count;

-- Get book category distribution
SELECT category, COUNT(*) as book_count
FROM books
GROUP BY category
ORDER BY book_count DESC;

-- Get transaction status distribution
SELECT status, COUNT(*) as transaction_count
FROM transactions
GROUP BY status;

-- Get most popular books (most issued)
SELECT b.title, b.author, COUNT(t.id) as issue_count
FROM books b
LEFT JOIN transactions t ON b.id = t.book_id
GROUP BY b.id, b.title, b.author
ORDER BY issue_count DESC
LIMIT 10;

-- Get users with most transactions
SELECT u.name, u.email, COUNT(t.id) as transaction_count
FROM users u
LEFT JOIN transactions t ON u.id = t.user_id
WHERE u.role = 'user'
GROUP BY u.id, u.name, u.email
ORDER BY transaction_count DESC
LIMIT 10;

-- 6. Overdue Management Queries

-- Get all overdue books
SELECT * FROM overdue_books;

-- Update overdue transactions
UPDATE transactions 
SET status = 'overdue' 
WHERE status = 'issued' AND due_date < CURDATE();

-- Send overdue notifications (get overdue book details)
SELECT 
    u.name, u.email, u.phone,
    b.title, b.author,
    t.due_date,
    DATEDIFF(CURDATE(), t.due_date) as days_overdue,
    CalculateFine(t.due_date, CURDATE()) as fine_amount
FROM transactions t
JOIN users u ON t.user_id = u.id
JOIN books b ON t.book_id = b.id
WHERE t.status = 'overdue';

-- 7. Reports Queries

-- Monthly transaction report
SELECT 
    YEAR(issue_date) as year,
    MONTH(issue_date) as month,
    COUNT(*) as transactions_count,
    COUNT(CASE WHEN status = 'returned' THEN 1 END) as returned_count,
    COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_count,
    SUM(fine_amount) as total_fines
FROM transactions
WHERE issue_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY YEAR(issue_date), MONTH(issue_date)
ORDER BY year DESC, month DESC;

-- Book availability report
SELECT * FROM book_availability ORDER BY title;

-- User activity report
SELECT 
    u.id, u.name, u.email, u.membership_date,
    COUNT(t.id) as total_transactions,
    COUNT(CASE WHEN t.status = 'issued' THEN 1 END) as current_issues,
    COUNT(CASE WHEN t.status = 'overdue' THEN 1 END) as overdue_books,
    u.fine_amount
FROM users u
LEFT JOIN transactions t ON u.id = t.user_id
WHERE u.role = 'user'
GROUP BY u.id, u.name, u.email, u.membership_date, u.fine_amount
ORDER BY total_transactions DESC;

-- 8. Search and Filter Queries

-- Advanced book search
SELECT b.*, 
    (SELECT COUNT(*) FROM transactions t WHERE t.book_id = b.id) as total_issues
FROM books b
WHERE 
    (? = '' OR b.title LIKE CONCAT('%', ?, '%'))
    AND (? = '' OR b.author LIKE CONCAT('%', ?, '%'))
    AND (? = 'all' OR b.category = ?)
    AND (? = 'all' OR 
         (? = 'available' AND b.available_copies > 0) OR
         (? = 'unavailable' AND b.available_copies = 0))
ORDER BY b.title;

-- Search users
SELECT u.*, 
    COUNT(t.id) as transaction_count
FROM users u
LEFT JOIN transactions t ON u.id = t.user_id
WHERE 
    (? = '' OR u.name LIKE CONCAT('%', ?, '%'))
    AND (? = '' OR u.email LIKE CONCAT('%', ?, '%'))
    AND (? = 'all' OR u.role = ?)
GROUP BY u.id
ORDER BY u.name;