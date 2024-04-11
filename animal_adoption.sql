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
    address_id INT NOT NULL,
    FOREIGN KEY (address_id) REFERENCES Address(id) ON DELETE CASCADE
);

CREATE TABLE Address (
    id INT PRIMARY KEY AUTO_INCREMENT,
    Street VARCHAR(255) NOT NULL,
    Zipcode VARCHAR(255) NOT NULL,
    State VARCHAR(255) NOT NULL,
    Country VARCHAR(255) NOT NULL
);

CREATE TABLE Application (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    decision BOOLEAN,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
    animal_id INT NOT NULL,
    FOREIGN KEY (animal_id) REFERENCES Animal(id) ON DELETE CASCADE
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
    MedicalHistory INT NOT NULL,
    FOREIGN KEY (MedicalHistory) REFERENCES Medical_History(id) ON DELETE CASCADE
);

CREATE TABLE Medical_History (
    id INT PRIMARY KEY AUTO_INCREMENT,
    neutered BOOLEAN NOT NULL,
    vaccinated BOOLEAN NOT NULL,
    complications TEXT NOT NULL
);

CREATE TABLE Picture (
    id INT PRIMARY KEY AUTO_INCREMENT,
    URL TEXT NOT NULL,
    date DATE,
    animal_id INT NOT NULL,
    FOREIGN KEY (animal_id) REFERENCES Animal(id) ON DELETE CASCADE
);

CREATE TABLE Adoption (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE,
    animal_id INT NOT NULL,
    FOREIGN KEY (animal_id) REFERENCES Animal(id) ON DELETE CASCADE,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
    application_id INT NOT NULL,
    FOREIGN KEY (application_id) REFERENCES Application(id) ON DELETE CASCADE
);

create table User_Interest_List (
    id int primary key auto_increment,
	user_id int not null,
	animal_id int not null,
    foreign key (user_id) references User(id) on delete cascade,
    foreign key (animal_id) references Animal(id) on delete cascade
);

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
