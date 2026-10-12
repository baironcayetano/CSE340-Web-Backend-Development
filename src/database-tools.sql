-- ===========================================
-- DELETE ALL TABLES
-- ===========================================
DROP TABLE has_category;
DROP TABLE category;
DROP TABLE service_project;
DROP TABLE organization;
DROP TABLE roles;
DROP TABLE users;

-- ============================
-- TEST USER
-- ============================
-- Insert a test user
INSERT INTO users (name, email, password_hash, role_id) 
VALUES ('testuser', 'test@example.com', 'placeholder_hash', 1);

-- Join users and roles to see complete information
SELECT u.user_id, u.name, u.email, r.role_name, r.role_description
FROM users u
JOIN roles r ON u.role_id = r.role_id;

-- Delete the test user
DELETE FROM users WHERE email = 'test@example.com';

-- ===============================
-- SET ADMIN ACCOUNT
-- ===============================
-- View all users and roles
SELECT * FROM users;
SELECT * FROM roles;

-- Update the dedicated admin testing account to have admin role
UPDATE users 
SET role_id = (SELECT role_id FROM roles WHERE role_name = 'admin') 
WHERE email = 'admin@example.com';

-- Verify the update by listing all users and their roles
SELECT users.user_id, users.email, roles.role_name 
FROM users 
JOIN roles ON users.role_id = roles.role_id;