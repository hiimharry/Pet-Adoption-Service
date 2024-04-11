-- Create the database
CREATE DATABASE AnimalAdoption;

-- Switch to the newly created database
USE AnimalAdoption;

-- Create the tables
CREATE TABLE User (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    username VARCHAR(255)  NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    DOB DATE NOT NULL,
);

CREATE TABLE Address (
    id INT PRIMARY KEY AUTO_INCREMENT,
    Street VARCHAR(255) NOT NULL,
    Zipcode VARCHAR(255) NOT NULL,
    State VARCHAR(255) NOT NULL,
    Country VARCHAR(255) NOT NULL,
);

CREATE TABLE Application (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    decision BOOLEAN,
    user_id INT NOT NULL FOREIGN KEY REFERENCES User(id),
    animal_id INT NOT NULL FOREIGN KEY REFERENCES Animal(id)
);

CREATE TABLE Animal (
    id INT PRIMARY KEY AUTO_INCREMENT,
    Species VARCHAR(255) NOT NULL,
    Breeds VARCHAR(255) NOT NULL,
    DOB DATE NOT NULL,
    Sex VARCHAR(50) NOT NULL,
    Name VARCHAR(255) NOT NULL,
    Size VARCHAR(50) NOT NULL,
    Personality TEXT NOT NULL,
    Color VARCHAR(255) NOT NULL,
    Behavior TEXT NOT NULL,
    Description TEXT NOT NULL,
    AdoptionFee DECIMAL(10,2) NOT NULL,
    MedicalHistory INT NOT NULL FOREIGN KEY REFERENCES Medical_History(id)
);

CREATE TABLE Medical_History (
    id INT PRIMARY KEY AUTO_INCREMENT,
    neutered BOOLEAN NOT NULL,
    vaccinated BOOLEAN NOT NULL,
    complications TEXT NOT NULL,
);

CREATE TABLE Picture (
    id INT PRIMARY KEY AUTO_INCREMENT,
    URL TEXT NOT NULL,
    date DATE,
    animal_id INT NOT NULL FOREIGN KEY REFERENCES Animal(id)
);

CREATE TABLE Adoption (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE,
    animal_id INT NOT NULL FOREIGN KEY REFERENCES Animal(id),
    user_id INT NOT NULL FOREIGN KEY REFERENCES User(id)
);
