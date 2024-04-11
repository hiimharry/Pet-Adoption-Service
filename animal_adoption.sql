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
    admin BOOLEAN NOT NULL,
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
    MedicalHistory INT NOT NULL FOREIGN KEY REFERENCES Medical_History(id),
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
    user_id INT NOT NULL FOREIGN KEY REFERENCES User(id),
    application_id INT NOT NULL FOREIGN KEY REFERENCES Application(id)
);

create table User_Interest_List (id int primary key auto_increment,
	user_id int not null,
	animal_id int not null,
    foreign key (user_id) references User(id),
    foreign key (animal_id) references Animal(id));

DELIMITER //

CREATE TRIGGER after_adoption_insert
AFTER INSERT ON Adoption
FOR EACH ROW
BEGIN
    UPDATE Application
    SET decision = TRUE
    WHERE id = NEW.application_id;
END; //

DELIMITER ;

DELIMITER //
