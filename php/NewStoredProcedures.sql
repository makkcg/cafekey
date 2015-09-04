//14-8-2015
//adding new user profile called in acc_func.php
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_newprof`(IN `user_ID` INT, IN `fullname` LONGTEXT CHARSET utf8, IN `mobile` TEXT CHARSET utf8, IN `mobile2` TEXT CHARSET utf8,IN `email` TEXT CHARSET utf8, IN `address` LONGTEXT CHARSET utf8,IN `jobtitle` TEXT CHARSET utf8,IN `type` INT,IN `phone` TEXT CHARSET utf8, IN `notes` LONGTEXT CHARSET utf8)
BEGIN
INSERT INTO `profile` (`user_id`, `profileid`, `fullname`, `mobile`, `mobile2`, `email`, `address`, `jobtitle`, `type`, `phone`, `notes`) VALUES(user_ID, NULL, fullname, mobile, mobile2, email, address, jobtitle, type, phone, notes);
SELECT LAST_INSERT_ID();
END//
DELIMITER ;
////
//// add new user
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_newuser`(IN `username` LONGTEXT CHARSET utf8 , IN `user_type` INT, IN `permission` INT, IN `Registration_Date` date,IN `Expiration_Date` date,IN `password` LONGTEXT CHARSET utf8)
BEGIN

INSERT INTO `users` (`id`, `username`, `ip`, `user_type`, `permission`, `Last_Login`, `Registration_Date`, `Expiration_Date`, `userlogin_flag`, `sessionDB_ID`, `password`) VALUES (NULL,username,'0', user_type, permission, '', Registration_Date, Expiration_Date, 0, 0, SHA1(password));
SELECT LAST_INSERT_ID();
END//
DELIMITER ;