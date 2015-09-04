-- phpMyAdmin SQL Dump
-- version 3.4.10.1deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 03, 2015 at 05:26 PM
-- Server version: 5.5.40
-- PHP Version: 5.3.10-1ubuntu3.15

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+02:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `mocacafeop`
--
CREATE DATABASE `mocacafeop` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `mocacafeop`;

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_acc_mov`(mov_dat date,mov_time time,mov_type int,sales_table tinyint,cust_table tinyint,cash_table tinyint,purch_table tinyint,exp_table tinyint,staff_table tinyint,othincome_table tinyint)
BEGIN
INSERT INTO `acc_mov` (`acc_mov_id`, `mov_dat`, `mov_time`, `mov_timestamp`, `mov_type`, `sales_table`, `cust_table`, `cash_table`, `purch_table`, `exp_table`, `staff_table`, `othincome_table`) VALUES (NULL, mov_dat, mov_time, CURRENT_TIMESTAMP, mov_type, sales_table, cust_table, cash_table, purch_table, exp_table, staff_table, othincome_table);
SELECT LAST_INSERT_ID();
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `add_cash_mov`(acc_mov_id int,cash_dat date, cash_time time,acc_mov_type int,cash_openbalance float,cash_value float,cash_endbalance float,cash_desc text)
BEGIN
INSERT INTO `acc_cash` (`cash_id`, `acc_mov_id`, `cash_dat`, `cash_time`, `cash_timestamp`, `acc_mov_type`, `cash_openbalance`, `cash_value`, `cash_endbalance`, `cash_desc`) VALUES (NULL, acc_mov_id, cash_dat,cash_time ,CURRENT_TIMESTAMP, acc_mov_type, cash_openbalance, cash_value, cash_endbalance, cash_desc);
SELECT LAST_INSERT_ID();
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `add_expences_process`(IN `exptype` INT, IN `exp_code` INT, IN `exp_dat` DATE, IN `exp_time` TIME, IN `exp_value` FLOAT, IN `exp_desc` LONGTEXT CHARSET utf8, IN `fromcash` INT, IN `profid` INT, IN `issalary` INT)
BEGIN
/*expenses process*/
/*if expense is salaries or payto partner  exptype=1*/
IF exptype=1 THEN
/*if type is salary or paid to partner from the cashier*/
IF fromcash=10000 THEN
/*0- add acc movment, 1- update cash ,2-update the acc profile,3- update expenses */
CALL `add_acc_mov`(exp_dat,exp_time,3,0,0,1,0,1,1,0);
SET @accmov_id = LAST_INSERT_ID();
/*update cash*/
CALL `add_cash_mov` (@accmov_id,exp_dat,exp_time,2,0,exp_value,0,exp_desc);
/*update acc prof*/
INSERT INTO `acc_mov_profiles` (`acc_prof_mov_id`, `acc_mov_id`, `prof_mov_dat`, `prof_mov_time`, `prof_mov_timestamp`, `prof_id`, `acc_mov_type`, `prof_mov_value`, `prof_mov_balance`, `prof_mov_desc`, `salary`) VALUES (NULL, @accmov_id, exp_dat,exp_time ,CURRENT_TIMESTAMP, profid, 2, exp_value, 0, exp_desc,issalary);
/*update expences tbl*/
INSERT INTO `acc_expenses` (`exp_id`, `acc_mov_id`, `exp_code`, `exp_dat`, `exp_time`, `exp_timestamp`, `exp_value`, `exp_desc`, `fromcash`) VALUES (NULL, @accmov_id, exp_code, exp_dat, exp_time, CURRENT_TIMESTAMP, exp_value, exp_desc, 1);
ELSE
/*if expences is salary or paid to partner , but paid from another partner not from cashier*/
/*process 0- add acc mov ,1- update payer acc prof (use fromcash as paier profid),2- update paid to acc prof,3- add expences*/
CALL `add_acc_mov` (exp_dat,exp_time,3,0,0,1,0,0,1,0);
SET @accmov_id = LAST_INSERT_ID();
/*update payer acc prof*/
INSERT INTO `acc_mov_profiles` (`acc_prof_mov_id`, `acc_mov_id`, `prof_mov_dat`, `prof_mov_time`, `prof_mov_timestamp`, `prof_id`, `acc_mov_type`, `prof_mov_value`, `prof_mov_balance`, `prof_mov_desc`, `salary`) VALUES (NULL, @accmov_id, exp_dat,exp_time ,CURRENT_TIMESTAMP, profid, 1, exp_value, 0, exp_desc,0);
/*update acc prof*/
INSERT INTO `acc_mov_profiles` (`acc_prof_mov_id`, `acc_mov_id`, `prof_mov_dat`, `prof_mov_time`, `prof_mov_timestamp`, `prof_id`, `acc_mov_type`, `prof_mov_value`, `prof_mov_balance`, `prof_mov_desc`, `salary`) VALUES (NULL, @accmov_id, exp_dat,exp_time ,CURRENT_TIMESTAMP, profid, 2, exp_value, 0, exp_desc,issalary);
/*update expences tbl*/
INSERT INTO `acc_expenses` (`exp_id`, `acc_mov_id`, `exp_code`, `exp_dat`, `exp_time`, `exp_timestamp`, `exp_value`, `exp_desc`, `fromcash`) VALUES (NULL, @accmov_id, exp_code, exp_dat, exp_time, CURRENT_TIMESTAMP, exp_value, exp_desc, 0);
END IF;
ELSE 
/* expences type is not salary or paid value to partner**/
/* if the expences is paid by the cashier not by any partner*/
IF fromcash=10000 THEN
/*process 0-update acc mov,1- update cash,2- update expences  */
CALL `add_acc_mov`(exp_dat,exp_time,3,0,0,1,0,1,0,0);
SET @accmov_id = LAST_INSERT_ID();
/*update cash*/
CALL `add_cash_mov`(@accmov_id,exp_dat,exp_time,2,0,exp_value,0,exp_desc);
/*update expences tbl*/
INSERT INTO `acc_expenses`(`exp_id`, `acc_mov_id`, `exp_code`, `exp_dat`, `exp_time`, `exp_timestamp`, `exp_value`, `exp_desc`, `fromcash`) VALUES (NULL, @accmov_id, exp_code, exp_dat, exp_time, CURRENT_TIMESTAMP, exp_value, exp_desc, 1);
ELSE 
/* if the expences is paid by any partner not by the cashier , user fromcash as the payer profid*/
/* process 0 update acc mov,1- update payer profid,2-update expences */
CALL `add_acc_mov` (exp_dat,exp_time,3,0,0,1,0,1,0,0);
SET @accmov_id = LAST_INSERT_ID();
/*update payer acc prof*/
INSERT INTO `acc_mov_profiles` (`acc_prof_mov_id`, `acc_mov_id`, `prof_mov_dat`, `prof_mov_time`, `prof_mov_timestamp`, `prof_id`, `acc_mov_type`, `prof_mov_value`, `prof_mov_balance`, `prof_mov_desc`, `salary`) VALUES (NULL, @accmov_id, exp_dat,exp_time ,CURRENT_TIMESTAMP, fromcash, 2, exp_value, 0, exp_desc,0);
/*update expences tbl*/
INSERT INTO `acc_expenses` (`exp_id`, `acc_mov_id`, `exp_code`, `exp_dat`, `exp_time`, `exp_timestamp`, `exp_value`, `exp_desc`, `fromcash`) VALUES (NULL, @accmov_id, exp_code, exp_dat, exp_time, CURRENT_TIMESTAMP, exp_value, exp_desc, 0);
END IF;
End IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `add_prof_mov`(acc_mov_id int, prof_mov_dat date,prof_mov_time time,prof_id int,acc_mov_type int,prof_mov_value float,prof_mov_balance float,prof_mov_desc text)
BEGIN
INSERT INTO `acc_mov_profiles` (`acc_prof_mov_id`, `acc_mov_id`, `prof_mov_dat`, `prof_mov_time`, `prof_mov_timestamp`, `prof_id`, `acc_mov_type`, `prof_mov_value`, `prof_mov_balance`, `prof_mov_desc`) VALUES (NULL, acc_mov_id, prof_mov_dat,prof_mov_time ,CURRENT_TIMESTAMP, prof_id, acc_mov_type, prof_mov_value, prof_mov_balance, prof_mov_desc);
SELECT LAST_INSERT_ID();
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `add_purch_mov`(IN `acc_mov_id` INT, IN `purch_type` INT, IN `purch_dat` DATE, IN `purch_time` TIME, IN `purch_value` INT, IN `fromcash` TINYINT, IN `purch_desc` TEXT, IN `st_mov_id` INT)
BEGIN
INSERT INTO `acc_purch` (`purch_id`, `acc_mov_id`, `purch_type`, `purch_dat`, `purch_time`, `purch_timestamp`, `purch_value`, `fromcash`, `purch_desc`, `st_mov_id`) VALUES (NULL, acc_mov_id, purch_type, purch_dat, purch_time, CURRENT_TIMESTAMP, purch_value, fromcash, purch_desc, st_mov_id)  ;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `add_sales_mov`(IN `acc_mov_id` INT, IN `inv_id` INT, IN `sales_dat` DATE, IN `sales_time` TIME, IN `sales_value` FLOAT, IN `sales_paid` TINYINT, IN `sales_desc` TEXT CHARSET utf8, IN `subinv_no` INT)
BEGIN
INSERT INTO `acc_sales` (`sales_id`, `acc_mov_id`, `inv_id`, `sales_dat`, `sales_time`, `sales_timestamp`, `sales_value`, `sales_paid`, `sales_desc`, `subinv_no`)
VALUES (NULL, acc_mov_id, inv_id ,sales_dat,sales_time ,CURRENT_TIMESTAMP, sales_value, sales_paid, sales_desc,subinv_no);
SELECT LAST_INSERT_ID();
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `add_varincome_process`(varinctyp int,varincdat date,varinctime time, varincval float,varincdesc longtext,tocash int,varinctypnam char(50))
BEGIN
/*if added to cash*/
IF tocash=1 THEN
/*process 0-update acc mov,1- update cash,2- update varincome  */
CALL `add_acc_mov`(varincdat,varinctime,4,0,0,1,0,0,0,1);
SET @accmov_id = LAST_INSERT_ID();
/*update cash*/
CALL `add_cash_mov`(@accmov_id,varincdat,varinctime,1,0,varincval,0,varincdesc);
/*update expences tbl*/
INSERT INTO `acc_varincome` (`varincome_id`, `acc_mov_id`, `varincome_dat`, `varincome_time`, `varincome_timestamp`, `varincome_value`, `varincome_desc`) VALUES (NULL, @accmov_id, varincdat, varinctime, CURRENT_TIMESTAMP, varincval, varincdesc);
ELSE
select ("nothing");
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `buy_st_item`(IN `boughtby` INT, IN `itmsname` VARCHAR(25), IN `itmlname` VARCHAR(200), IN `itm_type` INT, IN `itm_desc` TEXT, IN `itm_price` FLOAT, IN `userid` INT, IN `itm_qnty_unit` INT, IN `groupid` INT, IN `st_itm_mov_typ` INT, IN `cur_st_id` INT, IN `st_itm_mov_qnty` INT, IN `st_itm_mov_dat` DATE, IN `st_itm_mov_time` TIME, IN `st_itm_mov_notes` TEXT, IN `st_itm_mov_to_st` INT, IN `buyerid` INT, IN `exist_itm_id` INT)
BEGIN
IF exist_itm_id = 0 THEN

INSERT INTO `stock_items` (`itm_id`, `itm_shortname`, `itm_longname`, `itm_type`, `itm_data`, `itm_sell_price`, `itm_reg_date`, `itm_userid`, `itm_timestamp`, `itm_qnty_unit`, `group_id`) VALUES (NULL,itmsname,itmlname,itm_type,itm_desc,itm_price,st_itm_mov_dat,userid,CURRENT_TIMESTAMP,itm_qnty_unit,groupid);
SET @st_itm_id=LAST_INSERT_ID();
/**insert stock movment item to the stock itmes*/
CALL `buy_trn_spoil_ret_sals_stitem_mov` (st_itm_mov_typ,userid,@st_itm_id,cur_st_id,st_itm_mov_qnty,itm_qnty_unit,st_itm_mov_dat,st_itm_mov_notes,st_itm_mov_to_st,itm_price,buyerid,buyerid,itm_type);
SET @st_itm_mov_id = LAST_INSERT_ID();
/*insert item stock balance to the balance*/
/*CALL `update_st_blance` (@st_itm_id,cur_st_id,0,itm_qnty_unit,st_itm_mov_notes,st_itm_mov_dat,CURRENT_TIMESTAMP);*/
IF boughtby=0 THEN /*  if item bought from cashier = 0 , if bought from someone =1 */
/*insert accounting movment affect cash and purchase*/
CALL `add_acc_mov` (st_itm_mov_dat,st_itm_mov_time,2,0,0,1,1,0,0,0);
SET @accmov_id = LAST_INSERT_ID();
CALL `add_cash_mov` (@accmov_id,st_itm_mov_dat,st_itm_mov_time,2,0,itm_price,0,st_itm_mov_notes);
/**CONCAT('شراء مخزون من صنف   : ',itmsname,' صرف من الخزينة بكمية  : ',st_itm_mov_qnty,'الى المخزن رقم  : ',st_itm_mov_cur_stid)**/
CALL `add_purch_mov` (@accmov_id,itm_type,st_itm_mov_dat,st_itm_mov_time,itm_price,1,st_itm_mov_notes,@st_itm_mov_id);
/**CONCAT('شراء مخزون من صنف   : ',itmsname,' صرف من الخزينة بكمية  : ',st_itm_mov_qnty,'الى المخزن رقم  : ',st_itm_mov_cur_stid)**/
ELSE
CALL `add_acc_mov` (st_itm_mov_dat,st_itm_mov_time,2,0,1,0,1,0,1,0);
SET @acc_move_id = LAST_INSERT_ID();
CALL `add_prof_mov` (@acc_move_id,st_itm_mov_dat,st_itm_mov_time,buyerid,1,itm_price,0,st_itm_mov_notes);
CALL `add_purch_mov` (@acc_move_id,itm_type,st_itm_mov_dat,st_itm_mov_time,itm_price,0,st_itm_mov_notes,@st_itm_mov_id);
END IF;

ELSE


/*insert stock movment existing item to the stock itmes*/
CALL `buy_trn_spoil_ret_sals_stitem_mov` (st_itm_mov_typ,userid,exist_itm_id,cur_st_id,st_itm_mov_qnty,itm_qnty_unit,st_itm_mov_dat,st_itm_mov_notes,st_itm_mov_to_st,itm_price,buyerid,buyerid,itm_type);
SET @st_itm_mov_id = LAST_INSERT_ID();
/*insert item stock balance to the balance*/
/*CALL `update_st_blance` (exist_itm_id,cur_st_id,0,itm_qnty_unit,st_itm_mov_notes,st_itm_mov_dat,CURRENT_TIMESTAMP);*/
IF boughtby=0 THEN /*  if item bought from cashier = 0 , if bought from someone =1 */
/*insert accounting movment affect cash and purchase*/
CALL `add_acc_mov` (st_itm_mov_dat,st_itm_mov_time,2,0,0,1,1,0,0,0);
SET @accmov_id = LAST_INSERT_ID();
CALL `add_cash_mov` (@accmov_id,st_itm_mov_dat,st_itm_mov_time,2,0,itm_price,0,st_itm_mov_notes);
/**CONCAT('شراء مخزون من صنف   : ',itmsname,' صرف من الخزينة بكمية  : ',st_itm_mov_qnty,'الى المخزن رقم  : ',st_itm_mov_cur_stid)**/
CALL `add_purch_mov` (@accmov_id,itm_type,st_itm_mov_dat,st_itm_mov_time,itm_price,1,st_itm_mov_notes,@st_itm_mov_id);
/**CONCAT('شراء مخزون من صنف   : ',itmsname,' صرف من الخزينة بكمية  : ',st_itm_mov_qnty,'الى المخزن رقم  : ',st_itm_mov_cur_stid)**/
ELSE
CALL `add_acc_mov` (st_itm_mov_dat,st_itm_mov_time,2,0,1,0,1,0,1,0);
SET @acc_move_id = LAST_INSERT_ID();
CALL `add_prof_mov` (@acc_move_id,st_itm_mov_dat,st_itm_mov_time,buyerid,1,itm_price,0,st_itm_mov_notes);
CALL `add_purch_mov` (@acc_move_id,itm_type,st_itm_mov_dat,st_itm_mov_time,itm_price,0,st_itm_mov_notes,@st_itm_mov_id);
END IF;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `buy_trn_spoil_ret_sals_stitem_mov`(IN `st_itm_mov_typ` INT, IN `st_itm_mov_usrid` INT, IN `st_itm_mov_itmid` INT, IN `st_itm_mov_cur_stid` INT, IN `st_itm_mov_qnty` INT, IN `st_itm_mov_qnty_unit` INT, IN `st_itm_mov_dat` DATE, IN `st_itm_mov_notes` TEXT, IN `st_itm_mov_to_st` INT, IN `st_itm_mov_price` FLOAT, IN `st_itm_mov_buyerid` INT, IN `st_itm_mov_profid` INT, IN `st_itm_mov_itm_typ` INT)
BEGIN
INSERT INTO `st_item_mov` (`st_itm_mov_id` ,`st_itm_mov_typ` ,`st_itm_mov_usrid` ,`st_itm_mov_itmid` ,`st_itm_mov_cur_stid` ,`st_itm_mov_qnty` ,`st_itm_mov_qnty_unit` ,`st_itm_mov_dat` ,`st_itm_mov_timstmp` ,`st_itm_mov_notes` ,`st_itm_mov_to_st` ,`st_itm_mov_st_itm_mov_price` ,`st_itm_mov_buyerid` ,`st_itm_mov_profid`, `st_itm_mov_itm_typ`)VALUES (NULL ,  st_itm_mov_typ, st_itm_mov_usrid, st_itm_mov_itmid,  st_itm_mov_cur_stid,st_itm_mov_qnty , st_itm_mov_qnty_unit,  st_itm_mov_dat, CURRENT_TIMESTAMP ,  st_itm_mov_notes,  st_itm_mov_to_st,  st_itm_mov_price, st_itm_mov_buyerid ,  st_itm_mov_profid,  st_itm_mov_itm_typ);
SELECT LAST_INSERT_ID();
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllProducts`()
BEGIN
   SELECT *  FROM stock_items;
   END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getnextID`(IN `tablename` VARCHAR(50), IN `dbname` VARCHAR(20))
    NO SQL
BEGIN
SELECT `AUTO_INCREMENT`
FROM information_schema.tables 
WHERE table_name=tablename
AND `TABLE_SCHEMA` = dbname;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_cust_unpaid_order`(IN `profid` INT)
    NO SQL
SELECT * FROM `sub_inv` 
WHERE `cust_profid`=profid 
And `paidstatus`=0$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_dashboard`(IN `curdat` DATE)
BEGIN
select (select(ifnull((SELECT SUM(`cash_value`) FROM `acc_cash` WHERE `acc_mov_type`=1 and  YEAR(`acc_cash`.`cash_dat`)=YEAR(curdat) AND MONTH(`acc_cash`.`cash_dat`)=MONTH(curdat) And DAY(`acc_cash`.`cash_dat`)=DAY(curdat)),0))) as daycash,(select ifnull((select sum(`acc_sales`.`sales_value`) FROM `acc_sales` WHERE YEAR(`acc_sales`.`sales_dat`)=YEAR(curdat) AND MONTH(`acc_sales`.`sales_dat`)=MONTH(curdat) And DAY(`acc_sales`.`sales_dat`)=DAY(curdat)),0))  as daysales,(select ifnull((select sum(`acc_sales`.`sales_value`) FROM `acc_sales` WHERE `sales_paid`=0 and YEAR(`acc_sales`.`sales_dat`)=YEAR(curdat) AND MONTH(`acc_sales`.`sales_dat`)=MONTH(curdat) And DAY(`acc_sales`.`sales_dat`)=DAY(curdat)),0))  as daycredit,(select ifnull((select sum(`acc_purch`.`purch_value`) FROM `acc_purch` WHERE `fromcash`=1 and YEAR(`acc_purch`.`purch_dat`)=YEAR(curdat) AND MONTH(`acc_purch`.`purch_dat`)=MONTH(curdat) And DAY(`acc_purch`.`purch_dat`)=DAY(curdat)),0))  as daypurch,(select ifnull((select sum(`acc_expenses`.`exp_value`) FROM `acc_expenses` WHERE `fromcash`=1 and YEAR(`acc_expenses`.`exp_dat`)=YEAR(curdat) AND MONTH(`acc_expenses`.`exp_dat`)=MONTH(curdat) And DAY(`acc_expenses`.`exp_dat`)=DAY(curdat)),0))  as dayexp,(select(ifnull((SELECT SUM(`cash_value`) FROM `acc_cash` WHERE `acc_mov_type`=1 and  YEAR(`acc_cash`.`cash_dat`)=YEAR(curdat) AND MONTH(`acc_cash`.`cash_dat`)=MONTH(curdat)),0)))  as monthcash,(select ifnull((select sum(`acc_sales`.`sales_value`) FROM `acc_sales` WHERE YEAR(`acc_sales`.`sales_dat`)=YEAR(curdat) AND MONTH(`acc_sales`.`sales_dat`)=MONTH(curdat)),0))  as monthsales,(select ifnull((select sum(`acc_sales`.`sales_value`) FROM `acc_sales` WHERE `sales_paid`=0 and YEAR(`acc_sales`.`sales_dat`)=YEAR(curdat) AND MONTH(`acc_sales`.`sales_dat`)=MONTH(curdat)),0))  as monthcredit,(select ifnull((select sum(`acc_purch`.`purch_value`) FROM `acc_purch` WHERE `fromcash`=1 and YEAR(`acc_purch`.`purch_dat`)=YEAR(curdat) AND MONTH(`acc_purch`.`purch_dat`)=MONTH(curdat)),0))  as monthpurch,(select ifnull((select sum(`acc_expenses`.`exp_value`) FROM `acc_expenses` WHERE `fromcash`=1 and YEAR(`acc_expenses`.`exp_dat`)=YEAR(curdat) AND MONTH(`acc_expenses`.`exp_dat`)=MONTH(curdat)),0)) as monthexp,(select ifnull((select sum(`acc_expenses`.`exp_value`) FROM `acc_expenses` WHERE `fromcash`!=1 and YEAR(`acc_expenses`.`exp_dat`)=YEAR(curdat) AND MONTH(`acc_expenses`.`exp_dat`)=MONTH(curdat) And DAY(`acc_expenses`.`exp_dat`)=DAY(curdat)),0))  as dayexppart,(select ifnull((select sum(`acc_expenses`.`exp_value`) FROM `acc_expenses` WHERE `fromcash`!=1 and YEAR(`acc_expenses`.`exp_dat`)=YEAR(curdat) AND MONTH(`acc_expenses`.`exp_dat`)=MONTH(curdat)),0)) as monthexppart;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_inv_ingr_qnty`(inv_id int)
BEGIN
SELECT items_ingradients.itm_ingrad_id, items_ingradients.itm_ingrad_qnty_unit, (invoices_items.inv_itm_qnty * items_ingradients.itm_ingrad_qnty) AS stockquntity
FROM invoices_items
INNER JOIN items_ingradients ON items_ingradients.itm_id = invoices_items.inv_itm_id
AND invoices_items.inv_id =inv_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_inv_items_data`(invoiceid int)
BEGIN
SELECT invoices_items.inv_itm_id, stock_items.itm_shortname, invoices_items.inv_itm_unit_price, invoices_items.inv_itm_qnty, invoices_items.inv_itm_sum
FROM  `invoices_items` 
INNER JOIN stock_items ON invoices_items.inv_itm_id = stock_items.itm_id
WHERE invoices_items.inv_id=invoiceid;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_paid_unpaid_inv`(IN `inv_status` INT, IN `inv_prof_id` INT, IN `inv_sdat` DATE, IN `inv_edat` DATE)
BEGIN
IF inv_sdat =0 THEN

IF inv_prof_id = 0 THEN

SELECT invoices_items.inv_id, invoices.inv_total, invoices.inv_discount, invoices.inv_tax, invoices.inv_service, invoices.inv_gtotal, invoices.inv_dattime, invoices.inv_cus_prof_id, profile.fullname, invoices_items.inv_itm_id, stock_items.itm_shortname, invoices_items.inv_itm_unit_price, invoices_items.inv_itm_qnty, invoices_items.inv_itm_sum,invoices.inv_dat
FROM  `invoices` 
INNER JOIN invoices_items ON invoices.inv_id = invoices_items.inv_id
INNER JOIN stock_items ON invoices_items.inv_itm_id = stock_items.itm_id
INNER JOIN profile ON invoices.inv_cus_prof_id = profile.profileid
WHERE invoices.inv_status =inv_status
ORDER BY invoices_items.inv_id;

ELSE 

SELECT invoices_items.inv_id, invoices.inv_total, invoices.inv_discount, invoices.inv_tax, invoices.inv_service, invoices.inv_gtotal, invoices.inv_dattime, invoices.inv_cus_prof_id, profile.fullname, invoices_items.inv_itm_id, stock_items.itm_shortname, invoices_items.inv_itm_unit_price, invoices_items.inv_itm_qnty, invoices_items.inv_itm_sum
FROM  `invoices` 
INNER JOIN invoices_items ON invoices.inv_id = invoices_items.inv_id
INNER JOIN stock_items ON invoices_items.inv_itm_id = stock_items.itm_id
INNER JOIN profile ON invoices.inv_cus_prof_id = profile.profileid
WHERE invoices.inv_status =inv_status
AND invoices.inv_cus_prof_id =inv_prof_id
ORDER BY invoices_items.inv_id;
END IF;

ELSE

IF inv_prof_id = 0 THEN

SELECT invoices_items.inv_id, invoices.inv_total, invoices.inv_discount, invoices.inv_tax, invoices.inv_service, invoices.inv_gtotal, invoices.inv_dattime, invoices.inv_cus_prof_id, profile.fullname, invoices_items.inv_itm_id, stock_items.itm_shortname, invoices_items.inv_itm_unit_price, invoices_items.inv_itm_qnty, invoices_items.inv_itm_sum
FROM  `invoices` 
INNER JOIN invoices_items ON invoices.inv_id = invoices_items.inv_id
INNER JOIN stock_items ON invoices_items.inv_itm_id = stock_items.itm_id
INNER JOIN profile ON invoices.inv_cus_prof_id = profile.profileid
WHERE invoices.inv_status =inv_status
AND invoices.inv_dat BETWEEN inv_sdat AND inv_edat
ORDER BY invoices_items.inv_id;

ELSE 

SELECT invoices_items.inv_id, invoices.inv_total, invoices.inv_discount, invoices.inv_tax, invoices.inv_service, invoices.inv_gtotal, invoices.inv_dattime, invoices.inv_cus_prof_id, profile.fullname, invoices_items.inv_itm_id, stock_items.itm_shortname, invoices_items.inv_itm_unit_price, invoices_items.inv_itm_qnty, invoices_items.inv_itm_sum
FROM  `invoices` 
INNER JOIN invoices_items ON invoices.inv_id = invoices_items.inv_id
INNER JOIN stock_items ON invoices_items.inv_itm_id = stock_items.itm_id
INNER JOIN profile ON invoices.inv_cus_prof_id = profile.profileid
WHERE invoices.inv_status =inv_status
AND invoices.inv_cus_prof_id =inv_prof_id
AND invoices.inv_dat BETWEEN inv_sdat AND inv_edat
ORDER BY invoices_items.inv_id;
END IF;

END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_paid_unp_inv`(IN `pstatus` INT, IN `profid` INT, IN `strtdate` DATE, IN `enddate` DATE)
BEGIN
IF strtdate=0 THEN
IF profid =0 THEN
SELECT invoices.inv_id,invoices.inv_total,invoices.inv_discount,invoices.inv_tax,invoices.inv_service,invoices.inv_gtotal, invoices.inv_dattime,invoices.inv_cus_prof_id,profile.fullname 
FROM `invoices` 
INNER JOIN profile ON invoices.inv_cus_prof_id=profile.profileid
WHERE invoices.inv_status=pstatus 
order by invoices.inv_id;
ELSE
SELECT invoices.inv_id,invoices.inv_total,invoices.inv_discount,invoices.inv_tax,invoices.inv_service,invoices.inv_gtotal, invoices.inv_dattime,invoices.inv_cus_prof_id,profile.fullname 
FROM `invoices` 
INNER JOIN profile ON invoices.inv_cus_prof_id=profile.profileid
WHERE invoices.inv_status=pstatus 
AND invoices.inv_cus_prof_id =profid 
order by invoices.inv_id;
END IF;
ELSE
IF profid =0 THEN
SELECT invoices.inv_id,invoices.inv_total,invoices.inv_discount,invoices.inv_tax,invoices.inv_service,invoices.inv_gtotal, invoices.inv_dattime,invoices.inv_cus_prof_id,profile.fullname 
FROM `invoices` 
INNER JOIN profile ON invoices.inv_cus_prof_id=profile.profileid
WHERE invoices.inv_status=pstatus 
AND invoices.inv_dat between strtdate and enddate
order by invoices.inv_id;
ELSE
SELECT invoices.inv_id,invoices.inv_total,invoices.inv_discount,invoices.inv_tax,invoices.inv_service,invoices.inv_gtotal, invoices.inv_dattime,invoices.inv_cus_prof_id,profile.fullname 
FROM `invoices` 
INNER JOIN profile ON invoices.inv_cus_prof_id=profile.profileid
WHERE invoices.inv_status=pstatus 
AND invoices.inv_cus_prof_id =profid 
AND invoices.inv_dat between strtdate and enddate
order by invoices.inv_id;
END IF;

END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_prof_accbalance`(IN `profid` INT, IN `startdate` DATE, IN `enddate` DATE, IN `movtype` INT)
BEGIN
IF movtype=0 THEN
SELECT `acc_prof_mov_id`,`acc_mov_type`,`acc_mov_id`,`prof_mov_value`,`prof_mov_dat`,`prof_mov_time`,`prof_mov_desc`
FROM `acc_mov_profiles`
WHERE `prof_id`=profid
AND `prof_mov_dat` BETWEEN startdate AND enddate;
ELSE
SELECT `acc_prof_mov_id`,`acc_mov_id`,`prof_mov_value`,`prof_mov_dat`,`prof_mov_time`,`prof_mov_desc`
FROM `acc_mov_profiles`
WHERE `prof_id`=profid
AND `acc_mov_type` = movtype
AND `prof_mov_dat` BETWEEN startdate AND enddate;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_safe_mov_balance`(movtype tinyint,startdat date,enddate date)
BEGIN
SELECT `cash_id`,`acc_mov_id`,`cash_dat`,`cash_time`,`cash_value`,`cash_desc` 
FROM `acc_cash` 
WHERE `acc_mov_type`=movtype 
AND`cash_dat` between startdat and enddate ; 
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_sales_items`()
BEGIN
SELECT  `itm_id` ,  `itm_shortname` ,  `itm_longname` ,  `itm_data` ,  `itm_sell_price` ,  `group_id` 
FROM  `stock_items` 
WHERE  `itm_type` =4;   
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_sales_rep`(paidunpaid int,startdate date,enddate date)
BEGIN
/***** paidunpaid => 0 : unpaid, 1 : paid , 2: all*****/
IF paidunpaid=0 THEN

SELECT  `sales_id` ,  `acc_mov_id` ,  `inv_id` ,  `sales_value` ,  `sales_dat` ,  `sales_desc` ,  `sales_paid` 
FROM  `acc_sales` 
WHERE  `sales_dat` BETWEEN  startdate AND enddate 
AND `sales_paid`=0;

ELSEIF paidunpaid=1 THEN

SELECT  `sales_id` ,  `acc_mov_id` ,  `inv_id` ,  `sales_value` ,  `sales_dat` ,  `sales_desc` ,  `sales_paid` 
FROM  `acc_sales` 
WHERE  `sales_dat` BETWEEN  startdate AND enddate 
AND `sales_paid`=1;

ELSE

SELECT  `sales_id` ,  `acc_mov_id` ,  `inv_id` ,  `sales_value` ,  `sales_dat` ,  `sales_desc` ,  `sales_paid` 
FROM  `acc_sales` 
WHERE  `sales_dat` BETWEEN  startdate AND enddate;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_salsitm_mov_period`(itmid int,startdat date,enddate date)
BEGIN
SELECT `itms_sales`.`date`,`itms_sales`.`qnty`,`itms_sales`.`inv_id`,`itms_sales`.`orderid`,(`itms_sales`.`qnty`)*(`stock_items`.`itm_sell_price`) as tpric FROM `itms_sales` INNER JOIN `stock_items` on `stock_items`.`itm_id`=`itms_sales`.`sitm_id`  WHERE `itms_sales`.`sitm_id`=itmid and `itms_sales`.`date` between startdat and enddate;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_salsitm_sums_period`(itmid int,startdat date,enddate date)
BEGIN
SELECT SUM(`itms_sales`.`qnty`) as tqnty, (SUM(`itms_sales`.`qnty`)*(`stock_items`.`itm_sell_price`)) as tpric FROM `itms_sales` INNER JOIN `stock_items` on `stock_items`.`itm_id`=`itms_sales`.`sitm_id`  WHERE `itms_sales`.`sitm_id`=itmid and `itms_sales`.`date` between startdat and enddate;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_stok_item_balance`(IN `itm_id` INT, IN `stock_id` INT, IN `startdat` DATE, IN `enddate` DATE, IN `balanceonly` TINYINT, OUT `outbalance` INT)
BEGIN
IF startdat = 0 THEN
IF stock_id = 0 THEN
	IF balanceonly=1 THEN
select (ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=2 and `st_itm_mov_itmid`=itm_id ),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=1 and `st_itm_mov_itmid`=itm_id ),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=4 and `st_itm_mov_itmid`=itm_id ),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=8 and `st_itm_mov_itmid`=itm_id ),0)+ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=7 and `st_itm_mov_itmid`=itm_id ),0)) as balance
into outbalance
from `st_item_mov`
where `st_itm_mov_itmid`=itm_id
LIMIT 1;
select outbalance;
	ELSE
select `st_itm_mov_itmid`,ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=2 and `st_itm_mov_itmid`=itm_id ),0) as bought,
ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=1 and `st_itm_mov_itmid`=itm_id),0) as sold,
ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=4 and `st_itm_mov_itmid`=itm_id),0) as spoil,
(ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=2 and `st_itm_mov_itmid`=itm_id ),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=1 and `st_itm_mov_itmid`=itm_id ),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=4 and `st_itm_mov_itmid`=itm_id ),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=8 and `st_itm_mov_itmid`=itm_id ),0)+ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=7 and `st_itm_mov_itmid`=itm_id ),0)) as balance
from `st_item_mov`
where `st_itm_mov_itmid`=itm_id
LIMIT 1;
	END IF;

ELSE 
     
         IF balanceonly=1 THEN
select (ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=2 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id),0)+ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_itmid`=itm_id  and `st_itm_mov_typ`=3 and `st_itm_mov_cur_stid`!=stock_id and `st_itm_mov_to_st`=stock_id),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=1 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_itmid`=itm_id  and `st_itm_mov_typ`=3 and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_to_st`!=stock_id),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_itmid`=itm_id  and `st_itm_mov_typ`=4 and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_to_st`=stock_id),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=8 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id ),0)+ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=7 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id),0)) as balance
into outbalance
from `st_item_mov` 
where `st_itm_mov_itmid`=itm_id
LIMIT 1;
select outbalance;
	     ELSE
     
select `st_itm_mov_itmid`,ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=2 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id ),0) as bought,
ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_typ`=1 and `st_itm_mov_itmid`=itm_id),0) as sold,
ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_typ`=4 and `st_itm_mov_itmid`=itm_id),0) as spoiled,
ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_itmid`=itm_id  and `st_itm_mov_typ`=3 and `st_itm_mov_cur_stid`!=stock_id and `st_itm_mov_to_st`=stock_id),0) as transfered_in,
ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_itmid`=itm_id  and `st_itm_mov_typ`=3 and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_to_st`!=stock_id),0) as trans_out,
(ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=2 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id),0)+ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_itmid`=itm_id  and `st_itm_mov_typ`=3 and `st_itm_mov_cur_stid`!=stock_id and `st_itm_mov_to_st`=stock_id),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=1 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_itmid`=itm_id  and `st_itm_mov_typ`=3 and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_to_st`!=stock_id),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_itmid`=itm_id  and `st_itm_mov_typ`=4 and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_to_st`=stock_id),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=8 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id),0)+ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=7 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id),0)) as balance
from `st_item_mov` 
where `st_itm_mov_itmid`=itm_id
LIMIT 1;

            END IF;
END IF;

ELSE

IF stock_id = 0 THEN
	IF balanceonly=1 THEN
select (ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=2 and `st_itm_mov_itmid`=itm_id ),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=1 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_dat` between startdat and enddate),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=8 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_dat` between startdat and enddate),0)+ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=7 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_dat` between startdat and enddate),0)) as balance
into outbalance
from `st_item_mov`
where `st_itm_mov_itmid`=itm_id 
and `st_itm_mov_dat` between startdat and enddate
LIMIT 1;
	ELSE

 select `st_itm_mov_itmid`,ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=2 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_dat`  between startdat and enddate),0) as bought,
ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=1 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_dat` between startdat and enddate),0) as sold,
(ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=2 and `st_itm_mov_itmid`=itm_id ),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=1 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_dat` between startdat and enddate),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=8 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_dat` between startdat and enddate),0)+ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=7 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_dat` between startdat and enddate),0)) as balance
from `st_item_mov`
where `st_itm_mov_itmid`=itm_id 
and `st_itm_mov_dat` between startdat and enddate
LIMIT 1;
	END IF;
ELSE 
	IF balanceonly=1 THEN
select(ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=2 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id),0)+ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_itmid`=itm_id  and `st_itm_mov_typ`=3 and `st_itm_mov_cur_stid`!=stock_id and `st_itm_mov_to_st`=stock_id and `st_itm_mov_dat` between startdat and enddate),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=1 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_dat` between startdat and enddate),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_itmid`=itm_id  and `st_itm_mov_typ`=3 and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_to_st`!=stock_id and `st_itm_mov_dat` between startdat and enddate),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=8 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_to_st`=stock_id and `st_itm_mov_dat` between startdat and enddate),0)+ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=7 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_to_st`=stock_id and `st_itm_mov_dat` between startdat and enddate),0)) as balance
into outbalance
from `st_item_mov`
where `st_itm_mov_itmid`=itm_id and `st_itm_mov_dat` between startdat and enddate
LIMIT 1;      
        ELSE
select `st_itm_mov_itmid`,ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=2 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_dat`  between startdat and enddate),0) as bought,
ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_typ`=1 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_dat` between startdat and enddate),0) as sold,
ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_itmid`=itm_id  and `st_itm_mov_typ`=3 and `st_itm_mov_cur_stid`!=stock_id and `st_itm_mov_to_st`=stock_id and `st_itm_mov_dat` between startdat and enddate),0) as transfered_in,
ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_itmid`=itm_id  and `st_itm_mov_typ`=3 and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_to_st`!=stock_id and `st_itm_mov_dat` between startdat and enddate),0) as trans_out,
(ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=2 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id),0)+ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_itmid`=itm_id  and `st_itm_mov_typ`=3 and `st_itm_mov_cur_stid`!=stock_id and `st_itm_mov_to_st`=stock_id and `st_itm_mov_dat` between startdat and enddate),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=1 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_dat` between startdat and enddate),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_itmid`=itm_id  and `st_itm_mov_typ`=3 and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_to_st`!=stock_id and `st_itm_mov_dat` between startdat and enddate),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=8 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_to_st`=stock_id and `st_itm_mov_dat` between startdat and enddate),0)+ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=7 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_to_st`=stock_id and `st_itm_mov_dat` between startdat and enddate),0)) as balance
from `st_item_mov` where `st_itm_mov_itmid`=itm_id and `st_itm_mov_dat` between startdat and enddate
LIMIT 1;
	END IF;
END IF;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_upd_itm_limits`(IN `itmid` INT, IN `options0get` INT, IN `newlimit` INT)
BEGIN
IF options0get=0 THEN
IF itmid=0 THEN
SELECT  `itm_id`,`itm_limit`
FROM  `stock_items` 
WHERE  1;
ELSE
SELECT  `itm_limit`
FROM  `stock_items` 
WHERE  `itm_id` =itmid; 
END IF;
ELSE

UPDATE `stock_items`
SET `itm_limit`=newlimit
WHERE `itm_id` =itmid;

SELECT  `itm_limit`
FROM  `stock_items` 
WHERE  `itm_id` =itmid;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_varincome_rep`(startdate date,enddate date)
BEGIN
SELECT `varincome_id`,`acc_mov_id`,`varincome_dat`,`varincome_time`,`varincome_value`,`varincome_desc`
FROM `acc_varincome` 
WHERE `varincome_dat` BETWEEN startdate AND enddate;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pay_unpaid_cust_subinv`(IN `invno` INT, IN `subinv_no` INT, IN `orderid` INT, IN `sales_desc` TEXT CHARSET utf8, IN `mov_dat` DATE, IN `mov_time` TIME, IN `inv_gtotal` FLOAT, IN `profid` INT)
BEGIN
UPDATE sub_inv SET `paidstatus`=1
WHERE `maininv_id`=invno AND `subinv_no`=subinv_no AND `orderid`=orderid AND `cust_profid` =profid;
UPDATE acc_sales SET `sales_paid`=1, `sales_desc`= CONCAT(sales_desc,',وتم الدفع في : ',mov_dat)
WHERE `inv_id`=orderid AND `subinv_no`=subinv_no AND `sales_value`=inv_gtotal;
CALL `add_acc_mov` (mov_dat,mov_time,5, 0,1,1,0,0,1,0);
SET @acc_movid=LAST_INSERT_ID();
CALL `add_cash_mov` (@acc_movid,mov_dat,mov_time,1,0,inv_gtotal,0,CONCAT('دفع فاتورة آجل رقم : ',invno,' اوردر فرعي رقم',orderid,'-',subinv_no,' بواسطة العميل  ',profid));
CALL `add_prof_mov` (@acc_movid,mov_dat,mov_time,profid,1,inv_gtotal,0,CONCAT('دفع فاتورة آجل رقم : ',invno,'-',subinv_no,' اوردر فرعي رقم ',orderid,'-',subinv_no));
SELECT LAST_INSERT_ID();
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pay_unpaid_inv`(IN `invid` INT, IN `profid` INT, IN `mov_dat` DATE, IN `mov_time` TIME, IN `inv_gtotal` FLOAT)
BEGIN
UPDATE invoices SET `inv_status`=1
WHERE `inv_id`=invid;
UPDATE acc_sales SET `sales_paid`=1, `sales_desc`= CONCAT(sales_desc,',وتم الدفع في : ',mov_dat)
WHERE `inv_id`=invid;
CALL `add_acc_mov` (mov_dat,mov_time,5, 0,1,1,0,0,1,0);
SET @acc_movid=LAST_INSERT_ID();
CALL `add_cash_mov` (@acc_movid,mov_dat,mov_time,1,0,inv_gtotal,0,CONCAT('دفع فاتورة آجل رقم : ',invid,' بواسطة العميل رقم : ',profid));
CALL `add_prof_mov` (@acc_movid,mov_dat,mov_time,profid,1,inv_gtotal,0,CONCAT('دفع فاتورة آجل رقم : ',invid));
SELECT LAST_INSERT_ID();
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `populate_exp_list`(level int)
BEGIN
SELECT * FROM  `expen_tree_names` WHERE  `top_level_id` =level;   
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `populate_profile_lists`(IN `allprof` TINYINT, IN `proftype1` INT, IN `proftype2` INT, IN `proftype3` INT)
BEGIN

IF allprof=1 THEN

SELECT  `profileid` ,  `fullname` ,  `mobile` 
FROM  `profile` 
WHERE  1;

ELSE

IF proftype2=0 THEN

SELECT  `profileid` ,  `fullname` ,  `mobile` 
FROM  `profile` 
WHERE  `type` =proftype1;

ELSE

IF proftype3=0 THEN

SELECT  `profileid` ,  `fullname` ,  `mobile` 
FROM  `profile` 
WHERE  `type` =proftype1
OR `type` =proftype2;

ELSE

SELECT  `profileid` ,  `fullname` ,  `mobile` 
FROM  `profile` 
WHERE  `type` =proftype1
OR `type` =proftype2
OR `type` =proftype3;

END IF;
END IF;
END IF;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `save1get0_tablearrjson`(IN `orderoption` INT, IN `objdate` DATE, IN `objtime` TIME, IN `objdattime` DATETIME, IN `tablearrobj` LONGTEXT CHARSET utf8, IN `objdesc` TEXT CHARSET utf8)
BEGIN
IF orderoption=1 THEN
INSERT INTO `tablesorderbackup` (`tblobj_ai_id`, `tblarrobj_dat`, `tblarrobj_time`, `tblarrobj_dattime`, `tblarrobj_json`, `tblarrobj_comment`) VALUES (NULL, objdate, objtime, objdattime, tablearrobj, objdesc);
SELECT LAST_INSERT_ID();
ELSE
SELECT * 
FROM  `tablesorderbackup` 
WHERE  `tblobj_ai_id` = (SELECT MAX(tblobj_ai_id) 
FROM  `tablesorderbackup`);
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `save_inv`(IN `inv_dattime` DATETIME, IN `inv_cus_prof_id` INT, IN `inv_cus_user_id` INT, IN `inv_cashier_id` INT, IN `inv_total` FLOAT, IN `inv_discount` FLOAT, IN `inv_tax` FLOAT, IN `inv_service` FLOAT, IN `inv_gtotal` FLOAT, IN `inv_status` INT, IN `inv_dat` DATE, IN `inv_time` TIME, IN `orderno` INT)
BEGIN

INSERT INTO `invoices` (`inv_id`, `inv_dattime`, `inv_cus_prof_id`, `inv_cus_user_id`, `inv_cashier_id`, `inv_total`, `inv_discount`, `inv_tax`, `inv_service`, `inv_gtotal`, `inv_status`, `inv_timestamp`, `inv_dat`, `inv_time`, `inv_orderno`) 
VALUES (NULL, inv_dattime, inv_cus_prof_id, inv_cus_user_id, inv_cashier_id, inv_total, inv_discount, inv_tax, inv_service, inv_gtotal, inv_status, CURRENT_TIMESTAMP,inv_dat,inv_time,orderno);
SELECT LAST_INSERT_ID();
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `save_order`(IN `order_dattime` DATETIME, IN `order_dat` DATE, IN `order_time` TIME, IN `table_no` INT, IN `sub_orders_no` INT, IN `table_json` LONGTEXT, IN `userid` INT)
BEGIN
INSERT INTO `orders` (`order_id`, `order_dattime`, `order_dat`, `order_time`, `table_no`, `sub_orders_no`, `table_json`, `userid`) 
VALUES (NULL, order_dattime, order_dat, order_time, table_no, sub_orders_no, table_json, userid);
SELECT LAST_INSERT_ID();
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `save_prnt_inv`(IN `act_inv_id` INT, IN `inv_dattime` DATETIME, IN `inv_cus_prof_id` INT, IN `inv_cus_user_id` INT, IN `inv_cashier_id` INT, IN `inv_total` FLOAT, IN `inv_discount` FLOAT, IN `inv_tax` FLOAT, IN `inv_service` FLOAT, IN `inv_gtotal` FLOAT)
BEGIN

 INSERT INTO  `printed_invoices` (
`prnt_inv_id` ,
`act_inv_id` ,
`inv_dattime` ,
`inv_cus_prof_id` ,
`inv_cus_user_id` ,
`inv_cashier_id` ,
`inv_total` ,
`inv_discount` ,
`inv_tax` ,
`inv_service` ,
`inv_gtotal` ,
`inv_timestamp`
)
VALUES (
NULL ,  act_inv_id,  inv_dattime,  inv_cus_prof_id,  inv_cus_user_id,  inv_cashier_id,  inv_total,  inv_discount,  inv_tax,  inv_service,  inv_gtotal, 
CURRENT_TIMESTAMP
);
SELECT LAST_INSERT_ID();
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `save_sub_inv`(maininv_id int,subinv_no int,orderid int,suborderid int,cashierid int,cust_profid int,cust_userid int,total float,tax float,service float,disc float,gtotal float,paidstatus tinyint,dat date,tim time,dattime datetime,subinvjson longtext)
BEGIN
INSERT INTO `sub_inv` (`subinvid`, `maininv_id`, `subinv_no`, `orderid`, `suborderid`, `cashierid`, `cust_profid`, `cust_userid`, `total`, `tax`, `service`, `disc`, `gtotal`, `paidstatus`, `dat`, `time`, `datetime`, `subinvJson`) 
VALUES (NULL, maininv_id, subinv_no, orderid, suborderid, cashierid, cust_profid, cust_userid, total, tax, service, disc, gtotal, paidstatus, dat, tim, dattime,subinvjson);
SELECT LAST_INSERT_ID();
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `subs_stock_mov_sell`(usrid int,st_itm_mov_itmid int,st_itm_mov_qnty float,st_itm_mov_qnty_unit int,st_itm_mov_dat date,st_itm_mov_notes text,st_itm_mov_profid int)
BEGIN
INSERT INTO `st_item_mov` (`st_itm_mov_id`, `st_itm_mov_typ`, `st_itm_mov_usrid`, `st_itm_mov_itmid`, `st_itm_mov_cur_stid`, `st_itm_mov_qnty`, `st_itm_mov_qnty_unit`, `st_itm_mov_dat`, `st_itm_mov_timstmp`, `st_itm_mov_notes`, `st_itm_mov_to_st`, `st_itm_mov_st_itm_mov_price`, `st_itm_mov_buyerid`, `st_itm_mov_profid`, `st_itm_mov_itm_typ`) VALUES (NULL, '1', usrid,st_itm_mov_itmid,'2' ,st_itm_mov_qnty,st_itm_mov_qnty_unit,st_itm_mov_dat,CURRENT_TIMESTAMP, st_itm_mov_notes, '2', '0',st_itm_mov_profid,st_itm_mov_profid,'2');
SELECT LAST_INSERT_ID();
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_order`(IN `orderno` INT, IN `tableno` INT, IN `order_dattime` DATETIME, IN `order_dat` DATE, IN `order_time` TIME, IN `sub_orders_no` INT, IN `table_json` LONGTEXT, IN `userid` INT)
BEGIN
UPDATE `orders` SET `order_dattime`=order_dattime,`order_dat`=order_dat,`order_time`=order_time,`table_no`=tableno,`sub_orders_no`=sub_orders_no,`table_json`=table_json,`userid`=userid 
WHERE `order_id`=orderno 
AND `table_no`=tableno;
SELECT ROW_COUNT();
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_st_blance`(IN `itm_id` INT, IN `st_id` INT, IN `act_balance` INT, IN `itm_qnty_unit` INT, IN `balance_notes` TEXT, IN `balance_dat` DATE, IN `actbalance_dattime` DATETIME)
BEGIN
SET @calcbalance =0;
CALL `get_stok_item_balance` (itm_id,st_id,0,0,1,@calcbalance);
SET @calc_act_bal_dif=(@calcbalance-act_balance);
INSERT INTO `st_items_balance` (`st_items_balance_id`, `itm_id`, `st_id`, `calc_balance`, `calc_balance_datetime`, `act_balance`, `act_balance_datetime`, `itm_qnty_unit`, `calc_act_bal_dif`, `st_items_balance_notes`, `balance_dat`) VALUES (NULL, itm_id, st_id, @calcbalance, CURRENT_TIMESTAMP, act_balance, actbalance_dattime, itm_qnty_unit, @calc_act_bal_dif, balance_notes, balance_dat);
SELECT LAST_INSERT_ID();
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `updat_sales_items`(IN `itmid` INT, IN `dat` DATE, IN `dattime` DATETIME, IN `qnty` INT, IN `itmname` TEXT CHARSET utf8, IN `custprofid` INT, IN `userid` INT, IN `invid` INT, IN `orderid` INT)
BEGIN

INSERT INTO `itms_sales` (`AI_id`, `sitm_id`, `date`, `datetime`, `qnty`, `itmname`, `cust_profid`, `userid`, `inv_id`, `orderid`)
VALUES (NULL, itmid, dat ,dattime,qnty ,itmname, custprofid, userid, invid,orderid);
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `acc_cash`
--

CREATE TABLE IF NOT EXISTS `acc_cash` (
  `cash_id` int(11) NOT NULL AUTO_INCREMENT,
  `acc_mov_id` int(11) NOT NULL,
  `cash_dat` date NOT NULL,
  `cash_time` time NOT NULL,
  `cash_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `acc_mov_type` int(11) NOT NULL,
  `cash_openbalance` float NOT NULL,
  `cash_value` float NOT NULL,
  `cash_endbalance` float NOT NULL,
  `cash_desc` text NOT NULL,
  PRIMARY KEY (`cash_id`),
  KEY `acc_mov_id` (`acc_mov_id`,`acc_mov_type`),
  KEY `acc_mov_type` (`acc_mov_type`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COMMENT='جدول حركة الخزينة والكاش سواء اضافة أو خصم' AUTO_INCREMENT=48 ;

--
-- Dumping data for table `acc_cash`
--

INSERT INTO `acc_cash` (`cash_id`, `acc_mov_id`, `cash_dat`, `cash_time`, `cash_timestamp`, `acc_mov_type`, `cash_openbalance`, `cash_value`, `cash_endbalance`, `cash_desc`) VALUES
(1, 1, '2015-08-03', '11:28:47', '2015-08-03 09:34:59', 2, 0, 0, 0, 'شراء رصيد مخزن من شاي باكيت بكمية 500 باكيت-pak بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(2, 2, '2015-08-03', '11:29:15', '2015-08-03 09:35:27', 2, 0, 0, 0, 'شراء رصيد مخزن من شاي اخضر باكيت بكمية 500 باكيت-pak بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(3, 3, '2015-08-03', '11:29:40', '2015-08-03 09:35:52', 2, 0, 0, 0, 'شراء رصيد مخزن من شاي فواكه باكيت بكمية 500 باكيت-pak بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(4, 4, '2015-08-03', '11:30:05', '2015-08-03 09:36:17', 2, 0, 0, 0, 'شراء رصيد مخزن من ينسون باكيت بكمية 500 باكيت-pak بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(5, 5, '2015-08-03', '11:30:29', '2015-08-03 09:36:41', 2, 0, 0, 0, 'شراء رصيد مخزن من نعناع باكيت بكمية 500 باكيت-pak بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(6, 6, '2015-08-03', '11:30:47', '2015-08-03 09:36:59', 2, 0, 0, 0, 'شراء رصيد مخزن من كركاديه باكيت بكمية 500 باكيت-pak بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(7, 7, '2015-08-03', '11:31:17', '2015-08-03 09:37:29', 2, 0, 0, 0, 'شراء رصيد مخزن من بن سادة بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(8, 8, '2015-08-03', '11:31:39', '2015-08-03 09:37:51', 2, 0, 0, 0, 'شراء رصيد مخزن من بن محوج بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(9, 9, '2015-08-03', '11:32:03', '2015-08-03 09:38:16', 2, 0, 0, 0, 'شراء رصيد مخزن من قهوه اكيبريسو سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(10, 10, '2015-08-03', '11:32:24', '2015-08-03 09:38:36', 2, 0, 0, 0, 'شراء رصيد مخزن من نسكافيه سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(11, 11, '2015-08-03', '11:32:47', '2015-08-03 09:38:59', 2, 0, 0, 0, 'شراء رصيد مخزن من كاكاو نسكويك سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(12, 12, '2015-08-03', '11:33:10', '2015-08-03 09:39:22', 2, 0, 0, 0, 'شراء رصيد مخزن من قرفة سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(13, 13, '2015-08-03', '11:33:53', '2015-08-03 09:40:05', 2, 0, 0, 0, 'شراء رصيد مخزن من قرفة عيدان بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(14, 14, '2015-08-03', '11:34:21', '2015-08-03 09:40:33', 2, 0, 0, 0, 'شراء رصيد مخزن من جنزبيل سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(15, 15, '2015-08-03', '11:34:40', '2015-08-03 09:40:52', 2, 0, 0, 0, 'شراء رصيد مخزن من سحلب سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(16, 16, '2015-08-03', '11:35:04', '2015-08-03 09:41:16', 2, 0, 0, 0, 'شراء رصيد مخزن من مكسرات زبيب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(17, 17, '2015-08-03', '11:35:29', '2015-08-03 09:41:41', 2, 0, 0, 0, 'شراء رصيد مخزن من مكسرات جوز هند بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(18, 18, '2015-08-03', '11:35:51', '2015-08-03 09:42:03', 2, 0, 0, 0, 'شراء رصيد مخزن من مكسرات سوداني بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(19, 19, '2015-08-03', '11:36:11', '2015-08-03 09:42:24', 2, 0, 0, 0, 'شراء رصيد مخزن من حمص سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(20, 20, '2015-08-03', '11:36:39', '2015-08-03 09:42:52', 2, 0, 0, 0, 'شراء رصيد مخزن من كانز - بيبسي-سفن-مير بكمية 500 كانز-cans بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(21, 21, '2015-08-03', '11:37:07', '2015-08-03 09:43:19', 2, 0, 0, 0, 'شراء رصيد مخزن من جولد كانز بكمية 500 كانز-cans بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(22, 22, '2015-08-03', '11:37:23', '2015-08-03 09:43:36', 2, 0, 0, 0, 'شراء رصيد مخزن من ريدبول بكمية 500 كانز-cans بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(23, 23, '2015-08-03', '11:37:48', '2015-08-03 09:44:00', 2, 0, 0, 0, 'شراء رصيد مخزن من مياه معدنية ص بكمية 500 زجاجة بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(24, 24, '2015-08-03', '11:38:08', '2015-08-03 09:44:20', 2, 0, 0, 0, 'شراء رصيد مخزن من ليمون سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(25, 25, '2015-08-03', '11:38:29', '2015-08-03 09:44:41', 2, 0, 0, 0, 'شراء رصيد مخزن من برتقال سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(26, 26, '2015-08-03', '11:39:03', '2015-08-03 09:45:15', 2, 0, 0, 0, 'شراء رصيد مخزن من مانجو عصير بكمية 10000 مللي لتر بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(27, 27, '2015-08-03', '11:39:30', '2015-08-03 09:45:42', 2, 0, 0, 0, 'شراء رصيد مخزن من جوافه سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(28, 28, '2015-08-03', '11:39:57', '2015-08-03 09:46:09', 2, 0, 0, 0, 'شراء رصيد مخزن من خوخ سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(29, 29, '2015-08-03', '11:40:16', '2015-08-03 09:46:28', 2, 0, 0, 0, 'شراء رصيد مخزن من كانتلوب سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(30, 30, '2015-08-03', '11:41:18', '2015-08-03 09:47:33', 2, 0, 0, 0, 'شراء رصيد مخزن من اويو باكيت بكمية 500 باكيت-pak بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(31, 31, '2015-08-03', '11:41:45', '2015-08-03 09:47:57', 2, 0, 0, 0, 'شراء رصيد مخزن من بلح سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(32, 32, '2015-08-03', '11:42:39', '2015-08-03 09:48:51', 2, 0, 0, 0, 'شراء رصيد مخزن من موز سايب -قطعة بكمية 500 قطعة بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(33, 33, '2015-08-03', '11:43:52', '2015-08-03 09:50:04', 2, 0, 0, 0, 'شراء رصيد مخزن من كيوي سايب قطعة بكمية 500 قطعة بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(34, 34, '2015-08-03', '11:44:33', '2015-08-03 09:50:47', 2, 0, 0, 0, 'شراء رصيد مخزن من زبادي علبة بكمية 500 قطعة بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(35, 35, '2015-08-03', '11:45:51', '2015-08-03 09:52:04', 2, 0, 0, 0, 'شراء رصيد مخزن من سكر ابيض بكمية 20000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(36, 36, '2015-08-03', '11:46:12', '2015-08-03 09:52:25', 2, 0, 0, 0, 'شراء رصيد مخزن من تفاح سايب  بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(37, 37, '2015-08-03', '11:46:41', '2015-08-03 09:52:54', 2, 0, 0, 0, 'شراء رصيد مخزن من تفاح عصير بكمية 10000 مللي لتر بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(38, 38, '2015-08-03', '11:47:36', '2015-08-03 09:53:48', 2, 0, 0, 0, 'شراء رصيد مخزن من حليب سايب بكمية 20000 مللي لتر بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(39, 39, '2015-08-03', '11:48:07', '2015-08-03 09:54:19', 2, 0, 0, 0, 'شراء رصيد مخزن من عسل سايب بكمية 10000 مللي لتر بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(40, 40, '2015-08-03', '11:48:51', '2015-08-03 09:55:03', 2, 0, 0, 0, 'شراء رصيد مخزن من معسل فواكه فاخر بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(41, 41, '2015-08-03', '11:49:12', '2015-08-03 09:55:24', 2, 0, 0, 0, 'شراء رصيد مخزن من معسل فواكه عاده بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(42, 42, '2015-08-03', '11:49:43', '2015-08-03 09:55:55', 2, 0, 0, 0, 'شراء رصيد مخزن من معسل عاده بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(43, 43, '2015-08-03', '11:50:22', '2015-08-03 09:56:35', 2, 0, 0, 0, 'شراء رصيد مخزن من لاي طبي بكمية 500 قطعة بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(44, 44, '2015-08-03', '11:51:23', '2015-08-03 09:57:35', 2, 0, 0, 0, 'شراء رصيد مخزن من اضافات (فليفور) بكمية 20000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(45, 45, '2015-08-03', '11:51:52', '2015-08-03 09:58:05', 2, 0, 0, 0, 'شراء رصيد مخزن من فراولة عصير بكمية 10000 مللي لتر بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(46, 46, '2015-08-03', '11:52:37', '2015-08-03 09:58:49', 2, 0, 0, 0, 'شراء رصيد مخزن من بطيخ سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه'),
(47, 47, '2015-08-03', '11:53:10', '2015-08-03 09:59:22', 2, 0, 0, 0, 'شراء رصيد مخزن من شربات عصير رمان-نعنا بكمية 10000 مللي لتر بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه');

-- --------------------------------------------------------

--
-- Table structure for table `acc_expenses`
--

CREATE TABLE IF NOT EXISTS `acc_expenses` (
  `exp_id` int(11) NOT NULL AUTO_INCREMENT,
  `acc_mov_id` int(11) NOT NULL,
  `exp_code` int(11) NOT NULL,
  `exp_dat` date NOT NULL,
  `exp_time` time NOT NULL,
  `exp_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `exp_value` float NOT NULL,
  `exp_desc` text NOT NULL,
  `fromcash` tinyint(4) NOT NULL,
  PRIMARY KEY (`exp_id`),
  KEY `acc_mov_id` (`acc_mov_id`,`exp_code`),
  KEY `exp_code` (`exp_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='جدول المصروفات' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `acc_mov`
--

CREATE TABLE IF NOT EXISTS `acc_mov` (
  `acc_mov_id` int(11) NOT NULL AUTO_INCREMENT,
  `mov_dat` date NOT NULL,
  `mov_time` time NOT NULL,
  `mov_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mov_type` int(11) NOT NULL,
  `sales_table` tinyint(4) NOT NULL,
  `cust_table` tinyint(4) NOT NULL,
  `cash_table` tinyint(4) NOT NULL,
  `purch_table` tinyint(4) NOT NULL,
  `exp_table` tinyint(4) NOT NULL,
  `staff_table` tinyint(4) NOT NULL,
  `othincome_table` tinyint(4) NOT NULL,
  PRIMARY KEY (`acc_mov_id`),
  KEY `mov_type` (`mov_type`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COMMENT='القيود - حركة الحسابات' AUTO_INCREMENT=48 ;

--
-- Dumping data for table `acc_mov`
--

INSERT INTO `acc_mov` (`acc_mov_id`, `mov_dat`, `mov_time`, `mov_timestamp`, `mov_type`, `sales_table`, `cust_table`, `cash_table`, `purch_table`, `exp_table`, `staff_table`, `othincome_table`) VALUES
(1, '2015-08-03', '11:28:47', '2015-08-03 09:34:59', 2, 0, 0, 1, 1, 0, 0, 0),
(2, '2015-08-03', '11:29:15', '2015-08-03 09:35:27', 2, 0, 0, 1, 1, 0, 0, 0),
(3, '2015-08-03', '11:29:40', '2015-08-03 09:35:52', 2, 0, 0, 1, 1, 0, 0, 0),
(4, '2015-08-03', '11:30:05', '2015-08-03 09:36:17', 2, 0, 0, 1, 1, 0, 0, 0),
(5, '2015-08-03', '11:30:29', '2015-08-03 09:36:41', 2, 0, 0, 1, 1, 0, 0, 0),
(6, '2015-08-03', '11:30:47', '2015-08-03 09:36:59', 2, 0, 0, 1, 1, 0, 0, 0),
(7, '2015-08-03', '11:31:17', '2015-08-03 09:37:29', 2, 0, 0, 1, 1, 0, 0, 0),
(8, '2015-08-03', '11:31:39', '2015-08-03 09:37:51', 2, 0, 0, 1, 1, 0, 0, 0),
(9, '2015-08-03', '11:32:03', '2015-08-03 09:38:16', 2, 0, 0, 1, 1, 0, 0, 0),
(10, '2015-08-03', '11:32:24', '2015-08-03 09:38:36', 2, 0, 0, 1, 1, 0, 0, 0),
(11, '2015-08-03', '11:32:47', '2015-08-03 09:38:59', 2, 0, 0, 1, 1, 0, 0, 0),
(12, '2015-08-03', '11:33:10', '2015-08-03 09:39:22', 2, 0, 0, 1, 1, 0, 0, 0),
(13, '2015-08-03', '11:33:53', '2015-08-03 09:40:05', 2, 0, 0, 1, 1, 0, 0, 0),
(14, '2015-08-03', '11:34:21', '2015-08-03 09:40:33', 2, 0, 0, 1, 1, 0, 0, 0),
(15, '2015-08-03', '11:34:40', '2015-08-03 09:40:52', 2, 0, 0, 1, 1, 0, 0, 0),
(16, '2015-08-03', '11:35:04', '2015-08-03 09:41:16', 2, 0, 0, 1, 1, 0, 0, 0),
(17, '2015-08-03', '11:35:29', '2015-08-03 09:41:41', 2, 0, 0, 1, 1, 0, 0, 0),
(18, '2015-08-03', '11:35:51', '2015-08-03 09:42:03', 2, 0, 0, 1, 1, 0, 0, 0),
(19, '2015-08-03', '11:36:11', '2015-08-03 09:42:24', 2, 0, 0, 1, 1, 0, 0, 0),
(20, '2015-08-03', '11:36:39', '2015-08-03 09:42:52', 2, 0, 0, 1, 1, 0, 0, 0),
(21, '2015-08-03', '11:37:07', '2015-08-03 09:43:19', 2, 0, 0, 1, 1, 0, 0, 0),
(22, '2015-08-03', '11:37:23', '2015-08-03 09:43:36', 2, 0, 0, 1, 1, 0, 0, 0),
(23, '2015-08-03', '11:37:48', '2015-08-03 09:44:00', 2, 0, 0, 1, 1, 0, 0, 0),
(24, '2015-08-03', '11:38:08', '2015-08-03 09:44:20', 2, 0, 0, 1, 1, 0, 0, 0),
(25, '2015-08-03', '11:38:29', '2015-08-03 09:44:41', 2, 0, 0, 1, 1, 0, 0, 0),
(26, '2015-08-03', '11:39:03', '2015-08-03 09:45:15', 2, 0, 0, 1, 1, 0, 0, 0),
(27, '2015-08-03', '11:39:30', '2015-08-03 09:45:42', 2, 0, 0, 1, 1, 0, 0, 0),
(28, '2015-08-03', '11:39:57', '2015-08-03 09:46:09', 2, 0, 0, 1, 1, 0, 0, 0),
(29, '2015-08-03', '11:40:16', '2015-08-03 09:46:28', 2, 0, 0, 1, 1, 0, 0, 0),
(30, '2015-08-03', '11:41:18', '2015-08-03 09:47:33', 2, 0, 0, 1, 1, 0, 0, 0),
(31, '2015-08-03', '11:41:45', '2015-08-03 09:47:57', 2, 0, 0, 1, 1, 0, 0, 0),
(32, '2015-08-03', '11:42:39', '2015-08-03 09:48:51', 2, 0, 0, 1, 1, 0, 0, 0),
(33, '2015-08-03', '11:43:52', '2015-08-03 09:50:04', 2, 0, 0, 1, 1, 0, 0, 0),
(34, '2015-08-03', '11:44:33', '2015-08-03 09:50:47', 2, 0, 0, 1, 1, 0, 0, 0),
(35, '2015-08-03', '11:45:51', '2015-08-03 09:52:04', 2, 0, 0, 1, 1, 0, 0, 0),
(36, '2015-08-03', '11:46:12', '2015-08-03 09:52:25', 2, 0, 0, 1, 1, 0, 0, 0),
(37, '2015-08-03', '11:46:41', '2015-08-03 09:52:54', 2, 0, 0, 1, 1, 0, 0, 0),
(38, '2015-08-03', '11:47:36', '2015-08-03 09:53:48', 2, 0, 0, 1, 1, 0, 0, 0),
(39, '2015-08-03', '11:48:07', '2015-08-03 09:54:19', 2, 0, 0, 1, 1, 0, 0, 0),
(40, '2015-08-03', '11:48:51', '2015-08-03 09:55:03', 2, 0, 0, 1, 1, 0, 0, 0),
(41, '2015-08-03', '11:49:12', '2015-08-03 09:55:24', 2, 0, 0, 1, 1, 0, 0, 0),
(42, '2015-08-03', '11:49:43', '2015-08-03 09:55:55', 2, 0, 0, 1, 1, 0, 0, 0),
(43, '2015-08-03', '11:50:22', '2015-08-03 09:56:35', 2, 0, 0, 1, 1, 0, 0, 0),
(44, '2015-08-03', '11:51:23', '2015-08-03 09:57:35', 2, 0, 0, 1, 1, 0, 0, 0),
(45, '2015-08-03', '11:51:52', '2015-08-03 09:58:05', 2, 0, 0, 1, 1, 0, 0, 0),
(46, '2015-08-03', '11:52:37', '2015-08-03 09:58:49', 2, 0, 0, 1, 1, 0, 0, 0),
(47, '2015-08-03', '11:53:10', '2015-08-03 09:59:22', 2, 0, 0, 1, 1, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `acc_mov_profiles`
--

CREATE TABLE IF NOT EXISTS `acc_mov_profiles` (
  `acc_prof_mov_id` int(11) NOT NULL AUTO_INCREMENT,
  `acc_mov_id` int(11) NOT NULL,
  `prof_mov_dat` date NOT NULL,
  `prof_mov_time` time NOT NULL,
  `prof_mov_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `prof_id` int(11) NOT NULL,
  `acc_mov_type` int(11) NOT NULL,
  `prof_mov_value` float NOT NULL,
  `prof_mov_balance` float NOT NULL,
  `prof_mov_desc` text NOT NULL,
  `salary` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`acc_prof_mov_id`),
  KEY `acc_mov_id` (`acc_mov_id`,`prof_id`,`acc_mov_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='جدول حركات حسابات شركاء-عاملين-عملاء' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `acc_mov_types`
--

CREATE TABLE IF NOT EXISTS `acc_mov_types` (
  `mov_typ_id` int(11) NOT NULL AUTO_INCREMENT,
  `mov_typ_name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mov_typ_desc` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`mov_typ_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=3 ;

--
-- Dumping data for table `acc_mov_types`
--

INSERT INTO `acc_mov_types` (`mov_typ_id`, `mov_typ_name`, `mov_typ_desc`) VALUES
(1, 'مدين - يضاف', 'القيمة المذكورة يتم اضافتها الى الحساب المذكور'),
(2, 'دائن - مخصوم', 'القيمة المذكورة يتم خصمها من الحساب المذكور');

-- --------------------------------------------------------

--
-- Table structure for table `acc_pes_balance_mov`
--

CREATE TABLE IF NOT EXISTS `acc_pes_balance_mov` (
  `balance_mov_id` int(11) NOT NULL AUTO_INCREMENT,
  `profile_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `acc_mov_type` int(11) NOT NULL,
  `acc_mov_sum` int(11) NOT NULL,
  `acc_mov_desc` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `acc_mov_ref_tbl` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `acc_mov_ref_rowid` int(11) NOT NULL,
  `acc_mov_date` date NOT NULL,
  `acc_mov_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`balance_mov_id`),
  KEY `profile_id` (`profile_id`),
  KEY `user_id` (`user_id`),
  KEY `acc_mov_type` (`acc_mov_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `acc_purch`
--

CREATE TABLE IF NOT EXISTS `acc_purch` (
  `purch_id` int(11) NOT NULL AUTO_INCREMENT,
  `acc_mov_id` int(11) NOT NULL,
  `purch_type` int(11) NOT NULL,
  `purch_dat` date NOT NULL,
  `purch_time` time NOT NULL,
  `purch_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `purch_value` double NOT NULL,
  `fromcash` tinyint(4) NOT NULL,
  `purch_desc` text NOT NULL,
  `st_mov_id` int(11) NOT NULL,
  PRIMARY KEY (`purch_id`),
  KEY `acc_mov_id` (`acc_mov_id`,`purch_type`),
  KEY `purch_type` (`purch_type`),
  KEY `st_mov_id` (`st_mov_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COMMENT='جدول المشتريات سواء اصوص او مخزون' AUTO_INCREMENT=48 ;

--
-- Dumping data for table `acc_purch`
--

INSERT INTO `acc_purch` (`purch_id`, `acc_mov_id`, `purch_type`, `purch_dat`, `purch_time`, `purch_timestamp`, `purch_value`, `fromcash`, `purch_desc`, `st_mov_id`) VALUES
(1, 1, 2, '2015-08-03', '11:28:47', '2015-08-03 09:34:59', 0, 1, 'شراء رصيد مخزن من شاي باكيت بكمية 500 باكيت-pak بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 1),
(2, 2, 2, '2015-08-03', '11:29:15', '2015-08-03 09:35:27', 0, 1, 'شراء رصيد مخزن من شاي اخضر باكيت بكمية 500 باكيت-pak بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2),
(3, 3, 2, '2015-08-03', '11:29:40', '2015-08-03 09:35:52', 0, 1, 'شراء رصيد مخزن من شاي فواكه باكيت بكمية 500 باكيت-pak بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 3),
(4, 4, 2, '2015-08-03', '11:30:05', '2015-08-03 09:36:17', 0, 1, 'شراء رصيد مخزن من ينسون باكيت بكمية 500 باكيت-pak بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 4),
(5, 5, 2, '2015-08-03', '11:30:29', '2015-08-03 09:36:41', 0, 1, 'شراء رصيد مخزن من نعناع باكيت بكمية 500 باكيت-pak بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 5),
(6, 6, 2, '2015-08-03', '11:30:47', '2015-08-03 09:36:59', 0, 1, 'شراء رصيد مخزن من كركاديه باكيت بكمية 500 باكيت-pak بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 6),
(7, 7, 2, '2015-08-03', '11:31:17', '2015-08-03 09:37:29', 0, 1, 'شراء رصيد مخزن من بن سادة بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 7),
(8, 8, 2, '2015-08-03', '11:31:39', '2015-08-03 09:37:51', 0, 1, 'شراء رصيد مخزن من بن محوج بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 8),
(9, 9, 2, '2015-08-03', '11:32:03', '2015-08-03 09:38:16', 0, 1, 'شراء رصيد مخزن من قهوه اكيبريسو سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 9),
(10, 10, 2, '2015-08-03', '11:32:24', '2015-08-03 09:38:36', 0, 1, 'شراء رصيد مخزن من نسكافيه سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 10),
(11, 11, 2, '2015-08-03', '11:32:47', '2015-08-03 09:38:59', 0, 1, 'شراء رصيد مخزن من كاكاو نسكويك سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 11),
(12, 12, 2, '2015-08-03', '11:33:10', '2015-08-03 09:39:22', 0, 1, 'شراء رصيد مخزن من قرفة سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 12),
(13, 13, 2, '2015-08-03', '11:33:53', '2015-08-03 09:40:05', 0, 1, 'شراء رصيد مخزن من قرفة عيدان بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 13),
(14, 14, 2, '2015-08-03', '11:34:21', '2015-08-03 09:40:33', 0, 1, 'شراء رصيد مخزن من جنزبيل سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 14),
(15, 15, 2, '2015-08-03', '11:34:40', '2015-08-03 09:40:52', 0, 1, 'شراء رصيد مخزن من سحلب سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 15),
(16, 16, 2, '2015-08-03', '11:35:04', '2015-08-03 09:41:16', 0, 1, 'شراء رصيد مخزن من مكسرات زبيب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 16),
(17, 17, 2, '2015-08-03', '11:35:29', '2015-08-03 09:41:41', 0, 1, 'شراء رصيد مخزن من مكسرات جوز هند بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 17),
(18, 18, 2, '2015-08-03', '11:35:51', '2015-08-03 09:42:03', 0, 1, 'شراء رصيد مخزن من مكسرات سوداني بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 18),
(19, 19, 2, '2015-08-03', '11:36:11', '2015-08-03 09:42:24', 0, 1, 'شراء رصيد مخزن من حمص سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 19),
(20, 20, 2, '2015-08-03', '11:36:39', '2015-08-03 09:42:52', 0, 1, 'شراء رصيد مخزن من كانز - بيبسي-سفن-مير بكمية 500 كانز-cans بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 20),
(21, 21, 2, '2015-08-03', '11:37:07', '2015-08-03 09:43:19', 0, 1, 'شراء رصيد مخزن من جولد كانز بكمية 500 كانز-cans بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 21),
(22, 22, 2, '2015-08-03', '11:37:23', '2015-08-03 09:43:36', 0, 1, 'شراء رصيد مخزن من ريدبول بكمية 500 كانز-cans بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 22),
(23, 23, 2, '2015-08-03', '11:37:48', '2015-08-03 09:44:00', 0, 1, 'شراء رصيد مخزن من مياه معدنية ص بكمية 500 زجاجة بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 23),
(24, 24, 2, '2015-08-03', '11:38:08', '2015-08-03 09:44:20', 0, 1, 'شراء رصيد مخزن من ليمون سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 24),
(25, 25, 2, '2015-08-03', '11:38:29', '2015-08-03 09:44:41', 0, 1, 'شراء رصيد مخزن من برتقال سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 25),
(26, 26, 2, '2015-08-03', '11:39:03', '2015-08-03 09:45:15', 0, 1, 'شراء رصيد مخزن من مانجو عصير بكمية 10000 مللي لتر بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 26),
(27, 27, 2, '2015-08-03', '11:39:30', '2015-08-03 09:45:42', 0, 1, 'شراء رصيد مخزن من جوافه سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 27),
(28, 28, 2, '2015-08-03', '11:39:57', '2015-08-03 09:46:09', 0, 1, 'شراء رصيد مخزن من خوخ سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 28),
(29, 29, 2, '2015-08-03', '11:40:16', '2015-08-03 09:46:28', 0, 1, 'شراء رصيد مخزن من كانتلوب سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 29),
(30, 30, 2, '2015-08-03', '11:41:18', '2015-08-03 09:47:33', 0, 1, 'شراء رصيد مخزن من اويو باكيت بكمية 500 باكيت-pak بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 30),
(31, 31, 2, '2015-08-03', '11:41:45', '2015-08-03 09:47:57', 0, 1, 'شراء رصيد مخزن من بلح سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 31),
(32, 32, 2, '2015-08-03', '11:42:39', '2015-08-03 09:48:51', 0, 1, 'شراء رصيد مخزن من موز سايب -قطعة بكمية 500 قطعة بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 32),
(33, 33, 2, '2015-08-03', '11:43:52', '2015-08-03 09:50:04', 0, 1, 'شراء رصيد مخزن من كيوي سايب قطعة بكمية 500 قطعة بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 33),
(34, 34, 2, '2015-08-03', '11:44:33', '2015-08-03 09:50:47', 0, 1, 'شراء رصيد مخزن من زبادي علبة بكمية 500 قطعة بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 34),
(35, 35, 2, '2015-08-03', '11:45:51', '2015-08-03 09:52:04', 0, 1, 'شراء رصيد مخزن من سكر ابيض بكمية 20000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 35),
(36, 36, 2, '2015-08-03', '11:46:12', '2015-08-03 09:52:25', 0, 1, 'شراء رصيد مخزن من تفاح سايب  بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 36),
(37, 37, 2, '2015-08-03', '11:46:41', '2015-08-03 09:52:54', 0, 1, 'شراء رصيد مخزن من تفاح عصير بكمية 10000 مللي لتر بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 37),
(38, 38, 2, '2015-08-03', '11:47:36', '2015-08-03 09:53:48', 0, 1, 'شراء رصيد مخزن من حليب سايب بكمية 20000 مللي لتر بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 38),
(39, 39, 2, '2015-08-03', '11:48:07', '2015-08-03 09:54:19', 0, 1, 'شراء رصيد مخزن من عسل سايب بكمية 10000 مللي لتر بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 39),
(40, 40, 2, '2015-08-03', '11:48:51', '2015-08-03 09:55:03', 0, 1, 'شراء رصيد مخزن من معسل فواكه فاخر بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 40),
(41, 41, 2, '2015-08-03', '11:49:12', '2015-08-03 09:55:24', 0, 1, 'شراء رصيد مخزن من معسل فواكه عاده بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 41),
(42, 42, 2, '2015-08-03', '11:49:43', '2015-08-03 09:55:55', 0, 1, 'شراء رصيد مخزن من معسل عاده بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 42),
(43, 43, 2, '2015-08-03', '11:50:22', '2015-08-03 09:56:35', 0, 1, 'شراء رصيد مخزن من لاي طبي بكمية 500 قطعة بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 43),
(44, 44, 2, '2015-08-03', '11:51:23', '2015-08-03 09:57:35', 0, 1, 'شراء رصيد مخزن من اضافات (فليفور) بكمية 20000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 44),
(45, 45, 2, '2015-08-03', '11:51:52', '2015-08-03 09:58:05', 0, 1, 'شراء رصيد مخزن من فراولة عصير بكمية 10000 مللي لتر بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 45),
(46, 46, 2, '2015-08-03', '11:52:37', '2015-08-03 09:58:49', 0, 1, 'شراء رصيد مخزن من بطيخ سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 46),
(47, 47, 2, '2015-08-03', '11:53:10', '2015-08-03 09:59:22', 0, 1, 'شراء رصيد مخزن من شربات عصير رمان-نعنا بكمية 10000 مللي لتر بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 47);

-- --------------------------------------------------------

--
-- Table structure for table `acc_purch_types`
--

CREATE TABLE IF NOT EXISTS `acc_purch_types` (
  `purch_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `purch_type_name` varchar(20) NOT NULL,
  `purch_type_desc` text NOT NULL,
  PRIMARY KEY (`purch_type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COMMENT='جدول انواع المشتريات' AUTO_INCREMENT=3 ;

--
-- Dumping data for table `acc_purch_types`
--

INSERT INTO `acc_purch_types` (`purch_type_id`, `purch_type_name`, `purch_type_desc`) VALUES
(1, 'مشتريات أصول', 'مشتريات كافة انواع الاصول الثابتة'),
(2, 'مشتريات مخازن', 'كافة انواع مشتريات اصناف المخازن (الاصول المتداولة)');

-- --------------------------------------------------------

--
-- Table structure for table `acc_sales`
--

CREATE TABLE IF NOT EXISTS `acc_sales` (
  `sales_id` int(11) NOT NULL AUTO_INCREMENT,
  `acc_mov_id` int(11) NOT NULL,
  `inv_id` int(11) NOT NULL,
  `sales_dat` date NOT NULL,
  `sales_time` time NOT NULL,
  `sales_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sales_value` float NOT NULL,
  `sales_paid` tinyint(1) NOT NULL,
  `sales_desc` text NOT NULL,
  `subinv_no` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`sales_id`),
  KEY `acc_mov_id` (`acc_mov_id`,`inv_id`),
  KEY `inv_id` (`inv_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='جدول المبيعات - التي تمت من الكاشير' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `acc_types`
--

CREATE TABLE IF NOT EXISTS `acc_types` (
  `mov_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `mov_type_name` varchar(50) NOT NULL,
  `mov_type_desc` text NOT NULL,
  PRIMARY KEY (`mov_type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COMMENT='جدول انواع الحركة في القيود ( مشتريات ، مصروفات، مبيعات، ايرادات متنوعة)' AUTO_INCREMENT=6 ;

--
-- Dumping data for table `acc_types`
--

INSERT INTO `acc_types` (`mov_type_id`, `mov_type_name`, `mov_type_desc`) VALUES
(1, 'مبيعات', 'نوع الحركة مبيعات من أصناف - من خلال الكاشير'),
(2, 'مشتريات', 'مشتريات سواء أصول أو مخزون - سواء من أفراد أو من الخزينة'),
(3, 'مصروفات', 'نوع الحركة مصروفات بكافة أنواعها - سواء من خلال الخزينة أو من خلال افراد'),
(4, 'ايرادات أخرى', 'كافة انواع الايرادات الأخرى سواء اكرامية للمكان - تبس - او تمويل كاس للخزينة أو خلافه '),
(5, 'سداد مبيعات آجل', 'سداد فواتير مسجلة للدفع آجل');

-- --------------------------------------------------------

--
-- Table structure for table `acc_varincome`
--

CREATE TABLE IF NOT EXISTS `acc_varincome` (
  `varincome_id` int(11) NOT NULL AUTO_INCREMENT,
  `acc_mov_id` int(11) NOT NULL,
  `varincome_dat` date NOT NULL,
  `varincome_time` time NOT NULL,
  `varincome_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `varincome_value` float NOT NULL,
  `varincome_desc` text NOT NULL,
  PRIMARY KEY (`varincome_id`),
  KEY `acc_mov_id` (`acc_mov_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='جدول الايرادات المتنوعة' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `cash_receipts`
--

CREATE TABLE IF NOT EXISTS `cash_receipts` (
  `rec_id` int(11) NOT NULL AUTO_INCREMENT,
  `profileid` int(11) NOT NULL,
  `rec_dat` date NOT NULL,
  `rec_html` longtext NOT NULL,
  PRIMARY KEY (`rec_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='ايصالات استلام نقدية' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `exp_tree_levels`
--

CREATE TABLE IF NOT EXISTS `exp_tree_levels` (
  `exp_lvl_id` int(11) NOT NULL AUTO_INCREMENT,
  `level1` int(11) NOT NULL,
  `level2` int(11) NOT NULL,
  `level3` int(11) NOT NULL,
  PRIMARY KEY (`exp_lvl_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COMMENT='تسكين شجرة المصروفات' AUTO_INCREMENT=7 ;

--
-- Dumping data for table `exp_tree_levels`
--

INSERT INTO `exp_tree_levels` (`exp_lvl_id`, `level1`, `level2`, `level3`) VALUES
(1, 1, 3, 5),
(2, 1, 3, 6),
(3, 1, 3, 7),
(4, 1, 3, 8),
(5, 1, 4, 0),
(6, 10, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `expen_tree_names`
--

CREATE TABLE IF NOT EXISTS `expen_tree_names` (
  `exp_id` int(11) NOT NULL AUTO_INCREMENT,
  `exp_name` varchar(50) NOT NULL,
  `top_level_id` int(11) NOT NULL,
  PRIMARY KEY (`exp_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COMMENT='جميع بنود المصروفات' AUTO_INCREMENT=31 ;

--
-- Dumping data for table `expen_tree_names`
--

INSERT INTO `expen_tree_names` (`exp_id`, `exp_name`, `top_level_id`) VALUES
(1, 'مصروفات عمومية', 0),
(2, 'مرتبات وأجور', 0),
(3, 'مرافق', 1),
(4, 'ايجار', 1),
(5, 'كهرباء', 3),
(6, 'غاز', 3),
(7, 'انترنت', 3),
(8, 'مياه', 3),
(17, 'اجور- مرتبات عاملين', 2),
(18, 'عمولات عاملين', 2),
(19, 'مكافئات عاملين', 2),
(20, 'اضافى عاملين', 2),
(21, 'حسابات جارية شركاء', 0),
(22, 'سلف عاملين', 2),
(23, 'ضرائب', 0),
(24, 'ضريبة مبيعات', 23),
(25, 'ضريبة عامة', 23),
(26, 'تأمينات', 0),
(27, 'تأمينات حصة الشركة', 26),
(28, 'تأمينات حصة الموظف', 26),
(29, 'مصروفات أخرى', 1),
(30, 'مصروفات فحم', 29);

-- --------------------------------------------------------

--
-- Table structure for table `expenses_tree`
--

CREATE TABLE IF NOT EXISTS `expenses_tree` (
  `exp_row_id` int(11) NOT NULL AUTO_INCREMENT,
  `exp_code` int(11) NOT NULL,
  `exp_name` varchar(50) NOT NULL,
  `exp_desc` text NOT NULL,
  PRIMARY KEY (`exp_row_id`),
  UNIQUE KEY `exp_code` (`exp_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='جدول انواع المصروفات - شجرة 3 مستويات' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE IF NOT EXISTS `invoices` (
  `inv_id` int(11) NOT NULL AUTO_INCREMENT,
  `inv_dattime` datetime NOT NULL,
  `inv_cus_prof_id` int(11) NOT NULL,
  `inv_cus_user_id` int(11) NOT NULL,
  `inv_cashier_id` int(11) NOT NULL,
  `inv_total` double NOT NULL,
  `inv_discount` double NOT NULL,
  `inv_tax` double NOT NULL,
  `inv_service` double NOT NULL,
  `inv_gtotal` double NOT NULL,
  `inv_status` int(11) NOT NULL,
  `inv_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `inv_dat` date NOT NULL,
  `inv_time` time NOT NULL,
  `inv_orderno` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`inv_id`),
  KEY `inv_cus_prof_id` (`inv_cus_prof_id`),
  KEY `inv_cus_user_id` (`inv_cus_user_id`),
  KEY `inv_cashier_id` (`inv_cashier_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=223 ;

-- --------------------------------------------------------

--
-- Table structure for table `invoices_items`
--

CREATE TABLE IF NOT EXISTS `invoices_items` (
  `inv_item_ai_id` int(11) NOT NULL AUTO_INCREMENT,
  `inv_id` int(11) NOT NULL,
  `inv_itm_id` int(11) NOT NULL,
  `inv_itm_unit_price` double NOT NULL,
  `inv_itm_qnty` int(11) NOT NULL,
  `inv_itm_sum` double NOT NULL,
  PRIMARY KEY (`inv_item_ai_id`),
  KEY `inv_id` (`inv_id`),
  KEY `inv_itm_id` (`inv_itm_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `items_ingradients`
--

CREATE TABLE IF NOT EXISTS `items_ingradients` (
  `item_ingradients_id` int(11) NOT NULL AUTO_INCREMENT,
  `itm_id` int(11) NOT NULL,
  `itm_ingrad_id` int(11) NOT NULL,
  `itm_ingrad_qnty` int(11) NOT NULL,
  `itm_ingrad_qnty_unit` int(11) NOT NULL,
  `itm_updt_date` date NOT NULL,
  `itm_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `itm_userid` int(11) NOT NULL,
  `itm_ingr_cost` float NOT NULL,
  PRIMARY KEY (`item_ingradients_id`),
  KEY `itm_id` (`itm_id`),
  KEY `itm_ingrad_id` (`itm_ingrad_id`),
  KEY `itm_ingrad_qnty_unit` (`itm_ingrad_qnty_unit`),
  KEY `itm_userid` (`itm_userid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=133 ;

--
-- Dumping data for table `items_ingradients`
--

INSERT INTO `items_ingradients` (`item_ingradients_id`, `itm_id`, `itm_ingrad_id`, `itm_ingrad_qnty`, `itm_ingrad_qnty_unit`, `itm_updt_date`, `itm_timestamp`, `itm_userid`, `itm_ingr_cost`) VALUES
(1, 48, 44, 1, 1, '0000-00-00', '2015-08-03 14:01:24', 1, 0),
(2, 49, 40, 13, 1, '0000-00-00', '2015-08-03 14:02:31', 1, 0),
(3, 50, 41, 22, 1, '0000-00-00', '2015-08-03 14:03:58', 1, 0),
(4, 51, 42, 20, 1, '0000-00-00', '2015-08-03 14:04:40', 1, 0),
(5, 52, 43, 1, 5, '0000-00-00', '2015-08-03 14:05:53', 1, 0),
(6, 53, 1, 1, 6, '0000-00-00', '2015-08-03 14:07:08', 1, 0),
(7, 53, 35, 26, 1, '0000-00-00', '2015-08-03 14:07:08', 1, 0),
(8, 54, 2, 1, 6, '0000-00-00', '2015-08-03 14:10:50', 1, 0),
(9, 54, 35, 26, 1, '0000-00-00', '2015-08-03 14:10:50', 1, 0),
(10, 55, 3, 1, 6, '0000-00-00', '2015-08-03 14:12:17', 1, 0),
(11, 55, 35, 26, 1, '0000-00-00', '2015-08-03 14:12:17', 1, 0),
(12, 56, 4, 1, 6, '0000-00-00', '2015-08-03 14:12:55', 1, 0),
(13, 56, 35, 26, 1, '0000-00-00', '2015-08-03 14:12:55', 1, 0),
(14, 57, 5, 1, 6, '0000-00-00', '2015-08-03 14:13:28', 1, 0),
(15, 57, 35, 26, 1, '0000-00-00', '2015-08-03 14:13:28', 1, 0),
(16, 58, 6, 1, 6, '0000-00-00', '2015-08-03 14:14:40', 1, 0),
(17, 58, 35, 26, 1, '0000-00-00', '2015-08-03 14:14:40', 1, 0),
(18, 59, 7, 7, 1, '0000-00-00', '2015-08-03 14:17:04', 1, 0),
(19, 59, 35, 16, 1, '0000-00-00', '2015-08-03 14:17:04', 1, 0),
(20, 60, 8, 7, 1, '0000-00-00', '2015-08-03 14:18:10', 1, 0),
(21, 60, 35, 16, 1, '0000-00-00', '2015-08-03 14:18:10', 1, 0),
(22, 61, 7, 3, 1, '0000-00-00', '2015-08-03 14:19:30', 1, 0),
(23, 61, 35, 16, 1, '0000-00-00', '2015-08-03 14:19:30', 1, 0),
(24, 61, 38, 125, 2, '0000-00-00', '2015-08-03 14:19:30', 1, 0),
(25, 62, 9, 10, 1, '0000-00-00', '2015-08-03 14:20:45', 1, 0),
(26, 62, 35, 16, 1, '0000-00-00', '2015-08-03 14:20:45', 1, 0),
(27, 63, 9, 20, 1, '0000-00-00', '2015-08-03 14:21:31', 1, 0),
(28, 63, 35, 16, 1, '0000-00-00', '2015-08-03 14:21:31', 1, 0),
(29, 64, 9, 20, 1, '0000-00-00', '2015-08-03 16:39:31', 1, 0),
(30, 64, 38, 250, 2, '0000-00-00', '2015-08-03 16:39:31', 1, 0),
(31, 64, 35, 26, 1, '0000-00-00', '2015-08-03 16:39:31', 1, 0),
(32, 65, 9, 10, 1, '0000-00-00', '2015-08-03 16:40:55', 1, 0),
(33, 65, 38, 250, 2, '0000-00-00', '2015-08-03 16:40:55', 1, 0),
(34, 65, 35, 26, 1, '0000-00-00', '2015-08-03 16:40:55', 1, 0),
(35, 66, 9, 10, 1, '0000-00-00', '2015-08-03 16:43:13', 1, 0),
(36, 66, 38, 200, 2, '0000-00-00', '2015-08-03 16:43:13', 1, 0),
(37, 66, 11, 10, 1, '0000-00-00', '2015-08-03 16:43:13', 1, 0),
(38, 66, 35, 26, 1, '0000-00-00', '2015-08-03 16:43:13', 1, 0),
(39, 67, 10, 10, 1, '0000-00-00', '2015-08-03 16:44:45', 1, 0),
(40, 67, 38, 200, 2, '0000-00-00', '2015-08-03 16:44:45', 1, 0),
(41, 67, 35, 26, 1, '0000-00-00', '2015-08-03 16:44:45', 1, 0),
(42, 68, 10, 20, 1, '0000-00-00', '2015-08-03 16:46:46', 1, 0),
(43, 68, 35, 26, 1, '0000-00-00', '2015-08-03 16:46:46', 1, 0),
(44, 69, 11, 20, 1, '0000-00-00', '2015-08-03 16:48:06', 1, 0),
(45, 69, 38, 250, 2, '0000-00-00', '2015-08-03 16:48:06', 1, 0),
(46, 69, 35, 26, 1, '0000-00-00', '2015-08-03 16:48:06', 1, 0),
(47, 70, 37, 250, 2, '0000-00-00', '2015-08-03 16:49:11', 1, 0),
(48, 70, 13, 25, 1, '0000-00-00', '2015-08-03 16:49:11', 1, 0),
(49, 70, 35, 26, 1, '0000-00-00', '2015-08-03 16:49:11', 1, 0),
(50, 71, 12, 3, 1, '0000-00-00', '2015-08-03 16:50:28', 1, 0),
(51, 71, 38, 250, 2, '0000-00-00', '2015-08-03 16:50:28', 1, 0),
(52, 71, 35, 26, 1, '0000-00-00', '2015-08-03 16:50:28', 1, 0),
(53, 72, 12, 5, 1, '0000-00-00', '2015-08-03 16:51:37', 1, 0),
(54, 72, 35, 26, 1, '0000-00-00', '2015-08-03 16:51:37', 1, 0),
(55, 73, 14, 5, 1, '0000-00-00', '2015-08-03 16:53:19', 1, 0),
(56, 73, 35, 26, 1, '0000-00-00', '2015-08-03 16:53:19', 1, 0),
(57, 74, 14, 3, 1, '0000-00-00', '2015-08-03 16:57:56', 1, 0),
(58, 74, 38, 250, 2, '0000-00-00', '2015-08-03 16:57:56', 1, 0),
(59, 74, 35, 26, 1, '0000-00-00', '2015-08-03 16:57:56', 1, 0),
(60, 75, 15, 10, 1, '0000-00-00', '2015-08-03 17:00:13', 1, 0),
(61, 75, 38, 250, 2, '0000-00-00', '2015-08-03 17:00:13', 1, 0),
(62, 75, 35, 26, 1, '0000-00-00', '2015-08-03 17:00:13', 1, 0),
(63, 75, 16, 25, 1, '0000-00-00', '2015-08-03 17:00:13', 1, 0),
(64, 75, 17, 10, 1, '0000-00-00', '2015-08-03 17:00:13', 1, 0),
(65, 75, 18, 25, 1, '0000-00-00', '2015-08-03 17:00:13', 1, 0),
(66, 76, 15, 10, 1, '0000-00-00', '2015-08-03 17:02:35', 1, 0),
(67, 76, 38, 200, 2, '0000-00-00', '2015-08-03 17:02:35', 1, 0),
(68, 76, 35, 26, 1, '0000-00-00', '2015-08-03 17:02:35', 1, 0),
(69, 76, 26, 10, 2, '0000-00-00', '2015-08-03 17:02:35', 1, 0),
(70, 76, 27, 10, 1, '0000-00-00', '2015-08-03 17:02:35', 1, 0),
(71, 76, 28, 10, 1, '0000-00-00', '2015-08-03 17:02:35', 1, 0),
(72, 76, 29, 10, 1, '0000-00-00', '2015-08-03 17:02:35', 1, 0),
(73, 76, 32, 1, 5, '0000-00-00', '2015-08-03 17:02:35', 1, 0),
(74, 76, 33, 1, 5, '0000-00-00', '2015-08-03 17:02:35', 1, 0),
(75, 77, 19, 33, 1, '0000-00-00', '2015-08-03 17:03:23', 1, 0),
(76, 77, 24, 10, 1, '0000-00-00', '2015-08-03 17:03:23', 1, 0),
(77, 78, 24, 20, 1, '0000-00-00', '2015-08-03 17:04:38', 1, 0),
(78, 78, 38, 50, 2, '0000-00-00', '2015-08-03 17:04:38', 1, 0),
(79, 78, 35, 40, 1, '0000-00-00', '2015-08-03 17:04:38', 1, 0),
(80, 79, 24, 20, 1, '0000-00-00', '2015-08-03 17:06:41', 1, 0),
(81, 79, 38, 50, 2, '0000-00-00', '2015-08-03 17:06:41', 1, 0),
(82, 79, 35, 40, 1, '0000-00-00', '2015-08-03 17:06:41', 1, 0),
(83, 80, 25, 600, 1, '0000-00-00', '2015-08-03 17:07:43', 1, 0),
(84, 80, 35, 20, 1, '0000-00-00', '2015-08-03 17:07:43', 1, 0),
(85, 81, 26, 300, 2, '0000-00-00', '2015-08-03 17:08:16', 1, 0),
(86, 82, 45, 300, 2, '0000-00-00', '2015-08-03 17:09:15', 1, 0),
(87, 82, 35, 40, 1, '0000-00-00', '2015-08-03 17:09:15', 1, 0),
(88, 83, 27, 330, 1, '0000-00-00', '2015-08-03 17:10:42', 1, 0),
(89, 83, 38, 125, 2, '0000-00-00', '2015-08-03 17:10:42', 1, 0),
(90, 83, 35, 40, 1, '0000-00-00', '2015-08-03 17:10:42', 1, 0),
(91, 84, 46, 250, 1, '0000-00-00', '2015-08-03 17:11:47', 1, 0),
(92, 84, 35, 24, 1, '0000-00-00', '2015-08-03 17:11:47', 1, 0),
(93, 85, 28, 250, 1, '0000-00-00', '2015-08-03 17:12:29', 1, 0),
(94, 85, 35, 40, 1, '0000-00-00', '2015-08-03 17:12:29', 1, 0),
(95, 86, 29, 250, 1, '0000-00-00', '2015-08-03 17:13:25', 1, 0),
(96, 86, 35, 24, 1, '0000-00-00', '2015-08-03 17:13:25', 1, 0),
(97, 87, 26, 125, 2, '0000-00-00', '2015-08-03 17:14:47', 1, 0),
(98, 87, 27, 83, 1, '0000-00-00', '2015-08-03 17:14:47', 1, 0),
(99, 87, 33, 1, 5, '0000-00-00', '2015-08-03 17:14:47', 1, 0),
(100, 87, 32, 1, 5, '0000-00-00', '2015-08-03 17:14:47', 1, 0),
(101, 87, 35, 24, 1, '0000-00-00', '2015-08-03 17:14:47', 1, 0),
(102, 88, 20, 1, 3, '0000-00-00', '2015-08-03 17:15:40', 1, 0),
(103, 88, 47, 45, 2, '0000-00-00', '2015-08-03 17:15:40', 1, 0),
(104, 89, 30, 2, 6, '0000-00-00', '2015-08-03 17:16:54', 1, 0),
(105, 89, 38, 200, 2, '0000-00-00', '2015-08-03 17:16:54', 1, 0),
(106, 89, 35, 10, 1, '0000-00-00', '2015-08-03 17:16:54', 1, 0),
(107, 89, 11, 10, 1, '0000-00-00', '2015-08-03 17:16:54', 1, 0),
(108, 90, 31, 125, 1, '0000-00-00', '2015-08-03 17:17:45', 1, 0),
(109, 90, 38, 150, 2, '0000-00-00', '2015-08-03 17:17:45', 1, 0),
(110, 90, 35, 26, 1, '0000-00-00', '2015-08-03 17:17:45', 1, 0),
(111, 91, 32, 1, 5, '0000-00-00', '2015-08-03 17:18:53', 1, 0),
(112, 91, 38, 200, 2, '0000-00-00', '2015-08-03 17:18:53', 1, 0),
(113, 91, 35, 32, 1, '0000-00-00', '2015-08-03 17:18:53', 1, 0),
(114, 92, 33, 3, 5, '0000-00-00', '2015-08-03 17:19:45', 1, 0),
(115, 92, 38, 200, 2, '0000-00-00', '2015-08-03 17:19:45', 1, 0),
(116, 92, 35, 32, 1, '0000-00-00', '2015-08-03 17:19:45', 1, 0),
(117, 93, 34, 1, 5, '0000-00-00', '2015-08-03 17:20:36', 1, 0),
(118, 93, 39, 30, 2, '0000-00-00', '2015-08-03 17:20:36', 1, 0),
(119, 93, 19, 150, 1, '0000-00-00', '2015-08-03 17:20:36', 1, 0),
(120, 94, 34, 1, 5, '0000-00-00', '2015-08-03 17:22:04', 1, 0),
(121, 94, 38, 100, 2, '0000-00-00', '2015-08-03 17:22:04', 1, 0),
(122, 94, 26, 35, 2, '0000-00-00', '2015-08-03 17:22:04', 1, 0),
(123, 94, 32, 1, 5, '0000-00-00', '2015-08-03 17:22:04', 1, 0),
(124, 94, 45, 30, 2, '0000-00-00', '2015-08-03 17:22:04', 1, 0),
(125, 94, 35, 24, 1, '0000-00-00', '2015-08-03 17:22:04', 1, 0),
(126, 95, 33, 1, 5, '0000-00-00', '2015-08-03 17:23:22', 1, 0),
(127, 95, 32, 1, 5, '0000-00-00', '2015-08-03 17:23:22', 1, 0),
(128, 95, 36, 100, 1, '0000-00-00', '2015-08-03 17:23:22', 1, 0),
(129, 95, 26, 100, 2, '0000-00-00', '2015-08-03 17:23:22', 1, 0),
(130, 95, 45, 30, 2, '0000-00-00', '2015-08-03 17:23:22', 1, 0),
(131, 96, 20, 1, 3, '0000-00-00', '2015-08-03 17:24:53', 1, 0),
(132, 97, 21, 1, 3, '0000-00-00', '2015-08-03 17:25:55', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `itms_sales`
--

CREATE TABLE IF NOT EXISTS `itms_sales` (
  `AI_id` int(11) NOT NULL AUTO_INCREMENT,
  `sitm_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `datetime` datetime NOT NULL,
  `qnty` int(11) NOT NULL,
  `itmname` text COLLATE utf8_unicode_ci NOT NULL,
  `cust_profid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `inv_id` int(11) NOT NULL,
  `orderid` int(11) NOT NULL,
  PRIMARY KEY (`AI_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='تسجيل مبيعات الاصناف' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_dattime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `order_dat` date NOT NULL,
  `order_time` time NOT NULL,
  `table_no` int(11) NOT NULL,
  `sub_orders_no` int(11) NOT NULL,
  `table_json` longtext NOT NULL,
  `userid` int(11) NOT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COMMENT='save orders' AUTO_INCREMENT=6 ;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `order_dattime`, `order_dat`, `order_time`, `table_no`, `sub_orders_no`, `table_json`, `userid`) VALUES
(1, '2015-08-03 14:49:56', '2015-08-03', '12:49:56', 1, 0, '{"tableno":1,"orderno":null,"invid":0,"fullinv_items":[],"cashiername":"محمد عادل خليفة","cashierid":1,"customer_profid":"16","custname":"عميل عام - غير منتظم","customer_userid":"2","dattime":"2015-8-3 12:49:56","dat":"2015-8-3","time":"12:49:56","total":0,"tax":0,"service":0,"discount":0,"gtotal":0,"paymentstatus":0,"paidvalue":0,"desc":"","remsubinvoice":[],"remvalue":0,"subinvoices_arr":[],"no_ofsubinvoices":0}', 1),
(2, '2015-08-03 15:31:43', '2015-08-03', '13:31:43', 1, 0, '{"tableno":1,"orderno":null,"invid":0,"fullinv_items":[],"cashiername":"محمد عادل خليفة","cashierid":1,"customer_profid":"16","custname":"عميل عام - غير منتظم","customer_userid":"2","dattime":"2015-8-3 13:31:43","dat":"2015-8-3","time":"13:31:43","total":0,"tax":0,"service":0,"discount":0,"gtotal":0,"paymentstatus":0,"paidvalue":0,"desc":"","remsubinvoice":[],"remvalue":0,"subinvoices_arr":[],"no_ofsubinvoices":0}', 1),
(3, '2015-08-03 20:27:59', '2015-08-03', '18:27:59', 1, 0, '{"tableno":1,"orderno":null,"invid":0,"fullinv_items":[],"cashiername":"محمد عادل خليفة","cashierid":1,"customer_profid":"16","custname":"عميل عام - غير منتظم","customer_userid":"2","dattime":"2015-8-3 18:27:59","dat":"2015-8-3","time":"18:27:59","total":0,"tax":0,"service":0,"discount":0,"gtotal":0,"paymentstatus":0,"paidvalue":0,"desc":"","remsubinvoice":[],"remvalue":0,"subinvoices_arr":[],"no_ofsubinvoices":0}', 1),
(4, '2015-08-03 20:29:06', '2015-08-03', '18:29:06', 1, 0, '{"tableno":1,"orderno":null,"invid":0,"fullinv_items":[],"cashiername":"محمد عادل خليفة","cashierid":1,"customer_profid":"16","custname":"عميل عام - غير منتظم","customer_userid":"2","dattime":"2015-8-3 18:29:6","dat":"2015-8-3","time":"18:29:6","total":0,"tax":0,"service":0,"discount":0,"gtotal":0,"paymentstatus":0,"paidvalue":0,"desc":"","remsubinvoice":[],"remvalue":0,"subinvoices_arr":[],"no_ofsubinvoices":0}', 1),
(5, '2015-08-03 20:29:39', '2015-08-03', '18:29:39', 1, 0, '{"tableno":1,"orderno":null,"invid":0,"fullinv_items":[],"cashiername":"محمد عادل خليفة","cashierid":1,"customer_profid":"16","custname":"عميل عام - غير منتظم","customer_userid":"2","dattime":"2015-8-3 18:29:39","dat":"2015-8-3","time":"18:29:39","total":0,"tax":0,"service":0,"discount":0,"gtotal":0,"paymentstatus":0,"paidvalue":0,"desc":"","remsubinvoice":[],"remvalue":0,"subinvoices_arr":[],"no_ofsubinvoices":0}', 1);

-- --------------------------------------------------------

--
-- Table structure for table `printed_inv_items`
--

CREATE TABLE IF NOT EXISTS `printed_inv_items` (
  `inv_item_ai_id` int(11) NOT NULL AUTO_INCREMENT,
  `inv_id` int(11) NOT NULL,
  `act_inv_id` int(11) NOT NULL,
  `inv_itm_id` int(11) NOT NULL,
  `inv_itm_unit_price` double NOT NULL,
  `inv_itm_qnty` int(11) NOT NULL,
  `inv_itm_sum` double NOT NULL,
  PRIMARY KEY (`inv_item_ai_id`),
  KEY `inv_id` (`inv_id`),
  KEY `inv_itm_id` (`inv_itm_id`),
  KEY `prnt_inv_row_id` (`act_inv_id`),
  KEY `prnt_inv_row_id_2` (`act_inv_id`),
  KEY `inv_id_2` (`inv_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `printed_invoices`
--

CREATE TABLE IF NOT EXISTS `printed_invoices` (
  `prnt_inv_id` int(11) NOT NULL AUTO_INCREMENT,
  `act_inv_id` int(11) NOT NULL,
  `inv_dattime` datetime NOT NULL,
  `inv_cus_prof_id` int(11) NOT NULL,
  `inv_cus_user_id` int(11) NOT NULL,
  `inv_cashier_id` int(11) NOT NULL,
  `inv_total` double NOT NULL,
  `inv_discount` double NOT NULL,
  `inv_tax` double NOT NULL,
  `inv_service` double NOT NULL,
  `inv_gtotal` double NOT NULL,
  `inv_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`prnt_inv_id`),
  KEY `inv_cus_prof_id` (`inv_cus_prof_id`),
  KEY `inv_cus_user_id` (`inv_cus_user_id`),
  KEY `inv_cashier_id` (`inv_cashier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `profile`
--

CREATE TABLE IF NOT EXISTS `profile` (
  `user_id` int(11) NOT NULL,
  `profileid` int(11) NOT NULL AUTO_INCREMENT,
  `fullname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobile` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobile2` varchar(25) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jobtitle` varchar(25) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` int(11) NOT NULL,
  `phone` varchar(25) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`profileid`),
  KEY `user_id` (`user_id`),
  KEY `type` (`type`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=27 ;

--
-- Dumping data for table `profile`
--

INSERT INTO `profile` (`user_id`, `profileid`, `fullname`, `mobile`, `mobile2`, `email`, `address`, `jobtitle`, `type`, `phone`, `notes`) VALUES
(1, 1, 'محمد عادل خليفة', '01114442161', '01114442161', 'mk@khalifaonline.com', '3 شارع نابلس المهندسين', 'مدير النظام', 1, '33829604', 'None'),
(3, 3, 'أحمد حشمت', '01223124523', '', 'aheshmata@gmail.com', '9 نابلس - المهندسين', 'مدير - شريك', 2, '', ''),
(2, 4, 'احمد عبد الستار', '01222118383', '', 'abdulsattar', '', 'ceo', 4, '', ''),
(1, 5, 'حمدي', '02121212121', '212112211', 'hamdi@moka.com', '5 dsfgsdfdsf shubra', 'cashier', 3, '', ''),
(2, 7, 'عمر عادل خليفة', '01065552055', '01065552055', 'omer@sahl-eg.com', '3 Nablus St., Mohandeseen, Giza', 'Sahl for programs chairma', 4, '', 'اخو م. محمد خليفة'),
(2, 14, 'خالد محمد حافظ', '0120120120', '', '', '', '', 4, '', ''),
(2, 15, 'مصطفى محمد نجم', '0102501555', '', '', '', '', 4, '', ''),
(2, 16, 'عميل عام - غير منتظم', '01111111111', '', '', '', '', 4, '', ''),
(3, 19, 'رامي احمد', '01475855555', NULL, NULL, NULL, NULL, 3, NULL, 'موظف بوفيه'),
(2, 20, 'هاني حقي', '01001439898', '', '', '', '', 4, '', ''),
(4, 21, 'مينا وليم', '01222203856', NULL, 'minaw@gmail.com', NULL, 'مدير - شريك', 2, NULL, NULL),
(6, 23, ' أسامة فوزي', '01002890890', '01158989355', 'osamaf@gmail.com', NULL, NULL, 2, NULL, NULL),
(2, 24, 'Mourad Mom مراد', '01000000000', '', '', '', '', 4, '', ''),
(2, 25, 'Yehia Atia يحي عطية', '01222443495', '', '', '', '', 4, '', ''),
(7, 26, 'انس عادل خليفة', '01004455306', '01004455306', 'kcgegypt1984@gmail.com', '3 شارع نابلس المهندسين', 'مدير نظام', 1, '33829604', 'None');

-- --------------------------------------------------------

--
-- Table structure for table `profile_types`
--

CREATE TABLE IF NOT EXISTS `profile_types` (
  `profile_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `profile_type_name` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_type_desc` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`profile_type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=6 ;

--
-- Dumping data for table `profile_types`
--

INSERT INTO `profile_types` (`profile_type_id`, `profile_type_name`, `profile_type_desc`) VALUES
(1, 'systemuser', 'مدير نظام متحكم'),
(2, 'owner', 'مالك او شريك'),
(3, 'staffmember', 'موظفين / عاملين'),
(4, 'عميل', 'عميل او زائر للمكان'),
(5, 'system_item', 'عنصر وهمي يستخدم بواسطة النظام -مثل الخزينة - حساب');

-- --------------------------------------------------------

--
-- Table structure for table `st_item_mov`
--

CREATE TABLE IF NOT EXISTS `st_item_mov` (
  `st_itm_mov_id` int(11) NOT NULL AUTO_INCREMENT,
  `st_itm_mov_typ` int(11) NOT NULL,
  `st_itm_mov_usrid` int(11) NOT NULL,
  `st_itm_mov_itmid` int(11) NOT NULL,
  `st_itm_mov_cur_stid` int(11) NOT NULL,
  `st_itm_mov_qnty` int(11) NOT NULL,
  `st_itm_mov_qnty_unit` int(11) NOT NULL,
  `st_itm_mov_dat` date NOT NULL,
  `st_itm_mov_timstmp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `st_itm_mov_notes` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `st_itm_mov_to_st` int(11) NOT NULL,
  `st_itm_mov_st_itm_mov_price` int(11) NOT NULL,
  `st_itm_mov_buyerid` int(11) NOT NULL,
  `st_itm_mov_profid` int(11) NOT NULL,
  `st_itm_mov_itm_typ` int(11) NOT NULL,
  PRIMARY KEY (`st_itm_mov_id`),
  KEY `st_itm_mov_typ` (`st_itm_mov_typ`),
  KEY `st_itm_mov_usrid` (`st_itm_mov_usrid`),
  KEY `st_itm_mov_itmid` (`st_itm_mov_itmid`),
  KEY `st_itm_mov_cur_stid` (`st_itm_mov_cur_stid`),
  KEY `st_itm_mov_qnty_unit` (`st_itm_mov_qnty_unit`),
  KEY `st_itm_mov_to_st` (`st_itm_mov_to_st`),
  KEY `st_itm_mov_buyerid` (`st_itm_mov_buyerid`),
  KEY `st_itm_mov_profid` (`st_itm_mov_profid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=98 ;

--
-- Dumping data for table `st_item_mov`
--

INSERT INTO `st_item_mov` (`st_itm_mov_id`, `st_itm_mov_typ`, `st_itm_mov_usrid`, `st_itm_mov_itmid`, `st_itm_mov_cur_stid`, `st_itm_mov_qnty`, `st_itm_mov_qnty_unit`, `st_itm_mov_dat`, `st_itm_mov_timstmp`, `st_itm_mov_notes`, `st_itm_mov_to_st`, `st_itm_mov_st_itm_mov_price`, `st_itm_mov_buyerid`, `st_itm_mov_profid`, `st_itm_mov_itm_typ`) VALUES
(1, 2, 1, 1, 2, 500, 6, '2015-08-03', '2015-08-03 09:34:59', 'شراء رصيد مخزن من شاي باكيت بكمية 500 باكيت-pak بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(2, 2, 1, 2, 2, 500, 6, '2015-08-03', '2015-08-03 09:35:27', 'شراء رصيد مخزن من شاي اخضر باكيت بكمية 500 باكيت-pak بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(3, 2, 1, 3, 2, 500, 6, '2015-08-03', '2015-08-03 09:35:52', 'شراء رصيد مخزن من شاي فواكه باكيت بكمية 500 باكيت-pak بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(4, 2, 1, 4, 2, 500, 6, '2015-08-03', '2015-08-03 09:36:17', 'شراء رصيد مخزن من ينسون باكيت بكمية 500 باكيت-pak بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(5, 2, 1, 5, 2, 500, 6, '2015-08-03', '2015-08-03 09:36:41', 'شراء رصيد مخزن من نعناع باكيت بكمية 500 باكيت-pak بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(6, 2, 1, 6, 2, 500, 6, '2015-08-03', '2015-08-03 09:36:59', 'شراء رصيد مخزن من كركاديه باكيت بكمية 500 باكيت-pak بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(7, 2, 1, 7, 2, 10000, 1, '2015-08-03', '2015-08-03 09:37:29', 'شراء رصيد مخزن من بن سادة بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(8, 2, 1, 8, 2, 10000, 1, '2015-08-03', '2015-08-03 09:37:51', 'شراء رصيد مخزن من بن محوج بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(9, 2, 1, 9, 2, 10000, 1, '2015-08-03', '2015-08-03 09:38:16', 'شراء رصيد مخزن من قهوه اكيبريسو سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(10, 2, 1, 10, 2, 10000, 1, '2015-08-03', '2015-08-03 09:38:36', 'شراء رصيد مخزن من نسكافيه سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(11, 2, 1, 11, 2, 10000, 1, '2015-08-03', '2015-08-03 09:38:59', 'شراء رصيد مخزن من كاكاو نسكويك سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(12, 2, 1, 12, 2, 10000, 1, '2015-08-03', '2015-08-03 09:39:22', 'شراء رصيد مخزن من قرفة سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(13, 2, 1, 13, 2, 10000, 1, '2015-08-03', '2015-08-03 09:40:05', 'شراء رصيد مخزن من قرفة عيدان بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(14, 2, 1, 14, 2, 10000, 1, '2015-08-03', '2015-08-03 09:40:33', 'شراء رصيد مخزن من جنزبيل سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(15, 2, 1, 15, 2, 10000, 1, '2015-08-03', '2015-08-03 09:40:52', 'شراء رصيد مخزن من سحلب سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(16, 2, 1, 16, 2, 10000, 1, '2015-08-03', '2015-08-03 09:41:16', 'شراء رصيد مخزن من مكسرات زبيب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(17, 2, 1, 17, 2, 10000, 1, '2015-08-03', '2015-08-03 09:41:41', 'شراء رصيد مخزن من مكسرات جوز هند بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(18, 2, 1, 18, 2, 10000, 1, '2015-08-03', '2015-08-03 09:42:03', 'شراء رصيد مخزن من مكسرات سوداني بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(19, 2, 1, 19, 2, 10000, 1, '2015-08-03', '2015-08-03 09:42:24', 'شراء رصيد مخزن من حمص سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(20, 2, 1, 20, 2, 500, 3, '2015-08-03', '2015-08-03 09:42:52', 'شراء رصيد مخزن من كانز - بيبسي-سفن-مير بكمية 500 كانز-cans بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(21, 2, 1, 21, 2, 500, 3, '2015-08-03', '2015-08-03 09:43:19', 'شراء رصيد مخزن من جولد كانز بكمية 500 كانز-cans بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(22, 2, 1, 22, 2, 500, 3, '2015-08-03', '2015-08-03 09:43:36', 'شراء رصيد مخزن من ريدبول بكمية 500 كانز-cans بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(23, 2, 1, 23, 2, 500, 4, '2015-08-03', '2015-08-03 09:44:00', 'شراء رصيد مخزن من مياه معدنية ص بكمية 500 زجاجة بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(24, 2, 1, 24, 2, 10000, 1, '2015-08-03', '2015-08-03 09:44:20', 'شراء رصيد مخزن من ليمون سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(25, 2, 1, 25, 2, 10000, 1, '2015-08-03', '2015-08-03 09:44:41', 'شراء رصيد مخزن من برتقال سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(26, 2, 1, 26, 2, 10000, 2, '2015-08-03', '2015-08-03 09:45:15', 'شراء رصيد مخزن من مانجو عصير بكمية 10000 مللي لتر بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(27, 2, 1, 27, 2, 10000, 1, '2015-08-03', '2015-08-03 09:45:42', 'شراء رصيد مخزن من جوافه سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(28, 2, 1, 28, 2, 10000, 1, '2015-08-03', '2015-08-03 09:46:09', 'شراء رصيد مخزن من خوخ سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(29, 2, 1, 29, 2, 10000, 1, '2015-08-03', '2015-08-03 09:46:28', 'شراء رصيد مخزن من كانتلوب سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(30, 2, 1, 30, 2, 500, 6, '2015-08-03', '2015-08-03 09:47:33', 'شراء رصيد مخزن من اويو باكيت بكمية 500 باكيت-pak بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(31, 2, 1, 31, 2, 10000, 1, '2015-08-03', '2015-08-03 09:47:57', 'شراء رصيد مخزن من بلح سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(32, 2, 1, 32, 2, 500, 5, '2015-08-03', '2015-08-03 09:48:51', 'شراء رصيد مخزن من موز سايب -قطعة بكمية 500 قطعة بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(33, 2, 1, 33, 2, 500, 5, '2015-08-03', '2015-08-03 09:50:04', 'شراء رصيد مخزن من كيوي سايب قطعة بكمية 500 قطعة بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(34, 2, 1, 34, 2, 500, 5, '2015-08-03', '2015-08-03 09:50:47', 'شراء رصيد مخزن من زبادي علبة بكمية 500 قطعة بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(35, 2, 1, 35, 2, 20000, 1, '2015-08-03', '2015-08-03 09:52:04', 'شراء رصيد مخزن من سكر ابيض بكمية 20000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(36, 2, 1, 36, 2, 10000, 1, '2015-08-03', '2015-08-03 09:52:25', 'شراء رصيد مخزن من تفاح سايب  بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(37, 2, 1, 37, 2, 10000, 2, '2015-08-03', '2015-08-03 09:52:54', 'شراء رصيد مخزن من تفاح عصير بكمية 10000 مللي لتر بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(38, 2, 1, 38, 2, 20000, 2, '2015-08-03', '2015-08-03 09:53:48', 'شراء رصيد مخزن من حليب سايب بكمية 20000 مللي لتر بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(39, 2, 1, 39, 2, 10000, 2, '2015-08-03', '2015-08-03 09:54:19', 'شراء رصيد مخزن من عسل سايب بكمية 10000 مللي لتر بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(40, 2, 1, 40, 2, 10000, 1, '2015-08-03', '2015-08-03 09:55:03', 'شراء رصيد مخزن من معسل فواكه فاخر بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(41, 2, 1, 41, 2, 10000, 1, '2015-08-03', '2015-08-03 09:55:24', 'شراء رصيد مخزن من معسل فواكه عاده بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(42, 2, 1, 42, 2, 10000, 1, '2015-08-03', '2015-08-03 09:55:55', 'شراء رصيد مخزن من معسل عاده بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(43, 2, 1, 43, 2, 500, 5, '2015-08-03', '2015-08-03 09:56:35', 'شراء رصيد مخزن من لاي طبي بكمية 500 قطعة بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(44, 2, 1, 44, 2, 20000, 1, '2015-08-03', '2015-08-03 09:57:35', 'شراء رصيد مخزن من اضافات (فليفور) بكمية 20000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(45, 2, 1, 45, 2, 10000, 2, '2015-08-03', '2015-08-03 09:58:05', 'شراء رصيد مخزن من فراولة عصير بكمية 10000 مللي لتر بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(46, 2, 1, 46, 2, 10000, 1, '2015-08-03', '2015-08-03 09:58:49', 'شراء رصيد مخزن من بطيخ سايب بكمية 10000 جرام بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(47, 2, 1, 47, 2, 10000, 2, '2015-08-03', '2015-08-03 09:59:22', 'شراء رصيد مخزن من شربات عصير رمان-نعنا بكمية 10000 مللي لتر بسعر 0 جنيه تم الشراء بواسطة الخزينة الى مخزن البوفيه', 2, 0, 0, 0, 2),
(48, 6, 1, 48, 5, 1, 7, '2015-08-03', '2015-08-03 14:01:23', 'اضافة صنف بيع - مينيو  اضافات (فليفور) نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة أخرى بسعر بيع 2.5 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 3, 1, 1, 4),
(49, 6, 1, 49, 5, 1, 7, '2015-08-03', '2015-08-03 14:02:30', 'اضافة صنف بيع - مينيو  معسل فواكه فاخر نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة شيشة بسعر بيع 13 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 13, 1, 1, 4),
(50, 6, 1, 50, 5, 1, 7, '2015-08-03', '2015-08-03 14:03:57', 'اضافة صنف بيع - مينيو  معسل فواكه عاده نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة شيشة بسعر بيع 7 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 7, 1, 1, 4),
(51, 6, 1, 51, 5, 1, 7, '2015-08-03', '2015-08-03 14:04:39', 'اضافة صنف بيع - مينيو  معسل عاده نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة شيشة بسعر بيع 2.5 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 3, 1, 1, 4),
(52, 6, 1, 52, 5, 1, 7, '2015-08-03', '2015-08-03 14:05:52', 'اضافة صنف بيع - مينيو  لاي طبي نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة أخرى بسعر بيع 3 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 3, 1, 1, 4),
(53, 6, 1, 53, 5, 1, 7, '2015-08-03', '2015-08-03 14:07:07', 'اضافة صنف بيع - مينيو  شاي فتلة نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات ساخنة بسعر بيع 3.5 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 4, 1, 1, 4),
(54, 6, 1, 54, 5, 1, 7, '2015-08-03', '2015-08-03 14:10:48', 'اضافة صنف بيع - مينيو  شاي اخضر نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات ساخنة بسعر بيع 6.5 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 7, 1, 1, 4),
(55, 6, 1, 55, 5, 1, 7, '2015-08-03', '2015-08-03 14:12:16', 'اضافة صنف بيع - مينيو  شاي فواكه نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات ساخنة بسعر بيع 6.5 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 7, 1, 1, 4),
(56, 6, 1, 56, 5, 1, 7, '2015-08-03', '2015-08-03 14:12:53', 'اضافة صنف بيع - مينيو  ينسون نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات ساخنة بسعر بيع 6 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 6, 1, 1, 4),
(57, 6, 1, 57, 5, 1, 7, '2015-08-03', '2015-08-03 14:13:28', 'اضافة صنف بيع - مينيو  كوب نعناع نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات ساخنة بسعر بيع 6 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 6, 1, 1, 4),
(58, 6, 1, 58, 5, 1, 7, '2015-08-03', '2015-08-03 14:14:40', 'اضافة صنف بيع - مينيو  كاركاديه نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات ساخنة بسعر بيع 6 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 6, 1, 1, 4),
(59, 6, 1, 59, 5, 1, 7, '2015-08-03', '2015-08-03 14:17:03', 'اضافة صنف بيع - مينيو  قهوة تركى عاده نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات ساخنة بسعر بيع 7 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 7, 1, 1, 4),
(60, 6, 1, 60, 5, 1, 7, '2015-08-03', '2015-08-03 14:18:09', 'اضافة صنف بيع - مينيو  قهوة تركى محوج نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات ساخنة بسعر بيع 8 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 8, 1, 1, 4),
(61, 6, 1, 61, 5, 1, 7, '2015-08-03', '2015-08-03 14:19:28', 'اضافة صنف بيع - مينيو  قهوة فرنساوي نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات ساخنة بسعر بيع 8 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 8, 1, 1, 4),
(62, 6, 1, 62, 5, 1, 7, '2015-08-03', '2015-08-03 14:20:44', 'اضافة صنف بيع - مينيو  قهوة اكسبريسو نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات ساخنة بسعر بيع 10 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 10, 1, 1, 4),
(63, 6, 1, 63, 5, 1, 7, '2015-08-03', '2015-08-03 14:21:30', 'اضافة صنف بيع - مينيو  كوب قهوة اكسبريسو دب نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات ساخنة بسعر بيع 13 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 13, 1, 1, 4),
(64, 6, 1, 64, 5, 1, 7, '2015-08-03', '2015-08-03 16:39:30', 'اضافة صنف بيع - مينيو  كابيتشينو نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات ساخنة بسعر بيع 15 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 15, 1, 1, 4),
(65, 6, 1, 65, 5, 1, 7, '2015-08-03', '2015-08-03 16:40:54', 'اضافة صنف بيع - مينيو  لاتيه نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات ساخنة بسعر بيع 15 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 15, 1, 1, 4),
(66, 6, 1, 66, 5, 1, 7, '2015-08-03', '2015-08-03 16:43:12', 'اضافة صنف بيع - مينيو  كوب موكا نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات ساخنة بسعر بيع 15 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 15, 1, 1, 4),
(67, 6, 1, 67, 5, 1, 7, '2015-08-03', '2015-08-03 16:44:44', 'اضافة صنف بيع - مينيو  نسكافيه بالبن نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات ساخنة بسعر بيع 10 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 10, 1, 1, 4),
(68, 6, 1, 68, 5, 1, 7, '2015-08-03', '2015-08-03 16:46:45', 'اضافة صنف بيع - مينيو  نسكافيه سادة نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات ساخنة بسعر بيع 7 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 7, 1, 1, 4),
(69, 6, 1, 69, 5, 1, 7, '2015-08-03', '2015-08-03 16:48:04', 'اضافة صنف بيع - مينيو  هوت شوكليت نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات ساخنة بسعر بيع 15 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 15, 1, 1, 4),
(70, 6, 1, 70, 5, 1, 7, '2015-08-03', '2015-08-03 16:49:11', 'اضافة صنف بيع - مينيو  هوت سيدر نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات ساخنة بسعر بيع 12 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 12, 1, 1, 4),
(71, 6, 1, 71, 5, 1, 7, '2015-08-03', '2015-08-03 16:50:27', 'اضافة صنف بيع - مينيو  قرفة باللبن نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات ساخنة بسعر بيع 10 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 10, 1, 1, 4),
(72, 6, 1, 72, 5, 1, 7, '2015-08-03', '2015-08-03 16:51:36', 'اضافة صنف بيع - مينيو  قرفة سادة نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات ساخنة بسعر بيع 7 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 7, 1, 1, 4),
(73, 6, 1, 73, 5, 1, 7, '2015-08-03', '2015-08-03 16:53:18', 'اضافة صنف بيع - مينيو  جنزبيل سادة نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات ساخنة بسعر بيع 7 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 7, 1, 1, 4),
(74, 6, 1, 74, 5, 1, 7, '2015-08-03', '2015-08-03 16:57:55', 'اضافة صنف بيع - مينيو  جنزبيل بحليب نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات ساخنة بسعر بيع 10 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 10, 1, 1, 4),
(75, 6, 1, 75, 5, 1, 7, '2015-08-03', '2015-08-03 17:00:12', 'اضافة صنف بيع - مينيو  سحلب مكسرات نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات ساخنة بسعر بيع 14 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 14, 1, 1, 4),
(76, 6, 1, 76, 5, 1, 7, '2015-08-03', '2015-08-03 17:02:34', 'اضافة صنف بيع - مينيو  سحلب فواكه نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات ساخنة بسعر بيع 14 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 14, 1, 1, 4),
(77, 6, 1, 77, 5, 1, 7, '2015-08-03', '2015-08-03 17:03:22', 'اضافة صنف بيع - مينيو  حمص الشام نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات ساخنة بسعر بيع 9 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 9, 1, 1, 4),
(78, 6, 1, 78, 5, 1, 7, '2015-08-03', '2015-08-03 17:04:37', 'اضافة صنف بيع - مينيو  عصير ليمون فريش نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات باردة بسعر بيع 8 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 8, 1, 1, 4),
(79, 6, 1, 79, 5, 1, 7, '2015-08-03', '2015-08-03 17:06:40', 'اضافة صنف بيع - مينيو  ليمون نعناع فريش نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات باردة بسعر بيع 8 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 8, 1, 1, 4),
(80, 6, 1, 80, 5, 1, 7, '2015-08-03', '2015-08-03 17:07:42', 'اضافة صنف بيع - مينيو  برتقال فريش نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات باردة بسعر بيع 10 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 10, 1, 1, 4),
(81, 6, 1, 81, 5, 1, 7, '2015-08-03', '2015-08-03 17:08:15', 'اضافة صنف بيع - مينيو  مانجو فريش نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات باردة بسعر بيع 12 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 12, 1, 1, 4),
(82, 6, 1, 82, 5, 1, 7, '2015-08-03', '2015-08-03 17:09:14', 'اضافة صنف بيع - مينيو  فراولة فريش نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات باردة بسعر بيع 12 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 12, 1, 1, 4),
(83, 6, 1, 83, 5, 1, 7, '2015-08-03', '2015-08-03 17:10:42', 'اضافة صنف بيع - مينيو  جوافة فريش نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات باردة بسعر بيع 10 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 10, 1, 1, 4),
(84, 6, 1, 84, 5, 1, 7, '2015-08-03', '2015-08-03 17:11:47', 'اضافة صنف بيع - مينيو  بطيخ فريش نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات باردة بسعر بيع 12 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 12, 1, 1, 4),
(85, 6, 1, 85, 5, 1, 7, '2015-08-03', '2015-08-03 17:12:29', 'اضافة صنف بيع - مينيو  خوخ فريش نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات باردة بسعر بيع 12 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 12, 1, 1, 4),
(86, 6, 1, 86, 5, 1, 7, '2015-08-03', '2015-08-03 17:13:24', 'اضافة صنف بيع - مينيو  كانتلوب فريش نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات باردة بسعر بيع 12 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 12, 1, 1, 4),
(87, 6, 1, 87, 5, 1, 7, '2015-08-03', '2015-08-03 17:14:46', 'اضافة صنف بيع - مينيو  موكا كوكتيل نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات باردة بسعر بيع 20 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 20, 1, 1, 4),
(88, 6, 1, 88, 5, 1, 7, '2015-08-03', '2015-08-03 17:15:40', 'اضافة صنف بيع - مينيو  صن شاين نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات باردة بسعر بيع 10 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 10, 1, 1, 4),
(89, 6, 1, 89, 5, 1, 7, '2015-08-03', '2015-08-03 17:16:53', 'اضافة صنف بيع - مينيو  أوريو تشيك نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات باردة بسعر بيع 15 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 15, 1, 1, 4),
(90, 6, 1, 90, 5, 1, 7, '2015-08-03', '2015-08-03 17:17:44', 'اضافة صنف بيع - مينيو  بلح باللبن نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات باردة بسعر بيع 15 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 15, 1, 1, 4),
(91, 6, 1, 91, 5, 1, 7, '2015-08-03', '2015-08-03 17:18:52', 'اضافة صنف بيع - مينيو  موز باللبن نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات باردة بسعر بيع 12 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 12, 1, 1, 4),
(92, 6, 1, 92, 5, 1, 7, '2015-08-03', '2015-08-03 17:19:44', 'اضافة صنف بيع - مينيو  كيوي باللبن نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات باردة بسعر بيع 15 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 15, 1, 1, 4),
(93, 6, 1, 93, 5, 1, 7, '2015-08-03', '2015-08-03 17:20:35', 'اضافة صنف بيع - مينيو  زبادي بالعسل نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات باردة بسعر بيع 12 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 12, 1, 1, 4),
(94, 6, 1, 94, 5, 1, 7, '2015-08-03', '2015-08-03 17:22:03', 'اضافة صنف بيع - مينيو  زبادي فواكه نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات باردة بسعر بيع 12 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 12, 1, 1, 4),
(95, 6, 1, 95, 5, 1, 7, '2015-08-03', '2015-08-03 17:23:22', 'اضافة صنف بيع - مينيو  فروت سلات نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات باردة بسعر بيع 17 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 17, 1, 1, 4),
(96, 6, 1, 96, 5, 1, 7, '2015-08-03', '2015-08-03 17:24:52', 'اضافة صنف بيع - مينيو  بيبسي-ميرندا-سفن نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات باردة بسعر بيع 5.5 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 6, 1, 1, 4),
(97, 6, 1, 97, 5, 1, 7, '2015-08-03', '2015-08-03 17:25:54', 'اضافة صنف بيع - مينيو  كانز جولد نوع الصنف - صنف نحضر للبيع كود وحدة الصنف 7 تحت مجموعة مشروبات باردة بسعر بيع 7 جنيه - كود المستخدم مدخل الصنف  1 الى مخزن 5', 5, 7, 1, 1, 4);

-- --------------------------------------------------------

--
-- Table structure for table `st_item_mov_types`
--

CREATE TABLE IF NOT EXISTS `st_item_mov_types` (
  `st_itm_mov_typ_id` int(11) NOT NULL AUTO_INCREMENT,
  `st_itm_mov_typ_name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `st_itm_mov_typ_desc` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`st_itm_mov_typ_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=9 ;

--
-- Dumping data for table `st_item_mov_types`
--

INSERT INTO `st_item_mov_types` (`st_itm_mov_typ_id`, `st_itm_mov_typ_name`, `st_itm_mov_typ_desc`) VALUES
(1, 'بيع', 'عملية بيع للمنتج الخام الجاهز أو تقليل رصيد خامات نتيجة بيع منتج مجهز'),
(2, 'شراء', 'نتيجة شراء واضافة اصناف للمخزن'),
(3, 'نقل لمخزن', 'عملية نقل اصناف بين المخازن'),
(4, 'تلف', 'عملية تلف صنف تؤدي الى خصم من رصيد الصنف في المخزن'),
(5, 'مرتجع', 'عملية ارجاع اصناف للمخزن تزيد من الرصيد - لا يمكن ارجاع اصنافتم تحضيرها'),
(6, 'اضافة صنف محضر للحرك', 'اضافة صنف محضر لحركة المخازن لغرض تسجيل الحركة فقط'),
(7, 'تصحيح جرد اضافة رصيد', 'تصحيح جرد فعلي للصنف بالاضافة الى الرصيد'),
(8, 'تصحيح جرد خصم رصيد', 'تصحيح جرد فعلي للصنف بالحذف او الخصم من الرصيد');

-- --------------------------------------------------------

--
-- Table structure for table `st_item_qnty_unit`
--

CREATE TABLE IF NOT EXISTS `st_item_qnty_unit` (
  `st_itm_qnty_unit_id` int(11) NOT NULL AUTO_INCREMENT,
  `st_itm_qnty_unit_name` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `st_itm_qnty_unit_desc` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`st_itm_qnty_unit_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=8 ;

--
-- Dumping data for table `st_item_qnty_unit`
--

INSERT INTO `st_item_qnty_unit` (`st_itm_qnty_unit_id`, `st_itm_qnty_unit_name`, `st_itm_qnty_unit_desc`) VALUES
(1, 'جرام', 'كيلوجرام = 1000 جرام'),
(2, 'مللي لتر', 'اللتر = 1000 مللي لتر'),
(3, 'كانز-cans', 'علبة كانز'),
(4, 'زجاجة', 'زجاجة مثل الماء'),
(5, 'قطعة', ''),
(6, 'باكيت-pak', 'باكيت - مثل شاي فتله'),
(7, 'وحدة للبيع', 'جميع اصناف البيع تستخدم هذا الاختيار، مثل فنجان او كوب قهوة ، حجر معسل ، وتعريف هذه الوحدة هو تعريف مكونات صنف البيع');

-- --------------------------------------------------------

--
-- Table structure for table `st_items_balance`
--

CREATE TABLE IF NOT EXISTS `st_items_balance` (
  `st_items_balance_id` int(11) NOT NULL AUTO_INCREMENT,
  `itm_id` int(11) NOT NULL,
  `st_id` int(11) NOT NULL,
  `calc_balance` int(11) NOT NULL,
  `calc_balance_datetime` datetime NOT NULL,
  `act_balance` int(11) NOT NULL,
  `act_balance_datetime` datetime NOT NULL,
  `itm_qnty_unit` int(11) NOT NULL,
  `calc_act_bal_dif` int(11) NOT NULL,
  `st_items_balance_notes` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `balance_dat` date NOT NULL,
  `bal_type` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`st_items_balance_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `st_items_types`
--

CREATE TABLE IF NOT EXISTS `st_items_types` (
  `st_itm_id` int(11) NOT NULL AUTO_INCREMENT,
  `st_itm_typ_nam` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `st_itm_typ_desc` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`st_itm_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=5 ;

--
-- Dumping data for table `st_items_types`
--

INSERT INTO `st_items_types` (`st_itm_id`, `st_itm_typ_nam`, `st_itm_typ_desc`) VALUES
(1, 'اصول', 'يتم تسيجل اي صنف ينتمي للأصول بهذا النوع من انواع الأصناف'),
(2, 'خامات تحضير', 'يتم تسيجل اي صنف خام يستخدم في تحضير اصناف للبيع ولا يمكن بيعه كما هو'),
(3, 'خامات جاهزة للبيع', 'يتم تسيجل اي صنف من اصناف الخامات الجاهزة التي يمكن بيعها مباشرة دون اي اضافات بهذا النوع من انواع الأصناف'),
(4, 'صنف محضر للبيع', 'هو الصنف الجاهز للبيع بعد ان تم تحضيره من مجموعة من الأصناف الخام في البوفيه\nوهو صنف يظهر في شاشة الكاشير');

-- --------------------------------------------------------

--
-- Table structure for table `st_names`
--

CREATE TABLE IF NOT EXISTS `st_names` (
  `st_id` int(11) NOT NULL AUTO_INCREMENT,
  `st_name` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `st_desc` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`st_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=6 ;

--
-- Dumping data for table `st_names`
--

INSERT INTO `st_names` (`st_id`, `st_name`, `st_desc`) VALUES
(1, 'المخزن الرئيسي', 'المخزن الرئيسي'),
(2, 'مخزن البوفيه', 'مخزن البوفيه الذي يتم تحضير الطلبات منه ويتم عليه اغلب الحركات'),
(3, 'الصالة والحمامات', 'وتحتوي الاصناف الاستهلاكية مثل الصابون وغيره'),
(4, 'مخزن الأصول', 'مخزن الأصول وفيه جرد جميع الأصناف من الاصول الخاصة بالمكان'),
(5, 'مخزن وهمي اصناف بيع', 'مخزن وهمي للاصناف المحضرة للبيع');

-- --------------------------------------------------------

--
-- Table structure for table `st_sales_itm_gropus`
--

CREATE TABLE IF NOT EXISTS `st_sales_itm_gropus` (
  `group_id` int(11) NOT NULL AUTO_INCREMENT,
  `group_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `group_desc` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`group_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=6 ;

--
-- Dumping data for table `st_sales_itm_gropus`
--

INSERT INTO `st_sales_itm_gropus` (`group_id`, `group_name`, `group_desc`) VALUES
(1, 'مشروبات باردة', 'المشروبات الباردة والعصائر'),
(2, 'مشروبات ساخنة', 'المشروبات الساخنة'),
(3, 'شيشة', 'الشيشة بانواعها والمعسل بانواعه'),
(4, 'أخرى', 'اي اصناف اخرى لم يتم ذكرها في المجموعات السابقة'),
(5, 'مأكولات', 'جميع اصناف المأكولات ');

-- --------------------------------------------------------

--
-- Table structure for table `stock_items`
--

CREATE TABLE IF NOT EXISTS `stock_items` (
  `itm_id` int(11) NOT NULL AUTO_INCREMENT,
  `itm_shortname` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `itm_longname` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `itm_type` int(11) NOT NULL,
  `itm_data` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `itm_sell_price` float NOT NULL,
  `itm_reg_date` date NOT NULL,
  `itm_userid` int(11) NOT NULL,
  `itm_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `itm_qnty_unit` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `itm_limit` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`itm_id`),
  KEY `itm_type` (`itm_type`),
  KEY `itm_userid` (`itm_userid`),
  KEY `itm_qnty_unit` (`itm_qnty_unit`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=98 ;

--
-- Dumping data for table `stock_items`
--

INSERT INTO `stock_items` (`itm_id`, `itm_shortname`, `itm_longname`, `itm_type`, `itm_data`, `itm_sell_price`, `itm_reg_date`, `itm_userid`, `itm_timestamp`, `itm_qnty_unit`, `group_id`, `itm_limit`) VALUES
(1, 'شاي باكيت', 'شاي باكيت', 2, 'شاي باكيت', 0, '2015-08-03', 1, '2015-08-03 09:34:59', 6, 0, 50),
(2, 'شاي اخضر باكيت', 'شاي اخضر باكيت', 2, 'شاي اخضر باكيت', 0, '2015-08-03', 1, '2015-08-03 09:35:27', 6, 0, 50),
(3, 'شاي فواكه باكيت', 'شاي فواكه باكيت', 2, 'شاي فواكه باكيت', 0, '2015-08-03', 1, '2015-08-03 09:35:52', 6, 0, 50),
(4, 'ينسون باكيت', 'ينسون باكيت', 2, 'ينسون باكيت', 0, '2015-08-03', 1, '2015-08-03 09:36:17', 6, 0, 50),
(5, 'نعناع باكيت', 'نعناع باكيت', 2, 'نعناع باكيت', 0, '2015-08-03', 1, '2015-08-03 09:36:41', 6, 0, 50),
(6, 'كركاديه باكيت', 'كركاديه باكيت', 2, 'كركاديه باكيت', 0, '2015-08-03', 1, '2015-08-03 09:36:59', 6, 0, 50),
(7, 'بن سادة', 'بن سادة', 2, 'بن سادة', 0, '2015-08-03', 1, '2015-08-03 09:37:29', 1, 0, 3000),
(8, 'بن محوج', 'بن محوج', 2, 'بن محوج', 0, '2015-08-03', 1, '2015-08-03 09:37:51', 1, 0, 3000),
(9, 'قهوه اكيبريسو سايب', 'قهوه اكيبريسو سايب', 2, 'قهوه اكيبريسو سايب', 0, '2015-08-03', 1, '2015-08-03 09:38:16', 1, 0, 3000),
(10, 'نسكافيه سايب', 'نسكافيه سايب', 2, 'نسكافيه سايب', 0, '2015-08-03', 1, '2015-08-03 09:38:36', 1, 0, 3000),
(11, 'كاكاو نسكويك سايب', 'كاكاو نسكويك سايب', 2, 'كاكاو نسكويك سايب', 0, '2015-08-03', 1, '2015-08-03 09:38:59', 1, 0, 3000),
(12, 'قرفة سايب', 'قرفة سايب', 2, 'قرفة سايب', 0, '2015-08-03', 1, '2015-08-03 09:39:22', 1, 0, 3000),
(13, 'قرفة عيدان', 'قرفة عيدان', 2, 'قرفة عيدان', 0, '2015-08-03', 1, '2015-08-03 09:40:05', 1, 0, 3000),
(14, 'جنزبيل سايب', 'جنزبيل سايب', 2, 'جنزبيل سايب', 0, '2015-08-03', 1, '2015-08-03 09:40:33', 1, 0, 3000),
(15, 'سحلب سايب', 'سحلب سايب', 2, 'سحلب سايب', 0, '2015-08-03', 1, '2015-08-03 09:40:52', 1, 0, 3000),
(16, 'مكسرات زبيب', 'مكسرات زبيب', 2, 'مكسرات زبيب', 0, '2015-08-03', 1, '2015-08-03 09:41:16', 1, 0, 3000),
(17, 'مكسرات جوز هند', 'مكسرات جوز هند', 2, 'مكسرات جوز هند', 0, '2015-08-03', 1, '2015-08-03 09:41:41', 1, 0, 3000),
(18, 'مكسرات سوداني', 'مكسرات سوداني', 2, 'مكسرات سوداني', 0, '2015-08-03', 1, '2015-08-03 09:42:03', 1, 0, 3000),
(19, 'حمص سايب', 'حمص سايب', 2, 'حمص سايب', 0, '2015-08-03', 1, '2015-08-03 09:42:24', 1, 0, 3000),
(20, 'كانز - بيبسي-سفن-مير', 'كانز - بيبسي-سفن-ميرندا', 2, 'كانز - بيبسي-سفن-ميرندا', 0, '2015-08-03', 1, '2015-08-03 09:42:52', 3, 0, 50),
(21, 'جولد كانز', 'جولد كانز', 2, 'جولد كانز', 0, '2015-08-03', 1, '2015-08-03 09:43:19', 3, 0, 50),
(22, 'ريدبول', 'ريدبول', 2, 'ريدبول', 0, '2015-08-03', 1, '2015-08-03 09:43:36', 3, 0, 50),
(23, 'مياه معدنية ص', 'مياه معدنية ص', 2, 'مياه معدنية ص', 0, '2015-08-03', 1, '2015-08-03 09:44:00', 4, 0, 50),
(24, 'ليمون سايب', 'ليمون سايب', 2, 'ليمون سايب', 0, '2015-08-03', 1, '2015-08-03 09:44:20', 1, 0, 3000),
(25, 'برتقال سايب', 'برتقال سايب', 2, 'برتقال سايب', 0, '2015-08-03', 1, '2015-08-03 09:44:41', 1, 0, 3000),
(26, 'مانجو عصير', 'مانجو عصير', 2, 'مانجو عصير', 0, '2015-08-03', 1, '2015-08-03 09:45:15', 2, 0, 3000),
(27, 'جوافه سايب', 'جوافه سايب', 2, 'جوافه سايب', 0, '2015-08-03', 1, '2015-08-03 09:45:42', 1, 0, 3000),
(28, 'خوخ سايب', 'خوخ سايب', 2, 'خوخ سايب', 0, '2015-08-03', 1, '2015-08-03 09:46:09', 1, 0, 3000),
(29, 'كانتلوب سايب', 'كانتلوب سايب', 2, 'كانتلوب سايب', 0, '2015-08-03', 1, '2015-08-03 09:46:28', 1, 0, 3000),
(30, 'اويو باكيت', 'اويو باكيت', 2, 'اويو باكيت', 0, '2015-08-03', 1, '2015-08-03 09:47:33', 6, 0, 50),
(31, 'بلح سايب', 'بلح سايب', 2, 'بلح سايب', 0, '2015-08-03', 1, '2015-08-03 09:47:57', 1, 0, 3000),
(32, 'موز سايب -قطعة', 'موز سايب -قطعة', 2, 'موز سايب -قطعة', 0, '2015-08-03', 1, '2015-08-03 09:48:51', 5, 0, 50),
(33, 'كيوي سايب قطعة', 'كيوي سايب قطعة', 2, 'كيوي سايب قطعة', 0, '2015-08-03', 1, '2015-08-03 09:50:04', 5, 0, 50),
(34, 'زبادي علبة', 'زبادي علبة', 2, 'زبادي علبة', 0, '2015-08-03', 1, '2015-08-03 09:50:47', 5, 0, 50),
(35, 'سكر ابيض', 'سكر ابيض', 2, 'سكر ابيض', 0, '2015-08-03', 1, '2015-08-03 09:52:04', 1, 0, 5000),
(36, 'تفاح سايب ', 'تفاح سايب ', 2, 'تفاح سايب ', 0, '2015-08-03', 1, '2015-08-03 09:52:25', 1, 0, 3000),
(37, 'تفاح عصير', 'تفاح عصير', 2, 'تفاح عصير', 0, '2015-08-03', 1, '2015-08-03 09:52:54', 2, 0, 3000),
(38, 'حليب سايب', 'حليب سايب', 2, 'حليب سايب', 0, '2015-08-03', 1, '2015-08-03 09:53:48', 2, 0, 5000),
(39, 'عسل سايب', 'عسل سايب', 2, 'عسل سايب', 0, '2015-08-03', 1, '2015-08-03 09:54:19', 2, 0, 3000),
(40, 'معسل فواكه فاخر', 'معسل فواكه فاخر', 2, 'معسل فواكه فاخر', 0, '2015-08-03', 1, '2015-08-03 09:55:03', 1, 0, 3000),
(41, 'معسل فواكه عاده', 'معسل فواكه عاده', 2, 'معسل فواكه عاده', 0, '2015-08-03', 1, '2015-08-03 09:55:24', 1, 0, 3000),
(42, 'معسل عاده', 'معسل عاده', 2, 'معسل عاده', 0, '2015-08-03', 1, '2015-08-03 09:55:55', 1, 0, 3000),
(43, 'لاي طبي', 'لاي طبي', 2, 'لاي طبي', 0, '2015-08-03', 1, '2015-08-03 09:56:35', 5, 0, 50),
(44, 'اضافات (فليفور)', 'اضافات (فليفور)', 2, 'اضافات (فليفور)', 0, '2015-08-03', 1, '2015-08-03 09:57:35', 1, 0, 5000),
(45, 'فراولة عصير', 'فراولة عصير', 2, 'فراولة عصير', 0, '2015-08-03', 1, '2015-08-03 09:58:05', 2, 0, 3000),
(46, 'بطيخ سايب', 'بطيخ سايب', 2, 'بطيخ سايب', 0, '2015-08-03', 1, '2015-08-03 09:58:49', 1, 0, 3000),
(47, 'شربات عصير رمان-نعنا', 'شربات عصير رمان-نعناع', 2, 'شربات عصير رمان-نعناع', 0, '2015-08-03', 1, '2015-08-03 09:59:22', 2, 0, 3000),
(48, 'اضافات (فليفور)', 'اضافات (فليفور)', 4, 'اضافات (فليفور)', 2.5, '2015-08-03', 1, '2015-08-03 14:01:19', 7, 4, 0),
(49, 'معسل فواكه فاخر', 'معسل فواكه فاخر', 4, 'معسل فواكه فاخر', 13, '2015-08-03', 1, '2015-08-03 14:02:28', 7, 3, 0),
(50, 'معسل فواكه عاده', 'معسل فواكه عاده', 4, 'معسل فواكه عاده', 7, '2015-08-03', 1, '2015-08-03 14:03:55', 7, 3, 0),
(51, 'معسل عاده', 'معسل عاده', 4, 'معسل عاده', 2.5, '2015-08-03', 1, '2015-08-03 14:04:37', 7, 3, 0),
(52, 'لاي طبي', 'لاي طبي', 4, 'لاي طبي', 3, '2015-08-03', 1, '2015-08-03 14:05:50', 7, 4, 0),
(53, 'شاي فتلة', 'شاي فتلة', 4, 'شاي فتلة', 3.5, '2015-08-03', 1, '2015-08-03 14:07:06', 7, 2, 0),
(54, 'شاي اخضر', 'شاي اخضر', 4, 'شاي اخضر', 6.5, '2015-08-03', 1, '2015-08-03 14:10:29', 7, 2, 0),
(55, 'شاي فواكه', 'شاي فواكه', 4, 'شاي فواكه', 6.5, '2015-08-03', 1, '2015-08-03 14:12:14', 7, 2, 0),
(56, 'ينسون', 'ينسون', 4, 'ينسون', 6, '2015-08-03', 1, '2015-08-03 14:12:52', 7, 2, 0),
(57, 'كوب نعناع', 'كوب نعناع', 4, 'كوب نعناع', 6, '2015-08-03', 1, '2015-08-03 14:13:27', 7, 2, 0),
(58, 'كاركاديه', 'كاركاديه', 4, 'كاركاديه', 6, '2015-08-03', 1, '2015-08-03 14:14:38', 7, 2, 0),
(59, 'قهوة تركى عاده', 'قهوة تركى عاده', 4, 'قهوة تركى عاده', 7, '2015-08-03', 1, '2015-08-03 14:17:02', 7, 2, 0),
(60, 'قهوة تركى محوج', 'قهوة تركى محوج', 4, 'قهوة تركى محوج', 8, '2015-08-03', 1, '2015-08-03 14:18:08', 7, 2, 0),
(61, 'قهوة فرنساوي', 'قهوة فرنساوي', 4, 'قهوة فرنساوي', 8, '2015-08-03', 1, '2015-08-03 14:19:26', 7, 2, 0),
(62, 'قهوة اكسبريسو', 'قهوة اكسبريسو', 4, 'قهوة اكسبريسو', 10, '2015-08-03', 1, '2015-08-03 14:20:43', 7, 2, 0),
(63, 'اكسبريسو دبل', 'قهوة اكسبريسو دبل', 4, 'كوب قهوة اكسبريسو دبل', 13, '2015-08-03', 1, '2015-08-03 14:21:29', 7, 2, 0),
(64, 'كابيتشينو', 'كابيتشينو', 4, 'كابيتشينو', 15, '2015-08-03', 1, '2015-08-03 16:39:29', 7, 2, 0),
(65, 'لاتيه', 'لاتيه', 4, 'لاتيه', 15, '2015-08-03', 1, '2015-08-03 16:40:53', 7, 2, 0),
(66, 'كوب موكا', 'كوب موكا', 4, 'كوب موكا', 15, '2015-08-03', 1, '2015-08-03 16:43:11', 7, 2, 0),
(67, 'نسكافيه بالبن', 'نسكافيه بالبن', 4, 'نسكافيه بالبن', 10, '2015-08-03', 1, '2015-08-03 16:44:43', 7, 2, 0),
(68, 'نسكافيه سادة', 'نسكافيه سادة', 4, 'نسكافيه سادة', 7, '2015-08-03', 1, '2015-08-03 16:46:44', 7, 2, 0),
(69, 'هوت شوكليت', 'هوت شوكليت', 4, 'هوت شوكليت', 15, '2015-08-03', 1, '2015-08-03 16:48:03', 7, 2, 0),
(70, 'هوت سيدر', 'هوت سيدر', 4, 'هوت سيدر', 12, '2015-08-03', 1, '2015-08-03 16:49:10', 7, 2, 0),
(71, 'قرفة باللبن', 'قرفة باللبن', 4, 'قرفة باللبن', 10, '2015-08-03', 1, '2015-08-03 16:50:27', 7, 2, 0),
(72, 'قرفة سادة', 'قرفة سادة', 4, 'قرفة سادة', 7, '2015-08-03', 1, '2015-08-03 16:51:35', 7, 2, 0),
(73, 'جنزبيل سادة', 'جنزبيل سادة', 4, 'جنزبيل سادة', 7, '2015-08-03', 1, '2015-08-03 16:53:17', 7, 2, 0),
(74, 'جنزبيل بحليب', 'جنزبيل بحليب', 4, 'جنزبيل بحليب', 10, '2015-08-03', 1, '2015-08-03 16:57:54', 7, 2, 0),
(75, 'سحلب مكسرات', 'سحلب مكسرات', 4, 'سحلب مكسرات', 14, '2015-08-03', 1, '2015-08-03 17:00:11', 7, 2, 0),
(76, 'سحلب فواكه', 'سحلب فواكه', 4, 'سحلب فواكه', 14, '2015-08-03', 1, '2015-08-03 17:02:33', 7, 2, 0),
(77, 'حمص الشام', 'حمص الشام', 4, 'حمص الشام', 9, '2015-08-03', 1, '2015-08-03 17:03:21', 7, 2, 0),
(78, 'عصير ليمون فريش', 'عصير ليمون فريش', 4, 'عصير ليمون فريش', 8, '2015-08-03', 1, '2015-08-03 17:04:37', 7, 1, 0),
(79, 'ليمون نعناع فريش', 'عصير ليمون نعناع فريش', 4, 'عصير ليمون نعناع فريش', 8, '2015-08-03', 1, '2015-08-03 17:06:39', 7, 1, 0),
(80, 'برتقال فريش', 'عصير برتقال فريش', 4, 'عصير برتقال فريش', 10, '2015-08-03', 1, '2015-08-03 17:07:40', 7, 1, 0),
(81, 'مانجو فريش', 'مانجو فريش', 4, 'مانجو فريش', 12, '2015-08-03', 1, '2015-08-03 17:08:14', 7, 1, 0),
(82, 'فراولة فريش', 'فراولة فريش', 4, 'فراولة فريش', 12, '2015-08-03', 1, '2015-08-03 17:09:13', 7, 1, 0),
(83, 'جوافة فريش', 'جوافة فريش', 4, 'جوافة فريش', 10, '2015-08-03', 1, '2015-08-03 17:10:40', 7, 1, 0),
(84, 'بطيخ فريش', 'بطيخ فريش', 4, 'بطيخ فريش', 12, '2015-08-03', 1, '2015-08-03 17:11:46', 7, 1, 0),
(85, 'خوخ فريش', 'خوخ فريش', 4, 'خوخ فريش', 12, '2015-08-03', 1, '2015-08-03 17:12:28', 7, 1, 0),
(86, 'كانتلوب فريش', 'كانتلوب فريش', 4, 'كانتلوب فريش', 12, '2015-08-03', 1, '2015-08-03 17:13:23', 7, 1, 0),
(87, 'موكا كوكتيل', 'موكا كوكتيل', 4, 'موكا كوكتيل', 20, '2015-08-03', 1, '2015-08-03 17:14:45', 7, 1, 0),
(88, 'صن شاين', 'صن شاين', 4, 'صن شاين', 10, '2015-08-03', 1, '2015-08-03 17:15:38', 7, 1, 0),
(89, 'أوريو تشيك', 'أوريو تشيك', 4, 'أوريو تشيك', 15, '2015-08-03', 1, '2015-08-03 17:16:52', 7, 1, 0),
(90, 'بلح باللبن', 'بلح باللبن', 4, 'بلح باللبن', 15, '2015-08-03', 1, '2015-08-03 17:17:43', 7, 1, 0),
(91, 'موز باللبن', 'موز باللبن', 4, 'موز باللبن', 12, '2015-08-03', 1, '2015-08-03 17:18:51', 7, 1, 0),
(92, 'كيوي باللبن', 'كيوي باللبن', 4, 'كيوي باللبن', 15, '2015-08-03', 1, '2015-08-03 17:19:43', 7, 1, 0),
(93, 'زبادي بالعسل', 'زبادي بالعسل', 4, 'زبادي بالعسل', 12, '2015-08-03', 1, '2015-08-03 17:20:34', 7, 1, 0),
(94, 'زبادي فواكه', 'زبادي فواكه', 4, 'زبادي فواكه', 12, '2015-08-03', 1, '2015-08-03 17:22:02', 7, 1, 0),
(95, 'فروت سلات', 'فروت سلات', 4, 'فروت سلات', 17, '2015-08-03', 1, '2015-08-03 17:23:21', 7, 1, 0),
(96, 'بيبسي-ميرندا-سفن', 'كانز بيبسي-ميرندا-سفن', 4, 'كانز بيبسي-ميرندا-سفن', 5.5, '2015-08-03', 1, '2015-08-03 17:24:51', 7, 1, 0),
(97, 'كانز جولد', 'كانز جولد', 4, 'كانز جولد', 7, '2015-08-03', 1, '2015-08-03 17:25:53', 7, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `sub_inv`
--

CREATE TABLE IF NOT EXISTS `sub_inv` (
  `subinvid` int(11) NOT NULL AUTO_INCREMENT,
  `maininv_id` int(11) NOT NULL,
  `subinv_no` int(11) NOT NULL,
  `orderid` int(11) NOT NULL,
  `suborderid` int(11) NOT NULL,
  `cashierid` int(11) NOT NULL,
  `cust_profid` int(11) NOT NULL,
  `cust_userid` int(11) NOT NULL,
  `total` float NOT NULL,
  `tax` float NOT NULL,
  `service` float NOT NULL,
  `disc` float NOT NULL,
  `gtotal` float NOT NULL,
  `paidstatus` tinyint(4) NOT NULL,
  `dat` date NOT NULL,
  `time` time NOT NULL,
  `datetime` datetime NOT NULL,
  `subinvJson` longtext COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`subinvid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tablesorderbackup`
--

CREATE TABLE IF NOT EXISTS `tablesorderbackup` (
  `tblobj_ai_id` int(11) NOT NULL AUTO_INCREMENT,
  `tblarrobj_dat` date NOT NULL,
  `tblarrobj_time` time NOT NULL,
  `tblarrobj_dattime` datetime NOT NULL,
  `tblarrobj_json` longtext COLLATE utf8_unicode_ci NOT NULL,
  `tblarrobj_comment` text COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`tblobj_ai_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='storing tables json objects array' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `permission` int(11) NOT NULL,
  `Last_Login` datetime NOT NULL,
  `Registration_Date` date NOT NULL,
  `Expiration_Date` date NOT NULL,
  `userlogin_flag` tinyint(4) NOT NULL,
  `sessionDB_ID` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=8 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `ip`, `user_type`, `permission`, `Last_Login`, `Registration_Date`, `Expiration_Date`, `userlogin_flag`, `sessionDB_ID`, `password`) VALUES
(1, 'Admin', '197.135.127.203', 'superadmin', 0, '2015-08-03 16:34:03', '2014-08-29', '2016-10-31', 1, '4ujicem5l0v2ofvjcju5f1lqm5', '9d3cc7d3874249876e96b9b68865cb8b02c50b33'),
(2, 'guest', '', 'Guest', 100, '0000-00-00 00:00:00', '2014-08-29', '2016-01-28', 0, '', '35675e68f4b5af7b995d9205ad0fc43842f16450'),
(3, 'AhmedH', '41.235.139.29', 'Owner', 0, '2015-05-09 13:17:37', '2014-08-31', '2018-01-01', 0, '0', '01cfcd82fed809af5d5c341b0ad993b0f714056d'),
(4, 'MinaW', '::1', 'Owner', 0, '2015-01-20 18:40:27', '2014-10-26', '2018-01-01', 0, '0', 'd9b79dd44f330c5df5fe21548d77742d6d6808e0'),
(5, 'cashier1', '::1', 'Cashier', 1, '2015-01-18 20:23:30', '2015-01-18', '2017-03-18', 0, '0', 'e3c31d9022818d88b621c86f95ee89a8b604b9e6'),
(6, 'Osama', '::1', 'Owner', 0, '2015-01-20 19:16:46', '0000-00-00', '2018-01-01', 0, '0', 'c9a990a735c05417486381f88b416d4cb0d4c960'),
(7, 'Anas', '41.34.251.140', 'Implementer', 0, '2015-07-26 09:32:09', '2015-05-18', '2016-10-31', 0, '', 'bb22dc3c52b46b33150895f8545f9afb2ec1250b');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `acc_cash`
--
ALTER TABLE `acc_cash`
  ADD CONSTRAINT `acc_cash_ibfk_2` FOREIGN KEY (`acc_mov_id`) REFERENCES `acc_mov` (`acc_mov_id`),
  ADD CONSTRAINT `acc_cash_ibfk_3` FOREIGN KEY (`acc_mov_type`) REFERENCES `acc_mov_types` (`mov_typ_id`);

--
-- Constraints for table `acc_expenses`
--
ALTER TABLE `acc_expenses`
  ADD CONSTRAINT `acc_expenses_ibfk_1` FOREIGN KEY (`acc_mov_id`) REFERENCES `acc_mov` (`acc_mov_id`),
  ADD CONSTRAINT `acc_expenses_ibfk_3` FOREIGN KEY (`exp_code`) REFERENCES `expen_tree_names` (`exp_id`);

--
-- Constraints for table `acc_mov`
--
ALTER TABLE `acc_mov`
  ADD CONSTRAINT `acc_mov_ibfk_1` FOREIGN KEY (`mov_type`) REFERENCES `acc_types` (`mov_type_id`);

--
-- Constraints for table `acc_pes_balance_mov`
--
ALTER TABLE `acc_pes_balance_mov`
  ADD CONSTRAINT `acc_pes_balance_mov_ibfk_1` FOREIGN KEY (`profile_id`) REFERENCES `profile` (`profileid`),
  ADD CONSTRAINT `acc_pes_balance_mov_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `acc_pes_balance_mov_ibfk_3` FOREIGN KEY (`acc_mov_type`) REFERENCES `acc_mov_types` (`mov_typ_id`);

--
-- Constraints for table `acc_purch`
--
ALTER TABLE `acc_purch`
  ADD CONSTRAINT `acc_purch_ibfk_1` FOREIGN KEY (`acc_mov_id`) REFERENCES `acc_mov` (`acc_mov_id`),
  ADD CONSTRAINT `acc_purch_ibfk_3` FOREIGN KEY (`st_mov_id`) REFERENCES `st_item_mov` (`st_itm_mov_id`),
  ADD CONSTRAINT `acc_purch_ibfk_4` FOREIGN KEY (`purch_type`) REFERENCES `st_items_types` (`st_itm_id`);

--
-- Constraints for table `acc_sales`
--
ALTER TABLE `acc_sales`
  ADD CONSTRAINT `acc_sales_ibfk_1` FOREIGN KEY (`acc_mov_id`) REFERENCES `acc_mov` (`acc_mov_id`);

--
-- Constraints for table `acc_varincome`
--
ALTER TABLE `acc_varincome`
  ADD CONSTRAINT `acc_varincome_ibfk_1` FOREIGN KEY (`acc_mov_id`) REFERENCES `acc_mov` (`acc_mov_id`);

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`inv_cus_prof_id`) REFERENCES `profile` (`profileid`),
  ADD CONSTRAINT `invoices_ibfk_2` FOREIGN KEY (`inv_cus_user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `invoices_ibfk_3` FOREIGN KEY (`inv_cashier_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `invoices_items`
--
ALTER TABLE `invoices_items`
  ADD CONSTRAINT `invoices_items_ibfk_1` FOREIGN KEY (`inv_id`) REFERENCES `invoices` (`inv_id`),
  ADD CONSTRAINT `invoices_items_ibfk_2` FOREIGN KEY (`inv_itm_id`) REFERENCES `stock_items` (`itm_id`);

--
-- Constraints for table `items_ingradients`
--
ALTER TABLE `items_ingradients`
  ADD CONSTRAINT `items_ingradients_ibfk_1` FOREIGN KEY (`itm_id`) REFERENCES `stock_items` (`itm_id`),
  ADD CONSTRAINT `items_ingradients_ibfk_2` FOREIGN KEY (`itm_ingrad_id`) REFERENCES `stock_items` (`itm_id`),
  ADD CONSTRAINT `items_ingradients_ibfk_3` FOREIGN KEY (`itm_ingrad_qnty_unit`) REFERENCES `st_item_qnty_unit` (`st_itm_qnty_unit_id`),
  ADD CONSTRAINT `items_ingradients_ibfk_4` FOREIGN KEY (`itm_userid`) REFERENCES `users` (`id`);

--
-- Constraints for table `printed_inv_items`
--
ALTER TABLE `printed_inv_items`
  ADD CONSTRAINT `printed_inv_items_ibfk_1` FOREIGN KEY (`inv_id`) REFERENCES `printed_invoices` (`prnt_inv_id`),
  ADD CONSTRAINT `printed_inv_items_ibfk_2` FOREIGN KEY (`inv_itm_id`) REFERENCES `stock_items` (`itm_id`);

--
-- Constraints for table `printed_invoices`
--
ALTER TABLE `printed_invoices`
  ADD CONSTRAINT `printed_invoices_ibfk_1` FOREIGN KEY (`inv_cus_prof_id`) REFERENCES `profile` (`profileid`),
  ADD CONSTRAINT `printed_invoices_ibfk_2` FOREIGN KEY (`inv_cus_user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `printed_invoices_ibfk_3` FOREIGN KEY (`inv_cashier_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `profile`
--
ALTER TABLE `profile`
  ADD CONSTRAINT `profile_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `profile_ibfk_2` FOREIGN KEY (`type`) REFERENCES `profile_types` (`profile_type_id`);

--
-- Constraints for table `st_item_mov`
--
ALTER TABLE `st_item_mov`
  ADD CONSTRAINT `st_item_mov_ibfk_1` FOREIGN KEY (`st_itm_mov_typ`) REFERENCES `st_item_mov_types` (`st_itm_mov_typ_id`),
  ADD CONSTRAINT `st_item_mov_ibfk_2` FOREIGN KEY (`st_itm_mov_usrid`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `st_item_mov_ibfk_3` FOREIGN KEY (`st_itm_mov_cur_stid`) REFERENCES `st_names` (`st_id`),
  ADD CONSTRAINT `st_item_mov_ibfk_4` FOREIGN KEY (`st_itm_mov_qnty_unit`) REFERENCES `st_item_qnty_unit` (`st_itm_qnty_unit_id`),
  ADD CONSTRAINT `st_item_mov_ibfk_5` FOREIGN KEY (`st_itm_mov_to_st`) REFERENCES `st_names` (`st_id`),
  ADD CONSTRAINT `st_item_mov_ibfk_8` FOREIGN KEY (`st_itm_mov_itmid`) REFERENCES `stock_items` (`itm_id`);

--
-- Constraints for table `stock_items`
--
ALTER TABLE `stock_items`
  ADD CONSTRAINT `stock_items_ibfk_1` FOREIGN KEY (`itm_type`) REFERENCES `st_items_types` (`st_itm_id`),
  ADD CONSTRAINT `stock_items_ibfk_2` FOREIGN KEY (`itm_userid`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `stock_items_ibfk_3` FOREIGN KEY (`itm_qnty_unit`) REFERENCES `st_item_qnty_unit` (`st_itm_qnty_unit_id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
