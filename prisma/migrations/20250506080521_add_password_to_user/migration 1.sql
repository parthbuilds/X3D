-- Create Category table
CREATE TABLE Category (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    UNIQUE KEY Category_name_key (name)
);

-- Recreate Product table with foreign key to Category
CREATE TABLE Product (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    priceInCents INT NOT NULL,
    filePath TEXT NOT NULL,
    imagePath TEXT NOT NULL,
    description TEXT NOT NULL,
    isAvailableForPurchase BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL,
    categoryId VARCHAR(255),
    CONSTRAINT Product_categoryId_fkey FOREIGN KEY (categoryId) REFERENCES Category(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- Recreate User table with a required password column
CREATE TABLE User (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL,
    UNIQUE KEY User_email_key (email)
);
