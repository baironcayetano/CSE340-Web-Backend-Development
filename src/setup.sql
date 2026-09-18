-- ===========================
-- Organization Table
-- ===========================
CREATE TABLE organization (
	organization_id SERIAL PRIMARY KEY,
	name VARCHAR(150) NOT NULL,
	description Text NOT NULL,
	contact_email VARCHAR(255) NOT NULL,
	logo_filename VARCHAR(255) NOT NULL
);


-- ==========================
-- Sample Data 
-- ==========================
INSERT INTO organization (name, description, contact_email, logo_filename) 
VALUES 
	('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org',	'brightfuture-logo.png'),
	('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
	('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ===========================
-- Service Project
-- ===========================
-- The organization table has a relation 1:N with the service_project table.
CREATE TABLE service_project (
	project_id SERIAL PRIMARY KEY,
	organization_id INT NOT NULL REFERENCES organization(organization_id) ON DELETE CASCADE,
	title VARCHAR(150) NOT NULL,
	description Text NOT NULL,
	location VARCHAR(255) NOT NULL,
	date TIMESTAMPTZ NOT NULL
);

-- ============================
-- Sample Data
-- ============================
INSERT INTO service_project (organization_id, title, description, location, date) 
VALUES 
	   -- BrightFuture Builders Organization
	  (1,'Clothing Drive','Help us collect gently used clothes and coats to distribute to homeless individuals and families across the city.','New York, New York, USA','2026-09-19T09:00:00.000Z'),
	  (1,'Food Drive', 'Donate non-perishable food items to help us assemble care packages for people experiencing food insecurity.', 'Los Angeles, California, USA', '2026-09-25T10:30:00.000Z'),
	  (1,'Fundraising Drive', 'Join our fundraising drive or donate $1 to help cover medical treatment costs for children battling cancer.','Miami, Florida, USA', '2026-10-03T13:00:00.000Z'),
	  (1,'School Book Drive', 'Donate textbooks and school supplies to give children in underserved communities access to quality education.', 'Los Angeles, California, USA', '2026-09-26T10:30:00.000Z'),
	  (1,'Second Fundraising Drive', 'Contribute to our second fundraising drive to help build schools in developing countries.', 'Austin, Texas, USA', '2026-10-11T08:00:00.000Z'),
	  
	  -- GreenHarvest Growers
	  (2, 'Tree Planting Drive', 'Join us for a day of reforestation as we plant native trees to help restore our local forests.', 'La Tigra National Park, Francisco Morazan, Honduras', '2026-09-30T07:00:00.000Z'),
	  (2, 'River Cleanup', 'Volunteer with us to remove trash and debris from the riverbanks and help protect our local ecosystem.', 'Choluteca River, Francisco Morazan, Honduras', '2026-11-02T06:15:00.000Z'),
	  (2, 'Rainwater Harvesting Project', 'Help us install rainwater collection systems for communities with limited access to a reliable water supply.', 'Santa Ana, Francisco Morazan, Honduras', '2026-09-10T08:30:00.000Z'),
	  (2, 'Farmers Market Support', 'Support local farmers by volunteering at our community market, helping connect growers directly with buyers.', 'El Progreso, Yoro, Honduras', '2026-09-21T11:00:00.000Z'),
	  (2, 'Recycling Awareness Campaign', 'Join our educational campaign to teach residents about recycling and reducing waste in our city.', 'San Pedro Sula, Cortes, Honduras', '2026-09-27T09:00:00.000Z'),

	  -- UnityServe Volunteers
	  (3, 'Community Blood Drive', 'Donate blood or help coordinate our blood drive to support local hospitals and patients in need.', 'Chicago, Illinois, USA', '2026-10-05T09:00:00.000Z'),
	  (3, 'Senior Companionship Program', 'Volunteer your time to visit and keep company with elderly residents at local nursing homes.', 'Chicago, Illinois, USA', '2026-10-14T14:00:00.000Z'),
	  (3, 'Neighborhood Cleanup Day', 'Join us to pick up litter and beautify public spaces across our neighborhood.', 'Detroit, Michigan, USA', '2026-09-28T08:00:00.000Z'),
	  (3, 'Winter Coat Drive', 'Collect and distribute warm coats and blankets to individuals experiencing homelessness during the winter.', 'Detroit, Michigan, USA', '2026-11-16T10:00:00.000Z'),
	  (3, 'Job Skills Workshop', 'Help lead free workshops teaching resume writing and interview skills to unemployed community members.', 'Cleveland, Ohio, USA', '2026-10-22T13:00:00.000Z');

	  