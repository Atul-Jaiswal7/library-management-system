// Online Library Management System - JavaScript Application

class LibraryApp {
    constructor() {
        this.currentUser = null;
        this.books = [];
        this.transactions = [];
        this.users = [];
        this.currentPage = 'catalog';
        this.isLogin = true;
        
        this.init();
    }

    init() {
        this.loadMockData();
        this.bindEvents();
        this.checkStoredUser();
        this.showPage('catalog');
        this.loadBooks();
    }

    // Mock Data (simulating database)
    loadMockData() {
        this.users = [
            {
                id: 1,
                email: 'john.doe@email.com',
                password: 'password123',
                name: 'John Doe',
                role: 'user',
                membershipDate: '2024-01-15',
                phone: '+1-555-0123',
                address: '123 Main St, City, State 12345',
                fineAmount: 0
            },
            {
                id: 2,
                email: 'librarian@library.com',
                password: 'admin123',
                name: 'Sarah Wilson',
                role: 'librarian',
                membershipDate: '2023-06-01',
                phone: '+1-555-0124',
                address: '456 Oak Ave, City, State 12345',
                fineAmount: 0
            },
            {
                id: 3,
                email: 'alice.smith@email.com',
                password: 'password123',
                name: 'Alice Smith',
                role: 'user',
                membershipDate: '2024-02-20',
                phone: '+1-555-0125',
                address: '789 Pine St, City, State 12345',
                fineAmount: 5.50
            }
        ];

        this.books = [
            {
                id: 1,
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                isbn: '978-0-7432-7356-5',
                category: 'Fiction',
                publisher: 'Scribner',
                publishYear: 1925,
                totalCopies: 5,
                availableCopies: 3,
                location: 'A-001-01',
                description: 'A classic American novel about the Jazz Age and the American Dream.',
                coverUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'
            },
            {
                id: 2,
                title: 'To Kill a Mockingbird',
                author: 'Harper Lee',
                isbn: '978-0-06-112008-4',
                category: 'Fiction',
                publisher: 'J.B. Lippincott & Co.',
                publishYear: 1960,
                totalCopies: 4,
                availableCopies: 2,
                location: 'A-001-02',
                description: 'A gripping tale of racial injustice and childhood innocence in the American South.',
                coverUrl: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'
            },
            {
                id: 3,
                title: 'Introduction to Algorithms',
                author: 'Thomas H. Cormen',
                isbn: '978-0-262-03384-8',
                category: 'Computer Science',
                publisher: 'MIT Press',
                publishYear: 2009,
                totalCopies: 3,
                availableCopies: 1,
                location: 'C-005-12',
                description: 'Comprehensive guide to algorithms and data structures for computer science.',
                coverUrl: 'https://images.pexels.com/photos/2228555/pexels-photo-2228555.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'
            },
            {
                id: 4,
                title: 'Clean Code',
                author: 'Robert C. Martin',
                isbn: '978-0-13-235088-4',
                category: 'Computer Science',
                publisher: 'Prentice Hall',
                publishYear: 2008,
                totalCopies: 6,
                availableCopies: 4,
                location: 'C-005-08',
                description: 'A handbook of agile software craftsmanship and best practices.',
                coverUrl: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'
            },
            {
                id: 5,
                title: 'Sapiens',
                author: 'Yuval Noah Harari',
                isbn: '978-0-06-231609-7',
                category: 'History',
                publisher: 'Harper',
                publishYear: 2014,
                totalCopies: 4,
                availableCopies: 3,
                location: 'H-003-15',
                description: 'A brief history of humankind from the Stone Age to the present.',
                coverUrl: 'https://images.pexels.com/photos/1261427/pexels-photo-1261427.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'
            },
            {
                id: 6,
                title: 'The Midnight Library',
                author: 'Matt Haig',
                isbn: '978-0-525-55948-1',
                category: 'Fiction',
                publisher: 'Viking',
                publishYear: 2020,
                totalCopies: 8,
                availableCopies: 6,
                location: 'A-002-22',
                description: 'A philosophical novel about life, regret, and infinite possibilities.',
                coverUrl: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'
            }
        ];

        this.transactions = [
            {
                id: 1,
                userId: 1,
                bookId: 1,
                issueDate: '2024-11-01',
                dueDate: '2024-11-15',
                returnDate: null,
                status: 'issued',
                fineAmount: 0
            },
            {
                id: 2,
                userId: 1,
                bookId: 3,
                issueDate: '2024-10-20',
                dueDate: '2024-11-03',
                returnDate: '2024-11-05',
                status: 'returned',
                fineAmount: 1.00
            },
            {
                id: 3,
                userId: 3,
                bookId: 2,
                issueDate: '2024-10-15',
                dueDate: '2024-10-29',
                returnDate: null,
                status: 'overdue',
                fineAmount: 5.50
            }
        ];
    }

    // Event Binding
    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.dataset.page;
                this.showPage(page);
            });
        });

        // Mobile menu
        document.getElementById('mobile-menu-btn').addEventListener('click', () => {
            document.getElementById('nav').classList.toggle('active');
        });

        // Auth modal
        document.getElementById('login-btn').addEventListener('click', () => {
            this.showAuthModal();
        });

        document.getElementById('close-auth-modal').addEventListener('click', () => {
            this.hideAuthModal();
        });

        document.getElementById('auth-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hideAuthModal();
            }
        });

        // Auth form
        document.getElementById('auth-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAuth();
        });

        document.getElementById('auth-switch-btn').addEventListener('click', () => {
            this.toggleAuthMode();
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });

        // Search and filters
        document.getElementById('search-input').addEventListener('input', () => {
            this.filterBooks();
        });

        document.getElementById('category-filter').addEventListener('change', () => {
            this.filterBooks();
        });

        // Dashboard tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.showDashboardTab(tab);
            });
        });
    }

    // Authentication
    checkStoredUser() {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            this.currentUser = JSON.parse(storedUser);
            this.updateUserInterface();
        }
    }

    showAuthModal() {
        document.getElementById('auth-modal').classList.add('active');
        this.resetAuthForm();
    }

    hideAuthModal() {
        document.getElementById('auth-modal').classList.remove('active');
        this.resetAuthForm();
    }

    resetAuthForm() {
        document.getElementById('auth-form').reset();
        document.getElementById('auth-error').style.display = 'none';
        this.isLogin = true;
        this.updateAuthForm();
    }

    toggleAuthMode() {
        this.isLogin = !this.isLogin;
        this.updateAuthForm();
    }

    updateAuthForm() {
        const title = document.getElementById('auth-title');
        const submitBtn = document.getElementById('auth-submit');
        const switchBtn = document.getElementById('auth-switch-btn');
        const nameGroup = document.getElementById('name-group');
        const phoneGroup = document.getElementById('phone-group');
        const addressGroup = document.getElementById('address-group');

        if (this.isLogin) {
            title.textContent = 'Welcome Back';
            submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
            switchBtn.textContent = "Don't have an account? Sign up";
            nameGroup.style.display = 'none';
            phoneGroup.style.display = 'none';
            addressGroup.style.display = 'none';
        } else {
            title.textContent = 'Join Library';
            submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Sign Up';
            switchBtn.textContent = 'Already have an account? Sign in';
            nameGroup.style.display = 'block';
            phoneGroup.style.display = 'block';
            addressGroup.style.display = 'block';
        }
    }

    async handleAuth() {
        const formData = new FormData(document.getElementById('auth-form'));
        const email = formData.get('email');
        const password = formData.get('password');

        this.showLoading();

        try {
            if (this.isLogin) {
                const success = await this.login(email, password);
                if (success) {
                    this.hideAuthModal();
                    this.showToast('success', 'Login Successful', 'Welcome back!');
                } else {
                    this.showAuthError('Invalid credentials. Try: john.doe@email.com or librarian@library.com');
                }
            } else {
                const name = formData.get('name');
                const phone = formData.get('phone');
                const address = formData.get('address');

                if (!name || !phone || !address) {
                    this.showAuthError('Please fill in all fields');
                    return;
                }

                const success = await this.register({
                    email, password, name, phone, address
                });

                if (success) {
                    this.hideAuthModal();
                    this.showToast('success', 'Registration Successful', 'Welcome to the library!');
                } else {
                    this.showAuthError('User with this email already exists');
                }
            }
        } catch (error) {
            this.showAuthError('An error occurred. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    async login(email, password) {
        // Simulate API call
        await this.delay(1000);

        const user = this.users.find(u => u.email === email);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.updateUserInterface();
            return true;
        }
        return false;
    }

    async register(userData) {
        // Simulate API call
        await this.delay(1000);

        if (this.users.find(u => u.email === userData.email)) {
            return false;
        }

        const newUser = {
            id: Date.now(),
            email: userData.email,
            password: userData.password,
            name: userData.name,
            role: 'user',
            membershipDate: new Date().toISOString().split('T')[0],
            phone: userData.phone,
            address: userData.address,
            fineAmount: 0
        };

        this.users.push(newUser);
        this.currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        this.updateUserInterface();
        return true;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateUserInterface();
        this.showPage('catalog');
        this.showToast('success', 'Logged Out', 'You have been successfully logged out.');
    }

    updateUserInterface() {
        const loginBtn = document.getElementById('login-btn');
        const userInfo = document.getElementById('user-info');
        const dashboardLink = document.getElementById('dashboard-link');
        const userName = document.getElementById('user-name');
        const userRole = document.getElementById('user-role');

        if (this.currentUser) {
            loginBtn.style.display = 'none';
            userInfo.style.display = 'flex';
            dashboardLink.style.display = 'block';
            userName.textContent = this.currentUser.name;
            userRole.textContent = this.currentUser.role;
        } else {
            loginBtn.style.display = 'flex';
            userInfo.style.display = 'none';
            dashboardLink.style.display = 'none';
        }
    }

    showAuthError(message) {
        const errorElement = document.getElementById('auth-error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    // Page Navigation
    showPage(pageId) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageId}"]`).classList.add('active');

        // Show page
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(`${pageId}-page`).classList.add('active');

        this.currentPage = pageId;

        // Load page content
        if (pageId === 'catalog') {
            this.loadBooks();
        } else if (pageId === 'dashboard') {
            this.loadDashboard();
        }
    }

    // Book Management
    loadBooks() {
        this.loadCategories();
        this.filterBooks();
    }

    loadCategories() {
        const categoryFilter = document.getElementById('category-filter');
        const categories = [...new Set(this.books.map(book => book.category))].sort();
        
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    filterBooks() {
        const searchQuery = document.getElementById('search-input').value.toLowerCase();
        const selectedCategory = document.getElementById('category-filter').value;

        const filteredBooks = this.books.filter(book => {
            const matchesSearch = searchQuery === '' || 
                book.title.toLowerCase().includes(searchQuery) ||
                book.author.toLowerCase().includes(searchQuery) ||
                book.isbn.includes(searchQuery);
            
            const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
            
            return matchesSearch && matchesCategory;
        });

        this.renderBooks(filteredBooks);
        this.updateResultsCount(filteredBooks.length, searchQuery, selectedCategory);
    }

    renderBooks(books) {
        const booksGrid = document.getElementById('books-grid');
        
        if (books.length === 0) {
            booksGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book-open"></i>
                    <h3>No books found</h3>
                    <p>Try adjusting your search criteria or browse different categories.</p>
                </div>
            `;
            return;
        }

        booksGrid.innerHTML = books.map(book => this.createBookCard(book)).join('');

        // Bind issue book events
        document.querySelectorAll('.issue-book-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bookId = parseInt(e.currentTarget.dataset.bookId);
                this.issueBook(bookId);
            });
        });
    }

    createBookCard(book) {
        const isAvailable = book.availableCopies > 0;
        const showIssueButton = this.currentUser && this.currentUser.role === 'user';

        return `
            <div class="book-card">
                <div class="book-cover">
                    <img src="${book.coverUrl}" alt="${book.title}" loading="lazy">
                </div>
                <div class="book-content">
                    <div class="book-header">
                        <div class="book-info">
                            <h3 class="book-title">${book.title}</h3>
                            <p class="book-author">${book.author}</p>
                        </div>
                        <div class="availability">
                            <div class="availability-badge ${isAvailable ? 'available' : 'unavailable'}">
                                ${isAvailable ? 'Available' : 'Not Available'}
                            </div>
                            <p class="availability-count">${book.availableCopies} of ${book.totalCopies}</p>
                        </div>
                    </div>
                    
                    <div class="book-details">
                        <div class="book-detail">
                            <i class="fas fa-hashtag"></i>
                            <span>ISBN: ${book.isbn}</span>
                        </div>
                        <div class="book-detail">
                            <i class="fas fa-building"></i>
                            <span>${book.publisher}</span>
                        </div>
                        <div class="book-detail">
                            <i class="fas fa-calendar"></i>
                            <span>${book.publishYear}</span>
                        </div>
                        <div class="book-detail">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${book.location}</span>
                        </div>
                    </div>
                    
                    <p class="book-description">${book.description}</p>
                    
                    ${showIssueButton ? `
                        <div class="book-actions">
                            <button class="btn btn-primary issue-book-btn" 
                                    data-book-id="${book.id}" 
                                    ${!isAvailable ? 'disabled' : ''}>
                                <i class="fas fa-book"></i>
                                Issue Book
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    updateResultsCount(count, searchQuery, category) {
        const resultsCount = document.getElementById('results-count');
        let text = `${count} book${count !== 1 ? 's' : ''} found`;
        
        if (category !== 'all') {
            text += ` in ${category}`;
        }
        
        if (searchQuery) {
            text += ` matching "${searchQuery}"`;
        }
        
        resultsCount.textContent = text;
    }

    async issueBook(bookId) {
        if (!this.currentUser) return;

        this.showLoading();

        try {
            // Simulate API call
            await this.delay(1000);

            const book = this.books.find(b => b.id === bookId);
            if (!book || book.availableCopies <= 0) {
                this.showToast('error', 'Issue Failed', 'Book not available');
                return;
            }

            // Check if user already has this book
            const existingTransaction = this.transactions.find(
                t => t.userId === this.currentUser.id && t.bookId === bookId && 
                (t.status === 'issued' || t.status === 'overdue')
            );

            if (existingTransaction) {
                this.showToast('error', 'Issue Failed', 'You already have this book');
                return;
            }

            // Create transaction
            const issueDate = new Date();
            const dueDate = new Date(issueDate);
            dueDate.setDate(dueDate.getDate() + 14);

            const newTransaction = {
                id: Date.now(),
                userId: this.currentUser.id,
                bookId: bookId,
                issueDate: issueDate.toISOString().split('T')[0],
                dueDate: dueDate.toISOString().split('T')[0],
                returnDate: null,
                status: 'issued',
                fineAmount: 0
            };

            this.transactions.push(newTransaction);
            book.availableCopies--;

            this.showToast('success', 'Book Issued', `${book.title} has been issued successfully!`);
            this.filterBooks(); // Refresh the display

        } catch (error) {
            this.showToast('error', 'Error', 'Failed to issue book. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    // Dashboard
    loadDashboard() {
        if (!this.currentUser) {
            this.showPage('catalog');
            return;
        }

        this.updateDashboardHeader();
        this.showDashboardTab('overview');
    }

    updateDashboardHeader() {
        const title = document.getElementById('dashboard-title');
        const subtitle = document.getElementById('dashboard-subtitle');

        title.textContent = `Welcome back, ${this.currentUser.name}`;
        subtitle.textContent = this.currentUser.role === 'librarian' 
            ? 'Library Management Dashboard' 
            : 'Your Library Dashboard';
    }

    showDashboardTab(tabId) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Show tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabId}-tab`).classList.add('active');

        // Load tab content
        if (tabId === 'overview') {
            this.loadOverviewTab();
        } else if (tabId === 'transactions') {
            this.loadTransactionsTab();
        } else if (tabId === 'analytics') {
            this.loadAnalyticsTab();
        }
    }

    loadOverviewTab() {
        this.loadStatsCards();
        this.loadRecentActivity();
    }

    loadStatsCards() {
        const statsGrid = document.getElementById('stats-grid');
        
        if (this.currentUser.role === 'librarian') {
            const totalBooks = this.books.length;
            const totalUsers = this.users.filter(u => u.role === 'user').length;
            const activeTransactions = this.transactions.filter(t => 
                t.status === 'issued' || t.status === 'overdue'
            ).length;
            const totalFines = this.transactions.reduce((sum, t) => sum + t.fineAmount, 0);

            statsGrid.innerHTML = `
                <div class="stat-card">
                    <div class="stat-card-content">
                        <div class="stat-info">
                            <h3>Total Books</h3>
                            <div class="stat-value">${totalBooks}</div>
                        </div>
                        <div class="stat-icon blue">
                            <i class="fas fa-book"></i>
                        </div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-content">
                        <div class="stat-info">
                            <h3>Total Users</h3>
                            <div class="stat-value">${totalUsers}</div>
                        </div>
                        <div class="stat-icon green">
                            <i class="fas fa-users"></i>
                        </div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-content">
                        <div class="stat-info">
                            <h3>Active Transactions</h3>
                            <div class="stat-value">${activeTransactions}</div>
                        </div>
                        <div class="stat-icon amber">
                            <i class="fas fa-chart-line"></i>
                        </div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-content">
                        <div class="stat-info">
                            <h3>Total Fines</h3>
                            <div class="stat-value">$${totalFines.toFixed(2)}</div>
                        </div>
                        <div class="stat-icon red">
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                    </div>
                </div>
            `;
        } else {
            const userTransactions = this.transactions.filter(t => t.userId === this.currentUser.id);
            const issuedBooks = userTransactions.filter(t => t.status === 'issued' || t.status === 'overdue');
            const overdueBooks = userTransactions.filter(t => t.status === 'overdue');
            const membershipYear = new Date(this.currentUser.membershipDate).getFullYear();

            statsGrid.innerHTML = `
                <div class="stat-card">
                    <div class="stat-card-content">
                        <div class="stat-info">
                            <h3>Books Issued</h3>
                            <div class="stat-value">${issuedBooks.length}</div>
                        </div>
                        <div class="stat-icon blue">
                            <i class="fas fa-book-open"></i>
                        </div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-content">
                        <div class="stat-info">
                            <h3>Overdue Books</h3>
                            <div class="stat-value">${overdueBooks.length}</div>
                        </div>
                        <div class="stat-icon red">
                            <i class="fas fa-exclamation-circle"></i>
                        </div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-content">
                        <div class="stat-info">
                            <h3>Total Fines</h3>
                            <div class="stat-value">$${this.currentUser.fineAmount.toFixed(2)}</div>
                        </div>
                        <div class="stat-icon amber">
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-content">
                        <div class="stat-info">
                            <h3>Member Since</h3>
                            <div class="stat-value">${membershipYear}</div>
                        </div>
                        <div class="stat-icon green">
                            <i class="fas fa-calendar"></i>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    loadRecentActivity() {
        const recentActivity = document.getElementById('recent-activity');
        
        if (this.currentUser.role === 'user') {
            const userTransactions = this.transactions
                .filter(t => t.userId === this.currentUser.id && (t.status === 'issued' || t.status === 'overdue'))
                .slice(0, 3);

            if (userTransactions.length > 0) {
                recentActivity.innerHTML = `
                    <h3 style="margin-bottom: var(--space-4); font-size: var(--font-size-xl); font-weight: 600;">Currently Issued Books</h3>
                    <div style="display: flex; flex-direction: column; gap: var(--space-4);">
                        ${userTransactions.map(t => this.createTransactionCard(t, true)).join('')}
                    </div>
                `;

                // Bind return book events
                this.bindReturnBookEvents();
            } else {
                recentActivity.innerHTML = '';
            }
        } else {
            recentActivity.innerHTML = '';
        }
    }

    loadTransactionsTab() {
        const transactionsList = document.getElementById('transactions-list');
        
        let transactions;
        if (this.currentUser.role === 'librarian') {
            transactions = [...this.transactions].sort((a, b) => 
                new Date(b.issueDate) - new Date(a.issueDate)
            );
        } else {
            transactions = this.transactions
                .filter(t => t.userId === this.currentUser.id)
                .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));
        }

        if (transactions.length === 0) {
            transactionsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book-open"></i>
                    <h3>No transactions yet</h3>
                    <p>${this.currentUser.role === 'librarian' 
                        ? 'Book transactions will appear here when users start borrowing books.'
                        : 'Start browsing and issuing books to see your transaction history.'
                    }</p>
                </div>
            `;
        } else {
            transactionsList.innerHTML = transactions
                .map(t => this.createTransactionCard(t, this.currentUser.role === 'librarian'))
                .join('');

            // Bind return book events
            this.bindReturnBookEvents();
        }
    }

    createTransactionCard(transaction, showReturnButton = false) {
        const book = this.books.find(b => b.id === transaction.bookId);
        if (!book) return '';

        const user = this.users.find(u => u.id === transaction.userId);
        const canReturn = showReturnButton && (transaction.status === 'issued' || transaction.status === 'overdue');

        const statusIcons = {
            issued: 'fas fa-clock',
            returned: 'fas fa-check-circle',
            overdue: 'fas fa-exclamation-circle'
        };

        const statusTexts = {
            issued: 'Currently Issued',
            returned: 'Returned',
            overdue: 'Overdue'
        };

        return `
            <div class="transaction-card">
                <div class="transaction-header">
                    <div class="transaction-book">
                        <h3>${book.title}</h3>
                        <p>${book.author}</p>
                        ${user && this.currentUser.role === 'librarian' ? `<p style="font-size: var(--font-size-sm); color: var(--gray-500); margin-top: var(--space-1);">User: ${user.name}</p>` : ''}
                    </div>
                    <div class="status-badge ${transaction.status}">
                        <i class="${statusIcons[transaction.status]}"></i>
                        ${statusTexts[transaction.status]}
                    </div>
                </div>
                
                <div class="transaction-dates">
                    <div class="transaction-date">
                        <i class="fas fa-calendar"></i>
                        <span>Issued: ${transaction.issueDate}</span>
                    </div>
                    <div class="transaction-date">
                        <i class="fas fa-calendar"></i>
                        <span>Due: ${transaction.dueDate}</span>
                    </div>
                    ${transaction.returnDate ? `
                        <div class="transaction-date">
                            <i class="fas fa-calendar"></i>
                            <span>Returned: ${transaction.returnDate}</span>
                        </div>
                    ` : ''}
                </div>
                
                ${transaction.fineAmount > 0 ? `
                    <div class="fine-amount">
                        <i class="fas fa-dollar-sign"></i>
                        <span>Fine: $${transaction.fineAmount.toFixed(2)}</span>
                    </div>
                ` : ''}
                
                ${canReturn ? `
                    <button class="btn btn-primary return-book-btn" data-transaction-id="${transaction.id}">
                        <i class="fas fa-check-circle"></i>
                        Return Book
                    </button>
                ` : ''}
            </div>
        `;
    }

    bindReturnBookEvents() {
        document.querySelectorAll('.return-book-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const transactionId = parseInt(e.currentTarget.dataset.transactionId);
                this.returnBook(transactionId);
            });
        });
    }

    async returnBook(transactionId) {
        this.showLoading();

        try {
            // Simulate API call
            await this.delay(1000);

            const transaction = this.transactions.find(t => t.id === transactionId);
            if (!transaction) {
                this.showToast('error', 'Return Failed', 'Transaction not found');
                return;
            }

            const book = this.books.find(b => b.id === transaction.bookId);
            const returnDate = new Date().toISOString().split('T')[0];
            const fine = this.calculateFine(transaction.dueDate, returnDate);

            // Update transaction
            transaction.returnDate = returnDate;
            transaction.status = 'returned';
            transaction.fineAmount = fine;

            // Update book availability
            book.availableCopies++;

            // Update user fine amount
            if (fine > 0) {
                const user = this.users.find(u => u.id === transaction.userId);
                if (user) {
                    user.fineAmount += fine;
                    if (user.id === this.currentUser.id) {
                        this.currentUser.fineAmount += fine;
                        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                    }
                }
            }

            this.showToast('success', 'Book Returned', `${book.title} has been returned successfully!`);
            
            // Refresh current view
            if (this.currentPage === 'dashboard') {
                this.loadDashboard();
            } else if (this.currentPage === 'catalog') {
                this.filterBooks();
            }

        } catch (error) {
            this.showToast('error', 'Error', 'Failed to return book. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    calculateFine(dueDate, returnDate) {
        const due = new Date(dueDate);
        const returned = returnDate ? new Date(returnDate) : new Date();
        
        if (returned <= due) return 0;
        
        const overdueDays = Math.ceil((returned.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
        return overdueDays * 0.50; // $0.50 per day
    }

    loadAnalyticsTab() {
        this.loadCategoryChart();
        this.loadStatusChart();
    }

    loadCategoryChart() {
        const categoryChart = document.getElementById('category-chart');
        const categories = {};
        
        this.books.forEach(book => {
            categories[book.category] = (categories[book.category] || 0) + 1;
        });

        const totalBooks = this.books.length;
        const chartItems = Object.entries(categories)
            .sort(([,a], [,b]) => b - a)
            .map(([category, count]) => {
                const percentage = (count / totalBooks) * 100;
                return `
                    <div class="chart-item">
                        <span class="chart-label">${category}</span>
                        <div class="chart-bar-container">
                            <div class="chart-bar">
                                <div class="chart-bar-fill" style="width: ${percentage}%"></div>
                            </div>
                        </div>
                        <span class="chart-value">${count}</span>
                    </div>
                `;
            }).join('');

        categoryChart.innerHTML = chartItems;
    }

    loadStatusChart() {
        const statusChart = document.getElementById('status-chart');
        const statuses = {
            'Currently Issued': this.transactions.filter(t => t.status === 'issued').length,
            'Overdue': this.transactions.filter(t => t.status === 'overdue').length,
            'Returned': this.transactions.filter(t => t.status === 'returned').length
        };

        const chartItems = Object.entries(statuses).map(([status, count]) => `
            <div class="chart-item">
                <div style="display: flex; align-items: center; gap: var(--space-2);">
                    <div style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background: ${
                        status === 'Currently Issued' ? 'var(--blue-500)' :
                        status === 'Overdue' ? 'var(--error-500)' : 'var(--success-500)'
                    };"></div>
                    <span class="chart-label">${status}</span>
                </div>
                <span class="chart-value">${count}</span>
            </div>
        `).join('');

        statusChart.innerHTML = chartItems;
    }

    // Utility Functions
    showLoading() {
        document.getElementById('loading').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    showToast(type, title, message) {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle'
        };

        toast.innerHTML = `
            <div class="toast-icon ${type}">
                <i class="${icons[type]}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
        `;

        toastContainer.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Hide toast after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 5000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new LibraryApp();
});