-- Create the database
CREATE DATABASE AnimalAdoption;

-- Switch to the newly created database
USE AnimalAdoption;

-- Create the tables
CREATE TABLE User (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    description VARCHAR(255),
    username VARCHAR(255),
    password VARCHAR(255),
    email VARCHAR(255),
    DOB DATE,
    age INT
);

CREATE TABLE Address (
    id INT PRIMARY KEY AUTO_INCREMENT,
    Street VARCHAR(255),
    Zipcode VARCHAR(255),
    State VARCHAR(255),
    Country VARCHAR(255)
);

CREATE TABLE Application (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE,
    description TEXT,
    decision BOOLEAN
);

CREATE TABLE Animal (
    id INT PRIMARY KEY AUTO_INCREMENT,
    Species VARCHAR(255),
    Breeds VARCHAR(255),
    DOB DATE,
    Age INT,
    Sex VARCHAR(50),
    Name VARCHAR(255),
    Size VARCHAR(50),
    Personality TEXT,
    Color VARCHAR(255),
    Behavior TEXT,
    Description TEXT,
    AdoptionFee DECIMAL(10,2),
    MedicalHistory INT
);

CREATE TABLE Medical_History (
    id INT PRIMARY KEY AUTO_INCREMENT,
    neutered BOOLEAN,
    vaccinated BOOLEAN,
    complications TEXT
);

CREATE TABLE Picture (
    id INT PRIMARY KEY AUTO_INCREMENT,
    URL TEXT,
    date DATE
);

CREATE TABLE Adoption (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE
);

-- Define relationships
ALTER TABLE User ADD CONSTRAINT fk_user_address FOREIGN KEY (id) REFERENCES Address(id);
ALTER TABLE Application ADD CONSTRAINT fk_application_user FOREIGN KEY (id) REFERENCES User(id);

ALTER TABLE Animal ADD CONSTRAINT fk_animal_medical_history FOREIGN KEY (MedicalHistory) REFERENCES Medical_History(id);

ALTER TABLE Picture ADD CONSTRAINT fk_picture_animal FOREIGN KEY (id) REFERENCES Animal(id);

ALTER TABLE Adoption ADD CONSTRAINT fk_adoption_animal FOREIGN KEY (id) REFERENCES Animal(id);
ALTER TABLE Adoption ADD CONSTRAINT fk_adoption_user FOREIGN KEY (id) REFERENCES User(id);

-- Note: The above ALTER TABLE statements create the necessary foreign keys to establish relationships between tables.
-- However, the ER diagram has some many-to-many relationships that are not directly representable with a single foreign key,
-- such as the 'adopts' relationship between User and Animal, and the 'interested_in' relationship between User and Animal.
-- These would typically be represented with junction tables in a relational database schema.
