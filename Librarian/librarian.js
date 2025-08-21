// Application State
        let currentUser = null;
        let activeTab = 'pending';

        // Mock Data
        const users = [
            { id: 1, username: 'librarian1', password: 'lib123', role: 'librarian', name: 'Sarah Johnson' },
            { id: 2, username: 'admin1', password: 'admin123', role: 'admin', name: 'John Admin' }
        ];

        let books = [
            { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', quantity: 3 },
            { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', quantity: 2 },
            { id: 3, title: '1984', author: 'George Orwell', quantity: 0 },
            { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', quantity: 4 },
            { id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger', quantity: 1 }
        ];

        let requests = [
            { id: 1, readerId: 101, readerName: 'Alice Johnson', bookId: 1, bookTitle: 'The Great Gatsby', status: 'pending', requestDate: '2025-08-20' },
            { id: 2, readerId: 102, readerName: 'Bob Smith', bookId: 2, bookTitle: 'To Kill a Mockingbird', status: 'pending', requestDate: '2025-08-20' },
            { id: 3, readerId: 103, readerName: 'Carol Davis', bookId: 3, bookTitle: '1984', status: 'pending', requestDate: '2025-08-19' },
            { id: 4, readerId: 104, readerName: 'David Wilson', bookId: 1, bookTitle: 'The Great Gatsby', status: 'approved', requestDate: '2025-08-18', approvedDate: '2025-08-18' },
            { id: 5, readerId: 105, readerName: 'Eve Brown', bookId: 4, bookTitle: 'Pride and Prejudice', status: 'approved', requestDate: '2025-08-17', approvedDate: '2025-08-17' }
        ];

        let bookLogs = [
            { id: 1, requestId: 4, readerId: 104, readerName: 'David Wilson', bookId: 1, bookTitle: 'The Great Gatsby', borrowedDate: '2025-08-18', returnDate: null, condition: null },
            { id: 2, requestId: 5, readerId: 105, readerName: 'Eve Brown', bookId: 4, bookTitle: 'Pride and Prejudice', borrowedDate: '2025-08-17', returnDate: null, condition: null }
        ];

        // Authentication
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            const user = users.find(u => u.username === username && u.password === password && u.role === 'librarian');
            
            if (user) {
                currentUser = user;
                document.getElementById('loginScreen').classList.add('d-none');
                document.getElementById('dashboard').classList.remove('d-none');
                document.getElementById('userName').textContent = user.name;
                updateDashboard();
            } else {
                alert('Invalid credentials or unauthorized role');
            }
        });

        function logout() {
            currentUser = null;
            document.getElementById('loginScreen').classList.remove('d-none');
            document.getElementById('dashboard').classList.add('d-none');
            document.getElementById('loginForm').reset();
        }

        // Tab Management
        function showTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('[id$="Tab"]').forEach(tab => tab.classList.add('d-none'));
            
            // Remove active class from all nav links
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            
            // Show selected tab
            document.getElementById(tabName + 'Tab').classList.remove('d-none');
            
            // Add active class to clicked nav link
            event.target.closest('.nav-link').classList.add('active');
            
            activeTab = tabName;
            updateDashboard();
        }

        // Request Management
        function approveRequest(requestId) {
            const request = requests.find(r => r.id === requestId);
            const book = books.find(b => b.id === request.bookId);
            
            if (book.quantity > 0) {
                // Update book quantity
                book.quantity--;
                
                // Update request status
                request.status = 'approved';
                request.approvedDate = new Date().toISOString().split('T')[0];
                
                // Add to book logs
                const newLog = {
                    id: bookLogs.length + 1,
                    requestId: requestId,
                    readerId: request.readerId,
                    readerName: request.readerName,
                    bookId: request.bookId,
                    bookTitle: request.bookTitle,
                    borrowedDate: new Date().toISOString().split('T')[0],
                    returnDate: null,
                    condition: null
                };
                bookLogs.push(newLog);
                
                alert(`Request approved! ${book.title} has been assigned to ${request.readerName}`);
                updateDashboard();
            } else {
                rejectRequest(requestId, 'Out of stock');
            }
        }

        function rejectRequest(requestId, reason = '') {
            const rejectionReason = reason || prompt('Please provide a reason for rejection:') || 'No reason provided';
            
            const request = requests.find(r => r.id === requestId);
            request.status = 'rejected';
            request.rejectedDate = new Date().toISOString().split('T')[0];
            request.rejectionReason = rejectionReason;
            
            alert(`Request rejected: ${rejectionReason}`);
            updateDashboard();
        }

        function returnBook(logId, condition) {
            const log = bookLogs.find(l => l.id === logId);
            
            // Update book logs
            log.returnDate = new Date().toISOString().split('T')[0];
            log.condition = condition;
            
            // Increase book stock
            const book = books.find(b => b.id === log.bookId);
            book.quantity++;
            
            alert(`Book returned successfully! Condition: ${condition}`);
            updateDashboard();
        }

        // Dashboard Updates
        function updateDashboard() {
            updateCounts();
            
            switch(activeTab) {
                case 'pending':
                    renderPendingRequests();
                    break;
                case 'borrowed':
                    renderBorrowedBooks();
                    break;
                case 'returns':
                    renderReturnHistory();
                    break;
                case 'inventory':
                    renderInventory();
                    break;
            }
        }

        function updateCounts() {
            const pendingRequests = requests.filter(r => r.status === 'pending');
            const borrowedBooks = bookLogs.filter(l => !l.returnDate);
            
            document.getElementById('pendingCount').textContent = pendingRequests.length;
            document.getElementById('borrowedCount').textContent = borrowedBooks.length;
        }

        function renderPendingRequests() {
            const container = document.getElementById('pendingRequests');
            const pendingRequests = requests.filter(r => r.status === 'pending');
            
            if (pendingRequests.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-5 text-muted">
                        <i class="bi bi-clock" style="font-size: 3rem;"></i>
                        <p class="mt-3">No pending requests</p>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = pendingRequests.map(request => {
                const book = books.find(b => b.id === request.bookId);
                const stockClass = book?.quantity > 0 ? 'success' : 'danger';
                const stockText = book?.quantity > 0 ? `${book.quantity} in stock` : 'Out of stock';
                
                return `
                    <div class="card book-card mb-3">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <div class="flex-grow-1">
                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                        <h6 class="card-title mb-0">${request.bookTitle}</h6>
                                        <span class="badge bg-${stockClass} badge-stock">${stockText}</span>
                                    </div>
                                    <p class="text-muted mb-1">
                                        Requested by: <strong>${request.readerName}</strong> • ID: ${request.readerId}
                                    </p>
                                    <small class="text-muted">Request Date: ${request.requestDate}</small>
                                </div>
                                <div class="ms-3">
                                    <button 
                                        class="btn btn-success btn-sm me-1 ${book?.quantity === 0 ? 'disabled' : ''}" 
                                        onclick="approveRequest(${request.id})"
                                        ${book?.quantity === 0 ? 'disabled' : ''}
                                    >
                                        <i class="bi bi-check-circle me-1"></i>
                                        ${book?.quantity > 0 ? 'Approve' : 'Out of Stock'}
                                    </button>
                                    <button class="btn btn-danger btn-sm" onclick="rejectRequest(${request.id})">
                                        <i class="bi bi-x-circle me-1"></i>
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function renderBorrowedBooks() {
            const container = document.getElementById('borrowedBooks');
            const borrowedBooks = bookLogs.filter(l => !l.returnDate);
            
            if (borrowedBooks.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-5 text-muted">
                        <i class="bi bi-book" style="font-size: 3rem;"></i>
                        <p class="mt-3">No books currently borrowed</p>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = borrowedBooks.map(log => `
                <div class="card book-card mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="flex-grow-1">
                                <h6 class="card-title">${log.bookTitle}</h6>
                                <p class="text-muted mb-1">
                                    Borrowed by: <strong>${log.readerName}</strong> • ID: ${log.readerId}
                                </p>
                                <small class="text-muted">Borrowed Date: ${log.borrowedDate}</small>
                            </div>
                            <div class="ms-3">
                                <select class="form-select form-select-sm" onchange="if(this.value) { returnBook(${log.id}, this.value); this.value = ''; }">
                                    <option value="">Mark as Returned</option>
                                    <option value="Good">Good Condition</option>
                                    <option value="Fair">Fair Condition</option>
                                    <option value="Damaged">Damaged</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function renderReturnHistory() {
            const container = document.getElementById('returnHistory');
            const returnedBooks = bookLogs.filter(l => l.returnDate);
            
            if (returnedBooks.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-5 text-muted">
                        <i class="bi bi-arrow-clockwise" style="font-size: 3rem;"></i>
                        <p class="mt-3">No return history</p>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = returnedBooks.map(log => {
                let conditionClass = 'condition-good';
                if (log.condition === 'Fair') conditionClass = 'condition-fair';
                if (log.condition === 'Damaged') conditionClass = 'condition-damaged';
                
                return `
                    <div class="card book-card mb-3">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <div class="flex-grow-1">
                                    <h6 class="card-title">${log.bookTitle}</h6>
                                    <p class="text-muted mb-1">
                                        Returned by: <strong>${log.readerName}</strong>
                                    </p>
                                    <div class="d-flex gap-3">
                                        <small class="text-muted">Borrowed: ${log.borrowedDate}</small>
                                        <small class="text-muted">Returned: ${log.returnDate}</small>
                                    </div>
                                </div>
                                <div class="ms-3">
                                    <span class="badge ${conditionClass}">${log.condition}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function renderInventory() {
            const container = document.getElementById('bookInventory');
            
            container.innerHTML = books.map(book => {
                let badgeClass = 'success';
                let statusText = `${book.quantity} Available`;
                
                if (book.quantity === 0) {
                    badgeClass = 'danger';
                    statusText = 'Out of Stock';
                } else if (book.quantity <= 2) {
                    badgeClass = 'warning';
                }
                
                return `
                    <div class="card mb-3">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 class="card-title mb-1">${book.title}</h6>
                                    <p class="text-muted mb-0">by ${book.author}</p>
                                </div>
                                <div class="d-flex align-items-center">
                                    <span class="badge bg-${badgeClass} me-2">${statusText}</span>
                                    ${book.quantity === 0 ? '<i class="bi bi-exclamation-triangle text-danger"></i>' : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Initialize the application
        updateDashboard();