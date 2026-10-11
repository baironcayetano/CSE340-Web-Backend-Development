-- ===========================================
-- DELETE ALL TABLES
-- ===========================================
DROP TABLE has_category;
DROP TABLE category;
DROP TABLE service_project;
DROP TABLE organization;

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