// Modal Control
document.addEventListener('DOMContentLoaded', function() {
    // Add User Modal
    const addUserModal = document.getElementById('addUserModal');
    const openAddModalBtn = document.getElementById('openAddModal');
    const closeAddModalBtn = document.getElementById('closeAddModal');
    
    if (openAddModalBtn) {
        openAddModalBtn.addEventListener('click', function() {
            addUserModal.classList.add('active');
        });
    }
    
    if (closeAddModalBtn) {
        closeAddModalBtn.addEventListener('click', function() {
            addUserModal.classList.remove('active');
        });
    }

    // Update User Modal
    const updateUserModal = document.getElementById('updateUserModal');
    const closeUpdateModalBtn = document.getElementById('closeUpdateModal');
    
    if (closeUpdateModalBtn) {
        closeUpdateModalBtn.addEventListener('click', function() {
            updateUserModal.classList.remove('active');
        });
    }

    // View User Modal
    const viewUserModal = document.getElementById('viewUserModal');
    const closeViewModalBtn = document.getElementById('closeViewModal');
    
    if (closeViewModalBtn) {
        closeViewModalBtn.addEventListener('click', function() {
            viewUserModal.classList.remove('active');
        });
    }

    // Delete Confirmation Modal
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const closeDeleteModalBtn = document.getElementById('closeDeleteModal');
    
    if (closeDeleteModalBtn) {
        closeDeleteModalBtn.addEventListener('click', function() {
            deleteConfirmModal.classList.remove('active');
        });
    }

    // Close modals when clicking outside
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(function(modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Update time display
    function updateTime() {
        const now = new Date();
        const timeDisplay = document.querySelector('.time-display');
        
        if (timeDisplay) {
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const timeString = `${hours}:${minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
            
            const options = { month: 'short', day: '2-digit', year: 'numeric' };
            const dateString = now.toLocaleDateString('en-US', options);
            
            timeDisplay.innerHTML = `${timeString}<br>${dateString}`;
        }
    }
    
    updateTime();
    setInterval(updateTime, 60000); // Update every minute

    // Load members when dashboard loads
    loadMembers();
    
    // Form submission events
    setupFormEventListeners();
});

// Login page functionality
const loginButton = document.getElementById('loginButton');

if (loginButton) {
    loginButton.addEventListener('click', function() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        performLogin(username, password);
    });
    
    // Add Enter key event listener for password field
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                loginButton.click();
            }
        });
    }
}

// Login function to handle the actual login process
async function performLogin(username, password) {
    const loginMessage = document.getElementById('loginMessage');
    
    // Clear previous message
    loginMessage.textContent = '';
    loginMessage.className = 'login-message';
    
    if (!username || !password) {
        loginMessage.textContent = 'Please enter both username and password';
        loginMessage.classList.add('error');
        return;
    }
    
    try {
        console.log('Attempting login with:', { username, password });
        
        // Send login request to backend
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        console.log('Login response status:', response.status);
        const data = await response.json();
        console.log('Login response data:', data);
        
        if (response.ok && data.success) {
            // Save user data and token in localStorage
            localStorage.setItem('user', JSON.stringify(data.data));
            localStorage.setItem('token', data.data.token || 'fake-token');
            
            // Redirect to dashboard
            window.location.href = '/dashboard.html';
        } else {
            loginMessage.textContent = data.error || 'Invalid username or password';
            loginMessage.classList.add('error');
        }
    } catch (error) {
        console.error('Login error:', error);
        loginMessage.textContent = 'An error occurred during login. Please try again later.';
        loginMessage.classList.add('error');
    }
}

// Functions for Member CRUD operations
function loadMembers() {
    const membersTableBody = document.getElementById('membersTableBody');
    if (!membersTableBody) return;
    
    // Get token from localStorage
    const token = localStorage.getItem('token') || '';
    
    // Get user info to check role
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    const userRole = userInfo.role && typeof userInfo.role === 'object' ? 
                    userInfo.role.name.toLowerCase() : 
                    (typeof userInfo.role === 'string' ? userInfo.role.toLowerCase() : '');
    
    // Use the correct endpoint based on role
    const endpoint = userRole === 'member' ? '/member' : '/manager/members';

    // Fetch members from the API
    fetch(endpoint, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Clear existing table content
            membersTableBody.innerHTML = '';
            
            // Populate table with member data
            data.data.forEach(member => {
                const row = document.createElement('tr');
                
                // Check user role for action buttons
                let actionButtons = '';
                if (userRole === 'member') {
                    // Member gets only view button
                    actionButtons = `
                        <div class="table-actions">
                            <button class="btn-action btn-view view-button" data-id="${member._id}">
                                <span class="material-icons">visibility</span>
                            </button>
                        </div>
                    `;
                } else if (userRole === 'manager') {
                    // Manager gets all buttons (full access)
                    actionButtons = `
                        <div class="table-actions">
                            <button class="btn-action btn-edit edit-button" data-id="${member._id}">
                                <span class="material-icons">edit</span>
                            </button>
                            <button class="btn-action btn-delete delete-button" data-id="${member._id}">
                                <span class="material-icons">delete</span>
                            </button>
                            <button class="btn-action btn-view view-button" data-id="${member._id}">
                                <span class="material-icons">visibility</span>
                            </button>
                        </div>
                    `;
                }
                
                row.innerHTML = `
                    <td>${member._id.substring(0, 8)}...</td>
                    <td>${member.name || ''}</td>
                    <td>${member.email || ''}</td>
                    <td>${member.phone || 'N/A'}</td>
                    <td class="action-buttons">${actionButtons}</td>
                `;
                membersTableBody.appendChild(row);
            });
            
            // Attach click events to the new buttons
            attachButtonEvents();
            
            // Control UI based on user role
            const addUserBtn = document.getElementById('openAddModal');
            
            if (userRole === 'member') {
                // Members can only view
                if (addUserBtn) addUserBtn.style.display = 'none';
                // Hide edit/delete buttons for members
                document.querySelectorAll('.edit-button').forEach(btn => btn.style.display = 'none');
                document.querySelectorAll('.delete-button').forEach(btn => btn.style.display = 'none');
            } else if (userRole === 'manager') {
                // Managers (Admin) have full access (add, edit, delete, view)
                if (addUserBtn) addUserBtn.style.display = 'flex';
            }
        } else {
            console.error('Failed to load members:', data.error);
        }
    })
    .catch(error => {
        console.error('Error loading members:', error);
    });
}

function attachButtonEvents() {
    // Edit buttons
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            loadMemberForEdit(userId);
        });
    });
    
    // View buttons
    document.querySelectorAll('.view-button').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            loadMemberForView(userId);
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            const deleteConfirmModal = document.getElementById('deleteConfirmModal');
            deleteConfirmModal.setAttribute('data-user-id', userId);
            deleteConfirmModal.classList.add('active');
        });
    });
}

function setupFormEventListeners() {
    // Add member form submission
    const confirmAddButton = document.getElementById('confirmAddButton');
    if (confirmAddButton) {
        confirmAddButton.addEventListener('click', addMember);
    }
    
    const cancelAddButton = document.getElementById('cancelAddButton');
    if (cancelAddButton) {
        cancelAddButton.addEventListener('click', function() {
            document.getElementById('addUserModal').classList.remove('active');
        });
    }
    
    // Update member form submission
    const confirmUpdateButton = document.getElementById('confirmUpdateButton');
    if (confirmUpdateButton) {
        confirmUpdateButton.addEventListener('click', updateMember);
    }
    
    const cancelUpdateButton = document.getElementById('cancelUpdateButton');
    if (cancelUpdateButton) {
        cancelUpdateButton.addEventListener('click', function() {
            document.getElementById('updateUserModal').classList.remove('active');
        });
    }
    
    // Delete member confirmation
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', deleteMember);
    }
    
    const cancelDeleteButton = document.getElementById('cancelDeleteButton');
    if (cancelDeleteButton) {
        cancelDeleteButton.addEventListener('click', function() {
            document.getElementById('deleteConfirmModal').classList.remove('active');
        });
    }
    
    // View modal close button
    const closeViewButton = document.getElementById('closeViewButton');
    if (closeViewButton) {
        closeViewButton.addEventListener('click', function() {
            document.getElementById('viewUserModal').classList.remove('active');
        });
    }
}

function loadMemberForEdit(memberId) {
    // Get token from localStorage
    const token = localStorage.getItem('token') || '';
    
    // Fetch member data
    fetch(`/manager/members/${memberId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const member = data.data;
            const updateUserModal = document.getElementById('updateUserModal');
            
            // Set the member ID as data attribute and hidden field
            updateUserModal.setAttribute('data-user-id', member._id);
            document.getElementById('updateUserId').value = member._id;
            
            // Display read-only user information
            document.getElementById('displayUserId').textContent = member._id.substring(0, 8) + '...';
            document.getElementById('displayUserName').textContent = member.name || 'N/A';
            document.getElementById('displayUserEmail').textContent = member.email || 'N/A';
            
            // Set current role in dropdown
            const currentRole = member.role ? member.role.name.toLowerCase() : 'member';
            document.getElementById('updateRole').value = currentRole;
            
            // Show the modal
            updateUserModal.classList.add('active');
        } else {
            console.error('Failed to load member details:', data.error);
            showNotification('Failed to load member details', 'error');
        }
    })
    .catch(error => {
        console.error('Error loading member details:', error);
        showNotification('Error loading member details', 'error');
    });
}

function loadMemberForView(memberId) {
    // Get token from localStorage
    const token = localStorage.getItem('token') || '';
    
    // Fetch member data
    fetch(`/manager/members/${memberId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const member = data.data;
            const viewUserModal = document.getElementById('viewUserModal');
            
            // Fill view fields with member data
            document.getElementById('viewUserId').textContent = member._id || 'N/A';
            document.getElementById('viewName').textContent = member.name || 'N/A';
            document.getElementById('viewEmail').textContent = member.email || 'N/A';
            document.getElementById('viewUsername').textContent = member.username || member.email || 'N/A';
            document.getElementById('viewRole').textContent = member.role ? member.role.name : 'Member';
            document.getElementById('viewCreatedDate').textContent = member.createdAt ? 
                new Date(member.createdAt).toLocaleDateString() : 'N/A';
            document.getElementById('viewStatus').textContent = 'Active';
            
            // Show the modal
            viewUserModal.classList.add('active');
        } else {
            console.error('Failed to load member details:', data.error);
            showNotification('Failed to load member details', 'error');
        }
    })
    .catch(error => {
        console.error('Error loading member details:', error);
        showNotification('Error loading member details', 'error');
    });
}

function addMember() {
    // Get token from localStorage
    const token = localStorage.getItem('token') || '';
    
    // Get form data
    const memberData = {
        name: document.getElementById('addName').value,
        email: document.getElementById('addEmail').value,
        username: document.getElementById('addUsername').value,
        password: document.getElementById('addPassword').value
    };
    
    // Validate required fields
    if (!memberData.name || !memberData.email || !memberData.username || !memberData.password) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Send data to API
    fetch('/manager/members', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(memberData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Close modal
            document.getElementById('addUserModal').classList.remove('active');
            
            // Clear form
            document.getElementById('addName').value = '';
            document.getElementById('addEmail').value = '';
            document.getElementById('addUsername').value = '';
            document.getElementById('addPassword').value = '';
            
            // Reload members table
            loadMembers();
            showNotification('Member added successfully!', 'success');
        } else {
            console.error('Failed to add member:', data.error);
            showNotification('Error adding member: ' + (data.error || 'Unknown error'), 'error');
        }
    })
    .catch(error => {
        console.error('Error adding member:', error);
        showNotification('Error adding member. Please try again.', 'error');
    });
}

function updateMember() {
    // Get token from localStorage
    const token = localStorage.getItem('token') || '';
    
    // Get member ID from modal data attribute or hidden field
    const updateUserModal = document.getElementById('updateUserModal');
    const memberId = updateUserModal.getAttribute('data-user-id') || document.getElementById('updateUserId').value;
    
    if (!memberId) {
        showNotification('Error: Member ID not found', 'error');
        return;
    }
    
    // Get new role value
    const newRole = document.getElementById('updateRole').value;
    if (!newRole) {
        showNotification('Please select a role', 'error');
        return;
    }
    
    // Prepare data for role update only
    const memberData = { role: newRole };
    
    // Send data to API
    fetch(`/manager/members/${memberId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(memberData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Close modal
            updateUserModal.classList.remove('active');
            
            // Reload members table
            loadMembers();
            showNotification('User role updated successfully!', 'success');
        } else {
            console.error('Failed to update member role:', data.error);
            showNotification('Error updating role: ' + (data.error || 'Unknown error'), 'error');
        }
    })
    .catch(error => {
        console.error('Error updating member role:', error);
        showNotification('Error updating role. Please try again.', 'error');
    });
}

function deleteMember() {
    // Get token from localStorage
    const token = localStorage.getItem('token') || '';
    
    // Get member ID from modal data attribute
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const memberId = deleteConfirmModal.getAttribute('data-user-id');
    
    // Send delete request to API
    fetch(`/manager/members/${memberId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Close modal
            deleteConfirmModal.classList.remove('active');
            
            // Reload members table
            loadMembers();
            showNotification('Member deleted successfully!', 'success');
        } else {
            console.error('Failed to delete member:', data.error);
            showNotification('Error deleting member: ' + (data.error || 'Unknown error'), 'error');
        }
    })
    .catch(error => {
        console.error('Error deleting member:', error);
        showNotification('Error deleting member. Please try again.', 'error');
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notificationContainer = document.getElementById('notificationContainer');
    if (!notificationContainer) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    notificationContainer.appendChild(notification);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

// Update dashboard header with user info
function updateDashboardHeader() {
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    
    const userNameElement = document.querySelector('.user-name');
    const userRoleElement = document.querySelector('.user-role');
    
    if (userNameElement && userInfo.name) {
        userNameElement.textContent = userInfo.name;
    }
    
    if (userRoleElement && userInfo.role) {
        // Handle nested role object structure
        const roleName = typeof userInfo.role === 'object' ? userInfo.role.name : userInfo.role;
        userRoleElement.textContent = roleName || 'Unknown Role';
        
        // Hide CRUD controls for non-manager/admin users
        if (roleName && roleName.toLowerCase() === 'member') {
            // Hide add user button
            const addUserBtn = document.getElementById('openAddModal');
            if (addUserBtn) addUserBtn.style.display = 'none';
            
            // Hide edit and delete buttons, only show view buttons
            const editButtons = document.querySelectorAll('.edit-button');
            const deleteButtons = document.querySelectorAll('.delete-button');
            
            editButtons.forEach(btn => btn.style.display = 'none');
            deleteButtons.forEach(btn => btn.style.display = 'none');
            
            // Add message for member users
            const tableHeader = document.querySelector('.members-table-header');
            if (tableHeader) {
                const memberMessage = document.createElement('p');
                memberMessage.className = 'member-message';
                memberMessage.textContent = 'You have view-only access as a member';
                memberMessage.style.color = '#543512';
                memberMessage.style.fontStyle = 'italic';
                memberMessage.style.marginTop = '10px';
                tableHeader.appendChild(memberMessage);
            }
        }
    }
}

// Check if user is logged in when dashboard loads
if (window.location.pathname.includes('dashboard.html')) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
    } else {
        updateDashboardHeader();
    }
}

// Handle logout
const logoutButton = document.querySelector('.sidebar-footer .menu-item');
if (logoutButton) {
    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login.html';
    });
}
